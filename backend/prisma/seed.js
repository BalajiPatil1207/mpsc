const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding from mahaprep_ai_master_syllabus.json...');

  const syllabusPath = path.join(__dirname, '../mahaprep_ai_master_syllabus.json');
  if (!fs.existsSync(syllabusPath)) {
    console.error('❌ File not found at', syllabusPath);
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(syllabusPath, 'utf8'));
  const syllabus = rawData.syllabus;
  
  // We will build a unified structure in memory to handle cross-exam overlaps efficiently
  const unifiedSubjects = new Map();

  const processExam = (examKey, examLabel) => {
    if (!syllabus[examKey]) return;
    
    for (const subject of syllabus[examKey]) {
      const subjectName = subject.subject.trim();
      if (!unifiedSubjects.has(subjectName)) {
        unifiedSubjects.set(subjectName, {
          name: subjectName,
          examTags: new Set(),
          topics: new Map()
        });
      }
      const uSubject = unifiedSubjects.get(subjectName);
      uSubject.examTags.add(examLabel);

      for (const topic of subject.topics) {
        const topicName = topic.name.trim();
        if (!uSubject.topics.has(topicName)) {
          uSubject.topics.set(topicName, {
            name: topicName,
            examTags: new Set(),
            subtopics: new Map()
          });
        }
        
        const uTopic = uSubject.topics.get(topicName);
        uTopic.examTags.add(examLabel);

        for (const subtopicName of topic.subtopics) {
          const sName = subtopicName.trim();
          if (!uTopic.subtopics.has(sName)) {
            // Setup defaults if they are missing
            const priorityMap = { high: 'HIGH', medium: 'MEDIUM', low: 'LOW' };
            
            uTopic.subtopics.set(sName, {
               name: sName,
               examTags: new Set(),
               priority: priorityMap[subject.priority] || 'MEDIUM',
               difficulty: 'MEDIUM',
               estimatedHours: 2.0, // default placeholder
               revisionDays: rawData.defaults?.revision_intervals_days || [1, 3, 7, 15, 30]
            });
          }
          uTopic.subtopics.get(sName).examTags.add(examLabel);
        }
      }
    }
  };

  // Process both MPSC and Talathi
  processExam('MPSC_RAJYASEVA', 'MPSC');
  processExam('TALATHI_GROUP_C', 'TALATHI');

  // Check if Both is needed
  // Note: For elements that have both MPSC and TALATHI, we can add 'BOTH'
  const appendBothTag = (tagsSet) => {
    if (tagsSet.has('MPSC') && tagsSet.has('TALATHI')) {
       tagsSet.add('BOTH');
    }
    return Array.from(tagsSet);
  };

  // Seed the Unified Database Tree
  for (const [subjName, uSubject] of unifiedSubjects.entries()) {
    console.log(`Processing Subject: ${subjName}`);
    
    const subjTags = appendBothTag(uSubject.examTags);
    
    const createdSubject = await prisma.subject.upsert({
      where: { name: subjName },
      update: { examTags: subjTags },
      create: { name: subjName, examTags: subjTags }
    });

    for (const [topicName, uTopic] of uSubject.topics.entries()) {
      const topicTags = appendBothTag(uTopic.examTags);

      let createdTopic = await prisma.topic.findFirst({
        where: { name: topicName, subjectId: createdSubject.id }
      });

      if (createdTopic) {
        createdTopic = await prisma.topic.update({
          where: { id: createdTopic.id },
          data: { examTags: topicTags }
        });
      } else {
        createdTopic = await prisma.topic.create({
          data: { name: topicName, subjectId: createdSubject.id, examTags: topicTags }
        });
      }

      for (const [subName, uSub] of uTopic.subtopics.entries()) {
        const subTags = appendBothTag(uSub.examTags);
        
        let createdSub = await prisma.subTopic.findFirst({
          where: { name: subName, topicId: createdTopic.id }
        });

        if (createdSub) {
           await prisma.subTopic.update({
             where: { id: createdSub.id },
             data: { examTags: subTags }
           });
        } else {
           await prisma.subTopic.create({
             data: {
               name: subName,
               topicId: createdTopic.id,
               priority: uSub.priority,
               difficulty: uSub.difficulty,
               estimatedHours: uSub.estimatedHours,
               revisionDays: uSub.revisionDays,
               examTags: subTags
             }
           });
        }
      }
    }
  }

  console.log('\n✅ Database Seeding Completed Successfully! Master Syllabus is now in the Database!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
