export type ApplicationStatus =
    | "submitted"
    | "under_review"
    | "additional_information_required"
    | "approved"
    | "rejected"
    | "cancelled";

export type Application = {
  id: string;
  program_id: string;
  reference_no: string | null;
  external_reference: string;
  source_system: string;
  applicant_name: string;
  applicant_identification_no: string | null;
  application_data: string;
  status: ApplicationStatus;
  submitted_at: string;
  updated_at: string;
};

export type ApplicationDetails = Application;

export const allowedStatusTransitions: Record<
    ApplicationStatus,
    ApplicationStatus[]
> = {
  submitted: ["under_review", "cancelled"],
  under_review: [
    "additional_information_required",
    "approved",
    "rejected",
    "cancelled",
  ],
  additional_information_required: ["under_review", "cancelled"],
  approved: [],
  rejected: [],
  cancelled: [],
};

export const applicationStatusLabels: Record<
    ApplicationStatus,
    string
> = {
  submitted: "Submitted",
  under_review: "Under Review",
  additional_information_required: "Additional Information Required",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const programLabels: Record<string, string> = {
  "jkm-program-bwe": "BWE",
  "jkm-program-ba": "BA",
  "jkm-program-bat": "BAT",
  "jkm-program-bpt": "BPT",
};
