import axios from 'axios';

const API_URL = 'http://localhost:3000/api/chat';

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(API_URL, { message });
    return response.data.response;
  } catch (error) {
    console.error('Error sending message:', error);
    return 'Failed to get a response from the server.';
  }
};

export const getMessages = async () => {
  try {
    const response = await axios.get(`${API_URL}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};
