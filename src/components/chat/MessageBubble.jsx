import React, { useState } from "react";
import { Check, X } from "lucide-react";

const MAX_CHARS = 250;

const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#ef4444", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#06b6d4",
];

const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < (name?.length || 0); i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const MessageBubble = ({ msg, isMine, isGroup, showSender, senderName, senderAvatar, onContextMenu, isEditing, editContent, onEditChange, onSaveEdit, onCancelEdit }) => {
  const [expanded, setExpanded] = useState(false);

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    onContextMenu?.(e, msg);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSaveEdit?.();
    } else if (e.key === "Escape") {
      onCancelEdit?.();
    }
  };

  const content = msg.content || "";
  const isLongMsg = content.length > MAX_CHARS;
  const displayContent = isLongMsg && !expanded ? content.slice(0, MAX_CHARS) : content;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} items-start gap-2`}>
      {isGroup && !isMine && (
        <div className={`w-7 h-7 rounded-full flex-shrink-0 overflow-hidden mt-1.5 ${showSender ? "" : "invisible"}`} title={senderName}>
          {senderAvatar ? (
            <img
              src={senderAvatar}
              alt={senderName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: getAvatarColor(senderName) }}
            >
              {(senderName || "?")[0].toUpperCase()}
            </div>
          )}
        </div>
      )}
      <div
        onContextMenu={handleContextMenu}
        className={`relative group max-w-[75%] px-4 py-2.5 transition-all duration-200 ${
          isMine
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-[18px] rounded-tr-[4px] shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25"
            : "bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-slate-700 dark:text-slate-200 rounded-[18px] rounded-tl-[4px] shadow-lg shadow-slate-200/50 dark:shadow-gray-900/50 hover:shadow-xl hover:shadow-slate-300/40 dark:hover:shadow-gray-800/40"
        }`}
      >
        {isGroup && showSender && !isMine && (
          <div className="text-xs font-bold mb-1 text-indigo-500 dark:text-indigo-400">
            {senderName || "Unknown"}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editContent}
              onChange={(e) => onEditChange?.(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-1.5 text-sm bg-black/10 dark:bg-white/10 rounded-lg text-white placeholder-white/50 outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={onCancelEdit}
                className="p-1.5 rounded-full hover:bg-black/20 dark:hover:bg-white/20"
              >
                <X size={14} />
              </button>
              <button
                onClick={onSaveEdit}
                className="p-1.5 rounded-full hover:bg-black/20 dark:hover:bg-white/20"
              >
                <Check size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="break-all whitespace-pre-wrap text-sm leading-relaxed">{displayContent}</div>
            {isLongMsg && !expanded && (
              <span className="text-slate-400 dark:text-slate-500">...</span>
            )}
            {isLongMsg && (
              <button
                onClick={() => setExpanded(!expanded)}
                className={`text-xs font-semibold mt-1 transition-colors ${
                  isMine
                    ? "text-blue-200 hover:text-white"
                    : "text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                }`}
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        <div
          className={`text-[10px] mt-1.5 flex items-center justify-end gap-1.5 ${
            isMine ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {msg.is_edited && !isEditing && (
            <span className="italic">edited</span>
          )}
          {msg.status === "seen" && isMine && (
            <div className="flex -space-x-1">
              <svg className="w-3 h-3" viewBox="0 0 16 11" fill="currentColor">
                <path d="M1 5.5L4 8.5L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <svg className="w-3 h-3" viewBox="0 0 16 11" fill="currentColor">
                <path d="M1 5.5L4 8.5L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
          )}
          {msg.status === "sent" && isMine && (
            <svg className="w-3 h-3" viewBox="0 0 16 11" fill="currentColor">
              <path d="M1 5.5L4 8.5L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          )}
          {!isEditing && formatTime(msg.created_at)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;