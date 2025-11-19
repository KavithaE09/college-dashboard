# College Student Dashboard - Backend Integration Guide

## Overview
The frontend is complete and ready for MongoDB backend integration. This guide explains how to connect your MongoDB backend to the existing React application.

## Current Architecture

### Frontend Structure
```
src/
├── components/          # All UI components
├── context/            # Authentication context
├── hooks/              # Custom hooks for data management
├── types/              # TypeScript interfaces
└── App.tsx             # Main app component
```

### Data Flow
1. **Authentication** - Users log in with name/email (currently in-memory)
2. **Dashboard** - Shows statistics and charts from stored records
3. **Forms** - Students add name, department, subject, and marks
4. **Data Management** - CRUD operations on student records

## API Integration Steps

### 1. Environment Variables
Add these to your `.env` file:
```
VITE_API_URL=http://localhost:5000/api
VITE_API_PORT=5000
```

### 2. Backend API Endpoints Required

Create these endpoints in your Express/Node backend:

#### Authentication
```
POST /api/auth/login
- Body: { name: string, email?: string }
- Response: { success: boolean, user: { id, name, email } }

POST /api/auth/logout
- Response: { success: boolean }
```

#### Student Records
```
GET /api/records
- Headers: Authorization: Bearer <token>
- Response: { records: StudentRecord[] }

POST /api/records
- Headers: Authorization: Bearer <token>
- Body: { name: string, department: string, subject: string, mark: number }
- Response: { success: boolean, record: StudentRecord }

DELETE /api/records/:id
- Headers: Authorization: Bearer <token>
- Response: { success: boolean }
```

### 3. Update Frontend API Client

Create a new file `src/services/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Authentication
  async login(userData: { name: string; email?: string }) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include',
    });
    return response.json();
  },

  // Records
  async getRecords() {
    const response = await fetch(`${API_URL}/records`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      credentials: 'include',
    });
    return response.json();
  },

  async addRecord(record: StudentRecord) {
    const response = await fetch(`${API_URL}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(record),
      credentials: 'include',
    });
    return response.json();
  },

  async deleteRecord(id: string) {
    const response = await fetch(`${API_URL}/records/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      credentials: 'include',
    });
    return response.json();
  },
};
```

### 4. Update Data Hook

Modify `src/hooks/useStudentData.ts` to use the API instead of localStorage:

```typescript
import { api } from '../services/api';

const loadRecords = async () => {
  try {
    setLoading(true);
    const data = await api.getRecords();
    setRecords(data.records);
    setFilteredRecords(data.records);
  } catch (err) {
    setError('Failed to load records');
  } finally {
    setLoading(false);
  }
};

const addRecord = async (record: StudentRecord) => {
  try {
    const data = await api.addRecord(record);
    const updated = [...records, data.record];
    setRecords(updated);
    setFilteredRecords(updated);
    return data.record;
  } catch (err) {
    setError('Failed to add record');
    throw err;
  }
};
```

### 5. MongoDB Schema

Use this MongoDB schema:

```javascript
// Users Collection
{
  _id: ObjectId,
  name: String,
  email: String,
  createdAt: Date,
}

// StudentRecords Collection
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users
  name: String,
  department: String,
  subject: String,
  mark: Number,
  createdAt: Date,
}
```

### 6. CORS Configuration

In your Express backend, add CORS middleware:

```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true,
}));
```

## Current Features Implemented

✅ **Authentication**
- Login page with name/email input
- Session management
- Logout functionality

✅ **Dashboard**
- Statistics cards (Total Subjects, Average Marks, Completed, Pending)
- Bar chart showing marks by subject
- Pie chart showing subject distribution

✅ **Data Management**
- Add new student records with form validation
- View all records in a sortable/searchable table
- Delete records with confirmation
- Search by name, department, or subject
- Sort by any column
- Filter by department, subject, or minimum marks

✅ **UI/UX**
- Responsive design (mobile to desktop)
- Professional gradient theme
- Smooth transitions and hover effects
- Error handling and validation messages
- Loading states

## Local Storage Fallback

Currently, data is stored in browser localStorage. This allows testing without a backend. Once you add MongoDB integration, replace localStorage calls with API calls.

## Testing Without Backend

To test the frontend:
1. Run `npm run dev`
2. Enter any name and click "Sign In"
3. Add records through the form
4. View charts and statistics
5. All data persists in browser storage

## Frontend Files Reference

- **src/App.tsx** - Main application component
- **src/components/Login.tsx** - Authentication UI
- **src/components/Dashboard.tsx** - Main dashboard layout
- **src/components/StudentForm.tsx** - Form for adding records
- **src/components/DataTable.tsx** - Table with search/filter/sort
- **src/components/Charts.tsx** - Bar and Pie charts
- **src/context/AuthContext.tsx** - Authentication state management
- **src/hooks/useStudentData.ts** - Data management logic
- **src/types/index.ts** - TypeScript types

## Next Steps

1. Set up Express/Node backend with MongoDB
2. Create the API endpoints listed above
3. Update the API client in `src/services/api.ts`
4. Test end-to-end integration
5. Deploy to production

The frontend is production-ready and waiting for your backend!
