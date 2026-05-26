import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Users, Calendar, Shield, User, Crown } from "lucide-react";
import { getChatDetails } from "../../api/chat";
import { useAuth } from "../../context/AuthContext";

const ChatInfoModal = ({ chatId, isOpen, onClose }) => {
  const { user: currentUser } = useAuth();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !chatId) return;
    setLoading(true);
    getChatDetails(chatId)
      .then(setChat)
      .catch(() => setChat(null))
      .finally(() => setLoading(false));
  }, [chatId, isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getRoleBadge = (member) => {
    if (member.role === "owner") {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
          <Crown size={12} />
          Owner
        </span>
      );
    }
    if (member.role === "admin") {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
          <Shield size={12} />
          Admin
        </span>
      );
    }
    return null;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "from-violet-500 to-purple-600",
      "from-blue-500 to-cyan-500",
      "from-pink-500 to-rose-500",
      "from-emerald-500 to-teal-500",
      "from-orange-500 to-amber-500",
      "from-indigo-500 to-blue-500",
    ];
    if (!name) return colors[0];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto animate-slide-in">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-slate-200/40 dark:border-gray-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Chat Info</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-gray-700 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  <div className="h-3 w-20 bg-slate-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : chat ? (
          <div className="p-6">
            <div className="flex flex-col items-center mb-8">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${getAvatarColor(chat.name || "G")} flex items-center justify-center shadow-lg mb-4`}>
                <span className="text-2xl font-bold text-white">
                  {getInitials(chat.name || (chat.is_group ? "G" : "U"))}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white text-center">
                {chat.name || (chat.is_group ? "Group" : "Chat")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {chat.is_group ? "Group Chat" : "Direct Message"}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Created</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatDate(chat.created_at)}</p>
                </div>
              </div>

              {chat.created_by && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <Crown size={18} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Created by</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {chat.created_by.username || chat.created_by.full_name || "Unknown"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-slate-400" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {chat.members?.length || 0} {chat.is_group ? "members" : "participants"}
              </h4>
            </div>

            <div className="space-y-1">
              {chat.members?.map((member) => {
                const mu = member.user;
                const isMe = mu?.public_id === currentUser?.public_id;
                const roleBadge = getRoleBadge(member);
                return (
                  <div
                    key={mu?.public_id}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-all"
                  >
                    {mu?.profile_photo ? (
                      <img
                        src={mu.profile_photo}
                        alt=""
                        className="w-11 h-11 rounded-2xl object-cover shadow-sm"
                      />
                    ) : (
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${getAvatarColor(mu?.username || mu?.full_name)} flex items-center justify-center shadow-sm flex-shrink-0`}>
                        <span className="text-sm font-bold text-white">
                          {getInitials(mu?.username || mu?.full_name)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {mu?.full_name || mu?.username || "Unknown"}
                        </p>
                        {roleBadge}
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {mu?.username}
                        {isMe && (
                          <span className="ml-1.5 text-blue-500 dark:text-blue-400 font-medium">(you)</span>
                        )}
                      </p>
                    </div>
                    {!chat.is_group && (
                      <div className="w-2 h-2 rounded-full bg-emerald-400" title="Active now" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500 p-6">
            <p className="font-medium">Failed to load chat info</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out forwards;
        }
      `}</style>
    </>,
    document.body
  );
};

export default ChatInfoModal;
