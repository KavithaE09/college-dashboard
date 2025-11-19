import { useState, useEffect } from 'react';

export const useStudentData = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    try {
      const storedRecords = localStorage.getItem('studentRecords');
      if (storedRecords) {
        const parsed = JSON.parse(storedRecords);
        setRecords(parsed);
        setFilteredRecords(parsed);
      }
    } catch (err) {
      setError('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const addRecord = (record) => {
    try {
      const newRecord = {
        ...record,
        _id: Date.now().toString(),
        createdAt: new Date(),
      };
      const updated = [...records, newRecord];
      setRecords(updated);
      setFilteredRecords(updated);
      localStorage.setItem('studentRecords', JSON.stringify(updated));
      return newRecord;
    } catch (err) {
      setError('Failed to add record');
      throw err;
    }
  };

  const deleteRecord = (id) => {
    try {
      const updated = records.filter((r) => r._id !== id);
      setRecords(updated);
      setFilteredRecords(updated);
      localStorage.setItem('studentRecords', JSON.stringify(updated));
    } catch (err) {
      setError('Failed to delete record');
    }
  };

  const calculateStats = () => {
    const uniqueSubjects = new Set(records.map((r) => r.subject));
    const totalMarks = records.reduce((sum, r) => sum + r.mark, 0);
    const averageMarks = records.length > 0 ? Math.round(totalMarks / records.length) : 0;

    return {
      totalSubjects: uniqueSubjects.size,
      averageMarks,
      completedSubjects: records.length,
      pendingSubjects: 0,
    };
  };

  const searchRecords = (query) => {
    if (!query) {
      setFilteredRecords(records);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = records.filter(
      (record) =>
        record.name.toLowerCase().includes(lowerQuery) ||
        record.department.toLowerCase().includes(lowerQuery) ||
        record.subject.toLowerCase().includes(lowerQuery)
    );
    setFilteredRecords(filtered);
  };

  const sortRecords = (key, order = 'asc') => {
    const sorted = [...filteredRecords].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (typeof aVal === 'string') {
        return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number') {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    setFilteredRecords(sorted);
  };

  const filterRecords = (key, value) => {
    const filtered = records.filter((record) => {
      if (key === 'mark') {
        return record.mark >= Number(value);
      }
      return record[key].toLowerCase().includes(value.toLowerCase());
    });
    setFilteredRecords(filtered);
  };

  return {
    records,
    filteredRecords,
    loading,
    error,
    addRecord,
    deleteRecord,
    calculateStats,
    searchRecords,
    sortRecords,
    filterRecords,
    loadRecords,
  };
};
