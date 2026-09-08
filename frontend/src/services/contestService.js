import api from './api';

const contestService = {
  getAll: () => api.get('/contests'),
  getById: (id) => api.get(`/contests/${id}`),
  create: (data) => api.post('/contests', data),
  delete: (id) => api.delete(`/contests/${id}`),
  join: (id) => api.post(`/contests/${id}/join`),
};

export default contestService;
