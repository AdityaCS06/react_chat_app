import React, { useState } from "react";
import { Check, X } from "lucide-react";
import Avatar from "../ui/Avatar";

const MAX_CHARS = 250;

const getRadius = (isMine, isFirstInGroup) => {
  if (isMine) {
    return isFirstInGroup ? "rounded-[10px] rounded-tr-[2px]" : "rounded-[10px]";
  }
  return isFirstInGroup ? "rounded-[10px] rounded-tl-[2px]" : "rounded-[10px]";
};

const MessageBubble = ({ msg, isMine, isGroup, isFirstInGroup, isConsecutive, showSender, senderName, senderAvatar, onContextMenu, isEditing, editContent, onEditChange, onSaveEdit, onCancelEdit }) => {
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
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} items-start gap-2 ${isFirstInGroup ? "mt-3 first:mt-0" : "mt-1"}`}>
      {isGroup && !isMine && (
        <div className={`w-7 h-7 rounded-full flex-shrink-0 overflow-hidden mt-1.5 ${showSender ? "" : "invisible"}`} title={senderName}>
          <Avatar
            src={senderAvatar}
            name={senderName}
            className="w-full h-full rounded-full"
            textClassName="text-[10px] font-bold"
          />
        </div>
      )}
      <div
        onContextMenu={handleContextMenu}
        className={`relative group max-w-[75%] px-4 pt-2.5 pb-1.5 transition-all duration-200 ${
          isMine
            ? `bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 ${getRadius(isMine, isFirstInGroup)}`
            : `bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-slate-700 dark:text-slate-200 shadow-lg shadow-slate-200/50 dark:shadow-gray-900/50 hover:shadow-xl hover:shadow-slate-300/40 dark:hover:shadow-gray-800/40 ${getRadius(isMine, isFirstInGroup)}`
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
          <div className="pr-12 pb-6">
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

        {!isEditing && (
          <div
            className={`absolute bottom-1 right-2.5 text-[10px] flex items-center gap-1 ${
              isMine ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {msg.is_edited && (
              <span className="italic">edited</span>
            )}
            {msg.status === "seen" && isMine && (
              <div className="flex -space-x-1.5">
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
            {formatTime(msg.created_at)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
