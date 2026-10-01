const express = require('express');
const router = express.Router();
const { getMasterSyllabus, getSyllabusProgress, getExamDate, setExamDate } = require('../controllers/syllabusController');
const requireAuth = require('../middleware/auth');

router.get('/master', requireAuth, getMasterSyllabus);
router.get('/progress', requireAuth, getSyllabusProgress);

router.get('/exam-date', getExamDate);
router.post('/exam-date', setExamDate);

module.exports = router;
