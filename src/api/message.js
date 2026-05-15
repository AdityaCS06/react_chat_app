// src/api/message.js
import axios from "axios";

// const BASE_URL = "http://localhost:8000/chats"; // same router as your chats
const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/chats";

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
    const payload = {
      chat_id: chatId,
      content,
      message_type: messageType,
    };

    const response = await axios.post(
      `${BASE_URL}/${chatId}/message`,
      payload,
      authHeader(token)
    );

    return response.data; // MessageResponse
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMessages = async (token, chatId, limit = 50, offset = 0) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${chatId}/messages`,
      {
        params: { limit, offset },
        ...authHeader(token),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateMessageStatus = async (
  token,
  chatId,
  messageId,
  status
) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/${chatId}/messages/${messageId}/status`,
      null,
      {
        params: { status },
        ...authHeader(token),
      }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteMessageForEveryone = async (token, chatId, messageId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/${chatId}/messages/${messageId}`,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteMessageForMe = async (token, chatId, messageId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${chatId}/messages/${messageId}/hide`,
      null,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};