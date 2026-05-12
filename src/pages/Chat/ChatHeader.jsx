import React from "react";

const ChatHeader = ({ chat, currentUser }) => {
  if (!chat) {
    return (
      <div className="px-4 py-3 border-b bg-white shadow-sm">
        <p className="text-gray-400">Select a chat</p>
      </div>
    );
  }

  const getDisplayName = () => {
    // GROUP CHAT
    if (chat.is_group) {
      return chat.name?.trim() || "Unnamed Group";
    }

    // DIRECT CHAT
    const others = chat.members?.filter(
      (m) => m.user.public_id !== currentUser.public_id
    );

    if (others?.length > 0) {
      const user = others[0].user;
      return user.username;
    }

    // If only 1 member (self)
    return "Direct Chat";
  };

  const displayName = getDisplayName();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm">

      <div className="flex items-center gap-3">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {displayName}
          </h3>

          <p className="text-xs text-gray-500">
            {chat.is_group ? "Group Chat" : "Direct Chat"}
          </p>
        </div>

      </div>

      <button aria-label="Chat menu" className="text-gray-500 hover:text-gray-700 transition text-xl">
        ⋮
      </button>

    </div>
  );
};

export default ChatHeader;
