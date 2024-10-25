import axios from 'axios';
import { User } from '../store/types';
import { api } from './base';

const create = async (user: Omit<User, 'id'>) => {
  try {
    const response = await api.post('/api/user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Ошибка от сервера:', error.response.data);
    } else {
      console.error('Ошибка сети:', error);
 
    }
    throw error;
  }
};

export default { create }