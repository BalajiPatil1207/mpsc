const express = require('express');
const router = express.Router();
const { getDashboardStats, getScannedNotes } = require('../controllers/userController');
const requireAuth = require('../middleware/auth');

router.get('/dashboard-stats', requireAuth, getDashboardStats);
router.get('/notes', requireAuth, getScannedNotes);

module.exports = router;
