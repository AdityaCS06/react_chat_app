// src/components/Chat/SelectedUserList.jsx
import React from "react";

const SelectedUserList = ({ users, onRemove }) => {
  if (!users.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {users.map((u) => (
        <div
          key={u.id}
          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
        >
          <span>{u.name || u.username}</span>
          <button
            onClick={() => onRemove(u.id)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedUserList;
