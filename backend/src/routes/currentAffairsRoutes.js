const express = require('express');
const router = express.Router();
const { getCurrentAffairs, updateCurrentAffairs } = require('../controllers/currentAffairsController');
const requireAuth = require('../middleware/auth');

router.get('/', requireAuth, getCurrentAffairs);
router.post('/', requireAuth, updateCurrentAffairs);

module.exports = router;
