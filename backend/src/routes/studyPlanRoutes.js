const express = require('express');
const router = express.Router();
const { getDailyPlan, completeMission, uncompleteMission } = require('../controllers/studyPlanController');
const requireAuth = require('../middleware/auth');

router.get('/daily', requireAuth, getDailyPlan);
router.post('/complete', requireAuth, completeMission);
router.post('/uncomplete', requireAuth, uncompleteMission);

module.exports = router;
