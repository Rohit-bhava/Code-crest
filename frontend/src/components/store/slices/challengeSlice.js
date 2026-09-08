import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getChallenges, createChallenge, deleteChallenge } from '../../services/challengeService';

export const fetchChallenges = createAsyncThunk('challenges/fetchAll', async (_, { rejectWithValue }) => {
  try { return (await getChallenges()).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch challenges'); }
});

export const addChallenge = createAsyncThunk('challenges/add', async (data, { rejectWithValue }) => {
  try { return (await createChallenge(data)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to create challenge'); }
});

export const removeChallenge = createAsyncThunk('challenges/remove', async (id, { rejectWithValue }) => {
  try { await deleteChallenge(id); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to delete challenge'); }
});

const challengeSlice = createSlice({
  name: 'challenges',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenges.pending, (state) => { state.loading = true; })
      .addCase(fetchChallenges.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(fetchChallenges.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(addChallenge.fulfilled, (state, { payload }) => { state.list.push(payload); })
      .addCase(removeChallenge.fulfilled, (state, { payload }) => { state.list = state.list.filter(c => c.id !== payload); });
  },
});

export default challengeSlice.reducer;
