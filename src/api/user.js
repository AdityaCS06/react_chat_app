// src/api/user.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/chats"; // ✅ Correct as per your backend

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ✅ Get all users (optional search)
export const getAllUsers = async (token, search = "", limit = 50, offset = 0) => {
  const params = new URLSearchParams({ limit, offset });
  if (search) params.append("search", search);

  const res = await axios.get(`${BASE_URL}/all?${params.toString()}`, authHeader(token));
  return res.data.users || []; // ✅ Extract only users list
};
