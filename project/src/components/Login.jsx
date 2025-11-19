import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Chrome } from "lucide-react";
import { useNavigate } from "../hooks/useNavigate";
import { authAPI } from "../api/api";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (isRegisterMode && !username.trim()) {
      setError("Please enter a username");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        // REGISTER NEW USER
        await authAPI.register({
          username,
          email,
          password,
          role: "student",
        });

        alert("Registration successful! Please log in.");
        setIsRegisterMode(false);
        setPassword("");
        return;
      }

      // LOGIN USER
      const response = await authAPI.login({ email, password });

      // 🔥 SAVE JWT TOKEN (VERY IMPORTANT)
      localStorage.setItem("token", response.token);

      // Save user to context
      login(response.user);

      // Navigate correctly
      navigate("/dashboard");

    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-lg">
            <Chrome className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Student Dashboard
        </h1>

        <p className="text-center text-gray-600 mb-8">
          {isRegisterMode ? "Create your account" : "Track your academic progress"}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                          focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 
                      text-white font-semibold py-3 rounded-lg hover:shadow-lg 
                      transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Chrome className="w-5 h-5" />
            {isLoading
              ? isRegisterMode
                ? "Creating account..."
                : "Signing in..."
              : isRegisterMode
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError("");
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {isRegisterMode
              ? "Already have an account? Sign in"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};
