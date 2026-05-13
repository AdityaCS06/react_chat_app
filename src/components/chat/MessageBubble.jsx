import React from "react";

const MessageBubble = ({ msg, isMine, isGroup, showSender, senderName }) => {
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative group max-w-[75%] px-4 py-3 shadow-md transition-all duration-200 ${
          isMine
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl rounded-br-sm"
            : "bg-white/90 backdrop-blur-sm text-slate-700 rounded-2xl rounded-bl-sm shadow-[2px_2px_8px_rgba(0,0,0,0.06)]"
        }`}
      >
        {isGroup && showSender && !isMine && (
          <div className={`text-xs font-semibold mb-1 ${isMine ? "text-blue-200" : "text-indigo-500"}`}>
            {senderName || "Unknown"}
          </div>
        )}

        <div className="break-words whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>

        <div
          className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
            isMine ? "text-blue-100" : "text-slate-400"
          }`}
        >
          {msg.status === "seen" && isMine && (
            <svg className="w-3 h-3" viewBox="0 0 16 11" fill="currentColor">
              <path d="M1 5.5L4 8.5L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
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
