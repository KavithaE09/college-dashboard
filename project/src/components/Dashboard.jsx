import React, { useState, useEffect } from 'react';
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
  const [allRecords, setAllRecords] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [uniqueStudents, setUniqueStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  // Fetch all records when component mounts
  useEffect(() => {
    if (activeTab === 'home') {
      fetchAllRecords();
    }
  }, [activeTab]);

  // Calculate stats when selected student changes
  useEffect(() => {
    if (allRecords.length > 0) {
      calculateFilteredStats();
    }
  }, [selectedStudent, allRecords]);

  const fetchAllRecords = async () => {
    console.log('🔄 Fetching all records...');
    try {
      setLoading(true);
      setError(null);
      
      const records = await studentAPI.getAll();
      console.log('📚 Records received:', records);
      
      setAllRecords(records);
      
      // Get unique student names
      const students = [...new Set(records.map(r => r.name))];
      setUniqueStudents(students);
      
    } catch (error) {
      console.error('❌ Error fetching records:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateFilteredStats = () => {
    let filteredRecords = allRecords;
    
    // Filter by selected student
    if (selectedStudent !== 'all') {
      filteredRecords = allRecords.filter(r => r.name === selectedStudent);
    }

    if (filteredRecords.length === 0) {
      setStats({
        totalSubjects: 0,
        averageMarks: 0,
        completedSubjects: 0,
        pendingSubjects: 0,
        chartData: { barChart: [], pieChart: [] }
      });
      return;
    }

    // Calculate statistics
    const totalSubjects = filteredRecords.length;
    const totalMarks = filteredRecords.reduce((sum, r) => sum + r.mark, 0);
    const averageMarks = (totalMarks / totalSubjects).toFixed(2);
    const completedSubjects = filteredRecords.filter(r => r.mark >= 50).length;
    const pendingSubjects = filteredRecords.filter(r => r.mark < 50).length;

    // Bar chart data - marks by subject
    const barChart = filteredRecords.map(r => ({
      subject: r.subject,
      mark: r.mark
    }));

    // Pie chart data - performance distribution
    const excellent = filteredRecords.filter(r => r.mark >= 80).length;
    const good = filteredRecords.filter(r => r.mark >= 60 && r.mark < 80).length;
    const average = filteredRecords.filter(r => r.mark >= 50 && r.mark < 60).length;
    const needsImprovement = filteredRecords.filter(r => r.mark < 50).length;

    const pieChart = [
      { name: 'Excellent (80+)', value: excellent },
      { name: 'Good (60-79)', value: good },
      { name: 'Average (50-59)', value: average },
      { name: 'Needs Improvement (<50)', value: needsImprovement }
    ].filter(item => item.value > 0);

    setStats({
      totalSubjects,
      averageMarks: parseFloat(averageMarks),
      completedSubjects,
      pendingSubjects,
      chartData: { barChart, pieChart }
    });
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
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's your academic overview.</p>
              </div>
              <button 
                onClick={fetchAllRecords}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-400"
              >
                <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {/* Student Filter */}
            {uniqueStudents.length > 1 && (
              <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📊 Filter by Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                >
                  <option value="all">All Students ({allRecords.length} records)</option>
                  {uniqueStudents.map(student => (
                    <option key={student} value={student}>
                      {student} ({allRecords.filter(r => r.name === student).length} records)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                <p className="font-semibold">Error loading data</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

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
                  <StatsCard title="Total Subjects" value={stats.totalSubjects} icon="📚" />
                  <StatsCard title="Average Marks" value={stats.averageMarks} icon="📊" />
                  <StatsCard title="Completed Subjects" value={stats.completedSubjects} icon="✓" />
                  <StatsCard title="Pending Subjects" value={stats.pendingSubjects} icon="⏳" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Marks by Subject</h2>
                    <BarChart data={stats.chartData?.barChart || []} />
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Distribution</h2>
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