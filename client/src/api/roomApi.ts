import { Room } from "../store/types";
import { api } from "./base";

const getAll = async () => {
    try {
      const response = await api.get('/api/rooms')
     
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

  const create = async (room: Omit<Room, 'id'>) => {
    try {
      const response = await api.post('/api/room', JSON.stringify(room));
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
  
  export default { create, getAll }


