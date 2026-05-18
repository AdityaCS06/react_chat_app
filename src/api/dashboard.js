import api from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/users/me";

export const getUserStats = async () => {
  const res = await api.get(`${BASE_URL}/stats`);
  return res.data;
};

export const getMessageTrends = async (days = 7) => {
  const res = await api.get(`${BASE_URL}/stats/trends?days=${days}`);
  return res.data;
};

export const getUnreadStats = async () => {
  const res = await api.get(`${BASE_URL}/unread`);
  return res.data;
};