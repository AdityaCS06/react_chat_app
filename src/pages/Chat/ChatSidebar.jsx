import React, { useEffect, useState, useMemo } from "react";
import { getMyChats } from "../../api/chat";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";

const ChatSidebar = ({ onSelectChat, activeChat }) => {
  const { token, user } = useAuth();
  const { addToast } = useToast();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch all user chats
  const fetchChats = async () => {
    try {
      const res = await getMyChats(token);
      setChats(res?.chats || []);
    } catch (err) {
      console.error(err);
      addToast("Failed to load chats", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Determine the display name for a chat
  const getChatDisplayName = (chat) => {
    if (chat.is_group) return chat.name || "Unnamed Group";

    // For direct chats, show the other user's username
    const other = chat.members.find(
      (m) => m.user.public_id !== user.public_id
    );
    return other?.user?.username || "Unknown User";
  };

  // Filter chats by search text
  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      getChatDisplayName(chat).toLowerCase().includes(search.toLowerCase())
    );
  }, [chats, search]);

  return (
    <div className="flex flex-col h-full bg-white border-r w-80">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
        <button
          onClick={() => (window.location.href = "/create-chat")}
          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
        >
          + New
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b bg-gray-50">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <p className="text-center text-gray-400 mt-6">Loading chats...</p>
        ) : filteredChats.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">No chats found</p>
        ) : (
          filteredChats.map((chat) => {
            const chatName = getChatDisplayName(chat);
            return (
              <div
                key={chat.cuid}
                onClick={() => onSelectChat(chat)}
                className={`p-4 cursor-pointer border-b hover:bg-gray-100 transition ${
                  activeChat?.cuid === chat.cuid ? "bg-blue-50" : ""
                }`}
              >
                <div className="font-medium text-gray-900 truncate">
                  {chatName}
                </div>
                <div className="text-sm text-gray-500">
                  {chat.is_group
                    ? `${chat.members.length} members`
                    : "Direct chat"}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
