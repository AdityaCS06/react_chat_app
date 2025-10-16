import React, { useState } from "react";
import FormInput from "../../components/forms/FormInput";
import PasswordInput from "../../components/forms/PasswordInput";
import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastContainer";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formValues, setFormValues] = useState({
        email_or_username: "", // <-- can be email or username
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
            login(data); // save user in context
            addToast("Logged in successfully!", "success");
            setFormValues({ email_or_username: "", password: "" });
            // TODO: navigate to dashboard
            navigate("/");
        } catch (err) {
            //   const message = err.detail || "Invalid credentials";
            let message = "Invalid credentials";
            if (err.detail) {
                if (Array.isArray(err.detail)) {
                    // FastAPI validation errors
                    message = err.detail[0]?.msg || message;
                } else if (typeof err.detail === "string") {
                    // Custom error
                    message = err.detail;
                }
            }
            addToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
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
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-4"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <p className="text-center text-sm mt-4">
                        Don’t have an account?{" "}
                        <span
                            onClick={() => navigate("/signup")}
                            className="text-blue-600 hover:underline cursor-pointer"
                        >
                            Sign up
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
