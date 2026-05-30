import React, { useState, useEffect, useRef } from "react";
import { Paperclip, Send, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";
import { sendMessage } from "../../api/message";
import { getErrorMessage } from "../../api/utils";

const ChatInput = ({ chat, socketRef, setMessages, replyTo, clearReply, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { addToast } = useToast();
  const inputRef = useRef(null);

  useEffect(() => {
    setMessage("");
    clearReply?.();
  }, [chat?.cuid, clearReply]);

  useEffect(() => {
    if (replyTo) {
      inputRef.current?.focus();
    }
  }, [replyTo]);

  const getReplySenderName = () => {
    if (!replyTo) return "";
    if (replyTo.sender_id === user.public_id) return "You";
    return replyTo.sender_name || replyTo.sender_username || "Unknown";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const content = message.trim();
    const tempMuid = `temp-${Date.now()}`;
    const tempMsg = {
      muid: tempMuid,
      sender_id: user.public_id,
      sender_name: user.full_name || user.username,
      sender_username: user.username,
      content,
      message_type: "text",
      created_at: new Date().toISOString(),
      status: "sent",
    };
    if (replyTo) {
      tempMsg.reply_to = {
        muid: replyTo.muid,
        sender_id: replyTo.sender_id,
        sender_name: replyTo.sender_name || replyTo.sender_username,
        sender_username: replyTo.sender_username,
        content: replyTo.content,
      };
    }

    setMessages((prev) => [...prev, tempMsg]);
    setMessage("");
    clearReply?.();

    const wsPayload = { content, message_type: "text" };
    if (replyTo) wsPayload.reply_to = replyTo.muid;

    const sent = socketRef.current?.send?.(JSON.stringify(wsPayload));
    if (!sent) {
      try {
        const response = await sendMessage(chat.cuid, content, "text", replyTo?.muid);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.muid === tempMuid ? { ...msg, muid: response.muid || response.message?.muid || msg.muid } : msg
          )
        );
      } catch (err) {
        addToast(getErrorMessage(err), "error");
      }
    }

    onMessageSent?.();
  };

  return (
    <form
      onSubmit={handleSend}
      className="sticky bottom-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-t border-slate-200/40 dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none"
    >
      {replyTo && (
        <div className="flex items-start gap-3 px-4 pt-3 pb-1 bg-blue-50/80 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 [overflow-wrap:anywhere] whitespace-pre-wrap">
              Replying to {getReplySenderName()}
            </div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 [overflow-wrap:anywhere] whitespace-pre-wrap">
              {replyTo.content.length > 100
                ? replyTo.content.slice(0, 100) + "..."
                : replyTo.content}
            </div>
          </div>
          <button
            type="button"
            onClick={clearReply}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-3 p-4">
        <button type="button" aria-label="Attach" className="p-3 sm:p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-all flex-shrink-0">
          <Paperclip size={20} />
        </button>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={replyTo ? "Write your reply..." : "Write a message..."}
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
