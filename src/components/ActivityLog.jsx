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
  Sun,
  Bell,
  BellOff,
  Grid,
  List,
  Filter
} from 'lucide-react';

// ---------- আপনার ডিফল্ট সেটিংস এখানে পরিবর্তন করুন ----------
const DEFAULT_GRID_COLUMNS = 3;        // আপনি চাইলে 2, 3, বা 4 সেট করতে পারেন
const DEFAULT_VIEW_MODE = 'list';      // 'list' বা 'grid'
const DEFAULT_FILTER_STATUS = 'all';
const DEFAULT_FILTER_CATEGORY = 'all';
const DEFAULT_SORT_BY = 'time';
// ------------------------------------------------------------

const ActivityLog = () => {
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [timer, setTimer] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem('activityLogViewMode');
    return saved || DEFAULT_VIEW_MODE;
  });
  const [filterStatus, setFilterStatus] = useState(() => {
    const saved = localStorage.getItem('filterStatus');
    return saved || DEFAULT_FILTER_STATUS;
  });
  const [filterCategory, setFilterCategory] = useState(() => {
    const saved = localStorage.getItem('filterCategory');
    return saved || DEFAULT_FILTER_CATEGORY;
  });
  const [sortBy, setSortBy] = useState(() => {
    const saved = localStorage.getItem('sortBy');
    return saved || DEFAULT_SORT_BY;
  });
  const [gridColumns, setGridColumns] = useState(() => {
    const saved = localStorage.getItem('activityLogGridColumns');
    return saved ? parseInt(saved, 10) : DEFAULT_GRID_COLUMNS;
  });

  // Notifications state
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved ? JSON.parse(saved) : false;
  });
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  // Statistics state
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [yesterdayCompleted, setYesterdayCompleted] = useState(0);
  const [weekCompleted, setWeekCompleted] = useState(0);

  // Load time blocks from localStorage
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

  // Persist settings
  useEffect(() => {
    localStorage.setItem('activityLogViewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('filterStatus', filterStatus);
  }, [filterStatus]);

  useEffect(() => {
    localStorage.setItem('filterCategory', filterCategory);
  }, [filterCategory]);

  useEffect(() => {
    localStorage.setItem('sortBy', sortBy);
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem('activityLogGridColumns', gridColumns.toString());
  }, [gridColumns]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (notificationPermission === 'granted') return;
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        toast.success('Notifications enabled!');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const toggleNotifications = () => {
    if (!notificationsEnabled && notificationPermission !== 'granted') {
      requestNotificationPermission().then(() => {
        setNotificationsEnabled(true);
      });
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  // Task reminder check
  useEffect(() => {
    if (!notificationsEnabled || notificationPermission !== 'granted') return;

    const checkUpcomingTasks = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      timeBlocks.forEach(task => {
        if (!task.completed && task.start && task.start.trim() === currentTime) {
          new Notification('⏰ Task Reminder', {
            body: `It's time to start: ${task.title}`,
            icon: '/favicon.ico'
          });
        }
      });
    };

    const interval = setInterval(checkUpcomingTasks, 30000);
    return () => clearInterval(interval);
  }, [notificationsEnabled, notificationPermission, timeBlocks]);

  // Timer effect
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

  // Calculate statistics
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const weekAgoStr = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    let todayCount = 0;
    let yesterdayCount = 0;
    let weekCount = 0;

    timeBlocks.forEach(block => {
      if (block.completed && block.completedDate) {
        if (block.completedDate === todayStr) todayCount++;
        if (block.completedDate === yesterdayStr) yesterdayCount++;
        if (block.completedDate >= weekAgoStr) weekCount++;
      }
    });

    setTodayCompleted(todayCount);
    setYesterdayCompleted(yesterdayCount);
    setWeekCompleted(weekCount);
  }, [timeBlocks]);

  // Constants
  const categories = [
    { id: 'work', label: 'Work', icon: Briefcase, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', borderColor: 'border-blue-200 dark:border-blue-800' },
    { id: 'health', label: 'Health', icon: Heart, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', borderColor: 'border-red-200 dark:border-red-800' },
    { id: 'learning', label: 'Learning', icon: BookOpen, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', borderColor: 'border-green-200 dark:border-green-800' },
    { id: 'personal', label: 'Personal', icon: Home, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', borderColor: 'border-purple-200 dark:border-purple-800' },
    { id: 'social', label: 'Social', icon: Users, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300', borderColor: 'border-pink-200 dark:border-pink-800' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', borderColor: 'border-orange-200 dark:border-orange-800' },
    { id: 'creative', label: 'Creative', icon: Palette, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300', borderColor: 'border-cyan-200 dark:border-cyan-800' },
    { id: 'finance', label: 'Finance', icon: DollarSign, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', borderColor: 'border-emerald-200 dark:border-emerald-800' }
  ];

  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', borderColor: 'border-gray-200 dark:border-gray-700', icon: ChevronDown },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', borderColor: 'border-yellow-200 dark:border-yellow-800', icon: ChevronUp },
    { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', borderColor: 'border-orange-200 dark:border-orange-800', icon: AlertCircle },
    { id: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', borderColor: 'border-red-200 dark:border-red-800', icon: Zap }
  ];

  // Helper functions
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
    return { total, hours, minutes, display: hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}` : `${minutes}m` };
  };

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
    const task = updatedBlocks.find(b => b.id === id);
    toast.success(task.completed ? 'Task completed! 🎉' : 'Task uncompleted');
  };

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

  // Filtering and sorting
  const getFilteredTasks = () => {
    let filtered = timeBlocks;
    if (filterStatus === 'completed') filtered = filtered.filter(t => t.completed);
    else if (filterStatus === 'pending') filtered = filtered.filter(t => !t.completed);
    if (filterCategory !== 'all') filtered = filtered.filter(t => t.category === filterCategory);
    return filtered;
  };

  const getSortedTasks = (tasks) => {
    const sorted = [...tasks];
    if (sortBy === 'time') {
      sorted.sort((a, b) => (a.start || '').localeCompare(b.start || ''));
    } else if (sortBy === 'priority') {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      sorted.sort((a, b) => (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4));
    } else if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  };

  const filteredTasks = getFilteredTasks();
  const displayedTasks = getSortedTasks(filteredTasks);

  // Stats
  const total = timeBlocks.length;
  const completed = timeBlocks.filter(t => t.completed).length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  const totalEstimatedMinutes = timeBlocks.reduce((sum, task) => {
    const duration = calculateDuration(task.start, task.end);
    return sum + duration.total;
  }, 0);
  const totalEstimatedHours = Math.floor(totalEstimatedMinutes / 60);
  const totalEstimatedRemainMinutes = totalEstimatedMinutes % 60;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const exportData = () => {
    const data = { version: '2.0', exportDate: new Date().toISOString(), timeBlocks };
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {getGreeting()}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
            <Calendar size={16} className="text-blue-500" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleNotifications}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all ${
              notificationsEnabled
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
          >
            {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            {notificationsEnabled ? 'On' : 'Off'}
          </button>

          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              title="List view"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              title="Grid view"
            >
              <Grid size={20} />
            </button>
          </div>

          {viewMode === 'grid' && (
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {[2, 3, 4].map(cols => (
                <button
                  key={cols}
                  onClick={() => setGridColumns(cols)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    gridColumns === cols ? 'bg-white dark:bg-gray-600 shadow' : ''
                  }`}
                >
                  {cols} cols
                </button>
              ))}
            </div>
          )}

          <button
            onClick={exportData}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Download size={16} /> Export
          </button>
          <label className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer">
            <Upload size={16} /> Import
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={18} className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Status:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                filterStatus === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                filterStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="time">Sort by Time</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* Live Timer */}
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
                  {timeBlocks.find(t => t.id === activeTimer)?.title}
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
              <StopCircle size={20} /> Stop Timer
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed Today</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{todayCompleted}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed Yesterday</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{yesterdayCompleted}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Calendar className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{weekCompleted}</p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily Avg (Week)</p>
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {weekCompleted > 0 ? (weekCompleted / 7).toFixed(1) : '0'}
              </p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <Award className="text-amber-600 dark:text-amber-400" size={24} />
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
      </div>

      {/* Performance Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Sun size={18} className="text-yellow-500" /> Today's Performance
          </h4>
          <p className="text-lg text-gray-800 dark:text-gray-200">
            {total === 0 
              ? "No tasks scheduled today. Add some tasks to get started!"
              : todayCompleted >= total ? "🔥 Excellent! You've completed all tasks today!"
              : todayCompleted === 0 ? "😐 You haven't completed any tasks yet. Stay focused!"
              : todayCompleted > total/2 ? "👍 Good job! Keep going."
              : "👌 You're making progress. Try to finish more tasks."
            }
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Calendar size={18} className="text-blue-500" /> Compared to Yesterday
          </h4>
          <p className="text-lg text-gray-800 dark:text-gray-200">
            {yesterdayCompleted === 0 && todayCompleted === 0
              ? "You haven't completed any tasks in the last two days."
              : yesterdayCompleted > todayCompleted
                ? `📉 You completed more tasks yesterday (${yesterdayCompleted}) than today (${todayCompleted}). Let's pick up the pace!`
                : yesterdayCompleted < todayCompleted
                  ? `📈 Great improvement! Today you've completed ${todayCompleted} tasks vs ${yesterdayCompleted} yesterday.`
                  : `⚖️ You're consistent! Both days you completed ${todayCompleted} tasks.`
            }
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-500" /> This Week's Performance
          </h4>
          <p className="text-lg text-gray-800 dark:text-gray-200">
            {weekCompleted === 0 
              ? "You haven't completed any tasks this week. Start now!"
              : weekCompleted >= 20 ? `🏆 Amazing! You've completed ${weekCompleted} tasks this week.`
              : weekCompleted >= 10 ? `👍 Good progress: ${weekCompleted} tasks done this week.`
              : `📝 You've completed ${weekCompleted} tasks this week. Aim for more!`
            }
          </p>
        </div>
      </div>

      {/* Today's Progress Bar */}
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
                  {todayCompleted} of {total} tasks completed • {Math.round((todayCompleted / total) * 100)}% done
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round((todayCompleted / total) * 100)}%
            </div>
          </div>
          <div className="mt-4 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(todayCompleted / total) * 100}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {yesterdayCompleted > 0 && (
              <span className="text-gray-600 dark:text-gray-400">🔙 Yesterday: {yesterdayCompleted} task{yesterdayCompleted > 1 ? 's' : ''}</span>
            )}
            {weekCompleted > 0 && (
              <span className="text-gray-600 dark:text-gray-400">📊 Last 7 days: {weekCompleted} tasks</span>
            )}
            {pending > 0 && (
              <span className="text-gray-600 dark:text-gray-400">{pending} task{pending > 1 ? 's' : ''} remaining. Keep going! 💪</span>
            )}
          </div>
        </div>
      )}

      {/* Task List/Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock size={20} className="text-blue-500" /> 
            {filterStatus === 'all' ? 'All Tasks' : filterStatus === 'completed' ? 'Completed Tasks' : 'Pending Tasks'}
            {filterCategory !== 'all' && ` • ${categories.find(c => c.id === filterCategory)?.label}`}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {displayedTasks.length} tasks
          </span>
        </div>

        {displayedTasks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tasks match your filters
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try changing the status or category filter.
            </p>
          </div>
        ) : viewMode === 'list' ? (
          // List View
          <div className="grid grid-cols-1 gap-4">
            {displayedTasks.map(task => {
              const category = categories.find(c => c.id === task.category);
              const priority = priorities.find(p => p.id === task.priority);
              const CategoryIcon = category?.icon || Briefcase;
              const PriorityIcon = priority?.icon || ChevronUp;
              const isActiveTimer = activeTimer === task.id;
              const duration = calculateDuration(task.start, task.end);
              const isOverdue = !task.completed && task.start && new Date(`${new Date().toISOString().split('T')[0]}T${task.start}`) < new Date();

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
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-green-500 border-green-500 text-white shadow-md'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                    >
                      {task.completed && <CheckCircle size={16} />}
                    </button>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className={`text-lg font-semibold ${
                                task.completed
                                  ? 'line-through text-gray-500 dark:text-gray-400'
                                  : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              {task.title}
                            </h4>
                            {priority && (
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${priority.color} bg-opacity-20 border ${priority.borderColor}`}
                              >
                                <PriorityIcon size={12} /> {priority.label}
                              </span>
                            )}
                            {category && (
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${category.color} bg-opacity-20 border ${category.borderColor}`}
                              >
                                <CategoryIcon size={12} /> {category.label}
                              </span>
                            )}
                            {isOverdue && !task.completed && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                                <AlertCircle size={12} /> Overdue
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                              <Clock size={14} className="text-blue-500" />
                              <span className="font-medium">
                                {task.start || 'No time'} – {task.end || 'No time'}
                              </span>
                              {task.start && task.end && (
                                <span className="text-gray-400 dark:text-gray-500">({duration.display})</span>
                              )}
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                              {task.description}
                            </p>
                          )}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {task.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs flex items-center gap-1 border border-gray-200 dark:border-gray-600"
                                >
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                          {!isActiveTimer ? (
                            <button
                              onClick={() => startTimer(task)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                            >
                              <Play size={16} /> Start Timer
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
        ) : (
          // Grid View with dynamic columns
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`
            }}
          >
            {displayedTasks.map(task => {
              const category = categories.find(c => c.id === task.category);
              const priority = priorities.find(p => p.id === task.priority);
              const CategoryIcon = category?.icon || Briefcase;
              const PriorityIcon = priority?.icon || ChevronUp;
              const isActiveTimer = activeTimer === task.id;
              const duration = calculateDuration(task.start, task.end);
              const isOverdue = !task.completed && task.start && new Date(`${new Date().toISOString().split('T')[0]}T${task.start}`) < new Date();

              return (
                <div
                  key={task.id}
                  className={`group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border transition-all duration-200 hover:shadow-lg ${
                    task.completed
                      ? 'border-green-200 dark:border-green-800/50 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-900/10'
                      : isOverdue
                      ? 'border-red-200 dark:border-red-800/50 bg-gradient-to-r from-red-50/30 to-transparent dark:from-red-900/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800/50'
                  }`}
                >
                  {isActiveTimer && (
                    <div className="absolute -top-2 -right-2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                        <div className="relative flex items-center justify-center w-6 h-6 bg-red-500 rounded-full shadow-lg">
                          <Timer className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-2">
                      <button
                        onClick={() => toggleComplete(task.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white shadow-md'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                        }`}
                      >
                        {task.completed && <CheckCircle size={14} />}
                      </button>
                      <div className="flex gap-1">
                        {priority && (
                          <span
                            className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${priority.color} bg-opacity-20 border ${priority.borderColor}`}
                          >
                            <PriorityIcon size={10} /> {priority.label}
                          </span>
                        )}
                        {category && (
                          <span
                            className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${category.color} bg-opacity-20 border ${category.borderColor}`}
                          >
                            <CategoryIcon size={10} /> {category.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <h4
                      className={`text-base font-semibold mb-1 ${
                        task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <Clock size={12} className="text-blue-400" />
                      <span>
                        {task.start || 'No time'} – {task.end || 'No time'}
                      </span>
                      {task.start && task.end && <span className="text-gray-400 dark:text-gray-500">({duration.display})</span>}
                    </div>
                    {isOverdue && !task.completed && (
                      <div className="mb-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle size={12} /> Overdue
                      </div>
                    )}
                    <div className="mt-auto flex justify-end">
                      {!isActiveTimer ? (
                        <button
                          onClick={() => startTimer(task)}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm transition-all"
                        >
                          <Play size={12} /> Start
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm">
                            <Timer size={12} className="animate-pulse" />
                            <span className="font-mono text-xs">{formatTime(timerSeconds)}</span>
                          </div>
                          <button
                            onClick={stopTimer}
                            className="p-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200"
                            title="Stop timer"
                          >
                            <StopCircle size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {timeBlocks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
            {completionRate === 100 ? (
              <>
                <Award className="text-yellow-500" size={20} />{' '}
                <span className="font-medium">Excellent! You've crushed all your tasks! 🌟</span>
              </>
            ) : completionRate > 70 ? (
              <>
                <TrendingUp className="text-green-500" size={20} />{' '}
                <span className="font-medium">Almost there! Keep up the great work! 🚀</span>
              </>
            ) : completionRate > 30 ? (
              <>
                <Clock className="text-blue-500" size={20} />{' '}
                <span className="font-medium">You're making progress – stay focused! 💪</span>
              </>
            ) : (
              <>
                <Sun className="text-yellow-500" size={20} />{' '}
                <span className="font-medium">A fresh start – you got this! ✨</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Estimated total focus time:{' '}
            {totalEstimatedHours > 0 ? `${totalEstimatedHours}h ` : ''}
            {totalEstimatedRemainMinutes > 0 ? `${totalEstimatedRemainMinutes}m` : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;