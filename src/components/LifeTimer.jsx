import React, { useState, useEffect, useRef } from 'react';
import { Heart, Clock } from 'lucide-react';

const LifeTimer = ({ birthDate }) => {
  const [language, setLanguage] = useState('en'); // 'en' or 'bn'
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
  const [todayTime, setTodayTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    totalMs: 0,
  });

  const birthAnimationRef = useRef();
  const todayAnimationRef = useRef();

  // ---------- ভাষা অনুবাদ ----------
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
        timeElapsedToday: 'Time Elapsed Today',
        millisecondsSinceMidnight: 'milliseconds since midnight',
        en: 'English',
        bn: 'বাংলা',
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
        timeElapsedToday: 'আজকের সময়',
        millisecondsSinceMidnight: 'মধ্যরাত থেকে মিলিসেকেন্ড',
        en: 'ইংরেজি',
        bn: 'বাংলা',
      },
    };
    return translations[language][key] || key;
  };

  // ---------- জন্ম টাইমার ----------
  useEffect(() => {
    if (!birthDate) return;

    const updateBirthTimer = () => {
      const birth = new Date(birthDate);
      const now = new Date();
      const diff = now.getTime() - birth.getTime();

      if (diff < 0) {
        setBirthTime({
          totalMs: 0,
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        });
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

  // ---------- আজকের টাইমার (মধ্যরাত থেকে) ----------
  useEffect(() => {
    const updateTodayTimer = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diff = now.getTime() - midnight.getTime();

      const totalMs = diff;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const remainingAfterHours = diff % (1000 * 60 * 60);
      const minutes = Math.floor(remainingAfterHours / (1000 * 60));
      const remainingAfterMinutes = remainingAfterHours % (1000 * 60);
      const seconds = Math.floor(remainingAfterMinutes / 1000);
      const milliseconds = Math.floor(remainingAfterMinutes % 1000);

      setTodayTime({
        totalMs,
        hours,
        minutes,
        seconds,
        milliseconds,
      });

      todayAnimationRef.current = requestAnimationFrame(updateTodayTimer);
    };

    if (!isPaused) {
      todayAnimationRef.current = requestAnimationFrame(updateTodayTimer);
    }

    return () => {
      if (todayAnimationRef.current) {
        cancelAnimationFrame(todayAnimationRef.current);
      }
    };
  }, [isPaused]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // ---------- রেন্ডার ----------
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
      {/* ভাষা সিলেক্টর ও কন্ট্রোল বাটন */}
      <div className="flex justify-between items-center">
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

      {/* আজকের টাইমার (টাস্ক টাইমার) */}
      <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-8 h-8 text-white/80" />
          <h2 className="text-3xl font-bold">{t('timeElapsedToday')}</h2>
        </div>

        <div className="text-center mb-6">
          <div className="text-5xl md:text-6xl font-mono font-bold tracking-wider">
            {formatNumber(todayTime.totalMs)}
          </div>
          <p className="text-sm text-white/70 mt-2">{t('millisecondsSinceMidnight')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-3xl font-bold">{todayTime.hours}</div>
            <div className="text-xs uppercase tracking-wider text-white/70">{t('hours')}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-3xl font-bold">{todayTime.minutes}</div>
            <div className="text-xs uppercase tracking-wider text-white/70">{t('minutes')}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-3xl font-bold">{todayTime.seconds}</div>
            <div className="text-xs uppercase tracking-wider text-white/70">{t('seconds')}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-3xl font-bold">{todayTime.milliseconds}</div>
            <div className="text-xs uppercase tracking-wider text-white/70">{t('ms')}</div>
          </div>
        </div>

        <div className="mt-6 text-sm text-white/70 flex justify-end">
          <div>{t('today')}: {new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

export default LifeTimer;