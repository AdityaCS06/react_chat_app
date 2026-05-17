// src/components/chat/SelectedUserList.jsx
import React from "react";
import { X } from "lucide-react";

const SelectedUserList = ({ users, onRemove }) => {
  if (!users.length) return null;

  const getAvatarColor = (name) => {
    const colors = [
      "from-violet-500 to-purple-600",
      "from-blue-500 to-cyan-500",
      "from-pink-500 to-rose-500",
      "from-emerald-500 to-teal-500",
      "from-orange-500 to-amber-500",
      "from-indigo-500 to-blue-500",
    ];
    const index = (name || "U").charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        Selected ({users.length})
      </p>
      <div className="flex flex-wrap gap-2">
        {users.map((u) => (
          <div
            key={u.id || u.public_id}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100/50 dark:border-blue-800 text-blue-800 dark:text-blue-300 px-3 py-2 rounded-xl"
          >
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${getAvatarColor(u.username)} flex items-center justify-center text-white text-[10px] font-bold`}>
              {u.avatar ? (
                <img src={u.avatar} alt="" className="w-full h-full rounded-lg object-cover" />
              ) : (
                getInitials(u.full_name || u.username)
              )}
            </div>
            <span className="text-xs font-medium">{u.full_name || u.username}</span>
            <button
              onClick={() => onRemove(u.id || u.public_id)}
              className="p-0.5 text-slate-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedUserList;