import type {
  Application,
  ApplicationDetails,
  ApplicationStatus,
} from "../types/applications";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result: ApiResponse<T> = await response.json();

  if (!response.ok || !result.success || result.data === undefined) {
    throw new ApiError(
        result.message || "API request failed",
        response.status
    );
  }

  return result.data;
}

// Retrieve all JKM applications
export async function getApplications(): Promise<Application[]> {
  return apiRequest<Application[]>("/api/v1/admin/applications");
}

// Retrieve an individual JKM application
export async function getApplicationDetails(
    applicationId: string
): Promise<ApplicationDetails> {
  return apiRequest<ApplicationDetails>(
      `/api/v1/admin/applications/${encodeURIComponent(applicationId)}`
  );
}

// Update JKM application status
export async function updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus
): Promise<Application> {
  return apiRequest<Application>(
      `/api/v1/admin/applications/${encodeURIComponent(applicationId)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
        }),
      }
  );
}
