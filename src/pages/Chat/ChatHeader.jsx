import React, { useState } from "react";
import { Search, MoreVertical, Users } from "lucide-react";
import ChatOptionsMenu from "../../components/chat/ChatOptionsMenu";

const ChatHeader = ({ chat, currentUser, onCloseChat, onDeleteChat, onExitGroup, onAddMember, onRemoveMember, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  if (!chat) {
    return (
      <div className="px-6 py-4 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
        <p className="text-slate-400 font-medium">Select a conversation</p>
      </div>
    );
  }

  const getDisplayName = () => {
    if (chat.is_group) {
      return chat.name?.trim() || "Unnamed Group";
    }

    const others = chat.members?.filter(
      (m) => m.user.public_id !== currentUser.public_id
    );

    if (others?.length > 0) {
      return others[0].user.username;
    }

    return "Direct Chat";
  };

  const displayName = getDisplayName();

  const getInitials = (name) => {
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
    return colors[name.charCodeAt(0) % colors.length];
  };

  const avatarColor = getAvatarColor(displayName);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-slate-200/40 shadow-sm relative z-10">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold shadow-lg`}>
          {getInitials(displayName)}
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-800 truncate">
            {displayName}
          </h3>

          <div className="flex items-center gap-2">
            {chat.is_group ? (
              <>
                <Users size={13} className="text-slate-400" />
                <p className="text-xs text-slate-500 font-medium">{chat.members?.length || 0} members</p>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs text-slate-500 font-medium">Active now</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          aria-label="Search"
          onClick={() => setShowSearch(!showSearch)}
          className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
        >
          <Search size={20} />
        </button>
        <button
          aria-label="More options"
          onClick={() => setShowMenu(!showMenu)}
          className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
        >
          <MoreVertical size={20} />
        </button>

        <ChatOptionsMenu
          chat={chat}
          currentUser={currentUser}
          isOpen={showMenu}
          onClose={() => setShowMenu(false)}
          onDeleteChat={onDeleteChat}
          onCloseChat={() => {
            setShowMenu(false);
            onCloseChat?.();
          }}
          onExitGroup={onExitGroup}
          onAddMember={onAddMember}
          onRemoveMember={onRemoveMember}
          onLogout={onLogout}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
