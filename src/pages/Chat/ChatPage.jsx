// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { getChatDetails, getMessages, sendMessage } from "../../api/chat";

// const ChatPage = ({ chatId }) => {
//   // const { chatId } = useParams();
//   const { token, user } = useAuth();
//   const [chat, setChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const messagesEndRef = useRef(null);

//   // Scroll to bottom when messages update
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // Fetch chat details
//   useEffect(() => {
//     const fetchChat = async () => {
//       try {
//         const data = await getChatDetails(chatId, token);
//         setChat(data);
//       } catch (err) {
//         console.log("Error fetching chat details:", err);
//       }
//     };
//     fetchChat();
//   }, [chatId, token]);

//   // Fetch messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const data = await getMessages(chatId, token, 50, 0);
//         setMessages(data || []);
//       } catch (err) {
//         console.log("Error fetching messages:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMessages();
//   }, [chatId, token]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       const msg = await sendMessage(chatId, { content: newMessage, message_type: "text" }, token);
//       setMessages((prev) => [...prev, msg]);
//       setNewMessage("");
//     } catch (err) {
//       console.log("Error sending message:", err);
//     }
//   };

//   if (loading) return <p className="p-6 text-gray-600">Loading chat...</p>;

//   return (
//     <div className="flex flex-col h-full">
//       {/* Chat Header */}
//       <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
//         <h2 className="text-lg font-semibold">
//           {chat?.is_group ? chat.name : chat.members.find(m => m.id !== user.id)?.username}
//         </h2>
//         <span className="text-gray-500 text-sm">{chat?.members.length} members</span>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`flex ${msg.sender.id === user.id ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`px-4 py-2 rounded-lg max-w-xs break-words ${
//                 msg.sender.id === user.id ? "bg-blue-500 text-white" : "bg-white border border-gray-200"
//               }`}
//             >
//               <p>{msg.content}</p>
//               <span className="text-xs text-gray-400 mt-1 block">
//                 {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//               </span>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef}></div>
//       </div>

//       {/* Message Input */}
//       <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-2">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//           className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
//         />
//         <button
//           onClick={handleSendMessage}
//           className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
