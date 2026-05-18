import React from "react";
import { Check, X } from "lucide-react";

const MessageBubble = ({ msg, isMine, isGroup, showSender, senderName, onContextMenu, isEditing, editContent, onEditChange, onSaveEdit, onCancelEdit }) => {
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

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        onContextMenu={handleContextMenu}
        className={`relative group max-w-[75%] px-5 py-3.5 transition-all duration-200 ${
          isMine
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl rounded-br-sm shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25"
            : "bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-slate-700 dark:text-slate-200 rounded-2xl rounded-bl-sm shadow-lg shadow-slate-200/50 dark:shadow-gray-900/50 hover:shadow-xl hover:shadow-slate-300/40 dark:hover:shadow-gray-800/40"
        }`}
      >
        {isGroup && showSender && !isMine && (
          <div className={`text-xs font-bold mb-1.5 ${isMine ? "text-blue-200" : "text-indigo-500 dark:text-indigo-400"}`}>
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
          <div className="break-all whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
        )}

        <div
          className={`text-[10px] mt-2 flex items-center justify-end gap-1.5 ${
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