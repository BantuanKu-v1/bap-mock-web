const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

type AdminSession = {
  username: string;
};

// Authenticate JKM administrator
export async function login(
    username: string,
    password: string
): Promise<void> {
  const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      }
  );

  const result: ApiResponse<unknown> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to log in");
  }
}

// Verify administrator session
export async function checkSession(): Promise<string | null> {
  const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/auth/me`,
      {
        credentials: "include",
      }
  );

  if (response.status === 401) {
    return null;
  }

  const result: ApiResponse<AdminSession> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to verify session");
  }

  return result.data?.username || null;
}

// Log out JKM administrator
export async function logout(): Promise<void> {
  const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
  );

  const result: ApiResponse<unknown> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to log out");
  }
}
