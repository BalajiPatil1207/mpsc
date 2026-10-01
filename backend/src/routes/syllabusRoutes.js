const express = require('express');
const router = express.Router();
const { getMasterSyllabus, getSyllabusProgress, getExamDate, setExamDate } = require('../controllers/syllabusController');

router.get('/master', getMasterSyllabus);
router.get('/progress', getSyllabusProgress);

router.get('/exam-date', getExamDate);
router.post('/exam-date', setExamDate);

module.exports = router;
