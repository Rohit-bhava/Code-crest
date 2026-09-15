import api from './api';

export const getMyProfile = () => api.get('/profiles/me');
export const updateMyProfile = (data) => api.put('/profiles/me', data);
// Keep for admin use
export const updateProfile = (id, data) => api.put(`/profiles/${id}`, data);
