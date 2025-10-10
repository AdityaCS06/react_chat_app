// src/pages/Chat/CreateChat.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChat } from "../../api/chat";
import { getAllUsers } from "../../api/user";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";

const CreateChat = () => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isGroup, setIsGroup] = useState(false);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch users with optional search
  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token, search);
        setUsers(data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        addToast("Failed to fetch users", "error");
      }
    };

    const delay = setTimeout(fetchUsers, 400);
    return () => clearTimeout(delay);
  }, [search, token, addToast]);

  // ✅ Fixed toggle logic
  const toggleUser = (user) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.find((u) => u.id === user.id);

      if (isGroup) {
        // Multi-select for groups
        if (isSelected) {
          return prev.filter((u) => u.id !== user.id);
        } else {
          return [...prev, user];
        }
      } else {
        // Single select for private chat
        return isSelected ? [] : [user];
      }
    });
  };

  // ✅ Handle row click (for both modes)
  const handleUserClick = (user) => {
    if (isGroup) {
      // In group mode, clicking the row should also toggle selection
      toggleUser(user);
    } else {
      // In private mode, just toggle normally
      toggleUser(user);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isGroup && !name.trim())
      return addToast("Group name is required!", "warning");

    if (selectedUsers.length === 0)
      return addToast("Select at least one user!", "warning");

    if (!isGroup && selectedUsers.length > 1)
      return addToast("For a private chat, select only one user.", "warning");

    // ✅ FIX: Extract only user IDs for the API payload
    const payload = {
      name: isGroup ? name : null,
      is_group: isGroup,
      members: selectedUsers.map((u) => u.id), // This should now be an array of strings
    };

    try {
      setLoading(true);
      const chat = await createChat(payload, token);
      addToast("Chat created successfully!", "success");
      navigate(`/chats/${chat.cuid}`);
    } catch (err) {
      console.error("Chat create error:", err);
      addToast("Failed to create chat", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create New Chat
        </h2>

        {/* Toggle for group */}
        <div className="flex items-center justify-between mb-4">
          <label className="text-gray-700 font-medium">Is Group Chat?</label>
          <input
            type="checkbox"
            checked={isGroup}
            onChange={(e) => {
              setIsGroup(e.target.checked);
              setSelectedUsers([]); // reset selection on toggle
            }}
            className="w-5 h-5 accent-blue-600"
          />
        </div>

        {isGroup && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Search Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Search Users
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type name or email..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Users list */}
        <div className="border rounded-lg max-h-60 overflow-y-auto p-2 mb-5">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center text-sm py-4">
              No users found.
            </p>
          ) : (
            users.map((u) => {
              const isSelected = selectedUsers.some((su) => su.id === u.id);
              return (
                <div
                  key={u.id}
                  onClick={() => handleUserClick(u)} // ✅ Fixed: Now works in both modes
                  className={`flex items-center justify-between p-2 rounded-md transition duration-150 ease-in-out cursor-pointer ${
                    isSelected
                      ? "bg-blue-100 border border-blue-400"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {u.full_name || u.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>

                  {/* Checkbox visible only in group mode */}
                  {isGroup && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleUser(u)}
                      className="w-5 h-5 accent-blue-600 ml-4 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()} // prevent double toggle
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ✅ Debug info (optional - remove in production) */}
        {selectedUsers.length > 0 && (
          <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
            <p>Selected Users: {selectedUsers.length}</p>
            <p>User IDs: {selectedUsers.map(u => u.id).join(', ')}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
        >
          {loading ? "Creating..." : "Create Chat"}
        </button>
      </div>
    </div>
  );
};

export default CreateChat;