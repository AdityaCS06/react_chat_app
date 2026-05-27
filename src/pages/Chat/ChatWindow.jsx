import React, { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "../../components/chat/MessageBubble";
import MessageOptionsMenu from "../../components/chat/MessageOptionsMenu";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { getMessages, updateMessageStatus, deleteMessageForEveryone, deleteMessageForMe, editMessage } from "../../api/message";
import { connectToChatSocket } from "../../api/socket";
import { getErrorMessage } from "../../api/utils";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";
import { hasProfilePhoto } from "../../utils/permissions";

const ChatWindow = ({ chat, onCloseChat, onDeleteChat, onExitGroup, onAddMember, onRemoveMember, onLogout, onGroupUpdated }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [menuState, setMenuState] = useState({ isOpen: false, message: null, position: { x: 0, y: 0 } });
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null });
  const [deleting, setDeleting] = useState(false);

  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const isFetchingRef = useRef(false);
  const paginationStateRef = useRef(null);
  const initialLoadRef = useRef(true);
  const deleteTargetRef = useRef(null);
  const messagesRef = useRef([]);
  messagesRef.current = messages;

  const fetchMessages = useCallback(
    async (replace = false, limit = 50, offset = 0) => {
      if (!chat?.cuid || isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);
      try {
        const res = await getMessages(chat.cuid, limit, offset);
        const newMessages = (res.messages || []).filter((msg) => msg.muid);
        const reversed = [...newMessages].reverse();
        setMessages((prev) =>
          replace ? reversed : [...reversed, ...prev]
        );
        setHasMore(newMessages.length === limit);
      } catch {
        addToast("Failed to load messages", "error");
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [chat?.cuid, addToast]
  );

  const setupWebSocket = useCallback(() => {
    if (!chat?.cuid) return;
    if (socketRef.current) {
      socketRef.current.close();
    }
    socketRef.current = connectToChatSocket(chat.cuid, null, (data) => {
      setMessages((prev) => {
        const tempMsg = prev.find((m) => m.muid?.startsWith("temp-") && m.content === data.content && m.sender_id === data.sender_id);
        if (tempMsg) {
          return prev.map((m) => (m.muid === tempMsg.muid ? { ...m, muid: data.muid } : m));
        }
        if (data.muid) {
          return [...prev, data];
        }
        return prev;
      });
    });
  }, [chat?.cuid]);

  useEffect(() => {
    if (!chat) return;
    initialLoadRef.current = true;
    setMessages([]);
    fetchMessages(true);
    setupWebSocket();
    return () => socketRef.current?.close();
  }, [chat, fetchMessages, setupWebSocket]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0) return;

    if (paginationStateRef.current !== null) {
      const { scrollHeight: oldHeight, scrollTop: oldTop } = paginationStateRef.current;
      el.scrollTop = oldTop + (el.scrollHeight - oldHeight);
      paginationStateRef.current = null;
      return;
    }

    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      el.scrollTop = el.scrollHeight;
      return;
    }

    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (isAtBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length]);

  const handleScroll = (e) => {
    const el = e.target;

    if (el.scrollTop < 80 && hasMore && !loading && !isFetchingRef.current) {
      paginationStateRef.current = {
        scrollHeight: el.scrollHeight,
        scrollTop: el.scrollTop,
      };
      fetchMessages(false, 50, messages.length);
    }
  };

  const markMessagesAsSeen = useCallback(async () => {
    try {
      const unseen = messages.filter(
        (msg) => msg.muid && msg.sender_id !== user.public_id && msg.status !== "seen"
      );
      await Promise.all(
        unseen.map((msg) => updateMessageStatus(chat.cuid, msg.muid, "seen"))
      );
    } catch { /* silent */ }
  }, [messages, user.public_id, chat?.cuid]);

  const handleContextMenu = useCallback((e, msg) => {
    const x = e.clientX;
    const y = e.clientY;
    const viewportWidth = window.innerWidth;
    const menuWidth = 192;
    const menuHeight = 80;
    let adjustedX = x;
    let adjustedY = y;
    if (x + menuWidth > viewportWidth) {
      adjustedX = viewportWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      adjustedY = y - menuHeight - 10;
    }
    setMenuState({
      isOpen: true,
      message: msg,
      position: { x: adjustedX, y: adjustedY },
    });
  }, []);

  const handleReply = useCallback((msg) => {
    const member = chat?.members?.find((m) => m.user.public_id === msg.sender_id);
    const name = msg.sender_name || msg.sender_username || member?.user?.full_name || member?.user?.username || "Unknown";
    setReplyTo({ ...msg, sender_name: name });
  }, [chat]);

  const clearReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleDeleteForMe = useCallback(() => {
    const msg = menuState.message;
    if (!msg?.muid) return;
    const latest = messagesRef.current.find(
      (m) => m.content === msg.content && m.sender_id === msg.sender_id
    );
    deleteTargetRef.current = { muid: latest?.muid || msg.muid };
    setDeleteDialog({ open: true, type: "me" });
  }, [menuState.message]);

  const confirmDeleteForMe = useCallback(async () => {
    const target = deleteTargetRef.current;
    if (!target?.muid || !chat?.cuid) return;
    setDeleting(true);
    try {
      await deleteMessageForMe(chat.cuid, target.muid);
      setMessages((prev) => prev.filter((m) => m.muid !== target.muid));
      setDeleteDialog({ open: false, type: null });
      addToast("Message deleted for you", "success");
    } catch (err) {
      setDeleteDialog({ open: false, type: null });
      addToast(getErrorMessage(err), "error");
    } finally {
      setDeleting(false);
    }
  }, [chat?.cuid, addToast]);

  const handleDeleteForEveryone = useCallback(() => {
    const msg = menuState.message;
    if (!msg?.muid) return;
    const latest = messagesRef.current.find(
      (m) => m.content === msg.content && m.sender_id === msg.sender_id
    );
    deleteTargetRef.current = { muid: latest?.muid || msg.muid };
    setDeleteDialog({ open: true, type: "everyone" });
  }, [menuState.message]);

  const confirmDeleteForEveryone = useCallback(async () => {
    const target = deleteTargetRef.current;
    if (!target?.muid || !chat?.cuid) return;
    setDeleting(true);
    try {
      await deleteMessageForEveryone(chat.cuid, target.muid);
      setMessages((prev) => prev.filter((m) => m.muid !== target.muid));
      setDeleteDialog({ open: false, type: null });
      addToast("Message deleted for everyone", "success");
    } catch (err) {
      setDeleteDialog({ open: false, type: null });
      addToast(getErrorMessage(err), "error");
    } finally {
      setDeleting(false);
    }
  }, [chat?.cuid, addToast]);

  const handleEdit = useCallback(() => {
    const msg = menuState.message;
    if (!msg) return;
    setEditingMessage(msg.muid);
    setEditContent(msg.content);
  }, [menuState.message]);

  const handleSaveEdit = useCallback(async () => {
    if (!editingMessage || !editContent.trim() || !chat?.cuid) return;
    const originalMsg = messages.find((m) => m.muid === editingMessage);
    if (originalMsg && originalMsg.content === editContent.trim()) {
      setEditingMessage(null);
      setEditContent("");
      return;
    }
    try {
      const response = await editMessage(chat.cuid, editingMessage, editContent.trim());
      setMessages((prev) =>
        prev.map((m) =>
          m.muid === editingMessage
            ? { ...m, content: response.content || editContent.trim(), is_edited: true, edited_at: response.edited_at }
            : m
        )
      );
      setEditingMessage(null);
      setEditContent("");
      addToast("Message edited", "success");
    } catch (err) {
      if (err.response?.data?.detail?.status_code === 404) {
        addToast("Message not found", "error");
        setMessages((prev) => prev.filter((m) => m.muid !== editingMessage));
      } else {
        addToast(getErrorMessage(err), "error");
      }
    }
  }, [editingMessage, editContent, chat?.cuid, addToast, messages]);

  const handleCancelEdit = useCallback(() => {
    setEditingMessage(null);
    setEditContent("");
  }, []);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      markMessagesAsSeen();
    }
  }, [messages, loading, markMessagesAsSeen]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-gradient-to-br from-slate-100 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ChatHeader
        chat={chat}
        currentUser={user}
        onCloseChat={onCloseChat}
        onDeleteChat={onDeleteChat}
        onExitGroup={onExitGroup}
        onAddMember={onAddMember}
        onRemoveMember={onRemoveMember}
        onLogout={onLogout}
        onGroupUpdated={onGroupUpdated}
      />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto p-6"
      >
        {loading && messages.length === 0 && (
          <div className="space-y-4 p-4">
            {[1,2,3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                <div className={`h-14 ${i % 2 === 0 ? "w-56" : "w-44"} bg-white/60 dark:bg-gray-700/60 rounded-2xl shadow-sm animate-pulse`} />
              </div>
            ))}
          </div>
        )}

        {messages.map((msg, idx) => {
          const prevMsg = idx > 0 ? messages[idx - 1] : null;
          const sameSender = prevMsg?.sender_id === msg.sender_id;
          const isFirstInGroup = !sameSender;
          const showSender = chat?.is_group && isFirstInGroup;
          const member = chat?.members?.find((m) => m.user.public_id === msg.sender_id);
          const senderName = msg.sender_name || msg.sender_username || member?.user?.full_name || member?.user?.username || "Unknown";
          const senderAvatar = hasProfilePhoto(member?.user) ? member.user.profile_photo : null;

          return (
            <MessageBubble
              key={msg.muid}
              msg={msg}
              isMine={msg.sender_id === user.public_id}
              isGroup={chat?.is_group}
              isFirstInGroup={isFirstInGroup}
              showSender={showSender}
              senderName={senderName}
              senderAvatar={senderAvatar}
              onContextMenu={handleContextMenu}
              onDoubleClick={handleReply}
              isEditing={editingMessage === msg.muid}
              editContent={editContent}
              onEditChange={setEditContent}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              currentUserId={user.public_id}
            />
          );
        })}

        <MessageOptionsMenu
          isOpen={menuState.isOpen}
          onClose={handleCloseMenu}
          onDeleteForMe={handleDeleteForMe}
          onDeleteForEveryone={handleDeleteForEveryone}
          onEdit={handleEdit}
          onReply={() => handleReply(menuState.message)}
          isSender={menuState.message?.sender_id === user.public_id}
          position={menuState.position}
        />
      </div>

      <ChatInput
        chat={chat}
        socketRef={socketRef}
        setMessages={setMessages}
        replyTo={replyTo}
        clearReply={clearReply}
        onMessageSent={() => requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        })}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open, ...(!open ? { type: null } : {}) }))}
        title={deleteDialog.type === "everyone" ? "Delete for everyone?" : "Delete for me?"}
        description={
          deleteDialog.type === "everyone"
            ? "This message will be deleted for everyone in this chat. This action cannot be undone."
            : "This message will be deleted only for you. Others will still be able to see it."
        }
        confirmText={deleteDialog.type === "everyone" ? "Delete for everyone" : "Delete"}
        cancelText="Cancel"
        onConfirm={deleteDialog.type === "everyone" ? confirmDeleteForEveryone : confirmDeleteForMe}
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
};

export default ChatWindow;
