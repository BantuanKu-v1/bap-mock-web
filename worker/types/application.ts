export type JkmApplicationStatus =
    | "submitted"
    | "under_review"
    | "additional_information_required"
    | "approved"
    | "rejected"
    | "cancelled";

// Application submission request from a third-party system
export interface CreateApplicationRequest {
  externalApplicationId: string;
  programCode: string;
  applicantName: string;
  applicantIdentificationNo?: string;
  applicationData?: Record<string, unknown>;
}

// API-facing application record
export interface JkmApplication {
  id: string;
  sourceSystem: string;
  externalApplicationId: string;
  referenceNo: string;
  programCode: string;
  applicantName: string;
  applicantIdentificationNo: string | null;
  applicationData: Record<string, unknown>;
  status: JkmApplicationStatus;
  submittedAt: string;
  updatedAt: string;
}

// Application submission response
export interface CreateApplicationResponse {
  id: string;
  referenceNo: string;
  programCode: string;
  status: JkmApplicationStatus;
  submittedAt: string;
}

// Application status response
export interface ApplicationStatusResponse {
  id: string;
  referenceNo: string;
  programCode: string;
  status: JkmApplicationStatus;
  updatedAt: string;
}

// Database application record (Cloudflare D1)
export interface DbApplication {
  id: string;
  program_id: string;
  external_reference: string;
  source_system: string;
  reference_no: string | null;
  applicant_name: string;
  applicant_identification_no: string | null;
  application_data: string;
  status: JkmApplicationStatus;
  submitted_at: string;
  updated_at: string;
}

// Application creation payload
export type CreateApplicationPayload = CreateApplicationRequest;

// Application creation result
export type CreateApplicationResult = DbApplication;

// Backward-compatible alias for existing service imports
export type ApplicationStatus = JkmApplicationStatus;
