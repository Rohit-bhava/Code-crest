import api from './api';

export const getAllSubmissions = (page = 0, size = 20) =>
  api.get('/submissions', { params: { page, size } });

export const getMySubmissions = () => api.get('/submissions/my');
