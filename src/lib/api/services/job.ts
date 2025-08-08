import { jobApi } from "@/lib/api/axios/api";
import {
  Job,
  JobCreateParams,
  JobUpdateParams,
  JobSearchParams,
  PaginatedResponse,
} from "@/lib/api/types";

export const createJob = async (jobData: JobCreateParams): Promise<Job> => {
  const response = await jobApi.post("/private/job", jobData);
  return response.data;
};

export const updateJob = async (
  id: string,
  jobData: JobUpdateParams
): Promise<Job> => {
  const response = await jobApi.put(`/private/job/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id: string): Promise<void> => {
  await jobApi.delete(`/private/job/${id}`);
};

export const getJob = async (id: string): Promise<Job> => {
  const response = await jobApi.get(`/public/job/${id}`);
  return response.data;
};

export const searchJobs = async (
  params: JobSearchParams
): Promise<PaginatedResponse<Job>> => {
  const response = await jobApi.get("/public/job/search", { params });
  return response.data;
};

export const listJobs = async (
  page: number = 1,
  limit: number = 10,
  fields?: string,
  active?: boolean,
  institute_id?: string
): Promise<PaginatedResponse<Job>> => {
  const response = await jobApi.get("/public/job", {
    params: { page, limit, fields, active, institute_id },
  });
  return response.data;
};

export const getInstituteJobs = async (
  institute_id: string,
  page: number = 1,
  limit: number = 10,
  fields?: string,
  active?: boolean
): Promise<PaginatedResponse<Job>> => {
  const response = await jobApi.get(`/public/job/institute/${institute_id}`, {
    params: { page, limit, fields, active },
  });
  return response.data;
};
