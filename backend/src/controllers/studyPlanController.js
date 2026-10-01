const prisma = require('../config/prisma');
const fs = require('fs');
const path = require('path');
const { handle200 } = require('../helper/successHandler');
const { handle500 } = require('../helper/errorHandler');

const getDailyPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const dateString = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const configKey = `mission_${userId}_${dateString}`;

    // 1. Fetch completed topics natively from DB
    const progress = await prisma.userProgress.findMany({
      where: { userId, completed: true }
    });
    const completedSet = new Set(progress.map(p => `${p.subjectName}|${p.topicName}`));

    // 2. Check if we already generated a plan for TODAY
    const existingPlan = await prisma.appConfig.findUnique({
      where: { key: configKey }
    });

    if (existingPlan) {
      // Missions already exist for today! Send them and just dynamically attach done status
      const savedMissions = JSON.parse(existingPlan.value);
      savedMissions.forEach(mission => {
        mission.done = completedSet.has(`${mission.subjectName}|${mission.topicName}`);
      });
      return handle200(res, savedMissions, 'Fetched locked daily missions');
    }

    // 3. Fallback: Generate NEW daily plan if a plan for today doesn't exist
    const syllabusPath = path.join(__dirname, '../../mahaprep_ai_master_syllabus.json');
    const rawData = fs.readFileSync(syllabusPath, 'utf8');
    const jsonData = JSON.parse(rawData);
    
    const mpsc = jsonData.syllabus.MPSC_RAJYASEVA;
    const dailyMissions = [];
    
    for (const subj of mpsc) {
      if (dailyMissions.length >= 3) break;
      
      for (const topic of subj.topics) {
        if (!completedSet.has(`${subj.subject}|${topic.name}`)) {
          dailyMissions.push({
            subjectName: subj.subject,
            topicName: topic.name,
            reward: 50,
            done: false
          });
          break; // take max 1 topic per subject
        }
      }
    }

    // Save this freshly generated plan into the database for the rest of the day!
    await prisma.appConfig.create({
      data: {
        key: configKey,
        value: JSON.stringify(dailyMissions)
      }
    });

    handle200(res, dailyMissions, 'Generated and saved dynamic daily missions');
  } catch (error) {
    handle500(res, error);
  }
};

const completeMission = async (req, res) => {
  try {
    const { subjectName, topicName } = req.body;
    const userId = req.user.id;

    // Insert user progress tracker
    const newProgress = await prisma.userProgress.upsert({
      where: {
        userId_subjectName_topicName: {
          userId,
          subjectName,
          topicName
        }
      },
      update: { completed: true },
      create: {
        userId,
        subjectName,
        topicName,
        completed: true
      }
    });

    // Option: also increase user points
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 50 } }
    });

    handle200(res, newProgress, 'Mission marked as complete');
  } catch (error) {
    handle500(res, error);
  }
};

const uncompleteMission = async (req, res) => {
  try {
    const { subjectName, topicName } = req.body;
    const userId = req.user.id;

    // Remove or update the user progress tracker
    await prisma.userProgress.updateMany({
      where: {
        userId,
        subjectName,
        topicName
      },
      data: { completed: false }
    });

    // Optionally decrease points because of the undo
    await prisma.user.update({
      where: { id: userId },
      data: { points: { decrement: 50 } }
    });

    handle200(res, { success: true }, 'Mission marked as incomplete');
  } catch (error) {
    handle500(res, error);
  }
};

module.exports = {
  getDailyPlan,
  completeMission,
  uncompleteMission
};
