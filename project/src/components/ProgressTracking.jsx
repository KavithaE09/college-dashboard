import React, { useState, useEffect } from 'react';
import { studentAPI } from '../api/api';

export const ProgressTracking = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentProgress, setStudentProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      calculateProgress();
    }
  }, [selectedStudent, students]);

  const fetchStudents = async () => {
    try {
      const data = await studentAPI.getAll();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const calculateProgress = () => {
    setLoading(true);
    const studentRecords = students.filter(s => s.name === selectedStudent);
    
    if (studentRecords.length === 0) {
      setStudentProgress(null);
      setLoading(false);
      return;
    }

    const totalSubjects = studentRecords.length;
    const totalMarks = studentRecords.reduce((sum, r) => sum + r.mark, 0);
    const averageMark = totalMarks / totalSubjects;
    const passedSubjects = studentRecords.filter(r => r.mark >= 50).length;
    const failedSubjects = studentRecords.filter(r => r.mark < 50).length;
    const excellentSubjects = studentRecords.filter(r => r.mark >= 80).length;
    
    // Calculate trend (improvement over time)
    const sortedRecords = [...studentRecords].sort((a, b) => 
      new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    );
    
    let trend = 'stable';
    if (sortedRecords.length >= 2) {
      const firstHalf = sortedRecords.slice(0, Math.floor(sortedRecords.length / 2));
      const secondHalf = sortedRecords.slice(Math.floor(sortedRecords.length / 2));
      const firstAvg = firstHalf.reduce((sum, r) => sum + r.mark, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, r) => sum + r.mark, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 5) trend = 'improving';
      else if (secondAvg < firstAvg - 5) trend = 'declining';
    }

    // Subject-wise performance
    const subjectPerformance = studentRecords.map(r => ({
      subject: r.subject,
      mark: r.mark,
      department: r.department,
      status: r.mark >= 80 ? 'Excellent' : r.mark >= 60 ? 'Good' : r.mark >= 50 ? 'Pass' : 'Needs Improvement'
    }));

    // Strengths and weaknesses
    const strengths = subjectPerformance.filter(s => s.mark >= 70).map(s => s.subject);
    const weaknesses = subjectPerformance.filter(s => s.mark < 60).map(s => s.subject);

    setStudentProgress({
      name: selectedStudent,
      totalSubjects,
      averageMark: averageMark.toFixed(2),
      passedSubjects,
      failedSubjects,
      excellentSubjects,
      passRate: ((passedSubjects / totalSubjects) * 100).toFixed(1),
      trend,
      subjectPerformance,
      strengths,
      weaknesses,
      overallGrade: averageMark >= 80 ? 'A' : averageMark >= 70 ? 'B' : averageMark >= 60 ? 'C' : averageMark >= 50 ? 'D' : 'F'
    });
    
    setLoading(false);
  };

  const uniqueStudents = [...new Set(students.map(s => s.name))];

  const getTrendIcon = (trend) => {
    if (trend === 'improving') {
      return (
        <div className="flex items-center gap-2 text-emerald-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="font-bold">Improving</span>
        </div>
      );
    } else if (trend === 'declining') {
      return (
        <div className="flex items-center gap-2 text-rose-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
          <span className="font-bold">Declining</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-blue-600">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
        <span className="font-bold">Stable</span>
      </div>
    );
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': 'from-emerald-500 to-green-500',
      'B': 'from-blue-500 to-cyan-500',
      'C': 'from-amber-500 to-yellow-500',
      'D': 'from-orange-500 to-red-500',
      'F': 'from-red-500 to-rose-500'
    };
    return colors[grade] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-1">Student Progress Tracking</h2>
            <p className="text-violet-100">Monitor academic performance and growth trends</p>
          </div>
        </div>
      </div>

      {/* Student Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          📊 Select Student to Track Progress
        </label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all text-lg font-medium"
        >
          <option value="">Choose a student...</option>
          {uniqueStudents.map(student => (
            <option key={student} value={student}>
              {student}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Dashboard */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-purple-600 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600 font-medium">Calculating progress...</p>
          </div>
        </div>
      )}

      {!loading && studentProgress && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Overall Grade */}
            <div className={`bg-gradient-to-br ${getGradeColor(studentProgress.overallGrade)} rounded-2xl p-6 text-white shadow-xl`}>
              <div className="text-sm font-semibold mb-2 opacity-90">Overall Grade</div>
              <div className="text-5xl font-bold mb-2">{studentProgress.overallGrade}</div>
              <div className="text-sm opacity-90">Average: {studentProgress.averageMark}%</div>
            </div>

            {/* Total Subjects */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">📚</div>
                <div className="text-3xl font-bold text-gray-900">{studentProgress.totalSubjects}</div>
              </div>
              <div className="text-sm font-semibold text-gray-600">Total Subjects</div>
            </div>

            {/* Pass Rate */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">✅</div>
                <div className="text-3xl font-bold text-emerald-600">{studentProgress.passRate}%</div>
              </div>
              <div className="text-sm font-semibold text-gray-600">Pass Rate</div>
            </div>

            {/* Excellent */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🌟</div>
                <div className="text-3xl font-bold text-purple-600">{studentProgress.excellentSubjects}</div>
              </div>
              <div className="text-sm font-semibold text-gray-600">Excellent Grades</div>
            </div>
          </div>

          {/* Trend & Performance Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Performance Trend
              </h3>
              <div className="flex items-center justify-center py-8">
                {getTrendIcon(studentProgress.trend)}
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">{studentProgress.passedSubjects}</div>
                    <div className="text-sm text-gray-600">Passed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-rose-600">{studentProgress.failedSubjects}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">💪</span>
                Analysis
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-emerald-600 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Strengths
                  </div>
                  {studentProgress.strengths.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {studentProgress.strengths.map((subject, idx) => (
                        <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                          {subject}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No strong subjects yet</p>
                  )}
                </div>

                <div>
                  <div className="font-semibold text-amber-600 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Areas for Improvement
                  </div>
                  {studentProgress.weaknesses.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {studentProgress.weaknesses.map((subject, idx) => (
                        <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                          {subject}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Great! No weak areas</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subject-wise Performance Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Subject-wise Performance
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Mark</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {studentProgress.subjectPerformance.map((subject, idx) => (
                    <tr key={idx} className="hover:bg-purple-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{subject.subject}</td>
                      <td className="px-6 py-4 text-gray-600">{subject.department}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg font-bold ${
                          subject.mark >= 80 ? 'bg-emerald-100 text-emerald-700' :
                          subject.mark >= 60 ? 'bg-purple-100 text-purple-700' :
                          subject.mark >= 50 ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {subject.mark}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          subject.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                          subject.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                          subject.status === 'Pass' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {subject.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!loading && !studentProgress && selectedStudent && (
        <div className="bg-white rounded-2xl p-16 text-center shadow-lg border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Records Found</h3>
          <p className="text-gray-600">This student doesn't have any records yet.</p>
        </div>
      )}

      {!selectedStudent && (
        <div className="bg-white rounded-2xl p-16 text-center shadow-lg border border-gray-100">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Student</h3>
          <p className="text-gray-600">Choose a student from the dropdown to view their progress tracking.</p>
        </div>
      )}
    </div>
  );
};