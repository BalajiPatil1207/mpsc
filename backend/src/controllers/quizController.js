const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { handle200, handle201 } = require('../helper/successHandler');
const { handle404, handle500 } = require('../helper/errorHandler');

const getQuizzes = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const quizzes = await Quiz.aggregate([
      { $match: filter },
      { $sample: { size: 10 } }
    ]);
    
    handle200(res, quizzes, `Quizzes fetched successfully ${category ? `for ${category}` : ''}`);
  } catch (error) {
    handle500(res, error);
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { score, totalQuestions, category, difficulty } = req.body;
    const userId = req.user.id;

    // Save progress
    await Progress.create({ userId, score, totalQuestions, category, difficulty });

    // Update User Stats (Gamification)
    const user = await User.findById(userId);
    if (!user) return handle404(res, 'User not found');

    const pointsEarned = score * 10;
    user.points += pointsEarned;

    // Streak Logic
    const today = new Date().setHours(0, 0, 0, 0);
    const lastQuizDate = user.lastQuizDate ? new Date(user.lastQuizDate).setHours(0, 0, 0, 0) : null;

    if (lastQuizDate === today) {
      // Already played today, no streak change
    } else if (lastQuizDate === today - 86400000) {
      user.streak += 1;
    } else {
      user.streak = 1;
    }

    if (user.streak > (user.longestStreak || 0)) {
      user.longestStreak = user.streak;
    }

    user.lastQuizDate = new Date();

    // Level Up Logic (e.g., every 500 points)
    user.level = Math.floor(user.points / 500) + 1;

    // Badge Logic
    if (user.streak === 7 && !user.badges.some(b => b.name === '7 Day Streak')) {
      user.badges.push({ name: '7 Day Streak' });
    }
    if (user.points >= 1000 && !user.badges.some(b => b.name === 'Point Master')) {
      user.badges.push({ name: 'Point Master' });
    }

    await user.save();

    handle200(res, { pointsEarned, totalPoints: user.points, streak: user.streak, level: user.level, badges: user.badges }, 'Quiz submitted and progress updated');
  } catch (error) {
    handle500(res, error);
  }
};

const createQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        handle201(res, quiz, 'Quiz created successfully');
    } catch (error) {
        handle500(res, error);
    }
}

const getCategories = async (req, res) => {
  try {
    const categories = await Quiz.distinct('category');
    handle200(res, categories, 'Categories fetched successfully');
  } catch (error) {
    handle500(res, error);
  }
};

module.exports = {
  getQuizzes,
  submitQuiz,
  createQuiz,
  getCategories
};
