// import React, { useEffect, useState } from "react";
// import { getMyChats } from "../../api/chat";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";

// const ChatList = () => {
//   const { token, user } = useAuth();
//   const [chats, setChats] = useState([]);
//   const navigate = useNavigate();
//   const { chatId } = useParams(); // current chat

//   useEffect(() => {
//     const fetchChats = async () => {
//       if (!token) return;
//       try {
//         const data = await getMyChats(token);
//         setChats(data || []);
//       } catch (err) {
//         console.log("Error fetching chats:", err);
//       }
//     };
//     fetchChats();
//   }, [token]);

//   return (
//     <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
//       <h2 className="px-4 py-3 text-gray-700 font-semibold border-b border-gray-100">
//         Chats
//       </h2>
//       <div className="flex flex-col divide-y divide-gray-100">
//         {chats.length === 0 && (
//           <p className="text-gray-400 text-sm px-4 py-3">No chats found</p>
//         )}
//         {chats.map((chat) => (
//           <div
//             key={chat.id}
//             onClick={() => navigate(`/chat/${chat.id}`)}
//             className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
//               chat.id === chatId ? "bg-blue-50" : ""
//             }`}
//           >
//             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
//               {chat.is_group ? "G" : chat.members.find(m => m.id !== user.id)?.username[0]?.toUpperCase()}
//             </div>
//             <div className="flex flex-col">
//               <span className="text-gray-800 font-medium">
//                 {chat.is_group
//                   ? chat.name
//                   : chat.members.find((m) => m.id !== user.id)?.username || "Unknown"}
//               </span>
//               <span className="text-gray-400 text-sm truncate">
//                 {chat.last_message?.content || "No messages yet"}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChatList;
