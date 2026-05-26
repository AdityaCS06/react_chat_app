export const isGroupAdmin = (chat, currentUserId) => {
  if (!chat?.is_group || !currentUserId) return false;
  const member = chat.members?.find((m) => m.user?.public_id === currentUserId);
  return member?.role === "admin" || member?.role === "owner";
};
