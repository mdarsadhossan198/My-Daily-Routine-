import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar, ListTodo, Clock, BookOpen, Library, MessageSquare,
  Heart, TrendingUp, CheckCircle, Target, Award, Sparkles,
  ChevronRight, Zap, BarChart, Users, AlertCircle, CalendarClock,
  Flame, Star, Eye, Sun, Moon, Share2, Download, Settings,
} from "lucide-react";
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'advancedTimeBlocks';
const USER_NAME_KEY = 'userName';
const STORAGE_CHANGE_EVENT = 'timeBlocksStorageChanged';

// ---------- Translations ----------
const translations = {
  bn: {
    welcomeMessage: "আপনার দিন পরিকল্পনা করুন, দক্ষতা অর্জন করুন এবং লক্ষ্যে পৌঁছান।",
    totalTasks: "মোট টাস্ক",
    completedTasks: "সম্পন্ন",
    productivity: "উৎপাদনশীলতা",
    focusTime: "ফোকাস সময়",
    quickAccess: "দ্রুত প্রবেশ",
    clickToNavigate: "ক্লিক করলে যাবে",
    todayDesc: "আজকের কাজ ও অগ্রগতি",
    blocksDesc: "সময় ব্যবস্থাপনা ও রুটিন",
    learningDesc: "কোর্স ও দক্ষতা উন্নয়ন",
    communicationDesc: "যোগাযোগ দক্ষতা রোডম্যাপ",
    lifeTimerDesc: "জীবনের সময় গণনা",
    roadmapDesc: "ক্যারিয়ার পথ পরিকল্পনা",
    whyChoose: "কেন ডে মেট প্রো?",
    feature1Title: "স্মার্ট প্ল্যানিং",
    feature1Desc: "বুদ্ধিমানের সাথে দিন সাজান, সময় অপচয় রোধ করুন।",
    feature2Title: "অগ্রগতি ট্র্যাকিং",
    feature2Desc: "আপনার অগ্রগতি দেখুন, লক্ষ্যে পৌঁছান।",
    feature3Title: "দ্বিভাষিক সাপোর্ট",
    feature3Desc: "ইংরেজি ও বাংলায় পুরো অভিজ্ঞতা।",
    dailyMotivation: "দৈনিক অনুপ্রেরণা",
    quote: "একটি সফল ক্যারিয়ার গড়তে প্রতিদিন ১% উন্নতিই যথেষ্ট।",
    quoteAuthor: "ডে মেট প্রো",
    today: "আজ",
    timeBlocks: "টাইম ব্লক",
    learningHub: "লার্নিং হাব",
    communication: "কমিউনিকেশন",
    lifeTimer: "লাইফ টাইমার",
    roadmap: "রোডম্যাপ",
  },
  en: {
    welcomeMessage: "Plan your day, master skills, and achieve your goals.",
    totalTasks: "Total Tasks",
    completedTasks: "Completed",
    productivity: "Productivity",
    focusTime: "Focus Time",
    quickAccess: "Quick Access",
    clickToNavigate: "Click to navigate",
    todayDesc: "Today's tasks and progress",
    blocksDesc: "Time management & routine",
    learningDesc: "Courses & skill development",
    communicationDesc: "Communication skills roadmap",
    lifeTimerDesc: "Life time calculation",
    roadmapDesc: "Career path planning",
    whyChoose: "Why DayMate Pro?",
    feature1Title: "Smart Planning",
    feature1Desc: "Organize your day intelligently, reduce time waste.",
    feature2Title: "Progress Tracking",
    feature2Desc: "Monitor your progress, reach your goals.",
    feature3Title: "Bilingual Support",
    feature3Desc: "Full experience in English and Bengali.",
    dailyMotivation: "Daily Motivation",
    quote: "Building a successful career requires just 1% improvement every day.",
    quoteAuthor: "DayMate Pro",
    today: "Today",
    timeBlocks: "Time Blocks",
    learningHub: "Learning Hub",
    communication: "Communication",
    lifeTimer: "Life Timer",
    roadmap: "Roadmap",
  },
};

// ---------- Helper: calculate if a block occurs on a specific date ----------
// Also respects a `startDate` field – the block is only considered if the date
// is on or after its start date. If no startDate is present, it's assumed valid.
const doesBlockOccurOnDate = (block, dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;

  // If the block has a start date and the target date is before it, it cannot occur.
  if (block.startDate && dateStr < block.startDate) return false;

  const dayAbbr = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();

  // Exact date match (for non‑repeating or one‑off tasks)
  if (block.date === dateStr) return true;

  // Repeat logic
  if (block.repeatType === 'daily') return true;
  if (block.repeatType === 'weekly' && block.repeats?.includes(dayAbbr)) return true;
  if (block.repeatType === 'custom' && block.repeats?.includes(dayAbbr)) return true;
  if (block.repeatType === 'monthly' && block.date) {
    const blockDay = new Date(block.date).getDate();
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const targetDay = Math.min(blockDay, lastDayOfMonth);
    return date.getDate() === targetDay;
  }
  if (block.scheduledDay?.toLowerCase() === dayAbbr) return true;
  return false;
};

const isTaskCompletedOnDate = (task, date) => {
  return task.completedDates?.[date] || false;
};

const formatDateMonthDay = (dateStr, locale = 'en') => {
  if (!dateStr || !dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr || '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' });
};

const Home = ({
  language = 'en',
  stats = {},
  userName: propUserName,
  onNavigate = () => {},
  goals = [],
  tasks: propTasks,
  theme = 'light',
  setTheme,
}) => {
  const t = translations[language] || translations.en;
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // User name from localStorage, synced with prop
  const [userName, setUserName] = useState(() => {
    const saved = localStorage.getItem(USER_NAME_KEY);
    return saved || propUserName || "User";
  });

  // Sync with propUserName if it changes
  useEffect(() => {
    if (propUserName && propUserName !== userName) {
      setUserName(propUserName);
    }
  }, [propUserName, userName]);

  // local tasks state
  const [localTasks, setLocalTasks] = useState([]);

  // Load tasks from localStorage and migrate them
  const loadTasks = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        let parsed = JSON.parse(saved);

        // Migrate each block:
        // 1. Convert old `completed` + `completedDate` to `completedDates` object.
        // 2. Ensure every task has a `startDate` (used to filter repeats).
        const migrated = parsed.map(block => {
          // Step 1: completedDates migration
          if (block.completed && block.completedDate && !block.completedDates) {
            block.completedDates = { [block.completedDate]: true };
          }
          if (!block.completedDates) block.completedDates = {};

          // Step 2: startDate migration
          if (!block.startDate) {
            if (block.date) {
              block.startDate = block.date;
            } else if (block.repeatType && block.repeatType !== 'none') {
              // For repeating tasks without a base date, infer from completedDates
              const dates = Object.keys(block.completedDates).filter(d => block.completedDates[d]);
              if (dates.length > 0) {
                dates.sort(); // oldest first
                block.startDate = dates[0];
              } else {
                // No history, assume it starts today
                block.startDate = getTodayDate();
              }
            } else {
              // Non‑repeating task without a date? fallback to today.
              block.startDate = getTodayDate();
            }
          }
          return block;
        });
        setLocalTasks(migrated);
      } else {
        setLocalTasks([]);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, []);

  // initial load
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // listen to storage events (other tabs)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) loadTasks();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadTasks]);

  // listen to custom event (same tab)
  useEffect(() => {
    const handleCustom = () => loadTasks();
    window.addEventListener(STORAGE_CHANGE_EVENT, handleCustom);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT, handleCustom);
  }, [loadTasks]);

  // save userName when it changes
  useEffect(() => {
    if (userName && userName !== "User") {
      localStorage.setItem(USER_NAME_KEY, userName);
    }
  }, [userName]);

  // theme effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const tasks = propTasks || localTasks;

  // ---------- FIX: Count only tasks that have a date (non‑master) for total tasks ----------
  const dailyTasks = useMemo(() => tasks.filter(t => t.date), [tasks]);

  const totalTasks = dailyTasks.length;

  // yesterday's date string
  const yesterdayStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }, []);

  // yesterday incomplete tasks (respects startDate via doesBlockOccurOnDate)
  const yesterdayIncomplete = useMemo(() => {
    return tasks.filter(task => {
      if (!doesBlockOccurOnDate(task, yesterdayStr)) return false;
      return !isTaskCompletedOnDate(task, yesterdayStr);
    });
  }, [tasks, yesterdayStr]);

  // weekly incomplete (last 7 days)
  const weeklyIncomplete = useMemo(() => {
    const today = new Date();
    const last7Days = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      last7Days.push({
        dateStr,
        display: d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      });
    }

    const result = [];
    tasks.forEach(task => {
      last7Days.forEach(day => {
        if (doesBlockOccurOnDate(task, day.dateStr) && !isTaskCompletedOnDate(task, day.dateStr)) {
          result.push({
            ...task,
            scheduledDate: day.dateStr,
            displayDate: day.display,
          });
        }
      });
    });

    // Remove duplicates (same task on same day)
    const unique = result.filter((item, index, self) =>
      index === self.findIndex(t => t.id === item.id && t.scheduledDate === item.scheduledDate)
    );
    return unique.sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate)).slice(0, 5);
  }, [tasks, language]);

  // trend: last 7 days completed tasks
  const last7DaysCompleted = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = tasks.filter(t => isTaskCompletedOnDate(t, dateStr)).length;
      days.push({
        date: dateStr,
        count,
        label: d.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    return days;
  }, [tasks]);

  // streak
  const streak = useMemo(() => {
    let currentStreak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hasCompleted = tasks.some(t => isTaskCompletedOnDate(t, dateStr));
      if (hasCompleted) currentStreak++;
      else break;
    }
    return currentStreak;
  }, [tasks]);

  // best day
  const bestDay = useMemo(() => {
    const counts = {};
    tasks.forEach(task => {
      if (task.completedDates) {
        Object.keys(task.completedDates).forEach(date => {
          if (task.completedDates[date] && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            counts[date] = (counts[date] || 0) + 1;
          }
        });
      }
    });
    let maxDate = null, maxCount = 0;
    Object.entries(counts).forEach(([date, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxDate = date;
      }
    });
    return maxDate ? { date: maxDate, count: maxCount } : null;
  }, [tasks]);

  // yesterday completed
  const yesterdayCompleted = useMemo(() => {
    return tasks.filter(t => isTaskCompletedOnDate(t, yesterdayStr)).length;
  }, [tasks, yesterdayStr]);

  // yesterday performance message
  const yesterdayPerformanceMessage = useMemo(() => {
    const count = yesterdayCompleted;
    if (count === 0) return language === 'bn' ? 'আপনি গতকাল কোনো টাস্ক সম্পন্ন করেননি' : 'You completed no tasks yesterday';
    if (count >= 5) return language === 'bn' ? `অসাধারণ! আপনি গতকাল ${count}টি টাস্ক সম্পন্ন করেছেন 🚀` : `Excellent! You completed ${count} tasks yesterday 🚀`;
    if (count >= 3) return language === 'bn' ? `ভালো! আপনি গতকাল ${count}টি টাস্ক সম্পন্ন করেছেন 👍` : `Good job! You completed ${count} tasks yesterday 👍`;
    return language === 'bn' ? `আপনি গতকাল ${count}টি টাস্ক সম্পন্ন করেছেন। আরও মনোযোগ দিন!` : `You completed ${count} tasks yesterday. Keep improving!`;
  }, [yesterdayCompleted, language]);

  // upcoming goal
  const upcomingGoal = useMemo(() => {
    if (!goals.length) return null;
    const now = new Date();
    return goals
      .map(g => {
        if (!g.deadline) return null;
        const deadline = new Date(g.deadline);
        if (isNaN(deadline.getTime())) return null;
        const diff = deadline - now;
        return { ...g, diff };
      })
      .filter(g => g && g.diff > 0)
      .sort((a, b) => a.diff - b.diff)[0] || null;
  }, [goals]);

  // quick links
  const quickLinks = [
    { id: "today", label: t.today, icon: <ListTodo size={20} />, desc: t.todayDesc, color: "from-blue-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400" },
    { id: "blocks", label: t.timeBlocks, icon: <Clock size={20} />, desc: t.blocksDesc, color: "from-purple-500 to-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20", iconBg: "bg-purple-100 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400" },
    { id: "learning", label: t.learningHub, icon: <Library size={20} />, desc: t.learningDesc, color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20", iconBg: "bg-indigo-100 dark:bg-indigo-900/30", iconColor: "text-indigo-600 dark:text-indigo-400" },
    { id: "communication", label: t.communication, icon: <MessageSquare size={20} />, desc: t.communicationDesc, color: "from-pink-500 to-pink-600", bg: "bg-pink-50 dark:bg-pink-900/20", iconBg: "bg-pink-100 dark:bg-pink-900/30", iconColor: "text-pink-600 dark:text-pink-400" },
    { id: "lifetimer", label: t.lifeTimer, icon: <Heart size={20} />, desc: t.lifeTimerDesc, color: "from-rose-500 to-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20", iconBg: "bg-rose-100 dark:bg-rose-900/30", iconColor: "text-rose-600 dark:text-rose-400" },
    { id: "roadmap", label: t.roadmap, icon: <BookOpen size={20} />, desc: t.roadmapDesc, color: "from-amber-500 to-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400" },
  ];

  // features
  const features = [
    { icon: <Zap size={24} />, title: t.feature1Title, desc: t.feature1Desc, color: "from-blue-500 to-cyan-500" },
    { icon: <BarChart size={24} />, title: t.feature2Title, desc: t.feature2Desc, color: "from-green-500 to-emerald-500" },
    { icon: <Users size={24} />, title: t.feature3Title, desc: t.feature3Desc, color: "from-purple-500 to-pink-500" },
  ];

  // greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === "bn") {
      if (hour < 12) return "শুভ সকাল";
      if (hour < 17) return "শুভ বিকাল";
      return "শুভ সন্ধ্যা";
    } else {
      if (hour < 12) return "Good Morning";
      if (hour < 17) return "Good Afternoon";
      return "Good Evening";
    }
  };

  const todayDate = new Date().toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const formattedYesterday = new Date(Date.now() - 86400000).toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // share stats (simulated)
  const handleShareStats = () => {
    const text = `My DayMate Pro Stats:\nStreak: ${streak} days\nBest Day: ${bestDay ? formatDateMonthDay(bestDay.date, language) + ' (' + bestDay.count + ' tasks)' : 'N/A'}\nYesterday: ${yesterdayCompleted} tasks\nProductivity: ${stats?.productivity || 0}%`;
    if (navigator.share) {
      navigator.share({ title: 'My DayMate Pro Stats', text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Stats copied to clipboard!');
    }
  };

  // export as image (simulated)
  const handleExportImage = () => {
    toast('Export as image feature coming soon! (simulated)', { icon: '📸' });
  };

  // toggle theme
  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn px-2 sm:px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-1 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex items-start gap-3 sm:gap-5">
              <div className="p-2 sm:p-3 md:p-4 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                  {getGreeting()}, {userName}! 👋
                </h1>
                <p className="text-indigo-100 text-xs sm:text-sm md:text-base max-w-2xl">
                  {t.welcomeMessage}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-white/20 w-full lg:w-auto justify-center lg:justify-start">
              <Calendar size={16} className="text-white" />
              <span className="font-medium text-white text-xs sm:text-sm md:text-base whitespace-nowrap">{todayDate}</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats + Mini Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="space-y-3 sm:space-y-4">
          <StatCard
            title={t.totalTasks}
            value={totalTasks}
            icon={<ListTodo size={18} />}
            gradient="from-blue-500 to-blue-600"
            lightBg="bg-blue-50 dark:bg-blue-900/20"
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            delay={0}
          />
          <StatCard
            title={t.completedTasks}
            value={tasks.filter(t => isTaskCompletedOnDate(t, getTodayDate())).length}
            icon={<CheckCircle size={18} />}
            gradient="from-green-500 to-green-600"
            lightBg="bg-green-50 dark:bg-green-900/20"
            iconBg="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
            delay={0.1}
          />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <StatCard
            title={t.productivity}
            value={`${stats?.productivity || 0}%`}
            icon={<TrendingUp size={18} />}
            gradient="from-purple-500 to-purple-600"
            lightBg="bg-purple-50 dark:bg-purple-900/20"
            iconBg="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
            delay={0.2}
          />
          <StatCard
            title={t.focusTime}
            value={`${stats?.focusTime || 0}h`}
            icon={<Target size={18} />}
            gradient="from-amber-500 to-amber-600"
            lightBg="bg-amber-50 dark:bg-amber-900/20"
            iconBg="bg-amber-100 dark:bg-amber-900/30"
            iconColor="text-amber-600 dark:text-amber-400"
            delay={0.3}
          />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-500" /> {language === 'bn' ? 'গত ৭ দিনের সম্পন্ন টাস্ক' : 'Last 7 Days Completed'}
          </h3>
          <div className="flex items-end justify-between h-20 sm:h-24 gap-1">
            {last7DaysCompleted.map((day, idx) => {
              const height = Math.min(70, Math.max(4, day.count * 7));
              return (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t-lg relative" style={{ height: `${height}px` }}>
                    <div
                      className="absolute bottom-0 w-full bg-indigo-500 dark:bg-indigo-600 rounded-t-lg transition-all"
                      style={{ height: `${height}px` }}
                    />
                  </div>
                  <span className="text-[0.6rem] sm:text-xs mt-1 sm:mt-2 text-gray-600 dark:text-gray-400">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Incomplete tasks grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Yesterday's card */}
        {yesterdayIncomplete.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-red-200 dark:border-red-800 overflow-hidden hover:shadow-2xl transition-all">
            <div className="p-3 sm:p-5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-b border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-red-500 rounded-lg sm:rounded-xl">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">{language === 'bn' ? '⏪ গতকালের বাকি কাজ' : '⏪ Yesterday\'s Pending'}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{formattedYesterday}</p>
                </div>
                <span className="ml-auto px-2 py-0.5 sm:px-3 sm:py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded-full">
                  {yesterdayIncomplete.length} {language === 'bn' ? 'টি' : 'tasks'}
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {yesterdayIncomplete.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group">
                  <div className="w-1 h-6 sm:h-8 bg-red-400 rounded-full group-hover:scale-y-110 transition-transform"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {task.start || '—'} – {task.end || '—'}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('today')}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1 font-medium whitespace-nowrap"
                  >
                    <CheckCircle size={10} /> {language === 'bn' ? 'সম্পন্ন কর' : 'Complete'}
                  </button>
                </div>
              ))}
              {yesterdayIncomplete.length > 3 && (
                <div className="p-2 sm:p-3 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                  + {yesterdayIncomplete.length - 3} {language === 'bn' ? 'টি কাজ' : 'more tasks'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Weekly card */}
        {weeklyIncomplete.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 overflow-hidden hover:shadow-2xl transition-all">
            <div className="p-3 sm:p-5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-b border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-amber-500 rounded-lg sm:rounded-xl">
                  <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">{language === 'bn' ? '📅 সাপ্তাহিক বাকি কাজ' : '📅 Weekly Pending'}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{language === 'bn' ? 'গত ৭ দিন' : 'Last 7 days'}</p>
                </div>
                <span className="ml-auto px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
                  {weeklyIncomplete.length} {language === 'bn' ? 'টি' : 'tasks'}
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {weeklyIncomplete.slice(0, 3).map(task => (
                <div key={`${task.id}-${task.scheduledDate}`} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group">
                  <div className="w-1 h-6 sm:h-8 bg-amber-400 rounded-full group-hover:scale-y-110 transition-transform"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex flex-wrap items-center gap-1 sm:gap-2">
                      <span>{task.start || '—'} – {task.end || '—'}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full hidden sm:inline-block"></span>
                      <span className="text-amber-600 dark:text-amber-400 font-medium text-[0.6rem] sm:text-xs">{task.displayDate}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('today')}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors flex items-center gap-1 font-medium whitespace-nowrap"
                  >
                    <CheckCircle size={10} /> {language === 'bn' ? 'সম্পন্ন কর' : 'Complete'}
                  </button>
                </div>
              ))}
              {weeklyIncomplete.length > 3 && (
                <div className="p-2 sm:p-3 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                  + {weeklyIncomplete.length - 3} {language === 'bn' ? 'টি কাজ' : 'more tasks'}
                </div>
              )}
            </div>
            <div className="p-2 sm:p-3 border-t border-amber-100 dark:border-amber-800/50 text-center bg-amber-50/50 dark:bg-amber-900/10">
              <button
                onClick={() => onNavigate('history')}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center justify-center gap-1 font-medium"
              >
                <Eye size={12} /> {language === 'bn' ? 'ইতিহাসে দেখুন' : 'View all in History'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Advanced feature row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-2 mb-1 sm:mb-3">
            <div className="p-1 sm:p-2 bg-white/20 rounded-lg">
              <Flame size={16} />
            </div>
            <h4 className="font-semibold text-xs sm:text-sm">{language === 'bn' ? 'বর্তমান ধারা' : 'Current Streak'}</h4>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold">{streak} <span className="text-[0.6rem] sm:text-xs font-normal opacity-80">{language === 'bn' ? 'দিন' : 'days'}</span></p>
          <p className="text-[0.6rem] sm:text-xs opacity-80 mt-1 sm:mt-2">{language === 'bn' ? 'চালিয়ে যান! 🔥' : 'Keep it up! 🔥'}</p>
        </motion.div>

        {/* Best day card */}
        {bestDay && (
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-2 mb-1 sm:mb-3">
              <div className="p-1 sm:p-2 bg-white/20 rounded-lg">
                <Star size={16} />
              </div>
              <h4 className="font-semibold text-xs sm:text-sm">{language === 'bn' ? 'সেরা দিন' : 'Best Day'}</h4>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold">
              {formatDateMonthDay(bestDay.date, language)}
            </p>
            <p className="text-[0.6rem] sm:text-xs opacity-80 mt-1 sm:mt-2">{bestDay.count} {language === 'bn' ? 'টি টাস্ক সম্পন্ন' : 'tasks completed'}</p>
          </motion.div>
        )}

        {/* Goal countdown */}
        {upcomingGoal && (
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-2 mb-1 sm:mb-3">
              <div className="p-1 sm:p-2 bg-white/20 rounded-lg">
                <Target size={16} />
              </div>
              <h4 className="font-semibold text-xs sm:text-sm">{language === 'bn' ? 'পরবর্তী লক্ষ্য' : 'Next Goal'}</h4>
            </div>
            <p className="text-sm sm:text-base font-semibold truncate">{upcomingGoal.title}</p>
            <p className="text-[0.6rem] sm:text-xs opacity-80 mt-1 sm:mt-2">
              {Math.ceil(upcomingGoal.diff / (1000 * 60 * 60 * 24))} {language === 'bn' ? 'দিন বাকি' : 'days left'}
            </p>
          </motion.div>
        )}

        {/* Yesterday performance card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-2 mb-1 sm:mb-3">
            <div className="p-1 sm:p-2 bg-white/20 rounded-lg">
              <Sun size={16} />
            </div>
            <h4 className="font-semibold text-xs sm:text-sm">{language === 'bn' ? 'গতকালের পারফরম্যান্স' : 'Yesterday\'s Performance'}</h4>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold">{yesterdayCompleted} <span className="text-[0.6rem] sm:text-xs font-normal opacity-80">{language === 'bn' ? 'টি' : 'tasks'}</span></p>
          <p className="text-[0.6rem] sm:text-xs opacity-80 mt-1 sm:mt-2 line-clamp-2">{yesterdayPerformanceMessage}</p>
        </motion.div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          title={theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <button
          onClick={handleShareStats}
          className="p-2 sm:p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
          title="Share Stats"
        >
          <Share2 size={16} />
        </button>
        <button
          onClick={handleExportImage}
          className="p-2 sm:p-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
          title="Export as Image"
        >
          <Download size={16} />
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className="p-2 sm:p-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          title="Settings"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Quick Access */}
      <section>
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-1 h-4 sm:w-1.5 sm:h-6 bg-indigo-600 rounded-full" />
            {t.quickAccess}
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {t.clickToNavigate} <ChevronRight size={12} />
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickLinks.map((link, index) => (
            <motion.button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-start gap-2 sm:gap-4 p-3 sm:p-5 rounded-lg sm:rounded-xl ${link.bg} border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group text-left w-full`}
            >
              <div className={`p-2 sm:p-3 rounded-lg ${link.iconBg} group-hover:scale-110 transition-transform`}>
                <div className={link.iconColor}>{link.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-0.5 truncate">{link.label}</h3>
                <p className="text-[0.6rem] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{link.desc}</p>
              </div>
              <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4 flex items-center gap-2">
          <span className="w-1 h-4 sm:w-1.5 sm:h-6 bg-indigo-600 rounded-full" />
          {t.whyChoose}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <div className={`inline-flex p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20 text-white mb-2 sm:mb-4`}>
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Motivation */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative overflow-hidden rounded-lg sm:rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-rose-900/20 p-1 shadow-lg"
      >
        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-amber-200 dark:border-amber-900/50">
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 dark:from-amber-500/5 dark:to-orange-500/5 rounded-full -mr-6 -mt-6 sm:-mr-10 sm:-mt-10" />
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-amber-200/20 to-orange-200/20 dark:from-amber-500/5 dark:to-orange-500/5 rounded-full -ml-6 -mb-6 sm:-ml-8 sm:-mb-8" />
          <div className="relative flex items-start gap-2 sm:gap-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg sm:rounded-xl shadow-lg">
              <Award className="text-white" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.6rem] sm:text-xs font-medium text-amber-600 dark:text-amber-400 mb-0.5 sm:mb-1">{t.dailyMotivation}</p>
              <p className="text-sm sm:text-base italic text-gray-800 dark:text-gray-200">“{t.quote}”</p>
              <p className="mt-1 sm:mt-2 text-[0.6rem] sm:text-xs text-gray-600 dark:text-gray-400">— {t.quoteAuthor}</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

// StatCard component (responsive)
const StatCard = ({ title, value, icon, gradient, lightBg, iconBg, iconColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -3, scale: 1.02 }}
    className={`relative overflow-hidden rounded-xl sm:rounded-2xl ${lightBg} border border-gray-200 dark:border-gray-700 p-3 sm:p-5 shadow-lg hover:shadow-xl transition-all group`}
  >
    <div className={`absolute top-0 right-0 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-4 -mt-4 sm:-mr-6 sm:-mt-6 group-hover:scale-150 transition-transform duration-700`} />
    <div className="flex items-center gap-2 sm:gap-4">
      <div className={`p-1.5 sm:p-3 rounded-lg sm:rounded-xl ${iconBg} group-hover:scale-110 transition-transform`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-[0.6rem] sm:text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium truncate">{title}</p>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default Home;