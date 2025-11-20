import React, { useState } from 'react';
import { studentAPI } from '../api/api';

const departments = [
  { value: 'Computer Science', icon: '💻', color: 'blue' },
  { value: 'Information Technology', icon: '🖥️', color: 'cyan' },
  { value: 'Electronics', icon: '⚡', color: 'yellow' },
  { value: 'Mechanical', icon: '⚙️', color: 'gray' },
  { value: 'Civil', icon: '🏗️', color: 'orange' },
  { value: 'Electrical', icon: '🔌', color: 'purple' }
];

const subjects = [
  { value: 'Mathematics', icon: '📐' },
  { value: 'Physics', icon: '⚛️' },
  { value: 'Chemistry', icon: '🧪' },
  { value: 'Programming', icon: '💾' },
  { value: 'Data Structures', icon: '🌳' },
  { value: 'Database Management', icon: '🗄️' },
  { value: 'Operating Systems', icon: '🖥️' },
  { value: 'Computer Networks', icon: '🌐' },
  { value: 'Software Engineering', icon: '🛠️' },
  { value: 'Web Development', icon: '🌍' }
];

export const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    subject: '',
    mark: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.department || !formData.subject || !formData.mark) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    const mark = parseInt(formData.mark);
    if (isNaN(mark) || mark < 0 || mark > 100) {
      setMessage({ type: 'error', text: 'Mark must be between 0 and 100' });
      return;
    }

    setLoading(true);
    try {
      await studentAPI.create({
        name: formData.name,
        department: formData.department,
        subject: formData.subject,
        mark: mark
      });

      setMessage({ type: 'success', text: '🎉 Student record saved successfully!' });
      
      setFormData({
        name: '',
        department: '',
        subject: '',
        mark: ''
      });

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to save record' });
    } finally {
      setLoading(false);
    }
  };

  const getMarkColor = () => {
    const mark = parseInt(formData.mark);
    if (isNaN(mark)) return 'text-gray-500';
    if (mark >= 80) return 'text-green-600';
    if (mark >= 60) return 'text-blue-600';
    if (mark >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMarkLabel = () => {
    const mark = parseInt(formData.mark);
    if (isNaN(mark)) return '';
    if (mark >= 80) return '🌟 Excellent';
    if (mark >= 60) return '👍 Good';
    if (mark >= 50) return '✓ Pass';
    return '⚠️ Needs Improvement';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Add Student Record</h2>
            <p className="text-blue-100">Enter academic information to create a new record</p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {message.text && (
        <div className={`mb-6 p-5 rounded-xl flex items-start gap-3 animate-fade-in shadow-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
            : 'bg-red-50 text-red-800 border-l-4 border-red-500'
        }`}>
          {message.type === 'success' ? (
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Student Name - Full Width */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="text-xl">👤</span>
              Student Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name (e.g., John Doe)"
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg"
              disabled={loading}
            />
          </div>

          {/* Department Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="text-xl">🎓</span>
              Department
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {departments.map(dept => (
                <button
                  key={dept.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, department: dept.value }))}
                  disabled={loading}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.department === dept.value
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{dept.icon}</div>
                  <div className="text-sm font-medium text-gray-700">{dept.value}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="text-xl">📚</span>
              Subject
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg appearance-none bg-white cursor-pointer"
              disabled={loading}
            >
              <option value="">Choose a subject...</option>
              {subjects.map(subj => (
                <option key={subj.value} value={subj.value}>
                  {subj.icon} {subj.value}
                </option>
              ))}
            </select>
          </div>

          {/* Mark Input with Visual Feedback */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="text-xl">📊</span>
              Mark (0-100)
            </label>
            <div className="relative">
              <input
                type="number"
                name="mark"
                value={formData.mark}
                onChange={handleChange}
                placeholder="Enter mark"
                min="0"
                max="100"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg"
                disabled={loading}
              />
              {formData.mark && (
                <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 font-semibold ${getMarkColor()}`}>
                  {getMarkLabel()}
                </div>
              )}
            </div>
            {formData.mark && (
              <div className="mt-3 bg-gray-100 rounded-lg p-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      formData.mark >= 80 ? 'bg-green-500' :
                      formData.mark >= 60 ? 'bg-blue-500' :
                      formData.mark >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(formData.mark, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving Record...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Save Student Record
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
          <div className="text-2xl mb-2">💡</div>
          <h4 className="font-semibold text-blue-900 mb-1">Quick Tip</h4>
          <p className="text-sm text-blue-700">Fill all fields to create a complete student record</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <div className="text-2xl mb-2">✅</div>
          <h4 className="font-semibold text-green-900 mb-1">Passing Mark</h4>
          <p className="text-sm text-green-700">Minimum 50 marks required to pass</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
          <div className="text-2xl mb-2">📈</div>
          <h4 className="font-semibold text-purple-900 mb-1">Track Progress</h4>
          <p className="text-sm text-purple-700">View all records in the Records tab</p>
        </div>
      </div>
    </div>
  );
};