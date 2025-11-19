import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Plus, List } from 'lucide-react';

export const Navigation = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-blue-600">
            SD
          </div>
          <div>
            <h2 className="font-bold text-lg">Dashboard</h2>
            <p className="text-sm text-blue-100">Academic Hub</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            activeTab === 'home'
              ? 'bg-blue-500 text-white'
              : 'text-blue-100 hover:bg-blue-500 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('add')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            activeTab === 'add'
              ? 'bg-blue-500 text-white'
              : 'text-blue-100 hover:bg-blue-500 hover:text-white'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span>Add Record</span>
        </button>

        <button
          onClick={() => setActiveTab('list')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            activeTab === 'list'
              ? 'bg-blue-500 text-white'
              : 'text-blue-100 hover:bg-blue-500 hover:text-white'
          }`}
        >
          <List className="w-5 h-5" />
          <span>Records</span>
        </button>
      </nav>

      <div className="p-4 border-t border-blue-500 space-y-3">
        <div className="px-4 py-3 bg-blue-500 rounded-lg">
          <p className="text-sm text-blue-100">Logged in as</p>
          <p className="font-semibold truncate">{user?.name || 'User'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};
