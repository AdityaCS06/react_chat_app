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
        <p className="text-gray-500 text-lg animate-pulse">
          Loading profile...
        </p>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">
          Please login to view your profile.
        </p>
      </div>
    );

  const profilePhotoUrl =
    user.profile_photo ||
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <img
            src={profilePhotoUrl}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="text-center sm:text-left mt-4 sm:mt-0">
            <h2 className="text-3xl font-bold">
              {user.full_name || user.username}
            </h2>
            <p className="text-blue-100">@{user.username}</p>
            <p className="text-blue-200 text-sm mt-1">
              Last seen: {timeAgo(user.last_seen)}
            </p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
              Email
            </p>
            <p className="text-gray-800 text-base">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
              Full Name
            </p>
            <p className="text-gray-800 text-base">
              {user.full_name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
              Email Verified
            </p>
            <p className="text-gray-800 text-base">
              {user.email_verified_at
                ? timeAgo(user.email_verified_at)
                : "Not Verified"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
              Active
            </p>
            <p className="text-gray-800 text-base">
              {user.is_active ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
              Account Created
            </p>
            <p className="text-gray-800 text-base">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
              Last Updated
            </p>
            <p className="text-gray-800 text-base">
              {new Date(user.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50">
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
