import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import {
  Clock, Plus, Trash2, Edit2, Calendar, CheckCircle, XCircle,
  Copy, ChevronUp, ChevronDown, Undo, Redo,
  Download, Upload, Play, StopCircle, Timer,
  BookOpen, Briefcase, Heart, Dumbbell, Users, Home,
  Palette, Grid, List, Calendar as CalendarIcon, AlertCircle,
  Zap, DollarSign, Repeat, Save, Search, ArrowUpDown
} from 'lucide-react';

const STORAGE_KEY = 'advancedTimeBlocks';
const MAX_HISTORY = 50;

// ---------- Migrate old data ----------
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

// ==================== STATIC CONSTANTS (outside component) ====================
const COLORS = [
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-green-500', label: 'Green' },
  { value: 'bg-yellow-500', label: 'Yellow' },
  { value: 'bg-red-500', label: 'Red' },
  { value: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-pink-500', label: 'Pink' },
  { value: 'bg-indigo-500', label: 'Indigo' },
  { value: 'bg-teal-500', label: 'Teal' },
  { value: 'bg-orange-500', label: 'Orange' },
  { value: 'bg-cyan-500', label: 'Cyan' }
];

const CATEGORIES = [
  { id: 'work', label: 'Work', icon: Briefcase, color: 'bg-blue-100 text-blue-700' },
  { id: 'health', label: 'Health', icon: Heart, color: 'bg-red-100 text-red-700' },
  { id: 'learning', label: 'Learning', icon: BookOpen, color: 'bg-green-100 text-green-700' },
  { id: 'personal', label: 'Personal', icon: Home, color: 'bg-purple-100 text-purple-700' },
  { id: 'social', label: 'Social', icon: Users, color: 'bg-pink-100 text-pink-700' },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'bg-orange-100 text-orange-700' },
  { id: 'creative', label: 'Creative', icon: Palette, color: 'bg-cyan-100 text-cyan-700' },
  { id: 'finance', label: 'Finance', icon: DollarSign, color: 'bg-emerald-100 text-emerald-700' }
];

const PRIORITIES = [
  { id: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800', icon: ChevronDown },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: ChevronUp },
  { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  { id: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', icon: Zap }
];

const DAYS = [
  { id: 'mon', label: 'Monday', short: 'Mon' },
  { id: 'tue', label: 'Tuesday', short: 'Tue' },
  { id: 'wed', label: 'Wednesday', short: 'Wed' },
  { id: 'thu', label: 'Thursday', short: 'Thu' },
  { id: 'fri', label: 'Friday', short: 'Fri' },
  { id: 'sat', label: 'Saturday', short: 'Sat' },
  { id: 'sun', label: 'Sunday', short: 'Sun' }
];

const NOTIFICATION_OPTIONS = [
  '5 minutes before',
  '10 minutes before',
  '15 minutes before',
  '30 minutes before',
  '1 hour before',
  'At start time'
];

const REPEAT_TYPES = [
  { id: 'none', label: 'No Repeat', icon: Clock },
  { id: 'daily', label: 'Daily', icon: Repeat },
  { id: 'weekly', label: 'Weekly', icon: Repeat },
  { id: 'monthly', label: 'Monthly', icon: Repeat },
  { id: 'custom', label: 'Custom (Days)', icon: Calendar }
];

// ==================== COMPONENT ====================
const TimeBlockManager = () => {
  // ---------- Get current day ----------
  const getCurrentDayAbbr = () => {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[new Date().getDay()];
  };
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // ==================== STATE ====================
  const [timeBlocks, setTimeBlocks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(block => migrateBlock({
          ...block,
          createdAt: block.createdAt ? new Date(block.createdAt) : new Date(),
          lastModified: block.lastModified ? new Date(block.lastModified) : new Date(),
          repeats: block.repeats || [],
          notifications: block.notifications || [],
          progress: block.progress || 0,
          scheduledDay: block.scheduledDay || null,
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
    date: getTodayDate(),
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [sortOrder, setSortOrder] = useState('asc');

  const [storageSize, setStorageSize] = useState(0);
  const [lastGenerationDate, setLastGenerationDate] = useState('');

  // ==================== HELPER FUNCTIONS (memoized) ====================
  const calculateDuration = useCallback((start, end) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return {
      total: duration,
      hours: Math.floor(duration / 60),
      minutes: duration % 60
    };
  }, []);

  const formatTime = useCallback((seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const isUpcoming = useCallback((block) => {
    const today = getTodayDate();
    if (block.date !== today) return false;
    const now = new Date();
    const [blockHour, blockMin] = block.start.split(':').map(Number);
    const blockTime = new Date();
    blockTime.setHours(blockHour, blockMin, 0, 0);
    return blockTime > now;
  }, []);

  // হিস্ট্রি সীমা সহ সংরক্ষণ
  const saveToHistory = useCallback((action, prevBlocks, newBlocks) => {
    const historyEntry = {
      id: Date.now(),
      action,
      timestamp: new Date().toISOString(),
      prevBlocks: [...prevBlocks],
      newBlocks: [...newBlocks]
    };
    setHistory(prev => {
      const updated = [...prev.slice(0, historyIndex + 1), historyEntry];
      if (updated.length > MAX_HISTORY) {
        return updated.slice(-MAX_HISTORY);
      }
      return updated;
    });
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const entry = history[historyIndex];
      setTimeBlocks(entry.prevBlocks);
      setHistoryIndex(prev => prev - 1);
      toast.success('Undo successful');
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const entry = history[historyIndex + 1];
      setTimeBlocks(entry.newBlocks);
      setHistoryIndex(prev => prev + 1);
      toast.success('Redo successful');
    }
  }, [history, historyIndex]);

  const getLocalStorageSize = useCallback(() => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key].length * 2);
      }
    }
    return total;
  }, []);

  const formatSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // উন্নত রিকারিং ব্লক জেনারেটর
  const generateRecurringBlocks = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    const dayIndexToId = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayDayAbbr = dayIndexToId[today.getDay()];

    setTimeBlocks(prev => {
      const masterBlocks = prev.filter(block => 
        block.repeatType !== 'none' && !block.templateId && !block.isTemplate
      );

      let newBlocks = [];
      let generatedCount = 0;

      masterBlocks.forEach(master => {
        if (master.repeatEndDate) {
          const endDate = new Date(master.repeatEndDate);
          endDate.setHours(0, 0, 0, 0);
          if (endDate < today) return;
        }

        const alreadyExists = prev.some(block => block.templateId === master.id && block.date === todayStr);
        if (alreadyExists) return;

        let shouldGenerate = false;

        if (master.repeatType === 'daily') {
          shouldGenerate = true;
        } else if (master.repeatType === 'weekly') {
          shouldGenerate = master.repeats && master.repeats.includes(todayDayAbbr);
        } else if (master.repeatType === 'monthly') {
          if (master.date) {
            const masterDate = new Date(master.date);
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            const targetDay = Math.min(masterDate.getDate(), lastDayOfMonth);
            shouldGenerate = today.getDate() === targetDay;
          }
        } else if (master.repeatType === 'custom') {
          shouldGenerate = master.repeats && master.repeats.includes(todayDayAbbr);
        }

        if (shouldGenerate) {
          const newBlock = {
            ...master,
            id: Date.now() + Math.random() * 10000,
            date: todayStr,
            repeats: [],
            repeatType: 'none',
            progress: 0,
            completedDates: {},
            createdAt: new Date(),
            lastModified: new Date(),
            templateId: master.id,
            scheduledDay: null
          };
          newBlocks.push(newBlock);
          generatedCount++;
        }
      });

      if (generatedCount > 0) {
        toast.success(`${generatedCount} today's recurring block(s) generated`);
      }
      setLastGenerationDate(todayStr);
      return [...prev, ...newBlocks];
    });
  }, []);

  // ক্লিনআপ (৯০ দিনের পুরোনো ব্লক মুছে ফেলা)
  const cleanupOldBlocks = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - 90);

    setTimeBlocks(prev => {
      const filtered = prev.filter(block => {
        if (!block.date) return true;
        const blockDate = new Date(block.date);
        blockDate.setHours(0, 0, 0, 0);
        return blockDate >= cutoffDate;
      });
      if (filtered.length !== prev.length) {
        toast.info(`Cleaned up old blocks (${prev.length - filtered.length} removed)`);
        return filtered;
      }
      return prev;
    });
  }, []);

  // পরিসংখ্যান গণনা
  const computeStats = useCallback(() => {
    const today = getTodayDate();
    const newStats = {
      total: timeBlocks.length,
      completed: timeBlocks.filter(b => b.completedDates?.[today]).length,
      upcoming: timeBlocks.filter(b => !b.completedDates?.[today] && isUpcoming(b)).length,
      totalHours: timeBlocks.reduce((total, block) => total + calculateDuration(block.start, block.end).hours, 0),
      byCategory: {},
      byPriority: {}
    };

    CATEGORIES.forEach(cat => {
      newStats.byCategory[cat.id] = timeBlocks.filter(b => b.category === cat.id).length;
    });

    PRIORITIES.forEach(pri => {
      newStats.byPriority[pri.id] = timeBlocks.filter(b => b.priority === pri.id).length;
    });

    setStats(newStats);
  }, [timeBlocks, isUpcoming, calculateDuration]); // CATEGORIES and PRIORITIES are now stable outside

  // ---------- ইফেক্ট ----------
  useEffect(() => {
    cleanupOldBlocks();
  }, [cleanupOldBlocks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timeBlocks));
    computeStats();
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: JSON.stringify(timeBlocks) }));
  }, [timeBlocks, computeStats]);

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

  useEffect(() => {
    const updateStorageSize = () => {
      setStorageSize(getLocalStorageSize());
    };
    updateStorageSize();
    const interval = setInterval(updateStorageSize, 5000);
    return () => clearInterval(interval);
  }, [timeBlocks, getLocalStorageSize]);

  useEffect(() => {
    if (storageSize > 4.5 * 1024 * 1024) {
      toast.warning('localStorage is almost full. Please delete old data or export and clear.');
    }
  }, [storageSize]);

  useEffect(() => {
    const checkNewDayAndGenerate = () => {
      const todayStr = getTodayDate();
      if (lastGenerationDate !== todayStr) {
        generateRecurringBlocks();
      }
    };
    checkNewDayAndGenerate();
    const interval = setInterval(checkNewDayAndGenerate, 60000);
    return () => clearInterval(interval);
  }, [lastGenerationDate, generateRecurringBlocks]);

  // ---------- ক্রিয়েট/আপডেট/ডিলিট ফাংশন ----------
  const addTimeBlock = useCallback((e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const prevBlocks = [...timeBlocks];
    const newBlockId = Date.now();

    let blockDate = null;
    if (formData.repeatType === 'none') {
      blockDate = formData.date;
    } else {
      blockDate = null;
    }

    const newBlock = {
      id: newBlockId,
      ...formData,
      date: blockDate,
      completedDates: {},
      progress: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      dependencies: [],
      repeatType: formData.repeatType,
      repeatEndDate: formData.repeatEndDate,
      isTemplate: formData.isTemplate,
      templateId: null
    };

    let newBlocks = [...timeBlocks, newBlock];

    if (formData.isTemplate) {
      const template = { ...newBlock, isTemplate: true, id: newBlockId };
      setTemplates(prev => [...prev, template]);
    }

    setTimeBlocks(newBlocks);
    saveToHistory('add', prevBlocks, newBlocks);
    toast.success('Time block added successfully!');
    resetForm();
    setShowForm(false);
  }, [formData, timeBlocks, saveToHistory]);

  const updateTimeBlock = useCallback((e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const prevBlocks = [...timeBlocks];

    let blockDate = null;
    if (formData.repeatType === 'none') {
      blockDate = formData.date;
    } else {
      blockDate = null;
    }

    const newBlocks = timeBlocks.map(block =>
      block.id === editingId ? {
        ...block,
        ...formData,
        date: blockDate,
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
  }, [formData, editingId, timeBlocks, saveToHistory]);

  const deleteTimeBlock = useCallback((id) => {
    const prevBlocks = [...timeBlocks];
    const newBlocks = timeBlocks.filter(block => block.id !== id);
    setTimeBlocks(newBlocks);
    saveToHistory('delete', prevBlocks, newBlocks);
    toast.success('Time block deleted');
    setShowDeleteConfirm(null);
    setSelectedBlocks(prev => prev.filter(blockId => blockId !== id));
  }, [timeBlocks, saveToHistory]);

  const deleteSelectedBlocks = useCallback(() => {
    if (selectedBlocks.length === 0) return;
    if (window.confirm(`Delete ${selectedBlocks.length} selected time blocks?`)) {
      const prevBlocks = [...timeBlocks];
      const newBlocks = timeBlocks.filter(block => !selectedBlocks.includes(block.id));
      setTimeBlocks(newBlocks);
      saveToHistory('bulk_delete', prevBlocks, newBlocks);
      toast.success(`${selectedBlocks.length} time blocks deleted`);
      setSelectedBlocks([]);
    }
  }, [selectedBlocks, timeBlocks, saveToHistory]);

  const duplicateBlock = useCallback((block) => {
    const prevBlocks = [...timeBlocks];
    const duplicated = {
      ...block,
      id: Date.now(),
      title: `${block.title} (Copy)`,
      createdAt: new Date(),
      lastModified: new Date(),
      completedDates: {},
      progress: 0,
      templateId: null
    };

    const newBlocks = [...timeBlocks, duplicated];
    setTimeBlocks(newBlocks);
    saveToHistory('duplicate', prevBlocks, newBlocks);
    toast.success('Time block duplicated');
  }, [timeBlocks, saveToHistory]);

  const toggleComplete = useCallback((id, date = getTodayDate()) => {
    const prevBlocks = [...timeBlocks];
    const newBlocks = timeBlocks.map(block => {
      if (block.id !== id) return block;
      const completedDates = { ...(block.completedDates || {}) };
      if (completedDates[date]) {
        delete completedDates[date];
      } else {
        completedDates[date] = true;
      }
      return {
        ...block,
        completedDates,
        lastModified: new Date()
      };
    });

    setTimeBlocks(newBlocks);
    saveToHistory('toggle_complete', prevBlocks, newBlocks);
  }, [timeBlocks, saveToHistory]);

  const updateProgress = useCallback((id, progress) => {
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
  }, [timeBlocks, saveToHistory]);

  const startTimer = useCallback((block) => {
    const duration = calculateDuration(block.start, block.end);
    const totalSeconds = duration.total * 60;
    setActiveTimer(block.id);
    setTimerSeconds(totalSeconds);
    setTimer(true);
    toast.success(`Timer started for "${block.title}"`);
  }, [calculateDuration]);

  const stopTimer = useCallback(() => {
    setTimer(false);
    setActiveTimer(null);
    toast.info('Timer stopped');
  }, []);

  const resetForm = useCallback(() => {
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
      date: getTodayDate(),
      repeatType: 'none',
      repeatEndDate: '',
      isTemplate: false
    });
    setTagInput('');
  }, []);

  const startEditing = useCallback((block) => {
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
      date: block.date || getTodayDate(),
      repeatType: block.repeatType || 'none',
      repeatEndDate: block.repeatEndDate || '',
      isTemplate: block.isTemplate || false
    });
    setShowForm(true);
  }, []);

  const toggleSelectBlock = useCallback((id) => {
    setSelectedBlocks(prev =>
      prev.includes(id)
        ? prev.filter(blockId => blockId !== id)
        : [...prev, id]
    );
  }, []);

  // ✅ filteredBlocks (useMemo) – uses static CATEGORIES, PRIORITIES internally
  const filteredBlocks = useMemo(() => {
    let result = timeBlocks.filter(block => {
      // Day filter
      if (activeDay) {
        const dayIndexToId = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const isRecurring = block.repeats && block.repeats.includes(activeDay);
        const isDateMatch = block.date ? (() => {
          const blockDate = new Date(block.date);
          const dayAbbr = dayIndexToId[blockDate.getDay()];
          return dayAbbr === activeDay;
        })() : false;
        const isOneOff = block.scheduledDay === activeDay;
        if (!isRecurring && !isOneOff && !isDateMatch) return false;
      }

      // Status filter
      const statusDate = activeDay ? (block.date || activeDay) : getTodayDate();
      if (filterStatus === 'completed' && !block.completedDates?.[statusDate]) return false;
      if (filterStatus === 'incomplete' && block.completedDates?.[statusDate]) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = block.title.toLowerCase().includes(q);
        const tagMatch = block.tags?.some(tag => tag.toLowerCase().includes(q));
        if (!titleMatch && !tagMatch) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'title') {
        aVal = a.title;
        bVal = b.title;
      } else if (sortBy === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
        aVal = priorityOrder[a.priority] || 0;
        bVal = priorityOrder[b.priority] || 0;
      } else { // default time
        aVal = a.start;
        bVal = b.start;
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [timeBlocks, activeDay, filterStatus, searchQuery, sortBy, sortOrder]);

  // ✅ selectAllBlocks – uses filteredBlocks
  const selectAllBlocks = useCallback(() => {
    const currentBlocks = filteredBlocks;
    if (selectedBlocks.length === currentBlocks.length) {
      setSelectedBlocks([]);
    } else {
      setSelectedBlocks(currentBlocks.map(block => block.id));
    }
  }, [filteredBlocks, selectedBlocks]);

  // বাকি কলব্যাক
  const addTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  }, [tagInput, formData]);

  const removeTag = useCallback((tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  }, [formData]);

  const toggleRepeat = useCallback((day) => {
    const newRepeats = formData.repeats.includes(day)
      ? formData.repeats.filter(d => d !== day)
      : [...formData.repeats, day];
    setFormData({
      ...formData,
      repeats: newRepeats,
      scheduledDay: newRepeats.length > 0 ? null : formData.scheduledDay,
      date: newRepeats.length > 0 ? null : formData.date
    });
  }, [formData]);

  const toggleNotification = useCallback((notification) => {
    setFormData({
      ...formData,
      notifications: formData.notifications.includes(notification)
        ? formData.notifications.filter(n => n !== notification)
        : [...formData.notifications, notification]
    });
  }, [formData]);

  // ইম্পোর্ট (নতুন আইডি জেনারেট)
  const importData = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.timeBlocks) {
          const prevBlocks = [...timeBlocks];
          const importedBlocks = data.timeBlocks.map(block => {
            const migrated = migrateBlock(block);
            return {
              ...migrated,
              id: Date.now() + Math.random() * 10000,
              createdAt: migrated.createdAt ? new Date(migrated.createdAt) : new Date(),
              lastModified: migrated.lastModified ? new Date(migrated.lastModified) : new Date(),
              scheduledDay: migrated.scheduledDay || null,
              date: migrated.date || null,
              repeatType: migrated.repeatType || 'none',
              repeatEndDate: migrated.repeatEndDate || null,
              templateId: null
            };
          });
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
  }, [timeBlocks, saveToHistory]);

  const exportData = useCallback(() => {
    const data = {
      version: '3.0',
      exportDate: new Date().toISOString(),
      timeBlocks: timeBlocks,
      templates: templates,
      stats: stats
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-blocks-${getTodayDate()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  }, [timeBlocks, templates, stats]);

  const clearAllBlocks = useCallback(() => {
    if (window.confirm('Are you sure you want to delete ALL time blocks? This cannot be undone.')) {
      const prevBlocks = [...timeBlocks];
      setTimeBlocks([]);
      setSelectedBlocks([]);
      saveToHistory('clear_all', prevBlocks, []);
      toast.success('All time blocks cleared');
    }
  }, [timeBlocks, saveToHistory]);

  const loadTemplate = useCallback((template) => {
    setFormData({
      ...template,
      date: getTodayDate(),
      repeatType: 'none',
      repeatEndDate: '',
      isTemplate: false
    });
    setShowForm(true);
  }, []);

  const deleteTemplate = useCallback((templateId) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success('Template deleted');
  }, []);

  // ==================== JSX ====================
  const today = getTodayDate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">⏰ Time Block Manager</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {activeDay ? (
              <>Today's blocks: {filteredBlocks.length} • {stats.totalHours} total hours</>
            ) : (
              <>Plan your day with precision • {stats.total} blocks • {stats.totalHours} total hours</>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Storage: {formatSize(storageSize)} used
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {historyIndex >= 0 && (
            <button onClick={undo} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[44px] min-w-[44px]" aria-label="Undo">
              <Undo className="w-4 h-4" />
            </button>
          )}
          {historyIndex < history.length - 1 && (
            <button onClick={redo} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[44px] min-w-[44px]" aria-label="Redo">
              <Redo className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium min-h-[44px]"
          >
            <Save size={20} />
            <span className="hidden xs:inline">Templates</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium min-h-[44px]"
          >
            <Plus size={20} />
            <span className="hidden xs:inline">Add</span>
          </button>
          <button
            onClick={clearAllBlocks}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium min-h-[44px]"
          >
            <Trash2 size={16} />
            <span className="hidden xs:inline">Clear</span>
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium min-h-[44px]"
          >
            <Download size={16} />
            <span className="hidden xs:inline">Export</span>
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-medium cursor-pointer min-h-[44px]">
            <Upload size={16} />
            <span className="hidden xs:inline">Import</span>
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
                    <button onClick={() => deleteTemplate(template.id)} className="text-red-500 hover:text-red-700 p-2 min-h-[44px] min-w-[44px]" aria-label="Delete template">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{template.start} - {template.end}</p>
                  <div className="flex gap-2">
                    <button onClick={() => loadTemplate(template)} className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 min-h-[44px]">
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
              {DAYS.map(day => (
                <button
                  key={day.id}
                  onClick={() => setActiveDay(day.id)}
                  className={`px-3 py-2 rounded-lg min-h-[44px] ${
                    activeDay === day.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {day.short}
                </button>
              ))}
              <button
                onClick={() => setActiveDay(null)}
                className={`px-3 py-2 rounded-lg min-h-[44px] ${
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
                  className={`p-2 rounded min-h-[44px] min-w-[44px] ${activeView === view ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  aria-label={view}
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
                className={`p-2 rounded min-h-[44px] min-w-[44px] ${filterStatus === 'all' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                title="All tasks"
                aria-label="All tasks"
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`p-2 rounded min-h-[44px] min-w-[44px] ${filterStatus === 'completed' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                title="Completed only"
                aria-label="Completed only"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={() => setFilterStatus('incomplete')}
                className={`p-2 rounded min-h-[44px] min-w-[44px] ${filterStatus === 'incomplete' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                title="Incomplete only"
                aria-label="Incomplete only"
              >
                <Clock size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by title or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[44px]"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[44px]"
            >
              <option value="time">Sort by Time</option>
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg min-h-[44px] min-w-[44px]"
              aria-label="Toggle sort order"
            >
              <ArrowUpDown size={16} />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBlocks.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-600 dark:text-blue-300">{selectedBlocks.length}</span>
              </div>
              <span className="text-blue-700 dark:text-blue-300">
                {selectedBlocks.length} block{selectedBlocks.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={deleteSelectedBlocks} className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm min-h-[44px]">
                <Trash2 className="w-3 h-3 inline mr-1" /> Delete Selected
              </button>
              <button onClick={selectAllBlocks} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm min-h-[44px]">
                {selectedBlocks.length === filteredBlocks.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timer Display */}
      {timer && activeTimer && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-2">
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
            <button onClick={stopTimer} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium min-h-[44px]">
              Stop Timer
            </button>
          </div>
        </div>
      )}

      {/* Time Blocks Grid/List/Timeline */}
      {activeView === 'timeline' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">📅 Daily Schedule ({DAYS.find(d => d.id === activeDay)?.label || 'All Days'})</h3>
          <div className="space-y-2 min-w-[600px]">
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
                      const completionDate = block.date || activeDay;
                      return (
                        <div
                          key={block.id}
                          className={`absolute h-10 ${block.color} opacity-90 rounded px-2 flex items-center text-white text-sm cursor-pointer hover:opacity-100 hover:shadow-md transition-all`}
                          style={{ left: `${startPosition}%`, width: `${width}%`, zIndex: block.priority === 'high' ? 10 : 1 }}
                          title={`${block.title} (${block.start} - ${block.end})`}
                          onClick={() => startEditing(block)}
                        >
                          <div className="truncate font-medium">{block.title}</div>
                          {completionDate && block.completedDates?.[completionDate] && <CheckCircle className="ml-auto w-3 h-3 text-white" />}
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
                {activeDay ? `No blocks scheduled for ${DAYS.find(d => d.id === activeDay)?.label}` : 'Add your first time block to get started!'}
              </p>
            </div>
          ) : (
            filteredBlocks.map(block => {
              const duration = calculateDuration(block.start, block.end);
              const CategoryIcon = CATEGORIES.find(c => c.id === block.category)?.icon || Briefcase;
              const PriorityIcon = PRIORITIES.find(p => p.id === block.priority)?.icon || ChevronUp;
              const isSelected = selectedBlocks.includes(block.id);
              const isActiveTimer = activeTimer === block.id;
              const completionDate = activeDay || block.date || today;
              const isCompletedOnThisDay = block.completedDates?.[completionDate] || false;

              return (
                <div key={block.id} className={`bg-white dark:bg-gray-800 rounded-xl border ${isSelected ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-gray-200 dark:border-gray-700'} shadow-sm overflow-hidden relative group`}>
                  {block.progress > 0 && (
                    <div className="h-1 bg-gray-200 dark:bg-gray-700">
                      <div className={`h-full ${block.color}`} style={{ width: `${block.progress}%` }} />
                    </div>
                  )}
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelectBlock(block.id)} className="absolute top-3 right-3 w-5 h-5 text-blue-600 rounded" aria-label="Select block" />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {isCompletedOnThisDay ? <CheckCircle className="text-green-500" size={18} /> : <Clock className="text-gray-400" size={18} />}
                          <h3 className={`font-bold text-lg ${isCompletedOnThisDay ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {block.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2 flex-wrap">
                          <span className="flex items-center gap-1"><Clock size={14} /> {block.start} - {block.end} ({duration.hours}h {duration.minutes > 0 ? `${duration.minutes}m` : ''})</span>
                          <span className={`px-2 py-0.5 rounded ${block.color} bg-opacity-10 text-xs`}>
                            <CategoryIcon className="inline w-3 h-3 mr-1" />
                            {CATEGORIES.find(c => c.id === block.category)?.label}
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
                        {activeDay ? (
                          <button onClick={() => toggleComplete(block.id, completionDate)} className={`p-2 rounded min-h-[44px] min-w-[44px] ${isCompletedOnThisDay ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`} title={isCompletedOnThisDay ? "Mark incomplete" : "Mark complete"} aria-label={isCompletedOnThisDay ? "Mark incomplete" : "Mark complete"}>
                            {isCompletedOnThisDay ? <CheckCircle size={16} /> : <XCircle size={16} />}
                          </button>
                        ) : (
                          <span className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center" title="Select a day to mark completion">
                            <XCircle size={16} />
                          </span>
                        )}
                        {!isActiveTimer ? (
                          <button onClick={() => startTimer(block)} className="p-2 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 min-h-[44px] min-w-[44px]" title="Start timer" aria-label="Start timer">
                            <Play size={16} />
                          </button>
                        ) : (
                          <button onClick={stopTimer} className="p-2 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 min-h-[44px] min-w-[44px]" title="Stop timer" aria-label="Stop timer">
                            <StopCircle size={16} />
                          </button>
                        )}
                        <button onClick={() => startEditing(block)} className="p-2 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 min-h-[44px] min-w-[44px]" title="Edit" aria-label="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => duplicateBlock(block)} className="p-2 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 min-h-[44px] min-w-[44px]" title="Duplicate" aria-label="Duplicate">
                          <Copy size={16} />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(block.id)} className="p-2 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 min-h-[44px] min-w-[44px]" title="Delete" aria-label="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <PriorityIcon className="inline w-3 h-3 mr-1" />
                        {PRIORITIES.find(p => p.id === block.priority)?.label}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{block.progress}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={block.progress} onChange={(e) => updateProgress(block.id, parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" aria-label="Progress slider" />
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
                <button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg min-h-[44px] min-w-[44px]" aria-label="Close">
                  <XCircle size={20} />
                </button>
              </div>
              <form onSubmit={editingId ? updateTimeBlock : addTimeBlock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Block Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="What will you do in this block?" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[44px]" required autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <input type="time" value={formData.start} onChange={(e) => setFormData({...formData, start: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Time</label>
                    <input type="time" value={formData.end} onChange={(e) => setFormData({...formData, end: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[44px]" />
                  </div>
                </div>

                {/* Repeat Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Repeat Type</label>
                  <div className="flex flex-wrap gap-2">
                    {REPEAT_TYPES.map(type => {
                      const Icon = type.icon;
                      return (
                        <button
                          type="button"
                          key={type.id}
                          onClick={() => setFormData({...formData, repeatType: type.id})}
                          className={`px-3 py-2 rounded-lg flex items-center gap-1 min-h-[44px] ${
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

                {/* Repeat End Date */}
                {formData.repeatType !== 'none' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Repeat Until (optional)</label>
                    <input
                      type="date"
                      value={formData.repeatEndDate}
                      onChange={(e) => setFormData({...formData, repeatEndDate: e.target.value})}
                      min={getTodayDate()}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[44px]"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for indefinite repeating (auto-generates daily)</p>
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
                      min={getTodayDate()}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[44px]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map(color => (
                      <button type="button" key={color.value} onClick={() => setFormData({...formData, color: color.value})} className={`w-10 h-10 rounded-full ${color.value} ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`} title={color.label} aria-label={`Color ${color.label}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map(category => {
                      const Icon = category.icon;
                      return (
                        <button type="button" key={category.id} onClick={() => setFormData({...formData, category: category.id})} className={`p-2 rounded-lg border flex flex-col items-center min-h-[60px] ${formData.category === category.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                          <Icon className="w-4 h-4 mb-1" />
                          <span className="text-xs">{category.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRIORITIES.map(priority => {
                      const Icon = priority.icon;
                      return (
                        <button type="button" key={priority.id} onClick={() => setFormData({...formData, priority: priority.id})} className={`p-2 rounded-lg flex items-center justify-center ${priority.color} ${formData.priority === priority.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''} min-h-[44px]`}>
                          <Icon className="w-4 h-4 mr-1" />
                          <span className="text-xs">{priority.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Repeat On */}
                {(formData.repeatType === 'custom' || formData.repeatType === 'weekly') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Repeat On</label>
                    <div className="flex flex-wrap gap-1">
                      {DAYS.map(day => (
                        <button
                          type="button"
                          key={day.id}
                          onClick={() => toggleRepeat(day.id)}
                          className={`px-3 py-2 rounded-lg min-h-[44px] ${
                            formData.repeats.includes(day.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {day.short}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Notifications</label>
                  <div className="flex flex-wrap gap-1">
                    {NOTIFICATION_OPTIONS.map(option => (
                      <button type="button" key={option} onClick={() => toggleNotification(option)} className={`px-3 py-2 rounded-lg text-sm min-h-[44px] ${formData.notifications.includes(option) ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[44px]" placeholder="Add a tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                    <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 min-h-[44px] min-w-[44px]" aria-label="Add tag">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 min-h-[44px] min-w-[44px]" aria-label={`Remove tag ${tag}`}>
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

                {/* Save as template option */}
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
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[44px]">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium min-h-[44px]">
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
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[44px]">
                Cancel
              </button>
              <button onClick={() => deleteTimeBlock(showDeleteConfirm)} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium min-h-[44px]">
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