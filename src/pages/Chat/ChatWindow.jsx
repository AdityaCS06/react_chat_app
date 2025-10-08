import React, { useEffect, useState, useRef } from "react";
import { getMessages, sendMessage } from "../../api/chat";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";

const ChatWindow = ({ chat }) => {
  const { token, user } = useAuth();
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const data = await getMessages(chat.id, token);
      setMessages(data.messages || []);
    } catch (err) {
      addToast("Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chat) fetchMessages();
  }, [chat]);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const messageData = { content: newMessage, message_type: "text" };
      const sentMsg = await sendMessage(chat.id, messageData, token);
      setMessages((prev) => [...prev, sentMsg]);
      setNewMessage("");
    } catch (err) {
      addToast("Failed to send message", "error");
    }
  };

  if (loading) return <p className="p-4 text-gray-500">Loading messages...</p>;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.sender_id === user.id ? "bg-blue-500 text-white" : "bg-white border"
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow border rounded px-3 py-2 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
