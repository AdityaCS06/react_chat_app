import React, { useState, useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ChatLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("activeChat_session");
    if (saved) {
      setActiveChat(JSON.parse(saved));
      sessionStorage.removeItem("activeChat_session");
    }
  }, []);

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

  const handleCloseChat = () => {
    setActiveChat(null);
  };

  const handleDeleteChat = () => {
    console.log("Delete chat -", activeChat?.cuid);
  };

  const handleExitGroup = () => {
    console.log("Exit group -", activeChat?.cuid);
  };

  const handleAddMember = () => {
    console.log("Add member -", activeChat?.cuid);
  };

  const handleRemoveMember = () => {
    console.log("Remove member -", activeChat?.cuid);
  };

  const handleLogout = () => {
    console.log("Logout");
  };

  return (
    <div className="flex h-screen bg-gray-200 overflow-hidden">
      <div
        className={`fixed inset-y-0 left-0 z-20 w-80 bg-white border-r border-gray-300 shadow-md transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ChatSidebar onSelectChat={handleSelectChat} activeChat={activeChat} />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="lg:hidden p-2 bg-gray-100 border-b flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 font-bold"
          >
            ☰ Chats
          </button>
        </div>

        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            onCloseChat={handleCloseChat}
            onDeleteChat={handleDeleteChat}
            onExitGroup={handleExitGroup}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onLogout={handleLogout}
          />
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
