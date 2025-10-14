import React from "react";

const ChatHeader = ({ chatName, isGroup }) => {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{chatName}</h3>
        <p className="text-xs text-gray-500">
          {isGroup ? "Group chat" : "Direct message"}
        </p>
      </div>
      <button className="text-gray-500 hover:text-gray-700 transition text-xl">
        ⋮
      </button>
    </div>
  );
};

export default ChatHeader;
