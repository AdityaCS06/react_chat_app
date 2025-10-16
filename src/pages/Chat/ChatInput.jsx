import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ChatInput = ({ chat, socketRef, setMessages }) => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !socketRef.current) return;

    const tempMsg = {
      muid: `temp-${Date.now()}`,
      sender_id: user.public_id,
      content: message.trim(),
      message_type: "text",
      created_at: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, tempMsg]);

    socketRef.current.send(JSON.stringify({ content: message.trim(), message_type: "text" }));

    setMessage("");
  };

  return (
    <form
      onSubmit={handleSend}
      className="sticky bottom-0 p-3 border-t bg-white flex gap-2 z-10"
    >
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
