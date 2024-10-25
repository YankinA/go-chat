import { api } from "./base";

const getAllAfter = async (lastMessageId: string) => {
    try {
      const response = await api.get(`/api/messages?lastMessageId=${lastMessageId}`);
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
  
  export default { getAllAfter }