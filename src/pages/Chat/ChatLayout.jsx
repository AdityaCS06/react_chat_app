import React, { useState, useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed

const ChatLayout = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Restore chat only on page refresh
  useEffect(() => {
    const saved = sessionStorage.getItem("activeChat_session");
    if (saved) {
      setActiveChat(JSON.parse(saved));
      sessionStorage.removeItem("activeChat_session"); // remove after restore
    }
  }, []);

  // Save chat before page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activeChat) {
        sessionStorage.setItem("activeChat_session", JSON.stringify(activeChat));
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [activeChat]);

  // Clear active chat on logout
  useEffect(() => {
    if (!user) {
      setActiveChat(null);
      sessionStorage.removeItem("activeChat_session");
    }
  }, [user]);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-200 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-80 bg-white border-r border-gray-300 shadow-md transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ChatSidebar onSelectChat={handleSelectChat} activeChat={activeChat} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
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
