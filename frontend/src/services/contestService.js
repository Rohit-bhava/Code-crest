import api from './api';

export const getContests = () => api.get('/contests');
export const getContestById = (id) => api.get(`/contests/${id}`);
export const createContest = (data) => api.post('/contests', data);
export const updateContest = (id, data) => api.put(`/contests/${id}`, data);
export const deleteContest = (id) => api.delete(`/contests/${id}`);
export const enrollContest = (id) => api.post(`/contests/${id}/enroll`);
