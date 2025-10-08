import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Signup/Signup";
import Login from "../pages/Login/Login";
import Profile from "../pages/Profile/Profile";
import Dashboard from "../pages/Dashboard/Dashboard"; // New page
// import ChatPage from "../pages/Chat/ChatPage"; // New
import ChatLayout from "../pages/Chat/ChatLayout";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Private Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <ChatLayout />
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/chat/:chatId"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      /> */}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
