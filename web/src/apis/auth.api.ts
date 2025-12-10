import type { AxiosRequestConfig } from "axios";
import instance from "./axios-customize";

export const authApi = {
  signin: async (data: {
    email: string;
    password: string;
  }): Promise<IApiResponse<IAuthResponse>> => {
    return await instance.post("/auth/signin", data, {
      skipAuthRefresh: true,
    } as AxiosRequestConfig);
  },

  signup: async (data: IAuthSignupRequest): Promise<IApiResponse<null>> => {
    return await instance.post("/auth/signup", data);
  },

  verifyAccount: async (data: {
    token: string;
  }): Promise<IApiResponse<IAuthResponse>> => {
    return await instance.post("/auth/verify-email", data);
  },

  me: async (): Promise<IApiResponse<IUserResponse>> => {
    return await instance.get("/auth/me");
  },

  logout: async (): Promise<IApiResponse<null>> => {
    return await instance.post("/auth/logout");
  },
};
