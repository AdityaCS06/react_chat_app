import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null); // selected chat object

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <ChatSidebar onSelectChat={setActiveChat} activeChat={activeChat} />
      </div>

      {/* Chat window */}
      <div className="flex-1 bg-gray-50">
        {activeChat ? (
          <ChatWindow chat={activeChat} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
