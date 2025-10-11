import React, { useState } from "react";
import { sendMessage } from "../../api/message";
import { useAuth } from "../../context/AuthContext";

const ChatInput = ({ chat, setMessages }) => {
  const { token } = useAuth();
  const [text, setText] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await sendMessage(chat.cuid, { content: text }, token);
      setMessages((prev) => [...prev, res]);
      setText("");
    } catch {
      console.error("Failed to send message");
    }
  };

  return (
    <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
