import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Card from '../common/Card';
import { Map, History, Landmark, Globe, BookOpen, ScrollText, Timer, Trophy } from 'lucide-react';

// Cartoon Assets
import geographyImg from '../../assets/cartoons/geography.png';
import historyImg from '../../assets/cartoons/history.png';
import polityImg from '../../assets/cartoons/polity.png';
import mascotImg from '../../assets/cartoons/mascot.png';

const categoryConfig = {
  'Geography': {
    image: geographyImg,
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    description: 'Explore the landscapes and rivers of Maharashtra.',
    points: '100 XP'
  },
  'History': {
    image: historyImg,
    icon: History,
    color: 'from-amber-500 to-orange-600',
    description: 'Relive the glorious past and cultural heritage.',
    points: '120 XP'
  },
  'Polity': {
    image: polityImg,
    icon: Landmark,
    color: 'from-indigo-600 to-purple-600',
    description: 'Understand the Constitution and Governance.',
    points: '150 XP'
  },
  'default': {
    image: mascotImg,
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-600',
    description: 'Challenge yourself with general knowledge.',
    points: '110 XP'
  }
};

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/quiz/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (catName) => {
    navigate(`/quiz?category=${catName}`);
  };

  if (loading) return <div className="py-12 text-center font-bold text-blue-600 animate-bounce">Loading Missions...</div>;

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Trophy className="text-yellow-500" size={32} />
            Available Missions
          </h2>
          <p className="text-gray-500 font-medium">Choose a subject to start your quest!</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-blue-700">Dynamic Subjects Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((catName) => {
          const config = categoryConfig[catName] || categoryConfig['default'];
          const Icon = config.icon;
          
          return (
            <div 
              key={catName}
              onClick={() => handleCategoryClick(catName)}
              className="group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500 transform hover:-translate-y-3 cursor-pointer shadow-xl hover:shadow-2xl border-b-8 border-gray-100 hover:border-blue-200"
            >
              {/* Image Header */}
              <div className={`h-48 bg-gradient-to-br ${config.color} relative flex items-center justify-center p-6 overflow-hidden`}>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <img 
                  src={config.image} 
                  alt={catName} 
                  className="w-40 h-40 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 z-10" 
                />
              </div>

              <div className="p-6 relative">
                {/* Icon Badge */}
                <div className="absolute -top-10 right-6 p-4 bg-white rounded-2xl shadow-lg text-blue-600 group-hover:rotate-12 transition-transform duration-500">
                  <Icon size={24} />
                </div>

                <div className="mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 block">Level 1 Mission</span>
                  <h3 className="text-2xl font-black text-gray-900">{catName}</h3>
                </div>

                <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-2">
                  {config.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                   <div className="flex items-center gap-1 text-sm font-black text-emerald-600">
                     <span className="bg-emerald-50 px-3 py-1 rounded-full">{config.points}</span>
                   </div>
                   <button className="bg-gray-900 text-white font-bold px-6 py-2 rounded-xl text-sm group-hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200 group-hover:shadow-blue-200">
                     Play Now
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;
