import apiRequestHanderl from "./apiRequestHandler";
export const signUp = async (userData) => {
  const res = apiRequestHanderl("auth/signUp", "POST", userData);
  return res;
};

export const login = async (userData) => {
  const res = await apiRequestHanderl("auth/login", "POST", userData);
  return res;
};

export const logout = async (userId) => {
  const res = await apiRequestHanderl("auth/logout", "POST", userId);
  return res;
};




