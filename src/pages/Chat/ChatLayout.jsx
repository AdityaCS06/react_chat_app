import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <div className="w-[30%] min-w-[320px] bg-white border-r border-gray-300 shadow-sm">
        <ChatSidebar onSelectChat={setActiveChat} activeChat={activeChat} />
      </div>

      {/* Chat window */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {activeChat ? (
          <ChatWindow chat={activeChat} />
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500 text-lg">
            Select a chat to start messaging 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
