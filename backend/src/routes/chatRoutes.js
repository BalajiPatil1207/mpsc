const express = require('express');
const router = express.Router();
const { processChat } = require('../controllers/chatController');
const requireAuth = require('../middleware/auth');

router.post('/', requireAuth, processChat);

module.exports = router;
