import { instituteApi } from "@/lib/api/axios/api";
import {
  Institution,
  InstitutionCreateParams,
  InstitutionUpdateParams,
  InstitutionSearchParams,
  PaginatedResponse,
} from "@/lib/api/types";

export const createInstitution = async (
  institutionData: InstitutionCreateParams
): Promise<Institution> => {
  const response = await instituteApi.post("/private/institution", institutionData);
  return response.data;
};

export const getInstitution = async (): Promise<Institution> => {
  const response = await instituteApi.get("/private/institution");
  return response.data;
};

export const getInstitutionById = async (id: string): Promise<Institution> => {
  const response = await instituteApi.get(`/public/institution/${id}`);
  return response.data;
};

export const updateInstitution = async (
  institutionData: InstitutionUpdateParams
): Promise<Institution> => {
  const response = await instituteApi.put("/private/institution", institutionData);
  return response.data;
};

export const deleteInstitution = async (): Promise<void> => {
  await instituteApi.delete("/private/institution");
};

export const searchInstitutions = async (
  params: InstitutionSearchParams
): Promise<PaginatedResponse<Institution>> => {
  const response = await instituteApi.get("/public/institution/search", { params });
  return response.data;
};

export const listInstitutions = async (
  page: number = 1,
  limit: number = 10,
  fields?: string
): Promise<PaginatedResponse<Institution>> => {
  const response = await instituteApi.get("/public/institution", {
    params: { page, limit, fields }
  });
  return response.data;
};
