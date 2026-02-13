import React, { useState, useEffect } from 'react';
import {
  Calendar, CheckCircle, Clock, Filter, BarChart3, TrendingUp, Award, Target,
  ChevronDown, ChevronUp, AlertCircle, Zap, XCircle, Download,
  Briefcase, Heart, BookOpen, Dumbbell, Home, Palette, Users, DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const History = () => {
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState('30');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

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

  const getDateRangeArray = () => {
    const days = dateRange === 'all' ? 365 : parseInt(dateRange);
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

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

  const dailyStats = getDateRangeArray().map(date => {
    const tasks = getTasksForDate(date);
    const completed = tasks.filter(t => t.completedOnThisDate).length;
    const total = tasks.length;
    return { date, completed, total, tasks, rate: total === 0 ? 0 : Math.round((completed / total) * 100) };
  });

  const filteredDailyStats = dailyStats.map(day => ({
    ...day,
    tasks: day.tasks.filter(task => {
      if (filterCategory !== 'all' && task.category !== filterCategory) return false;
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
      return true;
    })
  })).filter(day => day.tasks.length > 0 || dateRange === 'all' ? true : day.total > 0);

  const totalCompleted = timeBlocks.filter(t => t.completed).length;
  const totalTasks = timeBlocks.length;
  const overallCompletionRate = totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);
  const streak = (() => {
    let currentStreak = 0;
    const sorted = [...dailyStats].reverse();
    for (let day of sorted) {
      if (day.completed > 0) currentStreak++;
      else break;
    }
    return currentStreak;
  })();
  const bestDay = dailyStats.reduce((best, day) => day.completed > (best?.completed || 0) ? day : best, null);

  const categories = [
    { id: 'all', label: 'All Categories', icon: Filter },
    { id: 'work', label: 'Work', icon: Briefcase, color: 'bg-blue-500' },
    { id: 'health', label: 'Health', icon: Heart, color: 'bg-red-500' },
    { id: 'learning', label: 'Learning', icon: BookOpen, color: 'bg-green-500' },
    { id: 'personal', label: 'Personal', icon: Home, color: 'bg-purple-500' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'bg-orange-500' },
    { id: 'creative', label: 'Creative', icon: Palette, color: 'bg-cyan-500' },
    { id: 'social', label: 'Social', icon: Users, color: 'bg-pink-500' },
    { id: 'finance', label: 'Finance', icon: DollarSign, color: 'bg-emerald-500' }
  ];

  const priorities = [
    { id: 'all', label: 'All Priorities', icon: Filter },
    { id: 'low', label: 'Low', icon: ChevronDown, color: 'bg-gray-500' },
    { id: 'medium', label: 'Medium', icon: ChevronUp, color: 'bg-yellow-500' },
    { id: 'high', label: 'High', icon: AlertCircle, color: 'bg-orange-500' },
    { id: 'critical', label: 'Critical', icon: Zap, color: 'bg-red-500' }
  ];

  const exportHistory = () => {
    const data = { exportDate: new Date().toISOString(), stats: { totalCompleted, totalTasks, overallCompletionRate, streak, bestDay }, history: dailyStats };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('History exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"><BarChart3 className="text-purple-500" /> Task History</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your productivity journey</p>
        </div>
        <button onClick={exportHistory} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium flex items-center gap-2 shadow-md"><Download size={16} /> Export History</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Total Tasks</p><p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTasks}</p></div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl"><Target className="text-blue-600" size={24} /></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Completed</p><p className="text-3xl font-bold text-green-600">{totalCompleted}</p></div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl"><CheckCircle className="text-green-600" size={24} /></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Completion Rate</p><p className="text-3xl font-bold text-purple-600">{overallCompletionRate}%</p></div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl"><TrendingUp className="text-purple-600" size={24} /></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Current Streak</p><p className="text-3xl font-bold text-orange-600">{streak} days</p></div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl"><Award className="text-orange-600" size={24} /></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
            <div className="flex gap-2">
              {['7', '30', '90', 'all'].map(range => (
                <button key={range} onClick={() => setDateRange(range)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${dateRange === range ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>
                  {range === 'all' ? 'All' : `${range}D`}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              {priorities.map(pri => <option key={pri.id} value={pri.id}>{pri.label}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`} title="Grid view"><Calendar size={20} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`} title="List view"><Clock size={20} /></button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-7 md:grid-cols-14 gap-2">
            {filteredDailyStats.map(day => {
              let bgColor = 'bg-gray-200 dark:bg-gray-600';
              if (day.rate === 100) bgColor = 'bg-green-500';
              else if (day.rate >= 50) bgColor = 'bg-yellow-500';
              else if (day.rate > 0) bgColor = 'bg-red-500';
              return (
                <div key={day.date} onClick={() => setSelectedDate(day.date)} className={`aspect-square rounded-lg ${bgColor} hover:scale-110 transition-transform cursor-pointer relative group`} title={`${day.date}\n✅ ${day.completed}/${day.total} tasks\n${day.rate}% completed`}>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg">{new Date(day.date).getDate()}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th></tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDailyStats.slice(0, 30).map(day => (
                <tr key={day.date} onClick={() => setSelectedDate(day.date)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.completed}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><span className="text-sm font-medium mr-2">{day.rate}%</span><div className="w-16 bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${day.rate === 100 ? 'bg-green-500' : day.rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${day.rate}%` }} /></div></div></td>
                  <td className="px-6 py-4 whitespace-nowrap">{day.rate === 100 ? <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Complete</span> : day.rate > 0 ? <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Partial</span> : <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">No tasks</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {bestDay && bestDay.completed > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500 rounded-full"><Award className="text-white" size={28} /></div>
            <div><h3 className="text-lg font-bold text-gray-900 dark:text-white">Best Day Ever! 🏆</h3><p className="text-gray-600 dark:text-gray-400">On {new Date(bestDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, you completed <span className="font-bold text-yellow-600">{bestDay.completed}</span> out of {bestDay.total} tasks ({bestDay.rate}%).</p></div>
          </div>
        </div>
      )}

      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2"><Calendar className="text-blue-500" /> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><XCircle size={24} /></button>
              </div>
              {(() => {
                const tasks = getTasksForDate(selectedDate);
                const filtered = tasks.filter(task => {
                  if (filterCategory !== 'all' && task.category !== filterCategory) return false;
                  if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
                  return true;
                });
                const completed = filtered.filter(t => t.completedOnThisDate).length;
                return (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-600 dark:text-gray-400">{completed} of {filtered.length} tasks completed</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${filtered.length === 0 ? 'bg-gray-100 text-gray-800' : completed === filtered.length ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {filtered.length === 0 ? 'No tasks' : completed === filtered.length ? 'All done!' : 'In progress'}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {filtered.length === 0 ? <div className="text-center py-8 text-gray-500"><Calendar size={48} className="mx-auto mb-4 opacity-30" /><p>No tasks scheduled for this day.</p></div> : filtered.map(task => {
                        const completedOnThisDay = task.completedOnThisDate;
                        const category = categories.find(c => c.id === task.category);
                        const priority = priorities.find(p => p.id === task.priority);
                        return (
                          <div key={task.id} className={`p-4 rounded-xl border ${completedOnThisDay ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'}`}>
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 ${completedOnThisDay ? 'text-green-600' : 'text-gray-400'}`}>{completedOnThisDay ? <CheckCircle size={20} /> : <Clock size={20} />}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className={`font-semibold ${completedOnThisDay ? 'line-through text-gray-500' : ''}`}>{task.title}</h4>
                                  {priority && priority.id !== 'all' && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.color} bg-opacity-20`}>{priority.label}</span>}
                                  {category && category.id !== 'all' && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${category.color} bg-opacity-20`}>{category.label}</span>}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1"><Clock size={12} /><span>{task.start} – {task.end}</span></div>
                                {task.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{task.description}</p>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
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