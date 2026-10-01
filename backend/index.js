require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const syllabusRoutes = require('./src/routes/syllabusRoutes');
const scannerRoutes = require('./src/routes/scannerRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const userRoutes = require('./src/routes/userRoutes');
const studyPlanRoutes = require('./src/routes/studyPlanRoutes');
const currentAffairsRoutes = require('./src/routes/currentAffairsRoutes');

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/scanner', scannerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/current-affairs', currentAffairsRoutes);

app.get('/', (req, res) => {
  res.send('MPSC Quiz API is running...');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Trigger nodemon restart 4
