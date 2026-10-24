import { D1Database } from "@cloudflare/workers-types";
import {
  type CreateApplicationPayload,
  type DbApplication,
  type ApplicationStatus,
} from "../types/application";

// Retrieve an application using its external application ID
export async function getApplicationByExternalId(
    db: D1Database,
    clientId: string,
    externalApplicationId: string
): Promise<DbApplication | null> {
  return db
      .prepare(`
        SELECT *
        FROM jkm_applications
        WHERE source_system = ?
          AND external_reference = ?
      `)
      .bind(clientId, externalApplicationId)
      .first<DbApplication>();
}

// Retrieve an application using its internal ID
export async function getApplicationById(
    db: D1Database,
    clientId: string,
    applicationId: string
): Promise<DbApplication | null> {
  return db
      .prepare(`
        SELECT *
        FROM jkm_applications
        WHERE source_system = ?
          AND id = ?
      `)
      .bind(clientId, applicationId)
      .first<DbApplication>();
}

// Retrieve an active JKM program by code
export async function getProgramByCode(
    db: D1Database,
    programCode: string
): Promise<{ id: string; code: string } | null> {
  return db
      .prepare(`
        SELECT id, code
        FROM jkm_programs
        WHERE code = ?
          AND is_active = 1
      `)
      .bind(programCode)
      .first<{ id: string; code: string }>();
}

// Create a new JKM application
export async function createApplication(
    db: D1Database,
    clientId: string,
    data: CreateApplicationPayload
): Promise<DbApplication> {
  const program = await getProgramByCode(db, data.programCode);

  if (!program) {
    throw new Error("JKM program not found");
  }

  const id = crypto.randomUUID();
  const year = new Date().getUTCFullYear();

  const referenceNo = `JKM-${data.programCode}-${year}-${crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 12)
      .toUpperCase()}`;

  const applicationData = JSON.stringify(data.applicationData ?? {});

  const historyId = crypto.randomUUID();

  await db.batch([
    db.prepare(`
      INSERT INTO jkm_applications (
        id,
        program_id,
        external_reference,
        source_system,
        reference_no,
        applicant_name,
        applicant_identification_no,
        application_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
        id,
        program.id,
        data.externalApplicationId,
        clientId,
        referenceNo,
        data.applicantName,
        data.applicantIdentificationNo ?? null,
        applicationData
    ),
    db.prepare(`
      INSERT INTO jkm_application_status_history (
        id,
        application_id,
        previous_status,
        new_status,
        changed_by,
        remarks
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
        historyId,
        id,
        null,
        "submitted",
        clientId,
        "Application submitted"
    ),
  ]);

  const application = await getApplicationById(db, clientId, id);

  if (!application) {
    throw new Error("Failed to retrieve the created application");
  }

  return application;
}

// Retrieve all submitted JKM applications for the admin dashboard
export async function getAllApplications(
    db: D1Database
): Promise<DbApplication[]> {
  const result = await db
      .prepare(`
        SELECT *
        FROM jkm_applications
        ORDER BY submitted_at DESC, id DESC
      `)
      .all<DbApplication>();

  return result.results;
}

// Retrieve an application by its internal ID (admin access)
export async function getAdminApplicationById(
    db: D1Database,
    applicationId: string
): Promise<DbApplication | null> {
  return db
      .prepare(`
        SELECT *
        FROM jkm_applications
        WHERE id = ?
      `)
      .bind(applicationId)
      .first<DbApplication>();
}

// Update an application's processing status
export async function updateApplicationStatus(
    db: D1Database,
    applicationId: string,
    status: ApplicationStatus
): Promise<DbApplication | null> {
  const application = await getAdminApplicationById(db, applicationId);

  if (!application) {
    return null;
  }

  if (application.status === status) {
    return application;
  }

  await db.batch([
    db.prepare(`
      UPDATE jkm_applications
      SET status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(status, applicationId),
    db.prepare(`
      INSERT INTO jkm_application_status_history (
        id,
        application_id,
        previous_status,
        new_status,
        changed_by,
        remarks
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
        crypto.randomUUID(),
        applicationId,
        application.status,
        status,
        "admin",
        null
    ),
  ]);

  return getAdminApplicationById(db, applicationId);
}
