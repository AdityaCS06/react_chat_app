import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfilePhoto, updateProfileName } from "../../api/auth";
import { supabase } from "../../api/supabase";
import { useToast } from "../../components/ui/ToastContainer";
import CropModal from "../../components/ui/CropModal";
import { timeAgo } from "../../utils/timeAgo";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

const Profile = () => {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(!user);
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(true);
        try {
          const data = await getProfile();
          setUser(data);
        } catch {
          addToast("Failed to load profile", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user, setUser, addToast]);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      addToast("Only JPG, PNG, and WebP images are allowed", "error");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast("Image must be less than 2MB", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPendingFile(file);
      setCropImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = async (blob) => {
    const ext = pendingFile.name.split(".").pop().toLowerCase();
    const fileName = `${user.public_id}/${Date.now()}.${ext}`;
    const croppedFile = new File([blob], fileName, { type: `image/${ext === "jpg" ? "jpeg" : ext}` });

    setUploading(true);
    setPendingFile(null);
    setCropImageSrc(null);
    try {
      const { error: uploadError } = await supabase.storage
        .from("profile_images")
        .upload(fileName, croppedFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("profile_images")
        .getPublicUrl(fileName);

      const updatedUser = await updateProfilePhoto(publicUrlData.publicUrl);
      setUser(updatedUser);
      addToast("Profile photo updated", "success");
    } catch (err) {
      addToast(err.detail || "Failed to upload photo", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleNameEdit = () => {
    setNameInput(user.full_name || "");
    setEditingName(true);
  };

  const handleNameSave = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      addToast("Name cannot be empty", "error");
      return;
    }
    setSavingName(true);
    try {
      const updatedUser = await updateProfileName(trimmed);
      setUser(updatedUser);
      setEditingName(false);
      addToast("Name updated", "success");
    } catch (err) {
      addToast(err.detail || "Failed to update name", "error");
    } finally {
      setSavingName(false);
    }
  };

  const handleNameCancel = () => {
    setEditingName(false);
    setNameInput("");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg animate-pulse">Loading profile...</p>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500 text-lg">Please login to view your profile.</p>
        </div>
      </div>
    );

  const profilePhotoUrl = user.profile_photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const InfoItem = ({ label, value, isHighlight }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-gray-500 dark:text-gray-400 font-medium">{label}</span>
      <span className={`font-semibold ${isHighlight ? "text-blue-600 dark:text-blue-400" : "text-gray-800 dark:text-white"}`}>{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account information</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-white/50 dark:border-gray-700">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <img
                    src={profilePhotoUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                  />
                  <button
                    onClick={handleEditClick}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    )}
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.full_name || user.username}</h2>
                <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Last seen {timeAgo(user.last_seen)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-white/50 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Info</h3>
              </div>
              <div className="space-y-1">
                <InfoItem label="Email" value={user.email} isHighlight />
                {editingName ? (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Full Name</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={handleNameSave}
                        disabled={savingName}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {savingName ? "..." : "Save"}
                      </button>
                      <button
                        onClick={handleNameCancel}
                        className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Full Name</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 dark:text-white">{user.full_name || "Not set"}</span>
                      <button onClick={handleNameEdit} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
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

      <CropModal
        open={!!cropImageSrc}
        onOpenChange={() => { setCropImageSrc(null); setPendingFile(null); }}
        imageSrc={cropImageSrc}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default Profile;