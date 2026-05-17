import React, { useState } from "react";
import FormInput from "../../components/forms/FormInput";
import PasswordInput from "../../components/forms/PasswordInput";
import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";
import { useNavigate } from "react-router-dom";
// import logo from "../../assets/svg/chat_interface.svg";
import logo from "../../assets/svg/message_ui.svg";


const Login = () => {
  const [formValues, setFormValues] = useState({
    email_or_username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.email_or_username || !formValues.password) {
      addToast("Username/Email and password are required", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(formValues);
      login(data);
      addToast("Logged in successfully!", "success");
      setFormValues({ email_or_username: "", password: "" });
      navigate("/dashboard");
    } catch (err) {
      let message = "Invalid credentials";
      if (err.detail) {
        if (Array.isArray(err.detail)) {
          message = err.detail[0]?.msg || message;
        } else if (typeof err.detail === "string") {
          message = err.detail;
        }
      }
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side (Image / Illustration) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center text-white p-8">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-4xl font-bold">Welcome Back!</h1>
          <p className="text-lg text-blue-100">
            Connect with your friends and teams seamlessly using our chat app.
          </p>
          <div className="mt-8">
            <img
              src={logo}
              alt="Chat Illustration"
              className="w-full max-w-sm mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Right side (Form) */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 px-6 py-10">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Email or Username"
              name="email_or_username"
              type="text"
              value={formValues.email_or_username}
              onChange={handleChange}
            />
            <PasswordInput
              label="Password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-600 font-medium hover:underline cursor-pointer"
              >
                Sign up
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
