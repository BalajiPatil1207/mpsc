const prisma = require('../config/prisma');
const { handle200 } = require('../helper/successHandler');
const { handle500 } = require('../helper/errorHandler');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch tests to calculate accuracy and weak areas
    const tests = await prisma.testSession.findMany({
      where: { userId }
    });

    // Mock progress calculation (Dynamic but simple for now)
    const progress = tests.length * 5; // e.g., 5% per test 

    // Generate dynamic tasks based on subjects
    const subjects = await prisma.subject.findMany({ include: { topics: true } });
    const tasks = [];
    
    // Add real subjects to tasks dynamically
    subjects.forEach((subject, i) => {
      if (subject.topics.length > 0) {
        tasks.push({
          subject: subject.name,
          topic: subject.topics[0].name,
          time: '45 min',
          done: false,
          color: i % 2 === 0 ? 'text-amber-500' : 'text-blue-500'
        });
      }
    });

    if (tasks.length === 0) {
      tasks.push({ subject: 'No Subjects yet', topic: 'Add to Syllabus', done: false, color: 'text-gray-500', time: '5 min' });
    }

    // Weak Areas dynamic calculation (lowest scores)
    const weakAreas = [];
    if (tests.length > 0) {
      weakAreas.push({ name: 'Latest Subject Test', score: tests[tests.length-1].score * 10, color: 'bg-red-500' });
    } else {
      weakAreas.push({ name: 'Mathematics', score: 45, color: 'bg-red-500' });
      weakAreas.push({ name: 'Polity', score: 55, color: 'bg-yellow-500' });
    }

    handle200(res, {
      progress: Math.min(progress, 100),
      streak: tests.length, // using test count as streak for demo
      tasks: tasks.slice(0, 5),
      weakAreas
    }, 'Dashboard stats fetched');
  } catch (error) {
    handle500(res, error);
  }
};

const getScannedNotes = async (req, res) => {
  try {
    const notes = await prisma.scannedNote.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    handle200(res, notes, 'Fetched all notes');
  } catch (error) {
    handle500(res, error);
  }
};

module.exports = { getDashboardStats, getScannedNotes };
