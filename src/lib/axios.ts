import axios from 'axios';
import { signIn } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: '/api/',
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      signIn();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
