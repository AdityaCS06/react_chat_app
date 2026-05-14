import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Pin,
  BellOff,
  Info,
  UserPlus,
  UserMinus,
  Pencil,
  DoorOpen,
  Trash2,
  X,
} from "lucide-react";

const ChatOptionsMenu = ({
  chat,
  currentUser,
  isOpen,
  onClose,
  onDeleteChat,
  onCloseChat,
  onExitGroup,
  onAddMember,
  onRemoveMember,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const MenuItem = ({ icon: Icon, label, onClick, danger = false }) => (
    <button
      onClick={() => {
        onClick?.();
        onClose();
      }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-all duration-200 hover:bg-slate-100 active:scale-[0.98] ${
        danger ? "text-red-500 hover:bg-red-50" : "text-slate-700"
      }`}
    >
      <Icon size={18} className={danger ? "text-red-500" : "text-slate-400"} />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-40 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={menuRef}
        className="fixed right-4 top-[72px] z-50 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/40 overflow-hidden animate-scale-in"
        style={{ animation: "scaleIn 0.2s ease-out forwards" }}
      >
        <div className="py-2">
          <MenuItem
            icon={Pin}
            label="Pin chat"
            onClick={() => console.log("Pin chat")}
          />
          <MenuItem
            icon={BellOff}
            label="Mute notifications"
            onClick={() => console.log("Mute notifications")}
          />
          <MenuItem
            icon={Info}
            label="Chat info"
            onClick={() => console.log("Chat info")}
          />

          <div className="h-px bg-slate-200/60 my-2" />

          {chat?.is_group ? (
            <>
              <MenuItem
                icon={UserPlus}
                label="Add member"
                onClick={onAddMember}
              />
              <MenuItem
                icon={UserMinus}
                label="Remove member"
                onClick={onRemoveMember}
              />
              <MenuItem
                icon={Pencil}
                label="Edit group"
                onClick={() => console.log("Edit group")}
              />
              <div className="h-px bg-slate-200/60 my-2" />
              <MenuItem
                icon={DoorOpen}
                label="Exit group"
                onClick={onExitGroup}
                danger
              />
            </>
          ) : null}

          <MenuItem
            icon={Trash2}
            label="Delete chat"
            onClick={onDeleteChat}
            danger
          />
          <MenuItem
            icon={X}
            label="Close chat"
            onClick={onCloseChat}
          />
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
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

export default ChatOptionsMenu;