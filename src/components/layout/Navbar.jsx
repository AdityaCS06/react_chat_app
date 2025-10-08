import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo/chat-logo.png"; // make sure the file exists

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 sm:px-10 flex justify-between items-center fixed top-0 left-0 w-full z-20">
      {/* Left side — Logo + App Name */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-1 cursor-pointer select-none"
      >
        <img
          src={logo}
          alt="Convo Logo"
          className="w-12 h-12 object-contain" // bigger logo, no border
        />
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-[Poppins]">
          <span className="text-blue-600">Convo</span>
        </h1>
      </div>

      {/* Right side — User & Logout */}
      <div className="flex items-center gap-5">
        {user && (
          <span className="text-gray-700 text-sm sm:text-base font-medium">
            Welcome, <span className="text-blue-600 font-semibold">{user.username}</span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm sm:text-base font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
