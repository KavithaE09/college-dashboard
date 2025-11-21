import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Chrome } from "lucide-react";
import { authAPI } from "../api/api";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");

  const { login } = useAuth();

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
        setUsername("");
        setIsLoading(false);
        return;
      }

      // LOGIN USER
      const response = await authAPI.login({ email, password });
      
      console.log('✅ Login response:', response);

      // ✅ Save user AND token to context (token will be saved to localStorage)
      // This will trigger a re-render and show Dashboard automatically
      login(response.user, response.token);

      console.log('✅ Login successful, dashboard will load automatically');

    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
        .animate-bounce-slow { animation: bounce 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .input-animate { transition: all 0.3s ease; }
        .input-animate:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
        .input-animate:focus { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); }
        .btn-animate { transition: all 0.3s ease; }
        .btn-animate:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(79, 70, 229, 0.5); }
        .btn-animate:active:not(:disabled) { transform: translateY(-1px); }
        .floating-shapes { position: absolute; width: 100%; height: 100%; overflow: hidden; z-index: 0; }
        .shape { position: absolute; opacity: 0.08; }
        .shape:nth-child(1) { top: 10%; left: 10%; width: 150px; height: 150px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; animation: float 6s ease-in-out infinite; }
        .shape:nth-child(2) { top: 60%; right: 10%; width: 200px; height: 200px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; animation: float 8s ease-in-out infinite; animation-delay: 2s; }
        .shape:nth-child(3) { bottom: 10%; left: 15%; width: 180px; height: 180px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%; animation: float 7s ease-in-out infinite; animation-delay: 4s; }
        .logo-animate { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      <div 
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 50%, rgba(236, 72, 153, 0.9) 100%), url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-fadeIn">
          <div className="flex justify-center mb-8 animate-bounce-slow">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl logo-animate">
              <Chrome className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2 animate-slideInLeft">
            Student Dashboard
          </h1>

          <p className="text-center text-gray-600 mb-8 animate-slideInRight">
            {isRegisterMode ? "Create your account" : "Track your academic progress"}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <div className="animate-slideInLeft">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="input-animate w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            )}

            <div className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="input-animate w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div className="animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-animate w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div className="animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-animate w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading
                  ? isRegisterMode ? "Creating account..." : "Signing in..."
                  : isRegisterMode ? "Create Account" : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError("");
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              {isRegisterMode
                ? "Already have an account? Sign in"
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};