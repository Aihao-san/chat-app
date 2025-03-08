import axios from 'axios';

const API_URL = 'http://localhost:3000/api/chat';

export const sendMessage = async (message: string): Promise<string> => {
  try {
    const response = await axios.post<{ response: string }>(API_URL, {
      message,
    });
    return response.data.response;
  } catch (error) {
    console.error('Error sending message:', error);
    return 'Failed to get a response from the server.';
  }
};

export const getMessages = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(`${API_URL}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};
