import apiRequestHanderl from "./apiRequestHandler";

export const getCurrentUser = async () => {
  const res = await apiRequestHanderl("auth/currentUser", "GET");
  return res;
};

export const getAllUsers = async () => {
  const res = await apiRequestHanderl("auth/allUsers", "GET");
  return res;
};
