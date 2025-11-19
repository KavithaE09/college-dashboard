import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

export const StudentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    subject: '',
    mark: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical'
  ];

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Programming',
    'Database',
    'Web Development'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (formData.mark < 0 || formData.mark > 100)
      newErrors.mark = 'Mark must be between 0 and 100';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      onSubmit(formData);

      setFormData({
        name: '',
        department: '',
        subject: '',
        mark: 0,
      });

      alert('Record added successfully!');
    } catch (error) {
      alert('Failed to add record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'mark' ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2  ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                errors.department ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.department}
              </div>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Subject
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                errors.subject ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Subject</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
            {errors.subject && (
              <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.subject}
              </div>
            )}
          </div>

          {/* Mark */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Mark (0-100)
            </label>
            <input
              type="number"
              name="mark"
              min="0"
              max="100"
              value={formData.mark}
              onChange={handleChange}
              placeholder="85"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                errors.mark ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.mark && (
              <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.mark}
              </div>
            )}
          </div>

        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isSubmitting ? 'Saving...' : 'Save Record'}
        </button>

      </form>
    </div>
  );
};