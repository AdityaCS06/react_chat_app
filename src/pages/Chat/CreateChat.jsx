// src/pages/Chat/CreateChat.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";
import { createChat } from "../../api/chat";
import UserSearch from "../../components/chat/UserSearch";
import SelectedUserList from "../../components/chat/SelectedUserList";

const CreateChat = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addToast } = useToast();

  const [chatName, setChatName] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectUser = (user) => {
    if (isGroup || selectedUsers.length === 0) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      addToast("Only one user allowed in 1:1 chat", "warning");
    }
  };

  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== id));
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) {
      addToast("Please select at least one user", "error");
      return;
    }

    const members = selectedUsers.map((u) => u.public_id);

    const payload = {
      name: isGroup ? chatName : null,
      is_group: isGroup,
      members,
    };

    try {
      setLoading(true);
      const res = await createChat(payload, token);
      addToast("Chat created successfully!", "success");
      navigate(`/chats/${res.cuid}`);
    } catch {
      addToast("Failed to create chat", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Create New Chat</h2>

      <div className="mb-3 flex items-center gap-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isGroup}
            onChange={() => {
              setIsGroup(!isGroup);
              setSelectedUsers([]);
              setChatName("");
            }}
          />
          <span>Create Group Chat</span>
        </label>
      </div>

      {isGroup && (
        <input
          type="text"
          placeholder="Group name"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-3 focus:ring focus:ring-blue-300"
        />
      )}

      <UserSearch
        onSelectUser={handleSelectUser}
        selectedUsers={selectedUsers}
      />

      <SelectedUserList
        users={selectedUsers}
        onRemove={handleRemoveUser}
      />

      <button
        onClick={handleCreateChat}
        disabled={loading}
        className="w-full mt-5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Chat"}
      </button>
    </div>
  );
};

export default CreateChat;
