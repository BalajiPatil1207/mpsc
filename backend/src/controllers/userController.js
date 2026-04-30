const mongoose = require('mongoose');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { handle200 } = require('../helper/successHandler');
const { handle404, handle500 } = require('../helper/errorHandler');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return handle404(res, 'User not found');
    
    const recentProgress = await Progress.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(5);
    const totalSolved = await Progress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: null, total: { $sum: "$score" } } }
    ]);
    
    handle200(res, { 
      user, 
      recentProgress, 
      stats: { 
        totalSolved: totalSolved[0]?.total || 0 
      } 
    }, 'User profile fetched');
  } catch (error) {
    handle500(res, error);
  }
};

module.exports = {
  getProfile,
};
