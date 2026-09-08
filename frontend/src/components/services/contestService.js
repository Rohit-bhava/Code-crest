import api from './api';

export const getContests = () => api.get('/contests');
export const createContest = (data) => api.post('/contests', data);
export const joinContest = (id) => api.post(`/contests/${id}/join`);
