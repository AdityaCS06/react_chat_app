import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User, ChevronDown } from "lucide-react";
import logo from "../../assets/logo/chat-logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getAvatarColor = () => "from-blue-500 to-indigo-600";

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-30">
      <div className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 cursor-pointer select-none ml-4 sm:ml-6 lg:ml-10"
            >
              <img src={logo} alt="Convo Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight font-[Poppins]">
                <span className="text-blue-600">Convo</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {getInitials(user.username)}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-[11px] text-slate-400 leading-none">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-700 leading-tight">{user.username}</p>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 hidden sm:block ${showDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/50 overflow-hidden">
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Account</p>
                        <p className="text-sm font-semibold text-slate-700 truncate">{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <User size={16} className="text-slate-500" />
                          </div>
                          Your Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                            <LogOut size={16} />
                          </div>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
