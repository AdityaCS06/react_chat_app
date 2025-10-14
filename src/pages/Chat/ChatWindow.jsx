// src/pages/Chat/ChatWindow.jsx
import React, { useEffect, useState, useRef } from "react";
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

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const chatIdRef = useRef(null);
  const isFetchingRef = useRef(false);

  // --- Fetch messages ---
  const fetchMessages = async (replace = false, limit = 50, offset = 0) => {
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
  };

  // --- WebSocket setup ---
  const setupWebSocket = () => {
    if (!chat?.cuid || !token) return;
    if (socketRef.current) socketRef.current.close();

    socketRef.current = connectToChatSocket(chat.cuid, token, (data) => {
      // Backend broadcasts a new message JSON
      setMessages((prev) => [...prev, data]);
    });
  };

  // --- Handle new chat selection ---
  useEffect(() => {
    if (!chat) return;
    if (chat.cuid !== chatIdRef.current) {
      chatIdRef.current = chat.cuid;
      setMessages([]);
      fetchMessages(true);
      setupWebSocket();
    }
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [chat]);

  // --- Scroll to bottom when new message ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  // --- Infinite scroll ---
  const handleScroll = (e) => {
    if (e.target.scrollTop < 100 && hasMore && !loading) {
      fetchMessages(false, 50, messages.length);
    }
  };

  // --- Mark messages as seen ---
  const markMessagesAsSeen = async () => {
    try {
      const unseen = messages.filter(
        (msg) => msg.sender_id !== user.public_id && msg.status !== "seen"
      );
      for (const msg of unseen) {
        await updateMessageStatus(token, chat.cuid, msg.muid, "seen");
      }
    } catch {}
  };

  useEffect(() => {
    if (!loading && messages.length > 0) markMessagesAsSeen();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ChatHeader chat={chat} />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {loading && messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            No messages yet — start the conversation!
          </p>
        ) : (
          messages.map((msg, idx) => {
            const isMine = msg.sender_id === user.public_id;
            const showSender =
              chat.is_group &&
              (!isMine ||
                idx === 0 ||
                messages[idx - 1]?.sender_id !== msg.sender_id);
            return (
              <MessageBubble
                key={msg.muid || idx}
                msg={msg}
                isMine={isMine}
                isGroup={chat.is_group}
                showSender={showSender}
                senderName={msg.sender_name}
              />
            );
          })
        )}
      </div>

      <ChatInput chat={chat} socketRef={socketRef} setMessages={setMessages} />
    </div>
  );
};

export default ChatWindow;
