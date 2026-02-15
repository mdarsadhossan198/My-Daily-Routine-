import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ListTodo,
  Clock,
  BookOpen,
  Library,
  MessageSquare,
  Heart,
  TrendingUp,
  CheckCircle,
  Target,
  Award,
  Sparkles,
  ChevronRight,
  Zap,
  BarChart,
  Users,
  AlertCircle,
  CalendarClock,
  Flame,
  Star,
  Eye,
  Sun,
} from "lucide-react";

const Home = ({ language, stats, userName = "User", onNavigate, goals = [], tasks = [] }) => {
  const t = translations[language];

  // ---------- গতকালের অসম্পূর্ণ টাস্ক (date ফিল্ড সহ) ----------
  const yesterdayIncomplete = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const dayOfWeek = yesterday.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();

    return tasks.filter(task => {
      // 1. নির্দিষ্ট তারিখের টাস্ক (date ফিল্ড)
      if (task.date === yesterdayStr) {
        return !task.completed;
      }
      
      // 2. রিপিটিং টাস্ক (repeats বা scheduledDay)
      const isScheduledYesterday = 
        (task.repeats && task.repeats.includes(dayOfWeek)) || 
        (task.scheduledDay === dayOfWeek);
      
      if (!isScheduledYesterday) return false;

      return !task.completed || task.completedDate !== yesterdayStr;
    });
  }, [tasks]);

  // ---------- সাপ্তাহিক অসম্পূর্ণ টাস্ক (গত ৭ দিন, date ফিল্ড সহ) ----------
  const weeklyIncomplete = useMemo(() => {
    const today = new Date();
    const last7Days = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push({
        dateStr: d.toISOString().split('T')[0],
        dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(),
        display: d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      });
    }

    const result = [];
    tasks.forEach(task => {
      last7Days.forEach(day => {
        // 1. নির্দিষ্ট তারিখের টাস্ক চেক
        const isDateMatch = task.date === day.dateStr;
        
        // 2. রিপিটিং টাস্ক চেক
        const isRecurringMatch = 
          (task.repeats && task.repeats.includes(day.dayOfWeek)) || 
          (task.scheduledDay === day.dayOfWeek);
        
        const isScheduled = isDateMatch || isRecurringMatch;
        
        if (isScheduled && (!task.completed || task.completedDate !== day.dateStr)) {
          result.push({
            ...task,
            scheduledDate: day.dateStr,
            displayDate: day.display,
          });
        }
      });
    });

    // ইউনিক টাস্ক (একই টাস্ক একাধিক দিনে দেখাতে পারে, কিন্তু সেটাই কাঙ্ক্ষিত)
    const unique = result.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id && t.scheduledDate === item.scheduledDate)
    );
    return unique.sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate)).slice(0, 5);
  }, [tasks, language]);

  // ---------- ট্রেন্ড বার (গত ৭ দিনের সম্পন্ন টাস্ক) ----------
  const last7DaysCompleted = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = tasks.filter(t => t.completed && t.completedDate === dateStr).length;
      days.push({ date: dateStr, count, label: d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short' }) });
    }
    return days;
  }, [tasks, language]);

  // ---------- স্ট্রিক ----------
  const streak = useMemo(() => {
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hasCompleted = tasks.some(t => t.completed && t.completedDate === dateStr);
      if (hasCompleted) currentStreak++;
      else break;
    }
    return currentStreak;
  }, [tasks]);

  // ---------- সর্বোচ্চ সম্পন্ন দিন ----------
  const bestDay = useMemo(() => {
    const counts = {};
    tasks.forEach(t => {
      if (t.completed && t.completedDate) {
        counts[t.completedDate] = (counts[t.completedDate] || 0) + 1;
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

  // ---------- গতকালের সম্পন্ন টাস্ক ----------
  const yesterdayCompleted = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return tasks.filter(t => t.completed && t.completedDate === yesterdayStr).length;
  }, [tasks]);

  // ---------- গতকালের পারফরম্যান্স মেসেজ ----------
  const yesterdayPerformanceMessage = useMemo(() => {
    const count = yesterdayCompleted;
    if (count === 0) return language === 'bn' ? 'আপনি গতকাল কোনো টাস্ক সম্পন্ন করেননি' : 'You completed no tasks yesterday';
    if (count >= 5) return language === 'bn' ? `অসাধারণ! আপনি গতকাল ${count}টি টাস্ক সম্পন্ন করেছেন 🚀` : `Excellent! You completed ${count} tasks yesterday 🚀`;
    if (count >= 3) return language === 'bn' ? `ভালো! আপনি গতকাল ${count}টি টাস্ক সম্পন্ন করেছেন 👍` : `Good job! You completed ${count} tasks yesterday 👍`;
    if (count >= 1) return language === 'bn' ? `আপনি গতকাল ${count}টি টাস্ক সম্পন্ন করেছেন। আরও মনোযোগ দিন!` : `You completed ${count} tasks yesterday. Keep improving!`;
    return '';
  }, [yesterdayCompleted, language]);

  // ---------- গোল অগ্রগতি ----------
  const upcomingGoal = useMemo(() => {
    if (!goals.length) return null;
    const now = new Date();
    return goals
      .map(g => {
        const deadline = new Date(g.deadline);
        const diff = deadline - now;
        return { ...g, diff };
      })
      .filter(g => g.diff > 0)
      .sort((a, b) => a.diff - b.diff)[0] || null;
  }, [goals]);

  // Quick links
  const quickLinks = [
    { id: "today", label: t.today, icon: <ListTodo size={20} />, desc: t.todayDesc, color: "from-blue-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400" },
    { id: "blocks", label: t.timeBlocks, icon: <Clock size={20} />, desc: t.blocksDesc, color: "from-purple-500 to-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20", iconBg: "bg-purple-100 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400" },
    { id: "learning", label: t.learningHub, icon: <Library size={20} />, desc: t.learningDesc, color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20", iconBg: "bg-indigo-100 dark:bg-indigo-900/30", iconColor: "text-indigo-600 dark:text-indigo-400" },
    { id: "communication", label: t.communication, icon: <MessageSquare size={20} />, desc: t.communicationDesc, color: "from-pink-500 to-pink-600", bg: "bg-pink-50 dark:bg-pink-900/20", iconBg: "bg-pink-100 dark:bg-pink-900/30", iconColor: "text-pink-600 dark:text-pink-400" },
    { id: "lifetimer", label: t.lifeTimer, icon: <Heart size={20} />, desc: t.lifeTimerDesc, color: "from-rose-500 to-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20", iconBg: "bg-rose-100 dark:bg-rose-900/30", iconColor: "text-rose-600 dark:text-rose-400" },
    { id: "roadmap", label: t.roadmap, icon: <BookOpen size={20} />, desc: t.roadmapDesc, color: "from-amber-500 to-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400" },
  ];

  // Feature cards
  const features = [
    { icon: <Zap size={24} />, title: t.feature1Title, desc: t.feature1Desc, color: "from-blue-500 to-cyan-500" },
    { icon: <BarChart size={24} />, title: t.feature2Title, desc: t.feature2Desc, color: "from-green-500 to-emerald-500" },
    { icon: <Users size={24} />, title: t.feature3Title, desc: t.feature3Desc, color: "from-purple-500 to-pink-500" },
  ];

  // Welcome message
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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-1 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-3xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="p-3 md:p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg">
                <Sparkles className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {getGreeting()}, {userName}! 👋
                </h1>
                <p className="text-indigo-100 text-sm md:text-lg max-w-2xl">
                  {t.welcomeMessage}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 md:px-5 md:py-3 rounded-xl border border-white/20">
              <Calendar size={18} className="text-white" />
              <span className="font-medium text-white text-sm md:text-base">{todayDate}</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats + Mini Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <StatCard
            title={t.totalTasks}
            value={stats?.totalTasks || 0}
            icon={<ListTodo size={22} />}
            gradient="from-blue-500 to-blue-600"
            lightBg="bg-blue-50 dark:bg-blue-900/20"
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            delay={0}
          />
          <StatCard
            title={t.completedTasks}
            value={stats?.completedTasks || 0}
            icon={<CheckCircle size={22} />}
            gradient="from-green-500 to-green-600"
            lightBg="bg-green-50 dark:bg-green-900/20"
            iconBg="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
            delay={0.1}
          />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <StatCard
            title={t.productivity}
            value={`${stats?.productivity || 0}%`}
            icon={<TrendingUp size={22} />}
            gradient="from-purple-500 to-purple-600"
            lightBg="bg-purple-50 dark:bg-purple-900/20"
            iconBg="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
            delay={0.2}
          />
          <StatCard
            title={t.focusTime}
            value={`${stats?.focusTime || 0}h`}
            icon={<Target size={22} />}
            gradient="from-amber-500 to-amber-600"
            lightBg="bg-amber-50 dark:bg-amber-900/20"
            iconBg="bg-amber-100 dark:bg-amber-900/30"
            iconColor="text-amber-600 dark:text-amber-400"
            delay={0.3}
          />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-500" /> {language === 'bn' ? 'গত ৭ দিনের সম্পন্ন টাস্ক' : 'Last 7 Days Completed'}
          </h3>
          <div className="flex items-end justify-between h-24 gap-1">
            {last7DaysCompleted.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t-lg relative" style={{ height: `${Math.max(4, day.count * 8)}px` }}>
                  <div className="absolute bottom-0 w-full bg-indigo-500 dark:bg-indigo-600 rounded-t-lg" style={{ height: `${Math.max(4, day.count * 8)}px` }} />
                </div>
                <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">{day.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* গ্রিডে অসম্পূর্ণ টাস্ক – গতকাল + সাপ্তাহিক */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* গতকালের কার্ড */}
        {yesterdayIncomplete.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800 overflow-hidden hover:shadow-2xl transition-all">
            <div className="p-5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-b border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{language === 'bn' ? '⏪ গতকালের বাকি কাজ' : '⏪ Yesterday\'s Pending'}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formattedYesterday}</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium rounded-full">
                  {yesterdayIncomplete.length} {language === 'bn' ? 'টি' : 'tasks'}
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {yesterdayIncomplete.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group">
                  <div className="w-1 h-8 bg-red-400 rounded-full group-hover:scale-y-110 transition-transform"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {task.start} – {task.end}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('today')}
                    className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1 font-medium"
                  >
                    <CheckCircle size={12} /> {language === 'bn' ? 'সম্পন্ন কর' : 'Complete'}
                  </button>
                </div>
              ))}
              {yesterdayIncomplete.length > 3 && (
                <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                  + {yesterdayIncomplete.length - 3} {language === 'bn' ? 'টি কাজ' : 'more tasks'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* সাপ্তাহিক কার্ড */}
        {weeklyIncomplete.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 overflow-hidden hover:shadow-2xl transition-all">
            <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-b border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 rounded-xl">
                  <CalendarClock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{language === 'bn' ? '📅 সাপ্তাহিক বাকি কাজ' : '📅 Weekly Pending'}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{language === 'bn' ? 'গত ৭ দিন' : 'Last 7 days'}</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium rounded-full">
                  {weeklyIncomplete.length} {language === 'bn' ? 'টি' : 'tasks'}
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {weeklyIncomplete.slice(0, 3).map(task => (
                <div key={`${task.id}-${task.scheduledDate}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group">
                  <div className="w-1 h-8 bg-amber-400 rounded-full group-hover:scale-y-110 transition-transform"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                      <span>{task.start} – {task.end}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="text-amber-600 dark:text-amber-400 font-medium">{task.displayDate}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('today')}
                    className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors flex items-center gap-1 font-medium"
                  >
                    <CheckCircle size={12} /> {language === 'bn' ? 'সম্পন্ন কর' : 'Complete'}
                  </button>
                </div>
              ))}
              {weeklyIncomplete.length > 3 && (
                <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                  + {weeklyIncomplete.length - 3} {language === 'bn' ? 'টি কাজ' : 'more tasks'}
                </div>
              )}
            </div>
            <div className="p-3 border-t border-amber-100 dark:border-amber-800/50 text-center bg-amber-50/50 dark:bg-amber-900/10">
              <button
                onClick={() => onNavigate('history')}
                className="text-sm text-amber-600 dark:text-amber-400 hover:underline flex items-center justify-center gap-1 font-medium"
              >
                <Eye size={14} /> {language === 'bn' ? 'ইতিহাসে দেখুন' : 'View all in History'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* অ্যাডভান্সড ফিচার সারি (৪টি কার্ড) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* স্ট্রিক কার্ড */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Flame size={22} />
            </div>
            <h4 className="font-semibold">{language === 'bn' ? 'বর্তমান ধারা' : 'Current Streak'}</h4>
          </div>
          <p className="text-3xl font-bold">{streak} <span className="text-sm font-normal opacity-80">{language === 'bn' ? 'দিন' : 'days'}</span></p>
          <p className="text-xs opacity-80 mt-2">{language === 'bn' ? 'চালিয়ে যান! 🔥' : 'Keep it up! 🔥'}</p>
        </motion.div>

        {/* সেরা দিন কার্ড */}
        {bestDay && (
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Star size={22} />
              </div>
              <h4 className="font-semibold">{language === 'bn' ? 'সেরা দিন' : 'Best Day'}</h4>
            </div>
            <p className="text-2xl font-bold">{new Date(bestDay.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' })}</p>
            <p className="text-xs opacity-80 mt-2">{bestDay.count} {language === 'bn' ? 'টি টাস্ক সম্পন্ন' : 'tasks completed'}</p>
          </motion.div>
        )}

        {/* গোল কাউন্টডাউন */}
        {upcomingGoal && (
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Target size={22} />
              </div>
              <h4 className="font-semibold">{language === 'bn' ? 'পরবর্তী লক্ষ্য' : 'Next Goal'}</h4>
            </div>
            <p className="text-lg font-semibold truncate">{upcomingGoal.title}</p>
            <p className="text-xs opacity-80 mt-2">
              {Math.ceil(upcomingGoal.diff / (1000 * 60 * 60 * 24))} {language === 'bn' ? 'দিন বাকি' : 'days left'}
            </p>
          </motion.div>
        )}

        {/* গতকালের পারফরম্যান্স কার্ড */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sun size={22} />
            </div>
            <h4 className="font-semibold">{language === 'bn' ? 'গতকালের পারফরম্যান্স' : 'Yesterday\'s Performance'}</h4>
          </div>
          <p className="text-3xl font-bold">{yesterdayCompleted} <span className="text-sm font-normal opacity-80">{language === 'bn' ? 'টি' : 'tasks'}</span></p>
          <p className="text-xs opacity-80 mt-2">{yesterdayPerformanceMessage}</p>
        </motion.div>
      </div>

      {/* Quick Access */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
            {t.quickAccess}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {t.clickToNavigate} <ChevronRight size={14} />
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <motion.button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-start gap-4 p-5 rounded-xl ${link.bg} border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group text-left w-full`}
            >
              <div className={`p-3 rounded-lg ${link.iconBg} group-hover:scale-110 transition-transform`}>
                <div className={link.iconColor}>{link.icon}</div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{link.label}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{link.desc}</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
          {t.whyChoose}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20 text-white mb-4`}>
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Motivation */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-rose-900/20 p-1 shadow-lg"
      >
        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-amber-200 dark:border-amber-900/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 dark:from-amber-500/5 dark:to-orange-500/5 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-200/20 to-orange-200/20 dark:from-amber-500/5 dark:to-orange-500/5 rounded-full -ml-8 -mb-8" />
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
              <Award className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">{t.dailyMotivation}</p>
              <p className="text-lg italic text-gray-800 dark:text-gray-200">“{t.quote}”</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">— {t.quoteAuthor}</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

const StatCard = ({ title, value, icon, gradient, lightBg, iconBg, iconColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -3, scale: 1.02 }}
    className={`relative overflow-hidden rounded-2xl ${lightBg} border border-gray-200 dark:border-gray-700 p-5 shadow-lg hover:shadow-xl transition-all group`}
  >
    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-700`} />
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </motion.div>
);

const translations = {
  bn: {
    welcomeMessage: "আপনার দিন পরিকল্পনা করুন, দক্ষতা অর্জন করুন এবং লক্ষ্যে পৌঁছান।",
    statsOverview: "সংক্ষিপ্ত পরিসংখ্যান",
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
    statsOverview: "Stats Overview",
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

export default Home;