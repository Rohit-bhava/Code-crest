import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContests, createContest, joinContest } from '../../services/contestService';

export const fetchContests = createAsyncThunk('contests/fetchAll', async (_, { rejectWithValue }) => {
  try { return (await getContests()).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch contests'); }
});

export const addContest = createAsyncThunk('contests/add', async (data, { rejectWithValue }) => {
  try { return (await createContest(data)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to create contest'); }
});

export const joinContestAction = createAsyncThunk('contests/join', async (id, { rejectWithValue }) => {
  try { return (await joinContest(id)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to join contest'); }
});

const contestSlice = createSlice({
  name: 'contests',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContests.pending, (state) => { state.loading = true; })
      .addCase(fetchContests.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(fetchContests.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(addContest.fulfilled, (state, { payload }) => { state.list.push(payload); });
  },
});

export default contestSlice.reducer;
