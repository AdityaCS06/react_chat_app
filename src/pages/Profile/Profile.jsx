import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../api/auth";
import { useToast } from "../../components/ui/ToastContainer";

// Helper to format timestamps like "2 days ago"
const timeAgo = (date) => {
  if (!date) return "N/A";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  return Math.floor(seconds) + " seconds ago";
};

const Profile = () => {
  const { user, token, logout, setUser } = useAuth();
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">Please login to view your profile.</p>
      </div>
    );

  const profilePhotoUrl =
    user.profile_photo || "https://adityacs06.github.io/Portfolio/assets/AdityaKori1.jpeg";

  return (
    <div className="flex justify-center py-40 px-4 min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center p-6 border-b border-gray-100">
          <img
            src={profilePhotoUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-400 shadow-sm"
          />
          <div className="ml-6 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.full_name || user.username}
            </h2>
            <p className="text-gray-500">{user.username}</p>
            <p className="text-gray-400 text-sm">
              Last seen: {timeAgo(user.last_seen)}
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 font-medium">Email</p>
            <p className="text-gray-800">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Full Name</p>
            <p className="text-gray-800">{user.full_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Email Verified</p>
            <p className="text-gray-800">
              {user.email_verified_at
                ? timeAgo(user.email_verified_at)
                : "Not Verified"}
            </p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Active</p>
            <p className="text-gray-800">{user.is_active ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Account Created</p>
            <p className="text-gray-800">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Last Updated</p>
            <p className="text-gray-800">
              {new Date(user.updated_at).toLocaleDateString()}
            </p>
          </div>
          {/* <div>
            <p className="text-gray-600 font-medium">Profile ID</p>
            <p className="text-gray-800">{user.public_id}</p>
          </div> */}
        </div>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
