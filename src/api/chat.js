// src/api/chat.js
import axios from "axios";

// const BASE_URL = "http://localhost:8000/chats"; // your backend base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/chats";

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Create new chat
export const createChat = async (chatData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/create`, chatData, authHeader(token));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyChats = async (token, limit = 50, offset = 0) => {
  const params = new URLSearchParams({ limit, offset });
  const response = await axios.get(`${BASE_URL}/my?${params.toString()}`, authHeader(token));
  return response.data; // → { total: number, chats: [...] }
};

export const getChatDetails = async (cuid, token) => {
  const response = await axios.get(`${BASE_URL}/${cuid}`, authHeader(token));
  return response.data;
};

export const updateChat = async (cuid, data, token) => {
  const response = await axios.patch(`${BASE_URL}/${cuid}`, data, authHeader(token));
  return response.data;
};

export const deleteChat = async (cuid, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${cuid}`, authHeader(token));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const leaveGroup = async (cuid, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/${cuid}/leave`, {}, authHeader(token));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};





// Get all users (with optional search)
// export const getAllUsers = async (token, search = "", limit = 50, offset = 0) => {
//   const params = new URLSearchParams();
//   if (search) params.append("search", search);
//   params.append("limit", limit);
//   params.append("offset", offset);

//   const response = await axios.get(`${BASE_URL}/all?${params.toString()}`, authHeader(token));
//   return response.data;
// };
