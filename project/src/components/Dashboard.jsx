import React, { useState } from 'react';
import { useStudentData } from '../hooks/useStudentData';
import { BarChart, PieChart } from './Charts';
import { StudentForm } from './StudentForm';
import { DataTable } from './DataTable';
import { Navigation } from './Navigation';
import { StatsCard } from './StatsCard';


export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { records, filteredRecords, calculateStats, addRecord, deleteRecord, searchRecords, sortRecords, filterRecords } = useStudentData();
  const stats = calculateStats();

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-auto">
        {activeTab === 'home' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your academic overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Subjects"
                value={stats.totalSubjects}
                icon="📚"
              />
              <StatsCard
                title="Average Marks"
                value={stats.averageMarks}
                icon="📊"
              />
              <StatsCard
                title="Completed Subjects"
                value={stats.completedSubjects}
                icon="✓"
              />
              <StatsCard
                title="Pending Subjects"
                value={stats.pendingSubjects}
                icon="⏳"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Marks by Subject</h2>
                <BarChart records={records} />
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Subject Distribution</h2>
                <PieChart records={records} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Student Record</h1>
              <p className="text-gray-600">Enter academic information below</p>
            </div>
            <StudentForm onSubmit={addRecord} />
          </div>
        )}

        {activeTab === 'list' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Records</h1>
              <p className="text-gray-600">View and manage all student data</p>
            </div>
            <DataTable
              records={filteredRecords}
              onDelete={deleteRecord}
              onSearch={searchRecords}
              onSort={sortRecords}
              onFilter={filterRecords}
            />
          </div>
        )}
      </main>
    </div>
  );
};
