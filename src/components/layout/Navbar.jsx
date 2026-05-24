import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { LogOut, User, ChevronDown, Sun, Moon } from "lucide-react";
import logo from "../../assets/logo/chat-logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 w-full z-30">
      <div className="flex justify-between items-center h-16">
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 cursor-pointer select-none ml-4 sm:ml-6 lg:ml-10"
        >
          <img src={logo} alt="Convo Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight font-[Poppins]">
            <span className="text-blue-600 dark:text-blue-400">Convo</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 mr-4 sm:mr-6 lg:mr-10">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-all duration-200"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-slate-500" />
            )}
          </button>

          {user && (
            <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  {user.profile_photo ? (
                    <img src={user.profile_photo} alt="" className="w-8 h-8 rounded-lg object-cover shadow-md" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {getInitials(user.username)}
                    </div>
                  )}
                <div className="hidden sm:block text-left">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">{user.username}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 hidden sm:block ${showDropdown ? "rotate-180" : ""}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/50 dark:border-gray-700 overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-700/50 dark:to-gray-700/50 border-b border-slate-100 dark:border-gray-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Account</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-700 flex items-center justify-center">
                        <User size={16} className="text-slate-500 dark:text-slate-400" />
                      </div>
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <LogOut size={16} />
                      </div>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;