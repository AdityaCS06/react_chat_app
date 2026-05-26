import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MessageCircle, Users, User, LogOut } from "lucide-react";
import { getMyChats } from "../../api/chat";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";
import { hasProfilePhoto } from "../../utils/permissions";

const ChatSidebar = ({ onSelectChat, activeChat, refreshTrigger }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getMyChats();
        setChats(res?.chats || []);
      } catch {
        addToast("Failed to load chats", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getChatDisplayName = (chat) => {
    if (chat.is_group) return chat.name || "Unnamed Group";
    const other = chat.members.find((m) => m.user.public_id !== user.public_id);
    return other?.user?.username || "Unknown User";
  };

  const getAvatarInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getOtherUser = (chat) => {
    if (chat.is_group) return null;
    return chat.members?.find((m) => m.user.public_id !== user.public_id)?.user || null;
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
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const filteredChats = useMemo(
    () =>
      chats.filter((chat) =>
        getChatDisplayName(chat).toLowerCase().includes(search.toLowerCase())
      ),
    [chats, search]
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-5 border-b border-slate-200/50 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-white bg-clip-text text-transparent">
            Messages
          </h2>
          <button
            onClick={() => navigate("/create-chat")}
            className="relative px-4 py-2 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
          >
            <span className="flex items-center gap-1.5">
              <Plus size={16} />
              New Chat
            </span>
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search chats"
            className="w-full px-4 py-3 pl-11 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 rounded-2xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-none focus:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_rgba(255,255,255,0.9),0_0_0_3px_rgba(99,102,241,0.2)] outline-none transition-all duration-300"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  <div className="h-3 w-16 bg-slate-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <MessageCircle size={32} className="text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No conversations yet</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Start a new chat to begin messaging</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const chatName = getChatDisplayName(chat);
            const avatarColor = getAvatarColor(chatName);
            const isActive = activeChat?.cuid === chat.cuid;
            return (
              <div
                key={chat.cuid}
                onClick={() => onSelectChat(chat)}
                className={`group relative p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.04),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-none"
                    : "hover:bg-white/60 dark:hover:bg-gray-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`relative flex-shrink-0 ${isActive ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900" : ""} rounded-2xl`}>
                    {!chat.is_group && hasProfilePhoto(getOtherUser(chat)) ? (
                      <img src={getOtherUser(chat).profile_photo} alt="" className="w-12 h-12 rounded-2xl object-cover shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300" />
                    ) : (
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                        <span className="text-sm font-semibold text-white">
                          {getAvatarInitials(chatName)}
                        </span>
                      </div>
                    )}
                    {!chat.is_group && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-900 shadow-sm" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold truncate text-sm ${isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-200"}`}>
                        {chatName}
                      </h3>
                      {chat.last_message && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(chat.last_message.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {chat.is_group ? (
                        <Users size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                      ) : (
                        <User size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                      )}
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {chat.is_group
                          ? `${chat.members.length} members`
                          : "Direct message"}
                      </p>
                    </div>
                    {chat.last_message && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
                        {chat.last_message.content}
                      </p>
                    )}
                  </div>
                </div>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full" />
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="relative p-3 border-t border-slate-200/50 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center gap-3 hover:bg-white/60 dark:hover:bg-gray-800/60 p-1.5 -m-1.5 rounded-xl transition-all duration-300 cursor-pointer"
        >
          {hasProfilePhoto(user) ? (
            <img src={user.profile_photo} alt="" className="w-10 h-10 rounded-2xl object-cover shadow-md" />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0 text-left">
            <p className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate">{user?.username}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">My Account</p>
          </div>
        </button>

        {showDropdown && (
          <div className="absolute bottom-full left-2 right-2 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-gray-700 overflow-hidden z-50">
            <button
              onClick={() => { navigate("/profile"); setShowDropdown(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-all"
            >
              <User size={16} className="text-slate-400 dark:text-slate-500" />
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;