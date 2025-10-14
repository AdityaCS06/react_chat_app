import React from "react";

const MessageBubble = ({ msg, isMine, isGroup, showSender, senderName }) => {
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative group max-w-[70%] px-3 py-2 rounded-2xl shadow-sm transition
          ${
            isMine
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-white text-gray-900 rounded-bl-none"
          }`}
      >
        {/* Show sender name if group chat and not me */}
        {isGroup && showSender && !isMine && (
          <div className="text-xs font-semibold text-gray-500 mb-1">
            {senderName || "Unknown"}
          </div>
        )}

        {/* Message text */}
        <div className="break-words whitespace-pre-wrap">{msg.content}</div>

        {/* Time + status */}
        <div
          className={`text-[10px] mt-1 text-right ${
            isMine ? "text-blue-100" : "text-gray-400"
          }`}
        >
          {formatTime(msg.created_at)}
          {msg.status === "seen" && isMine && (
            <span className="ml-1 text-[10px]">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
