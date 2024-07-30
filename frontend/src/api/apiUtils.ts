import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Base URL for API
const API_BASE_URL = "http://127.0.0.1:8000/api";

// ### ChatGPT-Generated
const apiCall = async <T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  params?: any,
  headers?: any
): Promise<T> => {
  const config: AxiosRequestConfig = {
    url: `${API_BASE_URL}/${endpoint}`,
    method,
    data,
    params,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  // ###

  try {
    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiCall;
