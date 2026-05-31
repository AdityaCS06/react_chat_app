import React, { useEffect, useState, useRef, useCallback, useLayoutEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import DateSeparator from "../../components/chat/DateSeparator";
import MessageBubble from "../../components/chat/MessageBubble";
import MessageOptionsMenu from "../../components/chat/MessageOptionsMenu";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { getMessages, updateMessageStatus, deleteMessageForEveryone, deleteMessageForMe, editMessage } from "../../api/message";
import { connectToChatSocket } from "../../api/socket";
import { getErrorMessage } from "../../api/utils";
import { formatDateSeparator, isSameDay } from "../../utils/chatDates";
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
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const isFetchingRef = useRef(false);
  const paginationStateRef = useRef(null);
  const initialLoadRef = useRef(true);
  const initialFetchCompleteRef = useRef(false);
  const deleteTargetRef = useRef(null);
  const messagesRef = useRef([]);
  messagesRef.current = messages;

  const getSenderId = (msg) => msg?.sender?.public_id ?? msg?.sender_id;

  const scrollToBottom = useCallback((behavior = "smooth") => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior,
    });
  }, []);

  const updateScrollButtonVisibility = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollToBottom(distanceFromBottom > 180);
  }, []);

  const fetchMessages = useCallback(
    async (replace = false, limit = 50, offset = 0) => {
      if (!chat?.cuid || isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);
      try {
        const res = await getMessages(chat.cuid, limit, offset);
        const newMessages = (res.messages || []).filter((msg) => msg.muid);
        const sorted = [...newMessages].reverse().sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        setMessages((prev) => {
          if (replace) {
            initialFetchCompleteRef.current = true;
            return sorted;
          }
          return [...sorted, ...prev];
        });
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
      if (data.type !== "message" || !data.muid) return;

      setMessages((prev) => {
        if (!initialFetchCompleteRef.current) return prev;

        const tempMsg = prev.find((m) => m.muid?.startsWith("temp-") && m.content === data.content && m.sender?.public_id === data.sender?.public_id);
        if (tempMsg) {
          return prev.map((m) => (m.muid === tempMsg.muid ? { ...m, muid: data.muid } : m));
        }

        const msgDate = new Date(data.created_at).getTime();
        if (isNaN(msgDate)) return [...prev, data];
        const idx = prev.findIndex((m) => new Date(m.created_at).getTime() > msgDate);
        if (idx === -1) return [...prev, data];
        const copy = [...prev];
        copy.splice(idx, 0, data);
        return copy;
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
    updateScrollButtonVisibility();
  }, [messages.length, updateScrollButtonVisibility]);

  const handleScroll = (e) => {
    const el = e.target;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollToBottom(distanceFromBottom > 180);

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
        (msg) => msg.muid && getSenderId(msg) !== user.public_id && msg.status !== "seen"
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
      adjustedX = Math.max(8, viewportWidth - menuWidth - 10);
    }
    if (y + menuHeight > window.innerHeight) {
      adjustedY = Math.max(8, y - menuHeight - 10);
    }
    setMenuState({
      isOpen: true,
      message: msg,
      position: { x: adjustedX, y: adjustedY },
    });
  }, []);

  const handleReply = useCallback((msg) => {
    const member = chat?.members?.find((m) => m.user.public_id === getSenderId(msg));
    const name = msg.sender?.full_name || msg.sender?.username || member?.user?.full_name || member?.user?.username || "Unknown";
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
      (m) => m.content === msg.content && getSenderId(m) === getSenderId(msg)
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
      (m) => m.content === msg.content && getSenderId(m) === getSenderId(msg)
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

  const renderedMessages = useMemo(() => {
    return messages.map((msg, idx) => {
      const prevMsg = idx > 0 ? messages[idx - 1] : null;
      const showDateSeparator = !prevMsg || !isSameDay(prevMsg.created_at, msg.created_at);
      const msgSenderId = getSenderId(msg);
      const sameSender = getSenderId(prevMsg) === msgSenderId;
      const isFirstInGroup = !sameSender;
      const showSender = chat?.is_group && isFirstInGroup;
      const member = chat?.members?.find((m) => m.user.public_id === msgSenderId);
      const senderName = msg.sender?.full_name || msg.sender?.username || member?.user?.full_name || member?.user?.username || "Unknown";
      const senderAvatar = msg.sender?.profile_photo || (hasProfilePhoto(member?.user) ? member.user.profile_photo : null);

      return (
        <React.Fragment key={msg.muid}>
          {showDateSeparator && (
            <DateSeparator label={formatDateSeparator(msg.created_at)} />
          )}
          <MessageBubble
            msg={msg}
            isMine={getSenderId(msg) === user.public_id}
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
        </React.Fragment>
      );
    });
  }, [
    messages,
    chat?.is_group,
    chat?.members,
    user.public_id,
    handleContextMenu,
    handleReply,
    editingMessage,
    editContent,
    handleSaveEdit,
    handleCancelEdit,
  ]);

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-gradient-to-br from-slate-100 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6"
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

        {renderedMessages}

        <MessageOptionsMenu
          isOpen={menuState.isOpen}
          onClose={handleCloseMenu}
          onDeleteForMe={handleDeleteForMe}
          onDeleteForEveryone={handleDeleteForEveryone}
          onEdit={handleEdit}
          onReply={() => handleReply(menuState.message)}
          isSender={getSenderId(menuState.message) === user.public_id}
          position={menuState.position}
        />
      </div>

      {showScrollToBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom("smooth")}
          aria-label="Scroll to latest messages"
          className="absolute bottom-24 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 text-slate-600 shadow-lg shadow-slate-300/30 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-800/95 dark:text-slate-200 dark:shadow-black/30 dark:hover:bg-gray-800 dark:hover:text-indigo-300 sm:bottom-24 sm:right-6"
        >
          <ChevronDown size={20} strokeWidth={2.5} />
        </button>
      )}

      <ChatInput
        chat={chat}
        socketRef={socketRef}
        setMessages={setMessages}
        replyTo={replyTo}
        clearReply={clearReply}
        onMessageSent={() => requestAnimationFrame(() => {
          scrollToBottom("smooth");
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
