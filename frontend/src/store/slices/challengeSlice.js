import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getChallenges, getChallengeById, createChallenge,
  updateChallenge, deleteChallenge, submitChallenge,
} from '../../services/challengeService';

export const fetchChallenges = createAsyncThunk('challenges/fetchAll', async (_, { rejectWithValue }) => {
  try { return (await getChallenges()).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch challenges'); }
});

export const fetchChallengeById = createAsyncThunk('challenges/fetchOne', async (id, { rejectWithValue }) => {
  try { return (await getChallengeById(id)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Challenge not found'); }
});

export const addChallenge = createAsyncThunk('challenges/add', async (data, { rejectWithValue }) => {
  try { await createChallenge(data); return (await getChallenges()).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to create challenge'); }
});

export const editChallenge = createAsyncThunk('challenges/edit', async ({ id, data }, { rejectWithValue }) => {
  try { await updateChallenge(id, data); return (await getChallenges()).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to update challenge'); }
});

export const removeChallenge = createAsyncThunk('challenges/remove', async (id, { rejectWithValue }) => {
  try { await deleteChallenge(id); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to delete challenge'); }
});

export const submitSolution = createAsyncThunk('challenges/submit', async ({ id, data }, { rejectWithValue }) => {
  try { return (await submitChallenge(id, data)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Submission failed'); }
});

const challengeSlice = createSlice({
  name: 'challenges',
  initialState: { list: [], selected: null, submissionResult: null, loading: false, error: null },
  reducers: {
    clearSelected(state) { state.selected = null; },
    clearSubmissionResult(state) { state.submissionResult = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, { payload }) => { state.loading = false; state.error = payload; };
    builder
      .addCase(fetchChallenges.pending, pending)
      .addCase(fetchChallenges.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload?.content ?? payload ?? []; state.totalPages = payload?.totalPages ?? 0; state.currentPage = payload?.number ?? 0; })
      .addCase(fetchChallenges.rejected, rejected)
      .addCase(fetchChallengeById.pending, pending)
      .addCase(fetchChallengeById.fulfilled, (state, { payload }) => { state.loading = false; state.selected = payload; })
      .addCase(fetchChallengeById.rejected, rejected)
      .addCase(addChallenge.pending, pending)
      .addCase(addChallenge.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload?.content ?? payload ?? []; state.totalPages = payload?.totalPages ?? 0; })
      .addCase(addChallenge.rejected, rejected)
      .addCase(editChallenge.pending, pending)
      .addCase(editChallenge.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload?.content ?? payload ?? []; state.totalPages = payload?.totalPages ?? 0; })
      .addCase(editChallenge.rejected, rejected)
      .addCase(removeChallenge.pending, pending)
      .addCase(removeChallenge.fulfilled, (state, { payload }) => { state.loading = false; state.list = state.list.filter(c => c.id !== payload); })
      .addCase(removeChallenge.rejected, rejected)
      .addCase(submitSolution.pending, pending)
      .addCase(submitSolution.fulfilled, (state, { payload }) => { state.loading = false; state.submissionResult = payload; })
      .addCase(submitSolution.rejected, rejected);
  },
});

export const { clearSelected, clearSubmissionResult, clearError } = challengeSlice.actions;
export default challengeSlice.reducer;
