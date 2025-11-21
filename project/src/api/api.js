// 🚀 Always use localhost backend
const API_BASE_URL = "http://localhost:5000/api";

console.log("🔧 API BASE URL:", API_BASE_URL);

// -------------------------------------------
// Helper function for API calls (JWT TOKEN)
// -------------------------------------------
const apiCall = async (endpoint, options = {}) => {
  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log("📡 API Call:", fullUrl);

    const token = localStorage.getItem("token");

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
      },
    });

    console.log("📥 Response:", response.status, response.statusText);

    if (response.status === 401) {
      console.warn("⚠️ Unauthorized! Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("Unauthorized - please log in");
    }

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Invalid response:", text.substring(0, 200));
      throw new Error("Server returned invalid response");
    }

    if (!response.ok) {
      console.error("❌ API Error:", data);
      throw new Error(data.message || "Something went wrong");
    }

    console.log("✅ Success:", endpoint);
    return data;
  } catch (error) {
    console.error("💥 API Error:", error);
    throw error;
  }
};

// -------------------------------------------
// STUDENT API
// -------------------------------------------
export const studentAPI = {
  getAll: () => apiCall("/students"),
  getStats: () => apiCall("/students/stats"),

  create: (studentData) =>
    apiCall("/students", {
      method: "POST",
      body: JSON.stringify(studentData),
    }),

  update: (id, studentData) =>
    apiCall(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(studentData),
    }),

  delete: (id) =>
    apiCall(`/students/${id}`, {
      method: "DELETE",
    }),
};

// -------------------------------------------
// AUTH API (JWT TOKEN)
// -------------------------------------------
export const authAPI = {
  register: (formData) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  login: async (formData) => {
    const data = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("🔐 Token saved:", data.token);
    }

    return data;
  },

  checkAuth: () => apiCall("/auth/check"),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("🚪 Logged out - token removed");
  },
};

export default {
  student: studentAPI,
  auth: authAPI,
};