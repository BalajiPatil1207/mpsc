import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import { Timer, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';

  useEffect(() => {
    fetchQuizzes(category);
    return () => clearInterval(timerRef.current);
  }, [category]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft]);

  const fetchQuizzes = async (cat) => {
    try {
      const response = await api.get(`/quiz?category=${cat}`);
      setQuestions(response.data.data);
      if (response.data.data.length > 0) {
        startTimer();
      }
    } catch (error) {
      console.error('Failed to fetch quizzes', error);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimeLeft(30);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  };

  const handleOptionSelect = (option) => {
    if (selectedOption) return; // Prevent multiple selections
    setSelectedOption(option);
    if (option === questions[currentIdx].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      startTimer();
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    clearInterval(timerRef.current);
    setIsFinished(true);
    try {
      const result = await api.post('/quiz/submit', {
        score,
        totalQuestions: questions.length,
      });
      navigate('/result', { state: { score, total: questions.length, results: result.data.data } });
    } catch (error) {
      console.error('Failed to submit quiz', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-xl">Loading Questions...</div>;
  if (questions.length === 0) return <div className="p-8 text-center text-xl">No questions found. Please add some quizzes first.</div>;

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Quiz Header */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">{category || 'General Quiz'}</h1>
            <p className="text-gray-500 font-medium">Mission in progress...</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-gray-400">Time Left</p>
              <div className={`flex items-center gap-2 font-black text-2xl ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                <Timer size={24} />
                {timeLeft}s
              </div>
            </div>
            <div className="text-center">
               <p className="text-[10px] uppercase font-bold text-gray-400">Score</p>
               <div className="text-2xl font-black text-emerald-600">
                 {score * 10} XP
               </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-2 text-gray-600 font-bold">
            <span className="text-blue-600">Question {currentIdx + 1}</span>
            <span className="text-gray-300">/</span>
            <span>{questions.length}</span>
          </div>
        </div>

        <ProgressBar value={currentIdx + 1} max={questions.length} className="mb-8 h-3 rounded-full" />

        <Card className="p-6 md:p-8 shadow-xl border-t-4 border-blue-500">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">{currentQuestion.question}</h2>

          <div className="grid grid-cols-1 gap-4 mb-8">
            {currentQuestion.options.map((option, i) => {
              const isSelected = selectedOption === option;
              const isCorrect = selectedOption && option === currentQuestion.correctAnswer;
              const isWrong = isSelected && option !== currentQuestion.correctAnswer;

              return (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(option)}
                  disabled={!!selectedOption}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                    isCorrect 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : isWrong 
                        ? 'border-red-500 bg-red-50 text-red-700' 
                        : isSelected 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                  {isCorrect && <CheckCircle2 className="text-emerald-500" />}
                  {isWrong && <AlertCircle className="text-red-500" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleNextQuestion} 
              disabled={!selectedOption && timeLeft > 0}
              icon={ArrowRight}
              variant={!selectedOption ? 'outline' : 'primary'}
            >
              {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
