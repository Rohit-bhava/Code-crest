import rankingReducer, { fetchLeaderboard, fetchContestRankings } from '../components/store/slices/rankingSlice';

const initialState = { leaderboard: [], contestRankings: [], loading: false, error: null };

const mockEntry = { userId: 1, username: 'alice', totalScore: 100, problemsSolved: 5 };

describe('rankingSlice', () => {
  test('returns initial state', () => {
    expect(rankingReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  test('fetchLeaderboard.pending sets loading true', () => {
    const state = rankingReducer(initialState, { type: fetchLeaderboard.pending.type });
    expect(state.loading).toBe(true);
  });

  test('fetchLeaderboard.fulfilled sets leaderboard', () => {
    const state = rankingReducer(initialState, { type: fetchLeaderboard.fulfilled.type, payload: [mockEntry] });
    expect(state.loading).toBe(false);
    expect(state.leaderboard).toHaveLength(1);
    expect(state.leaderboard[0].username).toBe('alice');
  });

  test('fetchLeaderboard.rejected sets error', () => {
    const state = rankingReducer(initialState, { type: fetchLeaderboard.rejected.type, payload: 'Failed to fetch leaderboard' });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch leaderboard');
  });

  test('fetchContestRankings.fulfilled sets contestRankings', () => {
    const state = rankingReducer(initialState, { type: fetchContestRankings.fulfilled.type, payload: [mockEntry] });
    expect(state.contestRankings).toHaveLength(1);
  });
});
