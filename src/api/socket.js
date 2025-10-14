// src/api/socket.js
export const connectToChatSocket = (chatId, token, onMessage) => {
  const socketUrl = `ws://localhost:8000/ws/chat/${chatId}?token=${token}`;
  const socket = new WebSocket(socketUrl);

  socket.onopen = () => console.log("✅ WebSocket connected:", chatId);
  socket.onclose = () => console.log("❌ WebSocket closed:", chatId);
  socket.onerror = (err) => console.error("⚠️ WebSocket error:", err);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    } catch (e) {
      console.error("Invalid WS message:", e);
    }
  };

  return socket;
};
