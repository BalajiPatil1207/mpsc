const express = require('express');
const router = express.Router();
const { submitQuiz, getWeekendTest, createManualTest, getTestHistory, getDailyMissionTest, getMistakeTest, getCommunityTests } = require('../controllers/quizController');
const requireAuth = require('../middleware/auth');

router.post('/submit', requireAuth, submitQuiz);
router.get('/community', requireAuth, getCommunityTests);
router.get('/weekend', requireAuth, getWeekendTest);
router.get('/daily', requireAuth, getDailyMissionTest);
router.get('/mistakes', requireAuth, getMistakeTest);
router.post('/manual', requireAuth, createManualTest);
router.get('/history', requireAuth, getTestHistory);

module.exports = router;
