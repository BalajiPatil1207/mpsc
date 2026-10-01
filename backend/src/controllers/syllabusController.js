const prisma = require('../config/prisma');
const { handle200 } = require('../helper/successHandler');
const { handle500 } = require('../helper/errorHandler');

const getMasterSyllabus = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        topics: {
          include: {
            subTopics: true
          }
        }
      }
    });
    
    handle200(res, subjects, 'Master syllabus fetched successfully');
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
