const prisma = require('../config/prisma');
const { handle200, handle201 } = require('../helper/successHandler');
const { handle500 } = require('../helper/errorHandler');

const submitQuiz = async (req, res) => {
  try {
    const { type, score, total, accuracy } = req.body;
    const userId = req.user.id;

    const testSession = await prisma.testSession.create({
      data: {
        userId,
        type: type || 'AI_Test',
        score: Math.round(score), // in case negative or float is passed
        total,
        accuracy
      }
    });

    handle201(res, testSession, 'Test results saved to database');
  } catch (error) {
    console.error('Submit Quiz Error:', error);
    handle500(res, error);
  }
};

const getWeekendTest = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch ALL notes from the global community pool to maximize MCQ variety
    const notes = await prisma.scannedNote.findMany();

    let allQuestions = [];
    notes.forEach(note => {
      try {
        const parsed = JSON.parse(note.aiContent);
        if (parsed && parsed.mcqs && Array.isArray(parsed.mcqs)) {
          allQuestions.push(...parsed.mcqs);
        }
      } catch(e) {}
    });

    // Deduplicate by question text
    const uniqueMap = new Map();
    allQuestions.forEach(q => {
      if (q.q) uniqueMap.set(q.q.trim(), q);
    });
    allQuestions = Array.from(uniqueMap.values());

    // Shuffle array
    allQuestions = allQuestions.sort(() => 0.5 - Math.random());
    
    // Take minimum 10, maximum 100
    const testQuestions = allQuestions.slice(0, 100);

    if (testQuestions.length < 10) {
      return res.status(400).json({ status: false, message: 'Not enough MCQs generated yet for a Weekend Test! Scan more pages.' });
    }

    handle200(res, testQuestions, 'Generated Weekend Test');
  } catch (error) {
    handle500(res, error);
  }
};

const createManualTest = async (req, res) => {
  try {
    const { questionsArray, timeLimit } = req.body;
    const userId = req.user.id;

    if (!questionsArray || !Array.isArray(questionsArray)) {
      return res.status(400).json({ status: false, message: 'Invalid questions array data' });
    }

    // Save as a manual note so the Weekend Pool can fetch these questions
    await prisma.scannedNote.create({
      data: {
        userId,
        aiContent: JSON.stringify({
          subject: "Manual Custom Test",
          topic: "Mixed Custom Topics",
          shortNotes: ["User uploaded manual test"],
          mcqs: questionsArray
        }),
        photoUrl: null
      }
    });

    handle200(res, { success: true }, 'Manual test successfully saved and integrated to test pool!');
  } catch (error) {
    handle500(res, error);
  }
};

const getDailyMissionTest = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await prisma.scannedNote.findMany();
    let allQuestions = [];
    notes.forEach(note => {
      try {
        const parsed = JSON.parse(note.aiContent);
        if (parsed && parsed.mcqs && Array.isArray(parsed.mcqs)) {
          allQuestions.push(...parsed.mcqs);
        }
      } catch(e) {}
    });

    const uniqueMap = new Map();
    allQuestions.forEach(q => {
      if (q.q) uniqueMap.set(q.q.trim(), q);
    });
    allQuestions = Array.from(uniqueMap.values());

    allQuestions = allQuestions.sort(() => 0.5 - Math.random());
    const testQuestions = allQuestions.slice(0, 25);

    if (testQuestions.length < 5) {
      return res.status(400).json({ status: false, message: 'Please scan some study material first to generate daily questions!' });
    }

    handle200(res, testQuestions, 'Generated Daily Mission Test');
  } catch (error) {
    handle500(res, error);
  }
};

const getMistakeTest = async (req, res) => {
  try {
    const userId = req.user.id;
    // Communitized Mistake Pool
    const notes = await prisma.scannedNote.findMany();
    let allQuestions = [];
    notes.forEach(note => {
      try {
        const parsed = JSON.parse(note.aiContent);
        if (parsed && parsed.mcqs && Array.isArray(parsed.mcqs)) {
          allQuestions.push(...parsed.mcqs);
        }
      } catch(e) {}
    });

    const uniqueMap = new Map();
    allQuestions.forEach(q => {
      if (q.q) uniqueMap.set(q.q.trim(), q);
    });
    allQuestions = Array.from(uniqueMap.values());

    // Shuffle and assume these are hard ones / mistakes for demo
    allQuestions = allQuestions.sort(() => 0.5 - Math.random());
    const testQuestions = allQuestions.slice(0, 15);

    if (testQuestions.length < 5) {
      return res.status(400).json({ status: false, message: 'Not enough data to find patterns in mistakes yet!' });
    }

    handle200(res, testQuestions, 'Generated 3-Day Mistake Test');
  } catch (error) {
    handle500(res, error);
  }
};

const getTestHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch all test sessions for this user
    const userTests = await prisma.testSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate global pool total specifically to incentivize community test solving
    const globalNotes = await prisma.scannedNote.findMany();
    let globalPoolCount = 0;
    globalNotes.forEach(note => {
      try {
        const parsed = JSON.parse(note.aiContent);
        if (parsed && parsed.mcqs && Array.isArray(parsed.mcqs)) {
          globalPoolCount += parsed.mcqs.length;
        }
      } catch(e) {}
    });

    if (userTests.length === 0) {
      return handle200(res, {
        testsCount: 0,
        avgAccuracy: 0,
        mcqsSolved: 0,
        mistakesLogged: 0,
        recentTests: [],
        globalPoolCount
      }, 'No tests found yet.');
    }

    let mcqsSolved = 0;
    let mistakesLogged = 0;
    let totalAccuracySum = 0;

    userTests.forEach(test => {
       mcqsSolved += test.total;
       totalAccuracySum += test.accuracy;
       
       // Reverse engineer the mistakes using accuracy since testing engine submitted it flawlessly
       const correctApprox = Math.round((test.accuracy / 100) * test.total);
       mistakesLogged += (test.total - correctApprox);
    });

    const avgAccuracy = Math.round(totalAccuracySum / userTests.length);

    handle200(res, {
      testsCount: userTests.length,
      avgAccuracy,
      mcqsSolved,
      mistakesLogged,
      recentTests: userTests,
      globalPoolCount
    }, 'Test history metrics fetched');
  } catch (error) {
    handle500(res, error);
  }
};

module.exports = { submitQuiz, getWeekendTest, createManualTest, getTestHistory, getDailyMissionTest, getMistakeTest };
