import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ListTodo,
  Clock,
  BookOpen,
  Library,
  MessageSquare,
  Heart,
  TrendingUp,
  CheckCircle,
  Target,
  Award,
  Sparkles,
  ChevronRight,
  Zap,
  BarChart,
  Users,
} from "lucide-react";

const Home = ({ language, stats, userName = "User", onNavigate }) => {
  const t = translations[language];

  // Quick links to other sections
  const quickLinks = [
    { id: "today", label: t.today, icon: <ListTodo size={20} />, desc: t.todayDesc, color: "from-blue-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400" },
    { id: "blocks", label: t.timeBlocks, icon: <Clock size={20} />, desc: t.blocksDesc, color: "from-purple-500 to-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20", iconBg: "bg-purple-100 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400" },
    { id: "learning", label: t.learningHub, icon: <Library size={20} />, desc: t.learningDesc, color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20", iconBg: "bg-indigo-100 dark:bg-indigo-900/30", iconColor: "text-indigo-600 dark:text-indigo-400" },
    { id: "communication", label: t.communication, icon: <MessageSquare size={20} />, desc: t.communicationDesc, color: "from-pink-500 to-pink-600", bg: "bg-pink-50 dark:bg-pink-900/20", iconBg: "bg-pink-100 dark:bg-pink-900/30", iconColor: "text-pink-600 dark:text-pink-400" },
    { id: "lifetimer", label: t.lifeTimer, icon: <Heart size={20} />, desc: t.lifeTimerDesc, color: "from-rose-500 to-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20", iconBg: "bg-rose-100 dark:bg-rose-900/30", iconColor: "text-rose-600 dark:text-rose-400" },
    { id: "roadmap", label: t.roadmap, icon: <BookOpen size={20} />, desc: t.roadmapDesc, color: "from-amber-500 to-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400" },
  ];

  // Feature cards
  const features = [
    { icon: <Zap size={24} />, title: t.feature1Title, desc: t.feature1Desc, color: "from-blue-500 to-cyan-500" },
    { icon: <BarChart size={24} />, title: t.feature2Title, desc: t.feature2Desc, color: "from-green-500 to-emerald-500" },
    { icon: <Users size={24} />, title: t.feature3Title, desc: t.feature3Desc, color: "from-purple-500 to-pink-500" },
  ];

  // Welcome message based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === "bn") {
      if (hour < 12) return "শুভ সকাল";
      if (hour < 17) return "শুভ বিকাল";
      return "শুভ সন্ধ্যা";
    } else {
      if (hour < 12) return "Good Morning";
      if (hour < 17) return "Good Afternoon";
      return "Good Evening";
    }
  };

  // Format today's date
  const todayDate = new Date().toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section - Premium Welcome Area */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-1 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg">
                <Sparkles className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {getGreeting()}, {userName}! 👋
                </h1>
                <p className="text-indigo-100 text-lg max-w-2xl">
                  {t.welcomeMessage}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
              <Calendar size={20} className="text-white" />
              <span className="font-medium text-white">{todayDate}</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Overview - Animated Cards */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
          {t.statsOverview}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t.totalTasks}
            value={stats.totalTasks}
            icon={<ListTodo size={24} />}
            gradient="from-blue-500 to-blue-600"
            lightBg="bg-blue-50 dark:bg-blue-900/20"
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            delay={0}
          />
          <StatCard
            title={t.completedTasks}
            value={stats.completedTasks}
            icon={<CheckCircle size={24} />}
            gradient="from-green-500 to-green-600"
            lightBg="bg-green-50 dark:bg-green-900/20"
            iconBg="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
            delay={0.1}
          />
          <StatCard
            title={t.productivity}
            value={`${stats.productivity}%`}
            icon={<TrendingUp size={24} />}
            gradient="from-purple-500 to-purple-600"
            lightBg="bg-purple-50 dark:bg-purple-900/20"
            iconBg="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
            delay={0.2}
          />
          <StatCard
            title={t.focusTime}
            value={`${stats.focusTime}h`}
            icon={<Target size={24} />}
            gradient="from-amber-500 to-amber-600"
            lightBg="bg-amber-50 dark:bg-amber-900/20"
            iconBg="bg-amber-100 dark:bg-amber-900/30"
            iconColor="text-amber-600 dark:text-amber-400"
            delay={0.3}
          />
        </div>
      </section>

      {/* Quick Access - Navigational Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
            {t.quickAccess}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {t.clickToNavigate} <ChevronRight size={14} />
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <motion.button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-start gap-4 p-5 rounded-xl ${link.bg} border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group text-left w-full`}
            >
              <div className={`p-3 rounded-lg ${link.iconBg} group-hover:scale-110 transition-transform`}>
                <div className={link.iconColor}>
                  {link.icon}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {link.label}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {link.desc}
                </p>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
          {t.whyChoose}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-20 text-white mb-4`}>
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Motivation - Premium Quote Card */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-rose-900/20 p-1 shadow-lg"
      >
        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-amber-200 dark:border-amber-900/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 dark:from-amber-500/5 dark:to-orange-500/5 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-200/20 to-orange-200/20 dark:from-amber-500/5 dark:to-orange-500/5 rounded-full -ml-8 -mb-8" />
          
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
              <Award className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">
                {t.dailyMotivation}
              </p>
              <p className="text-lg italic text-gray-800 dark:text-gray-200">
                “{t.quote}”
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                — {t.quoteAuthor}
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

// Subcomponent: Stat Card with Animation
const StatCard = ({ title, value, icon, gradient, lightBg, iconBg, iconColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -3, scale: 1.02 }}
    className={`relative overflow-hidden rounded-xl ${lightBg} border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all group`}
  >
    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-700`} />
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${iconBg} group-hover:scale-110 transition-transform`}>
        <div className={iconColor}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
);

// ------------------------------------------------------------
// দ্বিভাষিক কন্টেন্ট (বাংলা + ইংরেজি)
// ------------------------------------------------------------
const translations = {
  bn: {
    // Hero
    welcomeMessage: "আপনার দিন পরিকল্পনা করুন, দক্ষতা অর্জন করুন এবং লক্ষ্যে পৌঁছান।",
    
    // Stats
    statsOverview: "সংক্ষিপ্ত পরিসংখ্যান",
    totalTasks: "মোট টাস্ক",
    completedTasks: "সম্পন্ন",
    productivity: "উৎপাদনশীলতা",
    focusTime: "ফোকাস সময়",
    
    // Quick Access
    quickAccess: "দ্রুত প্রবেশ",
    clickToNavigate: "ক্লিক করলে যাবে",
    todayDesc: "আজকের কাজ ও অগ্রগতি",
    blocksDesc: "সময় ব্যবস্থাপনা ও রুটিন",
    learningDesc: "কোর্স ও দক্ষতা উন্নয়ন",
    communicationDesc: "যোগাযোগ দক্ষতা রোডম্যাপ",
    lifeTimerDesc: "জীবনের সময় গণনা",
    roadmapDesc: "ক্যারিয়ার পথ পরিকল্পনা",
    
    // Features
    whyChoose: "কেন ডে মেট প্রো?",
    feature1Title: "স্মার্ট প্ল্যানিং",
    feature1Desc: "বুদ্ধিমানের সাথে দিন সাজান, সময় অপচয় রোধ করুন।",
    feature2Title: "অগ্রগতি ট্র্যাকিং",
    feature2Desc: "আপনার অগ্রগতি দেখুন, লক্ষ্যে পৌঁছান।",
    feature3Title: "দ্বিভাষিক সাপোর্ট",
    feature3Desc: "ইংরেজি ও বাংলায় পুরো অভিজ্ঞতা।",
    
    // Daily Motivation
    dailyMotivation: "দৈনিক অনুপ্রেরণা",
    quote: "একটি সফল ক্যারিয়ার গড়তে প্রতিদিন ১% উন্নতিই যথেষ্ট।",
    quoteAuthor: "ডে মেট প্রো",
    
    // Navigation labels
    today: "আজ",
    timeBlocks: "টাইম ব্লক",
    learningHub: "লার্নিং হাব",
    communication: "কমিউনিকেশন",
    lifeTimer: "লাইফ টাইমার",
    roadmap: "রোডম্যাপ",
  },
  en: {
    // Hero
    welcomeMessage: "Plan your day, master skills, and achieve your goals.",
    
    // Stats
    statsOverview: "Stats Overview",
    totalTasks: "Total Tasks",
    completedTasks: "Completed",
    productivity: "Productivity",
    focusTime: "Focus Time",
    
    // Quick Access
    quickAccess: "Quick Access",
    clickToNavigate: "Click to navigate",
    todayDesc: "Today's tasks and progress",
    blocksDesc: "Time management & routine",
    learningDesc: "Courses & skill development",
    communicationDesc: "Communication skills roadmap",
    lifeTimerDesc: "Life time calculation",
    roadmapDesc: "Career path planning",
    
    // Features
    whyChoose: "Why DayMate Pro?",
    feature1Title: "Smart Planning",
    feature1Desc: "Organize your day intelligently, reduce time waste.",
    feature2Title: "Progress Tracking",
    feature2Desc: "Monitor your progress, reach your goals.",
    feature3Title: "Bilingual Support",
    feature3Desc: "Full experience in English and Bengali.",
    
    // Daily Motivation
    dailyMotivation: "Daily Motivation",
    quote: "Building a successful career requires just 1% improvement every day.",
    quoteAuthor: "DayMate Pro",
    
    // Navigation labels
    today: "Today",
    timeBlocks: "Time Blocks",
    learningHub: "Learning Hub",
    communication: "Communication",
    lifeTimer: "Life Timer",
    roadmap: "Roadmap",
  },
};

export default Home;