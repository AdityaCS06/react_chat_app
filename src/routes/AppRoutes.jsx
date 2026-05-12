import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Signup/Signup";
import Login from "../pages/Login/Login";
import Profile from "../pages/Profile/Profile";
import Landing from "../pages/Landing/Landing";
import Dashboard from "../pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import CreateChat from "../pages/Chat/CreateChat";
import ChatLayout from "../pages/Chat/ChatLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
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
        path="/create-chat"
        element={
          <PrivateRoute>
            <CreateChat />
          </PrivateRoute>
        }
      />

      <Route
        path="/chats"
        element={
          <PrivateRoute>
            <ChatLayout />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
