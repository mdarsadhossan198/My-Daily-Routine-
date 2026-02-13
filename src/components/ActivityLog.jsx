import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  CheckCircle,
  Clock,
  Play,
  StopCircle,
  Timer,
  Calendar,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Zap,
  XCircle,
  Heart,
  BookOpen,
  Briefcase,
  Dumbbell,
  Home,
  Palette,
  Users,
  DollarSign,
  Download,
  Upload,
  Target,
  TrendingUp,
  Award,
  Coffee,
  Moon,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning
} from 'lucide-react';

const ActivityLog = () => {
  // ---------- Time Block Manager থেকে ডেটা লোড ----------
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [timer, setTimer] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [selectedDay] = useState(() => {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[new Date().getDay()];
  });

  // ---------- লোকালস্টোরেজ থেকে টাইম ব্লক লোড ----------
  const loadTimeBlocks = () => {
    try {
      const saved = localStorage.getItem('advancedTimeBlocks');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeBlocks(parsed);
      } else {
        setTimeBlocks([]);
      }
    } catch (error) {
      console.error('Error loading time blocks:', error);
    }
  };

  useEffect(() => {
    loadTimeBlocks();
    const interval = setInterval(loadTimeBlocks, 2000);
    return () => clearInterval(interval);
  }, []);

  // ---------- টাইমার ইফেক্ট ----------
  useEffect(() => {
    let interval;
    if (timer && activeTimer) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            toast.success('Task completed! 🎉');
            setTimer(null);
            setActiveTimer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, activeTimer]);

  // ---------- কনস্ট্যান্ট ----------
  const categories = [
    { id: 'work', label: 'Work', icon: Briefcase, color: 'bg-blue-100 text-blue-700', borderColor: 'border-blue-200', bgGradient: 'from-blue-500 to-blue-600' },
    { id: 'health', label: 'Health', icon: Heart, color: 'bg-red-100 text-red-700', borderColor: 'border-red-200', bgGradient: 'from-red-500 to-red-600' },
    { id: 'learning', label: 'Learning', icon: BookOpen, color: 'bg-green-100 text-green-700', borderColor: 'border-green-200', bgGradient: 'from-green-500 to-green-600' },
    { id: 'personal', label: 'Personal', icon: Home, color: 'bg-purple-100 text-purple-700', borderColor: 'border-purple-200', bgGradient: 'from-purple-500 to-purple-600' },
    { id: 'social', label: 'Social', icon: Users, color: 'bg-pink-100 text-pink-700', borderColor: 'border-pink-200', bgGradient: 'from-pink-500 to-pink-600' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'bg-orange-100 text-orange-700', borderColor: 'border-orange-200', bgGradient: 'from-orange-500 to-orange-600' },
    { id: 'creative', label: 'Creative', icon: Palette, color: 'bg-cyan-100 text-cyan-700', borderColor: 'border-cyan-200', bgGradient: 'from-cyan-500 to-cyan-600' },
    { id: 'finance', label: 'Finance', icon: DollarSign, color: 'bg-emerald-100 text-emerald-700', borderColor: 'border-emerald-200', bgGradient: 'from-emerald-500 to-emerald-600' }
  ];

  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700', borderColor: 'border-gray-200', icon: ChevronDown, bgGradient: 'from-gray-500 to-gray-600' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700', borderColor: 'border-yellow-200', icon: ChevronUp, bgGradient: 'from-yellow-500 to-yellow-600' },
    { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-700', borderColor: 'border-orange-200', icon: AlertCircle, bgGradient: 'from-orange-500 to-orange-600' },
    { id: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700', borderColor: 'border-red-200', icon: Zap, bgGradient: 'from-red-500 to-red-600' }
  ];

  // ---------- হেল্পার ফাংশন ----------
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return { total: 60, hours: 1, minutes: 0, display: '1h' };
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const total = duration || 60;
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    return {
      total,
      hours,
      minutes,
      display: hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}` : `${minutes}m`
    };
  };

  // ---------- টাস্ক টগল কমপ্লিট ----------
  const toggleComplete = (id) => {
    const now = new Date().toISOString().split('T')[0];
    const updatedBlocks = timeBlocks.map(block =>
      block.id === id
        ? {
            ...block,
            completed: !block.completed,
            completedDate: block.completed ? null : now,
            lastModified: new Date().toISOString()
          }
        : block
    );
    localStorage.setItem('advancedTimeBlocks', JSON.stringify(updatedBlocks));
    setTimeBlocks(updatedBlocks);
    toast.success(updatedBlocks.find(b => b.id === id).completed ? 'Task completed! 🎉' : 'Task uncompleted');
  };

  // ---------- টাইমার কন্ট্রোল ----------
  const startTimer = (block) => {
    const duration = calculateDuration(block.start, block.end);
    const totalSeconds = duration.total * 60;
    setActiveTimer(block.id);
    setTimerSeconds(totalSeconds);
    setTimer(true);
    toast.success(`Timer started for "${block.title}"`);
  };

  const stopTimer = () => {
    setTimer(false);
    setActiveTimer(null);
    toast.info('Timer stopped');
  };

  // ---------- আজকের টাস্ক ফিল্টার ----------
  const todayTasks = timeBlocks.filter(block => {
    const isRecurring = block.repeats && block.repeats.includes(selectedDay);
    const isOneOff = block.scheduledDay === selectedDay;
    return isRecurring || isOneOff;
  }).sort((a, b) => a.start.localeCompare(b.start));

  // ---------- স্ট্যাটস ----------
  const total = todayTasks.length;
  const completed = todayTasks.filter(t => t.completed).length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  const totalEstimatedMinutes = todayTasks.reduce((sum, task) => {
    const duration = calculateDuration(task.start, task.end);
    return sum + duration.total;
  }, 0);
  const totalEstimatedHours = Math.floor(totalEstimatedMinutes / 60);
  const totalEstimatedRemainMinutes = totalEstimatedMinutes % 60;

  // ---------- গ্রিটিং (সময় অনুযায়ী) ----------
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  // ---------- এক্সপোর্ট/ইম্পোর্ট ----------
  const exportData = () => {
    const data = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      timeBlocks
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-blocks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.timeBlocks) {
          if (window.confirm(`Import ${data.timeBlocks.length} time blocks?`)) {
            localStorage.setItem('advancedTimeBlocks', JSON.stringify(data.timeBlocks));
            setTimeBlocks(data.timeBlocks);
            toast.success(`Imported ${data.timeBlocks.length} time blocks`);
          }
        }
      } catch (error) {
        toast.error('Error importing file');
      }
    };
    reader.readAsText(file);
  };

  // ---------- রেন্ডার ----------
  return (
    <div className="space-y-6">
      {/* ----- হেডার – গ্রিটিং, তারিখ, এক্সপোর্ট/ইম্পোর্ট ----- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {getGreeting()}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
            <Calendar size={16} className="text-blue-500" />
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Download size={16} />
            Export
          </button>
          <label className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer">
            <Upload size={16} />
            Import
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>
      </div>

      {/* ----- লাইভ টাইমার (যখন কোনো টাস্কে টাইমার চালু) ----- */}
      {timer && activeTimer && (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl border border-white/20 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full animate-pulse">
                <Timer className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm uppercase tracking-wider opacity-80">Focusing on</div>
                <div className="text-xl font-bold">
                  {todayTasks.find(t => t.id === activeTimer)?.title}
                </div>
                <div className="font-mono text-3xl md:text-4xl font-bold mt-1">
                  {formatTime(timerSeconds)}
                </div>
              </div>
            </div>
            <button
              onClick={stopTimer}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl font-medium flex items-center gap-2 transition-all border border-white/30"
            >
              <StopCircle size={20} />
              Stop Timer
            </button>
          </div>
        </div>
      )}

      {/* ----- পরিসংখ্যান কার্ড ----- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Target className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{completed}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Est. Focus Time</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {totalEstimatedHours > 0 ? `${totalEstimatedHours}h` : ''}{totalEstimatedRemainMinutes > 0 ? `${totalEstimatedRemainMinutes}m` : '0m'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* ----- প্রোগ্রেস বার ও মোটিভেশন ----- */}
      {total > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-full">
                <Award className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Today's Progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {completed} of {total} tasks completed • {completionRate}% done
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {completionRate}%
            </div>
          </div>
          <div className="mt-4 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          {completionRate === 100 ? (
            <p className="mt-3 text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
              <CheckCircle size={16} /> Great job! All tasks completed for today. 🎉
            </p>
          ) : (
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
              {pending === 0 ? '' : `${pending} task${pending > 1 ? 's' : ''} remaining. Keep going! 💪`}
            </p>
          )}
        </div>
      )}

      {/* ----- টাস্ক লিস্ট – সুন্দর কার্ড ডিজাইন ----- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock size={20} className="text-blue-500" />
            Today's Schedule
          </h3>
          {todayTasks.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sorted by time
            </span>
          )}
        </div>

        {todayTasks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tasks scheduled for today
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Go to <span className="font-medium text-blue-600 dark:text-blue-400">Time Blocks</span> tab to plan your day.
            </p>
            <div className="inline-flex gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
              <Clock size={16} />
              Your day is free – relax or add some tasks!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {todayTasks.map(task => {
              const category = categories.find(c => c.id === task.category);
              const priority = priorities.find(p => p.id === task.priority);
              const CategoryIcon = category?.icon || Briefcase;
              const PriorityIcon = priority?.icon || ChevronUp;
              const isActiveTimer = activeTimer === task.id;
              const duration = calculateDuration(task.start, task.end);
              const isOverdue = !task.completed && new Date(`${new Date().toISOString().split('T')[0]}T${task.start}`) < new Date();

              return (
                <div
                  key={task.id}
                  className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl ${
                    task.completed
                      ? 'border-green-200 dark:border-green-800/50 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-900/10'
                      : isOverdue
                      ? 'border-red-200 dark:border-red-800/50 bg-gradient-to-r from-red-50/30 to-transparent dark:from-red-900/5'
                      : 'border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800/50'
                  }`}
                >
                  {/* রিয়েল-টাইম ইন্ডিকেটর (যদি টাইমার চালু) */}
                  {isActiveTimer && (
                    <div className="absolute -top-3 -right-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                        <div className="relative flex items-center justify-center w-8 h-8 bg-red-500 rounded-full shadow-lg">
                          <Timer className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* কমপ্লিট টগল – বড় ও সুন্দর */}
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-green-500 border-green-500 text-white shadow-md'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                      title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {task.completed && <CheckCircle size={16} />}
                    </button>

                    {/* টাস্কের বিস্তারিত তথ্য */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-2">
                          {/* টাইটেল ও ব্যাজ */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`text-lg font-semibold ${
                              task.completed 
                                ? 'line-through text-gray-500 dark:text-gray-400' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {task.title}
                            </h4>
                            
                            {/* প্রায়োরিটি ব্যাজ */}
                            {priority && (
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${priority.color} bg-opacity-20 border ${priority.borderColor}`}>
                                <PriorityIcon size={12} />
                                {priority.label}
                              </span>
                            )}
                            
                            {/* ক্যাটাগরি ব্যাজ */}
                            {category && (
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${category.color} bg-opacity-20 border ${category.borderColor}`}>
                                <CategoryIcon size={12} />
                                {category.label}
                              </span>
                            )}

                            {/* ওভারডিউ ব্যাজ */}
                            {isOverdue && !task.completed && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                                <AlertCircle size={12} />
                                Overdue
                              </span>
                            )}
                          </div>

                          {/* সময় ও ডিউরেশন */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                              <Clock size={14} className="text-blue-500" />
                              <span className="font-medium">{task.start} – {task.end}</span>
                              <span className="text-gray-400 dark:text-gray-500">({duration.display})</span>
                            </div>
                          </div>

                          {/* ডেসক্রিপশন */}
                          {task.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                              {task.description}
                            </p>
                          )}

                          {/* ট্যাগস */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {task.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs flex items-center gap-1 border border-gray-200 dark:border-gray-600"
                                >
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* প্রোগ্রেস বার – যদি প্রোগ্রেস ০-৯৯% এবং কমপ্লিট না হয় */}
                          {task.progress > 0 && task.progress < 100 && !task.completed && (
                            <div className="mt-3 max-w-xs">
                              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                <span>Progress</span>
                                <span className="font-medium">{task.progress}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* টাইমার বাটন – সুন্দর ও প্রমিনেন্ট */}
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                          {!isActiveTimer ? (
                            <button
                              onClick={() => startTimer(task)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                            >
                              <Play size={16} />
                              Start Timer
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium flex items-center gap-2 shadow-md">
                                <Timer size={16} className="animate-pulse" />
                                <span className="font-mono">{formatTime(timerSeconds)}</span>
                              </div>
                              <button
                                onClick={stopTimer}
                                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                                title="Stop timer"
                              >
                                <StopCircle size={20} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ----- ফুটার – উইশ ও টোটাল টাইম ----- */}
      {todayTasks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
            {completionRate === 100 ? (
              <>
                <Award className="text-yellow-500" size={20} />
                <span className="font-medium">Excellent! You've crushed all your tasks today! 🌟</span>
              </>
            ) : completionRate > 70 ? (
              <>
                <TrendingUp className="text-green-500" size={20} />
                <span className="font-medium">Almost there! Keep up the great work! 🚀</span>
              </>
            ) : completionRate > 30 ? (
              <>
                <Clock className="text-blue-500" size={20} />
                <span className="font-medium">You're making progress – stay focused! 💪</span>
              </>
            ) : (
              <>
                <Sun className="text-yellow-500" size={20} />
                <span className="font-medium">A fresh start – you got this! ✨</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Estimated total focus time: {totalEstimatedHours > 0 ? `${totalEstimatedHours}h ` : ''}{totalEstimatedRemainMinutes > 0 ? `${totalEstimatedRemainMinutes}m` : ''} • 
            Created with ❤️ for productivity
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;