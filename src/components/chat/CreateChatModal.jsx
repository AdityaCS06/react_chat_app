// import React, { useState } from "react";
// import { createChat } from "../../api/chat";
// import { useAuth } from "../../context/AuthContext";
// import { useToast } from "../../components/ui/ToastContainer";

// const CreateChatModal = ({ onClose, onChatCreated }) => {
//   const { token, user } = useAuth();
//   const { addToast } = useToast();

//   const [chatName, setChatName] = useState("");
//   const [isGroup, setIsGroup] = useState(false);
//   const [members, setMembers] = useState(""); // comma-separated user IDs
//   const [loading, setLoading] = useState(false);

//   const handleCreate = async () => {
//     if (!isGroup && !chatName.trim()) {
//       addToast("Enter username to start 1:1 chat", "error");
//       return;
//     }
//     if (isGroup && (!chatName.trim() || !members.trim())) {
//       addToast("Enter group name and member IDs", "error");
//       return;
//     }

//     const payload = {
//       is_group: isGroup,
//       name: isGroup ? chatName.trim() : null,
//       member_ids: isGroup
//         ? members.split(",").map((id) => id.trim())
//         : [chatName.trim()],
//     };

//     setLoading(true);
//     try {
//       const newChat = await createChat(payload, token);
//       addToast("Chat created successfully!", "success");
//       onChatCreated(newChat);
//       onClose();
//     } catch (err) {
//       addToast(err.response?.data?.detail || "Failed to create chat", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
//       <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">{isGroup ? "Create Group Chat" : "Start 1:1 Chat"}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-lg font-bold"
//           >
//             &times;
//           </button>
//         </div>

//         {/* Group Chat Toggle */}
//         <div className="mb-4">
//           <label className="flex items-center gap-2 cursor-pointer select-none">
//             <input
//               type="checkbox"
//               checked={isGroup}
//               onChange={() => setIsGroup(!isGroup)}
//               className="form-checkbox"
//             />
//             Group Chat
//           </label>
//         </div>

//         {/* Chat Name / Username */}
//         <div className="mb-4">
//           <label className="block text-gray-600 mb-1">
//             {isGroup ? "Group Name" : "Username"}
//           </label>
//           <input
//             type="text"
//             placeholder={isGroup ? "Enter group name" : "Enter username"}
//             value={chatName}
//             onChange={(e) => setChatName(e.target.value)}
//             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
//           />
//         </div>

//         {/* Members input for group */}
//         {isGroup && (
//           <div className="mb-4">
//             <label className="block text-gray-600 mb-1">Member IDs (comma-separated)</label>
//             <input
//               type="text"
//               placeholder="user1,user2,user3"
//               value={members}
//               onChange={(e) => setMembers(e.target.value)}
//               className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
//             />
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleCreate}
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             {loading ? "Creating..." : "Create"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateChatModal;
