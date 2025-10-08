import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyChats } from "../../api/chat";
import ChatPage from "./ChatPage";
import CreateChatModal from "../../components/chat/CreateChatModal";

const ChatLayout = () => {
  const { token, user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch all chats for the user
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getMyChats(token);
        const chatList = data?.chats || [];
        setChats(chatList);

        // Automatically select the first chat if available
        if (chatList.length > 0) setSelectedChatId(chatList[0].id);
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [token]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading chats...
      </div>
    );

  if (!chats.length)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        No chats available. Create a new chat to get started.
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <span className="font-semibold text-lg">Chats</span>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            + New
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const chatName = chat.is_group
              ? chat.name
              : chat.members.find((m) => m.id !== user.id)?.username || "Unknown";

            const lastMessage = chat.last_message?.content || "No messages yet";

            return (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-4 cursor-pointer hover:bg-gray-100 border-b border-gray-100 transition ${
                  selectedChatId === chat.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="font-medium">{chatName}</div>
                <div className="text-gray-500 text-sm truncate">{lastMessage}</div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Chat Panel */}
      <main className="flex-1 flex flex-col">
        {selectedChatId ? (
          <ChatPage chatId={selectedChatId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </main>

      {/* Create Chat Modal */}
      {showCreateModal && (
        <CreateChatModal
          onClose={() => setShowCreateModal(false)}
          onChatCreated={(chat) => {
            setChats((prev) => [chat, ...prev]);
            setSelectedChatId(chat.id);
          }}
        />
      )}
    </div>
  );
};

export default ChatLayout;
