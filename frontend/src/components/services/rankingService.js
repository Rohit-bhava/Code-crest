import api from './api';

export const getLeaderboard = () => api.get('/leaderboard');
export const getContestRankings = (contestId) => api.get(`/leaderboard/contest/${contestId}`);
