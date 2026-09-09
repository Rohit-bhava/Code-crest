import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import challengeReducer from './slices/challengeSlice';
import contestReducer from './slices/contestSlice';
import rankingReducer from './slices/rankingSlice';
import submissionReducer from './slices/submissionSlice';

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
