import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/users/me";

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getUserStats = async (token) => {
  const res = await axios.get(`${BASE_URL}/stats`, authHeader(token));
  return res.data;
};

export const getMessageTrends = async (token, days = 7) => {
  const res = await axios.get(`${BASE_URL}/stats/trends?days=${days}`, authHeader(token));
  return res.data;
};

export const getUnreadStats = async (token) => {
  const res = await axios.get(`${BASE_URL}/unread`, authHeader(token));
  return res.data;
};