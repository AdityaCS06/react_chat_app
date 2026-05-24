import api from "./axios";

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/auth";

export const registerUser = async (userData) => {
  try {
    const response = await api.post(`${AUTH_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { detail: "Network error" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post(`${AUTH_BASE_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { detail: "Network error" };
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get(`${AUTH_BASE_URL}/profile`);
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { detail: "Network error" };
  }
};

export const updateProfile = async (formData) => {
  try {
    const response = await api.patch(`/users/me`, formData);
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { detail: "Network error" };
  }
};

export const updateProfilePhoto = async (profilePhotoUrl) => {
  try {
    const response = await api.patch(`/users/me/photo-url`, { profile_photo_url: profilePhotoUrl });
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { detail: "Network error" };
  }
};

export const updateProfileName = async (fullName) => {
  try {
    const response = await api.patch(`/users/me/name`, { full_name: fullName });
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { detail: "Network error" };
  }
};