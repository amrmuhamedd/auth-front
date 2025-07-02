import api from "./api";

export const tokenService = {
  setAccessToken: (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
  },

  getAccessToken: () => localStorage.getItem("accessToken"),

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    // Refresh token is cleared via API call and server will clear the cookie
  },

  refreshTokens: async () => {
    try {
      const response = await api.get(`/auth/refresh-token`);

      const { access_token } = response.data;
      tokenService.setAccessToken(access_token);
      return access_token;
    } catch (error: any) {
      if (error.response?.status === 401) {
        tokenService.clearTokens();
        window.location.href = "/login";
      }
      throw error;
    }
  },
};
