import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  CheckCircle, Clock, Play, Pause, StopCircle, Timer,
  Calendar, ChevronUp, ChevronDown, AlertCircle, Zap,
  Heart, BookOpen, Briefcase, Dumbbell, Home, Palette,
  Users, DollarSign, Download, Upload, Target, TrendingUp,
  Award, Sun, Bell, BellOff, Grid, List, Filter, Settings,
  RotateCcw
} from 'lucide-react';

const STORAGE_KEY = 'advancedTimeBlocks';

// ---------- migrate ----------
const migrateBlock = (block) => {
  const newBlock = { ...block };
  if (newBlock.completed !== undefined && newBlock.completedDate && !newBlock.completedDates) {
    newBlock.completedDates = { [newBlock.completedDate]: true };
  }
  if (!newBlock.completedDates) newBlock.completedDates = {};
  delete newBlock.completed;
  delete newBlock.completedDate;
  return newBlock;
};

const ActivityLog = () => {
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // ---------- State ----------
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState(null);

  // UI settings
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('activityLogViewMode') || 'list');
  const [filterStatus, setFilterStatus] = useState(() => localStorage.getItem('filterStatus') || 'all');
  const [filterCategory, setFilterCategory] = useState(() => localStorage.getItem('filterCategory') || 'all');
  const [sortBy, setSortBy] = useState(() => localStorage.getItem('sortBy') || 'time');
  const [gridColumns, setGridColumns] = useState(() => {
    const saved = localStorage.getItem('activityLogGridColumns');
    return saved ? parseInt(saved, 10) : 3;
  });

  // Advanced settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved ? JSON.parse(saved) : false;
  });
  const [autoCompleteEnabled, setAutoCompleteEnabled] = useState(() => {
    const saved = localStorage.getItem('autoCompleteEnabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved ? JSON.parse(saved) : false;
  });
  const [defaultDuration, setDefaultDuration] = useState(() => {
    const saved = localStorage.getItem('defaultDuration');
    return saved ? parseInt(saved, 10) : 25;
  });
  const [showSettings, setShowSettings] = useState(false);

  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const audioRef = useRef(null);

  // Statistics
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [yesterdayCompleted, setYesterdayCompleted] = useState(0);
  const [weekCompleted, setWeekCompleted] = useState(0);
  const [totalTimeSpentToday, setTotalTimeSpentToday] = useState(0);
  const [totalTimeSpentWeek, setTotalTimeSpentWeek] = useState(0);

  // ---------- Load from storage ----------
  const loadTimeBlocks = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const migrated = parsed.map(migrateBlock);
        setTimeBlocks(migrated);
      } else {
        setTimeBlocks([]);
      }
    } catch (error) {
      console.error('Error loading time blocks:', error);
    }
  };

  useEffect(() => {
    loadTimeBlocks();
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        loadTimeBlocks();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
  useEffect(() => {
    localStorage.setItem('autoCompleteEnabled', JSON.stringify(autoCompleteEnabled));
  }, [autoCompleteEnabled]);
  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);
  useEffect(() => {
    localStorage.setItem('defaultDuration', defaultDuration.toString());
  }, [defaultDuration]);

  // Load timer from localStorage
  useEffect(() => {
    const savedTimer = localStorage.getItem('activeTimer');
    if (savedTimer) {
      try {
        const { id, seconds, paused, startTime } = JSON.parse(savedTimer);
        setActiveTimer(id);
        setTimerSeconds(seconds);
        setTimerPaused(paused);
        setTimerStartTime(startTime);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (activeTimer) {
      localStorage.setItem('activeTimer', JSON.stringify({
        id: activeTimer,
        seconds: timerSeconds,
        paused: timerPaused,
        startTime: timerStartTime
      }));
    } else {
      localStorage.removeItem('activeTimer');
    }
  }, [activeTimer, timerSeconds, timerPaused, timerStartTime]);

  // ---------- Timer ----------
  useEffect(() => {
    let interval;
    if (activeTimer && !timerPaused) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer, timerPaused]);

  const handleTimerComplete = () => {
    if (autoCompleteEnabled && activeTimer) {
      toggleComplete(activeTimer, getTodayDate(), true);
    }
    toast.success('Timer finished! 🎉', { duration: 5000 });
    if (soundEnabled) playSound();
    if (notificationsEnabled && notificationPermission === 'granted') {
      const task = timeBlocks.find(t => t.id === activeTimer);
      new Notification('Timer Finished', {
        body: `Great job on "${task?.title}"!`,
        icon: '/favicon.ico'
      });
    }
    setActiveTimer(null);
    setTimerPaused(false);
    setTimerStartTime(null);
  };

  const startTimer = (block) => {
    if (block.date !== getTodayDate()) {
      toast.error('You can only start timer for today\'s tasks');
      return;
    }
    if (activeTimer) {
      stopTimer();
    }
    const duration = calculateDuration(block.start, block.end);
    const totalSeconds = duration.total * 60;
    setActiveTimer(block.id);
    setTimerSeconds(totalSeconds);
    setTimerPaused(false);
    setTimerStartTime(Date.now());
    toast.success(`Timer started for "${block.title}"`);
  };

  const pauseTimer = () => {
    setTimerPaused(prev => !prev);
    if (!timerPaused) {
      setTimerStartTime(null);
    } else {
      setTimerStartTime(Date.now());
    }
  };

  const stopTimer = () => {
    setActiveTimer(null);
    setTimerPaused(false);
    setTimerStartTime(null);
    toast.info('Timer stopped');
  };

  const resetTimer = () => {
    if (!activeTimer) return;
    const block = timeBlocks.find(t => t.id === activeTimer);
    if (block) {
      const duration = calculateDuration(block.start, block.end);
      setTimerSeconds(duration.total * 60);
      setTimerPaused(false);
      setTimerStartTime(Date.now());
    }
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && activeTimer) {
        e.preventDefault();
        pauseTimer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTimer]);

  // ---------- Helper Functions ----------
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) {
      return { total: defaultDuration, hours: Math.floor(defaultDuration / 60), minutes: defaultDuration % 60, display: `${defaultDuration}m` };
    }
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    let duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    if (duration <= 0) duration = defaultDuration;
    const total = duration;
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    return { total, hours, minutes, display: hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}` : `${minutes}m` };
  };

  const isTaskCompletedOnDate = (task, date) => {
    return task.completedDates?.[date] || false;
  };

  const toggleComplete = (id, date = getTodayDate(), silent = false) => {
    const updatedBlocks = timeBlocks.map(block => {
      if (block.id !== id) return block;
      const newCompletedDates = { ...(block.completedDates || {}) };
      if (newCompletedDates[date]) {
        delete newCompletedDates[date];
      } else {
        newCompletedDates[date] = true;
      }
      return {
        ...block,
        completedDates: newCompletedDates,
        lastModified: new Date().toISOString()
      };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBlocks));
    setTimeBlocks(updatedBlocks);
    if (!silent) {
      const task = updatedBlocks.find(b => b.id === id);
      const isCompletedNow = task.completedDates?.[date] || false;
      toast.success(isCompletedNow ? 'Task completed! 🎉' : 'Task uncompleted');
    }
  };

  // ---------- Filter today's tasks ----------
  const getTodayTasks = () => {
    const todayStr = getTodayDate();
    const dayIndexToId = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayDayAbbr = dayIndexToId[new Date(todayStr).getDay()];

    return timeBlocks.filter(block => {
      // One-time task
      if (block.date === todayStr) return true;
      // Recurring task (repeats array)
      if (block.repeats && block.repeats.includes(todayDayAbbr)) return true;
      // scheduledDay (if used)
      if (block.scheduledDay === todayDayAbbr) return true;
      return false;
    });
  };

  const getFilteredTasks = () => {
    const todayTasks = getTodayTasks();
    const todayStr = getTodayDate();
    let filtered = todayTasks;

    if (filterStatus === 'completed') {
      filtered = filtered.filter(t => t.completedDates?.[todayStr]);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(t => !t.completedDates?.[todayStr]);
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }
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

  const todayTasks = getTodayTasks();
  const filteredTasks = getFilteredTasks();
  const displayedTasks = getSortedTasks(filteredTasks);

  // Statistics calculation (only for today)
  useEffect(() => {
    const todayStr = getTodayDate();
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const weekAgoStr = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    let todayCount = 0, yesterdayCount = 0, weekCount = 0;
    let todayMinutes = 0, weekMinutes = 0;

    timeBlocks.forEach(block => {
      const completions = block.completedDates || {};
      if (completions[todayStr]) {
        todayCount++;
        const dur = calculateDuration(block.start, block.end);
        todayMinutes += dur.total;
      }
      if (completions[yesterdayStr]) {
        yesterdayCount++;
      }
      const weekCompletions = Object.keys(completions).filter(d => d >= weekAgoStr);
      if (weekCompletions.length > 0) {
        weekCount += weekCompletions.length;
        weekCompletions.forEach(d => {
          const dur = calculateDuration(block.start, block.end);
          weekMinutes += dur.total;
        });
      }
    });

    setTodayCompleted(todayCount);
    setYesterdayCompleted(yesterdayCount);
    setWeekCompleted(weekCount);
    setTotalTimeSpentToday(todayMinutes);
    setTotalTimeSpentWeek(weekMinutes);
  }, [timeBlocks]);

  // Constants (categories, priorities)
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

  const total = todayTasks.length; // total today's tasks
  const pending = todayTasks.filter(t => !t.completedDates?.[getTodayDate()]).length;
  const completionRate = total === 0 ? 0 : Math.round(((total - pending) / total) * 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const exportData = () => {
    const data = { version: '3.1', exportDate: new Date().toISOString(), timeBlocks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-blocks-${getTodayDate()}.json`;
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
            const migrated = data.timeBlocks.map(migrateBlock);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
            setTimeBlocks(migrated);
            toast.success(`Imported ${migrated.length} time blocks`);
          }
        }
      } catch (error) {
        toast.error('Error importing file');
      }
    };
    reader.readAsText(file);
  };

  const todayStr = getTodayDate();

  // ---------- Notifications ----------
  const requestNotificationPermission = async () => {
    if (notificationPermission === 'granted') return;
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') toast.success('Notifications enabled!');
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

  const playSound = () => {
    if (!soundEnabled) return;
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
    }
    audioRef.current.play().catch(e => console.log('Audio play failed:', e));
  };

  // Task reminder
  useEffect(() => {
    if (!notificationsEnabled || notificationPermission !== 'granted') return;
    const checkUpcomingTasks = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const todayStr = getTodayDate();

      timeBlocks.forEach(task => {
        const isCompletedToday = task.completedDates?.[todayStr] || false;
        if (!isCompletedToday && task.date === todayStr && task.start && task.start.trim() === currentTime) {
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

  // ---------- Render ----------
  return (
    <div className="space-y-6">
      {/* Header (same as before) */}
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
        <div className="flex gap-2 flex-wrap">
          {/* Notifications toggle */}
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

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            title="Settings"
          >
            <Settings size={16} /> Settings
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

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Settings size={18} /> Timer Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={autoCompleteEnabled}
                onChange={(e) => setAutoCompleteEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Auto-mark task complete when timer ends
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Play sound when timer ends
            </label>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span>Default duration (minutes):</span>
              <input
                type="number"
                min="1"
                max="180"
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(parseInt(e.target.value) || 25)}
                className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            ⏱️ Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Space</kbd> to pause/resume timer.
          </p>
        </div>
      )}

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
      {activeTimer && (
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
                {(() => {
                  const task = timeBlocks.find(t => t.id === activeTimer);
                  const totalSecs = calculateDuration(task?.start, task?.end).total * 60;
                  const percent = ((totalSecs - timerSeconds) / totalSecs) * 100;
                  return (
                    <div className="w-64 h-2 bg-white/30 rounded-full mt-2">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-1000"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  );
                })()}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={pauseTimer}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl font-medium flex items-center gap-2 transition-all border border-white/30"
              >
                {timerPaused ? <Play size={20} /> : <Pause size={20} />}
                {timerPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={resetTimer}
                className="px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl font-medium flex items-center gap-2 transition-all border border-white/30"
                title="Reset timer"
              >
                <RotateCcw size={20} />
              </button>
              <button
                onClick={stopTimer}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl font-medium flex items-center gap-2 transition-all border border-white/30"
              >
                <StopCircle size={20} /> Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards (based on today's tasks) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today's Tasks</p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Time Today</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {Math.floor(totalTimeSpentToday / 60)}h {totalTimeSpentToday % 60}m
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Clock className="text-purple-600 dark:text-purple-400" size={24} />
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Week Time</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {Math.floor(totalTimeSpentWeek / 60)}h {totalTimeSpentWeek % 60}m
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
                  {todayCompleted} of {total} tasks completed • {completionRate}% done
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
          // List View (same as before, but using displayedTasks)
          <div className="grid grid-cols-1 gap-4">
            {displayedTasks.map(task => {
              const category = categories.find(c => c.id === task.category);
              const priority = priorities.find(p => p.id === task.priority);
              const CategoryIcon = category?.icon || Briefcase;
              const PriorityIcon = priority?.icon || ChevronUp;
              const isActiveTimer = activeTimer === task.id;
              const duration = calculateDuration(task.start, task.end);
              const isCompletedToday = task.completedDates?.[todayStr] || false;
              const isOverdue = !isCompletedToday && task.date === todayStr && task.start && new Date(`${todayStr}T${task.start}`) < new Date();

              return (
                <div
                  key={task.id}
                  className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl ${
                    isCompletedToday
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
                      onClick={() => toggleComplete(task.id, todayStr)}
                      className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompletedToday
                          ? 'bg-green-500 border-green-500 text-white shadow-md'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                    >
                      {isCompletedToday && <CheckCircle size={16} />}
                    </button>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className={`text-lg font-semibold ${
                                isCompletedToday
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
                            {isOverdue && !isCompletedToday && (
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
                              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all ${
                                task.date === todayStr
                                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                              }`}
                              disabled={task.date !== todayStr}
                              title={task.date === todayStr ? 'Start Timer' : 'You can only start timer for today\'s tasks'}
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
                                onClick={pauseTimer}
                                className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl hover:bg-yellow-200 transition-all"
                                title={timerPaused ? 'Resume' : 'Pause'}
                              >
                                {timerPaused ? <Play size={20} /> : <Pause size={20} />}
                              </button>
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
          // Grid View (same as before, but using displayedTasks)
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
              const isCompletedToday = task.completedDates?.[todayStr] || false;
              const isOverdue = !isCompletedToday && task.date === todayStr && task.start && new Date(`${todayStr}T${task.start}`) < new Date();

              return (
                <div
                  key={task.id}
                  className={`group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border transition-all duration-200 hover:shadow-lg ${
                    isCompletedToday
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
                        onClick={() => toggleComplete(task.id, todayStr)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCompletedToday
                            ? 'bg-green-500 border-green-500 text-white shadow-md'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                        }`}
                      >
                        {isCompletedToday && <CheckCircle size={14} />}
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
                        isCompletedToday ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
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
                    {isOverdue && !isCompletedToday && (
                      <div className="mb-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle size={12} /> Overdue
                      </div>
                    )}
                    <div className="mt-auto flex justify-end">
                      {!isActiveTimer ? (
                        <button
                          onClick={() => startTimer(task)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm transition-all ${
                            task.date === todayStr
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={task.date !== todayStr}
                          title={task.date === todayStr ? 'Start' : 'Today only'}
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
                            onClick={pauseTimer}
                            className="p-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded hover:bg-yellow-200"
                            title={timerPaused ? 'Resume' : 'Pause'}
                          >
                            {timerPaused ? <Play size={14} /> : <Pause size={14} />}
                          </button>
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
            Total focus time this week: {Math.floor(totalTimeSpentWeek / 60)}h {totalTimeSpentWeek % 60}m
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;