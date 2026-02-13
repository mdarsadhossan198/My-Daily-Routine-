import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, Target, Clock, Calendar, Award, TrendingDown,
  Download, ChevronDown, Brain, Heart, Zap,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  RefreshCw, Eye, EyeOff, CheckCircle, XCircle, AlertCircle,
  BookOpen, Server, Database, Cloud, Terminal, Layout
} from 'lucide-react';

const WeeklyReview = () => {
  // ---------- রিয়েল ডেটা লোড ----------
  const [activities, setActivities] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const activityLog = localStorage.getItem('activityLog');
        const blocks = localStorage.getItem('advancedTimeBlocks');
        setActivities(activityLog ? JSON.parse(activityLog) : []);
        setTimeBlocks(blocks ? JSON.parse(blocks) : []);
      } catch (e) {
        console.error('Error loading data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // ---------- লাস্ট ৭ দিন ----------
  const last7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  }, []);

  // ---------- ডেইলি স্ট্যাটস ----------
  const dailyStats = useMemo(() => {
    return last7Days.map(date => {
      const tasksOnDate = activities.filter(task => task.createdAt?.startsWith(date));
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
      const blocksOnDate = timeBlocks.filter(block => 
        (block.repeats?.includes(dayName)) || block.scheduledDay === dayName
      );
      const completedBlocks = blocksOnDate.filter(b => b.completed && b.completedDate === date).length;
      const totalTasks = tasksOnDate.length + blocksOnDate.length;
      const completedTasks = tasksOnDate.filter(t => t.completed).length + completedBlocks;
      const focusTime = tasksOnDate.reduce((sum, task) => {
        if (task.timer?.elapsed) return sum + (task.timer.elapsed / 3600);
        return sum;
      }, 0);
      const estimatedTime = blocksOnDate.reduce((sum, block) => {
        const start = block.start?.split(':').map(Number) || [9, 0];
        const end = block.end?.split(':').map(Number) || [10, 0];
        const duration = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
        return sum + (duration / 60);
      }, 0);
      return {
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tasks: totalTasks,
        completed: completedTasks,
        completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
        focusTime: Math.round(focusTime * 10) / 10,
        estimatedTime: Math.round(estimatedTime * 10) / 10,
        mood: 3 + Math.random() * 2,
        energy: 60 + Math.random() * 40
      };
    });
  }, [activities, timeBlocks, last7Days]);

  // ---------- ক্যাটাগরি ডিস্ট্রিবিউশন ----------
  const categoryData = useMemo(() => {
    const categoryMap = new Map();
    timeBlocks.forEach(block => {
      if (block.completed) {
        const cat = block.category || 'other';
        const start = block.start?.split(':').map(Number) || [9, 0];
        const end = block.end?.split(':').map(Number) || [10, 0];
        const duration = ((end[0] * 60 + end[1]) - (start[0] * 60 + start[1])) / 60;
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + duration);
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
    return categories.map(cat => ({
      ...cat,
      value: Math.round(categoryMap.get(cat.id) || 0)
    })).filter(c => c.value > 0);
  }, [timeBlocks]);

  // ---------- প্রায়োরিটি ডিস্ট্রিবিউশন ----------
  const priorityData = useMemo(() => {
    const priorityMap = new Map();
    timeBlocks.forEach(block => {
      if (block.completed) {
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

  // ---------- সাপ্তাহিক সামারি ----------
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

  // ---------- পার্সোনালাইজড ইনসাইট (রোডম্যাপ থেকে) ----------
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

  // ---------- গোল ----------
  const [goals, setGoals] = useState([
    { id: 1, name: 'Weekly Tasks', current: 0, target: 50, unit: 'tasks' },
    { id: 2, name: 'Focus Time', current: 0, target: 20, unit: 'hours' },
    { id: 3, name: 'Completion Rate', current: 0, target: 80, unit: '%' },
  ]);

  useEffect(() => {
    setGoals([
      { id: 1, name: 'Weekly Tasks', current: weeklyStats.totalCompleted, target: 50, unit: 'tasks' },
      { id: 2, name: 'Focus Time', current: weeklyStats.totalFocus, target: 20, unit: 'hours' },
      { id: 3, name: 'Completion Rate', current: weeklyStats.avgCompletion, target: 80, unit: '%' },
    ]);
  }, [weeklyStats]);

  // ---------- এক্সপোর্ট CSV ----------
  const exportData = () => {
    const csvContent = [
      ['Date', 'Tasks', 'Completed', 'Completion %', 'Focus Time (h)'].join(','),
      ...dailyStats.map(d => [d.displayDate, d.tasks, d.completed, d.completionRate, d.focusTime].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-review-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Weekly Review
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Week {Math.ceil(new Date().getDate() / 7)}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportData} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* সামারি কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Tasks Completed</p>
              <p className="text-3xl font-bold mt-1">{weeklyStats.totalCompleted}</p>
              <p className="text-xs opacity-80 mt-1">out of {weeklyStats.totalTasks}</p>
            </div>
            <CheckCircle size={32} className="opacity-80" />
          </div>
          <div className="mt-3 h-1.5 bg-white/30 rounded-full">
            <div className="h-full bg-white rounded-full" style={{ width: `${weeklyStats.avgCompletion}%` }} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Focus Time</p>
              <p className="text-3xl font-bold mt-1">{weeklyStats.totalFocus}h</p>
              <p className="text-xs opacity-80 mt-1">avg {(weeklyStats.totalFocus / 7).toFixed(1)}h/day</p>
            </div>
            <Clock size={32} className="opacity-80" />
          </div>
          <div className="mt-3 flex items-center gap-1">
            <Zap size={16} />
            <span className="text-sm">Best day: {weeklyStats.bestDay?.day || '-'}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Current Streak</p>
              <p className="text-3xl font-bold mt-1">{weeklyStats.streak}</p>
              <p className="text-xs opacity-80 mt-1">days</p>
            </div>
            <Award size={32} className="opacity-80" />
          </div>
          <div className="mt-3 flex items-center gap-1">
            <TrendingUp size={16} />
            <span className="text-sm">Keep it up!</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Completion Rate</p>
              <p className="text-3xl font-bold mt-1">{weeklyStats.avgCompletion}%</p>
              <p className="text-xs opacity-80 mt-1">+5% vs last week</p>
            </div>
            <Target size={32} className="opacity-80" />
          </div>
          <div className="mt-3 h-1.5 bg-white/30 rounded-full">
            <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(weeklyStats.avgCompletion, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* ডেইলি ট্রেন্ড চার্ট */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Daily Tasks
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', color: '#fff' }} labelStyle={{ color: '#9CA3AF' }} />
                <Legend />
                <Bar dataKey="tasks" fill="#3B82F6" name="Total Tasks" />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <LineChartIcon size={20} />
            Focus Time Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', color: '#fff' }} labelStyle={{ color: '#9CA3AF' }} />
                <Area type="monotone" dataKey="focusTime" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Focus Time (h)" />
                <Area type="monotone" dataKey="estimatedTime" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} name="Estimated Time (h)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ডিস্ট্রিবিউশন ও ইনসাইট */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChartIcon size={20} />
            Time by Category
          </h3>
          {categoryData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" label={(entry) => `${entry.name} ${entry.value}h`}>
                    {categoryData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} hours`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">No completed time blocks yet.</div>
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

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap size={20} />
            Priority Breakdown
          </h3>
          {priorityData.length > 0 ? (
            <div className="space-y-3">
              {priorityData.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">{p.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{p.value} tasks</span>
                  <span className="text-xs text-gray-500">{Math.round((p.value / weeklyStats.totalCompleted) * 100 || 0)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-500">No completed tasks.</div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Brain size={20} />
            Insights
          </h3>
          <div className="space-y-4">
            {insights.nextTopic && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <BookOpen size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Next to learn</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{insights.nextTopic.title}</p>
                    <p className="text-xs text-gray-500">{insights.nextTopic.section} • {insights.nextTopic.time}h</p>
                  </div>
                </div>
              </div>
            )}
            {insights.reviewTopics.length > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Review needed</p>
                    {insights.reviewTopics.map((topic, i) => (
                      <p key={i} className="text-xs text-gray-700 dark:text-gray-300 mt-1">• {topic.title} ({topic.daysAgo} days ago)</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {weeklyStats.streak > 0 && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Award size={16} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">{weeklyStats.streak} day streak! 🔥</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{weeklyStats.streak >= 5 ? 'Amazing consistency!' : 'Keep the momentum!'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* গোল ট্র্যাকার */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Target size={20} />
            Weekly Goals
          </h3>
          <span className="text-sm text-gray-500">Targets are adjustable</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map(goal => {
            const progress = Math.min(100, Math.round((goal.current / goal.target) * 100) || 0);
            return (
              <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{goal.name}</span>
                  <span className={`text-sm font-bold ${progress >= 100 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
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
    </div>
  );
};

export default WeeklyReview;