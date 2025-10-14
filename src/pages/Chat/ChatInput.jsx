// src/pages/Chat/ChatInput.jsx
import React, { useState } from "react";
import { sendMessage } from "../../api/message";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";

const ChatInput = ({ chat, setMessages }) => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !chat?.cuid) return;

    try {
      setSending(true);
      // Send message via API
      const newMsg = await sendMessage(token, chat.cuid, trimmed, "text");

      // Optimistically update UI
      setMessages((prev) => [...prev, newMsg]);
      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
      addToast("Failed to send message", "error");
    } finally {
      setSending(false);
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
        disabled={sending}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={sending || !text.trim()}
        className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 active:scale-95 transition disabled:bg-blue-300"
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default ChatInput;
