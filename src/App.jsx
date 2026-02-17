import React, { useState, useEffect, useMemo, lazy, Suspense, useCallback } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
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
  ArrowUp,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  RotateCcw,
} from 'lucide-react';

// Lazy load components for better performance
const TimeBlockManager = lazy(() => import('./components/TimeBlockManager'));
const ActivityLog = lazy(() => import('./components/ActivityLog'));
const WeeklyReview = lazy(() => import('./components/WeeklyReview'));
const LifeTimer = lazy(() => import('./components/LifeTimer'));
const History = lazy(() => import('./components/History'));
// ⚠️ গুরুত্বপূর্ণ: RoadmapContainer ইম্পোর্ট করুন (Roadmap নয়)
const RoadmapContainer = lazy(() => import('./components/Roadmap'));
const SettingsPanel = lazy(() => import('./components/SettingsPanel'));
const LearningRoadmap = lazy(() => import('./components/LearningRoadmap'));
const CommunicationRoadmap = lazy(() => import('./components/CommunicationRoadmap'));
const Home = lazy(() => import('./components/Home'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Error Boundary কম্পোনেন্ট (ঐচ্ছিক কিন্তু সুপারিশকৃত)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please refresh the page or try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate();

  // ---------- State ----------
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(!navigator.onLine);
  const [backupReminderDismissed, setBackupReminderDismissed] = useState(() => {
    return localStorage.getItem('backupReminderDismissed') === 'true';
  });

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    productivity: 0,
    focusTime: 0,
  });

  const [birthDate, setBirthDate] = useState(() => {
    return localStorage.getItem('birthDate') || '2004-10-01';
  });

  const [appLanguage, setAppLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'bn';
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('primaryColor') || '#3b82f6';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'medium';
  });

  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);

  // ---------- Data loading functions ----------
  const loadStats = useCallback(() => {
    try {
      const saved = localStorage.getItem('advancedTimeBlocks');
      if (saved) {
        const blocks = JSON.parse(saved);
        const total = blocks.length;
        const completed = blocks.filter((b) => b.completedDates && Object.keys(b.completedDates).some(date => date === new Date().toISOString().split('T')[0])).length;
        const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
        setStats({
          totalTasks: total,
          completedTasks: completed,
          productivity,
          focusTime: Math.floor(Math.random() * 8) + 2, // placeholder
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  const loadGoals = useCallback(() => {
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
  }, []);

  const loadTasks = useCallback(() => {
    const saved = localStorage.getItem('advancedTimeBlocks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        setTasks([]);
      }
    }
  }, []);

  // ---------- Initial load and storage event listener ----------
  useEffect(() => {
    loadStats();
    loadGoals();
    loadTasks();

    const handleStorageChange = (e) => {
      if (e.key === 'advancedTimeBlocks') {
        loadTasks();
        loadStats();
      }
      if (e.key === 'goalsList') {
        loadGoals();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadStats, loadGoals, loadTasks]);

  // ---------- Persist settings ----------
  useEffect(() => {
    localStorage.setItem('appLanguage', appLanguage);
  }, [appLanguage]);

  useEffect(() => {
    localStorage.setItem('birthDate', birthDate);
  }, [birthDate]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'small') root.style.fontSize = '14px';
    else if (fontSize === 'medium') root.style.fontSize = '16px';
    else if (fontSize === 'large') root.style.fontSize = '18px';
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Online/offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
      toast.success(appLanguage === 'bn' ? 'আপনি অনলাইনে ফিরে এসেছেন!' : 'You are back online!');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
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

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        navigate('/');
      } else if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        navigate('/today');
      } else if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        navigate('/blocks');
      } else if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        navigate('/weekly');
      } else if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        navigate('/roadmap');
      } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        navigate('/settings');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Backup reminder (every 7 days)
  useEffect(() => {
    if (backupReminderDismissed) return;
    const lastBackup = localStorage.getItem('lastBackupDate');
    const today = new Date().toISOString().split('T')[0];
    if (!lastBackup) {
      localStorage.setItem('lastBackupDate', today);
    } else {
      const daysSince = Math.floor((new Date() - new Date(lastBackup)) / (1000 * 60 * 60 * 24));
      if (daysSince >= 7) {
        toast(
          (t) => (
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-yellow-500" size={20} />
              <span className="flex-1">
                {appLanguage === 'bn'
                  ? '৭ দিন ধরে ব্যাকআপ নেওয়া হয়নি। এখনই নিন?'
                  : 'No backup for 7 days. Take one now?'}
              </span>
              <button
                onClick={() => {
                  exportData();
                  localStorage.setItem('lastBackupDate', today);
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
              >
                {appLanguage === 'bn' ? 'ব্যাকআপ' : 'Backup'}
              </button>
              <button
                onClick={() => {
                  setBackupReminderDismissed(true);
                  localStorage.setItem('backupReminderDismissed', 'true');
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
              >
                {appLanguage === 'bn' ? 'বাদ দিন' : 'Dismiss'}
              </button>
            </div>
          ),
          { duration: 10000 }
        );
      }
    }
  }, [backupReminderDismissed, appLanguage]);

  // Clock
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

  // ---------- Helper Functions ----------
  const exportData = () => {
    const data = {
      version: '3.0',
      exportDate: new Date().toISOString(),
      timeBlocks: tasks,
      goals,
      settings: {
        birthDate,
        theme,
        primaryColor,
        fontSize,
        appLanguage,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arsad-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    localStorage.setItem('lastBackupDate', new Date().toISOString().split('T')[0]);
    toast.success(appLanguage === 'bn' ? 'ব্যাকআপ সফল!' : 'Backup successful!');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.timeBlocks) {
          if (window.confirm(appLanguage === 'bn' ? `${data.timeBlocks.length}টি টাস্ক ইম্পোর্ট করবেন?` : `Import ${data.timeBlocks.length} tasks?`)) {
            localStorage.setItem('advancedTimeBlocks', JSON.stringify(data.timeBlocks));
            if (data.goals) localStorage.setItem('goalsList', JSON.stringify(data.goals));
            if (data.settings) {
              if (data.settings.birthDate) setBirthDate(data.settings.birthDate);
              if (data.settings.theme) setTheme(data.settings.theme);
              if (data.settings.primaryColor) setPrimaryColor(data.settings.primaryColor);
              if (data.settings.fontSize) setFontSize(data.settings.fontSize);
              if (data.settings.appLanguage) setAppLanguage(data.settings.appLanguage);
            }
            setTasks(data.timeBlocks);
            setGoals(data.goals || []);
            toast.success(appLanguage === 'bn' ? 'ইম্পোর্ট সফল!' : 'Import successful!');
          }
        }
      } catch (error) {
        toast.error(appLanguage === 'bn' ? 'ফাইল এরর' : 'File error');
      }
    };
    reader.readAsText(file);
  };

  const resetAllData = () => {
    if (window.confirm(appLanguage === 'bn' ? 'সব ডাটা মুছে ফেলবেন? এটি অপরিবর্তনীয়!' : 'Delete all data? This cannot be undone!')) {
      localStorage.removeItem('advancedTimeBlocks');
      localStorage.removeItem('goalsList');
      setTasks([]);
      setGoals([]);
      toast.success(appLanguage === 'bn' ? 'সব ডাটা মুছে ফেলা হয়েছে' : 'All data cleared');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tabs
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

  const todayDate = new Date().toLocaleDateString(appLanguage === 'bn' ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
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

      {/* Offline Banner */}
      {showOfflineBanner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white p-2 text-center text-sm flex items-center justify-center gap-2">
          <CloudOff size={16} />
          <span>
            {appLanguage === 'bn'
              ? 'আপনি অফলাইনে আছেন। কিছু ফিচার সীমিত হতে পারে।'
              : 'You are offline. Some features may be limited.'}
          </span>
          <button onClick={() => setShowOfflineBanner(false)} className="p-1 hover:bg-yellow-600 rounded">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                aria-label="Toggle menu"
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
                <div className="ml-4 hidden md:flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
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

            {/* Right buttons */}
            <div className="flex items-center gap-3">
              {/* Language */}
              <button
                onClick={() => setAppLanguage(appLanguage === 'bn' ? 'en' : 'bn')}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={appLanguage === 'bn' ? 'Switch to English' : 'বাংলায় যান'}
              >
                <Globe size={20} />
                <span className="ml-1 text-xs font-medium">{appLanguage === 'bn' ? 'EN' : 'BN'}</span>
              </button>

              {/* Theme */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={theme === 'light' ? 'Dark mode' : 'Light mode'}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Notification Bell */}
              <div className="relative hidden sm:block">
                <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Bell size={20} />
                </button>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </div>

              {/* User */}
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

      {/* Desktop Navigation */}
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

      {/* Mobile Menu */}
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
          {/* Quick actions in mobile menu */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-around">
            <button
              onClick={exportData}
              className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
              title={appLanguage === 'bn' ? 'ব্যাকআপ' : 'Backup'}
            >
              <Download size={18} />
              <span>{appLanguage === 'bn' ? 'ব্যাকআপ' : 'Backup'}</span>
            </button>
            <label className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
              <Upload size={18} />
              <span>{appLanguage === 'bn' ? 'ইম্পোর্ট' : 'Import'}</span>
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            <button
              onClick={resetAllData}
              className="flex flex-col items-center text-xs text-red-600 dark:text-red-400"
              title={appLanguage === 'bn' ? 'সব মুছুন' : 'Clear all'}
            >
              <Trash2 size={18} />
              <span>{appLanguage === 'bn' ? 'মুছুন' : 'Clear'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content with Suspense */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<PageLoader />}>
            <div className="animate-fadeIn">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      stats={stats}
                      goals={goals}
                      tasks={tasks}
                      language={appLanguage}
                      onNavigate={(path) => navigate(`/${path}`)}
                    />
                  }
                />
                <Route path="/today" element={<ActivityLog />} />
                <Route path="/blocks" element={<TimeBlockManager />} />
                <Route path="/weekly" element={<WeeklyReview />} />
                <Route path="/history" element={<History language={appLanguage} />} />
                {/* ✅ সঠিকভাবে RoadmapContainer ব্যবহার করা হয়েছে */}
                <Route path="/roadmap" element={<RoadmapContainer />} />
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
                      primaryColor={primaryColor}
                      setPrimaryColor={setPrimaryColor}
                      fontSize={fontSize}
                      setFontSize={setFontSize}
                      onExport={exportData}
                      onImport={importData}
                      onReset={resetAllData}
                    />
                  }
                />
              </Routes>
            </div>
          </Suspense>

          {/* Footer with date and quick actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <p>
                {appLanguage === 'bn' ? 'আজকের তারিখ: ' : 'Today: '} {todayDate}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={exportData}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                  title={appLanguage === 'bn' ? 'ডাটা ব্যাকআপ' : 'Backup data'}
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">{appLanguage === 'bn' ? 'ব্যাকআপ' : 'Backup'}</span>
                </button>
                <label className="flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition cursor-pointer">
                  <Upload size={14} />
                  <span className="hidden sm:inline">{appLanguage === 'bn' ? 'ইম্পোর্ট' : 'Import'}</span>
                  <input type="file" accept=".json" onChange={importData} className="hidden" />
                </label>
                <button
                  onClick={resetAllData}
                  className="flex items-center gap-1 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                  title={appLanguage === 'bn' ? 'সব ডাটা মুছুন' : 'Clear all data'}
                >
                  <Trash2 size={14} />
                  <span className="hidden sm:inline">{appLanguage === 'bn' ? 'মুছুন' : 'Clear'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50 animate-bounce"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

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