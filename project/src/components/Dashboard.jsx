import React, { useState } from 'react';
import { StudentForm } from './StudentForm';
import { DataTable } from './DataTable';
import { BarChart, PieChart } from './Charts';
import { StatsCard } from './StatsCard';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../api/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState({
    totalSubjects: 0,
    averageMarks: 0,
    completedSubjects: 0,
    pendingSubjects: 0,
    chartData: { barChart: [], pieChart: [] }
  });
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  // Fetch stats when home tab is active
  React.useEffect(() => {
    if (activeTab === 'home') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 flex flex-col shadow-2xl">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
              📚
            </div>
            <div>
              <h2 className="font-bold text-xl">Dashboard</h2>
              <p className="text-xs text-blue-200">Academic Hub</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
              activeTab === 'home' 
                ? 'bg-white text-blue-600 shadow-lg scale-105' 
                : 'hover:bg-blue-700 hover:pl-6'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
              activeTab === 'add' 
                ? 'bg-white text-blue-600 shadow-lg scale-105' 
                : 'hover:bg-blue-700 hover:pl-6'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Record
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
              activeTab === 'list' 
                ? 'bg-white text-blue-600 shadow-lg scale-105' 
                : 'hover:bg-blue-700 hover:pl-6'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Records
          </button>
        </div>

        {/* User Section */}
        <div className="mt-auto pt-6 border-t border-blue-500 bg-blue-900 bg-opacity-50 rounded-xl p-4">
          <p className="text-xs text-blue-200 uppercase tracking-wide mb-1">Logged in as</p>
          <p className="font-semibold text-lg mb-4">{user?.displayName || 'User'}</p>
          <button 
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's your academic overview.</p>
              </div>
              <button 
                onClick={fetchStats}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-gray-600">Loading dashboard...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatsCard title="Total Subjects" value={stats.totalSubjects} icon="📚" color="blue" />
                  <StatsCard title="Average Marks" value={stats.averageMarks} icon="📊" color="purple" />
                  <StatsCard title="Completed Subjects" value={stats.completedSubjects} icon="✓" color="green" />
                  <StatsCard title="Pending Subjects" value={stats.pendingSubjects} icon="⏳" color="orange" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Marks by Subject</h2>
                    <BarChart data={stats.chartData?.barChart || []} />
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Subject Distribution</h2>
                    <PieChart data={stats.chartData?.pieChart || []} />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Add Record Tab */}
        {activeTab === 'add' && (
          <div className="p-8">
            <StudentForm />
          </div>
        )}

        {/* Records List Tab */}
        {activeTab === 'list' && (
          <div className="p-8">
            <DataTable />
          </div>
        )}
      </main>
    </div>
  );
}