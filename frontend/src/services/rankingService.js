import api from './api';

const rankingService = {
  getGlobal: () => api.get('/leaderboard'),
  getContestRankings: (id) => api.get(`/leaderboard/contest/${id}`),
};

export default rankingService;
