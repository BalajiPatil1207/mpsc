const express = require('express');
const router = express.Router();
const { getQuizzes, submitQuiz, createQuiz, getCategories } = require('../controllers/quizController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getQuizzes);
router.get('/categories', authenticateToken, getCategories);
router.post('/submit', authenticateToken, submitQuiz);
router.post('/create', createQuiz); // Admin or dev route to seed data

module.exports = router;
