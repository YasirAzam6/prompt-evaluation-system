import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function getChatResponse(message) {
  const response = await axios.post(`${API_URL}/chat`, {
    prompt: message,
  });
  return response.data.response;
}
