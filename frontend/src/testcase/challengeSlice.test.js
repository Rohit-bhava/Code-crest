import challengeReducer, { fetchChallenges, addChallenge, removeChallenge } from '../components/store/slices/challengeSlice';

const initialState = { list: [], loading: false, error: null };

const mockChallenge = { id: 1, title: 'Two Sum', difficulty: 'EASY', domain: 'Arrays' };

describe('challengeSlice', () => {
  test('returns initial state', () => {
    expect(challengeReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  test('fetchChallenges.pending sets loading true', () => {
    const state = challengeReducer(initialState, { type: fetchChallenges.pending.type });
    expect(state.loading).toBe(true);
  });

  test('fetchChallenges.fulfilled sets list', () => {
    const state = challengeReducer(initialState, { type: fetchChallenges.fulfilled.type, payload: [mockChallenge] });
    expect(state.loading).toBe(false);
    expect(state.list).toHaveLength(1);
    expect(state.list[0].title).toBe('Two Sum');
  });

  test('fetchChallenges.rejected sets error', () => {
    const state = challengeReducer(initialState, { type: fetchChallenges.rejected.type, payload: 'Failed to fetch challenges' });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch challenges');
  });

  test('addChallenge.fulfilled appends to list', () => {
    const state = challengeReducer(initialState, { type: addChallenge.fulfilled.type, payload: mockChallenge });
    expect(state.list).toHaveLength(1);
    expect(state.list[0]).toEqual(mockChallenge);
  });

  test('removeChallenge.fulfilled removes item by id', () => {
    const stateWithItem = { ...initialState, list: [mockChallenge] };
    const state = challengeReducer(stateWithItem, { type: removeChallenge.fulfilled.type, payload: 1 });
    expect(state.list).toHaveLength(0);
  });
});
