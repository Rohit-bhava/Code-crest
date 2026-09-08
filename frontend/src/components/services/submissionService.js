import api from './api';

export const submitSolution = (data) => api.post('/submissions', data);
export const getMySubmissions = () => api.get('/submissions/my');
