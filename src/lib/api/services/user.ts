import { userApi } from "@/lib/api/axios/api";
import {
  User,
  UserCreateParams,
  UserUpdateParams,
  UserSearchParams,
  PaginatedResponse,
} from "@/lib/api/types";

export const createUser = async (userData: UserCreateParams): Promise<User> => {
  console.log("Creating user with data:", userData);
  const response = await userApi.post("/private/user", userData);
  return response.data;
};

export const getUser = async (): Promise<User> => {
  const response = await userApi.get("/private/user");
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await userApi.get(`/public/user/${id}`);
  return response.data;
};

export const updateUser = async (userData: UserUpdateParams): Promise<User> => {
  const response = await userApi.put("/private/user", userData);
  return response.data;
};

export const deleteUser = async (): Promise<void> => {
  await userApi.delete("/private/user");
};

export const searchUsers = async (
  params: UserSearchParams
): Promise<PaginatedResponse<User>> => {
  const response = await userApi.get("/public/user/search", { params });
  return response.data;
};

export const listUsers = async (
  page: number = 1,
  limit: number = 10,
  fields?: string
): Promise<PaginatedResponse<User>> => {
  const response = await userApi.get("/public/user", {
    params: { page, limit, fields }
  });
  return response.data;
};
