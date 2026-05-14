// src/pages/Chat/CreateChat.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";
import { createChat } from "../../api/chat";
import UserSearch from "../../components/chat/UserSearch";
import SelectedUserList from "../../components/chat/SelectedUserList";
import { ArrowLeft, MessageCircle, Users, CheckCircle2 } from "lucide-react";

const CreateChat = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addToast } = useToast();

  const [chatName, setChatName] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectUser = (user) => {
    if (isGroup || selectedUsers.length === 0) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      addToast("Only one user allowed in 1:1 chat", "warning");
    }
  };

  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter((u) => (u.id || u.public_id) !== id));
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) {
      addToast("Please select at least one user", "error");
      return;
    }

    const members = selectedUsers.map((u) => u.public_id);

    const payload = {
      name: isGroup ? chatName : null,
      is_group: isGroup,
      members,
    };

    try {
      setLoading(true);
      const res = await createChat(payload, token);
      addToast("Chat created successfully!", "success");
      navigate(`/chats/${res.cuid}`);
    } catch {
      addToast("Failed to create chat", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-100 via-white to-indigo-50">
      <div className="px-6 py-5 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Create New Chat</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isGroup ? "Start a group conversation" : "Start a direct conversation"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200/50 p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Chat Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setIsGroup(false);
                  setSelectedUsers([]);
                  setChatName("");
                }}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                  !isGroup
                    ? "border-blue-500 bg-blue-50/50 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                }`}
              >
                <MessageCircle size={24} className={`mx-auto mb-2 ${!isGroup ? "text-blue-500" : "text-slate-400"}`} />
                <p className={`text-sm font-semibold ${!isGroup ? "text-blue-600" : "text-slate-600"}`}>Direct Chat</p>
                <p className="text-[10px] mt-0.5 text-slate-400">1:1 conversation</p>
                {!isGroup && (
                  <div className="absolute -top-2 -right-2">
                    <CheckCircle2 size={20} className="text-blue-500" />
                  </div>
                )}
              </button>

              <button
                onClick={() => {
                  setIsGroup(true);
                  setSelectedUsers([]);
                  setChatName("");
                }}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                  isGroup
                    ? "border-indigo-500 bg-indigo-50/50 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                }`}
              >
                <Users size={24} className={`mx-auto mb-2 ${isGroup ? "text-indigo-500" : "text-slate-400"}`} />
                <p className={`text-sm font-semibold ${isGroup ? "text-indigo-600" : "text-slate-600"}`}>Group Chat</p>
                <p className="text-[10px] mt-0.5 text-slate-400">Multiple members</p>
                {isGroup && (
                  <div className="absolute -top-2 -right-2">
                    <CheckCircle2 size={20} className="text-indigo-500" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {isGroup && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200/50 p-5">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Group Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter group name"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  className="w-full px-4 py-3 pl-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.03),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] focus:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),inset_-2px_-2px_6px_rgba(255,255,255,0.9),0_0_0_3px_rgba(99,102,241,0.2)] outline-none transition-all duration-300"
                />
              </div>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200/50 p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Select Participants</label>
            <UserSearch
              onSelectUser={handleSelectUser}
              selectedUsers={selectedUsers}
            />
            <SelectedUserList
              users={selectedUsers}
              onRemove={handleRemoveUser}
            />
          </div>

          <button
            onClick={handleCreateChat}
            disabled={loading || selectedUsers.length === 0}
            className="w-full py-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </span>
            ) : (
              `Create ${isGroup ? "Group" : "Chat"}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChat;
