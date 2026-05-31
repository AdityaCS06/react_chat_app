import api from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/chats";

export const sendMessage = async (chatId, content, messageType = "text", replyTo = null) => {
  try {
    const payload = {
      chat_id: chatId,
      content,
      message_type: messageType,
    };
    if (replyTo) payload.reply_to = replyTo;

    const response = await api.post(`${BASE_URL}/${chatId}/message`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMessages = async (chatId, limit = 50, offset = 0) => {
  try {
    const response = await api.get(`${BASE_URL}/${chatId}/messages`, {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateMessageStatus = async (chatId, messageId, status) => {
  try {
    const res = await api.post(
      `${BASE_URL}/${chatId}/messages/${messageId}/status`,
      null,
      { params: { status } }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteMessageForEveryone = async (chatId, messageId) => {
  try {
    const response = await api.delete(`${BASE_URL}/${chatId}/messages/${messageId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteMessageForMe = async (chatId, messageId) => {
  try {
    const response = await api.post(`${BASE_URL}/${chatId}/messages/${messageId}/hide`, null);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const editMessage = async (chatId, messageId, content) => {
  try {
    const response = await api.patch(`${BASE_URL}/${chatId}/messages/${messageId}`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};