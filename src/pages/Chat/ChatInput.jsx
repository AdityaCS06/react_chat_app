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
    <form
      onSubmit={handleSend}
      className="p-3 border-t bg-white flex gap-2 items-center"
    >
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 active:scale-95 transition"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
