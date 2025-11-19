import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Chrome } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        id: Date.now().toString(),
        name,
        email: email || `user_${Date.now()}@example.com`,
      };

      login(userData);
      navigate('dashboard');
    } catch (error) {
      alert('Login failed. Please try again.');
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
          Track your academic progress
        </p>

        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading || !name.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
            font-semibold py-3 rounded-lg hover:shadow-lg transition 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center 
            justify-center gap-2"
          >
            <Chrome className="w-5 h-5" />
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          This is a demo login. Connect to your backend for production use.
        </p>

      </div>
    </div>
  );
};
