import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import challengeReducer from './challengeSlice';
import contestReducer from './contestslice';
import rankingReducer from './rankingSlice';
import submissionReducer from './submissionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    challenges: challengeReducer,
    contests: contestReducer,
    ranking: rankingReducer,
    submissions: submissionReducer,
  },
});

export default store;
