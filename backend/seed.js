require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./src/models/Quiz');

const sampleQuizzes = [
  {
    question: "Who was the first Chief Minister of Maharashtra?",
    options: ["Yashwantrao Chavan", "Sharad Pawar", "Vasantrao Naik", "Marotrao Kannamwar"],
    correctAnswer: "Yashwantrao Chavan",
    category: "History",
    difficulty: "easy"
  },
  {
    question: "Which river is known as the 'Dakshin Ganga'?",
    options: ["Krishna", "Kaveri", "Godavari", "Narmada"],
    correctAnswer: "Godavari",
    category: "Geography",
    difficulty: "medium"
  },
  {
    question: "In which year was the state of Maharashtra formed?",
    options: ["1956", "1960", "1962", "1950"],
    correctAnswer: "1960",
    category: "History",
    difficulty: "easy"
  },
  {
    question: "Which district in Maharashtra is known as the 'Wine Capital of India'?",
    options: ["Pune", "Nagpur", "Nashik", "Aurangabad"],
    correctAnswer: "Nashik",
    category: "Geography",
    difficulty: "easy"
  },
  {
    question: "Who is known as the 'Father of the Indian Constitution'?",
    options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
    correctAnswer: "Dr. B.R. Ambedkar",
    category: "Polity",
    difficulty: "easy"
  },
  {
    question: "Which article of the Indian Constitution deals with the 'Right to Equality'?",
    options: ["Article 14", "Article 19", "Article 21", "Article 32"],
    correctAnswer: "Article 14",
    category: "Polity",
    difficulty: "medium"
  },
  {
    question: "The Ajanta Caves are located in which district?",
    options: ["Pune", "Aurangabad (Sambhaji Nagar)", "Nagpur", "Nashik"],
    correctAnswer: "Aurangabad (Sambhaji Nagar)",
    category: "History",
    difficulty: "medium"
  },
  {
    question: "Which peak is the highest point in Maharashtra?",
    options: ["Kalsubai", "Salher", "Mahabaleshwar", "Saputara"],
    correctAnswer: "Kalsubai",
    category: "Geography",
    difficulty: "medium"
  },
  {
    question: "The Rajya Sabha can have a maximum of how many members?",
    options: ["230", "245", "250", "260"],
    correctAnswer: "250",
    category: "Polity",
    difficulty: "medium"
  },
  {
    question: "Who was the founder of the Maratha Empire?",
    options: ["Chhatrapati Shivaji Maharaj", "Sambhaji Maharaj", "Peshwa Baji Rao", "Shahaji Raje"],
    correctAnswer: "Chhatrapati Shivaji Maharaj",
    category: "History",
    difficulty: "easy"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");
    
    await Quiz.deleteMany({});
    await Quiz.insertMany(sampleQuizzes);
    
    console.log("Sample quizzes seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
