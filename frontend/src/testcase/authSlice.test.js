import authReducer, { logout, loginUser, registerUser } from '../components/store/slices/authSlice';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('returns initial state', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('logout clears auth state', () => {
    const loggedInState = { ...initialState, token: 'abc', isAuthenticated: true, user: { username: 'test' } };
    const state = authReducer(loggedInState, logout());
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  test('loginUser.pending sets loading true', () => {
    const state = authReducer(initialState, { type: loginUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('loginUser.fulfilled sets token and isAuthenticated', () => {
    const payload = { token: 'jwt-token', user: { username: 'alice' } };
    const state = authReducer(initialState, { type: loginUser.fulfilled.type, payload });
    expect(state.loading).toBe(false);
    expect(state.token).toBe('jwt-token');
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ username: 'alice' });
  });

  test('loginUser.rejected sets error', () => {
    const state = authReducer(initialState, { type: loginUser.rejected.type, payload: 'Login failed' });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Login failed');
  });

  test('registerUser.pending sets loading true', () => {
    const state = authReducer(initialState, { type: registerUser.pending.type });
    expect(state.loading).toBe(true);
  });

  test('registerUser.fulfilled sets loading false', () => {
    const state = authReducer(initialState, { type: registerUser.fulfilled.type, payload: {} });
    expect(state.loading).toBe(false);
  });

  test('registerUser.rejected sets error', () => {
    const state = authReducer(initialState, { type: registerUser.rejected.type, payload: 'Registration failed' });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Registration failed');
  });
});
