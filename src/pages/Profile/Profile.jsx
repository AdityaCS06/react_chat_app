import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../api/auth";
import { useToast } from "../../components/ui/ToastContainer";

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

  if (loading) return <p className="text-center mt-20">Loading profile...</p>;
  if (!user) return <p className="text-center mt-20 text-red-500">Please login.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>

        <div className="space-y-4 text-left">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Full Name:</strong> {user.full_name || "N/A"}</p>
          <p><strong>Last Seen:</strong> {new Date(user.last_seen).toLocaleString()}</p>
          {/* <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p> */}
          <p><strong>Email Verified:</strong> {user.email_verified_at ? new Date(user.email_verified_at).toLocaleString() : "N/A"}</p>
          <p><strong>Active:</strong> {user.is_active ? "Yes" : "No"}</p>
        </div>

        <button
          onClick={logout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
