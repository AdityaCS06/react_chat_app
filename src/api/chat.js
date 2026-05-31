import api from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/chats";

export const createChat = async (chatData) => {
  try {
    const response = await api.post(`${BASE_URL}/create`, chatData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyChats = async (limit = 50, offset = 0) => {
  const params = new URLSearchParams({ limit, offset });
  const response = await api.get(`${BASE_URL}/my?${params.toString()}`);
  return response.data;
};

export const getChatDetails = async (cuid) => {
  const response = await api.get(`${BASE_URL}/${cuid}`);
  return response.data;
};

export const updateChat = async (cuid, data) => {
  const response = await api.patch(`${BASE_URL}/${cuid}`, data);
  return response.data;
};

export const deleteChat = async (cuid) => {
  try {
    const response = await api.delete(`${BASE_URL}/${cuid}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const leaveGroup = async (cuid) => {
  try {
    const response = await api.post(`${BASE_URL}/${cuid}/leave`, {});
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addMembers = async (cuid, userIds) => {
  try {
    const response = await api.post(`${BASE_URL}/${cuid}/members/add`, { user_ids: userIds });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const removeMembers = async (cuid, userIds) => {
  try {
    const response = await api.post(`${BASE_URL}/${cuid}/members/remove`, { user_ids: userIds });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};