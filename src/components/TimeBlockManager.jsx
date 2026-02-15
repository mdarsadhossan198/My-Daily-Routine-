import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  Clock, Plus, Trash2, Edit2, Calendar, CheckCircle, XCircle,
  Copy, ChevronUp, ChevronDown, Undo, Redo,
  Download, Upload, Play, StopCircle, Timer,
  BookOpen, Briefcase, Heart, Dumbbell, Utensils, Users, Home,
  Palette, Grid, List, Calendar as CalendarIcon, AlertCircle,
  Zap, DollarSign, Repeat, Infinity, Save
} from 'lucide-react';

const TimeBlockManager = () => {
  // ---------- Get real current day ----------
  const getCurrentDayAbbr = () => {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[new Date().getDay()];
  };

  // ==================== CONSTANTS ====================
  const colors = [
    { value: 'bg-blue-500', label: 'Blue', hex: '#3b82f6' },
    { value: 'bg-green-500', label: 'Green', hex: '#10b981' },
    { value: 'bg-yellow-500', label: 'Yellow', hex: '#f59e0b' },
    { value: 'bg-red-500', label: 'Red', hex: '#ef4444' },
    { value: 'bg-purple-500', label: 'Purple', hex: '#8b5cf6' },
    { value: 'bg-pink-500', label: 'Pink', hex: '#ec4899' },
    { value: 'bg-indigo-500', label: 'Indigo', hex: '#6366f1' },
    { value: 'bg-teal-500', label: 'Teal', hex: '#14b8a6' },
    { value: 'bg-orange-500', label: 'Orange', hex: '#f97316' },
    { value: 'bg-cyan-500', label: 'Cyan', hex: '#06b6d4' }
  ];

  const categories = [
    { id: 'work', label: 'Work', icon: Briefcase, color: 'bg-blue-100 text-blue-700' },
    { id: 'health', label: 'Health', icon: Heart, color: 'bg-red-100 text-red-700' },
    { id: 'learning', label: 'Learning', icon: BookOpen, color: 'bg-green-100 text-green-700' },
    { id: 'personal', label: 'Personal', icon: Home, color: 'bg-purple-100 text-purple-700' },
    { id: 'social', label: 'Social', icon: Users, color: 'bg-pink-100 text-pink-700' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'bg-orange-100 text-orange-700' },
    { id: 'creative', label: 'Creative', icon: Palette, color: 'bg-cyan-100 text-cyan-700' },
    { id: 'finance', label: 'Finance', icon: DollarSign, color: 'bg-emerald-100 text-emerald-700' }
  ];

  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800', icon: ChevronDown },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: ChevronUp },
    { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
    { id: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', icon: Zap }
  ];

  const days = [
    { id: 'mon', label: 'Monday', short: 'Mon' },
    { id: 'tue', label: 'Tuesday', short: 'Tue' },
    { id: 'wed', label: 'Wednesday', short: 'Wed' },
    { id: 'thu', label: 'Thursday', short: 'Thu' },
    { id: 'fri', label: 'Friday', short: 'Fri' },
    { id: 'sat', label: 'Saturday', short: 'Sat' },
    { id: 'sun', label: 'Sunday', short: 'Sun' }
  ];

  const notificationOptions = [
    '5 minutes before',
    '10 minutes before',
    '15 minutes before',
    '30 minutes before',
    '1 hour before',
    'At start time'
  ];

  const repeatTypes = [
    { id: 'none', label: 'No Repeat', icon: Clock },
    { id: 'daily', label: 'Daily', icon: Repeat },
    { id: 'weekly', label: 'Weekly', icon: Repeat },
    { id: 'monthly', label: 'Monthly', icon: Repeat },
    { id: 'custom', label: 'Custom (Days)', icon: Calendar }
  ];

  // ==================== STATE ====================
  const [timeBlocks, setTimeBlocks] = useState(() => {
    try {
      const saved = localStorage.getItem('advancedTimeBlocks');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(block => ({
          ...block,
          createdAt: block.createdAt ? new Date(block.createdAt) : new Date(),
          lastModified: block.lastModified ? new Date(block.lastModified) : new Date(),
          repeats: block.repeats || [],
          notifications: block.notifications || [],
          dependencies: block.dependencies || [],
          progress: block.progress || 0,
          completed: block.completed || false,
          scheduledDay: block.scheduledDay || null,
          completedDate: block.completedDate || null,
          date: block.date || null,
          repeatType: block.repeatType || 'none',
          repeatEndDate: block.repeatEndDate || null,
          isTemplate: block.isTemplate || false,
          templateId: block.templateId || null
        }));
      }
    } catch (error) {
      console.error('Error loading time blocks:', error);
    }
    return [];
  });

  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('timeBlockTemplates');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
    return [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    start: '09:00',
    end: '10:00',
    color: 'bg-blue-500',
    description: '',
    category: 'work',
    priority: 'medium',
    tags: [],
    repeats: [],
    notifications: [],
    scheduledDay: null,
    date: new Date().toISOString().split('T')[0],
    repeatType: 'none',
    repeatEndDate: '',
    isTemplate: false
  });
  const [tagInput, setTagInput] = useState('');
  const [activeView, setActiveView] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeDay, setActiveDay] = useState(getCurrentDayAbbr());
  const [timer, setTimer] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
    totalHours: 0,
    byCategory: {},
    byPriority: {}
  });

  // ==================== EFFECTS ====================
  useEffect(() => {
    localStorage.setItem('advancedTimeBlocks', JSON.stringify(timeBlocks));
    computeStats();
    generateRecurringBlocks();
  }, [timeBlocks]);

  useEffect(() => {
    localStorage.setItem('timeBlockTemplates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    let interval;
    if (timer && activeTimer) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            toast.success('Time block completed! 🎉');
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

  // ==================== RECURRING BLOCK GENERATOR ====================
  const generateRecurringBlocks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const recurringTemplates = timeBlocks.filter(block => 
      block.repeatType !== 'none' && !block.isTemplate
    );

    recurringTemplates.forEach(template => {
      // Check if we already have a block for tomorrow
      const hasTomorrowBlock = timeBlocks.some(block => 
        block.templateId === template.id && 
        block.date === tomorrow.toISOString().split('T')[0]
      );

      if (!hasTomorrowBlock && template.repeatType !== 'none') {
        // Create new block for tomorrow
        const newBlock = {
          ...template,
          id: Date.now() + Math.random(),
          date: tomorrow.toISOString().split('T')[0],
          completed: false,
          progress: 0,
          completedDate: null,
          createdAt: new Date(),
          lastModified: new Date(),
          templateId: template.id
        };
        setTimeBlocks(prev => [...prev, newBlock]);
      }
    });
  };

  // ==================== STATS ====================
  const computeStats = () => {
    const newStats = {
      total: timeBlocks.length,
      completed: timeBlocks.filter(b => b.completed).length,
      upcoming: timeBlocks.filter(b => !b.completed && isUpcoming(b)).length,
      totalHours: timeBlocks.reduce((total, block) => total + calculateDuration(block.start, block.end).hours, 0),
      byCategory: {},
      byPriority: {}
    };

    categories.forEach(cat => {
      newStats.byCategory[cat.id] = timeBlocks.filter(b => b.category === cat.id).length;
    });

    priorities.forEach(pri => {
      newStats.byPriority[pri.id] = timeBlocks.filter(b => b.priority === pri.id).length;
    });

    setStats(newStats);
  };

  // ==================== HELPER FUNCTIONS ====================
  const calculateDuration = (start, end) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return {
      total: duration,
      hours: Math.floor(duration / 60),
      minutes: duration % 60
    };
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isUpcoming = (block) => {
    const now = new Date();
    const [blockHour, blockMin] = block.start.split(':').map(Number);
    const blockTime = new Date();
    blockTime.setHours(blockHour, blockMin, 0, 0);
    return blockTime > now;
  };

  const saveToHistory = (action, prevBlocks, newBlocks) => {
    const historyEntry = {
      id: Date.now(),
      action,
      timestamp: new Date().toISOString(),
      prevBlocks: [...prevBlocks],
      newBlocks: [...newBlocks]
    };
    setHistory(prev => [...prev.slice(0, historyIndex + 1), historyEntry]);
    setHistoryIndex(prev => prev + 1);
  };

  const undo = () => {
    if (historyIndex >= 0) {
      const entry = history[historyIndex];
      setTimeBlocks(entry.prevBlocks);
      setHistoryIndex(prev => prev - 1);
      toast.success('Undo successful');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const entry = history[historyIndex + 1];
      setTimeBlocks(entry.newBlocks);
      setHistoryIndex(prev => prev + 1);
      toast.success('Redo successful');
    }
  };

  // ==================== CRUD ====================
  const addTimeBlock = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const prevBlocks = [...timeBlocks];
    const newBlockId = Date.now();
    const newBlock = {
      id: newBlockId,
      ...formData,
      completed: false,
      progress: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      dependencies: [],
      scheduledDay: formData.repeats.length === 0 ? null : (activeDay || getCurrentDayAbbr()),
      completedDate: null,
      date: formData.repeats.length === 0 ? formData.date : null,
      repeatType: formData.repeatType,
      repeatEndDate: formData.repeatEndDate,
      isTemplate: formData.isTemplate,
      templateId: null
    };

    let newBlocks = [...timeBlocks, newBlock];

    // If this is a template, add to templates list
    if (formData.isTemplate) {
      const template = { ...newBlock, isTemplate: true, id: newBlockId };
      setTemplates(prev => [...prev, template]);
    }

    setTimeBlocks(newBlocks);
    saveToHistory('add', prevBlocks, newBlocks);
    toast.success('Time block added successfully!');
    resetForm();
    setShowForm(false);
  };

  const saveAsTemplate = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const template = {
      ...formData,
      id: Date.now(),
      isTemplate: true,
      repeatType: 'none',
      repeatEndDate: null,
      date: null
    };

    setTemplates(prev => [...prev, template]);
    toast.success('Template saved successfully!');
    resetForm();
    setShowForm(false);
  };

  const loadTemplate = (template) => {
    setFormData({
      ...template,
      date: new Date().toISOString().split('T')[0],
      repeatType: 'none',
      repeatEndDate: '',
      isTemplate: false
    });
    setShowForm(true);
  };

  const deleteTemplate = (templateId) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success('Template deleted');
  };

  const updateTimeBlock = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const prevBlocks = [...timeBlocks];
    const newBlocks = timeBlocks.map(block =>
      block.id === editingId ? {
        ...block,
        ...formData,
        scheduledDay: formData.repeats.length === 0 ? null : (block.scheduledDay || activeDay || getCurrentDayAbbr()),
        date: formData.repeats.length === 0 ? formData.date : null,
        repeatType: formData.repeatType,
        repeatEndDate: formData.repeatEndDate,
        isTemplate: formData.isTemplate,
        lastModified: new Date()
      } : block
    );

    setTimeBlocks(newBlocks);
    saveToHistory('update', prevBlocks, newBlocks);
    toast.success('Time block updated successfully!');
    resetForm();
    setEditingId(null);
    setShowForm(false);
  };

  const deleteTimeBlock = (id) => {
    const prevBlocks = [...timeBlocks];
    const newBlocks = timeBlocks.filter(block => block.id !== id);
    setTimeBlocks(newBlocks);
    saveToHistory('delete', prevBlocks, newBlocks);
    toast.success('Time block deleted');
    setShowDeleteConfirm(null);
    setSelectedBlocks(prev => prev.filter(blockId => blockId !== id));
  };

  const deleteSelectedBlocks = () => {
    if (selectedBlocks.length === 0) return;
    if (window.confirm(`Delete ${selectedBlocks.length} selected time blocks?`)) {
      const prevBlocks = [...timeBlocks];
      const newBlocks = timeBlocks.filter(block => !selectedBlocks.includes(block.id));
      setTimeBlocks(newBlocks);
      saveToHistory('bulk_delete', prevBlocks, newBlocks);
      toast.success(`${selectedBlocks.length} time blocks deleted`);
      setSelectedBlocks([]);
    }
  };

  const duplicateBlock = (block) => {
    const prevBlocks = [...timeBlocks];
    const duplicated = {
      ...block,
      id: Date.now(),
      title: `${block.title} (Copy)`,
      createdAt: new Date(),
      lastModified: new Date(),
      completed: false,
      progress: 0,
      completedDate: null,
      templateId: null
    };

    const newBlocks = [...timeBlocks, duplicated];
    setTimeBlocks(newBlocks);
    saveToHistory('duplicate', prevBlocks, newBlocks);
    toast.success('Time block duplicated');
  };

  const toggleComplete = (id) => {
    const prevBlocks = [...timeBlocks];
    const now = new Date().toISOString().split('T')[0];
    const newBlocks = timeBlocks.map(block =>
      block.id === id ? {
        ...block,
        completed: !block.completed,
        progress: block.completed ? 0 : 100,
        completedDate: block.completed ? null : now,
        lastModified: new Date()
      } : block
    );

    setTimeBlocks(newBlocks);
    saveToHistory('toggle_complete', prevBlocks, newBlocks);
  };

  const updateProgress = (id, progress) => {
    const prevBlocks = [...timeBlocks];
    const newBlocks = timeBlocks.map(block =>
      block.id === id ? {
        ...block,
        progress: Math.max(0, Math.min(100, progress)),
        lastModified: new Date()
      } : block
    );

    setTimeBlocks(newBlocks);
    saveToHistory('update_progress', prevBlocks, newBlocks);
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

  const resetForm = () => {
    setFormData({
      title: '',
      start: '09:00',
      end: '10:00',
      color: 'bg-blue-500',
      description: '',
      category: 'work',
      priority: 'medium',
      tags: [],
      repeats: [],
      notifications: [],
      scheduledDay: null,
      date: new Date().toISOString().split('T')[0],
      repeatType: 'none',
      repeatEndDate: '',
      isTemplate: false
    });
    setTagInput('');
  };

  const startEditing = (block) => {
    setEditingId(block.id);
    setFormData({
      title: block.title,
      start: block.start,
      end: block.end,
      color: block.color,
      description: block.description || '',
      category: block.category || 'work',
      priority: block.priority || 'medium',
      tags: block.tags || [],
      repeats: block.repeats || [],
      notifications: block.notifications || [],
      scheduledDay: block.scheduledDay || null,
      date: block.date || new Date().toISOString().split('T')[0],
      repeatType: block.repeatType || 'none',
      repeatEndDate: block.repeatEndDate || '',
      isTemplate: block.isTemplate || false
    });
    setShowForm(true);
  };

  const toggleSelectBlock = (id) => {
    setSelectedBlocks(prev =>
      prev.includes(id)
        ? prev.filter(blockId => blockId !== id)
        : [...prev, id]
    );
  };

  const selectAllBlocks = () => {
    const currentBlocks = filteredBlocks;
    if (selectedBlocks.length === currentBlocks.length) {
      setSelectedBlocks([]);
    } else {
      setSelectedBlocks(currentBlocks.map(block => block.id));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const toggleRepeat = (day) => {
    const newRepeats = formData.repeats.includes(day)
      ? formData.repeats.filter(d => d !== day)
      : [...formData.repeats, day];
    setFormData({
      ...formData,
      repeats: newRepeats,
      scheduledDay: newRepeats.length > 0 ? null : formData.scheduledDay,
      date: newRepeats.length > 0 ? null : formData.date
    });
  };

  const toggleNotification = (notification) => {
    setFormData({
      ...formData,
      notifications: formData.notifications.includes(notification)
        ? formData.notifications.filter(n => n !== notification)
        : [...formData.notifications, notification]
    });
  };

  // ==================== FILTERING ====================
  const filteredBlocks = timeBlocks.filter(block => {
    if (activeDay) {
      const isRecurring = block.repeats && block.repeats.includes(activeDay);
      const isDateMatch = block.date ? (() => {
        const blockDate = new Date(block.date);
        const dayAbbr = days[blockDate.getDay()]?.id;
        return dayAbbr === activeDay;
      })() : false;
      const isOneOff = block.scheduledDay === activeDay;
      if (!isRecurring && !isOneOff && !isDateMatch) return false;
    }
    if (filterStatus === 'completed' && !block.completed) return false;
    if (filterStatus === 'incomplete' && block.completed) return false;
    return true;
  });

  // ==================== EXPORT/IMPORT ====================
  const exportData = () => {
    const data = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      timeBlocks: timeBlocks,
      templates: templates,
      stats: stats
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-blocks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
          const prevBlocks = [...timeBlocks];
          const importedBlocks = data.timeBlocks.map(block => ({
            ...block,
            id: block.id || Date.now() + Math.random(),
            createdAt: block.createdAt ? new Date(block.createdAt) : new Date(),
            lastModified: block.lastModified ? new Date(block.lastModified) : new Date(),
            scheduledDay: block.scheduledDay || null,
            completedDate: block.completedDate || null,
            date: block.date || null,
            repeatType: block.repeatType || 'none',
            repeatEndDate: block.repeatEndDate || null
          }));
          const newBlocks = [...timeBlocks, ...importedBlocks];
          setTimeBlocks(newBlocks);
          saveToHistory('import', prevBlocks, newBlocks);
          toast.success(`Imported ${importedBlocks.length} time blocks`);
        }
        if (data.templates) {
          setTemplates(prev => [...prev, ...data.templates]);
        }
      } catch (error) {
        toast.error('Error importing file');
      }
    };
    reader.readAsText(file);
  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">⏰ Time Block Manager</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Plan your day with precision • {stats.total} blocks • {stats.totalHours} total hours
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {historyIndex >= 0 && (
            <button onClick={undo} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Undo className="w-4 h-4" />
            </button>
          )}
          {historyIndex < history.length - 1 && (
            <button onClick={redo} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Redo className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
          >
            <Save size={20} />
            Templates
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            <Plus size={20} />
            Add Time Block
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
          >
            <Download size={16} />
            Export
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-medium cursor-pointer">
            <Upload size={16} />
            Import
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-3">📋 Your Templates</h3>
          {templates.length === 0 ? (
            <p className="text-gray-500">No templates yet. Create one by checking "Save as template" when adding a block.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {templates.map(template => (
                <div key={template.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{template.title}</h4>
                    <button onClick={() => deleteTemplate(template.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{template.start} - {template.end}</p>
                  <div className="flex gap-2">
                    <button onClick={() => loadTemplate(template)} className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Blocks</div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.upcoming}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="text-yellow-600 dark:text-yellow-400" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalHours}h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Hours</div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Timer className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Day Selector */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-1">
              {days.map(day => (
                <button
                  key={day.id}
                  onClick={() => setActiveDay(day.id)}
                  className={`px-3 py-1.5 rounded-lg ${
                    activeDay === day.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {day.short}
                </button>
              ))}
              <button
                onClick={() => setActiveDay(null)}
                className={`px-3 py-1.5 rounded-lg ${
                  !activeDay ? 'bg-gray-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </button>
            </div>
          </div>
          {/* View Toggles & Filter */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['grid', 'list', 'timeline'].map(view => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-3 py-1.5 rounded ${activeView === view ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                >
                  {view === 'grid' && <Grid size={16} />}
                  {view === 'list' && <List size={16} />}
                  {view === 'timeline' && <CalendarIcon size={16} />}
                </button>
              ))}
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded ${filterStatus === 'all' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                title="All tasks"
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1.5 rounded ${filterStatus === 'completed' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                title="Completed only"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={() => setFilterStatus('incomplete')}
                className={`px-3 py-1.5 rounded ${filterStatus === 'incomplete' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                title="Incomplete only"
              >
                <Clock size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBlocks.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-600 dark:text-blue-300">{selectedBlocks.length}</span>
              </div>
              <span className="text-blue-700 dark:text-blue-300">
                {selectedBlocks.length} block{selectedBlocks.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={deleteSelectedBlocks} className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                <Trash2 className="w-3 h-3 inline mr-1" /> Delete Selected
              </button>
              <button onClick={selectAllBlocks} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                {selectedBlocks.length === filteredBlocks.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timer Display */}
      {timer && activeTimer && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Timer className="animate-pulse" />
                <span className="font-semibold">Live Timer</span>
              </div>
              <div className="text-3xl font-mono font-bold">{formatTime(timerSeconds)}</div>
              <div className="text-sm opacity-90">
                {timeBlocks.find(b => b.id === activeTimer)?.title}
              </div>
            </div>
            <button onClick={stopTimer} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium">
              Stop Timer
            </button>
          </div>
        </div>
      )}

      {/* Time Blocks Grid/List/Timeline */}
      {activeView === 'timeline' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">📅 Weekly Schedule</h3>
          <div className="space-y-2">
            {Array.from({ length: 16 }, (_, i) => {
              const hour = i + 6;
              const hourLabel = hour <= 12 ? `${hour} AM` : `${hour - 12} PM`;
              const blocksInHour = filteredBlocks.filter(block => {
                const blockStart = parseInt(block.start.split(':')[0]);
                const blockEnd = parseInt(block.end.split(':')[0]);
                return hour >= blockStart && hour < blockEnd;
              });
              return (
                <div key={hour} className="flex items-center group">
                  <div className="w-16 text-sm text-gray-500">{hourLabel}</div>
                  <div className="flex-1 h-12 border-t border-gray-200 dark:border-gray-700 relative">
                    {blocksInHour.map(block => {
                      const blockStartHour = parseInt(block.start.split(':')[0]);
                      const blockStartMin = parseInt(block.start.split(':')[1]);
                      const blockEndHour = parseInt(block.end.split(':')[0]);
                      const blockEndMin = parseInt(block.end.split(':')[1]);
                      const startPosition = ((hour - blockStartHour) * 60 + (0 - blockStartMin)) / 60 * 100;
                      const width = ((blockEndHour - blockStartHour) * 60 + (blockEndMin - blockStartMin)) / 60 * 100;
                      return (
                        <div
                          key={block.id}
                          className={`absolute h-10 ${block.color} opacity-90 rounded px-2 flex items-center text-white text-sm cursor-pointer hover:opacity-100 hover:shadow-md transition-all`}
                          style={{ left: `${startPosition}%`, width: `${width}%`, zIndex: block.priority === 'high' ? 10 : 1 }}
                          title={`${block.title} (${block.start} - ${block.end})`}
                          onClick={() => startEditing(block)}
                        >
                          <div className="truncate font-medium">{block.title}</div>
                          {block.completed && <CheckCircle className="ml-auto w-3 h-3 text-white" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={`${activeView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'} gap-4`}>
          {filteredBlocks.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow">
              <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No time blocks found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activeDay ? `No blocks scheduled for ${days.find(d => d.id === activeDay)?.label}` : 'Add your first time block to get started!'}
              </p>
            </div>
          ) : (
            filteredBlocks.map(block => {
              const duration = calculateDuration(block.start, block.end);
              const CategoryIcon = categories.find(c => c.id === block.category)?.icon || Briefcase;
              const PriorityIcon = priorities.find(p => p.id === block.priority)?.icon || ChevronUp;
              const isSelected = selectedBlocks.includes(block.id);
              const isActiveTimer = activeTimer === block.id;

              return (
                <div key={block.id} className={`bg-white dark:bg-gray-800 rounded-xl border ${isSelected ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-gray-200 dark:border-gray-700'} shadow-sm overflow-hidden relative group`}>
                  {block.progress > 0 && (
                    <div className="h-1 bg-gray-200 dark:bg-gray-700">
                      <div className={`h-full ${block.color}`} style={{ width: `${block.progress}%` }} />
                    </div>
                  )}
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelectBlock(block.id)} className="absolute top-3 right-3 w-5 h-5 text-blue-600 rounded" />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {block.completed ? <CheckCircle className="text-green-500" size={18} /> : <Clock className="text-gray-400" size={18} />}
                          <h3 className={`font-bold text-lg ${block.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {block.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2 flex-wrap">
                          <span className="flex items-center gap-1"><Clock size={14} /> {block.start} - {block.end} ({duration.hours}h {duration.minutes > 0 ? `${duration.minutes}m` : ''})</span>
                          <span className={`px-2 py-0.5 rounded ${block.color} bg-opacity-10 text-xs`}>
                            <CategoryIcon className="inline w-3 h-3 mr-1" />
                            {categories.find(c => c.id === block.category)?.label}
                          </span>
                          {block.date && (
                            <span className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              <Calendar size={12} /> {block.date}
                            </span>
                          )}
                          {block.repeatType !== 'none' && (
                            <span className="flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                              <Repeat size={12} /> {block.repeatType}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {block.description && <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{block.description}</p>}
                    {block.tags && block.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {block.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleComplete(block.id)} className={`p-1.5 rounded ${block.completed ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`} title={block.completed ? "Mark incomplete" : "Mark complete"}>
                          {block.completed ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        </button>
                        {!isActiveTimer ? (
                          <button onClick={() => startTimer(block)} className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" title="Start timer">
                            <Play size={16} />
                          </button>
                        ) : (
                          <button onClick={stopTimer} className="p-1.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" title="Stop timer">
                            <StopCircle size={16} />
                          </button>
                        )}
                        <button onClick={() => startEditing(block)} className="p-1.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => duplicateBlock(block)} className="p-1.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" title="Duplicate">
                          <Copy size={16} />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(block.id)} className="p-1.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <PriorityIcon className="inline w-3 h-3 mr-1" />
                        {priorities.find(p => p.id === block.priority)?.label}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{block.progress}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={block.progress} onChange={(e) => updateProgress(block.id, parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{editingId ? '✏️ Edit Time Block' : '➕ Add New Time Block'}</h3>
                <button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <XCircle size={20} />
                </button>
              </div>
              <form onSubmit={editingId ? updateTimeBlock : addTimeBlock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Block Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="What will you do in this block?" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" required autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <input type="time" value={formData.start} onChange={(e) => setFormData({...formData, start: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Time</label>
                    <input type="time" value={formData.end} onChange={(e) => setFormData({...formData, end: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  </div>
                </div>

                {/* Repeat Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Repeat Type</label>
                  <div className="flex flex-wrap gap-2">
                    {repeatTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <button
                          type="button"
                          key={type.id}
                          onClick={() => setFormData({...formData, repeatType: type.id})}
                          className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                            formData.repeatType === type.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <Icon size={14} />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Repeat End Date (if repeating) */}
                {formData.repeatType !== 'none' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Repeat Until (optional)</label>
                    <input
                      type="date"
                      value={formData.repeatEndDate}
                      onChange={(e) => setFormData({...formData, repeatEndDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for indefinite repeating</p>
                  </div>
                )}

                {/* Date for one-time blocks */}
                {formData.repeatType === 'none' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Date (for one‑time blocks)</label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(color => (
                      <button type="button" key={color.value} onClick={() => setFormData({...formData, color: color.value})} className={`w-8 h-8 rounded-full ${color.value} ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`} title={color.label} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {categories.map(category => {
                      const Icon = category.icon;
                      return (
                        <button type="button" key={category.id} onClick={() => setFormData({...formData, category: category.id})} className={`p-2 rounded-lg border flex flex-col items-center ${formData.category === category.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                          <Icon className="w-4 h-4 mb-1" />
                          <span className="text-xs">{category.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <div className="grid grid-cols-4 gap-2">
                    {priorities.map(priority => {
                      const Icon = priority.icon;
                      return (
                        <button type="button" key={priority.id} onClick={() => setFormData({...formData, priority: priority.id})} className={`p-2 rounded-lg flex items-center justify-center ${priority.color} ${formData.priority === priority.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}>
                          <Icon className="w-4 h-4 mr-1" />
                          <span className="text-xs">{priority.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Repeat On (for weekly custom)</label>
                  <div className="flex flex-wrap gap-1">
                    {days.map(day => (
                      <button type="button" key={day.id} onClick={() => toggleRepeat(day.id)} className={`px-3 py-1.5 rounded-lg ${formData.repeats.includes(day.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                        {day.short}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notifications</label>
                  <div className="flex flex-wrap gap-1">
                    {notificationOptions.map(option => (
                      <button type="button" key={option} onClick={() => toggleNotification(option)} className={`px-3 py-1.5 rounded-lg text-sm ${formData.notifications.includes(option) ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="Add a tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                    <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <XCircle className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Add details about this time block..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" rows="3" />
                </div>

                {/* Save as template option (for new blocks) */}
                {!editingId && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="saveAsTemplate"
                      checked={formData.isTemplate}
                      onChange={(e) => setFormData({...formData, isTemplate: e.target.checked})}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="saveAsTemplate" className="text-sm">Save as template for future use</label>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                    {editingId ? 'Update Block' : 'Add Time Block'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Delete Time Block</h3>
              <p className="text-gray-600 dark:text-gray-400">Are you sure you want to delete this time block? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={() => deleteTimeBlock(showDeleteConfirm)} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeBlockManager;