import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Edit3,
  BookMarked,
  Languages,
  Globe,
  Library,
  Flame,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Award,
  Calendar,
  Search,
  Download,
  Upload,
  Target,
  Clock,
  ExternalLink,
  Smartphone,
  Monitor,
  Grid,
  List,
  RefreshCw,
  Server,
  Sun,
  Moon,
  Zap,
  Trophy,
  TrendingUp,
  Bell,
  Settings,
  Sparkles,
  GraduationCap,
  Headphones,
  Wifi,
  BookOpen,
  Compass,
  PenTool,
} from "lucide-react";

// ============================================================
// 1. কুরআনের ১১৪টি সূরার তালিকা
// ============================================================
const allSurahs = [
  { id: 1, name_bn: "আল-ফাতিহা", name_ar: "ٱلْفَاتِحَة", meaning: "The Opening", verses: 7, type: "Meccan" },
  { id: 2, name_bn: "আল-বাকারা", name_ar: "ٱلْبَقَرَة", meaning: "The Cow", verses: 286, type: "Medinan" },
  { id: 3, name_bn: "আলে-ইমরান", name_ar: "آلِ عِمْرَان", meaning: "Family of Imran", verses: 200, type: "Medinan" },
  { id: 4, name_bn: "আন-নিসা", name_ar: "ٱلنِّسَاء", meaning: "Women", verses: 176, type: "Medinan" },
  { id: 5, name_bn: "আল-মায়িদাহ", name_ar: "ٱلْمَائِدَة", meaning: "The Table", verses: 120, type: "Medinan" },
  { id: 6, name_bn: "আল-আন'আম", name_ar: "ٱلْأَنْعَام", meaning: "The Cattle", verses: 165, type: "Meccan" },
  { id: 7, name_bn: "আল-আ'রাফ", name_ar: "ٱلْأَعْرَاف", meaning: "The Heights", verses: 206, type: "Meccan" },
  { id: 8, name_bn: "আল-আনফাল", name_ar: "ٱلْأَنْفَال", meaning: "The Spoils", verses: 75, type: "Medinan" },
  { id: 9, name_bn: "আত-তাওবাহ", name_ar: "ٱلتَّوْبَة", meaning: "The Repentance", verses: 129, type: "Medinan" },
  { id: 10, name_bn: "ইউনুস", name_ar: "يُونُس", meaning: "Jonah", verses: 109, type: "Meccan" },
  { id: 11, name_bn: "হুদ", name_ar: "هُود", meaning: "Hud", verses: 123, type: "Meccan" },
  { id: 12, name_bn: "ইউসুফ", name_ar: "يُوسُف", meaning: "Joseph", verses: 111, type: "Meccan" },
  { id: 13, name_bn: "আর-রাদ", name_ar: "ٱلرَّعْد", meaning: "The Thunder", verses: 43, type: "Medinan" },
  { id: 14, name_bn: "ইব্রাহীম", name_ar: "إِبْرَاهِيم", meaning: "Abraham", verses: 52, type: "Meccan" },
  { id: 15, name_bn: "আল-হিজর", name_ar: "ٱلْحِجْر", meaning: "The Rocky Tract", verses: 99, type: "Meccan" },
  { id: 16, name_bn: "আন-নাহল", name_ar: "ٱلنَّحْل", meaning: "The Bee", verses: 128, type: "Meccan" },
  { id: 17, name_bn: "বনী-ইসরাঈল", name_ar: "ٱلْإِسْرَاء", meaning: "The Night Journey", verses: 111, type: "Meccan" },
  { id: 18, name_bn: "আল-কাহফ", name_ar: "ٱلْكَهْف", meaning: "The Cave", verses: 110, type: "Meccan" },
  { id: 19, name_bn: "মারইয়াম", name_ar: "مَرْيَم", meaning: "Mary", verses: 98, type: "Meccan" },
  { id: 20, name_bn: "ত্বোয়া-হা", name_ar: "طٰهٰ", meaning: "Ta-Ha", verses: 135, type: "Meccan" },
  { id: 21, name_bn: "আল-আম্বিয়া", name_ar: "ٱلْأَنْبِيَاء", meaning: "The Prophets", verses: 112, type: "Meccan" },
  { id: 22, name_bn: "আল-হজ্জ", name_ar: "ٱلْحَجّ", meaning: "The Pilgrimage", verses: 78, type: "Medinan" },
  { id: 23, name_bn: "আল-মু'মিনূন", name_ar: "ٱلْمُؤْمِنُون", meaning: "The Believers", verses: 118, type: "Meccan" },
  { id: 24, name_bn: "আন-নূর", name_ar: "ٱلنُّور", meaning: "The Light", verses: 64, type: "Medinan" },
  { id: 25, name_bn: "আল-ফুরকান", name_ar: "ٱلْفُرْقَان", meaning: "The Criterion", verses: 77, type: "Meccan" },
  { id: 26, name_bn: "আশ-শু'আরা", name_ar: "ٱلشُّعَرَاء", meaning: "The Poets", verses: 227, type: "Meccan" },
  { id: 27, name_bn: "আন-নামল", name_ar: "ٱلنَّمْل", meaning: "The Ant", verses: 93, type: "Meccan" },
  { id: 28, name_bn: "আল-কাসাস", name_ar: "ٱلْقَصَص", meaning: "The Stories", verses: 88, type: "Meccan" },
  { id: 29, name_bn: "আল-আনকাবূত", name_ar: "ٱلْعَنْكَبُوت", meaning: "The Spider", verses: 69, type: "Meccan" },
  { id: 30, name_bn: "আর-রূম", name_ar: "ٱلرُّوم", meaning: "The Romans", verses: 60, type: "Meccan" },
  { id: 31, name_bn: "লুকমান", name_ar: "لُقْمَان", meaning: "Luqman", verses: 34, type: "Meccan" },
  { id: 32, name_bn: "আস-সাজদাহ", name_ar: "ٱلسَّجْدَة", meaning: "The Prostration", verses: 30, type: "Meccan" },
  { id: 33, name_bn: "আল-আহযাব", name_ar: "ٱلْأَحْزَاب", meaning: "The Combined Forces", verses: 73, type: "Medinan" },
  { id: 34, name_bn: "সাবা", name_ar: "سَبَأ", meaning: "Sheba", verses: 54, type: "Meccan" },
  { id: 35, name_bn: "ফাতির", name_ar: "فَاطِر", meaning: "The Originator", verses: 45, type: "Meccan" },
  { id: 36, name_bn: "ইয়াসীন", name_ar: "يٰسٓ", meaning: "Ya Sin", verses: 83, type: "Meccan" },
  { id: 37, name_bn: "আস-সাফফাত", name_ar: "ٱلصَّافَّات", meaning: "Those Who Set The Ranks", verses: 182, type: "Meccan" },
  { id: 38, name_bn: "সোয়াদ", name_ar: "ص", meaning: "Sad", verses: 88, type: "Meccan" },
  { id: 39, name_bn: "আয-যুমার", name_ar: "ٱلزُّمَر", meaning: "The Troops", verses: 75, type: "Meccan" },
  { id: 40, name_bn: "আল-মু'মিন", name_ar: "غَافِر", meaning: "The Forgiver", verses: 85, type: "Meccan" },
  { id: 41, name_bn: "হা-মীম সাজদাহ", name_ar: "فُصِّلَت", meaning: "Explained in Detail", verses: 54, type: "Meccan" },
  { id: 42, name_bn: "আশ-শূরা", name_ar: "ٱلشُّورَىٰ", meaning: "The Consultation", verses: 53, type: "Meccan" },
  { id: 43, name_bn: "আয-যুখরুফ", name_ar: "ٱلزُّخْرُف", meaning: "The Gold Adornments", verses: 89, type: "Meccan" },
  { id: 44, name_bn: "আদ-দুখান", name_ar: "ٱلدُّخَان", meaning: "The Smoke", verses: 59, type: "Meccan" },
  { id: 45, name_bn: "আল-জাসিয়া", name_ar: "ٱلْجَاثِيَة", meaning: "The Kneeling", verses: 37, type: "Meccan" },
  { id: 46, name_bn: "আল-আহকাফ", name_ar: "ٱلْأَحْقَاف", meaning: "The Wind-Curved Sandhills", verses: 35, type: "Meccan" },
  { id: 47, name_bn: "মুহাম্মদ", name_ar: "مُحَمَّد", meaning: "Muhammad", verses: 38, type: "Medinan" },
  { id: 48, name_bn: "আল-ফাতহ", name_ar: "ٱلْفَتْح", meaning: "The Victory", verses: 29, type: "Medinan" },
  { id: 49, name_bn: "আল-হুজুরাত", name_ar: "ٱلْحُجُرَات", meaning: "The Dwellings", verses: 18, type: "Medinan" },
  { id: 50, name_bn: "ক্বাফ", name_ar: "ق", meaning: "Qaf", verses: 45, type: "Meccan" },
  { id: 51, name_bn: "আয-যারিয়াত", name_ar: "ٱلذَّارِيَات", meaning: "The Winnowing Winds", verses: 60, type: "Meccan" },
  { id: 52, name_bn: "আত-তূর", name_ar: "ٱلطُّور", meaning: "The Mount", verses: 49, type: "Meccan" },
  { id: 53, name_bn: "আন-নাজম", name_ar: "ٱلنَّجْم", meaning: "The Star", verses: 62, type: "Meccan" },
  { id: 54, name_bn: "আল-ক্বামার", name_ar: "ٱلْقَمَر", meaning: "The Moon", verses: 55, type: "Meccan" },
  { id: 55, name_bn: "আর-রহমান", name_ar: "ٱلرَّحْمَٰن", meaning: "The Beneficent", verses: 78, type: "Medinan" },
  { id: 56, name_bn: "আল-ওয়াকিয়াহ", name_ar: "ٱلْوَاقِعَة", meaning: "The Inevitable", verses: 96, type: "Meccan" },
  { id: 57, name_bn: "আল-হাদীদ", name_ar: "ٱلْحَدِيد", meaning: "The Iron", verses: 29, type: "Medinan" },
  { id: 58, name_bn: "আল-মুজাদালাহ", name_ar: "ٱلْمُجَادَلَة", meaning: "The Pleading Woman", verses: 22, type: "Medinan" },
  { id: 59, name_bn: "আল-হাশর", name_ar: "ٱلْحَشْر", meaning: "The Exile", verses: 24, type: "Medinan" },
  { id: 60, name_bn: "আল-মুমতাহিনাহ", name_ar: "ٱلْمُمْتَحَنَة", meaning: "She That Is To Be Examined", verses: 13, type: "Medinan" },
  { id: 61, name_bn: "আস-সাফ", name_ar: "ٱلصَّفّ", meaning: "The Ranks", verses: 14, type: "Medinan" },
  { id: 62, name_bn: "আল-জুমুআহ", name_ar: "ٱلْجُمُعَة", meaning: "The Congregation", verses: 11, type: "Medinan" },
  { id: 63, name_bn: "আল-মুনাফিকুন", name_ar: "ٱلْمُنَافِقُون", meaning: "The Hypocrites", verses: 11, type: "Medinan" },
  { id: 64, name_bn: "আত-তাগাবুন", name_ar: "ٱلتَّغَابُن", meaning: "The Mutual Disillusion", verses: 18, type: "Medinan" },
  { id: 65, name_bn: "আত-তালাক", name_ar: "ٱلطَّلَاق", meaning: "The Divorce", verses: 12, type: "Medinan" },
  { id: 66, name_bn: "আত-তাহরীম", name_ar: "ٱلتَّحْرِيم", meaning: "The Prohibition", verses: 12, type: "Medinan" },
  { id: 67, name_bn: "আল-মুলক", name_ar: "ٱلْمُلْك", meaning: "The Sovereignty", verses: 30, type: "Meccan" },
  { id: 68, name_bn: "আল-কালাম", name_ar: "ٱلْقَلَم", meaning: "The Pen", verses: 52, type: "Meccan" },
  { id: 69, name_bn: "আল-হাক্কাহ", name_ar: "ٱلْحَاقَّة", meaning: "The Reality", verses: 52, type: "Meccan" },
  { id: 70, name_bn: "আল-মাআরিজ", name_ar: "ٱلْمَعَارِج", meaning: "The Ascending Stairways", verses: 44, type: "Meccan" },
  { id: 71, name_bn: "নূহ", name_ar: "نُوح", meaning: "Noah", verses: 28, type: "Meccan" },
  { id: 72, name_bn: "আল-জিন", name_ar: "ٱلْجِنّ", meaning: "The Jinn", verses: 28, type: "Meccan" },
  { id: 73, name_bn: "আল-মুজ্জাম্মিল", name_ar: "ٱلْمُزَّمِّل", meaning: "The Enshrouded One", verses: 20, type: "Meccan" },
  { id: 74, name_bn: "আল-মুদ্দাসসির", name_ar: "ٱلْمُدَّثِّر", meaning: "The Cloaked One", verses: 56, type: "Meccan" },
  { id: 75, name_bn: "আল-কিয়ামাহ", name_ar: "ٱلْقِيَامَة", meaning: "The Resurrection", verses: 40, type: "Meccan" },
  { id: 76, name_bn: "আল-ইনসান", name_ar: "ٱلْإِنْسَان", meaning: "Man", verses: 31, type: "Medinan" },
  { id: 77, name_bn: "আল-মুরসালাত", name_ar: "ٱلْمُرْسَلَات", meaning: "The Emissaries", verses: 50, type: "Meccan" },
  { id: 78, name_bn: "আন-নাবা", name_ar: "ٱلنَّبَأ", meaning: "The Great News", verses: 40, type: "Meccan" },
  { id: 79, name_bn: "আন-নাযি'আত", name_ar: "ٱلنَّازِعَات", meaning: "Those Who Drag Forth", verses: 46, type: "Meccan" },
  { id: 80, name_bn: "আবাসা", name_ar: "عَبَسَ", meaning: "He Frowned", verses: 42, type: "Meccan" },
  { id: 81, name_bn: "আত-তাকবীর", name_ar: "ٱلتَّكْوِير", meaning: "The Overthrowing", verses: 29, type: "Meccan" },
  { id: 82, name_bn: "আল-ইনফিতার", name_ar: "ٱلْإِنْفِطَار", meaning: "The Cleaving", verses: 19, type: "Meccan" },
  { id: 83, name_bn: "আল-মুতাফফিফীন", name_ar: "ٱلْمُطَفِّفِين", meaning: "The Defrauding", verses: 36, type: "Meccan" },
  { id: 84, name_bn: "আল-ইনশিকাক", name_ar: "ٱلْإِنْشِقَاق", meaning: "The Sundering", verses: 25, type: "Meccan" },
  { id: 85, name_bn: "আল-বুরুজ", name_ar: "ٱلْبُرُوج", meaning: "The Mansions of the Stars", verses: 22, type: "Meccan" },
  { id: 86, name_bn: "আত-তারিক", name_ar: "ٱلطَّارِق", meaning: "The Nightcomer", verses: 17, type: "Meccan" },
  { id: 87, name_bn: "আল-আ'লা", name_ar: "ٱلْأَعْلَىٰ", meaning: "The Most High", verses: 19, type: "Meccan" },
  { id: 88, name_bn: "আল-গাশিয়াহ", name_ar: "ٱلْغَاشِيَة", meaning: "The Overwhelming", verses: 26, type: "Meccan" },
  { id: 89, name_bn: "আল-ফাজর", name_ar: "ٱلْفَجْر", meaning: "The Dawn", verses: 30, type: "Meccan" },
  { id: 90, name_bn: "আল-বালাদ", name_ar: "ٱلْبَلَد", meaning: "The City", verses: 20, type: "Meccan" },
  { id: 91, name_bn: "আশ-শামস", name_ar: "ٱلشَّمْس", meaning: "The Sun", verses: 15, type: "Meccan" },
  { id: 92, name_bn: "আল-লায়ল", name_ar: "ٱلَّيْل", meaning: "The Night", verses: 21, type: "Meccan" },
  { id: 93, name_bn: "আদ-দুহা", name_ar: "ٱلضُّحَىٰ", meaning: "The Morning Hours", verses: 11, type: "Meccan" },
  { id: 94, name_bn: "আল-ইনশিরাহ", name_ar: "ٱلشَّرْح", meaning: "The Relief", verses: 8, type: "Meccan" },
  { id: 95, name_bn: "আত-তীন", name_ar: "ٱلتِّين", meaning: "The Fig", verses: 8, type: "Meccan" },
  { id: 96, name_bn: "আল-আলাক", name_ar: "ٱلْعَلَق", meaning: "The Clot", verses: 19, type: "Meccan" },
  { id: 97, name_bn: "আল-ক্বদর", name_ar: "ٱلْقَدْر", meaning: "The Power", verses: 5, type: "Meccan" },
  { id: 98, name_bn: "আল-বাইয়্যিনাহ", name_ar: "ٱلْبَيِّنَة", meaning: "The Clear Proof", verses: 8, type: "Medinan" },
  { id: 99, name_bn: "আয-যিলযাল", name_ar: "ٱلزَّلْزَلَة", meaning: "The Earthquake", verses: 8, type: "Medinan" },
  { id: 100, name_bn: "আল-আদিয়াত", name_ar: "ٱلْعَادِيَات", meaning: "The Chargers", verses: 11, type: "Meccan" },
  { id: 101, name_bn: "আল-কারিয়াহ", name_ar: "ٱلْقَارِعَة", meaning: "The Calamity", verses: 11, type: "Meccan" },
  { id: 102, name_bn: "আত-তাকাসুর", name_ar: "ٱلتَّكَاثُر", meaning: "The Rivalry in World Increase", verses: 8, type: "Meccan" },
  { id: 103, name_bn: "আল-আসর", name_ar: "ٱلْعَصْر", meaning: "The Declining Day", verses: 3, type: "Meccan" },
  { id: 104, name_bn: "আল-হুমাযাহ", name_ar: "ٱلْهُمَزَة", meaning: "The Traducer", verses: 9, type: "Meccan" },
  { id: 105, name_bn: "আল-ফীল", name_ar: "ٱلْفِيل", meaning: "The Elephant", verses: 5, type: "Meccan" },
  { id: 106, name_bn: "কুরাইশ", name_ar: "قُرَيْش", meaning: "Quraysh", verses: 4, type: "Meccan" },
  { id: 107, name_bn: "আল-মা'উন", name_ar: "ٱلْمَاعُون", meaning: "The Small Kindnesses", verses: 7, type: "Meccan" },
  { id: 108, name_bn: "আল-কাওসার", name_ar: "ٱلْكَوْثَر", meaning: "The Abundance", verses: 3, type: "Meccan" },
  { id: 109, name_bn: "আল-কাফিরুন", name_ar: "ٱلْكَافِرُون", meaning: "The Disbelievers", verses: 6, type: "Meccan" },
  { id: 110, name_bn: "আন-নাসর", name_ar: "ٱلنَّصْر", meaning: "The Divine Support", verses: 3, type: "Medinan" },
  { id: 111, name_bn: "আল-লাহাব", name_ar: "ٱلْمَسَد", meaning: "The Palm Fiber", verses: 5, type: "Meccan" },
  { id: 112, name_bn: "আল-ইখলাস", name_ar: "ٱلْإِخْلَاص", meaning: "The Sincerity", verses: 4, type: "Meccan" },
  { id: 113, name_bn: "আল-ফালাক", name_ar: "ٱلْفَلَق", meaning: "The Daybreak", verses: 5, type: "Meccan" },
  { id: 114, name_bn: "আন-নাস", name_ar: "ٱلنَّاس", meaning: "Mankind", verses: 6, type: "Meccan" },
];

// ============================================================
// 2. ইংরেজি গ্রামার ওয়েবসাইট
// ============================================================
const grammarWebsites = [
  {
    name: "Gganbitan English Grammar",
    description: "Parts of Speech, Tenses (12 types), Voice, Narration – সম্পূর্ণ বাংলায় উদাহরণসহ",
    url: "https://www.gganbitan.com/2025/08/learn-english-grammar-online.html",
    icon: "📘",
    type: "web",
  }
];

// ============================================================
// 3. কুরআন ওয়েবসাইট
// ============================================================
const quranWebsites = [
  {
    name: "Hadithbd Quran & Tafsir",
    description: "তাফসিরসহ পূর্ণাঙ্গ কুরআন, বাংলা অনুবাদ ও হাদিস",
    url: "https://www.hadithbd.net/quran",
    icon: "🕌",
    type: "web",
  },
  {
    name: "Quran.com (Bangla)",
    description: "বিশ্বব্যাপী জনপ্রিয়, ড. মুহিউদ্দীন খানের অনুবাদ",
    url: "https://quran.com/bn",
    icon: "📖",
    type: "web",
  },
  {
    name: "ইসলামিক ফাউন্ডেশন",
    description: "সরকারি অনুবাদ ও তাফসির, পিডিএফ ডাউনলোড",
    url: "https://quran.gov.bd",
    icon: "🇧🇩",
    type: "web",
  },
];

// ============================================================
// 4. সাধারণ জ্ঞান ও চাকরি প্রস্তুতি ওয়েবসাইট
// ============================================================
const gkWebsites = [
  {
    name: "BPSC (বাংলাদেশ সরকারি কর্ম কমিশন)",
    description: "বিসিএস পরীক্ষার অফিসিয়াল নোটিশ, সার্কুলার, ফলাফল",
    url: "http://www.bpsc.gov.bd",
    icon: "🏛️",
    type: "web",
    isOfficial: true,
  },
  {
    name: "NTRCA (বেসরকারি শিক্ষক নিবন্ধন)",
    description: "এনটিআরসিএ-র অফিসিয়াল ওয়েবসাইট, বিজ্ঞপ্তি ও ফলাফল",
    url: "http://www.ntrca.gov.bd",
    icon: "📚",
    type: "web",
    isOfficial: true,
  },
  {
    name: "DPE (প্রাথমিক শিক্ষা অধিদপ্তর)",
    description: "প্রাথমিক শিক্ষক নিয়োগের অফিসিয়াল ওয়েবসাইট",
    url: "http://www.dpe.gov.bd",
    icon: "🏫",
    type: "web",
    isOfficial: true,
  },
  {
    name: "বাংলাপিডিয়া (Banglapedia)",
    description: "বাংলাদেশের জাতীয় বিশ্বকোষ, ৫,৭০০+ এন্ট্রি, ইতিহাস, ভূগোল, সংস্কৃতি",
    url: "https://en.banglapedia.org",
    urlBangla: "https://bn.banglapedia.org",
    icon: "📔",
    type: "web",
    isOfficial: false,
  },
  {
    name: "বাংলাদেশ পরিসংখ্যান ব্যুরো (BBS)",
    description: "সরকারি পরিসংখ্যান, জনশুমারি, অর্থনৈতিক সূচক – বিসিএস জিকের জন্য অপরিহার্য",
    url: "http://nsds.bbs.gov.bd",
    icon: "📊",
    type: "web",
    isOfficial: true,
  },
  {
    name: "দ্য ডেইলি স্টার (Bangladesh)",
    description: "দেশের শীর্ষ ইংরেজি দৈনিক, রাজনীতি, অর্থনীতি, শিক্ষা, পরিবেশ",
    url: "https://www.thedailystar.net/bangladesh",
    icon: "📰",
    type: "web",
    isOfficial: false,
  },
  {
    name: "বাংলাদেশ প্রতিদিন (শিক্ষা পাতা)",
    description: "চাকরি পরীক্ষার খবর, পরামর্শ, প্রস্তুতি নির্দেশিকা",
    url: "https://www.bd-pratidin.com/education",
    icon: "📰",
    type: "web",
    isOfficial: false,
  },
];

// ============================================================
// 5. মোবাইল অ্যাপ রিসোর্স
// ============================================================
const mobileApps = [
  {
    name: "Live MCQ™",
    description: "বিসিএস, ব্যাংক, এনটিআরসিএ-র লাইভ টেস্ট, ১৬+ লাখ ব্যবহারকারী",
    url: "https://livemcq.com",
    playStore: "https://play.google.com/store/apps/details?id=com.livemcq.livemcq",
    icon: "📱",
    type: "app",
  },
  {
    name: "Primary Job Preparation",
    description: "প্রাথমিক শিক্ষক নিয়োগ, বিসিএস, এনটিআরসিএ-র মডেল টেস্ট",
    url: null,
    playStore: "https://play.google.com/store/apps/details?id=com.onlineschool.primaryexam",
    icon: "📱",
    type: "app",
  },
  {
    name: "P2A Academy",
    description: "৫ লাখ+ শিক্ষার্থী, ফ্রি কোর্স, ২৪/৭ মেন্টরশিপ",
    url: null,
    playStore: null,
    icon: "📱",
    type: "app",
  },
];

// ============================================================
// 6. প্রজ্ঞা বাণী (Daily Wisdom)
// ============================================================
const dailyQuotes = [
  { text: "So verily, with the hardship, there is relief.", source: "Quran 94:5" },
  { text: "The best among you are those who learn the Quran and teach it.", source: "Bukhari" },
  { text: "Knowledge is the lost property of a believer.", source: "Tirmidhi" },
  { text: "Do not be lazy, do not be careless.", source: "Imam Ali" },
  { text: "Your today is the best day to start.", source: "Anonymous" },
  { text: "Consistency is better than perfection.", source: "Productivity Tip" },
  { text: "Every expert was once a beginner.", source: "Motivation" },
];

// ============================================================
// 7. ইংরেজি গ্রামার সাবটপিক
// ============================================================
const grammarSubtopics = {
  "Parts of Speech": [
    "Noun", "Pronoun", "Verb", "Adjective", "Adverb", "Preposition", "Conjunction", "Interjection"
  ],
  "Tenses (12 types)": [
    "Present Simple", "Present Continuous", "Present Perfect", "Present Perfect Continuous",
    "Past Simple", "Past Continuous", "Past Perfect", "Past Perfect Continuous",
    "Future Simple", "Future Continuous", "Future Perfect", "Future Perfect Continuous"
  ],
  "Subject-Verb Agreement": [
    "Basic Rules", "Collective Nouns", "Indefinite Pronouns", "Either/Neither", "There is/are"
  ],
  "Active & Passive Voice": [
    "Present Tense", "Past Tense", "Future Tense", "Modal Verbs"
  ],
  "Direct & Indirect Speech": [
    "Statements", "Questions", "Commands", "Exclamations"
  ],
  "Modals & Auxiliaries": [
    "Can/Could", "May/Might", "Shall/Should", "Will/Would", "Must", "Ought to", "Need", "Dare"
  ],
  "Conditional Sentences": [
    "Zero Conditional", "First Conditional", "Second Conditional", "Third Conditional", "Mixed Conditional"
  ],
  "Punctuation & Capitalization": [
    "Period", "Comma", "Question Mark", "Exclamation Mark", "Apostrophe", "Quotes", "Capital Letters"
  ],
  "Common Errors": [
    "Subject-Verb", "Pronoun Agreement", "Preposition Errors", "Word Choice"
  ],
  "Advanced Syntax": [
    "Clauses", "Phrases", "Sentence Types", "Parallelism"
  ],
};

// ============================================================
// 8. নেটওয়ার্কিং টপিকস
// ============================================================
const networkingTopics = {
  "Networking Fundamentals": [
    "What is Networking?",
    "OSI Model (7 Layers)",
    "TCP/IP Model",
    "IP Addressing (IPv4 & IPv6)",
    "Subnetting",
    "VLANs",
    "NAT & PAT"
  ],
  "Network Devices": [
    "Hub, Switch, Router",
    "Bridge, Repeater",
    "Firewall",
    "Load Balancer",
    "Proxy Server"
  ],
  "Protocols": [
    "HTTP/HTTPS",
    "FTP/SFTP",
    "DNS",
    "DHCP",
    "SMTP/POP3/IMAP",
    "SNMP",
    "ARP",
    "ICMP"
  ],
  "Routing & Switching": [
    "Static vs Dynamic Routing",
    "RIP, OSPF, BGP",
    "Switching Techniques",
    "STP (Spanning Tree Protocol)"
  ],
  "Network Security": [
    "Firewall Rules",
    "VPN",
    "IDS/IPS",
    "SSL/TLS",
    "AAA (Authentication, Authorization, Accounting)"
  ],
  "Wireless & Mobile": [
    "Wi-Fi Standards (802.11)",
    "Cellular Networks (4G/5G)",
    "Bluetooth",
    "RFID/NFC"
  ],
  "Cloud & Virtualization": [
    "SDN (Software Defined Networking)",
    "NFV",
    "Cloud Networking (AWS VPC, Azure VNet)"
  ],
  "Troubleshooting": [
    "Ping, Traceroute",
    "Wireshark Basics",
    "Netstat, Nslookup",
    "Common Network Issues"
  ]
};

// ============================================================
// 9. নেটওয়ার্কিং ওয়েব রিসোর্স
// ============================================================
const networkingWebsites = [
  {
    name: "Cisco Networking Academy",
    description: "ফ্রি কোর্স, সার্টিফিকেশন, ল্যাব",
    url: "https://www.netacad.com",
    icon: "🌐",
    type: "web",
  },
  {
    name: "Professor Messer (Network+)",
    description: "ফ্রি ভিডিও টিউটোরিয়াল, নোটস",
    url: "https://www.professormesser.com/network-plus/n10-008/",
    icon: "🎥",
    type: "web",
  },
  {
    name: "GeeksforGeeks – Networking",
    description: "বিস্তারিত আর্টিকেল, উদাহরণ",
    url: "https://www.geeksforgeeks.org/computer-network-tutorials/",
    icon: "📚",
    type: "web",
  },
  {
    name: "PacketLife.net",
    description: "চিট শিট, ল্যাব, টিউটোরিয়াল",
    url: "https://packetlife.net",
    icon: "📦",
    type: "web",
  },
];

// ============================================================
// 10. MAIN COMPONENT – LearningRoadmap
// ============================================================
const LearningRoadmap = () => {
  // ---------- State Declarations ----------
  const [grammarProgress, setGrammarProgress] = useState(() => {
    const saved = localStorage.getItem("grammar_progress_v6");
    return saved ? JSON.parse(saved) : {};
  });

  const [quranProgress, setQuranProgress] = useState(() => {
    const saved = localStorage.getItem("quran_progress_v6");
    if (saved) return JSON.parse(saved);
    return allSurahs.map((s) => ({ completedVerses: 0, totalVerses: s.verses }));
  });

  const [networkingProgress, setNetworkingProgress] = useState(() => {
    const saved = localStorage.getItem("networking_progress_v6");
    return saved ? JSON.parse(saved) : {};
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("learning_notes_v6");
    return saved ? JSON.parse(saved) : {};
  });

  const [timer, setTimer] = useState({ running: false, seconds: 0, category: null });
  const timerInterval = useRef(null);
  const timerStartTime = useRef(null);

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("streak_v6");
    return saved ? JSON.parse(saved) : { count: 0, lastActive: null, longest: 0 };
  });

  const [heatmap, setHeatmap] = useState(() => {
    const saved = localStorage.getItem("heatmap_v6");
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return { date: d.toDateString(), minutes: 0 };
    });
  });

  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem("daily_goal_v6");
    return saved ? parseInt(saved) : 30;
  });

  const [todayMinutes, setTodayMinutes] = useState(() => {
    const saved = localStorage.getItem("today_minutes_v6");
    const savedDate = localStorage.getItem("today_date_v6");
    const today = new Date().toDateString();

    if (savedDate === today) {
      return saved ? parseInt(saved) : 0;
    } else {
      localStorage.setItem("today_date_v6", today);
      return 0;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState("grammar");
  const [expandedGrammarMain, setExpandedGrammarMain] = useState({});
  const [expandedNetworkingMain, setExpandedNetworkingMain] = useState({});
  const [expandedSurahId, setExpandedSurahId] = useState(null);
  const [verseInputs, setVerseInputs] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteKey, setEditingNoteKey] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [grammarView, setGrammarView] = useState("grid");
  const [quranView, setQuranView] = useState("grid");
  const [gkView, setGkView] = useState("grid");
  const [networkingView, setNetworkingView] = useState("grid");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("dark_mode_v6");
    return saved ? JSON.parse(saved) : false;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, meccan, medinan
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // ---------- Dark Mode Effect ----------
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem("dark_mode_v6", JSON.stringify(darkMode));
  }, [darkMode]);

  // ---------- Daily Wisdom ----------
  const [dailyWisdom, setDailyWisdom] = useState(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem("daily_wisdom_v6");
    if (saved) {
      const { date, quote } = JSON.parse(saved);
      if (date === today) return quote;
    }
    const random = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
    localStorage.setItem("daily_wisdom_v6", JSON.stringify({ date: today, quote: random }));
    return random;
  });

  // ---------- LocalStorage Persistence ----------
  useEffect(() => {
    localStorage.setItem("grammar_progress_v6", JSON.stringify(grammarProgress));
  }, [grammarProgress]);

  useEffect(() => {
    localStorage.setItem("quran_progress_v6", JSON.stringify(quranProgress));
  }, [quranProgress]);

  useEffect(() => {
    localStorage.setItem("networking_progress_v6", JSON.stringify(networkingProgress));
  }, [networkingProgress]);

  useEffect(() => {
    localStorage.setItem("learning_notes_v6", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("streak_v6", JSON.stringify(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("heatmap_v6", JSON.stringify(heatmap));
  }, [heatmap]);

  useEffect(() => {
    localStorage.setItem("daily_goal_v6", dailyGoal.toString());
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem("today_minutes_v6", todayMinutes.toString());
  }, [todayMinutes]);

  // ---------- Streak Update ----------
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    if (streak.lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = streak.lastActive === yesterday ? streak.count + 1 : 1;
      const newLongest = Math.max(streak.longest || 0, newStreak);

      setStreak({ count: newStreak, lastActive: today, longest: newLongest });

      // Update heatmap with current date
      const dayIndex = new Date().getDate() - 1;
      setHeatmap((prev) => {
        const newHeatmap = [...prev];
        newHeatmap[dayIndex] = {
          date: today,
          minutes: (newHeatmap[dayIndex]?.minutes || 0) + 1
        };
        return newHeatmap;
      });

      if (newStreak === 7) {
        addNotification("🔥 7-day streak! You're on fire!", "success");
        toast.success("🔥 7-day streak! Keep going!");
      }
      if (newStreak === 30) {
        addNotification("🏆 30-day streak! Legendary!", "achievement");
        toast.success("🏆 30-day streak! Unstoppable!");
      }
      if (newStreak === 100) {
        addNotification("👑 100-day streak! You're a master!", "achievement");
      }
    }
  }, [streak]);

  // ---------- Add Notification ----------
  const addNotification = (message, type = "info") => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 20));
  };

  // ---------- Toggle Grammar Subtopic ----------
  const toggleGrammar = useCallback((mainTopic, subtopic) => {
    const key = `${mainTopic}||${subtopic}`;
    setGrammarProgress((prev) => {
      const newProgress = { ...prev, [key]: !prev[key] };
      if (newProgress[key]) updateStreak();
      return newProgress;
    });
  }, [updateStreak]);

  // ---------- Toggle Networking Topic ----------
  const toggleNetworking = useCallback((mainTopic, subtopic) => {
    const key = `${mainTopic}||${subtopic}`;
    setNetworkingProgress((prev) => {
      const newProgress = { ...prev, [key]: !prev[key] };
      if (newProgress[key]) updateStreak();
      return newProgress;
    });
  }, [updateStreak]);

  // ---------- Update Quran Progress ----------
  const updateQuranProgress = useCallback((surahId, completed) => {
    setQuranProgress((prev) => {
      const newProgress = [...prev];
      const idx = surahId - 1;
      if (completed < 0) completed = 0;
      if (completed > allSurahs[idx].verses) completed = allSurahs[idx].verses;
      if (completed > prev[idx].completedVerses) updateStreak();
      newProgress[idx] = { ...newProgress[idx], completedVerses: completed };
      return newProgress;
    });
  }, [updateStreak]);

  // ---------- Timer Functions ----------
  const startTimer = (category) => {
    if (timer.running) stopTimer();
    timerStartTime.current = Date.now() - timer.seconds * 1000;

    setTimer({ running: true, seconds: timer.seconds, category });

    timerInterval.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - timerStartTime.current) / 1000);
      setTimer((prev) => ({ ...prev, seconds: elapsedSeconds }));
    }, 1000);

    addNotification(`Started studying ${getCategoryName(category)}`, "info");
  };

  const stopTimer = () => {
    setTimer((prev) => ({ ...prev, running: false }));
    clearInterval(timerInterval.current);

    if (timer.category && timer.seconds > 0) {
      const minutes = Math.floor(timer.seconds / 60);
      setTodayMinutes((prev) => prev + minutes);

      const today = new Date().toDateString();
      const dayIndex = new Date().getDate() - 1;
      setHeatmap((prev) => {
        const newHeatmap = [...prev];
        newHeatmap[dayIndex] = {
          date: today,
          minutes: (newHeatmap[dayIndex]?.minutes || 0) + minutes
        };
        return newHeatmap;
      });

      toast.success(`✅ Added ${minutes} study minutes!`);
      addNotification(`Completed ${minutes} minutes of ${getCategoryName(timer.category)}`, "success");

      if (todayMinutes + minutes >= dailyGoal) {
        toast.success("🎉 Daily goal achieved!");
        addNotification("Daily goal achieved! Great job!", "achievement");
      }
    }
  };

  const resetTimer = () => {
    setTimer({ running: false, seconds: 0, category: null });
    clearInterval(timerInterval.current);
    timerStartTime.current = null;
  };

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getCategoryName = (cat) => {
    const names = {
      grammar: "English Grammar",
      quran: "Quran Reading",
      gk: "General Knowledge",
      networking: "Networking"
    };
    return names[cat] || cat;
  };

  useEffect(() => {
    return () => clearInterval(timerInterval.current);
  }, []);

  // ---------- Notes ----------
  const saveNote = (key) => {
    setNotes((prev) => ({ ...prev, [key]: noteText }));
    setEditingNoteKey(null);
    setNoteText("");
    toast.success("Note saved!");
    addNotification("Note saved successfully", "success");
  };

  // ---------- Filtered Surahs ----------
  const filteredSurahs = useMemo(() => {
    let filtered = allSurahs;

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name_bn.includes(searchQuery) ||
        s.name_ar.includes(searchQuery) ||
        s.meaning.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(s => s.type.toLowerCase() === filterType.toLowerCase());
    }

    return filtered;
  }, [searchQuery, filterType]);

  // ---------- Grammar Stats ----------
  const grammarStats = useMemo(() => {
    const allSubs = Object.values(grammarSubtopics).flat();
    const total = allSubs.length;
    const completed = allSubs.filter(sub => {
      for (let main in grammarSubtopics) {
        if (grammarSubtopics[main].includes(sub) && grammarProgress[`${main}||${sub}`]) return true;
      }
      return false;
    }).length;
    return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
  }, [grammarProgress]);

  // ---------- Quran Stats ----------
  const quranStats = useMemo(() => {
    const totalVerses = allSurahs.reduce((acc, s) => acc + s.verses, 0);
    const completedVerses = quranProgress.reduce((acc, s) => acc + (s.completedVerses || 0), 0);
    return { total: totalVerses, completed: completedVerses, percent: totalVerses ? Math.round((completedVerses / totalVerses) * 100) : 0 };
  }, [quranProgress]);

  // ---------- Networking Stats ----------
  const networkingStats = useMemo(() => {
    const allSubs = Object.values(networkingTopics).flat();
    const total = allSubs.length;
    const completed = allSubs.filter(sub => {
      for (let main in networkingTopics) {
        if (networkingTopics[main].includes(sub) && networkingProgress[`${main}||${sub}`]) return true;
      }
      return false;
    }).length;
    return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
  }, [networkingProgress]);

  // ---------- Overall Stats ----------
  const overallStats = useMemo(() => {
    const totalTopics = grammarStats.total + networkingStats.total;
    const completedTopics = grammarStats.completed + networkingStats.completed;
    const totalVerses = quranStats.total;
    const completedVerses = quranStats.completed;

    const totalPoints = completedTopics * 10 + completedVerses;
    const level = Math.floor(totalPoints / 100) + 1;
    const pointsToNextLevel = 100 - (totalPoints % 100);

    return {
      totalTopics,
      completedTopics,
      totalVerses,
      completedVerses,
      totalPoints,
      level,
      pointsToNextLevel
    };
  }, [grammarStats, networkingStats, quranStats]);

  // ---------- Get medal based on completed count ----------
  const getMedal = (count) => {
    if (count >= 50) return "🥇";
    if (count >= 25) return "🥈";
    if (count >= 10) return "🥉";
    return "";
  };

  const rotateQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % dailyQuotes.length);
    setDailyWisdom(dailyQuotes[quoteIndex]);
  };

  // ---------- Export/Import Data ----------
  const exportData = () => {
    const data = {
      grammarProgress,
      quranProgress,
      networkingProgress,
      notes,
      streak,
      heatmap,
      dailyGoal,
      todayMinutes,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learning-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Data exported successfully!");
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (data.grammarProgress) setGrammarProgress(data.grammarProgress);
        if (data.quranProgress) setQuranProgress(data.quranProgress);
        if (data.networkingProgress) setNetworkingProgress(data.networkingProgress);
        if (data.notes) setNotes(data.notes);
        if (data.streak) setStreak(data.streak);
        if (data.heatmap) setHeatmap(data.heatmap);
        if (data.dailyGoal) setDailyGoal(data.dailyGoal);
        if (data.todayMinutes) setTodayMinutes(data.todayMinutes);

        toast.success("Data imported successfully!");
        addNotification("Data imported successfully", "success");
      } catch (error) {
        toast.error("Invalid data file");
      }
    };
    reader.readAsText(file);
  };

  // ---------- Clear All Data ----------
  const clearAllData = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // ---------- Mark notification as read ----------
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* ----- Notification Panel ----- */}
      {showNotifications && (
        <div className="fixed top-20 right-4 z-50 w-80 max-w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slideIn">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ChevronUp size={18} />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    notification.read ? 'opacity-60' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'achievement' ? 'bg-yellow-500' :
                      notification.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ----- Settings Modal ----- */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <ChevronDown size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon size={18} className="text-indigo-600" /> : <Sun size={18} className="text-yellow-600" />}
                  <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    darkMode ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Download size={18} className="text-green-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Export/Import Data</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={exportData} className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition">
                    Export
                  </button>
                  <label className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition text-center cursor-pointer">
                    Import
                    <input type="file" accept=".json" onChange={importData} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-red-600 text-lg">⚠️</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Danger Zone</span>
                </div>
                <button onClick={clearAllData} className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition">
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----- Main Content ----- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* ----- Header with Glassmorphism ----- */}
        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-60 animate-pulse" />
                <div className="relative p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
                  <Library className="text-white" size={28} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Learning Hub
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track, master & achieve your goals</p>
              </div>
            </div>

            {/* Right Side - Streak, Notifications, Dark Mode */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Streak Card */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white">
                <Flame size={18} className="animate-pulse" />
                <span className="font-bold">{streak.count}</span>
                <span className="text-xs opacity-90">day streak</span>
              </div>

              {/* Longest Streak */}
              <div className="hidden sm:flex items-center gap-1 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Trophy size={14} className="text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Best: {streak.longest || 0}</span>
              </div>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition"
              >
                <Bell size={18} className="text-gray-700 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition"
              >
                {darkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-indigo-600" />}
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition"
              >
                <Settings size={18} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Daily Wisdom - Mobile & Desktop */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl">
            <div className="flex items-center gap-2 cursor-pointer" onClick={rotateQuote}>
              <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Daily Wisdom</p>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">"{dailyWisdom.text}"</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">— {dailyWisdom.source}</p>
            </div>
            <button onClick={rotateQuote} className="p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-full transition">
              <RefreshCw size={14} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* ----- Daily Goal & Stats Overview ----- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Daily Goal Card */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target size={20} className="text-indigo-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Goal</span>
              </div>
              <select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-green-600" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {todayMinutes} / {dailyGoal} min
                  </span>
                </div>
                <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (todayMinutes / dailyGoal) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Level Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Current Level</span>
              <GraduationCap size={20} className="opacity-90" />
            </div>
            <div className="text-3xl font-bold mb-1">Level {overallStats.level}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${100 - (overallStats.pointsToNextLevel / 100) * 100}%` }}
                />
              </div>
              <span className="text-xs">{overallStats.pointsToNextLevel} XP to next</span>
            </div>
          </div>

          {/* Total Points Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Total XP</span>
              <Zap size={20} className="opacity-90" />
            </div>
            <div className="text-3xl font-bold mb-1">{overallStats.totalPoints}</div>
            <div className="text-xs opacity-90">From {overallStats.completedTopics} topics & {overallStats.completedVerses} verses</div>
          </div>

          {/* Completion Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Overall Progress</span>
              <TrendingUp size={20} className="opacity-90" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {Math.round((overallStats.completedTopics + overallStats.completedVerses / 10) /
                (overallStats.totalTopics + overallStats.totalVerses / 10) * 100)}%
            </div>
            <div className="text-xs opacity-90">{overallStats.completedTopics}/{overallStats.totalTopics} topics</div>
          </div>
        </div>

        {/* ----- Category Tabs with Icons ----- */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "grammar", icon: <Languages size={18} />, label: "English Grammar", color: "blue" },
            { id: "quran", icon: <BookMarked size={18} />, label: "Quran Reading", color: "amber" },
            { id: "gk", icon: <Globe size={18} />, label: "General Knowledge", color: "emerald" },
            { id: "networking", icon: <Server size={18} />, label: "Networking", color: "purple" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all transform hover:scale-105 ${
                selectedCategory === cat.id
                  ? `bg-${cat.color}-500 text-white shadow-lg shadow-${cat.color}-500/30`
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md'
              }`}
            >
              {cat.icon}
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}

          {/* Export/Import Buttons */}
          <div className="ml-auto flex gap-2">
            <button
              onClick={exportData}
              className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition text-gray-700 dark:text-gray-300"
              title="Export Data"
            >
              <Download size={18} />
            </button>
            <label className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition text-gray-700 dark:text-gray-300 cursor-pointer">
              <Upload size={18} />
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
          </div>
        </div>

        {/* ========== DYNAMIC CONTENT SECTION ========== */}
        <div className="transition-all duration-300">
          {/* Grammar Section */}
          {selectedCategory === "grammar" && (
            <div className="space-y-6">
              {/* Progress Overview with Glass Card */}
              <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <Languages className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">English Grammar</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Master English grammar step by step</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {grammarStats.completed}/{grammarStats.total}
                    </span>
                    <span className="text-2xl">{getMedal(grammarStats.completed)}</span>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                        Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                        {grammarStats.percent}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-3 text-xs flex rounded-full bg-blue-200 dark:bg-blue-900/30">
                    <div
                      style={{ width: `${grammarStats.percent}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Timer & Resources Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <TimerCard
                    category="grammar"
                    timer={timer}
                    startTimer={startTimer}
                    stopTimer={stopTimer}
                    resetTimer={resetTimer}
                    formatTime={formatTime}
                    color="blue"
                    icon={<BookOpen size={20} />}
                  />
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                      <Monitor size={18} className="text-blue-600" />
                      Recommended Resources
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {grammarWebsites.map((site, idx) => (
                        <ResourceCard key={idx} site={site} color="blue" />
                      ))}
                      <ResourceCard
                        site={{
                          name: "YouTube Grammar Playlist",
                          description: "Free video lessons on all grammar topics",
                          url: "https://youtube.com",
                          icon: "🎥",
                          type: "web"
                        }}
                        color="blue"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grammar Topics with View Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Grammar Topics</h3>
                <div className="flex items-center gap-3">
                  {/* Filter by progress */}
                  <select className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Topics</option>
                    <option value="incomplete">Incomplete</option>
                    <option value="completed">Completed</option>
                  </select>

                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                    <button
                      onClick={() => setGrammarView("grid")}
                      className={`p-2 rounded-lg transition ${
                        grammarView === "grid"
                          ? 'bg-white dark:bg-gray-600 shadow-md text-blue-600'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setGrammarView("list")}
                      className={`p-2 rounded-lg transition ${
                        grammarView === "list"
                          ? 'bg-white dark:bg-gray-600 shadow-md text-blue-600'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grammar Topics Grid/List */}
              <div className={grammarView === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                : "space-y-4"
              }>
                {Object.entries(grammarSubtopics).map(([mainTopic, subtopics]) => {
                  const completedCount = subtopics.filter(sub => grammarProgress[`${mainTopic}||${sub}`]).length;
                  const totalCount = subtopics.length;
                  const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
                  const isExpanded = expandedGrammarMain[mainTopic] || false;

                  return (
                    <TopicCard
                      key={mainTopic}
                      mainTopic={mainTopic}
                      subtopics={subtopics}
                      completedCount={completedCount}
                      totalCount={totalCount}
                      percent={percent}
                      isExpanded={isExpanded}
                      onToggle={() => setExpandedGrammarMain(prev => ({ ...prev, [mainTopic]: !prev[mainTopic] }))}
                      onSubtopicToggle={toggleGrammar}
                      progress={grammarProgress}
                      notes={notes}
                      onEditNote={(key) => {
                        setEditingNoteKey(key);
                        setNoteText(notes[key] || "");
                      }}
                      color="blue"
                      view={grammarView}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Quran Section */}
          {selectedCategory === "quran" && (
            <div className="space-y-6">
              {/* Quran Progress Card */}
              <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                      <BookMarked className="text-amber-600 dark:text-amber-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quran Reading</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Track your Quran reading progress</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium">
                      {quranStats.completed}/{quranStats.total} verses
                    </span>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Progress</span>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{quranStats.percent}%</span>
                  </div>
                  <div className="overflow-hidden h-3 text-xs flex rounded-full bg-amber-200 dark:bg-amber-900/30">
                    <div
                      style={{ width: `${quranStats.percent}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Timer & Search */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <TimerCard
                    category="quran"
                    timer={timer}
                    startTimer={startTimer}
                    stopTimer={stopTimer}
                    resetTimer={resetTimer}
                    formatTime={formatTime}
                    color="amber"
                    icon={<Headphones size={20} />}
                  />
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          placeholder="Search surah (বাংলা/আরবি)..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="all">All Surahs</option>
                        <option value="meccan">Meccan</option>
                        <option value="medinan">Medinan</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quran Grid/List */}
              <div className="flex justify-end">
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                  <button
                    onClick={() => setQuranView("grid")}
                    className={`p-2 rounded-lg transition ${
                      quranView === "grid"
                        ? 'bg-white dark:bg-gray-600 shadow-md text-amber-600'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setQuranView("list")}
                    className={`p-2 rounded-lg transition ${
                      quranView === "list"
                        ? 'bg-white dark:bg-gray-600 shadow-md text-amber-600'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>

              <div className={quranView === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "space-y-4"
              }>
                {filteredSurahs.map((surah) => {
                  const progress = quranProgress[surah.id - 1] || { completedVerses: 0, totalVerses: surah.verses };
                  const completed = progress.completedVerses;
                  const total = surah.verses;
                  const percent = total ? Math.round((completed / total) * 100) : 0;
                  const isExpanded = expandedSurahId === surah.id;

                  return (
                    <SurahCard
                      key={surah.id}
                      surah={surah}
                      completed={completed}
                      total={total}
                      percent={percent}
                      isExpanded={isExpanded}
                      onToggle={() => setExpandedSurahId(isExpanded ? null : surah.id)}
                      verseInput={verseInputs[surah.id] !== undefined ? verseInputs[surah.id] : completed}
                      onVerseInputChange={(value) => setVerseInputs({ ...verseInputs, [surah.id]: value })}
                      onUpdate={() => {
                        updateQuranProgress(surah.id, verseInputs[surah.id] !== undefined ? verseInputs[surah.id] : completed);
                        setVerseInputs({ ...verseInputs, [surah.id]: undefined });
                      }}
                      view={quranView}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* GK Section */}
          {selectedCategory === "gk" && (
            <div className="space-y-6">
              <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <Globe className="text-emerald-600 dark:text-emerald-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">General Knowledge & Job Preparation</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Verified resources for BCS, Bank, and other govt jobs</p>
                  </div>
                </div>
              </div>

              <TimerCard category="gk" timer={timer} startTimer={startTimer} stopTimer={stopTimer} resetTimer={resetTimer} formatTime={formatTime} color="emerald" icon={<Compass size={20} />} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Government Websites */}
                <ResourceGroup
                  title="Government Websites"
                  icon="🏛️"
                  sites={gkWebsites.filter(site => site.isOfficial)}
                  color="emerald"
                />

                {/* Encyclopedia & Statistics */}
                <ResourceGroup
                  title="Encyclopedia & Statistics"
                  icon="📊"
                  sites={[
                    {
                      name: "বাংলাপিডিয়া",
                      description: "বাংলাদেশের জাতীয় বিশ্বকোষ",
                      url: "https://bn.banglapedia.org",
                      icon: "📔",
                      type: "web",
                      isOfficial: false,
                    },
                    {
                      name: "BBS",
                      description: "বাংলাদেশ পরিসংখ্যান ব্যুরো",
                      url: "http://nsds.bbs.gov.bd",
                      icon: "📊",
                      type: "web",
                      isOfficial: true,
                    }
                  ]}
                  color="emerald"
                />

                {/* Current Affairs */}
                <ResourceGroup
                  title="Current Affairs"
                  icon="📰"
                  sites={gkWebsites.filter(site => !site.isOfficial && (site.name.includes("ডেইলি স্টার") || site.name.includes("প্রতিদিন")))}
                  color="emerald"
                />

                {/* Mobile Apps */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 border border-amber-200 dark:border-amber-800">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Smartphone size={18} className="text-amber-600" /> Mobile Apps
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Popular job prep platforms</p>
                  <div className="space-y-3">
                    {mobileApps.map((app, idx) => (
                      <MobileAppCard key={idx} app={app} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Networking Section */}
          {selectedCategory === "networking" && (
            <div className="space-y-6">
              <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                      <Server className="text-purple-600 dark:text-purple-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Networking</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Computer networking fundamentals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                      {networkingStats.completed}/{networkingStats.total}
                    </span>
                    <span className="text-2xl">{getMedal(networkingStats.completed)}</span>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Progress</span>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">{networkingStats.percent}%</span>
                  </div>
                  <div className="overflow-hidden h-3 text-xs flex rounded-full bg-purple-200 dark:bg-purple-900/30">
                    <div
                      style={{ width: `${networkingStats.percent}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <TimerCard
                    category="networking"
                    timer={timer}
                    startTimer={startTimer}
                    stopTimer={stopTimer}
                    resetTimer={resetTimer}
                    formatTime={formatTime}
                    color="purple"
                    icon={<Wifi size={20} />}
                  />
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                      <Monitor size={18} className="text-purple-600" /> Learning Resources
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {networkingWebsites.slice(0, 4).map((site, idx) => (
                        <ResourceCard key={idx} site={site} color="purple" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Networking Topics</h3>
                <div className="flex items-center gap-3">
                  <select className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-purple-500">
                    <option value="all">All Topics</option>
                    <option value="incomplete">Incomplete</option>
                    <option value="completed">Completed</option>
                  </select>

                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                    <button
                      onClick={() => setNetworkingView("grid")}
                      className={`p-2 rounded-lg transition ${
                        networkingView === "grid"
                          ? 'bg-white dark:bg-gray-600 shadow-md text-purple-600'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setNetworkingView("list")}
                      className={`p-2 rounded-lg transition ${
                        networkingView === "list"
                          ? 'bg-white dark:bg-gray-600 shadow-md text-purple-600'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className={networkingView === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                : "space-y-4"
              }>
                {Object.entries(networkingTopics).map(([mainTopic, subtopics]) => {
                  const completedCount = subtopics.filter(sub => networkingProgress[`${mainTopic}||${sub}`]).length;
                  const totalCount = subtopics.length;
                  const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
                  const isExpanded = expandedNetworkingMain[mainTopic] || false;

                  return (
                    <TopicCard
                      key={mainTopic}
                      mainTopic={mainTopic}
                      subtopics={subtopics}
                      completedCount={completedCount}
                      totalCount={totalCount}
                      percent={percent}
                      isExpanded={isExpanded}
                      onToggle={() => setExpandedNetworkingMain(prev => ({ ...prev, [mainTopic]: !prev[mainTopic] }))}
                      onSubtopicToggle={toggleNetworking}
                      progress={networkingProgress}
                      notes={notes}
                      onEditNote={(key) => {
                        setEditingNoteKey(key);
                        setNoteText(notes[key] || "");
                      }}
                      color="purple"
                      view={networkingView}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ----- Achievements & Heatmap ----- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Heatmap */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar size={20} className="text-indigo-500" />
                Last 30 Days Activity
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-500 rounded"></span> Active
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></span> Inactive
                </span>
              </div>
            </div>

            <div className="grid grid-cols-10 gap-2 sm:gap-3">
              {heatmap.map((day, i) => {
                const intensity = day.minutes ? Math.min(day.minutes / 60, 1) : 0;
                const bgColor = intensity === 0
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : intensity < 0.3 ? 'bg-green-300 dark:bg-green-700' :
                    intensity < 0.6 ? 'bg-green-500 dark:bg-green-600' :
                    'bg-green-700 dark:bg-green-500';

                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-md ${bgColor} transition-all hover:scale-110 hover:shadow-lg cursor-pointer group relative`}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                      Day {i + 1}: {day.minutes || 0} minutes
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              Total activity: {heatmap.reduce((acc, day) => acc + (day.minutes || 0), 0)} minutes
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3 mb-6">
              <Award className="text-yellow-600 dark:text-yellow-400" size={24} />
              <span className="font-semibold text-gray-900 dark:text-white text-lg">Achievements</span>
            </div>

            <div className="space-y-5">
              <ProgressBar
                label="Grammar"
                completed={grammarStats.completed}
                total={grammarStats.total}
                percent={grammarStats.percent}
                color="blue"
                medal={getMedal(grammarStats.completed)}
              />

              <ProgressBar
                label="Quran"
                completed={quranStats.completed}
                total={quranStats.total}
                percent={quranStats.percent}
                color="amber"
                unit="verses"
              />

              <ProgressBar
                label="Networking"
                completed={networkingStats.completed}
                total={networkingStats.total}
                percent={networkingStats.percent}
                color="purple"
                medal={getMedal(networkingStats.completed)}
              />

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-3 border-t border-yellow-200 dark:border-yellow-800">
                <span className="flex items-center gap-1">🥉 10 topics</span>
                <span className="flex items-center gap-1">🥈 25 topics</span>
                <span className="flex items-center gap-1">🥇 50 topics</span>
              </div>
            </div>
          </div>
        </div>

        {/* ----- Notes Modal ----- */}
        {editingNoteKey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
              <div className="flex items-center gap-2 mb-4">
                <PenTool size={20} className="text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add Note</h3>
              </div>

              <textarea
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                rows="5"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write your notes, ideas, or reminders..."
                autoFocus
              />

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setEditingNoteKey(null)}
                  className="px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveNote(editingNoteKey)}
                  className="px-5 py-2.5 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Helper Components
// ============================================================

const TimerCard = ({ category, timer, startTimer, stopTimer, resetTimer, formatTime, color, icon }) => {
  const isTimerForThis = timer.category === category;

  const colorClasses = {
    blue: {
      bg: "from-blue-500 to-indigo-600",
      button: "bg-white/20 hover:bg-white/30"
    },
    amber: {
      bg: "from-amber-500 to-orange-600",
      button: "bg-white/20 hover:bg-white/30"
    },
    emerald: {
      bg: "from-emerald-500 to-teal-600",
      button: "bg-white/20 hover:bg-white/30"
    },
    purple: {
      bg: "from-purple-500 to-pink-600",
      button: "bg-white/20 hover:bg-white/30"
    }
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color].bg} rounded-2xl shadow-xl p-5 text-white transform transition-all hover:scale-105`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium opacity-90">Study Timer</span>
        </div>
        <div className="text-2xl font-mono font-bold tracking-wider">
          {formatTime(timer.seconds)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs opacity-75">
          {timer.category === category && timer.running ? 'Studying...' : 'Ready to start'}
        </div>
        <div className="flex items-center gap-2">
          {!isTimerForThis ? (
            <button
              onClick={() => startTimer(category)}
              className={`flex items-center gap-1 px-4 py-2 ${colorClasses[color].button} rounded-xl text-sm transition backdrop-blur-sm`}
            >
              <Play size={14} /> Start
            </button>
          ) : timer.running ? (
            <button
              onClick={stopTimer}
              className="flex items-center gap-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-sm transition"
            >
              <Pause size={14} /> Pause
            </button>
          ) : (
            <button
              onClick={() => startTimer(category)}
              className={`flex items-center gap-1 px-4 py-2 ${colorClasses[color].button} rounded-xl text-sm transition backdrop-blur-sm`}
            >
              <Play size={14} /> Resume
            </button>
          )}
          <button
            onClick={resetTimer}
            className={`p-2 ${colorClasses[color].button} rounded-xl transition backdrop-blur-sm`}
            title="Reset timer"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ResourceCard = ({ site, color }) => {
  const colorHover = {
    blue: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
    amber: "hover:bg-amber-50 dark:hover:bg-amber-900/20",
    emerald: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    purple: "hover:bg-purple-50 dark:hover:bg-purple-900/20"
  };

  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl ${colorHover[color]} transition-all hover:shadow-md group`}
    >
      <span className="text-3xl transform group-hover:scale-110 transition">{site.icon}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white">{site.name}</span>
          <ExternalLink size={12} className="text-gray-500 opacity-0 group-hover:opacity-100 transition" />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{site.description}</p>
      </div>
    </a>
  );
};

const TopicCard = ({
  mainTopic,
  subtopics,
  completedCount,
  totalCount,
  percent,
  isExpanded,
  onToggle,
  onSubtopicToggle,
  progress,
  notes,
  onEditNote,
  color,
  view
}) => {
  const colorClasses = {
    blue: {
      progress: "bg-blue-600",
    },
    amber: {
      progress: "bg-amber-600",
    },
    purple: {
      progress: "bg-purple-600",
    }
  };

  if (view === "list") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" onClick={onToggle}>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">{mainTopic}</h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${colorClasses[color].progress} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{completedCount}/{totalCount}</span>
            </div>
          </div>
          <div className="ml-2">{isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}</div>
        </div>
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="space-y-2">
              {subtopics.map((sub) => {
                const key = `${mainTopic}||${sub}`;
                const completed = progress[key] || false;
                return (
                  <div key={sub} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                    <button onClick={() => onSubtopicToggle(mainTopic, sub)} className="mt-0.5 flex-shrink-0">
                      {completed ? <CheckCircle size={18} className="text-green-600" /> : <Circle size={18} className="text-gray-400" />}
                    </button>
                    <div className="flex-1">
                      <span className={`text-sm ${completed ? "text-gray-500 line-through" : "text-gray-800 dark:text-gray-200"}`}>{sub}</span>
                    </div>
                    {notes[key] && (
                      <span className="text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full">Note</span>
                    )}
                    <button onClick={() => onEditNote(key)} className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                      <Edit3 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-fit hover:shadow-xl transition-all">
      <div className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" onClick={onToggle}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900 dark:text-white">{mainTopic}</h4>
          <div className="ml-2">{isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full ${colorClasses[color].progress} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">{completedCount}/{totalCount}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {subtopics.map((sub) => {
              const key = `${mainTopic}||${sub}`;
              const completed = progress[key] || false;
              return (
                <div key={sub} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                  <button onClick={() => onSubtopicToggle(mainTopic, sub)} className="mt-0.5 flex-shrink-0">
                    {completed ? <CheckCircle size={18} className="text-green-600" /> : <Circle size={18} className="text-gray-400" />}
                  </button>
                  <div className="flex-1">
                    <span className={`text-sm ${completed ? "text-gray-500 line-through" : "text-gray-800 dark:text-gray-200"}`}>{sub}</span>
                  </div>
                  {notes[key] && (
                    <span className="text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full">📝</span>
                  )}
                  <button onClick={() => onEditNote(key)} className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                    <Edit3 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const SurahCard = ({ surah, completed, total, percent, isExpanded, onToggle, verseInput, onVerseInputChange, onUpdate, view }) => {
  if (view === "list") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={onToggle} className="p-1">
                {isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
              </button>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">{surah.name_bn}</span>
                <span className="text-xs text-gray-500 ml-2">({surah.name_ar})</span>
              </div>
            </div>
            <div className="text-sm">
              <span className="font-bold text-amber-600">{completed}</span>/{total}
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
          </div>
        </div>
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 dark:text-gray-400">Verses completed:</span>
                <input
                  type="number"
                  min="0"
                  max={total}
                  value={verseInput}
                  onChange={(e) => onVerseInputChange(parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                />
                <button
                  onClick={onUpdate}
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm rounded-lg hover:from-amber-700 hover:to-orange-700 transition shadow-md"
                >
                  Update
                </button>
              </div>
              <div className="flex gap-4 text-xs">
                <a href={`https://quran.com/bn/${surah.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                  📖 Read <ExternalLink size={10} />
                </a>
                <a href={`https://www.hadithbd.net/quran/${surah.id}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline flex items-center gap-1">
                  📚 Tafsir <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-fit hover:shadow-xl transition-all">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onToggle} className="p-1">
              {isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
            </button>
            <div>
              <span className="font-medium text-gray-900 dark:text-white">{surah.name_bn}</span>
              <span className="text-xs text-gray-500 ml-2">({surah.name_ar})</span>
            </div>
          </div>
          <div className="text-sm">
            <span className="font-bold text-amber-600">{completed}</span>/{total}
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600 dark:text-gray-400">Verses completed:</span>
              <input
                type="number"
                min="0"
                max={total}
                value={verseInput}
                onChange={(e) => onVerseInputChange(parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
              <button
                onClick={onUpdate}
                className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm rounded-lg hover:from-amber-700 hover:to-orange-700 transition shadow-md"
              >
                Update
              </button>
            </div>
            <div className="flex gap-4 text-xs">
              <a href={`https://quran.com/bn/${surah.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                📖 Read <ExternalLink size={10} />
              </a>
              <a href={`https://www.hadithbd.net/quran/${surah.id}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline flex items-center gap-1">
                📚 Tafsir <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResourceGroup = ({ title, icon, sites, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span> {title}
      </h4>
      <div className="space-y-3">
        {sites.map((site, idx) => (
          <a
            key={idx}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all hover:shadow-md group"
          >
            <span className="text-2xl">{site.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white">{site.name}</span>
                {site.isOfficial && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Official</span>
                )}
                <ExternalLink size={12} className="text-gray-500 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{site.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

const MobileAppCard = ({ app }) => {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{app.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">{app.name}</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">App</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{app.description}</p>
          <div className="flex gap-3 mt-2">
            {app.playStore && (
              <a href={app.playStore} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline flex items-center gap-1">
                Play Store <ExternalLink size={10} />
              </a>
            )}
            {app.url && (
              <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                Website <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, completed, total, percent, color, unit = "topics", medal }) => {
  const colorClasses = {
    blue: "bg-blue-600",
    amber: "bg-amber-600",
    purple: "bg-purple-600"
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {completed}/{total} {unit} {medal}
        </span>
      </div>
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default LearningRoadmap;