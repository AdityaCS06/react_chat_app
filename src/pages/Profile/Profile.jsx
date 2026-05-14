import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../api/auth";
import { useToast } from "../../components/ui/ToastContainer";
import { timeAgo } from "../../utils/timeAgo";

const Profile = () => {
  const { user, token, setUser } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user && token) {
        setLoading(true);
        try {
          const data = await getProfile(token);
          setUser(data);
        } catch (err) {
          addToast("Failed to load profile", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [token, user, setUser, addToast]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-lg animate-pulse">Loading profile...</p>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500 text-lg">Please login to view your profile.</p>
        </div>
      </div>
    );

  const profilePhotoUrl = user.profile_photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const InfoItem = ({ label, value, isHighlight }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className={`font-semibold ${isHighlight ? "text-blue-600" : "text-gray-800"}`}>{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-500 mt-1">Manage your account information</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-white/50">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={profilePhotoUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.76-.9l.814-1.18A2 2 0 0111 7.94V13a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h.93a2 2 0 001.76-.9l.814-1.18A2 2 0 019 5.06V7a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2h.93a2 2 0 001.76-.9l.814-1.18A2 2 0 0111 3.06V5a2 2 0 012-2h2a2 2 0 012 2v2.06a2 2 0 01-.764 1.598l-.814 1.18A2 2 0 0011.93 12H13a2 2 0 002-2V9a2 2 0 00-2-2h-.93a2 2 0 00-1.76.9l-.814 1.18A2 2 0 017 10.06V13a2 2 0 002 2h2a2 2 0 002-2v-2.94a2 2 0 00-.764-1.598l-.814-1.18A2 2 0 0011.93 7H11a2 2 0 00-2 2v2a2 2 0 002 2h.93a2 2 0 001.76-.9l.814-1.18A2 2 0 0017 6.06V5a2 2 0 012-2h2a2 2 0 012 2v1.06a2 2 0 01-.764 1.598l-.814 1.18A2 2 0 0015.93 10H15a2 2 0 01-2-2V7a2 2 0 012-2h.93a2 2 0 001.76.9l.814 1.18A2 2 0 0021 8.94V11a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2.06a2 2 0 00.764-1.598l.814-1.18A2 2 0 0015.93 4H15a2 2 0 00-2 2v2a2 2 0 002 2h.93a2 2 0 001.76-.9l.814-1.18A2 2 0 0017 4.06V3a2 2 0 012-2h2a2 2 0 012 2v1.06a2 2 0 01-.764 1.598l-.814 1.18A2 2 0 0015.93 7H15a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user.full_name || user.username}</h2>
                <p className="text-gray-500">@{user.username}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-sm text-gray-500">Last seen {timeAgo(user.last_seen)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Account Info</h3>
              </div>
              <div className="space-y-1">
                <InfoItem label="Email" value={user.email} isHighlight />
                <InfoItem label="Full Name" value={user.full_name || "Not set"} />
                <InfoItem 
                  label="Email Verified" 
                  value={user.email_verified_at ? timeAgo(user.email_verified_at) : "Not Verified"} 
                  isHighlight={!user.email_verified_at} 
                />
                <InfoItem 
                  label="Status" 
                  value={user.is_active ? "Active" : "Inactive"} 
                  isHighlight={user.is_active} 
                />
                <InfoItem label="Joined" value={new Date(user.created_at).toLocaleDateString()} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
