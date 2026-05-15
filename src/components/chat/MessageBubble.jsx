import React from "react";

const MessageBubble = ({ msg, isMine, isGroup, showSender, senderName, onContextMenu }) => {
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    onContextMenu?.(e, msg);
  };

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        onContextMenu={handleContextMenu}
        className={`relative group max-w-[75%] px-5 py-3.5 transition-all duration-200 ${
          isMine
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl rounded-br-sm shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25"
            : "bg-white/95 backdrop-blur-sm text-slate-700 rounded-2xl rounded-bl-sm shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/40"
        }`}
      >
        {isGroup && showSender && !isMine && (
          <div className={`text-xs font-bold mb-1.5 ${isMine ? "text-blue-200" : "text-indigo-500"}`}>
            {senderName || "Unknown"}
          </div>
        )}

        <div className="break-words whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>

        <div
          className={`text-[10px] mt-2 flex items-center justify-end gap-1.5 ${
            isMine ? "text-blue-100" : "text-slate-400"
          }`}
        >
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
          {formatTime(msg.created_at)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
