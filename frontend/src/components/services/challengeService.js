import api from './api';

export const getChallenges = () => api.get('/challenges');
export const createChallenge = (data) => api.post('/challenges', data);
export const deleteChallenge = (id) => api.delete(`/challenges/${id}`);
