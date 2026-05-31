const MAX_RETRIES = 5;
const BASE_DELAY = 1000;

const getToken = () => {
  return localStorage.getItem("access_token");
};

export const connectToChatSocket = (chatId, _token, onMessage) => {
  const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_URL;
  let socket = null;
  let retries = 0;
  let disconnected = false;

  const connect = () => {
    const token = getToken();
    if (!token) {
      if (!disconnected && retries < MAX_RETRIES) {
        retries++;
        setTimeout(connect, BASE_DELAY * Math.pow(2, retries - 1));
      }
      return;
    }
    const socketUrl = `${SOCKET_BASE_URL}/chat/${chatId}?token=${token}`;
    socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      retries = 0;
    };

    socket.onclose = () => {
      if (!disconnected && retries < MAX_RETRIES) {
        const delay = BASE_DELAY * Math.pow(2, retries);
        retries++;
        setTimeout(connect, delay);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      } catch (e) {
        console.error("Invalid WS message:", e);
      }
    };
  };

  connect();

  return {
    close: () => {
      disconnected = true;
      socket?.close();
    },
    send: (data) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(data);
        return true;
      }
      return false;
    },
  };
};
