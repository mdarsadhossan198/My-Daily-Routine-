import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ------------------------------------------------------------
// ১. ভাষা ডাটা (বাংলা + ইংরেজি) – নতুন কী যুক্ত হয়েছে
// ------------------------------------------------------------
const translations = {
  bn: {
    appTitle: "যোগাযোগ দক্ষতা রোডম্যাপ",
    appSubtitle: "শিক্ষানবিশ থেকে বিশেষজ্ঞ — আন্তঃব্যক্তিক দক্ষতা আয়ত্ত করুন",
    today: "আজকের তারিখ",
    overallProgress: "সামগ্রিক অগ্রগতি",
    milestones: "মাইলফলক",
    completed: "সম্পন্ন",
    started: "শুরু",
    notStarted: "শুরু হয়নি",
    levelBeginner: "শিক্ষানবিশ",
    levelIntermediate: "মধ্যবর্তী",
    levelAdvanced: "উন্নত",
    levelExpert: "বিশেষজ্ঞ",
    tips: "টিপস",
    importance: "কেন এটি গুরুত্বপূর্ণ",
    exercises: "অনুশীলন",
    examples: "উদাহরণ",
    improvementTips: "আরও উন্নতির উপায়",
    externalLinks: "আরও জানতে দেখুন",
    dailyNote: "আজকের অনুশীলন নোট",
    notePlaceholder: "আপনি আজ কী অনুশীলন করলেন? লিখে রাখুন...",
    saveNote: "সংরক্ষণ করুন",
    clearNote: "মুছুন",
    close: "বন্ধ করুন",
    languageToggle: "English",
    milestoneStarted: "শুরু করেছেন",
    customMilestones: "নিজস্ব মাইলফলক",
    addCustom: "নতুন যোগ করুন",
    points: "পয়েন্ট",
    badges: "ব্যাজ",
    enableNotifications: "মনে করানোর অনুমতি দিন",
    shareProgress: "অগ্রগতি শেয়ার করুন",
    exportData: "ডাটা এক্সপোর্ট",
    importData: "ডাটা ইমপোর্ট",
    searchNotes: "নোট খুঁজুন...",
    history: "পূর্বের নোট",
    noNotes: "কোন নোট নেই",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    streak: "টানা দিন",
    weeklyChart: "সাপ্তাহিক নোট",
    voiceInput: "ভয়েস ইনপুট",
    listening: "শুনছে...",
    darkMode: "ডার্ক মোড",
    lightMode: "লাইট মোড",
    // নতুন কী
    guidedTour: "শুরু করার গাইড",
    next: "পরবর্তী",
    prev: "পূর্ববর্তী",
    finish: "শেষ",
    help: "সাহায্য",
    focusMode: "ফোকাস মোড",
    showCompleted: "সম্পন্ন দেখান",
    hideCompleted: "সম্পন্ন লুকান",
    totalNotes: "মোট নোট",
    longestStreak: "সর্বোচ্চ টানা দিন",
    avgNotesPerWeek: "সাপ্তাহিক গড় নোট",
    badgeGallery: "ব্যাজ গ্যালারি",
    reminderTime: "মনে করানোর সময়",
    setReminder: "নির্ধারণ করুন",
    reminderSet: "মনে করানো সেট করা হয়েছে",
    tourStep1: "প্রতিটি মাইলফলকে ক্লিক করে বিস্তারিত দেখুন এবং নোট লিখুন।",
    tourStep2: "আপনার নিজস্ব মাইলফলক যোগ করতে পারেন নিচের ফর্ম থেকে।",
    tourStep3: "অগ্রগতি শেয়ার করুন বা ব্যাকআপ নিন উপরের বাটন থেকে।",
    tourStep4: "ডার্ক মোড টগল করে চোখের আরাম নিশ্চিত করুন।",
  },
  en: {
    appTitle: "Communication Skills Roadmap",
    appSubtitle: "Master interpersonal skills from beginner to expert.",
    today: "Today's Date",
    overallProgress: "Overall Progress",
    milestones: "Milestones",
    completed: "Completed",
    started: "Started",
    notStarted: "Not Started",
    levelBeginner: "Beginner",
    levelIntermediate: "Intermediate",
    levelAdvanced: "Advanced",
    levelExpert: "Expert",
    tips: "Tips",
    importance: "Why It Matters",
    exercises: "Exercises",
    examples: "Examples",
    improvementTips: "Ways to Improve",
    externalLinks: "Learn More",
    dailyNote: "Today's Practice Note",
    notePlaceholder: "What did you practice today? Write your reflection...",
    saveNote: "Save Note",
    clearNote: "Clear",
    close: "Close",
    languageToggle: "বাংলা",
    milestoneStarted: "Started on",
    customMilestones: "Custom Milestones",
    addCustom: "Add New",
    points: "Points",
    badges: "Badges",
    enableNotifications: "Enable Reminders",
    shareProgress: "Share Progress",
    exportData: "Export Data",
    importData: "Import Data",
    searchNotes: "Search notes...",
    history: "History",
    noNotes: "No notes",
    edit: "Edit",
    delete: "Delete",
    streak: "Day streak",
    weeklyChart: "Weekly notes",
    voiceInput: "Voice input",
    listening: "Listening...",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    // new keys
    guidedTour: "Guided Tour",
    next: "Next",
    prev: "Previous",
    finish: "Finish",
    help: "Help",
    focusMode: "Focus Mode",
    showCompleted: "Show Completed",
    hideCompleted: "Hide Completed",
    totalNotes: "Total Notes",
    longestStreak: "Longest Streak",
    avgNotesPerWeek: "Avg Notes/Week",
    badgeGallery: "Badge Gallery",
    reminderTime: "Reminder Time",
    setReminder: "Set",
    reminderSet: "Reminder set",
    tourStep1: "Click on any milestone to see details and write notes.",
    tourStep2: "You can add your own custom milestones using the form below.",
    tourStep3: "Share your progress or backup data using the buttons above.",
    tourStep4: "Toggle dark mode for comfortable viewing.",
  },
};

// ------------------------------------------------------------
// ২. রোডম্যাপ ডাটা – আগের মতোই (সংক্ষেপে দেখানো হলো)
// ------------------------------------------------------------
const roadmapData = {
  beginner: {
    name: "beginner",
    color: "blue",
    milestones: [
      { id: "b1", title: { bn: "সক্রিয় শ্রবণ", en: "Active Listening" }, shortDesc: { bn: "বক্তার কথা মনোযোগ দিয়ে শোনা।", en: "Focus on the speaker." }, details: {} },
      { id: "b2", title: { bn: "স্পষ্টতা", en: "Clarity" }, shortDesc: { bn: "অল্প কথায়", en: "Few words" }, details: {} },
      { id: "b3", title: { bn: "অমৌখিক", en: "Non-verbal" }, shortDesc: { bn: "দেহভঙ্গি", en: "Posture" }, details: {} },
      { id: "b4", title: { bn: "প্রশ্ন কৌশল", en: "Questioning" }, shortDesc: { bn: "উন্মুক্ত প্রশ্ন", en: "Open-ended" }, details: {} },
    ],
  },
  intermediate: {
    name: "intermediate",
    color: "green",
    milestones: [
      { id: "i1", title: { bn: "সহানুভূতি", en: "Empathy" }, shortDesc: { bn: "অন্যের অনুভূতি", en: "Feelings" }, details: {} },
      { id: "i2", title: { bn: "বার্তা গঠন (PREP)", en: "Structuring (PREP)" }, shortDesc: { bn: "মূল বক্তব্য", en: "Point" }, details: {} },
      { id: "i3", title: { bn: "প্রতিক্রিয়া (SBI)", en: "Feedback (SBI)" }, shortDesc: { bn: "পরিস্থিতি-আচরণ-প্রভাব", en: "Situation-Behavior-Impact" }, details: {} },
      { id: "i4", title: { bn: "শ্রোতা অনুযায়ী", en: "Adapt to Audience" }, shortDesc: { bn: "সুর, শব্দ", en: "Tone, words" }, details: {} },
    ],
  },
  advanced: {
    name: "advanced",
    color: "orange",
    milestones: [
      { id: "a1", title: { bn: "প্ররোচনা", en: "Persuasion" }, shortDesc: { bn: "Ethos, Pathos, Logos", en: "Ethos, Pathos, Logos" }, details: {} },
      { id: "a2", title: { bn: "দ্বন্দ্ব নিরসন", en: "Conflict Resolution" }, shortDesc: { bn: "জয়-জয়", en: "Win-win" }, details: {} },
      { id: "a3", title: { bn: "গল্প বলা", en: "Storytelling" }, shortDesc: { bn: "প্রেক্ষাপট, দ্বন্দ্ব, সমাধান", en: "Context, conflict, resolution" }, details: {} },
      { id: "a4", title: { bn: "প্রভাব (কর্তৃত্ব ছাড়া)", en: "Influence w/o Authority" }, shortDesc: { bn: "মিত্রতা", en: "Alliances" }, details: {} },
    ],
  },
  expert: {
    name: "expert",
    color: "purple",
    milestones: [
      { id: "e1", title: { bn: "নির্বাহী উপস্থিতি", en: "Executive Presence" }, shortDesc: { bn: "আত্মবিশ্বাস", en: "Confidence" }, details: {} },
      { id: "e2", title: { bn: "আন্তঃসাংস্কৃতিক", en: "Cross-Cultural" }, shortDesc: { bn: "উচ্চ-প্রেক্ষাপট", en: "High-context" }, details: {} },
      { id: "e3", title: { bn: "কোচিং", en: "Coaching" }, shortDesc: { bn: "GROW মডেল", en: "GROW model" }, details: {} },
      { id: "e4", title: { bn: "সংকটকালীন", en: "Crisis Comm" }, shortDesc: { bn: "স্বচ্ছতা, সহানুভূতি", en: "Transparency, empathy" }, details: {} },
    ],
  },
};

// ------------------------------------------------------------
// ৩. হেল্পার ফাংশন (স্টোরেজ, তারিখ)
// ------------------------------------------------------------
const PROGRESS_KEY = "comm_v4_progress";
const NOTES_KEY = "comm_v4_notes_v2";
const CUSTOM_KEY = "comm_v4_custom";
const LANG_KEY = "comm_v4_lang";
const POINTS_KEY = "comm_v4_points";
const THEME_KEY = "comm_v4_theme";
const TOUR_KEY = "comm_v4_tour";
const FOCUS_MODE_KEY = "comm_v4_focus";
const REMINDER_KEY = "comm_v4_reminder";

const loadProgress = () => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};
const saveProgress = (progress) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));

const loadNotes = () => {
  try {
    const saved = localStorage.getItem(NOTES_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};
const saveNotes = (notes) => localStorage.setItem(NOTES_KEY, JSON.stringify(notes));

const loadCustomMilestones = () => {
  try {
    const saved = localStorage.getItem(CUSTOM_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};
const saveCustomMilestones = (custom) => localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));

const loadPoints = () => {
  try {
    const saved = localStorage.getItem(POINTS_KEY);
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
};
const savePoints = (points) => localStorage.setItem(POINTS_KEY, points);

const loadTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } catch {
    return "light";
  }
};
const saveTheme = (theme) => localStorage.setItem(THEME_KEY, theme);

const loadTourCompleted = () => {
  try {
    const saved = localStorage.getItem(TOUR_KEY);
    return saved ? JSON.parse(saved) : false;
  } catch {
    return false;
  }
};
const saveTourCompleted = (completed) => localStorage.setItem(TOUR_KEY, JSON.stringify(completed));

const loadFocusMode = () => {
  try {
    const saved = localStorage.getItem(FOCUS_MODE_KEY);
    return saved ? JSON.parse(saved) : false;
  } catch {
    return false;
  }
};
const saveFocusMode = (focus) => localStorage.setItem(FOCUS_MODE_KEY, JSON.stringify(focus));

const loadReminderTime = () => {
  try {
    const saved = localStorage.getItem(REMINDER_KEY);
    return saved || null;
  } catch {
    return null;
  }
};
const saveReminderTime = (time) => {
  if (time) localStorage.setItem(REMINDER_KEY, time);
  else localStorage.removeItem(REMINDER_KEY);
};

const getTodayDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const formatDate = (dateStr, lang) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// স্ট্রিক ক্যালকুলেশন: টানা কত দিন নোট আছে
const calculateStreak = (notes) => {
  const allDates = new Set();
  Object.values(notes).forEach(milestoneNotes => {
    Object.keys(milestoneNotes).forEach(date => allDates.add(date));
  });
  const sorted = Array.from(allDates).sort().reverse();
  if (sorted.length === 0) return 0;
  let streak = 1;
  const today = getTodayDate();
  if (sorted[0] !== today) return 0; // আজকে না থাকলে স্ট্রিক ০
  for (let i = 0; i < sorted.length - 1; i++) {
    const prev = new Date(sorted[i]);
    const next = new Date(sorted[i + 1]);
    const diff = (prev - next) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
};

// সর্বোচ্চ স্ট্রিক
const calculateMaxStreak = (notes) => {
  const allDates = new Set();
  Object.values(notes).forEach(milestoneNotes => {
    Object.keys(milestoneNotes).forEach(date => allDates.add(date));
  });
  const sorted = Array.from(allDates).sort().reverse(); // newest first
  if (sorted.length === 0) return 0;
  let maxStreak = 1;
  let currentStreak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const prev = new Date(sorted[i]);
    const next = new Date(sorted[i + 1]);
    const diff = (prev - next) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      currentStreak++;
    } else {
      if (currentStreak > maxStreak) maxStreak = currentStreak;
      currentStreak = 1;
    }
  }
  if (currentStreak > maxStreak) maxStreak = currentStreak;
  return maxStreak;
};

// সাপ্তাহিক নোট ডাটা (গত ৭ দিন)
const getWeeklyNoteCounts = (notes) => {
  const counts = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    let count = 0;
    Object.values(notes).forEach(milestoneNotes => {
      if (milestoneNotes[dateStr]) count++;
    });
    counts.push({
      date: dateStr,
      count,
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return counts;
};

// ------------------------------------------------------------
// ৪. কালার ম্যাপিং (টেইলউইন্ড ডায়নামিক ক্লাস)
// ------------------------------------------------------------
const colorVariants = {
  blue: {
    bg: "bg-blue-500",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-300",
    lightBg: "bg-blue-50 dark:bg-blue-900/20",
    progress: "bg-blue-600",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
    dot: "bg-blue-400",
  },
  green: {
    bg: "bg-green-500",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-800 dark:text-green-300",
    lightBg: "bg-green-50 dark:bg-green-900/20",
    progress: "bg-green-600",
    hoverBorder: "hover:border-green-300 dark:hover:border-green-700",
    dot: "bg-green-400",
  },
  orange: {
    bg: "bg-orange-500",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-800 dark:text-orange-300",
    lightBg: "bg-orange-50 dark:bg-orange-900/20",
    progress: "bg-orange-600",
    hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700",
    dot: "bg-orange-400",
  },
  purple: {
    bg: "bg-purple-500",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-800 dark:text-purple-300",
    lightBg: "bg-purple-50 dark:bg-purple-900/20",
    progress: "bg-purple-600",
    hoverBorder: "hover:border-purple-300 dark:hover:border-purple-700",
    dot: "bg-purple-400",
  },
};

// ------------------------------------------------------------
// ৫. রিচ টেক্সট এডিটর (ভয়েস ইনপুট সহ)
// ------------------------------------------------------------
const RichTextEditor = ({ value, onChange, placeholder, lang }) => {
  const [isListening, setIsListening] = useState(false);
  const t = translations[lang];

  const insertMarkdown = (prefix, suffix = "") => {
    const textarea = document.getElementById("note-editor");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      prefix +
      selected +
      suffix +
      value.substring(end);
    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "bn" ? "bn-BD" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange(value + (value ? " " : "") + transcript);
    };
    recognition.start();
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-1 mb-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button onClick={() => insertMarkdown("**", "**")} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded font-bold" title="Bold">B</button>
        <button onClick={() => insertMarkdown("*", "*")} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded italic" title="Italic">I</button>
        <button onClick={() => insertMarkdown("- ")} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="List">•</button>
        <button onClick={() => insertMarkdown("# ")} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Heading">H</button>
        <button
          onClick={handleVoiceInput}
          className={`p-2 rounded ${isListening ? "bg-red-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
          title={t.voiceInput}
        >
          🎤
        </button>
      </div>
      {isListening && <p className="text-xs text-red-500 mb-1">{t.listening}</p>}
      <textarea
        id="note-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />
    </div>
  );
};

// ------------------------------------------------------------
// ৬. নোট হিস্টোরি কম্পোনেন্ট
// ------------------------------------------------------------
const NotesHistory = ({ milestoneId, lang, onSelectDate }) => {
  const [allNotes, setAllNotes] = useState(loadNotes());
  const [search, setSearch] = useState("");
  const milestoneNotes = allNotes[milestoneId] || {};
  const sortedDates = Object.keys(milestoneNotes).sort().reverse();

  const filtered = sortedDates.filter(date =>
    milestoneNotes[date].text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-4 w-full max-w-2xl mx-auto">
      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
        {translations[lang].history}
      </h5>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={translations[lang].searchNotes}
        className="w-full p-2 mb-2 text-sm bg-gray-50 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
      />
      <div className="max-h-40 overflow-y-auto space-y-1">
        {filtered.length === 0 && <p className="text-xs text-gray-500 text-center">{translations[lang].noNotes}</p>}
        {filtered.map(date => (
          <div
            key={date}
            onClick={() => onSelectDate(date)}
            className="p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex justify-between"
          >
            <span>{formatDate(date, lang)}</span>
            <span className="text-xs text-gray-500">{milestoneNotes[date].text.substring(0, 20)}...</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// ৭. মডাল কম্পোনেন্ট (আপডেট)
// ------------------------------------------------------------
const MilestoneModal = ({ isOpen, onClose, milestone, lang, levelColor }) => {
  const t = translations[lang];
  const today = getTodayDate();
  const [selectedDate, setSelectedDate] = useState(today);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(loadNotes());

  useEffect(() => {
    if (milestone) {
      const milestoneNotes = notes[milestone.id] || {};
      setNoteText(milestoneNotes[selectedDate]?.text || "");
    }
  }, [milestone, selectedDate, notes]);

  const handleSaveNote = () => {
    const updated = {
      ...notes,
      [milestone.id]: {
        ...(notes[milestone.id] || {}),
        [selectedDate]: { text: noteText },
      },
    };
    setNotes(updated);
    saveNotes(updated);
  };

  const handleDeleteNote = () => {
    const updated = { ...notes };
    if (updated[milestone.id] && updated[milestone.id][selectedDate]) {
      delete updated[milestone.id][selectedDate];
      if (Object.keys(updated[milestone.id]).length === 0) delete updated[milestone.id];
      setNotes(updated);
      saveNotes(updated);
      setNoteText("");
    }
  };

  const exportNote = () => {
    const dataStr = JSON.stringify(notes[milestone.id] || {}, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `note-${milestone.id}.json`;
    a.click();
  };

  if (!milestone) return null;

  const title = milestone.title[lang];
  const levelName =
    lang === "bn"
      ? milestone.id[0] === "b" ? "শিক্ষানবিশ"
        : milestone.id[0] === "i" ? "মধ্যবর্তী"
        : milestone.id[0] === "a" ? "উন্নত" : "বিশেষজ্ঞ"
      : milestone.id[0] === "b" ? "Beginner"
        : milestone.id[0] === "i" ? "Intermediate"
        : milestone.id[0] === "a" ? "Advanced" : "Expert";

  const colors = colorVariants[levelColor];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.9, y: "-30%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-30%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* হেডার */}
            <div className="flex flex-col items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${colors.bg}`} />
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${colors.lightBg} ${colors.text}`}>
                  {levelName}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span>📅</span> {formatDate(today, lang)}
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {title}
            </h3>

            {/* কন্টেন্ট সেকশন – এখানে আপনার ডিটেইলস অংশ বসবে */}
            <div className="space-y-4 text-center">
              <p className="text-gray-700 dark:text-gray-300">{milestone.details?.tips?.[lang] || "..."}</p>
            </div>

            {/* নোট অংশ */}
            <div className="mt-8 pt-6 border-t w-full max-w-2xl mx-auto">
              <h4 className="flex items-center justify-center gap-2 text-base font-semibold mb-4">
                <span>📝</span> {t.dailyNote} ({formatDate(selectedDate, lang)})
              </h4>
              <RichTextEditor
                value={noteText}
                onChange={setNoteText}
                placeholder={t.notePlaceholder}
                lang={lang}
              />
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <button onClick={handleSaveNote} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2 min-h-[44px]">
                  💾 {t.saveNote}
                </button>
                <button onClick={handleDeleteNote} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2 min-h-[44px]">
                  🗑️ {t.clearNote}
                </button>
                <button onClick={exportNote} className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2 min-h-[44px]">
                  📤 Export
                </button>
              </div>

              <NotesHistory
                milestoneId={milestone.id}
                lang={lang}
                onSelectDate={setSelectedDate}
              />
            </div>

            {/* ক্লোজ বাটন */}
            <div className="flex justify-center mt-6">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 flex items-center gap-2 min-h-[44px]"
              >
                ✕ {t.close}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ------------------------------------------------------------
// ৮. মাইলফলক কার্ড (মেমোইজড)
// ------------------------------------------------------------
const MilestoneCard = React.memo(({ milestone, levelData, progress, onToggleComplete, lang, isCustom, onEdit, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const isCompleted = progress[milestone.id]?.completed || false;
  const startDate = progress[milestone.id]?.startDate || null;
  const colors = colorVariants[levelData.color];
  const t = translations[lang];

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleComplete(milestone.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(milestone);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${milestone.title[lang]}?`)) {
      onDelete(milestone.id);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        className={`relative flex flex-col p-5 bg-white dark:bg-gray-800 rounded-xl border ${colors.border} cursor-pointer transition-all ${colors.hoverBorder}`}
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white pr-6">
            {milestone.title[lang]}
          </h4>
          <div className="flex gap-1">
            {isCustom && (
              <>
                <button onClick={handleEdit} className="text-gray-500 hover:text-indigo-600 p-1" aria-label="Edit">
                  ✏️
                </button>
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-600 p-1" aria-label="Delete">
                  🗑️
                </button>
              </>
            )}
            <button
              onClick={handleToggle}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                isCompleted
                  ? `${colors.bg} border-${levelData.color}-500 text-white`
                  : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
              }`}
              aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
            >
              {isCompleted && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
          {milestone.shortDesc[lang]}
        </p>

        {startDate && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            <span>{t.started}: {formatDate(startDate, lang)}</span>
          </div>
        )}

        <div className={`absolute bottom-3 right-3 w-2 h-2 rounded-full ${colors.dot}`} />
      </motion.div>

      <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center text-white">Loading...</div>}>
        <MilestoneModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          milestone={milestone}
          lang={lang}
          levelColor={levelData.color}
        />
      </Suspense>
    </>
  );
});

// ------------------------------------------------------------
// ৯. লেভেল কার্ড (মেমোইজড)
// ------------------------------------------------------------
const LevelCard = React.memo(({ levelKey, levelData, progress, onToggleComplete, lang, customMilestones = [], onEditCustom, onDeleteCustom, focusMode }) => {
  const colors = colorVariants[levelData.color];
  const t = translations[lang];
  const levelNames = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
    expert: t.levelExpert,
  };

  const allMilestones = [...levelData.milestones, ...customMilestones.filter(m => m.level === levelKey)];
  // যদি ফোকাস মোড চালু থাকে, তাহলে শুধু অসম্পূর্ণ মাইলফলক দেখাও
  const displayedMilestones = focusMode
    ? allMilestones.filter(m => !progress[m.id]?.completed)
    : allMilestones;
  const completedCount = allMilestones.filter(m => progress[m.id]?.completed).length;
  const total = allMilestones.length;
  const percent = total ? (completedCount / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`bg-white dark:bg-gray-800/90 rounded-2xl p-4 sm:p-6 border ${colors.lightBg} ${colors.border}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between mb-3 gap-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {levelNames[levelKey]}
        </h3>
        <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${colors.lightBg} ${colors.text}`}>
          {completedCount}/{total} {t.milestones}
        </span>
      </div>

      <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full ${colors.progress} rounded-full transition-all duration-700`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayedMilestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            levelData={levelData}
            progress={progress}
            onToggleComplete={onToggleComplete}
            lang={lang}
            isCustom={milestone.id.startsWith("custom")}
            onEdit={onEditCustom}
            onDelete={onDeleteCustom}
          />
        ))}
      </div>
      {focusMode && displayedMilestones.length === 0 && (
        <p className="text-center text-gray-500 mt-4">✨ All milestones completed in this level! Turn off focus mode to see them.</p>
      )}
    </motion.div>
  );
});

// ------------------------------------------------------------
// ১০. কাস্টম মাইলফলক যোগ/সম্পাদনা ফর্ম
// ------------------------------------------------------------
const CustomMilestoneForm = ({ levelKey, onAdd, onUpdate, editingMilestone, onCancel }) => {
  const [titleBn, setTitleBn] = useState(editingMilestone?.title.bn || "");
  const [titleEn, setTitleEn] = useState(editingMilestone?.title.en || "");
  const [descBn, setDescBn] = useState(editingMilestone?.shortDesc.bn || "");
  const [descEn, setDescEn] = useState(editingMilestone?.shortDesc.en || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titleBn || !titleEn) return;
    const milestoneData = {
      id: editingMilestone ? editingMilestone.id : `custom_${Date.now()}`,
      level: levelKey,
      title: { bn: titleBn, en: titleEn },
      shortDesc: { bn: descBn, en: descEn },
      details: {
        tips: { bn: "", en: "" },
        importance: { bn: "", en: "" },
        exercises: { bn: "", en: "" },
        examples: { bn: "", en: "" },
        improvementTips: { bn: "", en: "" },
        links: [],
      },
    };
    if (editingMilestone) {
      onUpdate(milestoneData);
    } else {
      onAdd(milestoneData);
    }
    setTitleBn("");
    setTitleEn("");
    setDescBn("");
    setDescEn("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <h4 className="font-semibold mb-2 text-center">
        {editingMilestone ? "Edit Custom Milestone" : "Add Custom Milestone"}
      </h4>
      <input
        type="text"
        placeholder="Title (Bengali)"
        value={titleBn}
        onChange={(e) => setTitleBn(e.target.value)}
        className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <input
        type="text"
        placeholder="Title (English)"
        value={titleEn}
        onChange={(e) => setTitleEn(e.target.value)}
        className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <input
        type="text"
        placeholder="Short desc (Bengali)"
        value={descBn}
        onChange={(e) => setDescBn(e.target.value)}
        className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <input
        type="text"
        placeholder="Short desc (English)"
        value={descEn}
        onChange={(e) => setDescEn(e.target.value)}
        className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <div className="flex gap-2">
        <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg">
          {editingMilestone ? "Update" : "Add"}
        </button>
        {editingMilestone && (
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded-lg">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

// ------------------------------------------------------------
// ১১. গ্যামিফিকেশন প্যানেল (স্ট্রিক সহ)
// ------------------------------------------------------------
const GamificationPanel = ({ points, milestonesCompleted, streak }) => {
  const badges = [
    { name: "Beginner", threshold: 1, icon: "🌱" },
    { name: "Talker", threshold: 5, icon: "🗣️" },
    { name: "Communicator", threshold: 10, icon: "🎯" },
    { name: "Master", threshold: 16, icon: "🏆" },
  ];
  const earned = badges.filter(b => milestonesCompleted >= b.threshold);
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
      <div className="text-2xl font-bold">⭐ {points} pts</div>
      <div className="flex gap-2">
        {earned.map(b => <span key={b.name} title={b.name} className="text-2xl">{b.icon}</span>)}
      </div>
      <div className="text-lg font-semibold text-orange-600">🔥 {streak} day streak</div>
    </div>
  );
};

// ------------------------------------------------------------
// ১২. নোটিফিকেশন বাটন
// ------------------------------------------------------------
const NotificationButton = ({ lang }) => {
  const t = translations[lang];
  const [permission, setPermission] = useState(Notification.permission);
  const requestPermission = () => {
    Notification.requestPermission().then(result => setPermission(result));
  };
  const scheduleReminder = () => {
    if (permission === "granted") {
      new Notification(t.appTitle, {
        body: t.dailyNote,
        icon: "/icon.png",
      });
    }
  };
  return (
    <button
      onClick={permission === "granted" ? scheduleReminder : requestPermission}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg min-h-[44px]"
      aria-label="Toggle notifications"
    >
      {permission === "granted" ? "🔔 "+t.enableNotifications : "🔕 "+t.enableNotifications}
    </button>
  );
};

// ------------------------------------------------------------
// ১৩. শেয়ার প্রগ্রেস
// ------------------------------------------------------------
const ShareProgress = ({ completed, total, lang }) => {
  const t = translations[lang];
  const shareData = {
    title: t.appTitle,
    text: `${t.overallProgress}: ${completed}/${total} ${t.milestones}`,
    url: window.location.href,
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert("Progress copied to clipboard!");
    }
  };
  return (
    <button onClick={handleShare} className="px-4 py-2 bg-green-600 text-white rounded-lg min-h-[44px]" aria-label="Share progress">
      📤 {t.shareProgress}
    </button>
  );
};

// ------------------------------------------------------------
// ১৪. ডাটা ইম্পোর্ট/এক্সপোর্ট
// ------------------------------------------------------------
const DataBackup = ({ onImport, lang }) => {
  const t = translations[lang];
  const exportAll = () => {
    const data = {
      progress: loadProgress(),
      notes: loadNotes(),
      custom: loadCustomMilestones(),
      points: loadPoints(),
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roadmap-backup-${getTodayDate()}.json`;
    a.click();
  };
  const importFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        onImport(data);
      } catch (err) {
        alert("Invalid file");
      }
    };
    reader.readAsText(file);
  };
  return (
    <div className="flex gap-2">
      <button onClick={exportAll} className="px-4 py-2 bg-gray-700 text-white rounded-lg min-h-[44px]">💾 {t.exportData}</button>
      <label className="px-4 py-2 bg-gray-700 text-white rounded-lg cursor-pointer min-h-[44px]">
        📂 {t.importData}
        <input type="file" accept=".json" onChange={importFile} className="hidden" />
      </label>
    </div>
  );
};

// ------------------------------------------------------------
// ১৫. সাপ্তাহিক নোট চার্ট
// ------------------------------------------------------------
const WeeklyChart = ({ data, lang }) => {
  const t = translations[lang];
  return (
    <div className="w-full h-48 mt-4">
      <h4 className="text-center font-semibold mb-2">{t.weeklyChart}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ------------------------------------------------------------
// ১৬. ব্যাজ গ্যালারি কম্পোনেন্ট
// ------------------------------------------------------------
const BadgeGallery = ({ milestonesCompleted, lang }) => {
  const t = translations[lang];
  const badges = [
    { name: "Beginner", threshold: 1, icon: "🌱", description: "Complete your first milestone" },
    { name: "Talker", threshold: 5, icon: "🗣️", description: "Complete 5 milestones" },
    { name: "Communicator", threshold: 10, icon: "🎯", description: "Complete 10 milestones" },
    { name: "Master", threshold: 16, icon: "🏆", description: "Complete all 16 built-in milestones" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
      {badges.map(badge => {
        const earned = milestonesCompleted >= badge.threshold;
        return (
          <div key={badge.name} className={`p-4 rounded-xl text-center ${earned ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-800 opacity-50'}`}>
            <div className="text-4xl mb-2">{badge.icon}</div>
            <div className="font-semibold text-sm">{badge.name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{badge.description}</div>
            {earned && <div className="text-xs text-green-600 mt-1">✓ Earned</div>}
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------
// ১৭. গাইডেড ট্যুর কম্পোনেন্ট
// ------------------------------------------------------------
const GuidedTour = ({ onClose, lang }) => {
  const t = translations[lang];
  const [step, setStep] = useState(0);
  const steps = [
    { title: t.guidedTour, content: t.tourStep1 },
    { title: t.guidedTour, content: t.tourStep2 },
    { title: t.guidedTour, content: t.tourStep3 },
    { title: t.guidedTour, content: t.tourStep4 },
  ];
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{steps[step].title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{steps[step].content}</p>
        <div className="flex justify-between">
          <button
            onClick={() => step > 0 ? setStep(step-1) : null}
            disabled={step === 0}
            className={`px-4 py-2 rounded-lg ${step === 0 ? 'bg-gray-200 text-gray-500' : 'bg-indigo-600 text-white'}`}
          >
            {t.prev}
          </button>
          <button
            onClick={() => step < steps.length-1 ? setStep(step+1) : onClose()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {step < steps.length-1 ? t.next : t.finish}
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// ১৮. মূল কম্পোনেন্ট (CommunicationRoadmap)
// ------------------------------------------------------------
const CommunicationRoadmap = () => {
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || "bn");
  const [theme, setTheme] = useState(loadTheme);
  const [progress, setProgress] = useState(loadProgress);
  const [customMilestones, setCustomMilestones] = useState(loadCustomMilestones);
  const [points, setPoints] = useState(loadPoints);
  const [editingCustom, setEditingCustom] = useState(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(loadTourCompleted);
  const [showTour, setShowTour] = useState(!loadTourCompleted());
  const [focusMode, setFocusMode] = useState(loadFocusMode);
  const [reminderTime, setReminderTime] = useState(loadReminderTime);
  const [showHelp, setShowHelp] = useState(false);
  const [showBadgeGallery, setShowBadgeGallery] = useState(false);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  useEffect(() => {
    saveTheme(theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    saveProgress(progress);
    const allMilestones = getAllMilestones();
    const completedCount = allMilestones.filter(m => progress[m.id]?.completed).length;
    setPoints(completedCount);
    savePoints(completedCount);
  }, [progress]);

  useEffect(() => {
    saveFocusMode(focusMode);
  }, [focusMode]);

  useEffect(() => {
    saveReminderTime(reminderTime);
    if (reminderTime && Notification.permission === 'granted') {
      // Schedule daily reminder (simplified: show now for demo)
      // In a real app, you'd use a service worker or setInterval
      const now = new Date();
      const [hour, minute] = reminderTime.split(':').map(Number);
      const reminderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
      if (reminderDate < now) reminderDate.setDate(reminderDate.getDate() + 1);
      const timeout = reminderDate.getTime() - now.getTime();
      const timer = setTimeout(() => {
        new Notification(translations[lang].appTitle, {
          body: translations[lang].dailyNote,
        });
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [reminderTime, lang]);

  const getAllMilestones = useCallback(() => {
    const builtin = Object.values(roadmapData).flatMap(l => l.milestones);
    return [...builtin, ...customMilestones];
  }, [customMilestones]);

  const notes = loadNotes();
  const streak = calculateStreak(notes);
  const maxStreak = calculateMaxStreak(notes);
  const weeklyData = getWeeklyNoteCounts(notes);
  const totalNotes = Object.values(notes).reduce((acc, milestoneNotes) => acc + Object.keys(milestoneNotes).length, 0);
  const avgNotesPerWeek = (totalNotes / (weeklyData.length / 7)).toFixed(1);

  const handleToggleComplete = useCallback((milestoneId) => {
    setProgress(prev => {
      const current = prev[milestoneId] || {};
      const now = getTodayDate();
      const newCompleted = !current.completed;
      return {
        ...prev,
        [milestoneId]: {
          completed: newCompleted,
          startDate: current.startDate || (newCompleted ? now : current.startDate),
        },
      };
    });
  }, []);

  const handleAddCustom = (newMilestone) => {
    setCustomMilestones(prev => {
      const updated = [...prev, newMilestone];
      saveCustomMilestones(updated);
      return updated;
    });
    setShowCustomForm(false);
  };

  const handleUpdateCustom = (updatedMilestone) => {
    setCustomMilestones(prev => {
      const updated = prev.map(m => m.id === updatedMilestone.id ? updatedMilestone : m);
      saveCustomMilestones(updated);
      return updated;
    });
    setEditingCustom(null);
  };

  const handleDeleteCustom = (id) => {
    setCustomMilestones(prev => {
      const updated = prev.filter(m => m.id !== id);
      saveCustomMilestones(updated);
      return updated;
    });
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };

  const handleImport = (data) => {
    if (data.progress) setProgress(data.progress);
    if (data.notes) saveNotes(data.notes);
    if (data.custom) {
      setCustomMilestones(data.custom);
      saveCustomMilestones(data.custom);
    }
    if (data.points) setPoints(data.points);
  };

  const handleTourClose = () => {
    setShowTour(false);
    setTourCompleted(true);
    saveTourCompleted(true);
  };

  const t = translations[lang];
  const today = getTodayDate();
  const allMilestones = getAllMilestones();
  const totalMilestones = allMilestones.length;
  const completedMilestones = allMilestones.filter(m => progress[m.id]?.completed).length;
  const overallPercent = totalMilestones ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${theme === "dark" ? "dark" : ""}`}>
      {/* হেডার টুলবার */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <GamificationPanel points={points} milestonesCompleted={completedMilestones} streak={streak} />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg min-h-[44px]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️ " + t.lightMode : "🌙 " + t.darkMode}
          </button>
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`px-4 py-2 rounded-lg min-h-[44px] ${focusMode ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            aria-label="Toggle focus mode"
          >
            🎯 {focusMode ? t.focusMode + ' ON' : t.focusMode}
          </button>
          <button
            onClick={() => setShowBadgeGallery(!showBadgeGallery)}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg min-h-[44px]"
          >
            🏅 {t.badgeGallery}
          </button>
          <NotificationButton lang={lang} />
          <ShareProgress completed={completedMilestones} total={totalMilestones} lang={lang} />
          <DataBackup onImport={handleImport} lang={lang} />
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg min-h-[44px]"
            aria-label="Help"
          >
            ❓ {t.help}
          </button>
        </div>
      </div>

      {/* ব্যাজ গ্যালারি */}
      {showBadgeGallery && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2">{t.badgeGallery}</h3>
          <BadgeGallery milestonesCompleted={completedMilestones} lang={lang} />
        </div>
      )}

      {/* হেল্প প্যানেল */}
      {showHelp && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">{t.help}</h3>
            <button onClick={() => setShowHelp(false)} className="text-blue-600">✕</button>
          </div>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>{t.tourStep1}</li>
            <li>{t.tourStep2}</li>
            <li>{t.tourStep3}</li>
            <li>{t.tourStep4}</li>
            <li>{t.focusMode}: {t.hideCompleted}</li>
          </ul>
          <button
            onClick={() => { setShowHelp(false); setShowTour(true); }}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            {t.guidedTour}
          </button>
        </div>
      )}

      {/* মূল হেডার */}
      <div className="flex flex-col items-center justify-center gap-4 mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          🗣️ {t.appTitle}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          {t.appSubtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">📅 {t.today}:</span>
            <span className="text-base font-semibold text-indigo-800 dark:text-indigo-200">
              {formatDate(today, lang)}
            </span>
          </div>
          <button
            onClick={() => setLang(prev => prev === "bn" ? "en" : "bn")}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-2 text-gray-700 dark:text-gray-300 min-h-[44px]"
          >
            <span className="text-sm font-medium">{t.languageToggle}</span>
          </button>
        </div>
      </div>

      {/* সামগ্রিক প্রগ্রেস ও চার্ট */}
      <div className="mb-10 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border border-indigo-100 dark:border-gray-700 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                {t.overallProgress}
              </span>
              <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-full shadow-sm">
                {completedMilestones}/{totalMilestones} {t.milestones}
              </span>
            </div>
            <div className="relative h-3 w-full bg-white dark:bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
          <div className="w-full sm:w-64">
            <WeeklyChart data={weeklyData} lang={lang} />
          </div>
        </div>
      </div>

      {/* অতিরিক্ত পরিসংখ্যান */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500">{t.totalNotes}</p>
          <p className="text-2xl font-bold">{totalNotes}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500">{t.longestStreak}</p>
          <p className="text-2xl font-bold">{maxStreak} {t.days}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500">{t.avgNotesPerWeek}</p>
          <p className="text-2xl font-bold">{avgNotesPerWeek}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500">{t.points}</p>
          <p className="text-2xl font-bold">{points}</p>
        </div>
      </div>

      {/* দৈনিক রিমাইন্ডার সেটিং */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
        <span className="text-sm font-medium">{t.reminderTime}:</span>
        <input
          type="time"
          value={reminderTime || ''}
          onChange={(e) => setReminderTime(e.target.value)}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={() => {
            if (reminderTime) {
              if (Notification.permission !== 'granted') {
                Notification.requestPermission();
              }
              toast.success(t.reminderSet);
            }
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          {t.setReminder}
        </button>
      </div>

      {/* লেভেলগুলো */}
      <div className="space-y-8">
        {Object.entries(roadmapData).map(([key, data]) => (
          <LevelCard
            key={key}
            levelKey={key}
            levelData={data}
            progress={progress}
            onToggleComplete={handleToggleComplete}
            lang={lang}
            customMilestones={customMilestones.filter(m => m.level === key)}
            onEditCustom={setEditingCustom}
            onDeleteCustom={handleDeleteCustom}
            focusMode={focusMode}
          />
        ))}
      </div>

      {/* কাস্টম মাইলফলক ফর্ম */}
      <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{t.customMilestones}</h3>
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg min-h-[44px]"
          >
            {showCustomForm ? "−" : "+"} {t.addCustom}
          </button>
        </div>
        {showCustomForm && !editingCustom && (
          <CustomMilestoneForm
            levelKey="beginner"
            onAdd={handleAddCustom}
            onCancel={() => setShowCustomForm(false)}
          />
        )}
        {editingCustom && (
          <CustomMilestoneForm
            levelKey={editingCustom.level}
            onAdd={handleAddCustom}
            onUpdate={handleUpdateCustom}
            editingMilestone={editingCustom}
            onCancel={() => setEditingCustom(null)}
          />
        )}
      </div>

      {/* গাইডেড ট্যুর */}
      {showTour && <GuidedTour onClose={handleTourClose} lang={lang} />}

      {/* টাচ টার্গেটের জন্য সিএসএস */}
      <style>{`
        button, a, [role="button"], select, input { min-height: 44px; min-width: 44px; }
        @media (max-width: 640px) {
          .grid { gap: 0.75rem; }
        }
      `}</style>
    </div>
  );
};

export default CommunicationRoadmap;