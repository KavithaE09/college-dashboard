import React, { useState, useEffect } from 'react';
import { useStudentData } from '../hooks/useStudentData';
import { BarChart, PieChart } from './Charts';
import { StudentForm } from './StudentForm';
import { Navigation } from './Navigation';
import { StatsCard } from './StatsCard';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { records, filteredRecords, calculateStats, addRecord } = useStudentData();
  const [stats, setStats] = useState({
    totalSubjects: 0,
    averageMarks: 0,
    completedSubjects: 0,
    pendingSubjects: 0
  });

  useEffect(() => {
    setStats(calculateStats());
  }, [records, calculateStats]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-auto p-8">
        {activeTab === 'home' && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your academic overview.</p>
          </div>
        )}

        {activeTab === 'home' && <HomeContent stats={stats} records={records} />}
        {activeTab === 'add' && <StudentForm onSuccess={() => window.location.reload()} />}
        {activeTab === 'records' && <RecordsList records={filteredRecords} />}
      </main>
    </div>
  );
};

// Home Content Component
const HomeContent = ({ stats, records }) => {
  const { loading, data, error } = useStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        Error loading dashboard: {error}
      </div>
    );
  }

  const statsData = data || { totalSubjects: 0, averageMarks: 0, completedSubjects: 0, pendingSubjects: 0, chartData: { barChart: [], pieChart: [] } };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Subjects"
          value={statsData.totalSubjects}
          icon="📚"
          color="blue"
        />
        <StatsCard
          title="Average Marks"
          value={statsData.averageMarks}
          icon="📊"
          color="purple"
        />
        <StatsCard
          title="Completed Subjects"
          value={statsData.completedSubjects}
          icon="✓"
          color="green"
        />
        <StatsCard
          title="Pending Subjects"
          value={statsData.pendingSubjects}
          icon="⏳"
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Marks by Subject</h3>
          <BarChart data={statsData.chartData.barChart} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Distribution</h3>
          <PieChart data={statsData.chartData.pieChart} />
        </div>
      </div>
    </>
  );
};

// Custom hook for fetching stats
const useStats = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/students/stats', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      const statsData = await response.json();
      setData(statsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, refetch: fetchStats };
};

// Records List Component (placeholder)
const RecordsList = ({ records }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Student Records</h2>
      {/* DataTable will be imported here */}
    </div>
  );
};