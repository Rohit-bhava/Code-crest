import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { submitSolution, getMySubmissions } from '../../services/submissionService';

export const submitCode = createAsyncThunk('submissions/submit', async (data, { rejectWithValue }) => {
  try { return (await submitSolution(data)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Submission failed'); }
});

export const fetchMySubmissions = createAsyncThunk('submissions/fetchMy', async (_, { rejectWithValue }) => {
  try { return (await getMySubmissions()).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch submissions'); }
});

const submissionSlice = createSlice({
  name: 'submissions',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitCode.pending, (state) => { state.loading = true; })
      .addCase(submitCode.fulfilled, (state, { payload }) => { state.loading = false; state.list.unshift(payload); })
      .addCase(submitCode.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchMySubmissions.fulfilled, (state, { payload }) => { state.list = payload; });
  },
});

export default submissionSlice.reducer;
