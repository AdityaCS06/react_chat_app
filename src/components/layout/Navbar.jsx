import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo/chat-logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (<header className="bg-white shadow-md fixed top-0 left-0 w-full z-30">
  <div className="flex justify-between items-center h-16">
    {/* Left side — Logo flush to left */}
    <div
      onClick={() => navigate("/")}
      className="flex items-center gap-2 cursor-pointer select-none ml-4 sm:ml-6 lg:ml-10"
    >
      <img src={logo} alt="Convo Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight font-[Poppins]">
        <span className="text-blue-600">Convo</span>
      </h1>
    </div>

    {/* Right side — Desktop menu */}
    <div className="hidden md:flex items-center gap-5 mr-4 sm:mr-6 lg:mr-10">
      {user && (
        <span className="text-gray-700 text-sm sm:text-base font-medium">
          Welcome, <span className="text-blue-600 font-semibold">{user.username}</span>
        </span>
      )}
      {user && (
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm sm:text-base font-medium"
        >
          Logout
        </button>
      )}
    </div>

    {/* Mobile menu button */}
    <div className="md:hidden flex items-center mr-4 sm:mr-6 lg:mr-10">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 p-2 rounded-md"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
    </div>
  </div>

  {/* Mobile Dropdown Menu */}
  {menuOpen && (
    <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
      <div className="flex flex-col items-start p-4 gap-3">
        {user && (
          <span className="text-gray-700 text-base font-medium">
            Welcome, <span className="text-blue-600 font-semibold">{user.username}</span>
          </span>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white w-full text-center py-2 rounded-lg hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  )}
</header>

  );
};

export default Navbar;
