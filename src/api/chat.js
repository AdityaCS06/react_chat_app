// src/api/chat.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/chats";

// Helper to include auth headers
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// --------------------
// CHAT ENDPOINTS
// --------------------

// Get all chats of current user
export const getMyChats = async (token, limit = 50, offset = 0) => {
  const response = await axios.get(`${BASE_URL}/my?limit=${limit}&offset=${offset}`, authHeader(token));
  return response.data;
};

// Get chat details by chatId
export const getChatDetails = async (chatId, token) => {
  const response = await axios.get(`${BASE_URL}/${chatId}`, authHeader(token));
  return response.data;
};

// Create new chat (1:1 or group)
export const createChat = async (data, token) => {
  const response = await axios.post(`${BASE_URL}/create`, data, authHeader(token));
  return response.data;
};

// --------------------
// MESSAGE ENDPOINTS
// --------------------

// Get messages of a chat
export const getMessages = async (chatId, token, limit = 50, offset = 0) => {
  const response = await axios.get(
    `${BASE_URL}/${chatId}/messages?limit=${limit}&offset=${offset}`,
    authHeader(token)
  );
  return response.data.messages; // assuming API returns { messages: [...] }
};

// Send a message
export const sendMessage = async (chatId, messageData, token) => {
  const response = await axios.post(
    `${BASE_URL}/${chatId}/message`,
    messageData,
    authHeader(token)
  );
  return response.data;
};

// Update message status (sent | delivered | seen)
export const updateMessageStatus = async (chatId, messageId, status, token) => {
  const response = await axios.post(
    `${BASE_URL}/${chatId}/messages/${messageId}/status`,
    { status },
    authHeader(token)
  );
  return response.data;
};

// --------------------
// GROUP MEMBER ENDPOINTS
// --------------------

// Add member to group chat
export const addMember = async (chatId, userId, token) => {
  const response = await axios.post(`${BASE_URL}/${chatId}/members/add?user_id=${userId}`, {}, authHeader(token));
  return response.data;
};

// Remove member from group chat
export const removeMember = async (chatId, userId, token) => {
  const response = await axios.post(`${BASE_URL}/${chatId}/members/remove?user_id=${userId}`, {}, authHeader(token));
  return response.data;
};

// Leave group chat
export const leaveGroup = async (chatId, token) => {
  const response = await axios.post(`${BASE_URL}/${chatId}/leave`, {}, authHeader(token));
  return response.data;
};
