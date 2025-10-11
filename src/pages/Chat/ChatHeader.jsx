import React from "react";

const ChatHeader = ({ chatName, isGroup }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{chatName}</h3>
        <p className="text-sm text-gray-500">
          {isGroup ? "Group chat" : "Direct message"}
        </p>
      </div>
      <button className="text-gray-500 hover:text-gray-700 transition">
        ⋮
      </button>
    </div>
  );
};

export default ChatHeader;
