import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import {
  Calendar,
  Clock,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Bell,
  Cloud,
  CloudOff,
  Menu,
  X,
  User,
  Target,
  TrendingUp,
  CheckCircle,
  ListTodo,
  PieChart,
  Heart,
  BarChart3,
  BookOpen,
  Library,
  MessageSquare,
  Globe,
  Home as HomeIcon,
} from 'lucide-react';

// Components
import TimeBlockManager from './components/TimeBlockManager';
import ActivityLog from './components/ActivityLog';
import WeeklyReview from './components/WeeklyReview';
import LifeTimer from './components/LifeTimer';
import History from './components/History';
import Roadmap from './components/Roadmap';
import SettingsPanel from './components/SettingsPanel';
import LearningRoadmap from './components/LearningRoadmap';
import CommunicationRoadmap from './components/CommunicationRoadmap';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate(); // ✅ for navigation

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    productivity: 0,
    focusTime: 0,
  });

  const [birthDate, setBirthDate] = useState(() => {
    const saved = localStorage.getItem('birthDate');
    return saved || '2004-10-01';
  });

  const [appLanguage, setAppLanguage] = useState(() => {
    const saved = localStorage.getItem('appLanguage');
    return saved || 'bn';
  });

  // থিম কাস্টমাইজেশন
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('primaryColor') || '#3b82f6';
  });
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'medium';
  });

  // লোকাল স্টোরেজে ভাষা সংরক্ষণ
  useEffect(() => {
    localStorage.setItem('appLanguage', appLanguage);
  }, [appLanguage]);

  // জন্ম তারিখ সংরক্ষণ
  useEffect(() => {
    localStorage.setItem('birthDate', birthDate);
  }, [birthDate]);

  // থিম সংরক্ষণ
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // প্রাথমিক রঙ প্রয়োগ
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  // ফন্ট সাইজ প্রয়োগ
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'small') root.style.fontSize = '14px';
    else if (fontSize === 'medium') root.style.fontSize = '16px';
    else if (fontSize === 'large') root.style.fontSize = '18px';
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // ✅ ডার্ক মোড প্রয়োগ
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // অনলাইন/অফলাইন টোস্ট
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success(appLanguage === 'bn' ? 'আপনি অনলাইনে ফিরে এসেছেন!' : 'You are back online!');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error(
        appLanguage === 'bn'
          ? 'আপনি অফলাইনে আছেন। পরিবর্তন লোকাল স্টোরেজে সংরক্ষিত হবে।'
          : 'You are offline. Changes will be saved locally.'
      );
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [appLanguage]);

  // পরিসংখ্যান লোড
  useEffect(() => {
    const loadStats = () => {
      try {
        const saved = localStorage.getItem('advancedTimeBlocks');
        if (saved) {
          const blocks = JSON.parse(saved);
          const total = blocks.length;
          const completed = blocks.filter((b) => b.completed).length;
          const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
          setStats({
            totalTasks: total,
            completedTasks: completed,
            productivity,
            focusTime: Math.floor(Math.random() * 8) + 2,
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // গোল ডাটা
  const [goals, setGoals] = useState([]);
  useEffect(() => {
    const loadGoals = () => {
      const stored = localStorage.getItem('goalsList');
      if (stored) {
        try {
          setGoals(JSON.parse(stored));
        } catch (e) {
          setGoals([]);
        }
      } else {
        setGoals([]);
      }
    };
    loadGoals();
    const interval = setInterval(loadGoals, 2000);
    return () => clearInterval(interval);
  }, []);

  // টাস্ক লিস্ট
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const loadTasks = () => {
      const saved = localStorage.getItem('advancedTimeBlocks');
      if (saved) {
        try {
          setTasks(JSON.parse(saved));
        } catch (e) {
          setTasks([]);
        }
      }
    };
    loadTasks();
    const interval = setInterval(loadTasks, 2000);
    return () => clearInterval(interval);
  }, []);

  // বর্তমান সময়
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12;
      setCurrentTime(`${displayHour}:${minutes} ${ampm}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // স্ট্রিক গণনা
  const streak = useMemo(() => {
    let current = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const hasToday = tasks.some(t => t.completed && t.completedDate === todayStr);
    const hasYesterday = tasks.some(t => t.completed && t.completedDate === yesterdayStr);
    if (hasToday) current++;
    if (hasYesterday) current++;
    return current;
  }, [tasks]);

  // ট্যাব কনফিগারেশন
  const tabs = [
    { id: 'home', path: '/', label: appLanguage === 'bn' ? 'হোম' : 'Home', icon: <HomeIcon size={20} /> },
    { id: 'today', path: '/today', label: appLanguage === 'bn' ? 'আজ' : 'Today', icon: <ListTodo size={20} /> },
    { id: 'blocks', path: '/blocks', label: appLanguage === 'bn' ? 'টাইম ব্লক' : 'Time Blocks', icon: <Clock size={20} /> },
    { id: 'weekly', path: '/weekly', label: appLanguage === 'bn' ? 'সাপ্তাহিক' : 'Weekly', icon: <PieChart size={20} /> },
    { id: 'history', path: '/history', label: appLanguage === 'bn' ? 'ইতিহাস' : 'History', icon: <BarChart3 size={20} /> },
    { id: 'roadmap', path: '/roadmap', label: appLanguage === 'bn' ? 'রোডম্যাপ' : 'Roadmap', icon: <BookOpen size={20} /> },
    { id: 'learning', path: '/learning', label: appLanguage === 'bn' ? 'লার্নিং' : 'Learning', icon: <Library size={20} /> },
    { id: 'communication', path: '/communication', label: appLanguage === 'bn' ? 'কমিউনিকেশন' : 'Comm', icon: <MessageSquare size={20} /> },
    { id: 'lifetimer', path: '/lifetimer', label: appLanguage === 'bn' ? 'লাইফ টাইমার' : 'Life Timer', icon: <Heart size={20} /> },
    { id: 'settings', path: '/settings', label: appLanguage === 'bn' ? 'সেটিংস' : 'Settings', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* কাস্টম থিম ভেরিয়েবল */}
      <style>{`
        :root {
          --primary: ${primaryColor};
        }
        .bg-primary { background-color: var(--primary) !important; }
        .text-primary { color: var(--primary) !important; }
        .border-primary { border-color: var(--primary) !important; }
      `}</style>

      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-gray-100',
          style: {
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
          },
        }}
      />

      {/* হেডার */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* লোগো ও টাইটেল */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center ml-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Calendar className="text-white" size={24} />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Arsad Day Planner
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> {currentTime}
                  </p>
                </div>
                <div className="ml-4 flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                  {isOnline ? (
                    <Cloud className="text-green-500 mr-1" size={14} />
                  ) : (
                    <CloudOff className="text-red-500 mr-1" size={14} />
                  )}
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {isOnline ? (appLanguage === 'bn' ? 'অনলাইন' : 'Online') : (appLanguage === 'bn' ? 'অফলাইন' : 'Offline')}
                  </span>
                </div>
              </div>
            </div>

            {/* ডান পাশের বাটন */}
            <div className="flex items-center gap-3">
              {/* ভাষা টগল */}
              <button
                onClick={() => setAppLanguage(appLanguage === 'bn' ? 'en' : 'bn')}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Globe size={20} />
                <span className="ml-1 text-xs font-medium">{appLanguage === 'bn' ? 'EN' : 'BN'}</span>
              </button>

              {/* থিম টগল */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* নোটিফিকেশন বেল */}
              <div className="relative">
                <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Bell size={20} />
                </button>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </div>

              {/* ইউজার প্রোফাইল */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  <User size={16} />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Guest</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Welcome</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ডেস্কটপ নেভিগেশন */}
      <nav className="hidden lg:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-16 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={tab.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-indigo-600' : 'text-gray-500'}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* মোবাইল মেনু */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-32 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-xl rounded-b-2xl p-4 animate-slideDown">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={tab.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-indigo-600' : 'text-gray-500'}>{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* মূল কন্টেন্ট */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="animate-fadeIn">
            <Routes>
              {/* ✅ Home এখন tasks ও goals প্রপ পায়, এবং onNavigate-এ navigate ব্যবহার করে */}
              <Route
                path="/"
                element={
                  <Home
                    stats={stats}
                    streak={streak}
                    goals={goals}
                    tasks={tasks}          // recentTasks এর পরিবর্তে tasks
                    language={appLanguage}
                    onNavigate={(path) => navigate(`/${path}`)} // নেভিগেট ফাংশন
                  />
                }
              />
              <Route path="/today" element={<ActivityLog />} />
              <Route path="/blocks" element={<TimeBlockManager />} />
              <Route path="/weekly" element={<WeeklyReview />} />
              <Route path="/history" element={<History language={appLanguage} />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/learning" element={<LearningRoadmap />} />
              <Route path="/communication" element={<CommunicationRoadmap />} />
              <Route path="/lifetimer" element={<LifeTimer birthDate={birthDate} />} />
              <Route
                path="/settings"
                element={
                  <SettingsPanel
                    birthDate={birthDate}
                    setBirthDate={setBirthDate}
                    theme={theme}
                    setTheme={setTheme}
                  />
                }
              />
            </Routes>
          </div>

          {/* ফুটার */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>start day this my 14/02/2026</p>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default App;