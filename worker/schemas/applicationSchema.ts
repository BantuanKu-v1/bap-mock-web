import { z } from "zod";

export const createApplicationSchema = z.object({
  externalApplicationId: z.string().trim().min(1).max(100),
  programCode: z.enum(["BWE", "BA", "BAT", "BPT"]),
  applicantName: z.string().trim().min(1).max(150),
  applicantIdentificationNo: z.string().trim().min(1).max(30).optional(),
  applicationData: z.record(z.string(), z.unknown()).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    "submitted",
    "under_review",
    "additional_information_required",
    "approved",
    "rejected",
    "cancelled",
  ]),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
