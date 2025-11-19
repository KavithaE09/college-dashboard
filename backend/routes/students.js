const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// GET all students for logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const students = await Student.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching student records', error: error.message });
  }
});

// GET dashboard statistics
router.get('/stats', isAuthenticated, async (req, res) => {
  try {
    const students = await Student.find({ userId: req.user.id });
    
    if (students.length === 0) {
      return res.json({
        totalSubjects: 0,
        averageMarks: 0,
        completedSubjects: 0,
        pendingSubjects: 0,
        chartData: {
          barChart: [],
          pieChart: []
        }
      });
    }

    // Calculate statistics
    const totalSubjects = students.length;
    const totalMarks = students.reduce((sum, student) => sum + student.mark, 0);
    const averageMarks = (totalMarks / totalSubjects).toFixed(2);
    
    // Assuming passing mark is 50
    const completedSubjects = students.filter(s => s.mark >= 50).length;
    const pendingSubjects = students.filter(s => s.mark < 50).length;

    // Prepare chart data
    const barChartData = students.map(s => ({
      subject: s.subject,
      mark: s.mark
    }));

    // Pie chart - distribution by performance
    const excellent = students.filter(s => s.mark >= 80).length;
    const good = students.filter(s => s.mark >= 60 && s.mark < 80).length;
    const average = students.filter(s => s.mark >= 50 && s.mark < 60).length;
    const needsImprovement = students.filter(s => s.mark < 50).length;

    const pieChartData = [
      { name: 'Excellent (80+)', value: excellent },
      { name: 'Good (60-79)', value: good },
      { name: 'Average (50-59)', value: average },
      { name: 'Needs Improvement (<50)', value: needsImprovement }
    ].filter(item => item.value > 0);

    res.json({
      totalSubjects,
      averageMarks: parseFloat(averageMarks),
      completedSubjects,
      pendingSubjects,
      chartData: {
        barChart: barChartData,
        pieChart: pieChartData
      }
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ message: 'Error calculating statistics', error: error.message });
  }
});

// POST create new student record
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { name, department, subject, mark } = req.body;

    // Validation
    if (!name || !department || !subject || mark === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (mark < 0 || mark > 100) {
      return res.status(400).json({ message: 'Mark must be between 0 and 100' });
    }

    const student = new Student({
      userId: req.user.id,
      name: name.trim(),
      department,
      subject,
      mark: parseInt(mark)
    });

    await student.save();
    res.status(201).json({ 
      message: 'Student record created successfully', 
      student 
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student record', error: error.message });
  }
});

// PUT update student record
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { name, department, subject, mark } = req.body;

    // Find student and verify ownership
    const student = await Student.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    // Validation
    if (mark !== undefined && (mark < 0 || mark > 100)) {
      return res.status(400).json({ message: 'Mark must be between 0 and 100' });
    }

    // Update fields
    if (name) student.name = name.trim();
    if (department) student.department = department;
    if (subject) student.subject = subject;
    if (mark !== undefined) student.mark = parseInt(mark);

    await student.save();
    res.json({ 
      message: 'Student record updated successfully', 
      student 
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student record', error: error.message });
  }
});

// DELETE student record
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    res.json({ message: 'Student record deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student record', error: error.message });
  }
});

module.exports = router;