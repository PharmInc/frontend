import axios from "axios";
import { applyInterceptors } from "./utils";

const BASE_URLS = {
  auth: process.env.NEXT_PUBLIC_API_AUTH!,
  user: process.env.NEXT_PUBLIC_API_USER!,
  network: process.env.NEXT_PUBLIC_API_NETWORK!,
  background: process.env.NEXT_PUBLIC_API_BACKGROUND!,
  institute: process.env.NEXT_PUBLIC_API_INSTITUTE!,
  job: process.env.NEXT_PUBLIC_API_JOB!,
  content: process.env.NEXT_PUBLIC_API_CONTENT!,
};

export const authApi = axios.create({ baseURL : BASE_URLS.auth });
export const contentApi = applyInterceptors(axios.create({ baseURL : BASE_URLS.content }));
export const userApi = applyInterceptors(axios.create({ baseURL : BASE_URLS.user }));
export const networkApi = applyInterceptors(axios.create({ baseURL : BASE_URLS.network }));
export const backgroundApi = applyInterceptors(axios.create({ baseURL : BASE_URLS.background }));
export const instituteApi = applyInterceptors(axios.create({ baseURL : BASE_URLS.institute }));
export const jobApi = applyInterceptors(axios.create({ baseURL : BASE_URLS.job }));
