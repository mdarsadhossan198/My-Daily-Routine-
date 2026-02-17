import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Heart, Target, Trash2, Edit } from 'lucide-react';
import { differenceInMilliseconds, differenceInYears, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, intervalToDuration } from 'date-fns';

const LifeTimer = ({ birthDate, lifeExpectancyYears = 80 }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [isPaused, setIsPaused] = useState(false);
  const [birthTime, setBirthTime] = useState({
    totalMs: 0,
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null); // { id, title, deadline }

  const birthAnimationRef = useRef();
  const goalsAnimationRef = useRef();

  // Translations
  const t = useMemo(() => {
    const translations = {
      en: {
        lifeTimer: 'Life Timer',
        timeLived: 'Time Lived',
        millisecondsSinceBirth: 'milliseconds since birth',
        born: 'Born',
        today: 'Today',
        years: 'Years',
        months: 'Months',
        days: 'Days',
        hours: 'Hours',
        minutes: 'Minutes',
        seconds: 'Seconds',
        ms: 'MS',
        pause: 'Pause',
        resume: 'Resume',
        setBirthDateMsg: 'Please set your birth date in Settings.',
        en: 'English',
        bn: 'বাংলা',
        goalCountdown: 'Goal Countdown',
        goalTitle: 'Goal',
        deadline: 'Deadline',
        remaining: 'Remaining',
        daysRemaining: 'days',
        hoursRemaining: 'hours',
        minutesRemaining: 'minutes',
        secondsRemaining: 'seconds',
        goalCompleted: 'Goal Completed! 🎉',
        noGoal: 'No goals set. Go to Settings to add goals.',
        lifeProgress: 'Life Progress',
        of: 'of',
        delete: 'Delete',
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
      },
      bn: {
        lifeTimer: 'জীবন টাইমার',
        timeLived: 'জীবনকাল',
        millisecondsSinceBirth: 'জন্ম থেকে মিলিসেকেন্ড',
        born: 'জন্ম',
        today: 'আজ',
        years: 'বছর',
        months: 'মাস',
        days: 'দিন',
        hours: 'ঘন্টা',
        minutes: 'মিনিট',
        seconds: 'সেকেন্ড',
        ms: 'মি.সে.',
        pause: 'বিরাম',
        resume: 'চালু',
        setBirthDateMsg: 'অনুগ্রহ করে সেটিংসে আপনার জন্ম তারিখ সেট করুন।',
        en: 'ইংরেজি',
        bn: 'বাংলা',
        goalCountdown: 'লক্ষ্য কাউন্টডাউন',
        goalTitle: 'লক্ষ্য',
        deadline: 'শেষ তারিখ',
        remaining: 'অবশিষ্ট',
        daysRemaining: 'দিন',
        hoursRemaining: 'ঘন্টা',
        minutesRemaining: 'মিনিট',
        secondsRemaining: 'সেকেন্ড',
        goalCompleted: 'লক্ষ্য পূরণ হয়েছে! 🎉',
        noGoal: 'কোনো লক্ষ্য নির্ধারিত নেই। সেটিংসে গিয়ে লক্ষ্য যোগ করুন।',
        lifeProgress: 'জীবনের অগ্রগতি',
        of: 'এর মধ্যে',
        delete: 'মুছুন',
        edit: 'সম্পাদনা',
        save: 'সংরক্ষণ',
        cancel: 'বাতিল',
      },
    };
    return (key) => translations[language][key] || key;
  }, [language]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Load goals from localStorage
  const loadGoals = useCallback(() => {
    const stored = localStorage.getItem('goalsList');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure each goal has an id and remaining object
        const goalsWithMeta = parsed.map(g => ({
          ...g,
          id: g.id || crypto.randomUUID?.() || Date.now() + Math.random(),
          remaining: {}
        }));
        setGoals(goalsWithMeta);
      } catch (e) {
        console.error('Error parsing goalsList', e);
        setGoals([]);
      }
    } else {
      setGoals([]);
    }
  }, []);

  // Initial load and listen to storage changes (cross-tab sync)
  useEffect(() => {
    loadGoals();
    const handleStorageChange = (e) => {
      if (e.key === 'goalsList') loadGoals();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadGoals]);

  // Save goals to localStorage whenever they change (for deletion/editing)
  useEffect(() => {
    localStorage.setItem('goalsList', JSON.stringify(goals.map(({ remaining, ...rest }) => rest)));
  }, [goals]);

  // Delete goal
  const deleteGoal = (id) => {
    if (window.confirm(t('delete') + '?')) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  // Edit goal (simple inline form)
  const startEdit = (goal) => {
    setEditingGoal({ ...goal });
  };

  const saveEdit = () => {
    if (!editingGoal.title || !editingGoal.deadline) return;
    setGoals(prev => prev.map(g => g.id === editingGoal.id ? { ...editingGoal } : g));
    setEditingGoal(null);
  };

  const cancelEdit = () => setEditingGoal(null);

  // Update birth timer using date-fns for accuracy
  useEffect(() => {
    if (!birthDate) return;

    const updateBirthTimer = () => {
      const birth = new Date(birthDate);
      const now = new Date();
      const diffMs = differenceInMilliseconds(now, birth);

      if (diffMs < 0) {
        setBirthTime({ totalMs: 0, years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
        return;
      }

      const duration = intervalToDuration({ start: birth, end: now });
      const years = duration.years || 0;
      const months = duration.months || 0;
      const days = duration.days || 0;
      const hours = duration.hours || 0;
      const minutes = duration.minutes || 0;
      const seconds = duration.seconds || 0;
      const milliseconds = diffMs % 1000;

      setBirthTime({
        totalMs: diffMs,
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      });

      birthAnimationRef.current = requestAnimationFrame(updateBirthTimer);
    };

    if (!isPaused) {
      birthAnimationRef.current = requestAnimationFrame(updateBirthTimer);
    }

    return () => {
      if (birthAnimationRef.current) {
        cancelAnimationFrame(birthAnimationRef.current);
      }
    };
  }, [birthDate, isPaused]);

  // Update goal countdowns
  useEffect(() => {
    const updateGoals = () => {
      setGoals(prevGoals =>
        prevGoals.map(goal => {
          if (!goal.deadline) return goal;
          const now = new Date();
          const deadline = new Date(goal.deadline);
          const diff = deadline.getTime() - now.getTime();

          if (diff <= 0) {
            return { ...goal, remaining: { completed: true } };
          }

          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          return { ...goal, remaining: { days, hours, minutes, seconds } };
        })
      );
      goalsAnimationRef.current = requestAnimationFrame(updateGoals);
    };

    if (!isPaused) {
      goalsAnimationRef.current = requestAnimationFrame(updateGoals);
    }

    return () => {
      if (goalsAnimationRef.current) {
        cancelAnimationFrame(goalsAnimationRef.current);
      }
    };
  }, [isPaused]);

  // Life progress percentage
  const lifeProgress = useMemo(() => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const now = new Date();
    const yearsLived = differenceInYears(now, birth);
    return Math.min(100, (yearsLived / lifeExpectancyYears) * 100);
  }, [birthDate, birthTime.years, lifeExpectancyYears]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (!birthDate) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg">
        <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {t('lifeTimer')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">{t('setBirthDateMsg')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto" aria-live="polite">
      {/* Language and Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              language === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('en')}
          </button>
          <button
            onClick={() => setLanguage('bn')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              language === 'bn'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('bn')}
          </button>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition"
        >
          {isPaused ? t('resume') : t('pause')}
        </button>
      </div>

      {/* Life Timer Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 sm:p-8 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-8 h-8 text-white/80" />
          <h2 className="text-2xl sm:text-3xl font-bold">{t('timeLived')}</h2>
        </div>

        {/* Total milliseconds */}
        <div className="text-center mb-6">
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-bold tracking-wider break-all">
            {formatNumber(birthTime.totalMs)}
          </div>
          <p className="text-xs sm:text-sm text-white/70 mt-2">{t('millisecondsSinceBirth')}</p>
        </div>

        {/* Timer units grid - responsive */}
        <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-4 text-center">
          {[
            { label: t('years'), value: birthTime.years },
            { label: t('months'), value: birthTime.months },
            { label: t('days'), value: birthTime.days },
            { label: t('hours'), value: birthTime.hours },
            { label: t('minutes'), value: birthTime.minutes },
            { label: t('seconds'), value: birthTime.seconds },
            { label: t('ms'), value: birthTime.milliseconds },
          ].map((unit, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{unit.value}</div>
              <div className="text-[0.6rem] sm:text-xs uppercase tracking-wider text-white/70">{unit.label}</div>
            </div>
          ))}
        </div>

        {/* Born / Today */}
        <div className="mt-6 text-xs sm:text-sm text-white/70 flex flex-wrap justify-between items-center">
          <div>{t('born')}: {new Date(birthDate).toLocaleDateString()}</div>
          <div>{t('today')}: {new Date().toLocaleDateString()}</div>
        </div>

        {/* Life Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs sm:text-sm text-white/70 mb-1">
            <span>{t('lifeProgress')}</span>
            <span>{Math.round(lifeProgress)}% {t('of')} {lifeExpectancyYears} {t('years')}</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2.5">
            <div className="bg-white h-2.5 rounded-full transition-all duration-300" style={{ width: `${lifeProgress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      {goals.length > 0 ? (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-2xl">
              {editingGoal?.id === goal.id ? (
                // Inline edit form
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingGoal.title}
                    onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                    className="w-full p-2 rounded bg-white/20 text-white placeholder-white/50 border border-white/30"
                    placeholder={t('goalTitle')}
                  />
                  <input
                    type="date"
                    value={editingGoal.deadline}
                    onChange={(e) => setEditingGoal({ ...editingGoal, deadline: e.target.value })}
                    className="w-full p-2 rounded bg-white/20 text-white border border-white/30"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition">
                      {t('save')}
                    </button>
                    <button onClick={cancelEdit} className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 transition">
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-white/80" />
                    <h2 className="text-xl sm:text-2xl font-bold">{t('goalCountdown')}</h2>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-white/70">{t('goalTitle')}</p>
                      <p className="text-base sm:text-lg font-bold break-words">{goal.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs sm:text-sm text-white/70">{t('deadline')}</p>
                        <p className="text-sm sm:text-base font-semibold">{new Date(goal.deadline).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => startEdit(goal)} className="p-2 hover:bg-white/20 rounded transition">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => deleteGoal(goal.id)} className="p-2 hover:bg-white/20 rounded transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {goal.remaining.completed ? (
                    <div className="text-center py-4">
                      <p className="text-4xl mb-2">🎉</p>
                      <p className="text-lg sm:text-xl font-bold">{t('goalCompleted')}</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <p className="text-xs sm:text-sm text-white/70">{t('remaining')}</p>
                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold tracking-wider overflow-x-auto whitespace-nowrap pb-1">
                          {goal.remaining.days}d {goal.remaining.hours}h {goal.remaining.minutes}m {goal.remaining.seconds}s
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                        {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                          <div key={unit} className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                            <div className="text-lg sm:text-xl md:text-2xl font-bold">{goal.remaining[unit]}</div>
                            <div className="text-[0.6rem] sm:text-xs uppercase tracking-wider text-white/70">
                              {t(unit + 'Remaining')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg border border-gray-200 dark:border-gray-700">
          <Target className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 dark:text-gray-400">{t('noGoal')}</p>
        </div>
      )}
    </div>
  );
};

export default LifeTimer;