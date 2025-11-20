import { useState, useEffect } from 'react';

export const useStudentData = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load records from localStorage on mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('studentRecords');
    if (savedRecords) {
      try {
        const parsed = JSON.parse(savedRecords);
        setRecords(parsed);
        setFilteredRecords(parsed);
      } catch (error) {
        console.error('Error loading records:', error);
        setRecords([]);
        setFilteredRecords([]);
      }
    }
  }, []);

  // Save records to localStorage whenever they change
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('studentRecords', JSON.stringify(records));
    }
  }, [records]);

  // Add a new record
  const addRecord = (record) => {
    const newRecord = {
      id: Date.now().toString(),
      ...record,
      mark: parseInt(record.mark) || 0,
      createdAt: new Date().toISOString()
    };
    
    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords);
    return newRecord;
  };

  // Delete a record
  const deleteRecord = (id) => {
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords.filter(record => 
      matchesSearch(record, searchTerm)
    ));
  };

  // Helper function to check if record matches search
  const matchesSearch = (record, term) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    return (
      record.name?.toLowerCase().includes(lowerTerm) ||
      record.department?.toLowerCase().includes(lowerTerm) ||
      record.subject?.toLowerCase().includes(lowerTerm)
    );
  };

  // Search records
  const searchRecords = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(record => matchesSearch(record, term));
      setFilteredRecords(filtered);
    }
  };

  // Sort records
  const sortRecords = (field, direction = 'asc') => {
    const sorted = [...filteredRecords].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field === 'mark') {
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    setFilteredRecords(sorted);
  };

  // Filter records by criteria
  const filterRecords = (criteria) => {
    let filtered = [...records];

    if (criteria.department) {
      filtered = filtered.filter(r => r.department === criteria.department);
    }
    if (criteria.subject) {
      filtered = filtered.filter(r => r.subject === criteria.subject);
    }
    if (criteria.minMark !== undefined) {
      filtered = filtered.filter(r => parseInt(r.mark) >= criteria.minMark);
    }
    if (criteria.maxMark !== undefined) {
      filtered = filtered.filter(r => parseInt(r.mark) <= criteria.maxMark);
    }

    setFilteredRecords(filtered);
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalSubjects = records.length;
    const uniqueSubjects = new Set(records.map(r => r.subject)).size;
    
    const averageMarks = totalSubjects > 0
      ? Math.round(records.reduce((sum, r) => sum + (parseInt(r.mark) || 0), 0) / totalSubjects)
      : 0;

    const completedSubjects = records.filter(r => parseInt(r.mark) >= 40).length;
    const pendingSubjects = records.filter(r => parseInt(r.mark) < 40).length;

    // Data for charts
    const marksBySubject = records.reduce((acc, record) => {
      const subject = record.subject || 'Unknown';
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(parseInt(record.mark) || 0);
      return acc;
    }, {});

    const chartData = Object.keys(marksBySubject).map(subject => ({
      subject,
      mark: Math.round(
        marksBySubject[subject].reduce((a, b) => a + b, 0) / marksBySubject[subject].length
      )
    }));

    // Subject distribution for pie chart
    const subjectDistribution = records.reduce((acc, record) => {
      const subject = record.subject || 'Unknown';
      acc[subject] = (acc[subject] || 0) + 1;
      return acc;
    }, {});

    const pieData = Object.keys(subjectDistribution).map(subject => ({
      name: subject,
      value: subjectDistribution[subject]
    }));

    return {
      totalSubjects,
      uniqueSubjects,
      averageMarks,
      completedSubjects,
      pendingSubjects,
      chartData,
      pieData
    };
  };

  return {
    records,
    filteredRecords,
    calculateStats,
    addRecord,
    deleteRecord,
    searchRecords,
    sortRecords,
    filterRecords
  };
};