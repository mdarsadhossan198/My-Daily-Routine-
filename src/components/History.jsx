import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar, CheckCircle, Clock, Filter, BarChart3, TrendingUp, Award, Target,
  ChevronDown, ChevronUp, AlertCircle, Zap, XCircle, Download,
  Briefcase, Heart, BookOpen, Dumbbell, Home, Palette, Users, DollarSign,
  ThumbsUp, ThumbsDown, Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// দ্বিভাষিক অনুবাদ
const translations = {
  bn: {
    title: 'কাজের ইতিহাস',
    subtitle: 'আপনার উৎপাদনশীলতার যাত্রা ট্র্যাক করুন',
    totalTasks: 'মোট টাস্ক',
    completed: 'সম্পন্ন',
    completionRate: 'সম্পন্নের হার',
    currentStreak: 'বর্তমান ধারা',
    dateRange: 'তারিখ পরিসর',
    category: 'ক্যাটাগরি',
    priority: 'অগ্রাধিকার',
    allCategories: 'সব ক্যাটাগরি',
    allPriorities: 'সব অগ্রাধিকার',
    export: 'এক্সপোর্ট ইতিহাস',
    gridView: 'গ্রিড ভিউ',
    listView: 'লিস্ট ভিউ',
    tasks: 'টাস্ক',
    completedTasks: 'সম্পন্ন',
    rate: 'হার',
    performance: 'কর্মক্ষমতা',
    status: 'অবস্থা',
    complete: 'সম্পূর্ণ',
    partial: 'আংশিক',
    noTasks: 'কাজ নেই',
    good: 'ভালো',
    average: 'গড়',
    bad: 'খারাপ',
    bestDay: 'সেরা দিন! 🏆',
    bestDayMessage: 'আপনি {date} তারিখে {completed}টি কাজ সম্পন্ন করেছেন (মোট {total}টির মধ্যে {rate}%)।',
    mostProductivity: 'সর্বোচ্চ উৎপাদনশীল ক্যাটাগরি',
    worstDay: 'সবচেয়ে খারাপ দিন',
    weeklyAvg: 'সাপ্তাহিক গড়',
    noData: 'কোনো তথ্য নেই',
    days: 'দিন',
    all: 'সব',
    of: 'এর মধ্যে',
    for: 'জন্য',
  },
  en: {
    title: 'Task History',
    subtitle: 'Track your productivity journey',
    totalTasks: 'Total Tasks',
    completed: 'Completed',
    completionRate: 'Completion Rate',
    currentStreak: 'Current Streak',
    dateRange: 'Date Range',
    category: 'Category',
    priority: 'Priority',
    allCategories: 'All Categories',
    allPriorities: 'All Priorities',
    export: 'Export History',
    gridView: 'Grid View',
    listView: 'List View',
    tasks: 'tasks',
    completedTasks: 'completed',
    rate: 'rate',
    performance: 'Performance',
    status: 'Status',
    complete: 'Complete',
    partial: 'Partial',
    noTasks: 'No tasks',
    good: 'Good',
    average: 'Average',
    bad: 'Bad',
    bestDay: 'Best Day Ever! 🏆',
    bestDayMessage: 'On {date}, you completed {completed} out of {total} tasks ({rate}%).',
    mostProductivity: 'Most Productive Category',
    worstDay: 'Worst Day',
    weeklyAvg: 'Weekly Average',
    noData: 'No data',
    days: 'days',
    all: 'All',
    of: 'of',
    for: 'for',
  }
};

const History = ({ language = 'bn' }) => {
  const t = translations[language];

  // ---------- ক্যাটাগরি ও অগ্রাধিকার (useMemo দিয়ে) ----------
  const categories = useMemo(() => [
    { id: 'all', label: t.allCategories, icon: Filter },
    { id: 'work', label: 'Work', icon: Briefcase, color: 'bg-blue-500' },
    { id: 'health', label: 'Health', icon: Heart, color: 'bg-red-500' },
    { id: 'learning', label: 'Learning', icon: BookOpen, color: 'bg-green-500' },
    { id: 'personal', label: 'Personal', icon: Home, color: 'bg-purple-500' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'bg-orange-500' },
    { id: 'creative', label: 'Creative', icon: Palette, color: 'bg-cyan-500' },
    { id: 'social', label: 'Social', icon: Users, color: 'bg-pink-500' },
    { id: 'finance', label: 'Finance', icon: DollarSign, color: 'bg-emerald-500' }
  ], [t]);

  const priorities = useMemo(() => [
    { id: 'all', label: t.allPriorities, icon: Filter },
    { id: 'low', label: 'Low', icon: ChevronDown, color: 'bg-gray-500' },
    { id: 'medium', label: 'Medium', icon: ChevronUp, color: 'bg-yellow-500' },
    { id: 'high', label: 'High', icon: AlertCircle, color: 'bg-orange-500' },
    { id: 'critical', label: 'Critical', icon: Zap, color: 'bg-red-500' }
  ], [t]);

  // ---------- স্টেট ----------
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState('30');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  // ✅ লোকাল স্টোরেজ থেকে ভিউ মোড লোড করা
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem('historyViewMode');
    return saved === 'grid' ? 'grid' : 'list'; // ডিফল্ট 'list'
  });

  // ---------- ভিউ মোড পরিবর্তন হলে লোকাল স্টোরেজে সেভ ----------
  useEffect(() => {
    localStorage.setItem('historyViewMode', viewMode);
  }, [viewMode]);

  // ---------- ডাটা লোড ----------
  const loadData = () => {
    try {
      const saved = localStorage.getItem('advancedTimeBlocks');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeBlocks(parsed);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  // ---------- তারিখ রেঞ্জ অ্যারে (সবচেয়ে নতুন প্রথমে) ----------
  const getDateRangeArray = () => {
    const days = dateRange === 'all' ? 365 : parseInt(dateRange);
    const dates = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    // কোনো reverse() নেই – এখন সবচেয়ে নতুন (আজ) প্রথমে, তারপর পুরোনো
    return dates;
  };

  // ---------- নির্দিষ্ট তারিখের টাস্ক ----------
  const getTasksForDate = (dateStr) => {
    const dayOfWeek = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    return timeBlocks.filter(block => {
      const isRecurring = block.repeats && block.repeats.includes(dayOfWeek);
      const isOneOff = block.scheduledDay === dayOfWeek;
      return isRecurring || isOneOff;
    }).map(task => ({
      ...task,
      completedOnThisDate: task.completed && task.completedDate === dateStr
    }));
  };

  // ---------- কর্মক্ষমতা রেটিং ----------
  const getPerformanceRating = (completed, total) => {
    if (total === 0) return {
      label: t.noTasks,
      color: 'gray',
      bgClass: 'bg-gray-200 dark:bg-gray-700',
      textClass: 'text-gray-600 dark:text-gray-400',
      badgeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
    };
    const percent = Math.round((completed / total) * 100);
    if (percent >= 80) return {
      label: t.good,
      color: 'green',
      bgClass: 'bg-green-500',
      textClass: 'text-green-600 dark:text-green-400',
      badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    };
    if (percent >= 50) return {
      label: t.average,
      color: 'yellow',
      bgClass: 'bg-yellow-500',
      textClass: 'text-yellow-600 dark:text-yellow-400',
      badgeClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    return {
      label: t.bad,
      color: 'red',
      bgClass: 'bg-red-500',
      textClass: 'text-red-600 dark:text-red-400',
      badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
  };

  // ---------- দৈনিক পরিসংখ্যান (useMemo) ----------
  const dailyStats = useMemo(() => {
    const allDates = getDateRangeArray();
    return allDates.map(date => {
      const tasks = getTasksForDate(date);
      const completed = tasks.filter(t => t.completedOnThisDate).length;
      const total = tasks.length;
      const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
      const rating = getPerformanceRating(completed, total);
      return { date, completed, total, tasks, rate, rating };
    });
  }, [timeBlocks, dateRange]); // নির্ভরশীলতা

  // ---------- ফিল্টারিং (useMemo) ----------
  const filteredDailyStats = useMemo(() => {
    return dailyStats.map(day => ({
      ...day,
      tasks: day.tasks.filter(task => {
        if (filterCategory !== 'all' && task.category !== filterCategory) return false;
        if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
        return true;
      })
    })).filter(day => day.tasks.length > 0 || dateRange === 'all' ? true : day.total > 0);
  }, [dailyStats, filterCategory, filterPriority, dateRange]);

  // ---------- সামগ্রিক পরিসংখ্যান ----------
  const totalCompleted = timeBlocks.filter(t => t.completed).length;
  const totalTasks = timeBlocks.length;
  const overallCompletionRate = totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);

  const streak = (() => {
    let currentStreak = 0;
    for (let day of dailyStats) {
      if (day.completed > 0) currentStreak++;
      else break;
    }
    return currentStreak;
  })();

  const bestDay = dailyStats.reduce((best, day) => day.completed > (best?.completed || 0) ? day : best, null);
  const worstDay = dailyStats.reduce((worst, day) => {
    if (day.total === 0) return worst;
    if (!worst) return day;
    return day.rate < worst.rate ? day : worst;
  }, null);

  // ---------- ক্যাটাগরি পারফরম্যান্স ----------
  const categoryPerformance = useMemo(() => {
    return categories.slice(1).map(cat => {
      const catTasks = timeBlocks.filter(t => t.category === cat.id);
      const completed = catTasks.filter(t => t.completed).length;
      const total = catTasks.length;
      const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { ...cat, completed, total, rate };
    }).filter(c => c.total > 0).sort((a, b) => b.rate - a.rate);
  }, [timeBlocks, categories]);

  const bestCategory = categoryPerformance[0];

  // ---------- সপ্তাহের গড় ----------
  const weeklyAvg = (dailyStats.slice(0, 7).reduce((sum, day) => sum + day.completed, 0) / 7).toFixed(1);

  // ---------- এক্সপোর্ট ফাংশন ----------
  const exportHistory = () => {
    const data = {
      exportDate: new Date().toISOString(),
      stats: { totalCompleted, totalTasks, overallCompletionRate, streak, bestDay },
      history: dailyStats
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('History exported successfully');
  };

  // ---------- JSX ----------
  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BarChart3 className="text-purple-500" /> {t.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t.subtitle}</p>
        </div>
        <button
          onClick={exportHistory}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium flex items-center gap-2 shadow-md"
        >
          <Download size={16} /> {t.export}
        </button>
      </div>

      {/* পরিসংখ্যান কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t.totalTasks}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTasks}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Target className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t.completed}</p>
              <p className="text-3xl font-bold text-green-600">{totalCompleted}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t.completionRate}</p>
              <p className="text-3xl font-bold text-purple-600">{overallCompletionRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t.currentStreak}</p>
              <p className="text-3xl font-bold text-orange-600">{streak} {t.days}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Award className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* উন্নত পরিসংখ্যান */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {bestCategory && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <ThumbsUp size={16} className="text-green-500" />
              {t.mostProductivity}
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${bestCategory.color}`} />
              <span className="font-semibold text-gray-900 dark:text-white">{bestCategory.label}</span>
              <span className="text-sm text-gray-500 ml-auto">{bestCategory.rate}%</span>
            </div>
          </div>
        )}
        {worstDay && worstDay.total > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <ThumbsDown size={16} className="text-red-500" />
              {t.worstDay}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">
                {new Date(worstDay.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className={`text-sm px-2 py-0.5 rounded-full ${worstDay.rating.badgeClass}`}>
                {worstDay.rate}%
              </span>
            </div>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
            <Star size={16} className="text-yellow-500" />
            {t.weeklyAvg}
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {weeklyAvg} <span className="text-sm font-normal text-gray-500">{t.tasks}/{t.days}</span>
          </div>
        </div>
      </div>

      {/* ফিল্টার ও ভিউ অপশন */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.dateRange}</label>
            <div className="flex gap-2">
              {['7', '30', '90', 'all'].map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    dateRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {range === 'all' ? t.all : `${range}D`}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.category}</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.priority}</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              {priorities.map(pri => (
                <option key={pri.id} value={pri.id}>{pri.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                title={t.gridView}
              >
                <Calendar size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                title={t.listView}
              >
                <Clock size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* গ্রিড ভিউ – এখন সবচেয়ে নতুন প্রথমে (১৪ ফেব, ১৩ ফেব, ১২ ফেব...) */}
      {viewMode === 'grid' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-3">
            {filteredDailyStats.map(day => (
              <div
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`aspect-square rounded-lg ${day.rating.bgClass} hover:scale-110 transition-transform cursor-pointer flex flex-col items-center justify-center text-white p-1`}
                title={`${day.date}\n✅ ${day.completed}/${day.total} tasks\n${day.rate}% completed (${day.rating.label})`}
              >
                <span className="text-xs sm:text-sm font-bold">{new Date(day.date).getDate()}</span>
                <span className="text-[10px] sm:text-xs font-semibold mt-1 px-1.5 py-0.5 rounded bg-white/30">
                  {day.rating.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* লিস্ট ভিউ – সবচেয়ে নতুন প্রথমে */
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.dateRange}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.tasks}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.completed}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.rate}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.performance}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.status}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDailyStats.slice(0, 30).map(day => (
                <tr
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(day.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.completed}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{day.rate}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${day.rating.bgClass}`}
                          style={{ width: `${day.rate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${day.rating.badgeClass}`}>
                      {day.rating.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {day.rate === 100 ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                        {t.complete}
                      </span>
                    ) : day.rate > 0 ? (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
                        {t.partial}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                        {t.noTasks}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* সেরা দিন */}
      {bestDay && bestDay.completed > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500 rounded-full">
              <Award className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.bestDay}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.bestDayMessage
                  .replace('{date}', new Date(bestDay.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
                  .replace('{completed}', bestDay.completed)
                  .replace('{total}', bestDay.total)
                  .replace('{rate}', bestDay.rate)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* দিনের বিস্তারিত মডাল */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="text-blue-500" />{' '}
                  {new Date(selectedDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <XCircle size={24} />
                </button>
              </div>
              {(() => {
                const tasks = getTasksForDate(selectedDate);
                const filtered = tasks.filter(task => {
                  if (filterCategory !== 'all' && task.category !== filterCategory) return false;
                  if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
                  return true;
                });
                const completed = filtered.filter(t => t.completedOnThisDate).length;
                const rating = getPerformanceRating(completed, filtered.length);
                return (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        {completed} {t.of} {filtered.length} {t.tasks} {t.completed}
                      </p>
                      <div className="flex gap-2">
                        {filtered.length > 0 && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${rating.badgeClass}`}>
                            {rating.label}
                          </span>
                        )}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            filtered.length === 0
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              : completed === filtered.length
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}
                        >
                          {filtered.length === 0
                            ? t.noTasks
                            : completed === filtered.length
                            ? t.complete
                            : t.partial}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {filtered.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                          <p>{t.noTasks} {t.for} {t.tasks}.</p>
                        </div>
                      ) : (
                        filtered.map(task => {
                          const completedOnThisDay = task.completedOnThisDate;
                          const category = categories.find(c => c.id === task.category);
                          const priority = priorities.find(p => p.id === task.priority);
                          return (
                            <div
                              key={task.id}
                              className={`p-4 rounded-xl border ${
                                completedOnThisDay
                                  ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                                  : 'border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 ${completedOnThisDay ? 'text-green-600' : 'text-gray-400'}`}>
                                  {completedOnThisDay ? <CheckCircle size={20} /> : <Clock size={20} />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className={`font-semibold ${completedOnThisDay ? 'line-through text-gray-500' : ''}`}>
                                      {task.title}
                                    </h4>
                                    {priority && priority.id !== 'all' && (
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.color} bg-opacity-20`}>
                                        {priority.label}
                                      </span>
                                    )}
                                    {category && category.id !== 'all' && (
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${category.color} bg-opacity-20`}>
                                        {category.label}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <Clock size={12} />
                                    <span>
                                      {task.start} – {task.end}
                                    </span>
                                  </div>
                                  {task.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{task.description}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;