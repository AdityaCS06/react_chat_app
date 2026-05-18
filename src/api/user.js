import api from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/chats";

export const getAllUsers = async (search = "", limit = 50, offset = 0) => {
  const params = new URLSearchParams({ limit, offset });
  if (search) params.append("search", search);

  const res = await api.get(`${BASE_URL}/all?${params.toString()}`);
  return res.data.users || [];
};