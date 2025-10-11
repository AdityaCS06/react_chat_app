// src/api/message.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/chats"; // same router as your chats

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * Send a message in a chat
 * @param {string} token - JWT token
 * @param {string} chatId - Chat CUID/UUID
 * @param {string} content - Message content (text or file URL)
 * @param {string} messageType - Message type: 'text' | 'image' | 'file'
 */
export const sendMessage = async (token, chatId, content, messageType = "text") => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${chatId}/message`,
      { chat_id: chatId, content, message_type: messageType },
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error.response?.data || error;
  }
};
