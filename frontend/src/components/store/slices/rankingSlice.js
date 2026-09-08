import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLeaderboard, getContestRankings } from '../../services/rankingService';

export const fetchLeaderboard = createAsyncThunk('ranking/fetchLeaderboard', async (_, { rejectWithValue }) => {
  try { return (await getLeaderboard()).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch leaderboard'); }
});

export const fetchContestRankings = createAsyncThunk('ranking/fetchContest', async (id, { rejectWithValue }) => {
  try { return (await getContestRankings(id)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch rankings'); }
});

const rankingSlice = createSlice({
  name: 'ranking',
  initialState: { leaderboard: [], contestRankings: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => { state.loading = true; })
      .addCase(fetchLeaderboard.fulfilled, (state, { payload }) => { state.loading = false; state.leaderboard = payload; })
      .addCase(fetchLeaderboard.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchContestRankings.fulfilled, (state, { payload }) => { state.contestRankings = payload; });
  },
});

export default rankingSlice.reducer;
