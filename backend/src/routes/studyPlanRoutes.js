const express = require('express');
const router = express.Router();
const { getDailyPlan, updateDailyPlan } = require('../controllers/studyPlanController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/daily', authenticateToken, getDailyPlan);
router.post('/daily', authenticateToken, updateDailyPlan);

module.exports = router;
