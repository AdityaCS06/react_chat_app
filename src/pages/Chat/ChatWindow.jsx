import React, { useEffect, useState, useRef, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "../../components/chat/MessageBubble";
import { getMessages, updateMessageStatus } from "../../api/message";
import { connectToChatSocket } from "../../api/socket";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";

const ChatWindow = ({ chat }) => {
  const { token, user } = useAuth();
  const { addToast } = useToast();

  console.log("CHAT WINDOW RECEIVED CHAT =", chat);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const isFetchingRef = useRef(false);

  // -------------------------
  // FETCH MESSAGES
  // -------------------------
  const fetchMessages = useCallback(
    async (replace = false, limit = 50, offset = 0) => {
      if (!chat?.cuid || isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const res = await getMessages(token, chat.cuid, limit, offset);
        const newMessages = res.messages || [];

        setMessages((prev) =>
          replace ? newMessages : [...newMessages, ...prev]
        );

        setHasMore(newMessages.length === limit);
      } catch (err) {
        addToast("Failed to load messages", "error");
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [chat?.cuid, token, addToast]
  );

  const setupWebSocket = useCallback(() => {
    if (!chat?.cuid || !token) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

    socketRef.current = connectToChatSocket(chat.cuid, token, (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, [chat?.cuid, token]);

  useEffect(() => {
    if (!chat) return;

    setMessages([]);
    fetchMessages(true);
    setupWebSocket();

    return () => socketRef.current?.close();
  }, [chat, fetchMessages, setupWebSocket]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const handleScroll = (e) => {
    if (e.target.scrollTop < 80 && hasMore && !loading) {
      fetchMessages(false, 50, messages.length);
    }
  };

  const markMessagesAsSeen = useCallback(async () => {
    try {
      const unseen = messages.filter(
        (msg) =>
          msg.sender_id !== user.public_id && msg.status !== "seen"
      );

      for (const msg of unseen) {
        await updateMessageStatus(token, chat.cuid, msg.muid, "seen");
      }
    } catch {}
  }, [messages, user.public_id, token, chat?.cuid]);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      markMessagesAsSeen();
    }
  }, [messages, loading, markMessagesAsSeen]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-50">
      <ChatHeader chat={chat} currentUser={user} />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3"
      >
        {loading && messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm">
            Loading messages...
          </p>
        )}

        {/* ---- FIX APPLIED HERE ---- */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.muid}
            msg={msg}
            isMine={msg.sender_id === user.public_id}
            isGroup={chat?.is_group}
            showSender={true}
            senderName={msg.sender_name || msg.sender_username}
          />
        ))}
        {/* --------------------------- */}
      </div>

      <ChatInput
        chat={chat}
        socketRef={socketRef}
        setMessages={setMessages}
      />
    </div>
  );
};

export default ChatWindow;
