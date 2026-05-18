import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";
import { getMyChats } from "../../api/chat";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getMyChats();
        setChats(res.chats || []);
      } catch (err) {
        console.error(err);
        addToast("Failed to load chats", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [addToast]);

  const filteredChats = useMemo(
    () =>
      chats.filter((chat) =>
        (chat.is_group ? chat.name : getChatPartnerName(chat, user)).toLowerCase().includes(search.toLowerCase())
      ),
    [chats, search, user]
  );

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading chats...</div>;
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        <p>No chats available yet!</p>
        <button
          onClick={() => navigate("/chats/create")}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Chat
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-2xl font-semibold text-gray-900">My Chats</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:flex-auto px-3 py-2 border rounded-full text-sm focus:ring-2 focus:ring-blue-300 outline-none"
          />
          <button
            onClick={() => navigate("/chats/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition whitespace-nowrap"
          >
            + New Chat
          </button>
        </div>
      </div>

      {/* Chat list */}
      <ul className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 space-y-2">
        {filteredChats.length === 0 ? (
          <li className="text-center text-gray-500 py-4">No chats found</li>
        ) : (
          filteredChats.map((chat) => {
            const name = chat.is_group ? chat.name : getChatPartnerName(chat, user);
            return (
              <li
                key={chat.cuid}
                onClick={() => navigate(`/chats/${chat.cuid}`)}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 truncate w-full">
                  <h3 className="font-medium text-gray-900 truncate">{name}</h3>
                  <p className="text-xs text-gray-500 truncate">
                    {chat.is_group ? `${chat.members.length} members` : "Direct message"}
                  </p>
                </div>
                <span className="text-xs text-gray-400 mt-1 sm:mt-0">
                  {new Date(chat.created_at).toLocaleDateString()}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

// Helper: get 1:1 chat partner name
const getChatPartnerName = (chat, user) => {
  const other = chat.members.find((m) => m.user.public_id !== user.public_id);
  return other ? other.user.username : "Private Chat";
};

export default ChatList;
