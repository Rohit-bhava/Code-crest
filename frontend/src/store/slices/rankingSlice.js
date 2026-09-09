import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getGlobalLeaderboard, getContestLeaderboard } from '../../services/rankingService';

export const fetchLeaderboard = createAsyncThunk('ranking/fetchGlobal', async (page = 0, { rejectWithValue }) => {
  try { return (await getGlobalLeaderboard(page)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch leaderboard'); }
});

export const fetchContestRankings = createAsyncThunk('ranking/fetchContest', async ({ contestId, page = 0 }, { rejectWithValue }) => {
  try { return (await getContestLeaderboard(contestId, page)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch rankings'); }
});

const rankingSlice = createSlice({
  name: 'ranking',
  initialState: {
    leaderboard: [],
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
  },
  reducers: { clearError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLeaderboard.fulfilled, (state, { payload }) => {
        state.loading = false;
        // Backend returns Spring Page object: { content, totalPages, number }
        state.leaderboard = payload.content || payload;
        state.totalPages = payload.totalPages || 1;
        state.currentPage = payload.number || 0;
      })
      .addCase(fetchLeaderboard.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchContestRankings.pending, (state) => { state.loading = true; })
      .addCase(fetchContestRankings.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.leaderboard = payload.content || payload;
        state.totalPages = payload.totalPages || 1;
        state.currentPage = payload.number || 0;
      })
      .addCase(fetchContestRankings.rejected, (state, { payload }) => { state.loading = false; state.error = payload; });
  },
});

export const { clearError } = rankingSlice.actions;
export default rankingSlice.reducer;
