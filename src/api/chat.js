// src/api/chat.js
import axios from "axios";

const BASE_URL = "https://chat-app-4ey4.onrender.com/chats"; // your backend base URL

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Create new chat
export const createChat = async (chatData, token) => {
  const response = await axios.post(`${BASE_URL}/create`, chatData, authHeader(token));
  return response.data;
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





// Get all users (with optional search)
// export const getAllUsers = async (token, search = "", limit = 50, offset = 0) => {
//   const params = new URLSearchParams();
//   if (search) params.append("search", search);
//   params.append("limit", limit);
//   params.append("offset", offset);

//   const response = await axios.get(`${BASE_URL}/all?${params.toString()}`, authHeader(token));
//   return response.data;
// };
