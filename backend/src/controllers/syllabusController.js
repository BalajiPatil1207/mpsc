const prisma = require('../config/prisma');
const { handle200 } = require('../helper/successHandler');
const { handle500 } = require('../helper/errorHandler');

const fs = require('fs');
const path = require('path');

const getMasterSyllabus = async (req, res) => {
  try {
    const syllabusPath = path.join(__dirname, '../../mahaprep_ai_master_syllabus.json');
    const rawData = fs.readFileSync(syllabusPath, 'utf8');
    const jsonData = JSON.parse(rawData);
    
    const mpsc = jsonData.syllabus.MPSC_RAJYASEVA;
    
    const userId = req.user.id;
    
    // Fetch all completed topics for this user
    const userProgress = await prisma.userProgress.findMany({
      where: { userId, completed: true }
    });
    const completedSet = new Set(userProgress.map(p => `${p.subjectName}|${p.topicName}`));
    
    // Map to frontend expected shape
    const transformed = mpsc.map((subj, idx) => {
      let completedTopicsCount = 0;
      
      const topicsWithStatus = subj.topics.map((t, tidx) => {
         const isCompleted = completedSet.has(`${subj.subject}|${t.name}`);
         if (isCompleted) completedTopicsCount++;
         
         return {
           id: tidx,
           name: t.name,
           subtopics: t.subtopics,
           completed: isCompleted
         };
      });
      
      const progress = Math.round((completedTopicsCount / subj.topics.length) * 100);

      return {
        id: idx,
        name: subj.subject,
        progress: progress, // Exact percentage
        topics: topicsWithStatus
      };
    });
    
    handle200(res, transformed, 'Master syllabus fetched successfully from JSON file');
  } catch (error) {
    handle500(res, error);
  }
};

const getSyllabusProgress = async (req, res) => {
  // Mock logic: eventually linked to user progress
  try {
    const subjects = await prisma.subject.findMany();
    // Assign dummy progress for now since UserProgress table isn't fully scaffolded
    const progressData = subjects.map(s => ({
       id: s.id,
       name: s.name,
       progress: Math.floor(Math.random() * 100)
    }));
    handle200(res, progressData, 'Syllabus progress fetched');
  } catch (error) {
    handle500(res, error);
  }
};

const getExamDate = async (req, res) => {
  try {
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "AppConfig" (id SERIAL PRIMARY KEY, "key" VARCHAR(255) UNIQUE, "value" TEXT)`;
    const result = await prisma.$queryRaw`SELECT value FROM "AppConfig" WHERE key = 'examDate' LIMIT 1`;
    const examDate = (result && result.length > 0) ? result[0].value : null;
    handle200(res, { examDate }, 'Exam date fetched');
  } catch (error) {
    handle500(res, error);
  }
};

const setExamDate = async (req, res) => {
  try {
    const { examDate } = req.body;
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "AppConfig" (id SERIAL PRIMARY KEY, "key" VARCHAR(255) UNIQUE, "value" TEXT)`;
    await prisma.$executeRaw`
      INSERT INTO "AppConfig" ("key", "value") 
      VALUES ('examDate', ${examDate}) 
      ON CONFLICT ("key") DO UPDATE SET "value" = ${examDate}
    `;
    handle200(res, { examDate }, 'Exam date updated securely');
  } catch (error) {
    handle500(res, error);
  }
};

module.exports = {
  getMasterSyllabus,
  getSyllabusProgress,
  getExamDate,
  setExamDate
};
