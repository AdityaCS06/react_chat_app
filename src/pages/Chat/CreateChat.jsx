// src/pages/Chat/CreateChat.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ui/ToastContainer";
import { createChat } from "../../api/chat";
import { getErrorMessage } from "../../api/utils";
import UserSearch from "../../components/chat/UserSearch";
import SelectedUserList from "../../components/chat/SelectedUserList";
import { ArrowLeft, MessageCircle, Users, CheckCircle2 } from "lucide-react";

const CreateChat = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [chatName, setChatName] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter((u) => (u.id || u.public_id) !== id));
  };

  const handleSelectUser = (user) => {
    if (isGroup || selectedUsers.length === 0) {
      const exists = selectedUsers.some((u) => u.public_id === user.public_id);
      if (exists) {
        addToast("User already selected", "warning");
        return;
      }
      setSelectedUsers([...selectedUsers, user]);
    } else {
      addToast("Only one user allowed in 1:1 chat", "warning");
    }
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) {
      addToast("Please select at least one user", "error");
      return;
    }

    if (isGroup && (!chatName || chatName.trim() === "")) {
      addToast("Please enter group name", "error");
      return;
    }

    const members = selectedUsers.map((u) => u.public_id);

    const payload = {
      name: isGroup ? chatName.trim() : null,
      is_group: isGroup,
      members,
    };

    try {
      setLoading(true);
      const res = await createChat(payload);
      addToast("Chat created successfully!", "success");
      navigate(`/chats/${res.cuid}`);
    } catch (err) {
      addToast(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-500/10 via-slate-100 to-purple-500/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="px-5 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-800 dark:text-white">New Chat</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-gray-900/30 border border-slate-200/60 dark:border-gray-700 overflow-hidden">
            <div className="px-5 pt-5 pb-4">
              <label className="text-sm font-bold text-slate-700 dark:text-gray-200">Chat Type</label>
            </div>
            <div className="grid grid-cols-2 gap-3 px-5 pb-5">
              <button
                onClick={() => {
                  setIsGroup(false);
                  setSelectedUsers([]);
                  setChatName("");
                }}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                  !isGroup
                    ? "border-blue-500 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 dark:from-blue-900/20 dark:to-indigo-900/10"
                    : "border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600 bg-slate-50/60 dark:bg-gray-700/60"
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center ${!isGroup ? "bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30" : "bg-slate-100 dark:bg-gray-600"}`}>
                  <MessageCircle size={22} className={!isGroup ? "text-white" : "text-slate-400 dark:text-gray-400"} />
                </div>
                <p className={`text-sm font-bold ${!isGroup ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-gray-300"}`}>Direct Chat</p>
                <p className="text-[10px] mt-0.5 text-slate-400 dark:text-gray-500">1:1 conversation</p>
                {!isGroup && (
                  <div className="absolute -top-2.5 -right-2.5">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
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
                    ? "border-indigo-500 bg-gradient-to-br from-indigo-50/80 to-purple-50/40 dark:from-indigo-900/20 dark:to-purple-900/10"
                    : "border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600 bg-slate-50/60 dark:bg-gray-700/60"
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center ${isGroup ? "bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30" : "bg-slate-100 dark:bg-gray-600"}`}>
                  <Users size={22} className={isGroup ? "text-white" : "text-slate-400 dark:text-gray-400"} />
                </div>
                <p className={`text-sm font-bold ${isGroup ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-gray-300"}`}>Group Chat</p>
                <p className="text-[10px] mt-0.5 text-slate-400 dark:text-gray-500">Multiple members</p>
                {isGroup && (
                  <div className="absolute -top-2.5 -right-2.5">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {isGroup && (
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-gray-900/30 border border-slate-200/60 dark:border-gray-700 p-5">
              <label className="text-sm font-bold text-slate-700 dark:text-gray-200 mb-2 block">Group Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter group name"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 shadow-inner focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] focus:border-indigo-300 outline-none transition-all duration-300"
                />
              </div>
              {isGroup && selectedUsers.length > 0 && !chatName.trim() && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Enter group name to enable create button</p>
              )}
            </div>
          )}

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-gray-900/30 border border-slate-200/60 dark:border-gray-700 overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <label className="text-sm font-bold text-slate-700 dark:text-gray-200">Select Participants</label>
            </div>
            <div className="px-5 pb-5">
              <UserSearch
                onSelectUser={handleSelectUser}
                selectedUsers={selectedUsers}
                isGroup={isGroup}
              />
              <SelectedUserList
                users={selectedUsers}
                onRemove={handleRemoveUser}
              />
            </div>
          </div>

          <button
            onClick={handleCreateChat}
            disabled={loading || selectedUsers.length === 0 || (isGroup && !chatName.trim())}
            className="w-full py-4 text-sm font-bold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl hover:shadow-xl hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </span>
            ) : isGroup && selectedUsers.length > 0 && !chatName.trim() ? (
              <span>Enter group name</span>
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
