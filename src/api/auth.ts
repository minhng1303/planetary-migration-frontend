import apiClient from './axios';

interface LoginResponse {
  token: string;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', {
    username,
    password,
  });
  return response.data;
};