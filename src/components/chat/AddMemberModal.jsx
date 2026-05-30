import React, { useEffect, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Search, User as UserIcon, Check, Loader2 } from "lucide-react";
import { getAllUsers } from "../../api/user";
import { addMembers, getChatDetails } from "../../api/chat";
import { getErrorMessage } from "../../api/utils";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/ToastContainer";
import { hasProfilePhoto } from "../../utils/permissions";
import Avatar from "../ui/Avatar";

const MAX_SELECTION = 10;

const AddMemberModal = ({ chat, isOpen, onClose, onGroupUpdated }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [adding, setAdding] = useState(false);

  const existingMemberIds = useMemo(
    () => new Set(chat?.members?.map((m) => m.user.public_id) || []),
    [chat?.members]
  );

  useEffect(() => {
    if (!isOpen) return;
    setSearch("");
    setSelectedIds(new Set());
  }, [isOpen]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(search, 50, 0, true);
        setUsers(
          data.filter(
            (u) =>
              u.public_id !== user?.public_id &&
              !existingMemberIds.has(u.public_id)
          )
        );
      } catch {}
    };
    const timeout = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timeout);
  }, [search, user, existingMemberIds]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const toggleUser = useCallback((publicId) => {
    setSelectedIds((prev) => {
      if (prev.has(publicId)) {
        const next = new Set(prev);
        next.delete(publicId);
        return next;
      }
      if (prev.size >= MAX_SELECTION) {
        addToast(`You can only select up to ${MAX_SELECTION} members at a time`, "warning");
        return prev;
      }
      const next = new Set(prev);
      next.add(publicId);
      return next;
    });
  }, [addToast]);

  const handleAdd = async () => {
    if (selectedIds.size === 0 || !chat?.cuid) return;
    setAdding(true);
    try {
      await addMembers(chat.cuid, [...selectedIds]);
      addToast(
        `${selectedIds.size} member${selectedIds.size > 1 ? "s" : ""} added`,
        "success"
      );
      const updated = await getChatDetails(chat.cuid);
      onGroupUpdated?.(updated);
      onClose();
    } catch (err) {
      addToast(getErrorMessage(err), "error");
    } finally {
      setAdding(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-slate-200/40 dark:border-gray-700 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/40 dark:border-gray-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Add Members
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 pl-11 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.03),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-none outline-none focus:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),inset_-2px_-2px_6px_rgba(255,255,255,0.9),0_0_0_3px_rgba(99,102,241,0.2)] transition-all duration-300"
              />
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500"
              />
            </div>

            <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200/50 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-700/50">
              {users.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 mb-3 rounded-full bg-slate-100 dark:bg-gray-600 flex items-center justify-center">
                    <UserIcon
                      size={20}
                      className="text-slate-400 dark:text-gray-400"
                    />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">
                    {search
                      ? "No users found"
                      : "All users are already in the group"}
                  </p>
                </div>
              )}
              {users.map((u) => {
                const isSelected = selectedIds.has(u.public_id);
                return (
                  <div
                    key={u.public_id}
                    onClick={() => toggleUser(u.public_id)}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 border-b border-slate-100/50 dark:border-gray-600 last:border-0 ${
                      isSelected
                        ? "bg-blue-50/80 dark:bg-blue-900/20"
                        : "hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isSelected
                          ? "bg-blue-500 border-blue-500"
                          : "border-slate-300 dark:border-gray-500"
                      }`}
                    >
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <Avatar
                      src={
                        hasProfilePhoto(u) ? u.profile_photo : null
                      }
                      name={u.full_name || u.username}
                      className="w-9 h-9 rounded-xl shadow-sm flex-shrink-0"
                      textClassName="text-xs font-bold"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {u.full_name || u.username}
                      </p>
                      {u.full_name && (
                        <p className="text-xs text-slate-400 dark:text-gray-500">
                          @{u.username}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedIds.size > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {selectedIds.size} selected {selectedIds.size >= MAX_SELECTION && "(max)"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {users
                    .filter((u) => selectedIds.has(u.public_id))
                    .map((u) => (
                      <span
                        key={u.public_id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg"
                      >
                        {u.full_name || u.username}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleUser(u.public_id);
                          }}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200/40 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={selectedIds.size === 0 || adding}
              className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
            >
              {adding && <Loader2 size={16} className="animate-spin" />}
              {adding
                ? "Adding..."
                : `Add ${selectedIds.size > 0 ? `(${selectedIds.size})` : "Members"}`}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>,
    document.body
  );
};

export default AddMemberModal;
