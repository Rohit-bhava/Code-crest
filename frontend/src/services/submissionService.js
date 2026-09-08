import api from './api';

const submissionService = {
  submit: (data) => api.post('/submissions', data),
  getMySubmissions: () => api.get('/submissions/my'),
};

export default submissionService;
