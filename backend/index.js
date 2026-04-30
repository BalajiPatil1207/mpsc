require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const userRoutes = require('./src/routes/userRoutes');
const studyPlanRoutes = require('./src/routes/studyPlanRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);
app.use('/api/study-plan', studyPlanRoutes);

app.get('/', (req, res) => {
  res.send('MPSC Quiz API is running...');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
