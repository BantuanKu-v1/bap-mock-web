import { Hono } from "hono";
import { AppEnv } from "../types";
import { apiKeyAuth } from "../middleware/auth";
import { createApplicationSchema } from "../schemas/applicationSchema";
import {
  createApplication,
  getApplicationByExternalId,
  getApplicationById,
  getProgramByCode,
} from "../services/applicationService";

const applications = new Hono<AppEnv>();

// Authenticate all application routes
applications.use("*", apiKeyAuth);

// Submit an application
applications.post("/", async (c) => {
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json(
        {
          success: false,
          message: "Invalid JSON request body",
        },
        400
    );
  }

  const validation = createApplicationSchema.safeParse(body);

  if (!validation.success) {
    return c.json(
        {
          success: false,
          message: "Invalid application data",
          errors: validation.error.flatten(),
        },
        400
    );
  }

  const data = validation.data;
  const clientId = c.get("clientId");
  const db = c.env.jkm_mock_db;

  try {
    // Check for an existing application
    const existing = await getApplicationByExternalId(
        db,
        clientId,
        data.externalApplicationId
    );

    if (existing) {
      // The same external ID must represent the same submission
      const program = await getProgramByCode(db, data.programCode);

      if (
          !program ||
          existing.program_id !== program.id ||
          existing.applicant_name !== data.applicantName ||
          existing.applicant_identification_no !== (data.applicantIdentificationNo ?? null) ||
          existing.application_data !== JSON.stringify(data.applicationData ?? {})
      ) {
        return c.json(
            {
              success: false,
              message: "External application ID is already in use",
            },
            409
        );
      }

      return c.json({
        success: true,
        message: "Application already exists",
        data: {
          id: existing.id,
          referenceNo: existing.reference_no,
          programCode: data.programCode,
          status: existing.status,
          submittedAt: existing.submitted_at,
        },
      });
    }

    // Verify that the program exists and is active
    const program = await getProgramByCode(db, data.programCode);

    if (!program) {
      return c.json(
          {
            success: false,
            message: "JKM program not found or inactive",
          },
          404
      );
    }

    const application = await createApplication(db, clientId, data);

    return c.json(
        {
          success: true,
          message: "Application submitted successfully",
          data: {
            id: application.id,
            referenceNo: application.reference_no,
            programCode: data.programCode,
            status: application.status,
            submittedAt: application.submitted_at,
          },
        },
        201
    );
  } catch (error) {
    console.error("Application submission failed:", error);

    return c.json(
        {
          success: false,
          message: "Failed to submit application",
        },
        500
    );
  }
});

// Retrieve an application's current status
applications.get("/:id/status", async (c) => {
  const applicationId = c.req.param("id");
  const clientId = c.get("clientId");

  try {
    const application = await getApplicationById(
        c.env.jkm_mock_db,
        clientId,
        applicationId
    );

    if (!application) {
      return c.json(
          {
            success: false,
            message: "Application not found",
          },
          404
      );
    }

    const program = await c.env.jkm_mock_db
        .prepare("SELECT code FROM jkm_programs WHERE id = ?")
        .bind(application.program_id)
        .first<{ code: string }>();

    return c.json({
      success: true,
      data: {
        id: application.id,
        referenceNo: application.reference_no,
        programCode: program?.code ?? null,
        status: application.status,
        updatedAt: application.updated_at,
      },
    });
  } catch (error) {
    console.error("Failed to retrieve application status:", error);

    return c.json(
        {
          success: false,
          message: "Failed to retrieve application status",
        },
        500
    );
  }
});

export default applications;
