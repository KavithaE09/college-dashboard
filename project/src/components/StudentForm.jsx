import React, { useState } from 'react';
import { studentAPI } from '../api/api';

const departments = [
  { value: 'Computer Science' },
  { value: 'Information Technology' },
  { value: 'Electronics' },
  { value: 'Mechanical' },
  { value: 'Civil' },
  { value: 'Electrical' }
];

const subjects = [
  { value: 'Mathematics' },
  { value: 'Physics' },
  { value: 'Chemistry' },
  { value: 'Programming' },
  { value: 'Data Structures' },
  { value: 'Database Management' },
  { value: 'Operating Systems' },
  { value: 'Computer Networks' },
  { value: 'Software Engineering' },
  { value: 'Web Development' }
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

      setMessage({ type: 'success', text: 'Student record saved successfully!' });
      
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

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .input-field {
          transition: all 0.3s ease;
        }

        .input-field:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .input-field:focus {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        .submit-btn {
          transition: all 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .card-enter {
          animation: fadeIn 1s ease-out;
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .shape {
          position: absolute;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .shape:nth-child(1) {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape:nth-child(2) {
          top: 60%;
          left: 80%;
          animation-delay: 2s;
        }

        .shape:nth-child(3) {
          top: 80%;
          left: 20%;
          animation-delay: 4s;
        }
      `}</style>

      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat p-8 relative"
       
      >
        {/* Floating Shapes */}
        <div className="floating-shapes">
          <div className="shape w-32 h-32 bg-blue-500 rounded-full"></div>
          <div className="shape w-40 h-40 bg-purple-500 rounded-full"></div>
          <div className="shape w-36 h-36 bg-pink-500 rounded-full"></div>
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Alert Messages */}
          {message.text && (
            <div 
              className={`mb-6 p-4 rounded-lg animate-fadeIn ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 card-enter">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center animate-bounce-slow">
              Add Student Record
            </h2>
            <p className="text-gray-600 text-center mb-8 animate-fadeIn">
              Enter student details to create a new record
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Student Name */}
              <div className="animate-slideIn" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>

              {/* Department */}
              <div className="animate-slideIn" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  disabled={loading}
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="animate-slideIn" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  disabled={loading}
                >
                  <option value="">Select subject</option>
                  {subjects.map(subj => (
                    <option key={subj.value} value={subj.value}>
                      {subj.value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mark */}
              <div className="animate-slideIn" style={{ animationDelay: '0.4s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mark (0-100)
                </label>
                <input
                  type="number"
                  name="mark"
                  value={formData.mark}
                  onChange={handleChange}
                  placeholder="Enter mark"
                  min="0"
                  max="100"
                  className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <div className="animate-slideIn" style={{ animationDelay: '0.5s' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Record'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};