import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Trophy, Home, RotateCcw, PartyPopper, TrendingUp } from 'lucide-react';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, results } = location.state || { score: 0, total: 0, results: null };

  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage === 100) return "Outstanding! You're a true scholar!";
    if (percentage >= 80) return "Excellent work! You're almost there!";
    if (percentage >= 50) return "Good job! Keep practicing and you'll master it!";
    return "Don't give up! Every failure is a stepping stone to success.";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <Card className="p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
          
          <div className="mb-8 flex justify-center">
            <div className="p-6 bg-blue-100 text-blue-600 rounded-full animate-bounce">
              <Trophy size={48} />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
          <p className="text-gray-500 mb-8">{getMessage()}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Score</p>
              <p className="text-3xl font-black text-blue-600">{score}/{total}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Accuracy</p>
              <p className="text-3xl font-black text-emerald-600">{percentage}%</p>
            </div>
          </div>

          {results && (
            <div className="mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center gap-3">
              <TrendingUp className="text-blue-600" />
              <div className="text-left">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Rewards Earned</p>
                <p className="text-sm font-medium text-blue-800">+{results.pointsEarned} Points • Level {results.level}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button 
              className="w-full" 
              icon={RotateCcw} 
              onClick={() => navigate('/quiz')}
            >
              Try Again
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              icon={Home} 
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Result;
