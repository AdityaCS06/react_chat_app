import api from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/chats";

export const getAllUsers = async (search = "", limit = 50, offset = 0, isGroup = undefined) => {
  const params = new URLSearchParams({ limit, offset });
  if (search) params.append("search", search);
  if (isGroup !== undefined) params.append("is_group", isGroup);

  const res = await api.get(`${BASE_URL}/all?${params.toString()}`);
  return res.data.users || [];
};