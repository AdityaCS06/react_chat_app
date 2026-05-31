import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Users, Shield, Crown, Check, Loader2, AlertTriangle } from "lucide-react";
import { removeMembers, getChatDetails } from "../../api/chat";
import { getErrorMessage } from "../../api/utils";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/ToastContainer";
import { hasProfilePhoto } from "../../utils/permissions";
import Avatar from "../ui/Avatar";

const MAX_SELECTION = 10;

const RemoveMemberModal = ({ chat, isOpen, onClose, onGroupUpdated }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [removing, setRemoving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const creatorId = chat?.created_by?.public_id;
  const currentUserId = user?.public_id;

  useEffect(() => {
    if (!isOpen) return;
    setSelectedIds(new Set());
    setShowConfirm(false);
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (showConfirm) setShowConfirm(false);
        else onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, showConfirm]);

  const toggleMember = useCallback(
    (publicId) => {
      if (publicId === creatorId || publicId === currentUserId) return;
      setSelectedIds((prev) => {
        if (prev.has(publicId)) {
          const next = new Set(prev);
          next.delete(publicId);
          return next;
        }
        if (prev.size >= MAX_SELECTION) {
          addToast(`You can only remove up to ${MAX_SELECTION} members at a time`, "warning");
          return prev;
        }
        const next = new Set(prev);
        next.add(publicId);
        return next;
      });
    },
    [creatorId, currentUserId, addToast]
  );

  const canRemove = (member) => {
    const pid = member.user.public_id;
    if (pid === creatorId) return false;
    if (pid === currentUserId) return false;
    return true;
  };

  const getDisabledReason = (member) => {
    const pid = member.user.public_id;
    if (pid === creatorId) return "Group creator";
    if (pid === currentUserId) return "Use 'Exit group' to leave";
    return null;
  };

  const getRoleBadge = (member) => {
    const pid = member.user.public_id;
    if (pid === creatorId) {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
          <Crown size={12} />
          Owner
        </span>
      );
    }
    if (member.role === "admin") {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
          <Shield size={12} />
          Admin
        </span>
      );
    }
    return null;
  };

  const handleRemove = async () => {
    if (selectedIds.size === 0 || !chat?.cuid) return;
    setRemoving(true);
    try {
      await removeMembers(chat.cuid, [...selectedIds]);
      addToast(
        `${selectedIds.size} member${selectedIds.size > 1 ? "s" : ""} removed`,
        "success"
      );
      const updated = await getChatDetails(chat.cuid);
      onGroupUpdated?.(updated);
      onClose();
    } catch (err) {
      addToast(getErrorMessage(err), "error");
    } finally {
      setRemoving(false);
      setShowConfirm(false);
    }
  };

  if (!isOpen) return null;

  const members = chat?.members || [];

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={() => {
          if (!showConfirm) onClose();
        }}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-slate-200/40 dark:border-gray-700 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/40 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Remove Members
              </h2>
              <span className="text-xs text-slate-400 dark:text-gray-500 bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded-full font-medium">
                {members.length} total
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={15} className="text-slate-400" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select members to remove
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200/50 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-700/50">
              {members.map((member) => {
                const mu = member.user;
                const pid = mu.public_id;
                const isSelected = selectedIds.has(pid);
                const removable = canRemove(member);
                const disabledReason = getDisabledReason(member);

                return (
                  <div
                    key={pid}
                    onClick={() => toggleMember(pid)}
                    className={`flex items-center gap-3 p-3 transition-all duration-200 border-b border-slate-100/50 dark:border-gray-600 last:border-0 ${
                      !removable
                        ? "opacity-50 cursor-not-allowed"
                        : isSelected
                          ? "bg-red-50/80 dark:bg-red-900/20 cursor-pointer"
                          : "hover:bg-red-50/30 dark:hover:bg-red-900/10 cursor-pointer"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        !removable
                          ? "border-slate-200 dark:border-gray-600"
                          : isSelected
                            ? "bg-red-500 border-red-500"
                            : "border-slate-300 dark:border-gray-500"
                      }`}
                    >
                      {isSelected && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                    <Avatar
                      src={
                        hasProfilePhoto(mu) ? mu.profile_photo : null
                      }
                      name={mu.full_name || mu.username}
                      className="w-10 h-10 rounded-xl shadow-sm flex-shrink-0"
                      textClassName="text-sm font-bold"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {mu.full_name || mu.username}
                        </p>
                        {getRoleBadge(member)}
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        @{mu.username}
                        {pid === currentUserId && (
                          <span className="ml-1.5 text-blue-500 dark:text-blue-400 font-medium">
                            (you)
                          </span>
                        )}
                      </p>
                      {!removable && disabledReason && (
                        <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-0.5">
                          {disabledReason}
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
                  {members
                    .filter((m) => selectedIds.has(m.user.public_id))
                    .map((m) => (
                      <span
                        key={m.user.public_id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded-lg"
                      >
                        {m.user.full_name || m.user.username}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMember(m.user.public_id);
                          }}
                          className="hover:text-red-600 transition-colors"
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
              onClick={() => setShowConfirm(true)}
              disabled={selectedIds.size === 0}
              className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-xl hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
            >
              Remove {selectedIds.size > 0 && `(${selectedIds.size})`}
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-slate-200 dark:border-gray-700 animate-fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Remove members?
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {selectedIds.size} member{selectedIds.size > 1 ? "s" : ""} will be removed from{" "}
                    <span className="font-medium">{chat?.name || "the group"}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={removing}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-gray-700 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                disabled={removing}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {removing && <Loader2 size={16} className="animate-spin" />}
                {removing ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default RemoveMemberModal;
