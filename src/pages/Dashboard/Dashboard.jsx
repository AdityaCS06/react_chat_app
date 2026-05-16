import React, { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyChats } from "../../api/chat";
import { getUserStats, getMessageTrends } from "../../api/dashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoadingChats(true);
      setLoadingStats(true);

      try {
        const [chatsData, statsData, trendsData] = await Promise.all([
          getMyChats(token, 5, 0),
          getUserStats(token),
          getMessageTrends(token, 7)
        ]);
        console.log("Stats API response:", statsData);
        console.log("Trends API response:", trendsData);
        setChats(chatsData.chats || []);
        setStats(statsData);
        setTrends(trendsData.trends || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
        }
      } finally {
        setLoadingChats(false);
        setLoadingStats(false);
      }
    };
    fetchData();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getChatName = (chat) => {
    if (chat.name) return chat.name;
    const otherUser = chat.participants?.find(p => p.id !== user?.id);
    return otherUser?.username || "Unknown";
  };

  const getChatAvatar = (chat) => {
    if (chat.name) {
      return chat.name.charAt(0).toUpperCase();
    }
    const otherUser = chat.participants?.find(p => p.id !== user?.id);
    return otherUser?.username?.charAt(0).toUpperCase() || "?";
  };

  const ActionCard = ({ icon, title, subtitle, onClick, colorClass }) => (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colorClass}`}
    >
      <div className="relative z-10 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/80">{subtitle}</p>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-500" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {getGreeting()}!
                </h1>
                <p className="text-gray-500 text-sm">
                  Welcome back to <span className="text-blue-600 font-semibold">Convo</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 ml-1">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <ActionCard
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
                title="Open Chats"
                subtitle="View all conversations"
                onClick={() => navigate("/chats")}
                colorClass="bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200"
              />
              <ActionCard
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                title="Your Profile"
                subtitle="Manage your account"
                onClick={() => navigate("/profile")}
                colorClass="bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-200"
              />
              <ActionCard
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                }
                title="New Chat"
                subtitle="Start a new conversation"
                onClick={() => navigate("/create-chat")}
                colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200"
              />
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 ml-1">Your Stats</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_messages || 0}</p>
                <p className="text-sm text-gray-500">Total Messages</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_chats || 0}</p>
                <p className="text-sm text-gray-500">Total Chats</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_contacts || 0}</p>
                <p className="text-sm text-gray-500">Contacts</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.groups_created || 0}</p>
                <p className="text-sm text-gray-500">Groups Created</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.messages_this_week || 0}</p>
                <p className="text-sm text-gray-500">This Week</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.messages_this_month || 0}</p>
                <p className="text-sm text-gray-500">This Month</p>
              </div>
            </div>
          </div>

          {chats.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4 ml-1">
                <h2 className="text-lg font-semibold text-gray-700">Recent Chats</h2>
                <button onClick={() => navigate("/chats")} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {chats.slice(0, 5).map((chat) => (
                  <div
                    key={chat.cuid}
                    onClick={() => navigate(`/chats/${chat.cuid}`)}
                    className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {getChatAvatar(chat)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{getChatName(chat)}</h3>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {chat.last_message?.created_at ? formatTime(chat.last_message.created_at) : ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.last_message?.content || "No messages yet"}
                      </p>
                    </div>
                    {chat.unread_count > 0 && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">
                        {chat.unread_count}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {trends.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 ml-1">Message Activity (Last 7 Days)</h2>
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-end justify-between gap-2 h-32">
                  {trends.map((day, index) => {
                    const maxCount = Math.max(...trends.map(t => t.count), 1);
                    const height = (day.count / maxCount) * 100;
                    const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full flex flex-col items-center justify-end h-24">
                          <span className="text-xs font-medium text-gray-600 mb-1">{day.count}</span>
                          <div
                            className="w-full max-w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                            style={{ height: `${Math.max(height, 4)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{dayName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Getting Started</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Join Groups</h3>
                <p className="text-sm text-gray-500">Create or join group chats with friends and family</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure Messaging</h3>
                <p className="text-sm text-gray-500">Your conversations are private and encrypted</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Real-time Chat</h3>
                <p className="text-sm text-gray-500">Send and receive messages instantly</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;