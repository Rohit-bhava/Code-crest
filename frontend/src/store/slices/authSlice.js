import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, register as registerApi } from '../../services/authService';

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginApi(data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (e) {
    const msg = e.code === 'ERR_NETWORK'
      ? 'Cannot connect to server. Please ensure the backend is running.'
      : (e.response?.data?.message || e.message || 'Invalid username or password');
    return rejectWithValue(msg);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerApi(data);
    return res.data;
  } catch (e) {
    const msg = e.code === 'ERR_NETWORK'
      ? 'Cannot connect to server. Please ensure the backend is running.'
      : (e.response?.data?.message || e.message || 'Registration failed');
    return rejectWithValue(msg);
  }
});

// Restore user from localStorage on page reload
const storedUser = (() => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.user = payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(payload.user));
      })
      .addCase(loginUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
      .addCase(registerUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
