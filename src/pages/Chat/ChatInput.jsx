// src/pages/Chat/ChatInput.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ChatInput = ({ chat, socketRef, setMessages }) => {
  const [message, setMessage] = useState("");
  const { user } = useAuth(); // ✅ Get current user

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !socketRef.current) return;

    const payload = {
      content: message.trim(),
      message_type: "text",
    };

    // Optimistic UI update with actual sender_id
    const tempMsg = {
      muid: `temp-${Date.now()}`, // temporary unique ID
      sender_id: user.public_id, // ✅ Correct sender ID
      content: message.trim(),
      message_type: "text",
      created_at: new Date().toISOString(),
      status: "sent", // optional for optimistic display
    };

    // Update messages immediately in UI
    setMessages((prev) => [...prev, tempMsg]);

    // Send message through WebSocket
    socketRef.current.send(JSON.stringify(payload));

    // Clear input field
    setMessage("");
  };

  return (
    <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
