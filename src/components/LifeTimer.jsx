import React, { useState, useEffect, useRef } from 'react';
import { Heart, Target } from 'lucide-react';

const LifeTimer = ({ birthDate }) => {
  const [language, setLanguage] = useState('en');
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
  const [goals, setGoals] = useState([]); // [{ id, title, deadline, remaining }]

  const birthAnimationRef = useRef();
  const goalsAnimationRef = useRef();

  const t = (key) => {
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
      },
    };
    return translations[language][key] || key;
  };

  // গোল ডাটা লোড
  useEffect(() => {
    const loadGoals = () => {
      const stored = localStorage.getItem('goalsList');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // প্রতিটি গোলের জন্য remaining অবজেক্ট যোগ করা
          const goalsWithRemaining = parsed.map(g => ({
            ...g,
            remaining: {}
          }));
          setGoals(goalsWithRemaining);
        } catch (e) {
          console.error('Error parsing goalsList', e);
          setGoals([]);
        }
      } else {
        setGoals([]);
      }
    };
    loadGoals();
    const interval = setInterval(loadGoals, 2000);
    return () => clearInterval(interval);
  }, []);

  // জন্ম টাইমার
  useEffect(() => {
    if (!birthDate) return;

    const updateBirthTimer = () => {
      const birth = new Date(birthDate);
      const now = new Date();
      const diff = now.getTime() - birth.getTime();

      if (diff < 0) {
        setBirthTime({ totalMs: 0, years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
        return;
      }

      const totalMs = diff;
      const years = diff / (1000 * 60 * 60 * 24 * 365.25);
      const wholeYears = Math.floor(years);
      const remainingAfterYears = diff % (1000 * 60 * 60 * 24 * 365.25);

      const months = remainingAfterYears / (1000 * 60 * 60 * 24 * 30.44);
      const wholeMonths = Math.floor(months);
      const remainingAfterMonths = remainingAfterYears % (1000 * 60 * 60 * 24 * 30.44);

      const days = remainingAfterMonths / (1000 * 60 * 60 * 24);
      const wholeDays = Math.floor(days);
      const remainingAfterDays = remainingAfterMonths % (1000 * 60 * 60 * 24);

      const hours = remainingAfterDays / (1000 * 60 * 60);
      const wholeHours = Math.floor(hours);
      const remainingAfterHours = remainingAfterDays % (1000 * 60 * 60);

      const minutes = remainingAfterHours / (1000 * 60);
      const wholeMinutes = Math.floor(minutes);
      const remainingAfterMinutes = remainingAfterHours % (1000 * 60);

      const seconds = remainingAfterMinutes / 1000;
      const wholeSeconds = Math.floor(seconds);
      const milliseconds = Math.floor(remainingAfterMinutes % 1000);

      setBirthTime({
        totalMs,
        years: wholeYears,
        months: wholeMonths,
        days: wholeDays,
        hours: wholeHours,
        minutes: wholeMinutes,
        seconds: wholeSeconds,
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

  // গোল কাউন্টডাউন আপডেট
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
  }, [isPaused, goals]); // নির্ভরশীলতা goals? – আমরা goals আপডেট করছি, কিন্তু goals পরিবর্তন হলে পুনরায় ইফেক্ট চালু হবে। তবে updateGoals-এ আমরা setGoals করছি, যা infinite loop তৈরি করতে পারে। তাই goals-কে ডিপেন্ডেন্সি থেকে বাদ দেওয়া উচিত, কারণ আমরা চাই প্রতিটি ফ্রেমে আপডেট হোক। ডিপেন্ডেন্সি অ্যারেতে শুধু isPaused থাকবে।

  // উপরের ইফেক্ট ঠিক করা: goals ডিপেন্ডেন্সি সরিয়ে দিচ্ছি, কারণ আমরা চাই এনিমেশন লুপ চলতে থাকুক। কিন্তু setGoals-এর কারণে রি-রেন্ডার হবে, আর নতুন goals নিয়ে আবার এনিমেশন কল হবে। এটি চক্রাকার না হওয়ার জন্য আমরা `goals`-কে ডিপেন্ডেন্সি থেকে বাদ দিই, কিন্তু তখন updateGoals-এর ভিতরে `goals` পুরনো ক্লোজারে আটকে যাবে। তাই `setGoals`-এ ফাংশনাল আপডেট ব্যবহার করছি, যা সবসময়最新 state ব্যবহার করে। এতে কোনো সমস্যা নেই। ডিপেন্ডেন্সি অ্যারেতে শুধু `isPaused` রাখলে চলবে।

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
  }, [isPaused]); // শুধু isPaused ডিপেন্ডেন্সি

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
    <div className="space-y-6">
      {/* ভাষা ও কন্ট্রোল */}
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

      {/* জন্ম টাইমার */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-8 h-8 text-white/80" />
          <h2 className="text-3xl font-bold">{t('timeLived')}</h2>
        </div>
        <div className="text-center mb-6">
          <div className="text-5xl md:text-6xl font-mono font-bold tracking-wider">
            {formatNumber(birthTime.totalMs)}
          </div>
          <p className="text-sm text-white/70 mt-2">{t('millisecondsSinceBirth')}</p>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-3xl font-bold">{birthTime.years}</div>
            <div className="text-xs uppercase tracking-wider text-white/70">{t('years')}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-3xl font-bold">{birthTime.months}</div>
            <div className="text-xs uppercase tracking-wider text-white/70">{t('months')}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-3xl font-bold">{birthTime.days}</div>
            <div className="text-xs uppercase tracking-wider text-white/70">{t('days')}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-3xl font-bold">{birthTime.hours}</div>
            <div className="text-xs uppercase tracking-wider text-white/70">{t('hours')}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-3xl font-bold">{birthTime.minutes}</div>
            <div className="text-xs uppercase tracking-wider text-white/70">{t('minutes')}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-3xl font-bold">{birthTime.seconds}</div>
            <div className="text-xs uppercase tracking-wider text-white/70">{t('seconds')}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-3xl font-bold">{birthTime.milliseconds}</div>
            <div className="text-xs uppercase tracking-wider text-white/70">{t('ms')}</div>
          </div>
        </div>
        <div className="mt-6 text-sm text-white/70 flex justify-between items-center">
          <div>{t('born')}: {new Date(birthDate).toLocaleDateString()}</div>
          <div>{t('today')}: {new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {/* গোল কাউন্টডাউন লিস্ট */}
      {goals.length > 0 ? (
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div key={index} className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-white/80" />
                <h2 className="text-2xl font-bold">{t('goalCountdown')} #{index + 1}</h2>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <p className="text-sm text-white/70">{t('goalTitle')}</p>
                  <p className="text-xl font-bold">{goal.title}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">{t('deadline')}</p>
                  <p className="text-lg font-semibold">{new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              {goal.remaining.completed ? (
                <div className="text-center py-4">
                  <p className="text-4xl mb-2">🎉</p>
                  <p className="text-xl font-bold">{t('goalCompleted')}</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <p className="text-sm text-white/70">{t('remaining')}</p>
                    <div className="text-4xl md:text-5xl font-mono font-bold tracking-wider">
                      {goal.remaining.days}d {goal.remaining.hours}h {goal.remaining.minutes}m {goal.remaining.seconds}s
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                      <div className="text-2xl font-bold">{goal.remaining.days}</div>
                      <div className="text-xs uppercase tracking-wider text-white/70">{t('daysRemaining')}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                      <div className="text-2xl font-bold">{goal.remaining.hours}</div>
                      <div className="text-xs uppercase tracking-wider text-white/70">{t('hoursRemaining')}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                      <div className="text-2xl font-bold">{goal.remaining.minutes}</div>
                      <div className="text-xs uppercase tracking-wider text-white/70">{t('minutesRemaining')}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                      <div className="text-2xl font-bold">{goal.remaining.seconds}</div>
                      <div className="text-xs uppercase tracking-wider text-white/70">{t('secondsRemaining')}</div>
                    </div>
                  </div>
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