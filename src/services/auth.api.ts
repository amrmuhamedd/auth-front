import api from "./api";
import { tokenService } from "./tokenService";

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

interface RegisterCredentials {
  email: string;
  name: string;
  password: string;
}

// Configure the API client to include credentials (cookies)
api.defaults.withCredentials = true;

export const authApi = {
 
  register: async (credentials: RegisterCredentials) => {
    const response = await api.post('/auth/register', credentials);
    // If register returns access token, set it
    if (response.data.access_token) {
      tokenService.setAccessToken(response.data.access_token);
    }
    return response.data;
  },
  
 
};
  