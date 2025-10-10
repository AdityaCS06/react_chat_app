import React from "react";

const UserList = ({ users, selectedUsers, onUserClick, isGroup, toggleUser }) => {
  if (users.length === 0) {
    return (
      <p className="text-gray-500 text-center text-sm py-4">No users found.</p>
    );
  }

  return (
    <div className="border rounded-lg max-h-60 overflow-y-auto p-2 mb-5">
      {users.map((u) => {
        const isSelected = selectedUsers.some((su) => su.id === u.id);
        return (
          <div
            key={u.id}
            onClick={() => onUserClick(u)}
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
            {isGroup && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleUser(u)}
                className="w-5 h-5 accent-blue-600 ml-4 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
