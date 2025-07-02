import api from "./api";
import { tokenService } from "./tokenService";

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

interface RegisterCredentials {
  email: string;
  name: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

// Configure the API client to include credentials (cookies)
api.defaults.withCredentials = true;

export const authApi = {
  login: async ({ email, password }: LoginCredentials) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token } = response.data;
    // Only set access token, refresh token is handled by cookie
    tokenService.setAccessToken(access_token);
    return response.data;
  },
  register: async (credentials: RegisterCredentials) => {
    const response = await api.post('/auth/register', credentials);
    // If register returns access token, set it
    if (response.data.access_token) {
      tokenService.setAccessToken(response.data.access_token);
    }
    return response.data;
  },
  logout: async () => {
    // No need to send refresh token as it's in the cookie
    const response = await api.post('/auth/logout', {});
    tokenService.clearTokens();
    return response.data;
  },
  getUserInfo: async () => {
    const response = await api.post('/auth/me');
    return response.data;
  }
};
  