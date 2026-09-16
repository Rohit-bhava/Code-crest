import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getChallenges, getChallengeById, createChallenge,
  updateChallenge, deleteChallenge, runCode, submitCode,
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

export const runSolution = createAsyncThunk('challenges/run', async ({ id, data }, { rejectWithValue }) => {
  try { return (await runCode(id, data)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Run failed'); }
});

export const submitSolution = createAsyncThunk('challenges/submit', async ({ id, data }, { rejectWithValue }) => {
  try { return (await submitCode(id, data)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Submission failed'); }
});

const challengeSlice = createSlice({
  name: 'challenges',
  initialState: {
    list: [], selected: null,
    runResult: null, submitResult: null,
    loading: false, running: false, submitting: false,
    error: null, totalPages: 0, currentPage: 0,
  },
  reducers: {
    clearSelected(state) { state.selected = null; },
    clearResults(state) { state.runResult = null; state.submitResult = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenges.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchChallenges.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list = payload?.content ?? payload ?? [];
        s.totalPages = payload?.totalPages ?? 0;
        s.currentPage = payload?.number ?? 0;
      })
      .addCase(fetchChallenges.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(fetchChallengeById.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchChallengeById.fulfilled, (s, { payload }) => { s.loading = false; s.selected = payload; })
      .addCase(fetchChallengeById.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(addChallenge.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(addChallenge.fulfilled, (s, { payload }) => { s.loading = false; s.list = payload?.content ?? payload ?? []; })
      .addCase(addChallenge.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(editChallenge.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(editChallenge.fulfilled, (s, { payload }) => { s.loading = false; s.list = payload?.content ?? payload ?? []; })
      .addCase(editChallenge.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(removeChallenge.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(removeChallenge.fulfilled, (s, { payload }) => { s.loading = false; s.list = s.list.filter(c => c.id !== payload); })
      .addCase(removeChallenge.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(runSolution.pending, (s) => { s.running = true; s.runResult = null; s.error = null; })
      .addCase(runSolution.fulfilled, (s, { payload }) => { s.running = false; s.runResult = payload; })
      .addCase(runSolution.rejected, (s, { payload }) => { s.running = false; s.error = payload; })

      .addCase(submitSolution.pending, (s) => { s.submitting = true; s.submitResult = null; s.error = null; })
      .addCase(submitSolution.fulfilled, (s, { payload }) => { s.submitting = false; s.submitResult = payload; })
      .addCase(submitSolution.rejected, (s, { payload }) => { s.submitting = false; s.error = payload; });
  },
});

export const { clearSelected, clearResults, clearError } = challengeSlice.actions;
export default challengeSlice.reducer;
