import React, { useState } from "react";
import FormInput from "../../components/forms/FormInput";
import PasswordInput from "../../components/forms/PasswordInput";
import { registerUser } from "../../api/auth";
import { validateSignup } from "../../utils/validators";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/svg/team_chat.png";

const Signup = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignup(formValues);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const data = await registerUser(formValues);
      addToast(`User ${data.username} registered successfully!`, "success");
      login(data);
      setFormValues({ username: "", email: "", password: "", full_name: "" });
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.detail?.message || err.detail || "Something went wrong. Try again!";
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-y-auto">
      {/* Left Side (Illustration) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center text-white p-8">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-4xl font-bold">Join the Conversation!</h1>
          <p className="text-lg text-blue-100">
            Create your account and start connecting with your team instantly.
          </p>
          <div className="mt-8">
            <img
              src={logo}
              alt="Signup Illustration"
              className="w-full max-w-sm mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Right Side (Signup Form) */}
      <div className="flex w-full md:w-1/2 items-start justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8 md:px-6 md:py-10 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 rounded-2xl w-full max-w-md p-6 md:p-8 mt-4 md:mt-0">
          <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-4">
            Create Account
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
            Sign up to get started with your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              error={errors.username}
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              error={errors.email}
            />
            <PasswordInput
              label="Password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              error={errors.password}
            />
            <FormInput
              label="Full Name"
              name="full_name"
              value={formValues.full_name}
              onChange={handleChange}
              error={errors.full_name}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-300"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;