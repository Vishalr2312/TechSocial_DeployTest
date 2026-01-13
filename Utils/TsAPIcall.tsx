import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import secureLocalStorage from "react-secure-storage";

const API_URL = "https://dev.techsocial.ai/api/web/index.php";
const VERSION = "v1";

interface AxiosCallConfig {
  ENDPOINT: string;
  METHOD: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  PAYLOAD?: any;
  CONFIG?: boolean;
}

export default async function axiosCall<T>({
  ENDPOINT,
  METHOD,
  PAYLOAD,
  CONFIG = false,
}: AxiosCallConfig): Promise<AxiosResponse<T>> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  // ✨ --- CORRECTED LOGIC --- ✨
  // Let axios set the Content-Type automatically for FormData.
  // Otherwise, default to application/json.
  if (!(PAYLOAD instanceof FormData)) {
    headers["Content-Type"] = "application/json;charset=UTF-8";
  }
  // --- END OF CORRECTION ---

  const options: AxiosRequestConfig = {
    method: METHOD,
    url: `${API_URL}/${VERSION}/${ENDPOINT}`,
    data: PAYLOAD,
    headers,
  };

  const token = secureLocalStorage.getItem("loginToken") || null;
  if (token !== null) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return axios<T>(options);
}
