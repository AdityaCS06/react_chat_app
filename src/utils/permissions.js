const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export const isGroupAdmin = (chat, currentUserId) => {
  if (!chat?.is_group || !currentUserId) return false;
  const member = chat.members?.find((m) => m.user?.public_id === currentUserId);
  return member?.role === "admin";
};

export const hasProfilePhoto = (user) => {
  return !!user?.profile_photo && user.profile_photo !== DEFAULT_AVATAR;
};
