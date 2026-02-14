import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
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
  TrendingUp,
  Clock,
  ExternalLink,
  Smartphone,
  Monitor,
  Grid,
  List,
  RefreshCw,
} from "lucide-react";

// ============================================================
// 1. কুরআনের ১১৪টি সূরার তালিকা (পুরো আগের মতোই)
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
// 2. ইংরেজি গ্রামার – সম্পূর্ণ বাংলা ব্যাখ্যাসহ ওয়েবসাইট
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
// 3. কুরআন – বাংলা অর্থ ও তাফসির
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
// 4. সাধারণ জ্ঞান ও চাকরি প্রস্তুতি
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
// 7. ইংরেজি গ্রামার – সাবটপিকসহ (প্রগ্রেস ট্র্যাকিং)
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
// 8. MAIN COMPONENT – LearningRoadmap (উন্নত সংস্করণ)
// ============================================================
const LearningRoadmap = () => {
  // ---------- State Declarations ----------
  // Grammar progress (subtopic level)
  const [grammarProgress, setGrammarProgress] = useState(() => {
    const saved = localStorage.getItem("grammar_progress_v4");
    return saved ? JSON.parse(saved) : {};
  });

  // Quran progress (per surah: completed verses)
  const [quranProgress, setQuranProgress] = useState(() => {
    const saved = localStorage.getItem("quran_progress_v4");
    if (saved) return JSON.parse(saved);
    return allSurahs.map((s) => ({ completedVerses: 0, totalVerses: s.verses }));
  });

  // Notes
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("learning_notes_v4");
    return saved ? JSON.parse(saved) : {};
  });

  // Timer
  const [timer, setTimer] = useState({ running: false, seconds: 0, category: null });
  const timerInterval = useRef(null);

  // Streak & Heatmap
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("streak_v4");
    return saved ? JSON.parse(saved) : { count: 0, lastActive: null };
  });
  const [heatmap, setHeatmap] = useState(() => {
    const saved = localStorage.getItem("heatmap_v4");
    return saved ? JSON.parse(saved) : Array(30).fill(0);
  });

  // Daily Goal
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem("daily_goal_v3");
    return saved ? parseInt(saved) : 30;
  });
  const [todayMinutes, setTodayMinutes] = useState(() => {
    const saved = localStorage.getItem("today_minutes_v3");
    return saved ? parseInt(saved) : 0;
  });

  // UI States
  const [selectedCategory, setSelectedCategory] = useState("grammar");
  const [expandedGrammarMain, setExpandedGrammarMain] = useState({});
  const [expandedSurahId, setExpandedSurahId] = useState(null);
  const [verseInputs, setVerseInputs] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteKey, setEditingNoteKey] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [grammarView, setGrammarView] = useState("grid"); // "grid" or "list"
  const [quranView, setQuranView] = useState("grid");
  const [gkView, setGkView] = useState("grid");
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Daily Wisdom
  const [dailyWisdom, setDailyWisdom] = useState(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem("daily_wisdom_v4");
    if (saved) {
      const { date, quote } = JSON.parse(saved);
      if (date === today) return quote;
    }
    const random = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
    localStorage.setItem("daily_wisdom_v4", JSON.stringify({ date: today, quote: random }));
    return random;
  });

  // ---------- LocalStorage Persistence ----------
  useEffect(() => {
    localStorage.setItem("grammar_progress_v4", JSON.stringify(grammarProgress));
  }, [grammarProgress]);
  useEffect(() => {
    localStorage.setItem("quran_progress_v4", JSON.stringify(quranProgress));
  }, [quranProgress]);
  useEffect(() => {
    localStorage.setItem("learning_notes_v4", JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem("streak_v4", JSON.stringify(streak));
  }, [streak]);
  useEffect(() => {
    localStorage.setItem("heatmap_v4", JSON.stringify(heatmap));
  }, [heatmap]);
  useEffect(() => {
    localStorage.setItem("daily_goal_v3", dailyGoal.toString());
  }, [dailyGoal]);
  useEffect(() => {
    localStorage.setItem("today_minutes_v3", todayMinutes.toString());
  }, [todayMinutes]);

  // ---------- Streak Update ----------
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    if (streak.lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = streak.lastActive === yesterday ? streak.count + 1 : 1;
      setStreak({ count: newStreak, lastActive: today });
      setHeatmap((prev) => [...prev.slice(1), 1]);
      if (newStreak === 7) toast.success("🔥 7-day streak! Keep going!");
      if (newStreak === 30) toast.success("🏆 30-day streak! Unstoppable!");
    }
  }, [streak]);

  // ---------- Toggle Grammar Subtopic ----------
  const toggleGrammar = useCallback((mainTopic, subtopic) => {
    const key = `${mainTopic}||${subtopic}`;
    setGrammarProgress((prev) => {
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
    setTimer({ running: true, seconds: 0, category });
    timerInterval.current = setInterval(() => {
      setTimer((prev) => ({ ...prev, seconds: prev.seconds + 1 }));
    }, 1000);
  };
  const stopTimer = () => {
    setTimer((prev) => ({ ...prev, running: false }));
    clearInterval(timerInterval.current);
    if (timer.category) {
      const minutes = Math.floor(timer.seconds / 60);
      if (minutes > 0) {
        setTodayMinutes((prev) => prev + minutes);
        toast.success(`✅ Added ${minutes} study minutes!`);
      }
    }
  };
  const resetTimer = () => {
    setTimer({ running: false, seconds: 0, category: null });
    clearInterval(timerInterval.current);
  };
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearInterval(timerInterval.current);
  }, []);

  // ---------- Notes ----------
  const saveNote = (key) => {
    setNotes((prev) => ({ ...prev, [key]: noteText }));
    setEditingNoteKey(null);
    setNoteText("");
    toast.success("Note saved!");
  };

  // ---------- Filtered Surahs ----------
  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return allSurahs;
    return allSurahs.filter(s => 
      s.name_bn.includes(searchQuery) || 
      s.name_ar.includes(searchQuery) || 
      s.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
    return { 
      total: totalVerses, 
      completed: completedVerses, 
      percent: totalVerses ? Math.round((completedVerses / totalVerses) * 100) : 0 
    };
  }, [quranProgress]);

  // ---------- Get medal based on completed count ----------
  const getMedal = (count) => {
    if (count >= 50) return "🥇";
    if (count >= 25) return "🥈";
    if (count >= 10) return "🥉";
    return "";
  };

  // ---------- Rotate quote ----------
  const rotateQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % dailyQuotes.length);
  };

  // ==========================================================
  // RENDER (উন্নত গ্রিড/লিস্ট টগল ও কার্ড ডিজাইন)
  // ==========================================================
  return (
    <div className="space-y-6">
      {/* ----- Header: Streak, Wisdom, Daily Goal ----- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
            <Library className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Hub</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track & master your knowledge</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <Flame className="text-orange-500" size={20} />
            <span className="font-bold text-orange-600 dark:text-orange-400">{streak.count}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">day streak</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg max-w-md cursor-pointer" onClick={rotateQuote}>
            <RefreshCw size={14} className="text-gray-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400">✨ Today's wisdom</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">"{dailyWisdom.text}"</p>
            <p className="text-xs text-gray-400">— {dailyWisdom.source}</p>
          </div>
        </div>
      </div>

      {/* ----- Daily Goal & Timer ----- */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Target size={20} className="text-indigo-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Goal:</span>
          <select 
            value={dailyGoal} 
            onChange={(e) => setDailyGoal(parseInt(e.target.value))}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>60 min</option>
            <option value={90}>90 min</option>
            <option value={120}>120 min</option>
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Clock size={20} className="text-green-600" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Today: {todayMinutes} / {dailyGoal} min</span>
          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (todayMinutes / dailyGoal) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ----- Category Tabs ----- */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory("grammar")}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            selectedCategory === "grammar"
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          📘 English Grammar
        </button>
        <button
          onClick={() => setSelectedCategory("quran")}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            selectedCategory === "quran"
              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          🕋 Quran Reading
        </button>
        <button
          onClick={() => setSelectedCategory("gk")}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            selectedCategory === "gk"
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          🌍 General Knowledge & Jobs
        </button>
      </div>

      {/* ========== GRAMMAR SECTION ========== */}
      {selectedCategory === "grammar" && (
        <div className="space-y-5">
          {/* Progress Overview with Medal */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Languages className="text-blue-600" size={22} /> English Grammar
              </h3>
              <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                {grammarStats.completed}/{grammarStats.total} subtopics {getMedal(grammarStats.completed)}
              </span>
            </div>
            <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${grammarStats.percent}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">{grammarStats.percent}% complete</p>
          </div>

          {/* Timer */}
          <TimerCard 
            category="grammar" 
            timer={timer} 
            startTimer={startTimer} 
            stopTimer={stopTimer} 
            resetTimer={resetTimer} 
            formatTime={formatTime} 
            color="blue"
          />

          {/* Web Resources */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Monitor size={16} className="text-blue-600" /> Web Resources (PC)
            </h4>
            <div className="space-y-2">
              {grammarWebsites.map((site, idx) => (
                <a
                  key={idx}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover:shadow-md"
                >
                  <span className="text-2xl">{site.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{site.name}</span>
                      <ExternalLink size={14} className="text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{site.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Grammar Topics Header with View Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Grammar Topics</h3>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setGrammarView("grid")}
                className={`p-1.5 rounded ${grammarView === "grid" ? "bg-white dark:bg-gray-600 shadow" : "text-gray-600 dark:text-gray-400"}`}
                title="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setGrammarView("list")}
                className={`p-1.5 rounded ${grammarView === "list" ? "bg-white dark:bg-gray-600 shadow" : "text-gray-600 dark:text-gray-400"}`}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Grammar Topics with Subtopics - Dynamic Grid/List */}
          <div className={grammarView === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
            {Object.entries(grammarSubtopics).map(([mainTopic, subtopics]) => {
              const completedCount = subtopics.filter(sub => grammarProgress[`${mainTopic}||${sub}`]).length;
              const totalCount = subtopics.length;
              const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
              const isExpanded = expandedGrammarMain[mainTopic] || false;

              return (
                <div key={mainTopic} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-fit hover:shadow-xl transition-all">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    onClick={() => setExpandedGrammarMain(prev => ({ ...prev, [mainTopic]: !prev[mainTopic] }))}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{mainTopic}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{completedCount}/{totalCount}</span>
                      </div>
                    </div>
                    <div className="ml-2">
                      {isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {subtopics.map((sub) => {
                          const key = `${mainTopic}||${sub}`;
                          const completed = grammarProgress[key] || false;
                          return (
                            <div key={sub} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                              <button onClick={() => toggleGrammar(mainTopic, sub)} className="mt-0.5 flex-shrink-0">
                                {completed ? (
                                  <CheckCircle size={18} className="text-green-600" />
                                ) : (
                                  <Circle size={18} className="text-gray-400" />
                                )}
                              </button>
                              <div className="flex-1">
                                <span className={`text-sm ${completed ? "text-gray-500 line-through" : "text-gray-800 dark:text-gray-200"}`}>
                                  {sub}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setEditingNoteKey(key);
                                  setNoteText(notes[key] || "");
                                }}
                                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                              >
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
            })}
          </div>
        </div>
      )}

      {/* ========== QURAN SECTION ========== */}
      {selectedCategory === "quran" && (
        <div className="space-y-5">
          {/* Progress Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BookMarked className="text-amber-600" size={22} /> Quran Reading
              </h3>
              <span className="text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full">
                {quranStats.completed}/{quranStats.total} verses
              </span>
            </div>
            <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-600 rounded-full transition-all duration-500" style={{ width: `${quranStats.percent}%` }} />
            </div>
          </div>

          {/* Timer */}
          <TimerCard 
            category="quran" 
            timer={timer} 
            startTimer={startTimer} 
            stopTimer={stopTimer} 
            resetTimer={resetTimer} 
            formatTime={formatTime} 
            color="amber"
          />

          {/* Web Resources */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Monitor size={16} className="text-amber-600" /> Web Resources (PC)
            </h4>
            <div className="space-y-2">
              {quranWebsites.map((site, idx) => (
                <a
                  key={idx}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all hover:shadow-md"
                >
                  <span className="text-2xl">{site.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{site.name}</span>
                      <ExternalLink size={14} className="text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{site.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Surah Search and View Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search surah (বাংলা/আরবি)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setQuranView("grid")}
                className={`p-1.5 rounded ${quranView === "grid" ? "bg-white dark:bg-gray-600 shadow" : "text-gray-600 dark:text-gray-400"}`}
                title="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setQuranView("list")}
                className={`p-1.5 rounded ${quranView === "list" ? "bg-white dark:bg-gray-600 shadow" : "text-gray-600 dark:text-gray-400"}`}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Surah List - Dynamic Grid/List */}
          <div className={quranView === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
            {filteredSurahs.map((surah) => {
              const progress = quranProgress[surah.id - 1] || { completedVerses: 0, totalVerses: surah.verses };
              const completed = progress.completedVerses;
              const total = surah.verses;
              const percent = total ? Math.round((completed / total) * 100) : 0;
              const isExpanded = expandedSurahId === surah.id;

              return (
                <div key={surah.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-fit hover:shadow-xl transition-all">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setExpandedSurahId(isExpanded ? null : surah.id)}>
                          {isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                        </button>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{surah.name_bn}</span>
                          <span className="text-xs text-gray-500 ml-2">({surah.name_ar})</span>
                          <span className="text-xs text-gray-500 ml-2">{surah.meaning}</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-amber-600">{completed}</span>/{total}
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Verses completed:</span>
                          <input
                            type="number"
                            min="0"
                            max={total}
                            value={verseInputs[surah.id] !== undefined ? verseInputs[surah.id] : completed}
                            onChange={(e) => setVerseInputs({ ...verseInputs, [surah.id]: parseInt(e.target.value) || 0 })}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                          />
                          <button
                            onClick={() => {
                              updateQuranProgress(surah.id, verseInputs[surah.id] !== undefined ? verseInputs[surah.id] : completed);
                              setVerseInputs({ ...verseInputs, [surah.id]: undefined });
                            }}
                            className="px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 transition"
                          >
                            Update
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://quran.com/bn/${surah.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            📖 Read on Quran.com <ExternalLink size={12} />
                          </a>
                          <span className="text-xs text-gray-400">|</span>
                          <a
                            href={`https://www.hadithbd.net/quran/${surah.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-amber-600 hover:underline flex items-center gap-1"
                          >
                            📚 Tafsir (Hadithbd) <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========== GK & JOB PREPARATION SECTION ========== */}
      {selectedCategory === "gk" && (
        <div className="space-y-5">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
              <Globe className="text-emerald-600" size={22} /> General Knowledge & Job Preparation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ✅ Verified web resources – works on PC browser
            </p>
          </div>

          {/* Timer */}
          <TimerCard 
            category="gk" 
            timer={timer} 
            startTimer={startTimer} 
            stopTimer={stopTimer} 
            resetTimer={resetTimer} 
            formatTime={formatTime} 
            color="emerald"
          />

          {/* View Toggle for GK */}
          <div className="flex justify-end">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setGkView("grid")}
                className={`p-1.5 rounded ${gkView === "grid" ? "bg-white dark:bg-gray-600 shadow" : "text-gray-600 dark:text-gray-400"}`}
                title="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setGkView("list")}
                className={`p-1.5 rounded ${gkView === "list" ? "bg-white dark:bg-gray-600 shadow" : "text-gray-600 dark:text-gray-400"}`}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* All resource groups in dynamic layout */}
          <div className={gkView === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
            {/* Official Government Websites */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Official Government Websites
              </h4>
              <div className="space-y-2">
                {gkWebsites.filter(site => site.isOfficial).map((site, idx) => (
                  <a
                    key={idx}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all hover:shadow-md"
                  >
                    <span className="text-2xl">{site.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">{site.name}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Official</span>
                        <ExternalLink size={14} className="text-gray-500" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{site.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Encyclopedia & Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Encyclopedia & Statistics
              </h4>
              <div className="space-y-2">
                {/* Banglapedia */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📔</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 dark:text-white">বাংলাপিডিয়া (Banglapedia)</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">National Encyclopedia</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">৫,৭০০+ এন্ট্রি, বাংলাদেশের ইতিহাস, ভূগোল, সংস্কৃতি, মুক্তিযুদ্ধ</p>
                      <div className="flex gap-3 mt-2">
                        <a href="https://en.banglapedia.org" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          English Version <ExternalLink size={12} />
                        </a>
                        <a href="https://bn.banglapedia.org" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          বাংলা সংস্করণ <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* BBS */}
                <a
                  href="http://nsds.bbs.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover:shadow-md"
                >
                  <span className="text-2xl">📊</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">বাংলাদেশ পরিসংখ্যান ব্যুরো (BBS)</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Official</span>
                      <ExternalLink size={14} className="text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">সরকারি পরিসংখ্যান, জনশুমারি, অর্থনৈতিক সূচক – বিসিএস জিকের জন্য অপরিহার্য</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Current Affairs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Current Affairs
              </h4>
              <div className="space-y-2">
                {gkWebsites.filter(site => !site.isOfficial && (site.name.includes("ডেইলি স্টার") || site.name.includes("প্রতিদিন"))).map((site, idx) => (
                  <a
                    key={idx}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all hover:shadow-md"
                  >
                    <span className="text-2xl">{site.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">{site.name}</span>
                        <ExternalLink size={14} className="text-gray-500" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{site.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Apps */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <Smartphone size={16} className="text-amber-600" />
                Mobile Apps
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                বাংলাদেশের অধিকাংশ জব প্রিপারেশন প্ল্যাটফর্ম মোবাইল অ্যাপ-কেন্দ্রিক। নিচের লিংকগুলো প্লে স্টোর খুলবে।
              </p>
              <div className="space-y-2">
                {mobileApps.map((app, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
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
                              Play Store <ExternalLink size={12} />
                            </a>
                          )}
                          {app.url && (
                            <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                              Website <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----- Achievements & Heatmap (উন্নত) ----- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-indigo-500" /> Last 30 Days Activity
          </h3>
          <div className="grid grid-cols-10 gap-1 sm:gap-2">
            {heatmap.map((value, i) => (
              <div
                key={i}
                className={`aspect-square rounded-sm transition-all ${
                  value === 0
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "bg-green-500 dark:bg-green-600 hover:scale-110"
                }`}
                title={`Day ${i + 1}: ${value} activities`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-yellow-600 dark:text-yellow-400" size={24} />
            <span className="font-medium text-gray-900 dark:text-white text-lg">Achievements</span>
          </div>
          
          <div className="space-y-4">
            {/* Grammar Progress with Medal */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">Grammar</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {grammarStats.completed}/{grammarStats.total} {getMedal(grammarStats.completed)}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${grammarStats.percent}%` }} />
              </div>
            </div>

            {/* Quran Progress */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">Quran</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {quranStats.completed}/{quranStats.total} verses
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: `${quranStats.percent}%` }} />
              </div>
            </div>

            {/* Medal Milestones */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="flex items-center gap-1">🥉 10</span>
              <span className="flex items-center gap-1">🥈 25</span>
              <span className="flex items-center gap-1">🥇 50</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Next milestone: {grammarStats.completed < 10 ? "🥉 10" : grammarStats.completed < 25 ? "🥈 25" : "🥇 50"} subtopics
            </p>
          </div>
        </div>
      </div>

      {/* Notes Editor Modal */}
      {editingNoteKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 max-w-md w-full">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Add Note</h3>
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows="4"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your note..."
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingNoteKey(null)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => saveNote(editingNoteKey)}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// TimerCard Component (উন্নত)
// ============================================================
const TimerCard = ({ category, timer, startTimer, stopTimer, resetTimer, formatTime, color = "blue" }) => {
  const isTimerForThis = timer.category === category;
  const colorClasses = {
    blue: "from-blue-500 to-indigo-600",
    amber: "from-amber-500 to-orange-600",
    emerald: "from-emerald-500 to-teal-600",
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl shadow-lg p-4 flex items-center justify-between text-white`}>
      <div className="flex items-center gap-3">
        <Timer size={20} className="text-white/80" />
        <span className="text-lg font-mono font-bold">
          {formatTime(timer.seconds)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {!isTimerForThis ? (
          <button
            onClick={() => startTimer(category)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition backdrop-blur-sm"
          >
            <Play size={14} /> Start
          </button>
        ) : timer.running ? (
          <button
            onClick={stopTimer}
            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-sm transition"
          >
            <Pause size={14} /> Pause
          </button>
        ) : (
          <button
            onClick={() => startTimer(category)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition backdrop-blur-sm"
          >
            <Play size={14} /> Resume
          </button>
        )}
        <button
          onClick={resetTimer}
          className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition backdrop-blur-sm"
          title="Reset timer"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};

export default LearningRoadmap;