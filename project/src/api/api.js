const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// -----------------------------
// STUDENT API
// -----------------------------
export const studentAPI = {
  getAll: () => apiCall('/students'),


  create: (studentData) => apiCall('/students', {
    method: 'POST',
    body: JSON.stringify(studentData),
  }),

  update: (id, studentData) => apiCall(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(studentData),
  }),

  delete: (id) => apiCall(`/students/${id}`, {
    method: 'DELETE',
  }),
};

// -----------------------------
// AUTH API  (✔ FIXED)
// -----------------------------
export const authAPI = {
  // REGISTER
  register: (formData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  // LOGIN
  login: (formData) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  // CHECK AUTH STATUS
  checkAuth: () => apiCall('/auth/check'),

  // LOGOUT
  logout: () =>
    apiCall('/auth/logout', {
      method: 'POST',
    }),
};

// Default export
export default {
  student: studentAPI,
  auth: authAPI,
};
