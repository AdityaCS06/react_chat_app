import React from "react";

const ChatHeader = ({ chat, currentUser }) => {
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
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-sm">

      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-semibold shadow-md`}>
          {getInitials(displayName)}
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-800 truncate">
            {displayName}
          </h3>

          <div className="flex items-center gap-1.5">
            {chat.is_group ? (
              <>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-xs text-slate-500">{chat.members?.length || 0} members</p>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <p className="text-xs text-slate-500">Active now</p>
              </>
            )}
          </div>
        </div>

      </div>

      <div className="flex items-center gap-2">
        <button aria-label="Search" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button aria-label="More options" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

    </div>
  );
};

export default ChatHeader;
