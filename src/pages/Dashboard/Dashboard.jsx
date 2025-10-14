import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
// import { getMyChats } from "../../api/chat";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!token) return;
      try {
        const data = await getMyChats(token);
        setChats(data.chats || []);
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };
    fetchChats();
  }, [token]);

  const firstChatId = chats.length > 0 ? chats[0].id : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Ready to start chatting or check your profile?
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              // onClick={() => {
              //   if (firstChatId) navigate(`/chat/${firstChatId}`);
              //   else alert("No chats available yet!");
              // }}
              onClick={() => navigate("/chats")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Open Chat
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              View Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
