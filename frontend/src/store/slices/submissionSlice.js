import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMySubmissions, getAllSubmissions } from '../../services/submissionService';

export const fetchMySubmissions = createAsyncThunk('submissions/fetchMy', async (_, { rejectWithValue }) => {
  try { return (await getMySubmissions()).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch submissions'); }
});

export const fetchAllSubmissions = createAsyncThunk('submissions/fetchAll', async (page = 0, { rejectWithValue }) => {
  try { return (await getAllSubmissions(page)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch submissions'); }
});

const submissionSlice = createSlice({
  name: 'submissions',
  initialState: { list: [], loading: false, error: null },
  reducers: { clearError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySubmissions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMySubmissions.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(fetchMySubmissions.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchAllSubmissions.pending, (state) => { state.loading = true; })
      .addCase(fetchAllSubmissions.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = payload.content || payload;
      })
      .addCase(fetchAllSubmissions.rejected, (state, { payload }) => { state.loading = false; state.error = payload; });
  },
});

export const { clearError } = submissionSlice.actions;
export default submissionSlice.reducer;
