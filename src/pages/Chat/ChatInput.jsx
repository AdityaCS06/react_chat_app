import React, { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";
import { sendMessage } from "../../api/message";
import { getErrorMessage } from "../../api/utils";

const ChatInput = ({ chat, socketRef, setMessages }) => {
  const [message, setMessage] = useState("");
  const { user, token } = useAuth();
  const { addToast } = useToast();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const content = message.trim();
    const tempMuid = `temp-${Date.now()}`;
    const tempMsg = {
      muid: tempMuid,
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
        const response = await sendMessage(token, chat.cuid, content);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.muid === tempMuid ? { ...msg, muid: response.muid || response.message?.muid || msg.muid } : msg
          )
        );
      } catch (err) {
        addToast(getErrorMessage(err), "error");
      }
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="sticky bottom-0 p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-t border-slate-200/40 dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none"
    >
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Attach" className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-all flex-shrink-0">
          <Paperclip size={20} />
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            aria-label="Message input"
            className="w-full px-5 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.04),inset_-2px_-2px_6px_rgba(255,255,255,0.9)] dark:shadow-none focus:shadow-[inset_2px_2px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_8px_rgba(255,255,255,1),0_0_0_3px_rgba(99,102,241,0.2)] outline-none transition-all duration-300"
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