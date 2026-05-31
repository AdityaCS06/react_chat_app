import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Trash2, Ban, Pencil, MessageSquare } from "lucide-react";

const MessageOptionsMenu = ({
  isOpen,
  onClose,
  onDeleteForMe,
  onDeleteForEveryone,
  onEdit,
  onReply,
  isSender,
  position,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={menuRef}
        className="fixed z-50 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-slate-200/40 dark:border-gray-700 overflow-hidden animate-scale-in"
        style={{
          left: position.x,
          top: position.y,
          animation: "scaleIn 0.15s ease-out forwards",
        }}
      >
        <div className="py-1.5">
          <button
            onClick={() => {
              onReply?.();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-150"
          >
            <MessageSquare size={16} className="text-slate-400 dark:text-slate-500" />
            <span className="font-medium">Reply</span>
          </button>

          {isSender && (
            <button
              onClick={() => {
                onEdit?.();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-150"
            >
              <Pencil size={16} className="text-slate-400 dark:text-slate-500" />
              <span className="font-medium">Edit</span>
            </button>
          )}

          <button
            onClick={() => {
              onDeleteForMe();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-150"
          >
            <Ban size={16} className="text-slate-400 dark:text-slate-500" />
            <span className="font-medium">Delete for me</span>
          </button>

          {isSender && (
            <button
              onClick={() => {
                onDeleteForEveryone();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150"
            >
              <Trash2 size={16} className="text-red-500 dark:text-red-400" />
              <span className="font-medium">Delete for everyone</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.15s ease-out forwards;
        }
      `}</style>
    </>,
    document.body
  );
};

export default MessageOptionsMenu;