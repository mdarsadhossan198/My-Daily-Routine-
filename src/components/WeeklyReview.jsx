import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, Target, Clock, Calendar, Award,
  Download, Brain, Zap,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  RefreshCw, CheckCircle, AlertCircle,
  BookOpen, Edit2, Save, X, ListTodo
} from 'lucide-react';

// Helper: get local date string YYYY-MM-DD
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const WeeklyReview = () => {
  // ---------- State ----------
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [goalTargets, setGoalTargets] = useState(() => {
    const saved = localStorage.getItem('weeklyGoals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { tasks: 50, focus: 20, rate: 80 };
      }
    }
    return { tasks: 50, focus: 20, rate: 80 };
  });

  const loadData = useCallback(() => {
    try {
      const blocks = localStorage.getItem('advancedTimeBlocks');
      setTimeBlocks(blocks ? JSON.parse(blocks) : []);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadData();

    const handleStorage = (e) => {
      if (e.key === 'advancedTimeBlocks') {
        loadData();
      }
    };

    const handleTasksUpdated = () => loadData();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('tasksUpdated', handleTasksUpdated);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('tasksUpdated', handleTasksUpdated);
    };
  }, [loadData]);

  useEffect(() => {
    localStorage.setItem('weeklyGoals', JSON.stringify(goalTargets));
  }, [goalTargets]);

  const last7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(getLocalDateString(date));
    }
    return days;
  }, []);

  const dailyStats = useMemo(() => {
    return last7Days.map(date => {
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
      
      const blocksOnDate = timeBlocks.filter(block => {
        if (block.date === date) return true;
        if (block.repeats && block.repeats.includes(dayName)) return true;
        if (block.scheduledDay === dayName) return true;
        return false;
      });

      const completedBlocks = blocksOnDate.filter(b => b.completedDates?.[date]).length;
      const totalTasks = blocksOnDate.length;
      
      let focusTime = 0;
      blocksOnDate.forEach(block => {
        if (block.completedDates?.[date] && block.start && block.end) {
          const [sh, sm] = block.start.split(':').map(Number);
          const [eh, em] = block.end.split(':').map(Number);
          const duration = ((eh * 60 + em) - (sh * 60 + sm)) / 60;
          if (duration > 0) focusTime += duration;
        }
      });

      let estimatedTime = 0;
      blocksOnDate.forEach(block => {
        if (block.start && block.end) {
          const [sh, sm] = block.start.split(':').map(Number);
          const [eh, em] = block.end.split(':').map(Number);
          const duration = ((eh * 60 + em) - (sh * 60 + sm)) / 60;
          if (duration > 0) estimatedTime += duration;
        }
      });

      return {
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tasks: totalTasks,
        completed: completedBlocks,
        completionRate: totalTasks ? Math.round((completedBlocks / totalTasks) * 100) : 0,
        focusTime: Math.round(focusTime * 10) / 10,
        estimatedTime: Math.round(estimatedTime * 10) / 10,
        blocks: blocksOnDate
      };
    });
  }, [timeBlocks, last7Days]);

  const categoryData = useMemo(() => {
    const categoryMap = new Map();
    timeBlocks.forEach(block => {
      if (block.completedDates && Object.keys(block.completedDates).length > 0) {
        const cat = block.category || 'other';
        // Use the first completed date for duration calculation; for simplicity, we use the block's start/end.
        const start = block.start?.split(':').map(Number) || [9, 0];
        const end = block.end?.split(':').map(Number) || [10, 0];
        const duration = ((end[0] * 60 + end[1]) - (start[0] * 60 + start[1])) / 60;
        if (!categoryMap.has(cat)) {
          categoryMap.set(cat, { totalTime: 0, blocks: [] });
        }
        const entry = categoryMap.get(cat);
        entry.totalTime += duration;
        entry.blocks.push(block);
      }
    });
    const categories = [
      { id: 'work', name: 'Work', color: '#3B82F6', icon: '💼' },
      { id: 'health', name: 'Health', color: '#10B981', icon: '❤️' },
      { id: 'learning', name: 'Learning', color: '#8B5CF6', icon: '📚' },
      { id: 'personal', name: 'Personal', color: '#F59E0B', icon: '🏠' },
      { id: 'social', name: 'Social', color: '#EC4899', icon: '👥' },
      { id: 'fitness', name: 'Fitness', color: '#EF4444', icon: '💪' },
      { id: 'other', name: 'Other', color: '#6B7280', icon: '📌' }
    ];
    return categories.map(cat => {
      const data = categoryMap.get(cat.id);
      return {
        ...cat,
        value: data ? Math.round(data.totalTime) : 0,
        blocks: data ? data.blocks : []
      };
    }).filter(c => c.value > 0);
  }, [timeBlocks]);

  const priorityData = useMemo(() => {
    const priorityMap = new Map();
    timeBlocks.forEach(block => {
      if (block.completedDates && Object.keys(block.completedDates).length > 0) {
        const pri = block.priority || 'medium';
        priorityMap.set(pri, (priorityMap.get(pri) || 0) + 1);
      }
    });
    const priorities = [
      { id: 'critical', name: 'Critical', color: '#EF4444' },
      { id: 'high', name: 'High', color: '#F97316' },
      { id: 'medium', name: 'Medium', color: '#F59E0B' },
      { id: 'low', name: 'Low', color: '#10B981' }
    ];
    return priorities.map(p => ({
      name: p.name,
      value: priorityMap.get(p.id) || 0,
      color: p.color
    })).filter(p => p.value > 0);
  }, [timeBlocks]);

  const weeklyStats = useMemo(() => {
    const totalTasks = dailyStats.reduce((sum, d) => sum + d.tasks, 0);
    const totalCompleted = dailyStats.reduce((sum, d) => sum + d.completed, 0);
    const totalFocus = dailyStats.reduce((sum, d) => sum + d.focusTime, 0);
    const avgCompletion = totalTasks ? Math.round((totalCompleted / totalTasks) * 100) : 0;
    const bestDay = dailyStats.reduce((best, d) => d.completed > (best?.completed || 0) ? d : best, null);
    let streak = 0;
    const sorted = [...dailyStats].reverse();
    for (let day of sorted) {
      if (day.completed > 0) streak++;
      else break;
    }
    return {
      totalTasks,
      totalCompleted,
      totalFocus: Math.round(totalFocus * 10) / 10,
      avgCompletion,
      bestDay,
      streak
    };
  }, [dailyStats]);

  const insights = useMemo(() => {
    const roadmap = localStorage.getItem('webDevRoadmap');
    if (!roadmap) return { nextTopic: null, reviewTopics: [], message: 'Complete your roadmap setup!' };
    try {
      const sections = JSON.parse(roadmap);
      let nextTopic = null;
      let minTime = Infinity;
      sections.forEach(section => {
        section.topics?.forEach(topic => {
          if (!topic.completed && topic.time < minTime) {
            minTime = topic.time;
            nextTopic = { title: topic.title, section: section.title, time: topic.time };
          }
        });
      });
      const reviewTopics = [];
      const now = new Date();
      sections.forEach(section => {
        section.topics?.forEach(topic => {
          if (topic.completed && topic.completedAt) {
            const daysAgo = Math.floor((now - new Date(topic.completedAt)) / (1000 * 60 * 60 * 24));
            if (daysAgo >= 30) reviewTopics.push({ title: topic.title, section: section.title, daysAgo });
          }
        });
      });
      return { nextTopic, reviewTopics: reviewTopics.slice(0, 3), message: '' };
    } catch (e) {
      return { nextTopic: null, reviewTopics: [], message: 'Roadmap data error' };
    }
  }, []);

  const goals = useMemo(() => [
    { id: 1, name: 'Weekly Tasks', current: weeklyStats.totalCompleted, target: goalTargets.tasks, unit: 'tasks', key: 'tasks' },
    { id: 2, name: 'Focus Time', current: weeklyStats.totalFocus, target: goalTargets.focus, unit: 'hours', key: 'focus' },
    { id: 3, name: 'Completion Rate', current: weeklyStats.avgCompletion, target: goalTargets.rate, unit: '%', key: 'rate' },
  ], [weeklyStats, goalTargets]);

  const startEditGoal = (goal) => {
    setEditingGoalId(goal.id);
    setEditValue(goal.target.toString());
  };

  const saveGoalEdit = () => {
    if (editingGoalId === null) return;
    const newValue = parseFloat(editValue);
    if (isNaN(newValue) || newValue < 0) return;
    
    const goal = goals.find(g => g.id === editingGoalId);
    if (goal) {
      setGoalTargets(prev => ({
        ...prev,
        [goal.key]: newValue
      }));
    }
    setEditingGoalId(null);
  };

  const cancelGoalEdit = () => {
    setEditingGoalId(null);
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Tasks', 'Completed', 'Completion %', 'Focus Time (h)'].join(','),
      ...dailyStats.map(d => [d.displayDate, d.tasks, d.completed, d.completionRate, d.focusTime].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-review-${getLocalDateString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBarClick = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const dayData = data.activePayload[0].payload;
      setSelectedDay(dayData);
      setShowDayModal(true);
    }
  };

  const handlePieClick = (data) => {
    if (data && data.payload) {
      setSelectedCategory(data.payload);
      setShowCategoryModal(true);
    }
  };

  const DayDetailModal = ({ day, onClose }) => {
    if (!day) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {day.displayDate} ({day.day})
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg min-h-[44px] min-w-[44px]">
                <X size={20} />
              </button>
            </div>
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{day.tasks}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{day.completed}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rate</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{day.completionRate}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Focus</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{day.focusTime}h</p>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm sm:text-base">
              <ListTodo size={18} /> Tasks
            </h4>
            {day.blocks && day.blocks.length > 0 ? (
              <div className="space-y-2">
                {day.blocks.map(block => {
                  const isCompleted = block.completedDates?.[day.date];
                  return (
                    <div key={block.id} className={`p-3 rounded-lg border ${isCompleted ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        {isCompleted ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" /> : <Clock size={16} className="text-gray-400 flex-shrink-0" />}
                        <span className={`text-sm ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {block.title}
                        </span>
                      </div>
                      {block.start && block.end && (
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          {block.start} - {block.end}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8 text-sm">No tasks on this day.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CategoryDetailModal = ({ category, onClose }) => {
    if (!category) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>{category.icon}</span> {category.name}
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg min-h-[44px] min-w-[44px]">
                <X size={20} />
              </button>
            </div>
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Time Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{category.value} hours</p>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm sm:text-base">
              <ListTodo size={18} /> Completed Tasks
            </h4>
            {category.blocks && category.blocks.length > 0 ? (
              <div className="space-y-2">
                {category.blocks.map(block => {
                  const completedDate = block.completedDates ? Object.keys(block.completedDates)[0] : null;
                  return (
                    <div key={block.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-900 dark:text-white">{block.title}</span>
                      </div>
                      {completedDate && (
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          {new Date(completedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8 text-sm">No tasks in this category.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading || !mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-blue-600" size={24} />
            <span>Weekly Review</span>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Week {Math.ceil(new Date().getDate() / 7)}
          </p>
        </div>
        <button 
          onClick={exportData} 
          className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 sm:p-5 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs opacity-90">Tasks</p>
              <p className="text-xl sm:text-3xl font-bold mt-1">{weeklyStats.totalCompleted}</p>
              <p className="text-xs opacity-80 mt-1">of {weeklyStats.totalTasks}</p>
            </div>
            <CheckCircle size={24} className="opacity-80" />
          </div>
          <div className="mt-3 h-1.5 bg-white/30 rounded-full">
            <div className="h-full bg-white rounded-full" style={{ width: `${weeklyStats.avgCompletion}%` }} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 sm:p-5 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs opacity-90">Focus</p>
              <p className="text-xl sm:text-3xl font-bold mt-1">{weeklyStats.totalFocus}h</p>
              <p className="text-xs opacity-80 mt-1">avg {(weeklyStats.totalFocus / 7).toFixed(1)}h/d</p>
            </div>
            <Clock size={24} className="opacity-80" />
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <Zap size={12} />
            <span>Best: {weeklyStats.bestDay?.day || '-'}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 sm:p-5 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs opacity-90">Streak</p>
              <p className="text-xl sm:text-3xl font-bold mt-1">{weeklyStats.streak}</p>
              <p className="text-xs opacity-80 mt-1">days</p>
            </div>
            <Award size={24} className="opacity-80" />
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <TrendingUp size={12} />
            <span>Keep it up!</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-3 sm:p-5 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs opacity-90">Rate</p>
              <p className="text-xl sm:text-3xl font-bold mt-1">{weeklyStats.avgCompletion}%</p>
              <p className="text-xs opacity-80 mt-1">+5% vs last</p>
            </div>
            <Target size={24} className="opacity-80" />
          </div>
          <div className="mt-3 h-1.5 bg-white/30 rounded-full">
            <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(weeklyStats.avgCompletion, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Daily Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 size={18} />
            Daily Tasks
          </h3>
          <div className="h-60 sm:h-72">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyStats} onClick={handleBarClick}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', color: '#fff', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="tasks" fill="#3B82F6" name="Total" cursor="pointer" />
                  <Bar dataKey="completed" fill="#10B981" name="Done" cursor="pointer" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <LineChartIcon size={18} />
            Focus Time
          </h3>
          <div className="h-60 sm:h-72">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="focusTime" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Focus (h)" />
                  <Area type="monotone" dataKey="estimatedTime" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} name="Estimated (h)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Distribution & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChartIcon size={18} />
            Time by Category
          </h3>
          {categoryData.length > 0 ? (
            <div className="h-56 sm:h-64">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={categoryData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={40} 
                      outerRadius={60} 
                      paddingAngle={2} 
                      dataKey="value" 
                      label={(entry) => `${entry.name} ${entry.value}h`}
                      onClick={handlePieClick}
                      cursor="pointer"
                      labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                    >
                      {categoryData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} hours`} contentStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-sm text-gray-500">No completed tasks yet.</div>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {categoryData.slice(0, 5).map(cat => (
              <div key={cat.id} className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                <span>{cat.icon}</span>
                <span className="font-medium">{cat.name}</span>
                <span className="text-gray-600 dark:text-gray-400">{cat.value}h</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap size={18} />
            Priority Breakdown
          </h3>
          {priorityData.length > 0 ? (
            <div className="space-y-3">
              {priorityData.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="flex-1 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{p.name}</span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{p.value}</span>
                  <span className="text-xs text-gray-500">{Math.round((p.value / weeklyStats.totalCompleted) * 100 || 0)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-sm text-gray-500">No completed tasks.</div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Brain size={18} />
            Insights
          </h3>
          <div className="space-y-4">
            {insights.nextTopic && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <BookOpen size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-300">Next to learn</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{insights.nextTopic.title}</p>
                    <p className="text-xs text-gray-500">{insights.nextTopic.section} • {insights.nextTopic.time}h</p>
                  </div>
                </div>
              </div>
            )}
            {insights.reviewTopics.length > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-300">Review needed</p>
                    {insights.reviewTopics.map((topic, i) => (
                      <p key={i} className="text-xs text-gray-700 dark:text-gray-300 mt-1">• {topic.title} ({topic.daysAgo}d)</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {weeklyStats.streak > 0 && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Award size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-green-800 dark:text-green-300">{weeklyStats.streak} day streak! 🔥</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{weeklyStats.streak >= 5 ? 'Amazing!' : 'Keep going!'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goal Tracker */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Target size={18} />
            Weekly Goals
          </h3>
          <span className="text-xs text-gray-500">Click ✏️ to edit</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map(goal => {
            const progress = Math.min(100, Math.round((goal.current / goal.target) * 100) || 0);
            const isEditing = editingGoalId === goal.id;
            return (
              <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                  <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{goal.name}</span>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-16 sm:w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          min="1"
                          step={goal.unit === '%' ? '1' : '0.5'}
                          autoFocus
                        />
                        <button onClick={saveGoalEdit} className="text-green-600 hover:text-green-700 min-h-[44px] min-w-[44px]">
                          <Save size={16} />
                        </button>
                        <button onClick={cancelGoalEdit} className="text-red-600 hover:text-red-700 min-h-[44px] min-w-[44px]">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className={`text-xs sm:text-sm font-bold ${progress >= 100 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                        <button onClick={() => startEditGoal(goal)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 min-h-[44px] min-w-[44px]">
                          <Edit2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0</span>
                  <span>{progress}%</span>
                  <span>{goal.target}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {showDayModal && <DayDetailModal day={selectedDay} onClose={() => setShowDayModal(false)} />}
      {showCategoryModal && <CategoryDetailModal category={selectedCategory} onClose={() => setShowCategoryModal(false)} />}
    </div>
  );
};

export default WeeklyReview;