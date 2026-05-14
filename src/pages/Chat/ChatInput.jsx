import React, { useState } from "react";
import { Paperclip, Send } from "lucide-react";
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
      className="sticky bottom-0 p-4 bg-white/70 backdrop-blur-xl border-t border-slate-200/40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Attach" className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all flex-shrink-0">
          <Paperclip size={20} />
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            aria-label="Message input"
            className="w-full px-5 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl text-sm text-slate-700 placeholder-slate-400 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.04),inset_-2px_-2px_6px_rgba(255,255,255,0.9)] focus:shadow-[inset_2px_2px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_8px_rgba(255,255,255,1),0_0_0_3px_rgba(99,102,241,0.2)] outline-none transition-all duration-300"
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-95 flex-shrink-0"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
