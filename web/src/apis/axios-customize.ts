import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { Mutex } from "async-mutex";

const NO_RETRY_HEADER = "x-no-retry";
const mutex = new Mutex();

const BASE_URL = (import.meta.env.VITE_API_URL as string) || "REPLACE_ME_VITE_API_URL";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const handleRefreshToken = async () => {
  return await mutex.runExclusive(async () => {
    try {
      const urlRequest = BASE_URL + "/auth/refresh";
      const res = await axios.post(urlRequest, {}, { withCredentials: true });
      const isSuccess = res.status;

      return isSuccess;
    } catch (error) {
      console.error("Refresh token failed:", error);
      return false;
    }
  });
};

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers.Accept && config.headers["Content-Type"]) {
    config.headers.Accept = "application/json";
    config.headers["Content-Type"] = "application/json; charset=utf-8";
  }
  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/api/v1/auth/login" &&
      !originalRequest.headers[NO_RETRY_HEADER]
    ) {
      originalRequest.headers[NO_RETRY_HEADER] = "true";

      const result = await handleRefreshToken();

      if (result) {
        return instance.request(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
