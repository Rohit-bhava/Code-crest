import api from './api';

export const getChallenges = () => api.get('/challenges');
export const getChallengeById = (id) => api.get(`/challenges/${id}`);
export const createChallenge = (data) => api.post('/challenges', data);
export const updateChallenge = (id, data) => api.put(`/challenges/${id}`, data);
export const deleteChallenge = (id) => api.delete(`/challenges/${id}`);
export const submitChallenge = (id, data) => api.post(`/challenges/${id}/submit`, data);
