import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Layout,
  Server,
  Database,
  Cloud,
  Terminal,
  Award,
  TrendingUp,
  RefreshCw,
  Clock,
  Zap,
  BarChart,
  Calendar,
  Target,
  Code,
  GitBranch,
  Settings,
  Shield,
  Globe,
  Layers,
  Box,
  Cpu,
  Network,
  Lock,
  Rocket,
  Lightbulb,
  Brain,
  Bell,
  Edit3,
  Save,
  X,
  PieChart,
  Bookmark,
  Map,
  Star,
  Sparkles,
  Monitor,
  HardDrive,
  Key,
  Fingerprint,
  Radio,
  Wifi,
  Cctv,
  Cpu as CpuIcon,
  Sigma,
  LineChart,
  ScatterChart,
  Workflow,
  Eye,
  EyeOff,
  MessageSquare,
  Megaphone,
  BarChart3,
  Users,
  Share2,
  Mail,
  Search,
  PenTool,
  Video,
  ShoppingCart,
  DollarSign,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  Award as AwardIcon,
  Medal,
  Trophy,
  Home,
  Printer,
  Youtube,
  BookmarkPlus,
  BookmarkCheck,
  HelpCircle
} from 'lucide-react';

// ----------------------------------------------------------------------
// হেল্পার ফাংশন: কুইজ জেনারেটর (সিম্পল)
// ----------------------------------------------------------------------
const generateQuiz = (topicTitle, resources) => {
  const words = (topicTitle + ' ' + resources).split(/[ ,.]+/).filter(w => w.length > 3);
  const questions = [];
  for (let i = 0; i < 5; i++) {
    const randomWord = words[Math.floor(Math.random() * words.length)] || 'Concept';
    const correctAnswer = randomWord;
    const options = [
      correctAnswer,
      words[Math.floor(Math.random() * words.length)] || 'Option A',
      words[Math.floor(Math.random() * words.length)] || 'Option B',
      words[Math.floor(Math.random() * words.length)] || 'Option C'
    ];
    const shuffled = options.sort(() => 0.5 - Math.random());
    questions.push({
      question: `What is ${randomWord}?`,
      options: shuffled,
      answer: correctAnswer
    });
  }
  return questions;
};

// ----------------------------------------------------------------------
// কুইজ মডাল কম্পোনেন্ট
// ----------------------------------------------------------------------
const QuizModal = ({ topic, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const q = generateQuiz(topic.title, topic.resources);
    setQuestions(q);
  }, [topic]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === questions[currentIndex].answer) {
      setScore(score + 1);
    }
    setSelectedOption(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (questions.length === 0) {
    return <div className="p-8 text-center">Generating quiz...</div>;
  }

  if (showResult) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz Result</h2>
          <p className="text-lg mb-4">
            You scored <span className="font-bold text-indigo-600">{score}</span> out of {questions.length}
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quiz: {topic.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Question {currentIndex + 1} of {questions.length}</p>
        <div className="mb-6">
          <p className="text-lg text-gray-800 dark:text-gray-200 mb-3">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(opt)}
                className={`w-full text-left px-4 py-2 rounded-lg border transition ${
                  selectedOption === opt
                    ? 'bg-indigo-100 border-indigo-500 dark:bg-indigo-900/30 dark:border-indigo-400'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentIndex + 1 === questions.length ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// ভিডিও লিংক মডাল
// ----------------------------------------------------------------------
const VideoLinksModal = ({ topic, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Resources for {topic.title}</h2>
        {topic.videoLinks && topic.videoLinks.length > 0 ? (
          <ul className="space-y-2 mb-4">
            {topic.videoLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2"
                >
                  <Youtube size={16} />
                  {link.title || link.url}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-4">No video links available for this topic.</p>
        )}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// টপিক কার্ড (নতুন ফিচার সহ)
// ----------------------------------------------------------------------
const TopicCard = ({ topic, sectionId, onToggle, onSaveNote, onBookmark, areDependenciesMet }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const handleVideoClick = (e) => {
    e.stopPropagation();
    setShowVideoModal(true);
  };

  const handleQuizClick = (e) => {
    e.stopPropagation();
    setShowQuizModal(true);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    onBookmark(sectionId, topic.id);
  };

  return (
    <>
      <div className={`flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${
        topic.completed ? 'border-green-200 dark:border-green-800' : 'border-gray-100 dark:border-gray-700'
      } hover:shadow-md transition-all ${!topic.completed && !areDependenciesMet ? 'opacity-60' : ''}`}>
        <button
          onClick={onToggle}
          disabled={!topic.completed && !areDependenciesMet}
          className="flex-shrink-0 mt-0.5 disabled:cursor-not-allowed"
        >
          {topic.completed ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : !areDependenciesMet ? (
            <Lock className="w-5 h-5 text-gray-400" />
          ) : (
            <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500" />
          )}
        </button>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className={`font-medium ${topic.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
              {topic.title}
            </h4>
            <div className="flex items-center gap-1">
              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                {topic.time} hr
              </span>
              {/* বুকমার্ক আইকন */}
              <button
                onClick={handleBookmarkClick}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title={topic.bookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                {topic.bookmarked ? (
                  <BookmarkCheck size={16} className="text-indigo-600" />
                ) : (
                  <BookmarkPlus size={16} className="text-gray-500" />
                )}
              </button>
              {/* ভিডিও আইকন (যদি ভিডিও লিংক থাকে) */}
              {topic.videoLinks && topic.videoLinks.length > 0 && (
                <button
                  onClick={handleVideoClick}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  title="View resources"
                >
                  <Youtube size={16} className="text-red-500" />
                </button>
              )}
              {/* কুইজ আইকন (যদি টপিক কমপ্লিট হয়) */}
              {topic.completed && (
                <button
                  onClick={handleQuizClick}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  title="Take quiz"
                >
                  <HelpCircle size={16} className="text-green-600" />
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {topic.resources}
          </p>
          <NoteEditor topic={topic} sectionId={sectionId} onSave={onSaveNote} />
          {topic.dependsOn && topic.dependsOn.length > 0 && !topic.completed && (
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
              <GitBranch size={10} />
              Depends on: {topic.dependsOn.join(', ')}
            </div>
          )}
        </div>
      </div>
      {showVideoModal && (
        <VideoLinksModal topic={topic} onClose={() => setShowVideoModal(false)} />
      )}
      {showQuizModal && (
        <QuizModal topic={topic} onClose={() => setShowQuizModal(false)} />
      )}
    </>
  );
};

// ----------------------------------------------------------------------
// নোট এডিটর
// ----------------------------------------------------------------------
const NoteEditor = ({ topic, sectionId, onSave }) => {
  const [note, setNote] = useState(topic.notes || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(sectionId, topic.id, note);
    setIsEditing(false);
    toast.success('Note saved');
  };

  if (!isEditing) {
    return (
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
        <Bookmark size={12} className="mt-0.5 flex-shrink-0" />
        <span className="flex-1 line-clamp-2">{topic.notes || 'No notes yet.'}</span>
        <button onClick={() => setIsEditing(true)} className="text-indigo-600 dark:text-indigo-400 hover:underline">
          <Edit3 size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full text-xs p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
        rows={2}
        placeholder="Add your notes or resources..."
      />
      <div className="flex gap-2 mt-1">
        <button onClick={handleSave} className="text-xs bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-green-700 transition">
          <Save size={10} /> Save
        </button>
        <button onClick={() => setIsEditing(false)} className="text-xs bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-400 dark:hover:bg-gray-500 transition">
          <X size={10} /> Cancel
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// টাইমলাইন ভিউ
// ----------------------------------------------------------------------
const TimelineView = ({ sections }) => {
  const completedTopics = useMemo(() => {
    const topics = [];
    sections.forEach(section => {
      section.topics.forEach(topic => {
        if (topic.completed && topic.completedAt) {
          topics.push({
            ...topic,
            sectionTitle: section.title,
            date: new Date(topic.completedAt)
          });
        }
      });
    });
    return topics.sort((a, b) => a.date - b.date);
  }, [sections]);

  if (completedTopics.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 text-sm">No completed topics yet.</p>;
  }

  const grouped = completedTopics.reduce((acc, topic) => {
    const monthYear = topic.date.toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(topic);
    return acc;
  }, {});

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      {Object.entries(grouped).map(([month, topics]) => (
        <div key={month}>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{month}</h4>
          <div className="space-y-2">
            {topics.map(topic => (
              <div key={topic.id} className="flex items-start gap-2 text-xs bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow transition">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">{topic.title}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">({topic.sectionTitle})</span>
                  <div className="text-gray-400 dark:text-gray-500">
                    {topic.date.toLocaleDateString()} at {topic.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ----------------------------------------------------------------------
// রিমাইন্ডার সেটিংস
// ----------------------------------------------------------------------
const ReminderSettings = ({ dailyStudyHours }) => {
  const [permission, setPermission] = useState(Notification.permission);
  const [reminderTime, setReminderTime] = useState(() => {
    const saved = localStorage.getItem('reminderTime');
    return saved || '09:00';
  });
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem('reminderEnabled');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('reminderTime', reminderTime);
  }, [reminderTime]);

  useEffect(() => {
    localStorage.setItem('reminderEnabled', JSON.stringify(enabled));
  }, [enabled]);

  const requestPermission = () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications.');
      return;
    }
    Notification.requestPermission().then(perm => {
      setPermission(perm);
      if (perm === 'granted') {
        toast.success('Notifications enabled!');
      }
    });
  };

  useEffect(() => {
    if (!enabled || permission !== 'granted') return;

    const checkAndNotify = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      if (currentTime === reminderTime) {
        const lastNotifDate = localStorage.getItem('lastReminderDate');
        const today = now.toDateString();
        if (lastNotifDate !== today) {
          new Notification('Time to study!', {
            body: `Your daily goal is ${dailyStudyHours} hours. Keep learning!`,
            icon: '/favicon.ico'
          });
          localStorage.setItem('lastReminderDate', today);
        }
      }
    };

    const interval = setInterval(checkAndNotify, 60000);
    return () => clearInterval(interval);
  }, [enabled, permission, reminderTime, dailyStudyHours]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Bell size={18} className="text-indigo-500" />
          Daily Reminder
        </h4>
        {permission === 'granted' ? (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Enabled</span>
        ) : (
          <button onClick={requestPermission} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition">
            Allow Notifications
          </button>
        )}
      </div>
      {permission === 'granted' && (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Enable daily reminder</span>
          </label>
          {enabled && (
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Reminder time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// প্রোজেক্ট সুপারিশ
// ----------------------------------------------------------------------
const ProjectSuggestions = ({ sections, projects }) => {
  const completedTopicIds = useMemo(() => {
    const ids = new Set();
    sections.forEach(section => {
      section.topics.forEach(topic => {
        if (topic.completed) ids.add(topic.id);
      });
    });
    return ids;
  }, [sections]);

  const availableProjects = projects.filter(project =>
    project.requiredTopics.every(topicId => completedTopicIds.has(topicId))
  );

  if (availableProjects.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Complete more topics to see project suggestions.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {availableProjects.map(project => (
        <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800 shadow-sm hover:shadow-md transition">
          <h4 className="font-bold text-gray-900 dark:text-white">{project.title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
              {project.difficulty}
            </span>
            <a href={project.link} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View details →</a>
          </div>
        </div>
      ))}
    </div>
  );
};

// ----------------------------------------------------------------------
// ব্যাজ কম্পোনেন্ট
// ----------------------------------------------------------------------
const Badge = ({ title, earned }) => (
  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
    earned ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500'
  }`}>
    <Medal size={12} />
    <span>{title}</span>
  </div>
);

// ----------------------------------------------------------------------
// সার্টিফিকেট কম্পোনেন্ট
// ----------------------------------------------------------------------
const CertificateModal = ({ trackTitle, onClose }) => {
  const userName = localStorage.getItem('userName') || 'Arsad';
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full p-8 shadow-2xl">
        <div id="certificate" className="text-center p-8 border-8 border-double border-indigo-600 dark:border-indigo-400 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Certificate of Completion</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">This is to certify that</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">{userName}</p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">has successfully completed the</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{trackTitle} Track</p>
          <p className="text-md text-gray-500 dark:text-gray-500 mb-8">on {date}</p>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="font-bold text-gray-700 dark:text-gray-300">Arsad</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-700 dark:text-gray-300">Arsad Day Planner</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Platform</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Printer size={16} />
            Print / Save as PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// সেফ আইকন
// ----------------------------------------------------------------------
const SafeIcon = ({ icon: Icon, className }) => {
  const Component = Icon && typeof Icon === 'function' ? Icon : BookOpen;
  return <Component className={className} />;
};

// ----------------------------------------------------------------------
// ওয়েব ডেভেলপমেন্ট ডেটা (ভিডিও লিংক সহ)
// ----------------------------------------------------------------------
const webDevData = {
  id: 'web',
  title: 'Web Development',
  icon: Layout,
  color: 'from-blue-500 to-indigo-600',
  sections: [
    {
      id: 'frontend',
      title: 'Frontend Development',
      icon: Layout,
      color: 'from-blue-400 to-indigo-500',
      lightBg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800',
      topics: [
        { id: 'html', title: 'HTML5', resources: 'MDN, W3Schools', time: 10, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/UB1O30fR-EE', title: 'HTML Crash Course - Traversy Media' },
            { url: 'https://youtu.be/pQN-pnXPaVg', title: 'HTML Full Course - freeCodeCamp' }
          ], 
          bookmarked: false },
        { id: 'css', title: 'CSS3', resources: 'Flexbox, Grid, Animations', time: 15, completed: false, completedAt: null, dependsOn: ['html'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/yfoY53QXEnI', title: 'CSS Crash Course - Traversy Media' },
            { url: 'https://youtu.be/1Rs2ND1ryYc', title: 'CSS Full Course - freeCodeCamp' }
          ], 
          bookmarked: false },
        { id: 'js', title: 'JavaScript (ES6+)', resources: 'Variables, Functions, DOM, Async', time: 40, completed: false, completedAt: null, dependsOn: ['html', 'css'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/hdI2bqOjy3c', title: 'JavaScript Crash Course - Traversy Media' },
            { url: 'https://youtu.be/PkZNo7MFNFg', title: 'JavaScript Full Course - freeCodeCamp' }
          ], 
          bookmarked: false },
        { id: 'responsive', title: 'Responsive Design', resources: 'Media Queries, Mobile-first', time: 8, completed: false, completedAt: null, dependsOn: ['css'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/srvUrASNj0s', title: 'Responsive Design Tutorial - freeCodeCamp' }
          ], 
          bookmarked: false },
        { id: 'git', title: 'Git & GitHub', resources: 'Basic commands, Repositories', time: 6, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/SWYqp7iY_Tc', title: 'Git Crash Course - Traversy Media' }
          ], 
          bookmarked: false },
        { id: 'react', title: 'React.js', resources: 'Components, Hooks, Router, State', time: 35, completed: false, completedAt: null, dependsOn: ['js'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/w7ejDZ8SWv8', title: 'React Crash Course - Traversy Media' },
            { url: 'https://youtu.be/bMknfKXIFA8', title: 'React Full Course - freeCodeCamp' }
          ], 
          bookmarked: false },
        { id: 'next', title: 'Next.js', resources: 'SSR, SSG, API routes', time: 20, completed: false, completedAt: null, dependsOn: ['react'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/mTz0GXj8NN0', title: 'Next.js Crash Course - Traversy Media' }
          ], 
          bookmarked: false },
        { id: 'tailwind', title: 'Tailwind CSS', resources: 'Utility classes, Customization', time: 12, completed: false, completedAt: null, dependsOn: ['css'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/UBOj6rqRUME', title: 'Tailwind CSS Crash Course - Traversy Media' }
          ], 
          bookmarked: false },
        { id: 'typescript', title: 'TypeScript', resources: 'Types, Interfaces, Generics', time: 18, completed: false, completedAt: null, dependsOn: ['js'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/BCg4U1FzODs', title: 'TypeScript Crash Course - Traversy Media' }
          ], 
          bookmarked: false },
        { id: 'testing', title: 'Testing (Jest, RTL)', resources: 'Unit tests, Integration tests', time: 14, completed: false, completedAt: null, dependsOn: ['react', 'js'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/7r4xVDI2vho', title: 'Jest Crash Course - Traversy Media' }
          ], 
          bookmarked: false }
      ]
    },
    {
      id: 'backend',
      title: 'Python Django Advanced',
      icon: Rocket,
      color: 'from-green-600 to-emerald-700',
      lightBg: 'bg-green-50',
      darkBg: 'dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800',
      topics: [
        { id: 'python-advanced', title: 'Advanced Python', resources: 'Metaclasses, Decorators, Generators', time: 20, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/HGOBQPFzWKo', title: 'Python OOP - Corey Schafer' },
            { url: 'https://youtu.be/rq8cL2XMM5M', title: 'Python Generators - Corey Schafer' }
          ], 
          bookmarked: false },
        { id: 'django-advanced-models', title: 'Advanced Django Models', resources: 'Custom Managers, Proxy Models', time: 15, completed: false, completedAt: null, dependsOn: ['python-advanced'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/F5mRW0jo-U4', title: 'Django Models - Corey Schafer' }
          ], 
          bookmarked: false },
        { id: 'django-advanced-queries', title: 'Complex Database Queries', resources: 'Q objects, F expressions, Prefetch', time: 12, completed: false, completedAt: null, dependsOn: ['django-advanced-models'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/6L_HqB7y_qw', title: 'Django Queries - Corey Schafer' }
          ], 
          bookmarked: false },
        { id: 'django-custom-validators', title: 'Custom Validators & Fields', resources: 'Model/Form validators', time: 8, completed: false, completedAt: null, dependsOn: ['django-advanced-models'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-signals', title: 'Signals & Event Hooks', resources: 'Pre/Post save, m2m_changed', time: 10, completed: false, completedAt: null, dependsOn: ['django-advanced-models'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/8d5tyyL7zB4', title: 'Django Signals - Corey Schafer' }
          ], 
          bookmarked: false },
        { id: 'django-middleware', title: 'Custom Middleware', resources: 'Process request/response', time: 8, completed: false, completedAt: null, dependsOn: ['django-advanced-models'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-class-based-views', title: 'Class‑Based Views Mastery', resources: 'Mixins, Generic views', time: 12, completed: false, completedAt: null, dependsOn: ['django-advanced-models'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/Re3tA2lW2zE', title: 'Django Class-Based Views - Corey Schafer' }
          ], 
          bookmarked: false },
        { id: 'django-rest-advanced', title: 'Django REST Framework Advanced', resources: 'Custom permissions, Throttling, Versioning', time: 20, completed: false, completedAt: null, dependsOn: ['django-advanced-models', 'python-advanced'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/Uyei2iDA4Hs', title: 'Django REST Framework - Corey Schafer' }
          ], 
          bookmarked: false },
        { id: 'django-rest-viewsets', title: 'ViewSets & Routers', resources: 'ModelViewSet, Custom actions', time: 10, completed: false, completedAt: null, dependsOn: ['django-rest-advanced'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-rest-filtering', title: 'Advanced Filtering & Search', resources: 'django-filter, SearchFilter', time: 8, completed: false, completedAt: null, dependsOn: ['django-rest-advanced'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-rest-pagination', title: 'Pagination Strategies', resources: 'CursorPagination, Custom paginators', time: 6, completed: false, completedAt: null, dependsOn: ['django-rest-advanced'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-query-optimization', title: 'Database Query Optimization', resources: 'Select_related, Prefetch_related', time: 12, completed: false, completedAt: null, dependsOn: ['django-advanced-queries'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-caching', title: 'Caching Strategies', resources: 'Memcached, Redis, Cache API', time: 12, completed: false, completedAt: null, dependsOn: ['django-advanced-models'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-db-indexing', title: 'Database Indexing', resources: 'Composite indexes, Partial indexes', time: 10, completed: false, completedAt: null, dependsOn: ['django-advanced-queries'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-connection-pooling', title: 'Connection Pooling', resources: 'pgBouncer, Pgpool', time: 8, completed: false, completedAt: null, dependsOn: ['django-advanced-models'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-async', title: 'Asynchronous Django (ASGI)', resources: 'Async views, Async ORM', time: 14, completed: false, completedAt: null, dependsOn: ['python-advanced'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-channels-advanced', title: 'Django Channels & WebSockets', resources: 'ASGI, Consumers, Groups', time: 16, completed: false, completedAt: null, dependsOn: ['django-async'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/rw_4FhKp0fE', title: 'Django Channels - Corey Schafer' }
          ], 
          bookmarked: false },
        { id: 'django-celery', title: 'Celery & Background Tasks', resources: 'Task queues, Periodic tasks', time: 14, completed: false, completedAt: null, dependsOn: ['django-advanced-models'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-celery-beat', title: 'Scheduled Tasks with Celery Beat', resources: 'Crontab schedules', time: 8, completed: false, completedAt: null, dependsOn: ['django-celery'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-file-optimization', title: 'File & Image Optimization', resources: 'Pillow, Cloudinary', time: 10, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-security-owasp', title: 'OWASP Top 10 Implementation', resources: 'SQL Injection, XSS, CSRF', time: 12, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-auth-advanced', title: 'Advanced Authentication', resources: 'JWT, OAuth2, MFA', time: 16, completed: false, completedAt: null, dependsOn: ['django-rest-advanced'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-permissions', title: 'Advanced Permissions', resources: 'Object-level permissions', time: 10, completed: false, completedAt: null, dependsOn: ['django-rest-advanced'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-rate-limiting', title: 'Rate Limiting & Throttling', resources: 'django-ratelimit', time: 8, completed: false, completedAt: null, dependsOn: ['django-rest-advanced'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-audit-logging', title: 'Audit Logging', resources: 'django-auditlog', time: 8, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-microservices', title: 'Microservices with Django', resources: 'Service decomposition', time: 16, completed: false, completedAt: null, dependsOn: ['django-rest-advanced', 'django-caching'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-event-driven', title: 'Event‑Driven Architecture', resources: 'RabbitMQ, Kafka', time: 14, completed: false, completedAt: null, dependsOn: ['django-celery'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-graphql', title: 'GraphQL with Django', resources: 'graphene-django, Strawberry', time: 16, completed: false, completedAt: null, dependsOn: ['django-rest-advanced'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-elasticsearch', title: 'Elasticsearch Integration', resources: 'django-elasticsearch-dsl', time: 12, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-multitenancy', title: 'Multi‑tenancy', resources: 'django-tenants', time: 12, completed: false, completedAt: null, dependsOn: ['django-advanced-models'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-testing-advanced', title: 'Advanced Testing', resources: 'Pytest, Factories, Mocking', time: 14, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-behave', title: 'BDD with Behave', resources: 'Feature files, Steps', time: 8, completed: false, completedAt: null, dependsOn: ['django-testing-advanced'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-load-testing', title: 'Load & Stress Testing', resources: 'Locust, k6', time: 10, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-deployment-advanced', title: 'Advanced Deployment', resources: 'Docker multi‑stage, Kubernetes', time: 18, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-serverless', title: 'Serverless Django', resources: 'Zappa, AWS Lambda', time: 12, completed: false, completedAt: null, dependsOn: ['django-deployment-advanced'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-ci-cd', title: 'CI/CD Pipelines', resources: 'GitHub Actions, GitLab CI', time: 14, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-monitoring', title: 'Monitoring & Observability', resources: 'Sentry, Prometheus, Grafana', time: 12, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-logging', title: 'Centralized Logging', resources: 'ELK stack, Loki', time: 10, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-code-review', title: 'Code Review & Refactoring', resources: 'SOLID principles', time: 10, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'django-contribution', title: 'Open Source Contribution', resources: 'Django core contribution', time: 12, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'database',
      title: 'Database & Data',
      icon: Database,
      color: 'from-purple-400 to-pink-500',
      lightBg: 'bg-purple-50',
      darkBg: 'dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
      borderColor: 'border-purple-200 dark:border-purple-800',
      topics: [
        { id: 'sql-fund', title: 'SQL Fundamentals', resources: 'SELECT, JOIN, GROUP BY', time: 12, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/7S_tz1z_5bA', title: 'MySQL Tutorial - freeCodeCamp' }
          ], 
          bookmarked: false },
        { id: 'schema', title: 'Database Design', resources: 'Normalization, ER Diagrams', time: 10, completed: false, completedAt: null, dependsOn: ['sql-fund'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'indexing', title: 'Indexing & Performance', resources: 'Query optimization', time: 8, completed: false, completedAt: null, dependsOn: ['sql-fund'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'postgresql', title: 'PostgreSQL Advanced', resources: 'JSONB, Full-text search, Replication', time: 14, completed: false, completedAt: null, dependsOn: ['sql-fund'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'redis', title: 'Redis', resources: 'Caching, Pub/Sub', time: 8, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'mongodb', title: 'MongoDB', resources: 'NoSQL, Aggregation', time: 8, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'devops',
      title: 'DevOps & Deployment',
      icon: Cloud,
      color: 'from-orange-400 to-red-500',
      lightBg: 'bg-orange-50',
      darkBg: 'dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
      borderColor: 'border-orange-200 dark:border-orange-800',
      topics: [
        { id: 'hosting', title: 'Web Hosting', resources: 'PythonAnywhere, Heroku', time: 4, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'vps', title: 'VPS (AWS, DigitalOcean)', resources: 'EC2, Nginx, Gunicorn', time: 12, completed: false, completedAt: null, dependsOn: ['hosting'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/0y6i6j7Qv1g', title: 'AWS EC2 Tutorial - freeCodeCamp' }
          ], 
          bookmarked: false },
        { id: 'docker', title: 'Docker', resources: 'Containers, Dockerfile, Compose', time: 10, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/3c-iBn73dDE', title: 'Docker Tutorial - freeCodeCamp' }
          ], 
          bookmarked: false },
        { id: 'ci-cd', title: 'CI/CD', resources: 'GitHub Actions, GitLab CI', time: 8, completed: false, completedAt: null, dependsOn: ['docker', 'git'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/R8_veQiYBjI', title: 'GitHub Actions - freeCodeCamp' }
          ], 
          bookmarked: false },
        { id: 'monitoring', title: 'Monitoring & Logging', resources: 'Sentry, Prometheus', time: 6, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'security', title: 'Web Security', resources: 'HTTPS, CORS, CSRF, XSS', time: 8, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'performance', title: 'Performance Optimization', resources: 'Lighthouse, CDN', time: 8, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'tools',
      title: 'Development Tools',
      icon: Terminal,
      color: 'from-gray-400 to-slate-500',
      lightBg: 'bg-gray-50',
      darkBg: 'dark:bg-gray-800/50',
      textColor: 'text-gray-700 dark:text-gray-300',
      borderColor: 'border-gray-200 dark:border-gray-700',
      topics: [
        { id: 'vscode', title: 'VS Code', resources: 'Extensions, Shortcuts', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'terminal', title: 'Command Line', resources: 'Bash, Zsh', time: 5, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'postman', title: 'Postman/Insomnia', resources: 'API testing', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'figma', title: 'Figma', resources: 'Design handoff', time: 4, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'chrome-dev', title: 'Chrome DevTools', resources: 'Debugging, Performance', time: 5, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'pycharm', title: 'PyCharm / VS Code Python', resources: 'Python IDE features', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'soft-skills',
      title: 'Soft Skills',
      icon: Award,
      color: 'from-amber-400 to-yellow-500',
      lightBg: 'bg-amber-50',
      darkBg: 'dark:bg-amber-900/20',
      textColor: 'text-amber-700 dark:text-amber-300',
      borderColor: 'border-amber-200 dark:border-amber-800',
      topics: [
        { id: 'communication', title: 'Communication', resources: 'Technical writing, Presentations', time: 6, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'teamwork', title: 'Teamwork', resources: 'Code reviews, Collaboration', time: 5, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'problem-solving', title: 'Problem Solving', resources: 'Algorithms, Debugging', time: 10, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'time-management', title: 'Time Management', resources: 'Prioritization, Deadlines', time: 4, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'learning', title: 'Continuous Learning', resources: 'Documentation, Blogs', time: 8, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    }
  ]
};

// ওয়েব প্রোজেক্ট
const webProjects = [
  {
    id: 'static-site',
    title: 'Personal Portfolio (Static)',
    description: 'HTML, CSS, and a bit of JavaScript to showcase your work.',
    requiredTopics: ['html', 'css', 'js'],
    difficulty: 'Beginner',
    link: '#'
  },
  {
    id: 'react-app',
    title: 'React Todo App',
    description: 'Build a task manager with React hooks and local storage.',
    requiredTopics: ['html', 'css', 'js', 'react'],
    difficulty: 'Intermediate',
    link: '#'
  },
  {
    id: 'fullstack-blog',
    title: 'Full‑Stack Blog with Django',
    description: 'Create a blog with Django REST framework and React.',
    requiredTopics: [
      'python-advanced', 'django-advanced-models', 'django-rest-advanced',
      'react', 'tailwind', 'docker'
    ],
    difficulty: 'Advanced',
    link: '#'
  },
  {
    id: 'realtime-chat',
    title: 'Real‑time Chat with Channels',
    description: 'Use Django Channels and WebSockets for a chat app.',
    requiredTopics: [
      'django-advanced-models', 'django-channels-advanced', 'django-caching', 'redis'
    ],
    difficulty: 'Advanced',
    link: '#'
  }
];

// ----------------------------------------------------------------------
// ইথিক্যাল হ্যাকিং ডেটা (ভিডিও লিংক সহ)
// ----------------------------------------------------------------------
const ethicalHackingData = {
  id: 'ethical',
  title: 'Ethical Hacking',
  icon: Shield,
  color: 'from-red-500 to-rose-600',
  sections: [
    {
      id: 'networking',
      title: 'Networking Basics',
      icon: Radio,
      color: 'from-blue-500 to-cyan-500',
      lightBg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800',
      topics: [
        { id: 'osi-model', title: 'OSI Model', resources: 'Layers, Protocols', time: 4, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/2k7N92t4PRs', title: 'OSI Model - NetworkChuck' }
          ], 
          bookmarked: false },
        { id: 'ip-address', title: 'IP Addressing & Subnetting', resources: 'IPv4, IPv6, CIDR', time: 6, completed: false, completedAt: null, dependsOn: ['osi-model'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/5WfiTHiU4x8', title: 'Subnetting - NetworkChuck' }
          ], 
          bookmarked: false },
        { id: 'tcp-udp', title: 'TCP/UDP', resources: 'Ports, Handshake, Flags', time: 5, completed: false, completedAt: null, dependsOn: ['ip-address'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'dns', title: 'DNS & DHCP', resources: 'Domain resolution, Dynamic IP', time: 4, completed: false, completedAt: null, dependsOn: ['ip-address'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'routing', title: 'Routing & Switching', resources: 'Routers, Switches, VLANs', time: 6, completed: false, completedAt: null, dependsOn: ['ip-address'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'web-security',
      title: 'Web Application Security',
      icon: Shield,
      color: 'from-red-500 to-rose-500',
      lightBg: 'bg-red-50',
      darkBg: 'dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-800',
      topics: [
        { id: 'owasp-top10', title: 'OWASP Top 10', resources: 'A1-Injection, A2-Broken Auth, ...', time: 8, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/GpXIsjH3GrE', title: 'OWASP Top 10 - The Cyber Mentor' }
          ], 
          bookmarked: false },
        { id: 'sql-injection', title: 'SQL Injection', resources: 'Manual & automated testing, prevention', time: 6, completed: false, completedAt: null, dependsOn: ['owasp-top10'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/2OPVViV-gQk', title: 'SQL Injection - The Cyber Mentor' }
          ], 
          bookmarked: false },
        { id: 'xss', title: 'Cross-Site Scripting (XSS)', resources: 'Reflected, Stored, DOM-based', time: 5, completed: false, completedAt: null, dependsOn: ['owasp-top10'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/EoaDgUgS6QA', title: 'XSS - The Cyber Mentor' }
          ], 
          bookmarked: false },
        { id: 'csrf', title: 'CSRF', resources: 'How it works, tokens, SameSite', time: 4, completed: false, completedAt: null, dependsOn: ['owasp-top10'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'auth-hacking', title: 'Authentication Hacking', resources: 'Brute force, Session hijacking, MFA bypass', time: 7, completed: false, completedAt: null, dependsOn: ['owasp-top10'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'file-upload', title: 'File Upload Vulnerabilities', resources: 'Malicious files, MIME types', time: 4, completed: false, completedAt: null, dependsOn: ['owasp-top10'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'ssrf', title: 'Server-Side Request Forgery', resources: 'Exploitation, bypass', time: 5, completed: false, completedAt: null, dependsOn: ['owasp-top10'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'cryptography',
      title: 'Cryptography',
      icon: Lock,
      color: 'from-purple-500 to-pink-500',
      lightBg: 'bg-purple-50',
      darkBg: 'dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
      borderColor: 'border-purple-200 dark:border-purple-800',
      topics: [
        { id: 'symmetric', title: 'Symmetric Encryption', resources: 'AES, DES, 3DES', time: 5, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'asymmetric', title: 'Asymmetric Encryption', resources: 'RSA, ECC, Diffie-Hellman', time: 6, completed: false, completedAt: null, dependsOn: ['symmetric'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'hashing', title: 'Hashing Algorithms', resources: 'MD5, SHA, bcrypt', time: 4, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'digital-signature', title: 'Digital Signatures', resources: 'PKI, Certificates', time: 5, completed: false, completedAt: null, dependsOn: ['asymmetric'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'ssl-tls', title: 'SSL/TLS', resources: 'Handshake, Certificates, HTTPS', time: 6, completed: false, completedAt: null, dependsOn: ['asymmetric'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'pentesting',
      title: 'Penetration Testing',
      icon: Eye,
      color: 'from-orange-500 to-amber-500',
      lightBg: 'bg-orange-50',
      darkBg: 'dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
      borderColor: 'border-orange-200 dark:border-orange-800',
      topics: [
        { id: 'recon', title: 'Reconnaissance', resources: 'OSINT, WHOIS, subdomain enumeration', time: 6, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/uKl3zOKXa1M', title: 'Reconnaissance - IppSec' }
          ], 
          bookmarked: false },
        { id: 'scanning', title: 'Scanning & Enumeration', resources: 'Nmap, Nessus, Nikto', time: 7, completed: false, completedAt: null, dependsOn: ['recon'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/4t4kBkmsDbQ', title: 'Nmap - NetworkChuck' }
          ], 
          bookmarked: false },
        { id: 'exploitation', title: 'Exploitation', resources: 'Metasploit, manual exploitation', time: 8, completed: false, completedAt: null, dependsOn: ['scanning', 'sql-injection'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/8lR27r8YqRk', title: 'Metasploit - The Cyber Mentor' }
          ], 
          bookmarked: false },
        { id: 'post-exploit', title: 'Post-Exploitation', resources: 'Privilege escalation, persistence', time: 6, completed: false, completedAt: null, dependsOn: ['exploitation'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'reporting', title: 'Reporting', resources: 'Findings, remediation, documentation', time: 5, completed: false, completedAt: null, dependsOn: ['post-exploit'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'tools',
      title: 'Hacking Tools',
      icon: Terminal,
      color: 'from-gray-500 to-slate-500',
      lightBg: 'bg-gray-50',
      darkBg: 'dark:bg-gray-800/50',
      textColor: 'text-gray-700 dark:text-gray-300',
      borderColor: 'border-gray-200 dark:border-gray-700',
      topics: [
        { id: 'nmap', title: 'Nmap', resources: 'Port scanning, scripts', time: 5, completed: false, completedAt: null, dependsOn: ['scanning'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'burp-suite', title: 'Burp Suite', resources: 'Proxy, Repeater, Intruder, Scanner', time: 6, completed: false, completedAt: null, dependsOn: ['web-security'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/G3hpAeoZ4ek', title: 'Burp Suite - The Cyber Mentor' }
          ], 
          bookmarked: false },
        { id: 'metasploit', title: 'Metasploit', resources: 'Framework, modules, meterpreter', time: 7, completed: false, completedAt: null, dependsOn: ['exploitation'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'wireshark', title: 'Wireshark', resources: 'Packet analysis, filters', time: 5, completed: false, completedAt: null, dependsOn: ['networking'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'john-hydra', title: 'John the Ripper & Hydra', resources: 'Password cracking, brute force', time: 5, completed: false, completedAt: null, dependsOn: ['auth-hacking'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'sqlmap', title: 'SQLmap', resources: 'Automated SQL injection', time: 4, completed: false, completedAt: null, dependsOn: ['sql-injection'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    }
  ]
};

const ethicalProjects = [
  {
    id: 'web-audit',
    title: 'Web Application Security Audit',
    description: 'Perform a security audit on a test website using OWASP ZAP or Burp Suite.',
    requiredTopics: ['owasp-top10', 'sql-injection', 'xss', 'csrf', 'burp-suite'],
    difficulty: 'Intermediate',
    link: '#'
  },
  {
    id: 'network-scan',
    title: 'Network Scan & Vulnerability Assessment',
    description: 'Scan your home network with Nmap and Nessus, identify vulnerabilities.',
    requiredTopics: ['nmap', 'scanning', 'tcp-udp'],
    difficulty: 'Beginner',
    link: '#'
  },
  {
    id: 'ctf',
    title: 'Capture The Flag (CTF) Challenges',
    description: 'Solve CTF challenges on platforms like HackTheBox or TryHackMe.',
    requiredTopics: ['exploitation', 'recon', 'cryptography'],
    difficulty: 'Advanced',
    link: '#'
  }
];

// ----------------------------------------------------------------------
// মেশিন লার্নিং ডেটা (ভিডিও লিংক সহ)
// ----------------------------------------------------------------------
const machineLearningData = {
  id: 'ml',
  title: 'Machine Learning',
  icon: Brain,
  color: 'from-green-500 to-emerald-600',
  sections: [
    {
      id: 'math',
      title: 'Mathematics for ML',
      icon: Sigma,
      color: 'from-indigo-500 to-purple-500',
      lightBg: 'bg-indigo-50',
      darkBg: 'dark:bg-indigo-900/20',
      textColor: 'text-indigo-700 dark:text-indigo-300',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      topics: [
        { id: 'linear-algebra', title: 'Linear Algebra', resources: 'Vectors, Matrices, Eigenvalues', time: 12, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/fNk_zzaMoSs', title: 'Linear Algebra - 3Blue1Brown' }
          ], 
          bookmarked: false },
        { id: 'calculus', title: 'Calculus', resources: 'Derivatives, Integrals, Gradients', time: 10, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/WUvTyaaNkzM', title: 'Calculus - 3Blue1Brown' }
          ], 
          bookmarked: false },
        { id: 'probability', title: 'Probability & Statistics', resources: 'Distributions, Bayes, Hypothesis testing', time: 12, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'python-ml',
      title: 'Python for ML',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      lightBg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800',
      topics: [
        { id: 'numpy', title: 'NumPy', resources: 'Arrays, Broadcasting, Linear algebra', time: 6, completed: false, completedAt: null, dependsOn: ['linear-algebra'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/QUT1VHiLmmI', title: 'NumPy - freeCodeCamp' }
          ], 
          bookmarked: false },
        { id: 'pandas', title: 'Pandas', resources: 'DataFrames, Series, Data cleaning', time: 7, completed: false, completedAt: null, dependsOn: ['numpy'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/vmEHCJofslg', title: 'Pandas - freeCodeCamp' }
          ], 
          bookmarked: false },
        { id: 'matplotlib', title: 'Matplotlib & Seaborn', resources: 'Data visualization', time: 5, completed: false, completedAt: null, dependsOn: ['pandas'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'scipy', title: 'SciPy', resources: 'Scientific computing, optimization', time: 5, completed: false, completedAt: null, dependsOn: ['numpy'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'ml-algos',
      title: 'Machine Learning Algorithms',
      icon: Brain,
      color: 'from-green-500 to-emerald-500',
      lightBg: 'bg-green-50',
      darkBg: 'dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800',
      topics: [
        { id: 'regression', title: 'Linear & Logistic Regression', resources: 'Gradient descent, Regularization', time: 8, completed: false, completedAt: null, dependsOn: ['numpy', 'calculus'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/Ns4L5pD9E7M', title: 'Linear Regression - StatQuest' }
          ], 
          bookmarked: false },
        { id: 'decision-trees', title: 'Decision Trees & Random Forests', resources: 'Entropy, Gini, Ensemble', time: 7, completed: false, completedAt: null, dependsOn: ['regression'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/7VeUPuFGJHk', title: 'Decision Trees - StatQuest' }
          ], 
          bookmarked: false },
        { id: 'svm', title: 'Support Vector Machines', resources: 'Kernels, Hyperplanes', time: 6, completed: false, completedAt: null, dependsOn: ['regression'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'knn', title: 'K-Nearest Neighbors', resources: 'Distance metrics, Curse of dimensionality', time: 4, completed: false, completedAt: null, dependsOn: ['regression'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'clustering', title: 'Clustering (K-Means, DBSCAN)', resources: 'Unsupervised learning', time: 6, completed: false, completedAt: null, dependsOn: ['regression'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'pca', title: 'Dimensionality Reduction (PCA)', resources: 'Eigenvalues, Variance', time: 5, completed: false, completedAt: null, dependsOn: ['linear-algebra'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'deep-learning',
      title: 'Deep Learning',
      icon: Cpu,
      color: 'from-red-500 to-pink-500',
      lightBg: 'bg-red-50',
      darkBg: 'dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-800',
      topics: [
        { id: 'neural-networks', title: 'Neural Networks Basics', resources: 'Perceptron, Activation functions, Backpropagation', time: 10, completed: false, completedAt: null, dependsOn: ['ml-algos'], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/aircAruvnKk', title: 'Neural Networks - 3Blue1Brown' }
          ], 
          bookmarked: false },
        { id: 'cnn', title: 'Convolutional Neural Networks', resources: 'Conv layers, Pooling, Image classification', time: 8, completed: false, completedAt: null, dependsOn: ['neural-networks'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'rnn', title: 'Recurrent Neural Networks', resources: 'LSTM, GRU, Sequence modeling', time: 8, completed: false, completedAt: null, dependsOn: ['neural-networks'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'transformers', title: 'Transformers & Attention', resources: 'BERT, GPT, Self-attention', time: 10, completed: false, completedAt: null, dependsOn: ['rnn'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'tensorflow', title: 'TensorFlow / Keras', resources: 'Model building, Training, Deployment', time: 8, completed: false, completedAt: null, dependsOn: ['neural-networks'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'pytorch', title: 'PyTorch', resources: 'Tensors, Autograd, Neural networks', time: 8, completed: false, completedAt: null, dependsOn: ['neural-networks'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'mlops',
      title: 'MLOps & Deployment',
      icon: Rocket,
      color: 'from-orange-500 to-yellow-500',
      lightBg: 'bg-orange-50',
      darkBg: 'dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
      borderColor: 'border-orange-200 dark:border-orange-800',
      topics: [
        { id: 'model-deployment', title: 'Model Deployment', resources: 'Flask, FastAPI, Docker', time: 6, completed: false, completedAt: null, dependsOn: ['tensorflow', 'pytorch'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'ml-pipelines', title: 'ML Pipelines', resources: 'Data versioning, Experiment tracking', time: 5, completed: false, completedAt: null, dependsOn: ['model-deployment'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'cloud-ml', title: 'Cloud ML (AWS SageMaker, GCP AI)', resources: 'Training, Serving', time: 6, completed: false, completedAt: null, dependsOn: ['model-deployment'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'monitoring', title: 'Model Monitoring', resources: 'Drift, Performance tracking', time: 4, completed: false, completedAt: null, dependsOn: ['model-deployment'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    }
  ]
};

const mlProjects = [
  {
    id: 'house-price',
    title: 'House Price Prediction',
    description: 'Use regression to predict house prices from a dataset.',
    requiredTopics: ['pandas', 'regression', 'numpy'],
    difficulty: 'Beginner',
    link: '#'
  },
  {
    id: 'image-classifier',
    title: 'Image Classifier with CNN',
    description: 'Build a CNN to classify images (e.g., CIFAR-10).',
    requiredTopics: ['cnn', 'tensorflow', 'neural-networks'],
    difficulty: 'Intermediate',
    link: '#'
  },
  {
    id: 'sentiment-analysis',
    title: 'Sentiment Analysis with Transformers',
    description: 'Fine-tune a BERT model for sentiment analysis.',
    requiredTopics: ['transformers', 'pytorch', 'rnn'],
    difficulty: 'Advanced',
    link: '#'
  }
];

// ----------------------------------------------------------------------
// AI (Artificial Intelligence) ডেটা (ভিডিও লিংক সহ)
// ----------------------------------------------------------------------
const aiData = {
  id: 'ai',
  title: 'Artificial Intelligence',
  icon: Cpu,
  color: 'from-purple-500 to-indigo-600',
  sections: [
    {
      id: 'ai-intro',
      title: 'Introduction to AI',
      icon: Brain,
      color: 'from-indigo-500 to-purple-600',
      lightBg: 'bg-indigo-50',
      darkBg: 'dark:bg-indigo-900/20',
      textColor: 'text-indigo-700 dark:text-indigo-300',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      topics: [
        { id: 'what-is-ai', title: 'What is AI?', resources: 'History, Types of AI (Narrow, General, Super)', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/2ePf9rue1Ao', title: 'What is AI? - Simplilearn' }
          ], 
          bookmarked: false },
        { id: 'ai-applications', title: 'Applications of AI', resources: 'Healthcare, Finance, Robotics, etc.', time: 2, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'ai-ethics', title: 'Ethics in AI', resources: 'Bias, Fairness, Transparency, Accountability', time: 4, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving & Search',
      icon: Target,
      color: 'from-green-500 to-teal-500',
      lightBg: 'bg-green-50',
      darkBg: 'dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800',
      topics: [
        { id: 'uninformed-search', title: 'Uninformed Search', resources: 'BFS, DFS, Uniform Cost, Depth-Limited', time: 5, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'informed-search', title: 'Informed Search', resources: 'Greedy, A* Search, Heuristics', time: 6, completed: false, completedAt: null, dependsOn: ['uninformed-search'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'local-search', title: 'Local Search', resources: 'Hill Climbing, Simulated Annealing, Genetic Algorithms', time: 5, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'adversarial-search', title: 'Adversarial Search', resources: 'Minimax, Alpha-Beta Pruning, Game Playing', time: 5, completed: false, completedAt: null, dependsOn: ['informed-search'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'constraint-satisfaction', title: 'Constraint Satisfaction Problems', resources: 'Backtracking, Forward Checking, AC-3', time: 4, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'knowledge-reasoning',
      title: 'Knowledge Representation & Reasoning',
      icon: Database,
      color: 'from-yellow-500 to-orange-500',
      lightBg: 'bg-yellow-50',
      darkBg: 'dark:bg-yellow-900/20',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      topics: [
        { id: 'logic', title: 'Logic (Propositional & First-Order)', resources: 'Syntax, Semantics, Inference', time: 6, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'semantic-net', title: 'Semantic Networks', resources: 'Nodes, Links, Inheritance', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'frames', title: 'Frames & Scripts', resources: 'Slots, Defaults, Prototypes', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'ontologies', title: 'Ontologies', resources: 'OWL, RDF, Description Logic', time: 4, completed: false, completedAt: null, dependsOn: ['logic'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'reasoning', title: 'Reasoning Systems', resources: 'Forward/Backward Chaining, Resolution', time: 5, completed: false, completedAt: null, dependsOn: ['logic'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'ml-core',
      title: 'Machine Learning Core',
      icon: LineChart,
      color: 'from-blue-500 to-cyan-500',
      lightBg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800',
      topics: [
        { id: 'ml-basics', title: 'ML Basics', resources: 'Supervised, Unsupervised, Reinforcement Learning', time: 4, completed: false, completedAt: null, dependsOn: ['ai-intro'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'regression', title: 'Regression (Linear, Logistic)', resources: 'Gradient Descent, Regularization', time: 5, completed: false, completedAt: null, dependsOn: ['ml-basics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'classification', title: 'Classification (KNN, SVM, Decision Trees)', resources: 'Metrics, Overfitting', time: 6, completed: false, completedAt: null, dependsOn: ['ml-basics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'clustering', title: 'Clustering (K-Means, DBSCAN)', resources: 'Unsupervised Learning', time: 4, completed: false, completedAt: null, dependsOn: ['ml-basics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'ensemble', title: 'Ensemble Methods', resources: 'Random Forest, Boosting, Bagging', time: 5, completed: false, completedAt: null, dependsOn: ['classification'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'deep-learning',
      title: 'Deep Learning',
      icon: Cpu,
      color: 'from-red-500 to-pink-500',
      lightBg: 'bg-red-50',
      darkBg: 'dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-800',
      topics: [
        { id: 'neural-networks', title: 'Neural Networks', resources: 'Perceptron, Activation Functions, Backpropagation', time: 6, completed: false, completedAt: null, dependsOn: ['ml-core'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'cnn', title: 'Convolutional Neural Networks', resources: 'Conv Layers, Pooling, Image Classification', time: 6, completed: false, completedAt: null, dependsOn: ['neural-networks'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'rnn', title: 'Recurrent Neural Networks', resources: 'LSTM, GRU, Sequence Modeling', time: 5, completed: false, completedAt: null, dependsOn: ['neural-networks'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'transformers', title: 'Transformers & Attention', resources: 'Self-Attention, BERT, GPT', time: 6, completed: false, completedAt: null, dependsOn: ['rnn'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'autoencoders', title: 'Autoencoders & GANs', resources: 'Dimensionality Reduction, Generative Models', time: 5, completed: false, completedAt: null, dependsOn: ['cnn'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'nlp',
      title: 'Natural Language Processing',
      icon: MessageSquare,
      color: 'from-purple-500 to-indigo-500',
      lightBg: 'bg-purple-50',
      darkBg: 'dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
      borderColor: 'border-purple-200 dark:border-purple-800',
      topics: [
        { id: 'text-processing', title: 'Text Preprocessing', resources: 'Tokenization, Stemming, Lemmatization, Stopwords', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'bag-of-words', title: 'Bag of Words & TF-IDF', resources: 'Vectorization, N-grams', time: 3, completed: false, completedAt: null, dependsOn: ['text-processing'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'word-embeddings', title: 'Word Embeddings', resources: 'Word2Vec, GloVe, FastText', time: 4, completed: false, completedAt: null, dependsOn: ['bag-of-words'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'rnn-nlp', title: 'RNN for NLP', resources: 'Language Modeling, Text Generation', time: 5, completed: false, completedAt: null, dependsOn: ['rnn', 'word-embeddings'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'transformers-nlp', title: 'Transformers in NLP', resources: 'BERT, GPT, T5, Fine-tuning', time: 6, completed: false, completedAt: null, dependsOn: ['transformers'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'nlp-tasks', title: 'NLP Tasks', resources: 'Classification, NER, Machine Translation, QA', time: 5, completed: false, completedAt: null, dependsOn: ['transformers-nlp'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'computer-vision',
      title: 'Computer Vision',
      icon: Eye,
      color: 'from-cyan-500 to-blue-500',
      lightBg: 'bg-cyan-50',
      darkBg: 'dark:bg-cyan-900/20',
      textColor: 'text-cyan-700 dark:text-cyan-300',
      borderColor: 'border-cyan-200 dark:border-cyan-800',
      topics: [
        { id: 'image-basics', title: 'Image Basics', resources: 'Pixels, Color Spaces, Filters', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'feature-detection', title: 'Feature Detection', resources: 'Edge Detection, SIFT, HOG', time: 4, completed: false, completedAt: null, dependsOn: ['image-basics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'cnn-cv', title: 'CNNs for CV', resources: 'Image Classification, Object Detection', time: 5, completed: false, completedAt: null, dependsOn: ['cnn'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'object-detection', title: 'Object Detection', resources: 'R-CNN, YOLO, SSD', time: 5, completed: false, completedAt: null, dependsOn: ['cnn-cv'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'segmentation', title: 'Segmentation', resources: 'Semantic, Instance Segmentation (U-Net, Mask R-CNN)', time: 5, completed: false, completedAt: null, dependsOn: ['cnn-cv'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    }
  ]
};

const aiProjects = [
  {
    id: 'search-algorithm',
    title: 'Implement Search Algorithms',
    description: 'Implement BFS, DFS, A* and compare performance.',
    requiredTopics: ['uninformed-search', 'informed-search'],
    difficulty: 'Beginner',
    link: '#'
  },
  {
    id: 'text-classifier',
    title: 'Text Classifier with Transformers',
    description: 'Fine-tune BERT for sentiment analysis.',
    requiredTopics: ['transformers-nlp', 'nlp-tasks'],
    difficulty: 'Intermediate',
    link: '#'
  },
  {
    id: 'object-detector',
    title: 'Object Detection with YOLO',
    description: 'Train YOLO on a custom dataset.',
    requiredTopics: ['object-detection', 'cnn-cv'],
    difficulty: 'Advanced',
    link: '#'
  }
];

// ----------------------------------------------------------------------
// ডিজিটাল মার্কেটিং ডেটা (ভিডিও লিংক সহ)
// ----------------------------------------------------------------------
const digitalMarketingData = {
  id: 'dm',
  title: 'Digital Marketing',
  icon: Megaphone,
  color: 'from-pink-500 to-rose-600',
  sections: [
    {
      id: 'dm-fundamentals',
      title: 'Marketing Fundamentals',
      icon: Megaphone,
      color: 'from-pink-500 to-rose-500',
      lightBg: 'bg-pink-50',
      darkBg: 'dark:bg-pink-900/20',
      textColor: 'text-pink-700 dark:text-pink-300',
      borderColor: 'border-pink-200 dark:border-pink-800',
      topics: [
        { id: 'what-is-dm', title: 'What is Digital Marketing?', resources: 'Channels, Strategy, ROI', time: 2, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/ZVuHLPl69mM', title: 'Digital Marketing Course - freeCodeCamp' }
          ], 
          bookmarked: false },
        { id: 'marketing-funnel', title: 'Marketing Funnel', resources: 'Awareness, Consideration, Conversion, Loyalty', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'target-audience', title: 'Target Audience & Persona', resources: 'Demographics, Psychographics, Buyer Persona', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'competitor-analysis', title: 'Competitor Analysis', resources: 'SWOT, Benchmarking', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'seo',
      title: 'Search Engine Optimization (SEO)',
      icon: Search,
      color: 'from-green-500 to-emerald-500',
      lightBg: 'bg-green-50',
      darkBg: 'dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800',
      topics: [
        { id: 'seo-basics', title: 'SEO Basics', resources: 'How Search Engines Work, Crawling, Indexing', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/xsVTqzratPs', title: 'SEO Tutorial - Neil Patel' }
          ], 
          bookmarked: false },
        { id: 'keyword-research', title: 'Keyword Research', resources: 'Tools (Google Keyword Planner, SEMrush), Long-tail', time: 4, completed: false, completedAt: null, dependsOn: ['seo-basics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'on-page-seo', title: 'On-Page SEO', resources: 'Title Tags, Meta Descriptions, Headers, URL Structure', time: 4, completed: false, completedAt: null, dependsOn: ['keyword-research'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'off-page-seo', title: 'Off-Page SEO', resources: 'Backlinks, Link Building Strategies, Guest Posting', time: 4, completed: false, completedAt: null, dependsOn: ['on-page-seo'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'technical-seo', title: 'Technical SEO', resources: 'Site Speed, Mobile Friendliness, XML Sitemaps, Schema Markup', time: 5, completed: false, completedAt: null, dependsOn: ['on-page-seo'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'seo-tools', title: 'SEO Tools', resources: 'Google Search Console, Ahrefs, Moz', time: 3, completed: false, completedAt: null, dependsOn: ['seo-basics'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'sem',
      title: 'Search Engine Marketing (SEM) & PPC',
      icon: DollarSign,
      color: 'from-blue-500 to-indigo-500',
      lightBg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800',
      topics: [
        { id: 'ppc-basics', title: 'PPC Basics', resources: 'Google Ads, Bing Ads, Auction System', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/1bH6y2F1a6k', title: 'Google Ads Tutorial - Neil Patel' }
          ], 
          bookmarked: false },
        { id: 'keyword-adgroups', title: 'Keywords & Ad Groups', resources: 'Match Types, Negative Keywords', time: 3, completed: false, completedAt: null, dependsOn: ['ppc-basics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'ad-creation', title: 'Ad Creation & Copywriting', resources: 'Headlines, Descriptions, Extensions', time: 3, completed: false, completedAt: null, dependsOn: ['ppc-basics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'bidding-strategies', title: 'Bidding Strategies', resources: 'Manual CPC, Enhanced CPC, Target CPA, ROAS', time: 4, completed: false, completedAt: null, dependsOn: ['ppc-basics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'quality-score', title: 'Quality Score & Ad Rank', resources: 'Factors, Optimization', time: 3, completed: false, completedAt: null, dependsOn: ['ad-creation'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'campaign-management', title: 'Campaign Management', resources: 'Budgeting, A/B Testing, Optimization', time: 5, completed: false, completedAt: null, dependsOn: ['bidding-strategies'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'social-media',
      title: 'Social Media Marketing',
      icon: Share2,
      color: 'from-purple-500 to-pink-500',
      lightBg: 'bg-purple-50',
      darkBg: 'dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
      borderColor: 'border-purple-200 dark:border-purple-800',
      topics: [
        { id: 'smm-basics', title: 'SMM Basics', resources: 'Platforms Overview (Facebook, Instagram, LinkedIn, Twitter, TikTok)', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'content-strategy', title: 'Content Strategy', resources: 'Content Calendar, Types of Content (Images, Videos, Stories)', time: 4, completed: false, completedAt: null, dependsOn: ['smm-basics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'community-management', title: 'Community Management', resources: 'Engagement, Responding, Building Relationships', time: 3, completed: false, completedAt: null, dependsOn: ['content-strategy'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'social-ads', title: 'Social Media Advertising', resources: 'Facebook Ads Manager, Instagram Ads, LinkedIn Ads', time: 5, completed: false, completedAt: null, dependsOn: ['smm-basics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'analytics-smm', title: 'Social Media Analytics', resources: 'Insights, Engagement Metrics, ROI', time: 3, completed: false, completedAt: null, dependsOn: ['social-ads'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'influencer-marketing', title: 'Influencer Marketing', resources: 'Identifying, Collaborating, Measuring', time: 3, completed: false, completedAt: null, dependsOn: ['smm-basics'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'content-marketing',
      title: 'Content Marketing',
      icon: PenTool,
      color: 'from-orange-500 to-amber-500',
      lightBg: 'bg-orange-50',
      darkBg: 'dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
      borderColor: 'border-orange-200 dark:border-orange-800',
      topics: [
        { id: 'content-marketing-basics', title: 'Content Marketing Basics', resources: 'Value, Storytelling, Formats (Blogs, Videos, Podcasts)', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'content-creation', title: 'Content Creation', resources: 'Writing, Design, Video Production', time: 5, completed: false, completedAt: null, dependsOn: ['content-marketing-basics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'content-distribution', title: 'Content Distribution', resources: 'Owned, Earned, Paid Media', time: 3, completed: false, completedAt: null, dependsOn: ['content-creation'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'content-measurement', title: 'Content Measurement', resources: 'Traffic, Engagement, Conversions', time: 3, completed: false, completedAt: null, dependsOn: ['content-distribution'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'blogging', title: 'Blogging', resources: 'SEO for Blogs, Guest Blogging', time: 4, completed: false, completedAt: null, dependsOn: ['content-creation'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'email-marketing',
      title: 'Email Marketing',
      icon: Mail,
      color: 'from-red-500 to-rose-500',
      lightBg: 'bg-red-50',
      darkBg: 'dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-800',
      topics: [
        { id: 'email-basics', title: 'Email Marketing Basics', resources: 'List Building, Permission, Compliance (CAN-SPAM, GDPR)', time: 3, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'email-campaigns', title: 'Email Campaigns', resources: 'Welcome, Newsletter, Promotional, Abandoned Cart', time: 4, completed: false, completedAt: null, dependsOn: ['email-basics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'email-design', title: 'Email Design & Copywriting', resources: 'Subject Lines, Templates, CTAs', time: 4, completed: false, completedAt: null, dependsOn: ['email-campaigns'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'automation', title: 'Email Automation', resources: 'Drip Campaigns, Workflows, Triggers', time: 4, completed: false, completedAt: null, dependsOn: ['email-campaigns'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'analytics-email', title: 'Email Analytics', resources: 'Open Rate, Click Rate, Bounce Rate, A/B Testing', time: 3, completed: false, completedAt: null, dependsOn: ['email-campaigns'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'tools-email', title: 'Email Marketing Tools', resources: 'Mailchimp, ConvertKit, SendinBlue', time: 2, completed: false, completedAt: null, dependsOn: ['email-basics'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Data',
      icon: BarChart3,
      color: 'from-gray-500 to-slate-500',
      lightBg: 'bg-gray-50',
      darkBg: 'dark:bg-gray-800/50',
      textColor: 'text-gray-700 dark:text-gray-300',
      borderColor: 'border-gray-200 dark:border-gray-700',
      topics: [
        { id: 'google-analytics', title: 'Google Analytics', resources: 'Setup, Goals, Reports, Conversion Tracking', time: 5, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [
            { url: 'https://youtu.be/TeRxJv_JcYQ', title: 'Google Analytics Tutorial - Simplilearn' }
          ], 
          bookmarked: false },
        { id: 'google-tag-manager', title: 'Google Tag Manager', resources: 'Tags, Triggers, Variables', time: 4, completed: false, completedAt: null, dependsOn: ['google-analytics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'data-interpretation', title: 'Data Interpretation', resources: 'KPI, Metrics, Dashboards', time: 3, completed: false, completedAt: null, dependsOn: ['google-analytics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'attribution', title: 'Attribution Modeling', resources: 'First-click, Last-click, Linear, Time-decay', time: 3, completed: false, completedAt: null, dependsOn: ['data-interpretation'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    },
    {
      id: 'strategy',
      title: 'Strategy & Planning',
      icon: Workflow,
      color: 'from-teal-500 to-cyan-500',
      lightBg: 'bg-teal-50',
      darkBg: 'dark:bg-teal-900/20',
      textColor: 'text-teal-700 dark:text-teal-300',
      borderColor: 'border-teal-200 dark:border-teal-800',
      topics: [
        { id: 'digital-strategy', title: 'Digital Marketing Strategy', resources: 'Goal Setting, Budgeting, Channel Mix', time: 4, completed: false, completedAt: null, dependsOn: [], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'campaign-planning', title: 'Campaign Planning', resources: 'Timeline, Resources, Execution', time: 3, completed: false, completedAt: null, dependsOn: ['digital-strategy'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'roi-measurement', title: 'ROI Measurement', resources: 'Cost, Revenue, Profitability', time: 3, completed: false, completedAt: null, dependsOn: ['analytics'], notes: '', 
          videoLinks: [], bookmarked: false },
        { id: 'reporting', title: 'Reporting', resources: 'Client Reports, Dashboards, Presentations', time: 3, completed: false, completedAt: null, dependsOn: ['roi-measurement'], notes: '', 
          videoLinks: [], bookmarked: false }
      ]
    }
  ]
};

const dmProjects = [
  {
    id: 'seo-audit',
    title: 'SEO Audit for a Website',
    description: 'Perform an SEO audit for a blog or small business site using free tools.',
    requiredTopics: ['seo-basics', 'keyword-research', 'on-page-seo', 'technical-seo'],
    difficulty: 'Beginner',
    link: '#'
  },
  {
    id: 'social-campaign',
    title: 'Social Media Campaign',
    description: 'Plan and execute a 2-week social media campaign for a brand.',
    requiredTopics: ['smm-basics', 'content-strategy', 'social-ads', 'analytics-smm'],
    difficulty: 'Intermediate',
    link: '#'
  },
  {
    id: 'email-automation',
    title: 'Email Automation Workflow',
    description: 'Create an automated email sequence for e-commerce using Mailchimp.',
    requiredTopics: ['email-campaigns', 'automation', 'email-design'],
    difficulty: 'Intermediate',
    link: '#'
  },
  {
    id: 'full-marketing-plan',
    title: 'Full Digital Marketing Plan',
    description: 'Develop a comprehensive digital marketing plan for a startup.',
    requiredTopics: ['digital-strategy', 'target-audience', 'campaign-planning', 'roi-measurement'],
    difficulty: 'Advanced',
    link: '#'
  }
];

// ----------------------------------------------------------------------
// ডেটা ম্যাপ
// ----------------------------------------------------------------------
const roadmapDataMap = {
  web: webDevData,
  ethical: ethicalHackingData,
  ml: machineLearningData,
  ai: aiData,
  dm: digitalMarketingData
};

const projectsMap = {
  web: webProjects,
  ethical: ethicalProjects,
  ml: mlProjects,
  ai: aiProjects,
  dm: dmProjects
};

// ----------------------------------------------------------------------
// অল ট্র্যাক ওভারভিউ
// ----------------------------------------------------------------------
const AllTracksOverview = ({ onSelectTrack }) => {
  const [trackProgress, setTrackProgress] = useState({});

  useEffect(() => {
    const progress = {};
    Object.keys(roadmapDataMap).forEach(trackId => {
      const saved = localStorage.getItem(`roadmapData_${trackId}`);
      if (saved) {
        try {
          const sections = JSON.parse(saved);
          let totalTopics = 0;
          let completedTopics = 0;
          sections.forEach(section => {
            section.topics.forEach(topic => {
              totalTopics++;
              if (topic.completed) completedTopics++;
            });
          });
          const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
          progress[trackId] = { totalTopics, completedTopics, percentage };
        } catch (e) {
          progress[trackId] = { totalTopics: 0, completedTopics: 0, percentage: 0 };
        }
      } else {
        const defaultData = roadmapDataMap[trackId];
        let totalTopics = 0;
        defaultData.sections.forEach(section => {
          totalTopics += section.topics.length;
        });
        progress[trackId] = { totalTopics, completedTopics: 0, percentage: 0 };
      }
    });
    setTrackProgress(progress);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
      {Object.keys(roadmapDataMap).map(trackId => {
        const track = roadmapDataMap[trackId];
        const prog = trackProgress[trackId] || { totalTopics: 0, completedTopics: 0, percentage: 0 };
        return (
          <div
            key={trackId}
            onClick={() => onSelectTrack(trackId)}
            className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-${track.color.split('-')[1]}-500 cursor-pointer hover:shadow-xl transition-all`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${track.color} text-white`}>
                <SafeIcon icon={track.icon} size={24} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">{track.title}</h3>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress</span>
              <span className="font-mono">{prog.completedTopics}/{prog.totalTopics}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${track.color}`}
                style={{ width: `${prog.percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {prog.percentage}% Complete
            </p>
          </div>
        );
      })}
    </div>
  );
};

// ----------------------------------------------------------------------
// প্রধান রোডম্যাপ কম্পোনেন্ট
// ----------------------------------------------------------------------
const Roadmap = ({ trackId, onBackToDashboard }) => {
  const defaultData = roadmapDataMap[trackId];
  const defaultSections = defaultData.sections;
  const projects = projectsMap[trackId];
  const [showCertificate, setShowCertificate] = useState(false);

  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem(`roadmapData_${trackId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = defaultSections.map(defaultSection => {
          const savedSection = parsed.find(s => s.id === defaultSection.id);
          if (!savedSection) return defaultSection;
          const mergedTopics = defaultSection.topics.map(defaultTopic => {
            const savedTopic = savedSection.topics.find(t => t.id === defaultTopic.id);
            if (!savedTopic) return defaultTopic;
            return {
              ...defaultTopic,
              ...savedTopic,
              dependsOn: savedTopic.dependsOn || defaultTopic.dependsOn || [],
              notes: savedTopic.notes || '',
              completed: savedTopic.completed || false,
              completedAt: savedTopic.completedAt || null,
              videoLinks: savedTopic.videoLinks || defaultTopic.videoLinks || [],
              bookmarked: savedTopic.bookmarked || false
            };
          });
          return {
            ...defaultSection,
            ...savedSection,
            topics: mergedTopics,
          };
        });
        return merged;
      } catch (e) {
        console.error('Error loading roadmap:', e);
      }
    }
    return defaultSections;
  });

  const [expandedSections, setExpandedSections] = useState(() => {
    const saved = localStorage.getItem(`roadmapExpanded_${trackId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const initial = {};
    defaultSections.forEach((section, idx) => {
      initial[section.id] = idx === 0;
    });
    return initial;
  });

  const [dailyStudyHours, setDailyStudyHours] = useState(() => {
    const saved = localStorage.getItem('dailyStudyHours');
    return saved ? parseFloat(saved) : 2;
  });

  const [activityData, setActivityData] = useState({
    dailyTotals: {},
    avgDaily: 0
  });

  useEffect(() => {
    localStorage.setItem('dailyStudyHours', dailyStudyHours.toString());
  }, [dailyStudyHours]);

  useEffect(() => {
    localStorage.setItem(`roadmapData_${trackId}`, JSON.stringify(sections));
  }, [sections, trackId]);

  useEffect(() => {
    localStorage.setItem(`roadmapExpanded_${trackId}`, JSON.stringify(expandedSections));
  }, [expandedSections, trackId]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('activityLog');
      if (saved) {
        const activities = JSON.parse(saved);
        const daily = {};
        activities.forEach(task => {
          if (task.timer && task.timer.elapsed) {
            const date = new Date(task.createdAt).toISOString().split('T')[0];
            daily[date] = (daily[date] || 0) + (task.timer.elapsed / 3600);
          }
        });
        const today = new Date().toISOString().split('T')[0];
        const last7Days = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          last7Days.push(daily[dateStr] || 0);
        }
        const avg = last7Days.reduce((a, b) => a + b, 0) / 7;
        setActivityData({
          dailyTotals: daily,
          avgDaily: Math.round(avg * 10) / 10
        });
      }
    } catch (e) {
      console.error('Error loading activity log:', e);
    }
  }, []);

  const formatTime = (hours) => {
    if (typeof hours !== 'number' || isNaN(hours)) return '0 min';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h} hr`;
    return `${h} hr ${m} min`;
  };

  const getDaysFromHours = (hours) => {
    if (!hours || hours <= 0) return 0;
    return Math.ceil(hours / dailyStudyHours);
  };

  const getCompletionDate = (remainingHours) => {
    const today = new Date();
    const daysNeeded = getDaysFromHours(remainingHours);
    const completionDate = new Date(today);
    completionDate.setDate(today.getDate() + daysNeeded);
    return completionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const areDependenciesMet = (topic, sectionId) => {
    if (!topic.dependsOn || topic.dependsOn.length === 0) return true;
    const section = sections.find(s => s.id === sectionId);
    return topic.dependsOn.every(depId => {
      let found = section?.topics.find(t => t.id === depId)?.completed;
      if (found) return true;
      for (let s of sections) {
        const t = s.topics.find(t => t.id === depId);
        if (t && t.completed) return true;
      }
      return false;
    });
  };

  const toggleTopic = (sectionId, topicId) => {
    setSections(prev => {
      return prev.map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          topics: section.topics.map(topic => {
            if (topic.id !== topicId) return topic;
            if (!topic.completed && !areDependenciesMet(topic, sectionId)) {
              toast.error('Complete dependencies first!');
              return topic;
            }
            return {
              ...topic,
              completed: !topic.completed,
              completedAt: !topic.completed ? new Date().toISOString() : null
            };
          })
        };
      });
    });
  };

  const saveNote = (sectionId, topicId, note) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              topics: section.topics.map(topic =>
                topic.id === topicId ? { ...topic, notes: note } : topic
              )
            }
          : section
      )
    );
  };

  const toggleBookmark = (sectionId, topicId) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              topics: section.topics.map(topic =>
                topic.id === topicId ? { ...topic, bookmarked: !topic.bookmarked } : topic
              )
            }
          : section
      )
    );
    toast.success('Bookmark updated');
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your learning progress?')) {
      setSections(defaultSections);
      toast.success('Progress reset successfully');
    }
  };

  const getSectionStats = (section) => {
    const total = section.topics.length;
    const completed = section.topics.filter(t => t.completed).length;
    const totalTime = section.topics.reduce((sum, t) => sum + (t.time || 0), 0);
    const completedTime = section.topics.filter(t => t.completed).reduce((sum, t) => sum + (t.time || 0), 0);
    const remainingTime = totalTime - completedTime;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, totalTime, completedTime, remainingTime, remainingDays: getDaysFromHours(remainingTime), percentage };
  };

  const suggestions = useMemo(() => {
    const availableTopics = [];
    sections.forEach(section => {
      section.topics.forEach(topic => {
        if (!topic.completed && areDependenciesMet(topic, section.id)) {
          availableTopics.push({
            ...topic,
            sectionId: section.id,
            sectionTitle: section.title
          });
        }
      });
    });
    const nextTopic = availableTopics.sort((a, b) => (a.time || 0) - (b.time || 0))[0] || null;

    const reviewThresholdDays = 30;
    const now = new Date();
    const reviewTopics = [];
    sections.forEach(section => {
      section.topics.forEach(topic => {
        if (topic.completed && topic.completedAt) {
          const completedDate = new Date(topic.completedAt);
          const diffDays = Math.floor((now - completedDate) / (1000 * 60 * 60 * 24));
          if (diffDays >= reviewThresholdDays) {
            reviewTopics.push({
              ...topic,
              sectionId: section.id,
              sectionTitle: section.title,
              daysAgo: diffDays
            });
          }
        }
      });
    });
    reviewTopics.sort((a, b) => b.daysAgo - a.daysAgo);

    let suggestedGoal = dailyStudyHours;
    let reason = '';
    if (activityData.avgDaily > 0) {
      suggestedGoal = Math.min(dailyStudyHours, Math.max(0.5, Math.round((activityData.avgDaily + 0.5) * 10) / 10));
      if (suggestedGoal < dailyStudyHours) {
        reason = `Based on your actual study time (avg ${activityData.avgDaily}h/day), we suggest a more achievable goal of ${suggestedGoal}h today.`;
      } else {
        reason = `You're doing great! Keep aiming for ${dailyStudyHours}h today.`;
      }
    } else {
      reason = `No timer data yet. Start a timer in Today or Time Blocks to get personalized suggestions.`;
    }

    return { nextTopic, reviewTopics: reviewTopics.slice(0, 5), suggestedGoal, reason };
  }, [sections, dailyStudyHours, activityData]);

  const stats = useMemo(() => {
    const totalTopics = sections.reduce((acc, section) => acc + section.topics.length, 0);
    const completedTopics = sections.reduce((acc, section) => acc + section.topics.filter(t => t.completed).length, 0);
    const totalTime = sections.reduce((acc, section) => acc + section.topics.reduce((sum, t) => sum + (t.time || 0), 0), 0);
    const completedTime = sections.reduce((acc, section) => acc + section.topics.filter(t => t.completed).reduce((sum, t) => sum + (t.time || 0), 0), 0);
    const remainingTime = totalTime - completedTime;
    const percentage = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

    const categoryData = sections.map(section => {
      const total = section.topics.length;
      const completed = section.topics.filter(t => t.completed).length;
      const totalSectionTime = section.topics.reduce((sum, t) => sum + (t.time || 0), 0);
      const completedSectionTime = section.topics.filter(t => t.completed).reduce((sum, t) => sum + (t.time || 0), 0);
      const remainingSectionTime = totalSectionTime - completedSectionTime;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
      let bgColor = section.color;
      return {
        id: section.id,
        title: section.title,
        total,
        completed,
        percent,
        color: bgColor,
        icon: section.icon,
        remainingDays: getDaysFromHours(remainingSectionTime)
      };
    });

    return {
      totalTopics,
      completedTopics,
      totalTime,
      completedTime,
      remainingTime,
      remainingDays: getDaysFromHours(remainingTime),
      completionDate: getCompletionDate(remainingTime),
      percentage,
      categoryData,
      bestHour: 9,
      bestHourFormatted: '9 AM'
    };
  }, [sections, dailyStudyHours]);

  const badges = useMemo(() => {
    return [
      { id: 'beginner', title: 'Beginner', earned: stats.completedTopics >= 5 },
      { id: 'intermediate', title: 'Intermediate', earned: stats.completedTopics >= 20 },
      { id: 'advanced', title: 'Advanced', earned: stats.completedTopics >= 50 },
      { id: 'expert', title: 'Expert', earned: stats.percentage === 100 },
      { id: 'streak', title: '7 Day Streak', earned: activityData.avgDaily >= 2 },
    ];
  }, [stats, activityData]);

  const isComplete = stats.percentage === 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ব্যাক টু ড্যাশবোর্ড ও সার্টিফিকেট বাটন */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition self-start"
        >
          <Home size={18} />
          <span>Back to Dashboard</span>
        </button>
        {isComplete && !showCertificate && (
          <button
            onClick={() => setShowCertificate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-md"
          >
            <Trophy size={18} />
            <span>Get Certificate</span>
          </button>
        )}
      </div>

      {/* হেডার */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${defaultData.color} text-white shadow-md`}>
            <SafeIcon icon={defaultData.icon} size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              {defaultData.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
              <Star className="text-yellow-500" size={18} />
              {stats.completedTopics}/{stats.totalTopics} topics completed • {stats.percentage}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <Clock size={16} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Daily:</span>
            <input
              type="number"
              min="0.5"
              max="12"
              step="0.5"
              value={dailyStudyHours}
              onChange={(e) => setDailyStudyHours(parseFloat(e.target.value) || 1)}
              className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">hrs</span>
          </div>
          <button
            onClick={resetProgress}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium flex items-center gap-2 shadow-sm transition-all"
            title="Reset progress"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* ব্যাজ সেকশন */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Trophy className="text-yellow-500" size={20} />
          Your Achievements
        </h3>
        <div className="flex flex-wrap gap-2">
          {badges.map(badge => (
            <Badge key={badge.id} title={badge.title} earned={badge.earned} />
          ))}
        </div>
      </div>

      {/* সাজেশন কার্ড */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800/50 shadow-md">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-md">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Personalized Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* নেক্সট টপিক */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100 dark:border-purple-800 shadow-sm">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-medium mb-2">
                  <Target size={16} />
                  Next Topic
                </div>
                {suggestions.nextTopic ? (
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {suggestions.nextTopic.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {suggestions.nextTopic.sectionTitle} • {suggestions.nextTopic.time} hr
                    </p>
                    <button
                      onClick={() => {
                        const sectionId = suggestions.nextTopic.sectionId;
                        if (!expandedSections[sectionId]) {
                          toggleSection(sectionId);
                        }
                        setTimeout(() => {
                          document.getElementById(`topic-${suggestions.nextTopic.id}`)?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                          });
                        }, 100);
                      }}
                      className="mt-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      Start Learning →
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.completedTopics === stats.totalTopics
                      ? '🎉 You completed everything!'
                      : 'No suggestions yet. Check dependencies.'}
                  </p>
                )}
              </div>
              {/* রিভিউ রিমাইন্ডার */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-amber-100 dark:border-amber-800 shadow-sm">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-medium mb-2">
                  <Bell size={16} />
                  Review Reminders
                </div>
                {suggestions.reviewTopics.length > 0 ? (
                  <div className="space-y-2 max-h-28 overflow-y-auto scrollbar-thin">
                    {suggestions.reviewTopics.map(topic => (
                      <div key={topic.id} className="text-xs flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300 truncate">{topic.title}</span>
                        <span className="text-amber-600 dark:text-amber-400 font-mono ml-2">
                          {topic.daysAgo}d ago
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No topics need review yet.
                  </p>
                )}
              </div>
              {/* ডেইলি গোল সাজেশন */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-green-100 dark:border-green-800 shadow-sm">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium mb-2">
                  <TrendingUp size={16} />
                  Today's Goal
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {suggestions.suggestedGoal}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">hrs</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {suggestions.reason}
                </p>
                <button
                  onClick={() => setDailyStudyHours(suggestions.suggestedGoal)}
                  className="mt-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                >
                  Apply Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ওভারভিউ কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.percentage}%</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${stats.percentage}%` }} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Time</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{formatTime(stats.totalTime)}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            ⏳ Remaining: {formatTime(stats.remainingTime)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Days Left</p>
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {stats.remainingDays}
              </p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            📅 Est. finish: {stats.completionDate}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your Pace</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                {activityData.avgDaily || 0}h
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            ⚡ Avg. daily study (7d)
          </p>
        </div>
      </div>

      {/* ক্যাটাগরি প্রোগ্রেস */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-indigo-500" />
          Category Progress
        </h3>
        <div className="space-y-4">
          {stats.categoryData.map(cat => (
            <div key={cat.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cat.color} bg-opacity-20 flex items-center justify-center`}>
                <SafeIcon icon={cat.icon} className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{cat.title}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {cat.completed}/{cat.total} • {cat.remainingDays}d left
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-500`}
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* রোডম্যাপ সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const secStats = getSectionStats(section);
          const isExpanded = expandedSections[section.id];

          return (
            <div
              key={section.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border ${section.borderColor} overflow-hidden transition-all hover:shadow-md`}
            >
              <div
                onClick={() => toggleSection(section.id)}
                className={`flex items-center justify-between p-5 cursor-pointer ${section.lightBg} ${section.darkBg} hover:bg-opacity-80 transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} bg-opacity-20`}>
                    <SafeIcon icon={section.icon} className={`w-6 h-6 ${section.textColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm mt-1 flex-wrap">
                      <span className="text-gray-600 dark:text-gray-400">
                        {secStats.completed}/{secStats.total} topics
                      </span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {secStats.percentage}%
                      </span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {formatTime(secStats.remainingTime)} left
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${section.color}`}
                      style={{ width: `${secStats.percentage}%` }}
                    />
                  </div>
                  <button className="p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="grid grid-cols-1 gap-3">
                    {section.topics.map(topic => (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        sectionId={section.id}
                        onToggle={() => toggleTopic(section.id, topic.id)}
                        onSaveNote={saveNote}
                        onBookmark={toggleBookmark}
                        areDependenciesMet={areDependenciesMet(topic, section.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* প্রোজেক্ট সুপারিশ */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800/50 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-indigo-600" />
          Project Suggestions
        </h3>
        <ProjectSuggestions sections={sections} projects={projects} />
      </div>

      {/* টাইমলাইন ও রিমাইন্ডার */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-500" />
            Learning Timeline
          </h3>
          <TimelineView sections={sections} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <ReminderSettings dailyStudyHours={dailyStudyHours} />
        </div>
      </div>

      {/* মোটিভেশন বার */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800/50 shadow-md">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl shadow-md">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              {stats.percentage === 100
                ? '🏆 Master! You have completed the advanced roadmap!'
                : stats.percentage > 70
                ? '🚀 Advanced level reached! Build a high‑performance project.'
                : stats.percentage > 40
                ? '⚡ You are on track – start optimizing your existing knowledge.'
                : '✨ Start with the basics and build a strong foundation.'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              {stats.percentage === 100
                ? 'Contribute to open source, write tutorials, or become a freelancing architect.'
                : stats.percentage > 70
                ? 'Recommended project: Check the project suggestions below.'
                : stats.percentage > 40
                ? 'Recommended project: Pick a simple project and build it step by step.'
                : 'Recommended project: Focus on completing the first few topics.'}
            </p>
          </div>
        </div>
      </div>

      {/* সার্টিফিকেট মোডাল */}
      {showCertificate && (
        <CertificateModal
          trackTitle={defaultData.title}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// প্যারেন্ট কম্পোনেন্ট
// ----------------------------------------------------------------------
const RoadmapContainer = () => {
  const [view, setView] = useState('dashboard');
  const [selectedTrack, setSelectedTrack] = useState('web');

  const handleSelectTrack = (trackId) => {
    setSelectedTrack(trackId);
    setView('track');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
  };

  if (view === 'dashboard') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Map className="text-indigo-600" size={32} />
          Learning Dashboard
        </h1>
        <AllTracksOverview onSelectTrack={handleSelectTrack} />

        
      </div>
    );
  }

  return <Roadmap trackId={selectedTrack} onBackToDashboard={handleBackToDashboard} />;

  
};

export default RoadmapContainer;