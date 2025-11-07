import { httpClient, setAuthToken as setToken } from "./http-client";
import { UserLogin, LoginResponse } from "@/types";

export const loginUser = async (loginData: UserLogin): Promise<LoginResponse> => {
  const response = await httpClient.post("/users/login", loginData);
  return response.data;
};

export { setAuthToken as setToken, getAuthToken, removeAuthToken } from "./http-client";
