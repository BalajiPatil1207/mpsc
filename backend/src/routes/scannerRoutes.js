const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processScan } = require('../controllers/scannerController');
const requireAuth = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/process', requireAuth, upload.array('images', 5), processScan);

module.exports = router;
