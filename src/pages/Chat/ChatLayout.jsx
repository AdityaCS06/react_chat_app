import React, { useState, useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import AddMemberModal from "../../components/chat/AddMemberModal";
import RemoveMemberModal from "../../components/chat/RemoveMemberModal";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { getChatDetails, deleteChat, leaveGroup } from "../../api/chat";
import { getErrorMessage } from "../../api/utils";
import { useToast } from "../../components/ui/ToastContainer";

const ChatLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { addToast } = useToast();
  const [activeChat, setActiveChat] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, loading: false });
  const [showAddMember, setShowAddMember] = useState(false);
  const [showRemoveMember, setShowRemoveMember] = useState(false);
  const [refreshSidebar, setRefreshSidebar] = useState(0);

  useEffect(() => {
    const saved = sessionStorage.getItem("activeChat_session");
    if (saved) {
      setActiveChat(JSON.parse(saved));
      sessionStorage.removeItem("activeChat_session");
    }
  }, []);

  useEffect(() => {
    if (chatId) {
      setLoadingChat(true);
      getChatDetails(chatId)
        .then((chatData) => {
          setActiveChat(chatData);
        })
        .catch((err) => {
          console.error("Failed to fetch chat:", err);
          navigate("/chats");
        })
        .finally(() => setLoadingChat(false));
    }
  }, [chatId, navigate]);

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
    setConfirmDialog({ open: true, type: "deleteChat", loading: false });
  };

  const handleExitGroup = () => {
    setConfirmDialog({ open: true, type: "exitGroup", loading: false });
  };

  const confirmAction = async () => {
    const type = confirmDialog.type;
    if (!activeChat?.cuid) return;

    setConfirmDialog((prev) => ({ ...prev, loading: true }));

    try {
      if (type === "deleteChat") {
        await deleteChat(activeChat.cuid);
        addToast("Chat deleted", "success");
      } else if (type === "exitGroup") {
        await leaveGroup(activeChat.cuid);
        addToast("Left the group", "success");
      }
      setConfirmDialog({ open: false, type: null, loading: false });
      setActiveChat(null);
      setRefreshSidebar((prev) => prev + 1);
      navigate("/chats");
    } catch (error) {
      setConfirmDialog({ open: false, type: null, loading: false });
      addToast(getErrorMessage(error), "error");
    }
  };

  const handleAddMember = () => {
    setShowAddMember(true);
  };

  const handleRemoveMember = () => {
    setShowRemoveMember(true);
  };

  const handleLogout = () => {
    console.log("Logout");
  };

  const handleGroupUpdated = (updatedChat) => {
    setActiveChat(updatedChat);
    setRefreshSidebar((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div
        className={`fixed inset-y-0 left-0 z-20 w-80 max-w-[85vw] shadow-[4px_0_24px_rgba(0,0,0,0.08)] dark:shadow-gray-900/30 transform transition-all duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ChatSidebar onSelectChat={handleSelectChat} activeChat={activeChat} refreshTrigger={refreshSidebar} />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-0">
        <div className="lg:hidden p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-gray-700 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors min-h-[44px]"
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
            onGroupUpdated={handleGroupUpdated}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center shadow-xl">
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
            <h2 className="text-2xl font-bold text-slate-700 dark:text-white mb-2">Start a Conversation</h2>
            <p className="text-slate-500 dark:text-gray-400 text-center max-w-[280px]">Select a chat from the sidebar or create a new conversation to begin messaging</p>
          </div>
        )}
      </div>

      <AddMemberModal
        chat={activeChat}
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        onGroupUpdated={handleGroupUpdated}
      />

      <RemoveMemberModal
        chat={activeChat}
        isOpen={showRemoveMember}
        onClose={() => setShowRemoveMember(false)}
        onGroupUpdated={handleGroupUpdated}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={confirmDialog.type === "exitGroup" ? "Exit group?" : "Delete chat?"}
        description={
          confirmDialog.type === "exitGroup"
            ? "You will be removed from this group. This action cannot be undone."
            : "This chat will be permanently deleted. This action cannot be undone."
        }
        confirmText={confirmDialog.type === "exitGroup" ? "Exit group" : "Delete"}
        cancelText="Cancel"
        onConfirm={confirmAction}
        confirmVariant="danger"
        loading={confirmDialog.loading}
      />
    </div>
  );
};

export default ChatLayout;
