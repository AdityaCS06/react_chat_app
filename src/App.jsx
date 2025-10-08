import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/ToastContainer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
