import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";
import { getMyChats } from "../../api/chat";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      const res = await getMyChats(token);
      setChats(res.chats || []);
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

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading chats...</div>;
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        <p>No chats available yet!</p>
        <button
          onClick={() => navigate("/chats/create")}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Chat
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">My Chats</h2>
        <button
          onClick={() => navigate("/chats/create")}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Chat
        </button>
      </div>

      <ul className="divide-y">
        {chats.map((chat) => (
          <li
            key={chat.cuid}
            onClick={() => navigate(`/chats/${chat.cuid}`)}
            className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition"
          >
            <div>
              <h3 className="font-medium text-gray-900">
                {chat.is_group ? chat.name : getChatPartnerName(chat)}
              </h3>
              <p className="text-sm text-gray-500">
                {chat.is_group ? `${chat.members.length} members` : "Direct message"}
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(chat.created_at).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// helper: get 1:1 chat partner name (not the current user)
const getChatPartnerName = (chat) => {
  const currentUserId = chat.current_user_id; // optional — if backend sends current user id
  const other = chat.members.find((m) => m.user_id !== currentUserId);
  return other ? other.user.username : "Private Chat";
};

export default ChatList;
