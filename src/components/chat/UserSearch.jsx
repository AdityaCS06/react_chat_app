// src/components/Chat/UserSearch.jsx
import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/user";
import { useAuth } from "../../context/AuthContext";

const UserSearch = ({ onSelectUser, selectedUsers }) => {
  const { token, user } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token, search);
        setUsers(
          data.filter(
            (u) =>
              u.public_id !== user?.public_id &&
              !selectedUsers.some((s) => s.public_id === u.public_id)
          )
        );
      } catch {} 
    };
    const timeout = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timeout);
  }, [search, token, user, selectedUsers]);

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search users"
        className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
      />

      <ul className="max-h-56 overflow-y-auto border rounded-lg divide-y">
        {users.length === 0 && (
          <li className="text-gray-500 p-3 text-center text-sm">
            No users found
          </li>
        )}
        {users.map((u) => (
          <li
            key={u.public_id}
            onClick={() => onSelectUser(u)}
            className="cursor-pointer hover:bg-blue-50 p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{u.full_name || u.username}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>
            <button className="text-blue-600 text-sm">Select</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
