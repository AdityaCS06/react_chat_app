// // src/components/chat/MessageBubble.jsx
// import React from "react";
// import { timeAgo } from "../../utils/timeAgo"; // reuse timeAgo function

// const MessageBubble = ({ message, isOwn }) => {
//   return (
//     <div className={`flex mb-2 ${isOwn ? "justify-end" : "justify-start"}`}>
//       <div
//         className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl break-words ${
//           isOwn
//             ? "bg-blue-600 text-white rounded-br-none"
//             : "bg-gray-200 text-gray-800 rounded-bl-none"
//         }`}
//       >
//         <p>{message.content}</p>
//         <span className="text-xs text-gray-400 block mt-1 text-right">
//           {timeAgo(message.created_at)}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default MessageBubble;
