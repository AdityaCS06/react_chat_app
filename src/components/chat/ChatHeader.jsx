// src/components/chat/ChatHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ChatHeader = ({ chat }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="md:hidden text-gray-500 hover:text-gray-700 transition"
        >
          &#8592;
        </button>
        <img
          src={chat.image || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
          alt={chat.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 truncate">{chat.name}</span>
          {chat.is_group && (
            <span className="text-sm text-gray-500 truncate">
              {chat.members?.length || 0} members
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
