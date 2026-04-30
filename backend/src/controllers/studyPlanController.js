const StudyPlan = require('../models/StudyPlan');
const { handle200, handle201 } = require('../helper/successHandler');
const { handle404, handle500 } = require('../helper/errorHandler');

const getDailyPlan = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    let plan = await StudyPlan.findOne({ 
      userId: req.user.id, 
      date: { $gte: today } 
    });
    
    if (!plan) {
      // Create empty plan if not found
      plan = await StudyPlan.create({ userId: req.user.id, tasks: [] });
    }
    
    handle200(res, plan, 'Daily study plan fetched');
  } catch (error) {
    handle500(res, error);
  }
};

const updateDailyPlan = async (req, res) => {
  try {
    const { tasks } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);
    
    const plan = await StudyPlan.findOneAndUpdate(
      { userId: req.user.id, date: { $gte: today } },
      { tasks },
      { new: true, upsert: true }
    );
    
    handle200(res, plan, 'Daily study plan updated');
  } catch (error) {
    handle500(res, error);
  }
};

module.exports = {
  getDailyPlan,
  updateDailyPlan
};
