import React, { useEffect, useState, useMemo } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { getChatDetails } from "../../api/chat";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";

const ChatWindow = ({ chat }) => {
  const { token, user } = useAuth();
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Determine display name for header (group or direct)
  const chatDisplayName = useMemo(() => {
    if (!chat) return "";
    if (chat.is_group) return chat.name || "Unnamed Group";
    const other = chat.members.find(
      (m) => m.user.public_id !== user.public_id
    );
    return other?.user?.username || "Unknown User";
  }, [chat, user]);

  // ✅ Fetch messages for selected chat
  const fetchMessages = async () => {
    if (!chat?.cuid) return;
    try {
      const res = await getChatDetails(chat.cuid, token);
      setMessages(res?.messages || []);
    } catch (err) {
      console.error(err);
      addToast("Failed to load chat details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMessages([]);
    setLoading(true);
    fetchMessages();
  }, [chat]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ✅ Chat Header */}
      <ChatHeader chatName={chatDisplayName} isGroup={chat?.is_group} />

      {/* ✅ Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {loading ? (
          <p className="text-center text-gray-400 mt-4">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            No messages yet — start the conversation!
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === user.public_id;
            return (
              <div
                key={msg.muid}
                className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                    isMine
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ✅ Input Box */}
      <ChatInput chat={chat} setMessages={setMessages} />
    </div>
  );
};

export default ChatWindow;
