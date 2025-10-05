import React, { useState } from "react";
import FormInput from "../../components/forms/FormInput";
import PasswordInput from "../../components/forms/PasswordInput";
import { registerUser } from "../../api/auth";
import { validateSignup } from "../../utils/validators";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";

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
    } catch (err) {
      const message =
        err.detail?.message || err.detail || "Something went wrong. Try again!";
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">Sign up to get started with your account</p>
        <form onSubmit={handleSubmit}>
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
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
