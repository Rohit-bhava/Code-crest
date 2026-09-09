import api from './api';

export const getMyProfile = () => api.get('/profiles/me');
export const updateProfile = (id, data) => api.put(`/profiles/${id}`, data);
