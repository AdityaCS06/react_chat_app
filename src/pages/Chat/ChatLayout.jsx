import React, { useState, useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { getChatDetails } from "../../api/chat";

const ChatLayout = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [activeChat, setActiveChat] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("activeChat_session");
    if (saved) {
      setActiveChat(JSON.parse(saved));
      sessionStorage.removeItem("activeChat_session");
    }
  }, []);

  useEffect(() => {
    if (chatId && token) {
      setLoadingChat(true);
      getChatDetails(chatId, token)
        .then((chatData) => {
          setActiveChat(chatData);
        })
        .catch((err) => {
          console.error("Failed to fetch chat:", err);
          navigate("/chats");
        })
        .finally(() => setLoadingChat(false));
    }
  }, [chatId, token]);

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
    <div className="flex h-screen overflow-hidden">
      <div
        className={`fixed inset-y-0 left-0 z-20 w-80 shadow-[4px_0_24px_rgba(0,0,0,0.08)] transform transition-all duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ChatSidebar onSelectChat={handleSelectChat} activeChat={activeChat} />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-0">
        <div className="lg:hidden p-3 bg-white/80 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-medium">Chats</span>
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
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 p-8">
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-xl">
                <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Start a Conversation</h2>
            <p className="text-slate-500 text-center max-w-sm">Select a chat from the sidebar or create a new conversation to begin messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
