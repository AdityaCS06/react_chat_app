import axios from "axios";

const AUTH_BASE_URL = "https://chat-app-4ey4.onrender.com/auth";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { detail: "Network error" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/login`, credentials);
    return response.data;  // { access_token, refresh_token, token_type, user }
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { detail: "Network error" };
  }
};

export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${AUTH_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { detail: "Network error" };
  }
};
