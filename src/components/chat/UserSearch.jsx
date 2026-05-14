// src/components/chat/UserSearch.jsx
import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/user";
import { useAuth } from "../../context/AuthContext";
import { Search, User as UserIcon } from "lucide-react";

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
              !selectedUsers.some((s) => s.public_id === u.public_id || s.id === u.public_id)
          )
        );
      } catch {}
    };
    const timeout = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timeout);
  }, [search, token, user, selectedUsers]);

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
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search users"
          className="w-full px-3 py-2 pl-10 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.03),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] focus:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),inset_-2px_-2px_6px_rgba(255,255,255,0.9),0_0_0_3px_rgba(99,102,241,0.2)] outline-none transition-all duration-300"
        />
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-200/50 bg-white/50">
        {users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 mb-3 rounded-full bg-slate-100 flex items-center justify-center">
              <UserIcon size={20} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 font-medium">
              {search ? "No users found" : "Start typing to search"}
            </p>
          </div>
        )}
        {users.map((u) => (
          <div
            key={u.public_id}
            onClick={() => onSelectUser(u)}
            className="flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-blue-50/50 transition-all duration-200 border-b border-slate-100/50 last:border-0 group"
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getAvatarColor(u.username)} flex items-center justify-center text-white text-[10px] font-bold shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300`}>
              {getInitials(u.full_name || u.username)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-slate-700 truncate">{u.full_name || u.username}</p>
              <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
            </div>
            <button className="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200">
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
