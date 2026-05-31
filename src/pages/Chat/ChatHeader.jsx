import React, { useState } from "react";
import { Search, MoreVertical, Users, Sun, Moon } from "lucide-react";
import ChatOptionsMenu from "../../components/chat/ChatOptionsMenu";
import ChatInfoModal from "../../components/chat/ChatInfoModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { updateChat } from "../../api/chat";
import { getErrorMessage } from "../../api/utils";
import { useToast } from "../../components/ui/ToastContainer";
import { useTheme } from "../../context/ThemeContext";
import { hasProfilePhoto } from "../../utils/permissions";
import Avatar from "../../components/ui/Avatar";

const ChatHeader = ({ chat, currentUser, onCloseChat, onDeleteChat, onExitGroup, onAddMember, onRemoveMember, onGroupUpdated }) => {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [updating, setUpdating] = useState(false);

  if (!chat) {
    return (
      <div className="px-6 py-4 border-b border-slate-200/50 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
        <p className="text-slate-400 dark:text-slate-500 font-medium">Select a conversation</p>
      </div>
    );
  }

  const getDisplayName = () => {
    if (chat.is_group) {
      return chat.name?.trim() || "Unnamed Group";
    }

    const others = chat.members?.filter(
      (m) => m.user.public_id !== currentUser.public_id
    );

    if (others?.length > 0) {
      return others[0].user.username;
    }

    return "Direct Chat";
  };

  const getOtherUser = () => {
    if (chat.is_group) return null;
    return chat.members?.find((m) => m.user.public_id !== currentUser.public_id)?.user || null;
  };

  const displayName = getDisplayName();

  const handleSaveGroupName = async () => {
    const name = groupName.trim();
    if (!name || !chat?.cuid) return;
    setUpdating(true);
    try {
      const updatedChat = await updateChat(chat.cuid, { name });
      setShowEditModal(false);
      setShowMenu(false);
      onGroupUpdated?.(updatedChat);
      addToast("Group name updated!", "success");
    } catch (err) {
      setShowEditModal(false);
      addToast(getErrorMessage(err), "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenEdit = () => {
    setGroupName(chat?.name || "");
    setShowEditModal(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveGroupName();
    }
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-slate-200/40 dark:border-gray-700 shadow-sm relative z-10">
      <div
        className={`flex items-center gap-4 ${chat.is_group ? "cursor-pointer" : ""}`}
        onClick={() => { if (chat.is_group) setShowChatInfo(true); }}
      >
        <Avatar
          src={!chat.is_group && hasProfilePhoto(getOtherUser()) ? getOtherUser().profile_photo : null}
          name={displayName}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-lg"
          textClassName="text-base font-bold"
        />

        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white truncate">
            {displayName}
          </h3>

          <div className="flex items-center gap-2">
            {chat.is_group ? (
              <>
                <Users size={13} className="text-slate-400 dark:text-slate-500" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{chat.members?.length || 0} members</p>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active now</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          onClick={toggleTheme}
          className="p-3 sm:p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun size={20} className="text-yellow-500" />
          ) : (
            <Moon size={20} className="text-slate-500" />
          )}
        </button>
        <button
          aria-label="Search"
          onClick={() => setShowSearch(!showSearch)}
          className="p-3 sm:p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-all"
        >
          <Search size={20} />
        </button>
        <button
          aria-label="More options"
          onClick={() => setShowMenu(!showMenu)}
          className="p-3 sm:p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-all"
        >
          <MoreVertical size={20} />
        </button>

        <ChatOptionsMenu
          chat={chat}
          currentUser={currentUser}
          isOpen={showMenu}
          onClose={() => setShowMenu(false)}
          onDeleteChat={onDeleteChat}
          onCloseChat={() => {
            setShowMenu(false);
            onCloseChat?.();
          }}
          onExitGroup={onExitGroup}
          onAddMember={onAddMember}
          onRemoveMember={onRemoveMember}
          onEditGroup={handleOpenEdit}
          onChatInfo={() => { setShowMenu(false); setShowChatInfo(true); }}
        />

        <ConfirmDialog
          open={showEditModal}
          onOpenChange={(open) => { setShowEditModal(open); if (!open) setGroupName(""); }}
          title="Edit Group"
          description="Enter a new name for this group."
          confirmText={updating ? "Saving..." : "Save"}
          cancelText="Cancel"
          onConfirm={handleSaveGroupName}
          confirmVariant="primary"
          loading={updating}
        >
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="w-full px-4 py-3 border border-slate-200 dark:border-gray-600 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </ConfirmDialog>

        <ChatInfoModal
          chatId={chat?.cuid}
          isOpen={showChatInfo}
          onClose={() => setShowChatInfo(false)}
          onAddMember={onAddMember}
          onRemoveMember={onRemoveMember}
        />
      </div>
    </div>
  );
};

export default ChatHeader;