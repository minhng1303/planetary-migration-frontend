import axios from 'axios';

interface LoginResponse {
  token: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
    username,
    password
  });
  return response.data;
};