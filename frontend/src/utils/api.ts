import axios from 'axios';
import { EstheticsQuestion } from '../data/estheticsQuestionBank';
import { StudyState } from './studyProgress';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 6000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('esthetics-study-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  localOnly?: boolean;
}

export const authApi = {
  async register(name: string, email: string, password: string) {
    const { data } = await api.post<{ token: string; user: AuthUser }>('/api/auth/register', { name, email, password });
    return data;
  },
  async login(email: string, password: string) {
    const { data } = await api.post<{ token: string; user: AuthUser }>('/api/auth/login', { email, password });
    return data;
  },
  async me() {
    const { data } = await api.get<{ user: AuthUser }>('/api/auth/me');
    return data.user;
  },
};

export const questionApi = {
  async all() {
    const { data } = await api.get<{ questions: EstheticsQuestion[] }>('/api/questions');
    return data.questions;
  },
};

export const progressApi = {
  async saveProgress(progress: StudyState) {
    const { data } = await api.put('/api/progress', progress);
    return data;
  },
};

export default api;
