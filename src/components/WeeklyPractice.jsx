import React, { useState, useEffect } from 'react';
import {
  RotateCcw, Save, BookOpen, CheckCircle, Tag,
  Download, Upload, Eye, EyeOff, XCircle,
  Target, Bell, Search, History, Zap, Clock,
  Volume2, VolumeX,
  Plus, Trash2, ChevronDown, ChevronUp,
  Calendar, Palette, Type
} from 'lucide-react';

const WeeklyPractice = ({ language }) => {
  // Days of the week
  const dayNames = {
    en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    bn: ['সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার', 'রবিবার'],
  };

  // ----- State -----
  const [days, setDays] = useState(() => {
    const saved = localStorage.getItem('weeklyPracticeDays');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return Array(7).fill(null).map(() => ({
          topic: '', note: '', completed: false
        }));
      }
    }
    return Array(7).fill(null).map(() => ({
      topic: '', note: '', completed: false
    }));
  });

  // Deep background colors (quick swatches)
  const colorOptions = [
    '#6d2e46', // deep burgundy
    '#1e4b5e', // deep teal
    '#a3752b', // rich mustard
    '#5e3a6b', // deep purple
    '#3f5e4a', // dark olive
    '#3a5f6b', // slate blue
    '#964b4b', // muted red
    '#2d6a4f'  // forest green
  ];
  const getRandomColor = () => colorOptions[Math.floor(Math.random() * colorOptions.length)];

  const [multipleNotes, setMultipleNotes] = useState(() => {
    const saved = localStorage.getItem('weeklyPracticeMultipleNotes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    const oldPersonalNotes = localStorage.getItem('weeklyPracticePersonalNotes');
    if (oldPersonalNotes) {
      return [{
        id: Date.now().toString(),
        title: 'Personal Notes',
        topic: '',
        content: oldPersonalNotes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        color: getRandomColor(),
        textColor: '#ffffff', // default white
      }];
    }
    return [];
  });

  const [weeklyGoal, setWeeklyGoal] = useState(() => localStorage.getItem('weeklyPracticeGoal') || '');
  const [practiceMode, setPracticeMode] = useState(false);
  const [archive, setArchive] = useState(() => JSON.parse(localStorage.getItem('weeklyPracticeArchive') || '[]'));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('weeklyPracticeStreak') || '0'));

  // Timer
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSound, setTimerSound] = useState(true);
  const [customMinutes, setCustomMinutes] = useState(25);

  // Notes
  const [noteSearch, setNoteSearch] = useState('');
  const [expandedNotes, setExpandedNotes] = useState([]);

  // Notification permission
  const [notificationPerm, setNotificationPerm] = useState(Notification.permission);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('weeklyPracticeDays', JSON.stringify(days));
  }, [days]);
  useEffect(() => {
    localStorage.setItem('weeklyPracticeMultipleNotes', JSON.stringify(multipleNotes));
  }, [multipleNotes]);
  useEffect(() => {
    localStorage.setItem('weeklyPracticeGoal', weeklyGoal);
  }, [weeklyGoal]);
  useEffect(() => {
    localStorage.setItem('weeklyPracticeArchive', JSON.stringify(archive));
  }, [archive]);
  useEffect(() => {
    localStorage.setItem('weeklyPracticeStreak', streak.toString());
  }, [streak]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            setTimerActive(false);
            if (timerSound && notificationPerm === 'granted') {
              new Notification('Pomodoro Timer', {
                body: language === 'bn' ? 'সময় শেষ! বিরতি নিন।' : 'Time is up! Take a break.',
              });
            }
          } else {
            setTimerMinutes(prev => prev - 1);
            setTimerSeconds(59);
          }
        } else {
          setTimerSeconds(prev => prev - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerMinutes, timerSeconds, notificationPerm, language, timerSound]);

  const resetTimer = () => {
    setTimerActive(false);
    setTimerMinutes(customMinutes);
    setTimerSeconds(0);
  };

  const handleCustomMinutesChange = (e) => {
    const val = parseInt(e.target.value) || 1;
    setCustomMinutes(val);
    if (!timerActive) {
      setTimerMinutes(val);
      setTimerSeconds(0);
    }
  };

  // Day handlers
  const handleTopicChange = (index, value) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], topic: value };
    setDays(newDays);
  };

  const handleNoteChange = (index, value) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], note: value };
    setDays(newDays);
  };

  const toggleCompleted = (index) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], completed: !newDays[index].completed };
    setDays(newDays);
    updateStreak(newDays);
  };

  const updateStreak = (updatedDays) => {
    let streakCount = 0;
    for (let i = 0; i < 7; i++) {
      if (updatedDays[i].completed) streakCount++;
      else break;
    }
    setStreak(streakCount);
  };

  const clearDay = (index) => {
    if (window.confirm(language === 'bn' ? `দিন ${index + 1} এর ডাটা মুছবেন?` : `Clear data for day ${index + 1}?`)) {
      const newDays = [...days];
      newDays[index] = { topic: '', note: '', completed: false };
      setDays(newDays);
      updateStreak(newDays);
    }
  };

  const resetAll = () => {
    if (window.confirm(language === 'bn' ? 'সব টপিক ও নোট মুছে ফেলবেন?' : 'Clear all topics and notes?')) {
      setDays(Array(7).fill(null).map(() => ({ topic: '', note: '', completed: false })));
      setMultipleNotes([]);
      setWeeklyGoal('');
      setStreak(0);
    }
  };

  // Archive
  const archiveWeek = () => {
    if (window.confirm(language === 'bn' ? 'এই সপ্তাহ আর্কাইভ করে নতুন সপ্তাহ শুরু করবেন?' : 'Archive this week and start a new week?')) {
      const weekData = {
        weekStart: new Date().toISOString().split('T')[0],
        days,
        multipleNotes,
        weeklyGoal,
        streak,
      };
      setArchive([...archive, weekData]);
      setDays(Array(7).fill(null).map(() => ({ topic: '', note: '', completed: false })));
      setMultipleNotes([]);
      setWeeklyGoal('');
      setStreak(0);
    }
  };

  const loadArchiveWeek = (index) => {
    if (window.confirm(language === 'bn' ? 'এই সপ্তাহ লোড করলে বর্তমান ডাটা মুছে যাবে। চালিয়ে যাবেন?' : 'Loading this week will overwrite current data. Continue?')) {
      const week = archive[index];
      setDays(week.days);
      setMultipleNotes(week.multipleNotes || []);
      setWeeklyGoal(week.weeklyGoal || '');
      setStreak(week.streak || 0);
    }
  };

  // Export / Import
  const exportData = () => {
    const data = { version: '5.0', exportDate: new Date().toISOString(), days, multipleNotes, weeklyGoal, archive, streak };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-practice-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.days && Array.isArray(data.days) && data.days.length === 7) {
          const importedDays = data.days.map(day => ({
            topic: day.topic || '',
            note: day.note || '',
            completed: day.completed || false,
          }));
          setDays(importedDays);
          setMultipleNotes(data.multipleNotes || []);
          setWeeklyGoal(data.weeklyGoal || '');
          setArchive(data.archive || []);
          setStreak(data.streak || 0);
          alert(language === 'bn' ? 'ইম্পোর্ট সফল!' : 'Import successful!');
        } else {
          alert(language === 'bn' ? 'ভুল ফাইল ফরম্যাট' : 'Invalid file format');
        }
      } catch {
        alert(language === 'bn' ? 'ফাইল পড়া যায়নি' : 'Could not read file');
      }
    };
    reader.readAsText(file);
  };

  // Notes handlers
  const addNote = () => {
    const newNote = {
      id: Date.now().toString() + Math.random(),
      title: language === 'bn' ? 'নতুন নোট' : 'New Note',
      topic: '',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: getRandomColor(),
      textColor: '#ffffff',
    };
    setMultipleNotes([...multipleNotes, newNote]);
    setExpandedNotes([...expandedNotes, newNote.id]);
  };

  const updateNote = (id, field, value) => {
    setMultipleNotes(multipleNotes.map(note => note.id === id ? { ...note, [field]: value, updatedAt: new Date().toISOString() } : note));
  };

  const deleteNote = (id) => {
    if (window.confirm(language === 'bn' ? 'নোটটি মুছবেন?' : 'Delete this note?')) {
      setMultipleNotes(multipleNotes.filter(n => n.id !== id));
      setExpandedNotes(expandedNotes.filter(eid => eid !== id));
    }
  };

  const toggleNoteExpand = (id) => {
    setExpandedNotes(prev => prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]);
  };

  const filteredNotes = multipleNotes
    .filter(note => 
      note.title.toLowerCase().includes(noteSearch.toLowerCase()) || 
      note.topic.toLowerCase().includes(noteSearch.toLowerCase()) ||
      note.content.toLowerCase().includes(noteSearch.toLowerCase())
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  // Stats
  const stats = {
    totalDays: 7,
    completedDays: days.filter(d => d.completed).length,
    totalTopics: days.filter(d => d.topic.trim() !== '').length,
    totalNotesLength: days.reduce((acc, d) => acc + d.note.length, 0),
  };

  const completionPercentage = (stats.completedDays / 7) * 100;
  const practiceDayIndex = 6;

  const quotes = [
    { en: "Small progress is still progress.", bn: "ছোট অগ্রগতিও অগ্রগতি।" },
    { en: "Consistency is key.", bn: "নিয়মিততাই চাবিকাঠি।" },
    { en: "You are doing great!", bn: "তুমি দারুণ করছো!" },
    { en: "One day at a time.", bn: "একদিন একদিন করে।" },
  ];
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-primary" size={28} />
            {language === 'bn' ? 'সাপ্তাহিক টপিক ও নোট' : 'Weekly Topics & Notes'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
            {language === 'bn' ? quote.bn : quote.en}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => alert(language === 'bn' ? 'রিমাইন্ডার ফিচার সরিয়ে দেওয়া হয়েছে' : 'Reminder feature removed')} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title={language === 'bn' ? 'সব রিমাইন্ডার সেট করুন' : 'Set all reminders'}><Bell size={20} /></button>
          <button onClick={() => setPracticeMode(!practiceMode)} className={`p-2 rounded-lg transition ${practiceMode ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`} title={language === 'bn' ? 'প্র্যাকটিস মোড' : 'Practice Mode'}>{practiceMode ? <Eye size={20} /> : <EyeOff size={20} />}</button>
          <button onClick={resetAll} className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title={language === 'bn' ? 'সব মুছুন' : 'Clear all'}><RotateCcw size={20} /></button>
        </div>
      </div>

      {/* Weekly Goal & Streak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2"><Target size={18} className="text-primary" /><span className="font-medium text-gray-700 dark:text-gray-300">{language === 'bn' ? 'সাপ্তাহিক লক্ষ্য' : 'Weekly Goal'}</span></div>
          <input type="text" value={weeklyGoal} onChange={(e) => setWeeklyGoal(e.target.value)} placeholder={language === 'bn' ? 'আপনার লক্ষ্য লিখুন...' : 'Enter your goal...'} className="w-full p-2 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary outline-none text-gray-800 dark:text-gray-200" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2"><Zap size={24} className="text-yellow-500" /><div><span className="text-sm text-gray-500 dark:text-gray-400">{language === 'bn' ? 'ধারাবাহিকতা' : 'Streak'}</span><div className="text-2xl font-bold text-gray-900 dark:text-white">{streak}</div></div></div>
          <div className="text-sm text-gray-500">{language === 'bn' ? 'দিন' : 'days'}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"><div className="text-xs text-gray-500 dark:text-gray-400">{language === 'bn' ? 'মোট' : 'Total'}</div><div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalDays}</div></div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"><div className="text-xs text-gray-500 dark:text-gray-400">{language === 'bn' ? 'সম্পন্ন' : 'Completed'}</div><div className="text-xl font-bold text-green-600">{stats.completedDays}</div></div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"><div className="text-xs text-gray-500 dark:text-gray-400">{language === 'bn' ? 'টপিক' : 'Topics'}</div><div className="text-xl font-bold text-blue-600">{stats.totalTopics}</div></div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"><div className="text-xs text-gray-500 dark:text-gray-400">{language === 'bn' ? 'অক্ষর' : 'Chars'}</div><div className="text-xl font-bold text-purple-600">{stats.totalNotesLength}</div></div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-600 dark:text-gray-400">{language === 'bn' ? 'সাপ্তাহিক অগ্রগতি' : 'Weekly Progress'}</span><span className="text-sm font-medium text-primary">{Math.round(completionPercentage)}%</span></div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div></div>
      </div>

      {/* Timer */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Clock size={18} className="text-primary" /><span className="font-medium text-gray-700 dark:text-gray-300">{language === 'bn' ? 'পোমোডোরো টাইমার' : 'Pomodoro Timer'}</span></div><button onClick={() => setTimerSound(!timerSound)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">{timerSound ? <Volume2 size={18} /> : <VolumeX size={18} />}</button></div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">{String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}</div>
          <div className="flex flex-wrap gap-2">
            <input type="number" min="1" max="120" value={customMinutes} onChange={handleCustomMinutesChange} className="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-800 dark:text-gray-200" disabled={timerActive} />
            <button onClick={() => setTimerActive(!timerActive)} className={`px-4 py-2 rounded-lg font-medium ${timerActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white transition`}>{timerActive ? (language === 'bn' ? 'বিরাম' : 'Pause') : (language === 'bn' ? 'শুরু' : 'Start')}</button>
            <button onClick={resetTimer} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">{language === 'bn' ? 'রিসেট' : 'Reset'}</button>
          </div>
        </div>
      </div>

      {/* Day Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden
              border-2 transition-all hover:shadow-lg flex flex-col
              ${index === practiceDayIndex
                ? 'border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                : 'border-gray-200 dark:border-gray-700'
              }
              ${day.completed ? 'opacity-75' : ''}
            `}
          >
            {/* Day Header */}
            <div className={`
              px-4 py-2 font-medium flex items-center justify-between
              ${index === practiceDayIndex
                ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }
            `}>
              <span className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={day.completed}
                  onChange={() => toggleCompleted(index)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                {index + 1}. {dayNames[language][index]}
                {index === practiceDayIndex && (
                  <span className="text-xs bg-yellow-200 dark:bg-yellow-800 px-2 py-0.5 rounded-full">
                    {language === 'bn' ? 'অনুশীলন' : 'Practice'}
                  </span>
                )}
              </span>
              <button
                onClick={() => clearDay(index)}
                className="text-gray-400 hover:text-red-500 transition"
                title={language === 'bn' ? 'মুছুন' : 'Clear day'}
              >
                <XCircle size={16} />
              </button>
            </div>

            {/* Topic Input */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <Tag size={12} />
                <span>{language === 'bn' ? 'টপিক' : 'Topic'}</span>
              </div>
              <input
                type="text"
                value={day.topic}
                onChange={(e) => handleTopicChange(index, e.target.value)}
                placeholder={language === 'bn' ? 'বিষয় লিখুন...' : 'Enter topic...'}
                className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                disabled={practiceMode}
              />
            </div>

            {/* Note Textarea */}
            {!practiceMode && (
              <div className="p-3">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <BookOpen size={12} />
                  <span>{language === 'bn' ? 'নোট' : 'Notes'}</span>
                </div>
                <textarea
                  value={day.note}
                  onChange={(e) => handleNoteChange(index, e.target.value)}
                  placeholder={language === 'bn' ? 'বিস্তারিত লিখুন...' : 'Write details...'}
                  rows={3}
                  className="w-full bg-transparent resize-none outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            )}

            {/* Character count */}
            {!practiceMode && (
              <div className="absolute bottom-1 right-2 text-xs text-gray-400 dark:text-gray-500">
                {(day.topic.length + day.note.length)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Personal Notes Section – with background & text color pickers */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {language === 'bn' ? 'ব্যক্তিগত নোটসমূহ' : 'Personal Notes'}
            </span>
          </div>
          <button onClick={addNote} className="flex items-center gap-1 px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition shadow-md">
            <Plus size={14} />
            {language === 'bn' ? 'নতুন নোট' : 'Add Note'}
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-4 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
          <Search size={16} className="text-gray-500" />
          <input type="text" value={noteSearch} onChange={(e) => setNoteSearch(e.target.value)} placeholder={language === 'bn' ? 'নোট খুঁজুন...' : 'Search notes...'} className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200" />
          {noteSearch && <button onClick={() => setNoteSearch('')} className="text-gray-400 hover:text-gray-600"><XCircle size={16} /></button>}
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredNotes.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 col-span-2">{language === 'bn' ? 'কোনো নোট নেই' : 'No notes'}</p>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: note.color, color: note.textColor }}
              >
                {/* Header – semi‑transparent dark overlay for contrast */}
                <div
                  className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-[2px] cursor-pointer"
                  onClick={() => toggleNoteExpand(note.id)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {expandedNotes.includes(note.id) ? (
                      <ChevronUp size={18} className="opacity-80" style={{ color: note.textColor }} />
                    ) : (
                      <ChevronDown size={18} className="opacity-80" style={{ color: note.textColor }} />
                    )}
                    <span className="font-bold text-lg truncate" style={{ color: note.textColor }}>
                      {note.title || (language === 'bn' ? 'শিরোনামহীন' : 'Untitled')}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    className="p-1.5 opacity-70 hover:opacity-100 hover:bg-black/20 rounded-lg transition"
                    style={{ color: note.textColor }}
                    title={language === 'bn' ? 'মুছুন' : 'Delete'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Expanded Content */}
                {expandedNotes.includes(note.id) && (
                  <div className="p-4 space-y-4 bg-black/10 backdrop-blur-[1px]">
                    {/* Title */}
                    <div>
                      <label className="block text-xs opacity-60 mb-1 font-medium" style={{ color: note.textColor }}>
                        {language === 'bn' ? 'শিরোনাম' : 'Title'}
                      </label>
                      <input
                        type="text"
                        value={note.title}
                        onChange={(e) => updateNote(note.id, 'title', e.target.value)}
                        placeholder={language === 'bn' ? 'শিরোনাম' : 'Title'}
                        className="w-full p-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none font-bold placeholder-white/50"
                        style={{ color: note.textColor }}
                      />
                    </div>

                    {/* Topic */}
                    <div>
                      <label className="block text-xs opacity-60 mb-1 font-medium" style={{ color: note.textColor }}>
                        {language === 'bn' ? 'বিষয়' : 'Topic'}
                      </label>
                      <input
                        type="text"
                        value={note.topic}
                        onChange={(e) => updateNote(note.id, 'topic', e.target.value)}
                        placeholder={language === 'bn' ? 'বিষয়' : 'Topic'}
                        className="w-full p-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none font-bold placeholder-white/50"
                        style={{ color: note.textColor }}
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-xs opacity-60 mb-1 font-medium" style={{ color: note.textColor }}>
                        {language === 'bn' ? 'নোট' : 'Notes'}
                      </label>
                      <textarea
                        value={note.content}
                        onChange={(e) => updateNote(note.id, 'content', e.target.value)}
                        placeholder={language === 'bn' ? 'নোট লিখুন...' : 'Write your note...'}
                        rows={4}
                        className="w-full p-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none resize-y font-bold placeholder-white/50"
                        style={{ color: note.textColor }}
                      />
                    </div>

                    {/* Color pickers – both background and text */}
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Background color picker (native) */}
                      <div className="flex items-center gap-2">
                        <Palette size={16} className="opacity-70" style={{ color: note.textColor }} />
                        <input
                          type="color"
                          value={note.color}
                          onChange={(e) => updateNote(note.id, 'color', e.target.value)}
                          className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
                          title={language === 'bn' ? 'পটভূমির রং' : 'Background color'}
                        />
                        <span className="text-xs opacity-60" style={{ color: note.textColor }}>
                          {note.color}
                        </span>
                      </div>

                      {/* Text color picker (native) */}
                      <div className="flex items-center gap-2">
                        <Type size={16} className="opacity-70" style={{ color: note.textColor }} />
                        <input
                          type="color"
                          value={note.textColor}
                          onChange={(e) => updateNote(note.id, 'textColor', e.target.value)}
                          className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
                          title={language === 'bn' ? 'লেখার রং' : 'Text color'}
                        />
                        <span className="text-xs opacity-60" style={{ color: note.textColor }}>
                          {note.textColor}
                        </span>
                      </div>
                    </div>

                    {/* Quick background swatches (optional) */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-60" style={{ color: note.textColor }}>
                        {language === 'bn' ? 'দ্রুত রং:' : 'Quick colors:'}
                      </span>
                      <div className="flex gap-1 flex-wrap">
                        {colorOptions.map(color => (
                          <button
                            key={color}
                            onClick={() => updateNote(note.id, 'color', color)}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={language === 'bn' ? 'পটভূমির রং' : 'Background color'}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Footer: dates and character count */}
                    <div className="flex flex-wrap items-center justify-between text-xs border-t border-white/20 pt-3 mt-1">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full" style={{ color: note.textColor }}>
                          <Calendar size={12} /> {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full" style={{ color: note.textColor }}>
                          <Clock size={12} /> {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="bg-black/30 px-3 py-1 rounded-full font-medium" style={{ color: note.textColor }}>
                        {note.content.length} {language === 'bn' ? 'অক্ষর' : 'chars'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Archive */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><History size={18} className="text-primary" /><span className="font-medium text-gray-700 dark:text-gray-300">{language === 'bn' ? 'আর্কাইভ' : 'Archive'}</span></div>
          <button onClick={archiveWeek} className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shadow-md"><Save size={14} />{language === 'bn' ? 'এই সপ্তাহ আর্কাইভ করুন' : 'Archive current week'}</button>
        </div>
        {archive.length === 0 ? <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'bn' ? 'কোনো আর্কাইভ নেই' : 'No archive yet'}</p> : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {archive.map((week, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                <span className="text-sm text-gray-700 dark:text-gray-300">{week.weekStart} - {language === 'bn' ? `${week.days.filter(d => d.completed).length} সম্পন্ন` : `${week.days.filter(d => d.completed).length} completed`}</span>
                <button onClick={() => loadArchiveWeek(idx)} className="text-xs text-primary hover:underline">{language === 'bn' ? 'লোড' : 'Load'}</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle size={18} className="text-green-500" /><span>{language === 'bn' ? '৭ম দিনের জন্য সব টপিক ও নোট একসাথে দেখুন এবং অনুশীলন করুন' : 'Review all topics & notes together on the 7th day and practice'}</span></div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md" title={language === 'bn' ? 'এক্সপোর্ট' : 'Export'}><Download size={16} /><span className="hidden sm:inline">{language === 'bn' ? 'এক্সপোর্ট' : 'Export'}</span></button>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md cursor-pointer"><Upload size={16} /><span className="hidden sm:inline">{language === 'bn' ? 'ইম্পোর্ট' : 'Import'}</span><input type="file" accept=".json" onChange={importData} className="hidden" /></label>
          <button onClick={() => {
            const allContent = days.map((day, i) => 
              `${dayNames[language][i]} ${day.completed ? '✅' : ''}\nTopic: ${day.topic || '—'}\nNotes: ${day.note || '—'}`
            ).join('\n\n---\n\n');
            navigator.clipboard?.writeText(allContent).then(() => alert(language === 'bn' ? 'সব কপি হয়েছে!' : 'All copied!'));
          }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition shadow-md"><Save size={16} />{language === 'bn' ? 'সব কপি' : 'Copy All'}</button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        {language === 'bn' ? 'সব ডাটা স্বয়ংক্রিয়ভাবে আপনার ব্রাউজারে সংরক্ষিত হয়' : 'All data is automatically saved in your browser'}
      </p>
    </div>
  );
};

export default WeeklyPractice;