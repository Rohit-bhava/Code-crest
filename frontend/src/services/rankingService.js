import api from './api';

export const getGlobalLeaderboard = (page = 0, size = 20) =>
  api.get('/leaderboard/global', { params: { page, size } });

export const getContestLeaderboard = (contestId, page = 0, size = 20) =>
  api.get(`/leaderboard/contest/${contestId}`, { params: { page, size } });
