import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMyChats } from "../../api/chat";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";

const ChatSidebar = ({ onSelectChat, activeChat }) => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { addToast } = useToast();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getMyChats(token);
        setChats(res?.chats || []);
      } catch {
        addToast("Failed to load chats", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [token]);

  const getChatDisplayName = (chat) => {
    if (chat.is_group) return chat.name || "Unnamed Group";
    const other = chat.members.find((m) => m.user.public_id !== user.public_id);
    return other?.user?.username || "Unknown User";
  };

  const filteredChats = useMemo(
    () =>
      chats.filter((chat) =>
        getChatDisplayName(chat).toLowerCase().includes(search.toLowerCase())
      ),
    [chats, search]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
        <button
          onClick={() => navigate("/create-chat")}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-1 rounded-lg text-sm"
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
          aria-label="Search chats"
          className="w-full px-3 py-2 border rounded-full text-sm focus:ring-2 focus:ring-blue-300 outline-none"
        />
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <div className="animate-pulse p-4 space-y-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg" />
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">No chats found</p>
        ) : (
          filteredChats.map((chat) => {
            const chatName = getChatDisplayName(chat);
            return (
              <div
                key={chat.cuid}
                onClick={() => onSelectChat(chat)}
                className={`p-4 cursor-pointer border-b hover:bg-gray-100 transition-all truncate ${
                  activeChat?.cuid === chat.cuid
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : ""
                }`}
              >
                <div className="font-medium text-gray-900 truncate text-sm">
                  {chatName}
                </div>
                <div className="text-xs text-gray-500 mt-1 truncate">
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
