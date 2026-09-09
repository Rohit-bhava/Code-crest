import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getContests, getContestById, createContest,
  updateContest, deleteContest, enrollContest,
} from '../../services/contestService';

export const fetchContests = createAsyncThunk('contests/fetchAll', async (_, { rejectWithValue }) => {
  try { return (await getContests()).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch contests'); }
});

export const fetchContestById = createAsyncThunk('contests/fetchOne', async (id, { rejectWithValue }) => {
  try { return (await getContestById(id)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Contest not found'); }
});

export const addContest = createAsyncThunk('contests/add', async (data, { rejectWithValue }) => {
  try { await createContest(data); return (await getContests()).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to create contest'); }
});

export const editContest = createAsyncThunk('contests/edit', async ({ id, data }, { rejectWithValue }) => {
  try { await updateContest(id, data); return (await getContests()).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to update contest'); }
});

export const removeContest = createAsyncThunk('contests/remove', async (id, { rejectWithValue }) => {
  try { await deleteContest(id); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to delete contest'); }
});

export const enrollInContest = createAsyncThunk('contests/enroll', async (id, { rejectWithValue }) => {
  try { await enrollContest(id); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to enroll'); }
});

const contestSlice = createSlice({
  name: 'contests',
  initialState: { list: [], selected: null, loading: false, error: null },
  reducers: {
    clearSelected(state) { state.selected = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, { payload }) => { state.loading = false; state.error = payload; };
    builder
      .addCase(fetchContests.pending, pending)
      .addCase(fetchContests.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(fetchContests.rejected, rejected)
      .addCase(fetchContestById.pending, pending)
      .addCase(fetchContestById.fulfilled, (state, { payload }) => { state.loading = false; state.selected = payload; })
      .addCase(fetchContestById.rejected, rejected)
      .addCase(addContest.pending, pending)
      .addCase(addContest.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(addContest.rejected, rejected)
      .addCase(editContest.pending, pending)
      .addCase(editContest.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(editContest.rejected, rejected)
      .addCase(removeContest.pending, pending)
      .addCase(removeContest.fulfilled, (state, { payload }) => { state.loading = false; state.list = state.list.filter(c => c.id !== payload); })
      .addCase(removeContest.rejected, rejected)
      .addCase(enrollInContest.pending, pending)
      .addCase(enrollInContest.fulfilled, (state) => { state.loading = false; })
      .addCase(enrollInContest.rejected, rejected);
  },
});

export const { clearSelected, clearError } = contestSlice.actions;
export default contestSlice.reducer;
