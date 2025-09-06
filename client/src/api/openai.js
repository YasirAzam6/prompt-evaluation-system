
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function getChatResponse(message) {
  try {
    const response = await axios.post(`${API_URL}/api/chat`, {
      message,
    });

    return response.data.reply;

  } catch (error) {
    console.error("API error:", error.message);
    return "Sorry, something went wrong.";
  }
}
