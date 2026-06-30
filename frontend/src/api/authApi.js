import axiosInstance from './axiosInstance';

/**
 * POST /auth/login
 * Returns: { token: "..." }
 */
export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data;
};

/**
 * POST /auth/register
 * Creates an admin account only.
 */
export const register = async (name, email, password) => {
  const response = await axiosInstance.post('/auth/register', { name, email, password });
  return response.data;
};
