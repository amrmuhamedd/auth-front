import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../services/auth.api";

interface RegisterCredentials {
  email: string;
  name: string;
  password: string;
}

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.register(credentials);
      const { access_token } = response;
      // Only store access token in localStorage, refresh token is handled by cookies
      return { accessToken: access_token };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);





// Get initial state from localStorage - only access token is stored there
const accessToken = localStorage.getItem("accessToken");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken,
    isAuthenticated: !!accessToken,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("accessToken", accessToken);
      // No need to store refresh token, it's in cookies
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { setCredentials, setLoading, setError} =
  authSlice.actions;
export default authSlice.reducer;
