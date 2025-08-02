import { authApi } from "@/lib/api/axios/api";
import { AuthParams, AuthResponse } from "@/lib/api/types";

export const login = async (credentials: AuthParams): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>("/public/login", credentials);
  return response.data;
};

export const register = async (credentials: AuthParams): Promise<number> => {
  const response = await authApi.post("/public/register", credentials);
  return response.status;
};
