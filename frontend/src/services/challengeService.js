import api from './api';

const challengeService = {
  getChallenges: () => api.get('/challenges'),
  getById: (id) => api.get(`/challenges/${id}`),
  create: (data) => api.post('/challenges', data),
  update: (id, data) => api.put(`/challenges/${id}`, data),
  delete: (id) => api.delete(`/challenges/${id}`),
};

export default challengeService;
