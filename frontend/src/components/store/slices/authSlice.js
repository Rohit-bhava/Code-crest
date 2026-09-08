import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, register as registerApi } from '../../services/authService';

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginApi(data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (e) {
    const message = e.response?.data?.message || e.message || 'Login failed';
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerApi(data);
    return res.data;
  } catch (e) {
    const message = e.response?.data?.message || e.message || 'Registration failed';
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: null, 
    token: localStorage.getItem('token'), 
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false, 
    error: null 
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => { 
        state.loading = false; 
        state.token = payload.token; 
        state.user = payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
      .addCase(registerUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;