import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";
import { sendMessage } from "../../api/message";

const ChatInput = ({ chat, socketRef, setMessages }) => {
  const [message, setMessage] = useState("");
  const { user, token } = useAuth();
  const { addToast } = useToast();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const content = message.trim();
    const tempMsg = {
      muid: `temp-${Date.now()}`,
      sender_id: user.public_id,
      content,
      message_type: "text",
      created_at: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, tempMsg]);
    setMessage("");

    const sent = socketRef.current?.send?.(JSON.stringify({ content, message_type: "text" }));
    if (!sent) {
      try {
        await sendMessage(token, chat.cuid, content);
      } catch {
        addToast("Failed to send message", "error");
      }
    }
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
        aria-label="Message input"
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
