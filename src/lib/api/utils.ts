import { AuthResponse } from "./types";

const API_BASE_URLS = {
  auth: process.env.NEXT_PUBLIC_API_AUTH!,
  user: process.env.NEXT_PUBLIC_API_USER!,
  network: process.env.NEXT_PUBLIC_API_NETWORK!,
  background: process.env.NEXT_PUBLIC_API_BACKGROUND!,
  institute: process.env.NEXT_PUBLIC_API_INSTITUTE!,
  job: process.env.NEXT_PUBLIC_API_JOB!,
  content: process.env.NEXT_PUBLIC_API_CONTENT!,
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};

export const apiRequest = async <T>(
  service: keyof typeof API_BASE_URLS,
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, unknown>
): Promise<T> => {
  // Add query params if they exist
  let url = `${API_BASE_URLS[service]}${endpoint}`;
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    url += `?${queryParams.toString()}`;
  }

  // Add auth header if token exists
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (getAuthToken() !== null) {
    headers["Authorization"] = `Bearer ${getAuthToken()}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API request failed with status ${response.status}`
    );
  }

  // Handle cases where response might be empty (e.g., 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  const responseText = await response.text();

  // First try to parse as JSON
  try {
    const data = responseText ? JSON.parse(responseText) : {};
    if (!response.ok) {
      throw new Error(
        data.message || `API request failed with status ${response.status}`
      );
    }
    return data as T;
  } catch (error) {
    // If JSON parsing fails but we got a successful response
    if (response.ok) {
      // For successful plain text responses, return an object with the message
      return { message: responseText } as T;
    }
    // For error responses, throw the text as error
    throw new Error(responseText);
  }
};

export const handleLogin = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>("auth", "/public/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  setAuthToken(response.token);
  return response;
};

export const handleRegister = async (credentials: {
  email: string;
  password: string;
  type?: string;
}): Promise<void> => {
  await apiRequest<void>("auth", "/public/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};
