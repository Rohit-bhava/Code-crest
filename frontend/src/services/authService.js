import api from './api';

const authService = {
  login: (data) => api.post('/auth/login', data),
  logout: () => { localStorage.removeItem('token'); },
  register: (data) => api.post('/auth/register', data),
};

export default authService;
