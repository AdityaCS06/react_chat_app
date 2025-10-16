import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-200 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-80 bg-white border-r border-gray-300 shadow-md transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ChatSidebar
          onSelectChat={(chat) => {
            setActiveChat(chat);
            setSidebarOpen(false);
          }}
          activeChat={activeChat}
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Chat window */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Mobile toggle button */}
        <div className="lg:hidden p-2 bg-gray-100 border-b flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 font-bold"
          >
            ☰ Chats
          </button>
        </div>

        {activeChat ? (
          <ChatWindow chat={activeChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            Select a chat to start messaging 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
