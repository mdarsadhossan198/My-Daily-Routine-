import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ------------------------------------------------------------
// ১. ভাষা ডাটা (বাংলা + ইংরেজি)
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
  },
};

// ------------------------------------------------------------
// ২. রোডম্যাপ ডাটা – সম্পূর্ণ দ্বিভাষিক, ৪ লেভেল × ৪ মাইলফলক
// ------------------------------------------------------------
const roadmapData = {
  beginner: {
    name: "beginner",
    color: "blue",
    headerClass: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    progressClass: "bg-blue-600",
    hoverBorderClass: "hover:border-blue-300 dark:hover:border-blue-700",
    milestones: [
      {
        id: "b1",
        title: { bn: "সক্রিয় শ্রবণ", en: "Active Listening" },
        shortDesc: {
          bn: "বক্তার কথা মনোযোগ দিয়ে শোনা, নিজের উত্তর না ভাবা।",
          en: "Focus on the speaker, avoid planning your response.",
        },
        details: {
          tips: {
            bn: "বক্তার দিকে তাকান, মাঝপথে বাধা দেবেন না। তাঁর কথার মূলভাব বোঝার চেষ্টা করুন।",
            en: "Maintain eye contact, don't interrupt. Try to understand the core message.",
          },
          importance: {
            bn: "সক্রিয় শ্রবণ আস্থা তৈরি করে, ভুল বোঝাবুঝি কমায় এবং সম্পর্ক মজবুত করে।",
            en: "Active listening builds trust, reduces misunderstandings, and strengthens relationships.",
          },
          exercises: {
            bn: "২ মিনিটের একটি পডকাস্ট শুনে নিজের ভাষায় সংক্ষেপে লিখুন।",
            en: "Listen to a 2-minute podcast and summarize it in your own words.",
          },
          examples: {
            bn: '"আপনি বলতে চাচ্ছেন যে..."',
            en: '"So what you\'re saying is..."',
          },
          improvementTips: {
            bn: "প্রতিদিন ৫ মিনিট কারও কথা পুরো মনোযোগ দিয়ে শোনার অভ্যাস করুন। পরে তাঁকে আপনার বোধগম্যতা যাচাই করে বলুন।",
            en: "Practice listening without interruption for 5 minutes daily. Then paraphrase to confirm understanding.",
          },
          links: [
            { title: "MindTools - Active Listening", url: "https://www.mindtools.com/az4wxv7/active-listening" },
            { title: "HelpGuide - Active Listening", url: "https://www.helpguide.org/articles/relationships-communication/effective-communication.htm" },
          ],
        },
      },
      {
        id: "b2",
        title: { bn: "স্পষ্টতা ও সংক্ষিপ্ততা", en: "Clarity & Conciseness" },
        shortDesc: {
          bn: "অল্প কথায় নিজের ভাবনা প্রকাশ।",
          en: "Express ideas in few words.",
        },
        details: {
          tips: {
            bn: "সহজ শব্দ ব্যবহার করুন; এক বাক্যে একটি করে ধারণা রাখুন।",
            en: "Use simple vocabulary; one idea per sentence.",
          },
          importance: {
            bn: "স্পষ্ট ও সংক্ষিপ্ত ভাষা শ্রোতা দ্রুত বুঝতে পারেন, সময় বাঁচে এবং বার্তা কার্যকর হয়।",
            en: "Clear and concise language saves time and ensures your message is understood quickly.",
          },
          exercises: {
            bn: "একটি দীর্ঘ অনুচ্ছেদকে ৩টি বুলেট পয়েন্টে পুনর্লিখন করুন।",
            en: "Rewrite a long paragraph into 3 bullet points.",
          },
          examples: {
            bn: '"আমার মনে হয় হয়তো আমরা..."-এর পরিবর্তে "চলুন..." বলুন।',
            en: 'Instead of "I think that maybe we could..." say "Let\'s..."',
          },
          improvementTips: {
            bn: "প্রতিদিন একটি জটিল ধারণা ৩০ সেকেন্ডে ব্যাখ্যা করার চেষ্টা করুন। রেকর্ড করে নিজেই শুনুন।",
            en: "Try to explain a complex idea in 30 seconds daily. Record and listen to yourself.",
          },
          links: [
            { title: "Harvard Business Review - Conciseness", url: "https://hbr.org/2014/11/how-to-speak-concisely" },
          ],
        },
      },
      {
        id: "b3",
        title: { bn: "অমৌখিক যোগাযোগের মূলনীতি", en: "Non‑verbal Basics" },
        shortDesc: {
          bn: "চোখের দৃষ্টি, দেহভঙ্গি, অঙ্গভঙ্গি।",
          en: "Eye contact, posture, gestures.",
        },
        details: {
          tips: {
            bn: "কথা বলার সময় ৬০-৭০% সময় চোখে চোখ রাখুন। হাতের ভঙ্গি অর্থপূর্ণ রাখুন।",
            en: "Maintain eye contact 60‑70% of the time. Use purposeful hand gestures.",
          },
          importance: {
            bn: "অমৌখিক ইঙ্গিত মৌখিক বার্তাকে শক্তিশালী করে। সঠিক দেহভাষা আত্মবিশ্বাস ও আন্তরিকতা প্রকাশ করে।",
            en: "Non‑verbal cues reinforce your message. Good body language conveys confidence and sincerity.",
          },
          exercises: {
            bn: "আপনার কথা বলার একটি ভিডিও রেকর্ড করুন এবং শব্দ ছাড়া দেখুন।",
            en: "Record yourself speaking and watch without sound.",
          },
          examples: {
            bn: "হাত-পা বাঁধা না রেখে উন্মুক্ত দেহভঙ্গি রাখুন।",
            en: "Keep an open posture – uncrossed arms and legs.",
          },
          improvementTips: {
            bn: "আয়নার সামনে কথা বলার অভ্যাস করুন। আপনার হাতের ভঙ্গি ও মুখাবয়ব পর্যবেক্ষণ করুন।",
            en: "Practice speaking in front of a mirror. Observe your gestures and facial expressions.",
          },
          links: [
            { title: "Verywell Mind - Nonverbal Communication", url: "https://www.verywellmind.com/types-of-nonverbal-communication-2795397" },
          ],
        },
      },
      {
        id: "b4",
        title: { bn: "প্রশ্ন জিজ্ঞাসার কৌশল", en: "Asking Questions" },
        shortDesc: {
          bn: "উন্মুক্ত ও সংক্ষিপ্ত প্রশ্নের পার্থক্য।",
          en: "Open‑ended vs closed questions.",
        },
        details: {
          tips: {
            bn: '"কেন", "কীভাবে" দিয়ে প্রশ্ন শুরু করলে উত্তর বিস্তারিত হয়।',
            en: 'Start questions with "how" or "what" to encourage elaboration.',
          },
          importance: {
            bn: "উন্মুক্ত প্রশ্ন আলোচনাকে গভীর করে, অন্যদের চিন্তা প্রকাশের সুযোগ দেয় এবং সম্পর্ক উন্নত করে।",
            en: "Open‑ended questions deepen conversations and show genuine interest.",
          },
          exercises: {
            bn: "৫টি সংক্ষিপ্ত প্রশ্ন (হ্যাঁ/বুঝি) উন্মুক্ত প্রশ্নে রূপান্তর করুন।",
            en: "Convert 5 closed questions (yes/no) into open‑ended ones.",
          },
          examples: {
            bn: '"আপনি কি এটি পছন্দ করেছেন?"-এর পরিবর্তে "আপনি এটি সম্পর্কে কী ভাবছেন?"',
            en: 'Instead of "Did you like it?" ask "What did you think of it?"',
          },
          improvementTips: {
            bn: "প্রতিদিন কমপক্ষে ৩টি উন্মুক্ত প্রশ্ন তৈরি করুন এবং বাস্তব কথোপকথনে ব্যবহার করুন।",
            en: "Create at least 3 open‑ended questions daily and use them in real conversations.",
          },
          links: [
            { title: "The Power of Open-Ended Questions", url: "https://www.ccl.org/articles/leading-effectively-articles/open-ended-questions/" },
          ],
        },
      },
    ],
  },
  intermediate: {
    name: "intermediate",
    color: "green",
    headerClass: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    badgeClass: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    progressClass: "bg-green-600",
    hoverBorderClass: "hover:border-green-300 dark:hover:border-green-700",
    milestones: [
      {
        id: "i1",
        title: { bn: "সহানুভূতিশীল যোগাযোগ", en: "Empathy in Communication" },
        shortDesc: {
          bn: "অন্যের অনুভূতি বোঝা ও স্বীকার করা।",
          en: "Acknowledge others' feelings.",
        },
        details: {
          tips: {
            bn: '"আমি বুঝতে পারছি যে আপনি..." এই বাক্যটি ব্যবহার করুন।',
            en: 'Use phrases like "I understand that you..."',
          },
          importance: {
            bn: "সহানুভূতি দ্বন্দ্ব নিরসনে সহায়তা করে, বিশ্বাস গড়ে তোলে এবং গভীর সম্পর্ক তৈরি করে।",
            en: "Empathy resolves conflicts, builds trust, and deepens relationships.",
          },
          exercises: {
            bn: "একটি অভিযোগ শুনে সহানুভূতির সাথে উত্তর দিন (লিখিত বা মৌখিক)।",
            en: "Listen to a complaint and respond empathetically (written or spoken).",
          },
          examples: {
            bn: '"মনে হচ্ছে আপনি হতাশ কারণ..."',
            en: '"It sounds like you\'re frustrated because..."',
          },
          improvementTips: {
            bn: "অন্যের দৃষ্টিকোণ থেকে চিন্তা করার অভ্যাস করুন। প্রতিদিন একজন মানুষের গল্প শুনে তাতে সহানুভূতি জানান।",
            en: "Practice perspective‑taking. Listen to someone's story and express empathy daily.",
          },
          links: [
            { title: "Greater Good - Empathy", url: "https://greatergood.berkeley.edu/topic/empathy/definition" },
          ],
        },
      },
      {
        id: "i2",
        title: { bn: "বার্তা গঠন কৌশল (PREP)", en: "Structuring Messages (PREP)" },
        shortDesc: {
          bn: "মূল বক্তব্য, কারণ, উদাহরণ, পুনরুক্তি।",
          en: "Point, Reason, Example, Point.",
        },
        details: {
          tips: {
            bn: "প্রথমে মূল বক্তব্য বলুন, তারপরে যুক্তি ও উদাহরণ দিন।",
            en: "State your main point first, then support it with reason and example.",
          },
          importance: {
            bn: "PREP পদ্ধতি বার্তাকে সুসংহত ও প্রভাবশালী করে, শ্রোতা সহজেই অনুসরণ করতে পারেন।",
            en: "PREP makes your message structured and persuasive; listeners follow easily.",
          },
          exercises: {
            bn: "PREP পদ্ধতিতে ১ মিনিটের বক্তৃতা প্রস্তুত করুন।",
            en: "Prepare a 1‑minute speech using the PREP method.",
          },
          examples: {
            bn: '"আমাদের নতুন সফটওয়্যার দরকার (মূল বক্তব্য) কারণ বর্তমানটি ধীর (কারণ)..."',
            en: '"We need new software (Point) because the current one is slow (Reason)..."',
          },
          improvementTips: {
            bn: "যেকোনো আলোচনার আগে ৩০ সেকেন্ডে PREP কাঠামোয় ভাবনা সাজানোর অভ্যাস করুন।",
            en: "Before any discussion, practice organizing your thoughts in the PREP framework (30 seconds).",
          },
          links: [
            { title: "PREP Method - Communication", url: "https://www.communicationtheory.org/prep-method/" },
          ],
        },
      },
      {
        id: "i3",
        title: { bn: "গঠনমূলক প্রতিক্রিয়া (SBI)", en: "Giving Feedback (SBI)" },
        shortDesc: {
          bn: "পরিস্থিতি, আচরণ, প্রভাব।",
          en: "Situation, Behaviour, Impact.",
        },
        details: {
          tips: {
            bn: "ব্যক্তিত্ব নয়, নির্দিষ্ট আচরণ নিয়ে কথা বলুন।",
            en: "Focus on specific behaviour, not the person's character.",
          },
          importance: {
            bn: "SBI পদ্ধতি ব্যক্তিকে আক্রমণ না করে আচরণের উন্নতিতে সাহায্য করে, প্রতিরক্ষামূলক মনোভাব কমায়।",
            en: "SBI reduces defensiveness and focuses on improvement rather than blame.",
          },
          exercises: {
            bn: "একটি কাল্পনিক সহকর্মীর জন্য SBI মডেলে প্রতিক্রিয়া লিখুন।",
            en: "Write feedback for a fictional colleague using the SBI model.",
          },
          examples: {
            bn: '"গতকালের মিটিংয়ে (পরিস্থিতি) আপনি দুবার বাধা দিয়েছেন (আচরণ), এতে বক্তার কথা বলার ধারা ভেঙে গেছে (প্রভাব)।"',
            en: '"In yesterday\'s meeting (Situation), you interrupted twice (Behaviour), which disrupted the speaker\'s flow (Impact)."',
          },
          improvementTips: {
            bn: "আপনার দেওয়া প্রতিটি প্রতিক্রিয়াকে SBI ফরম্যাটে সাজানোর চেষ্টা করুন। অনুশীলনের জন্য বাস্তব ঘটনা লিখুন।",
            en: "Try to reframe every piece of feedback you give into SBI format. Write down real examples.",
          },
          links: [
            { title: "Center for Creative Leadership - SBI", url: "https://www.ccl.org/articles/leading-effectively-articles/situation-behavior-impact-feedback-tool/" },
          ],
        },
      },
      {
        id: "i4",
        title: { bn: "শ্রোতা অনুযায়ী ভাষা নির্বাচন", en: "Adapting to Audience" },
        shortDesc: {
          bn: "সুর, আনুষ্ঠানিকতা, শব্দভান্ডার।",
          en: "Tone, formality, vocabulary.",
        },
        details: {
          tips: {
            bn: "শ্রোতার ভাষার স্তর ও প্রেক্ষাপট বুঝে কথা বলুন।",
            en: "Mirror the other person's language level and context.",
          },
          importance: {
            bn: "শ্রোতাভেদে ভাষা পরিবর্তন করলে বার্তা সহজে গৃহীত হয়, শ্রোতা সম্মানিত বোধ করেন।",
            en: "Adapting your language makes your message more accessible and shows respect.",
          },
          exercises: {
            bn: "একটি প্রযুক্তিগত ধারণা ৮ বছর বয়সী শিশু ও একজন ব্যবস্থাপকের কাছে ব্যাখ্যা করুন।",
            en: "Explain a technical concept to an 8‑year‑old child and to a manager.",
          },
          examples: {
            bn: "শিশুকে: 'ফোন ছবি ধরে রাখে'। সিইও-কে: 'ডিভাইসটিতে ফ্ল্যাশ মেমরি সংরক্ষিত হয়'।",
            en: "To a child: 'The phone stores pictures.' To a CEO: 'The device utilizes flash memory.'",
          },
          improvementTips: {
            bn: "প্রতিদিন একই তথ্য বিভিন্ন শ্রোতার (বন্ধু, পরিবার, বস) জন্য ভিন্নভাবে বলার অভ্যাস করুন।",
            en: "Practice explaining the same idea to different audiences daily.",
          },
          links: [
            { title: "Harvard Professional Development", url: "https://professional.dce.harvard.edu/blog/how-to-adapt-your-communication-style-to-different-audiences/" },
          ],
        },
      },
    ],
  },
  advanced: {
    name: "advanced",
    color: "orange",
    headerClass: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    badgeClass: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    progressClass: "bg-orange-600",
    hoverBorderClass: "hover:border-orange-300 dark:hover:border-orange-700",
    milestones: [
      {
        id: "a1",
        title: { bn: "প্ররোচনা কৌশল (Ethos, Pathos, Logos)", en: "Persuasion Techniques" },
        shortDesc: {
          bn: "আস্থা, আবেগ, যুক্তি।",
          en: "Ethos, Pathos, Logos.",
        },
        details: {
          tips: {
            bn: "বিশ্বাসযোগ্যতা, আবেগ ও যুক্তি—তিনটির সমন্বয় ঘটান।",
            en: "Combine credibility, emotion, and logic.",
          },
          importance: {
            bn: "প্ররোচনা দক্ষতা মানুষকে প্রভাবিত করে, নেতৃত্বের গুণাবলি বিকাশ করে এবং পেশাগত সাফল্য আনে।",
            en: "Persuasion influences others, develops leadership, and drives professional success.",
          },
          exercises: {
            bn: "একটি আইডিয়া প্ররোচনামূলকভাবে উপস্থাপনের জন্য ১ মিনিটের বক্তব্য তৈরি করুন।",
            en: "Prepare a 1‑minute persuasive pitch for an idea.",
          },
          examples: {
            bn: '"একজন চিকিৎসক হিসেবে (আস্থা) আমি দেখেছি এটি জীবন বাঁচায় (আবেগ); পরিসংখ্যান বলছে এটি ৩০% কার্যকর (যুক্তি)।"',
            en: '"As a doctor (ethos), I\'ve seen this save lives (pathos); data shows 30% effectiveness (logos)."',
          },
          improvementTips: {
            bn: "বিজ্ঞাপন, রাজনৈতিক বক্তব্য বিশ্লেষণ করে Ethos, Pathos, Logos চিহ্নিত করুন। নিজের বক্তব্যে এদের প্রয়োগ করুন।",
            en: "Analyze ads and speeches for ethos, pathos, logos. Apply them in your own communication.",
          },
          links: [
            { title: "Ethos, Pathos, Logos - Purdue OWL", url: "https://owl.purdue.edu/owl/general_writing/academic_writing/rhetorical_situation/ethos_pathos_logos.html" },
          ],
        },
      },
      {
        id: "a2",
        title: { bn: "দ্বন্দ্ব নিরসন", en: "Conflict Resolution" },
        shortDesc: {
          bn: "জয়-জয় সমঝোতা।",
          en: "Win‑win negotiation.",
        },
        details: {
          tips: {
            bn: "ব্যক্তি থেকে সমস্যাকে আলাদা করুন। অভিন্ন স্বার্থ খুঁজুন।",
            en: "Separate people from the problem. Find common interests.",
          },
          importance: {
            bn: "দ্বন্দ্ব নিরসন কর্মক্ষেত্র ও ব্যক্তিজীবনে সুস্থ সম্পর্ক বজায় রাখে, উৎপাদনশীলতা বাড়ায়।",
            en: "Conflict resolution maintains healthy relationships and boosts productivity.",
          },
          exercises: {
            bn: "দুই পক্ষের মধ্যে কাল্পনিক দ্বন্দ্ব সমাধানের সংলাপ লিখুন।",
            en: "Write a dialogue resolving a fictional conflict between two parties.",
          },
          examples: {
            bn: '"আমরা দুজনেই প্রকল্পটি সফল করতে চাই; আসুন এমন একটি সময়সীমা বের করি যা দুজনের জন্য সুবিধাজনক।"',
            en: '"We both want the project to succeed; let\'s find a timeline that works for both of us."',
          },
          improvementTips: {
            bn: "দ্বন্দ্বের সময় নিজের আবেগ নিয়ন্ত্রণে রাখতে ১০ সেকেন্ড চুপ থাকুন। পরে 'আমি' দিয়ে বক্তব্য শুরু করুন (যেমন 'আমার মনে হলো...')।",
            en: "During a conflict, pause for 10 seconds. Start sentences with 'I' (e.g., 'I felt...').",
          },
          links: [
            { title: "Harvard Law - Conflict Resolution", url: "https://www.pon.harvard.edu/tag/conflict-resolution/" },
          ],
        },
      },
      {
        id: "a3",
        title: { bn: "গল্প বলা (Storytelling)", en: "Storytelling" },
        shortDesc: {
          bn: "প্রেক্ষাপট, দ্বন্দ্ব, সমাধান।",
          en: "Context, conflict, resolution.",
        },
        details: {
          tips: {
            bn: "ব্যক্তিগত অভিজ্ঞতার গল্প বলুন যা আপনার বক্তব্যকে সমর্থন করে।",
            en: "Use personal stories that support your message.",
          },
          importance: {
            bn: "গল্প মস্তিষ্কে সহজে গেঁথে যায়, শ্রোতার মনে দীর্ঘস্থায়ী প্রভাব ফেলে এবং বার্তাকে প্রাণবন্ত করে।",
            en: "Stories are memorable, create emotional connection, and make abstract ideas concrete.",
          },
          exercises: {
            bn: "একটি ডেটা রিপোর্টকে ২ মিনিটের গল্পে রূপান্তর করুন।",
            en: "Turn a data report into a 2‑minute story.",
          },
          examples: {
            bn: '"শুরুতে বিক্রি কম ছিল; তারপর আমরা এক্স পদ্ধতি চালু করি এবং ৪০% বৃদ্ধি পাই..."',
            en: '"Sales were flat; then we introduced X and saw a 40% increase..."',
          },
          improvementTips: {
            bn: "প্রতিদিন একটি ছোট ঘটনাকে গল্পের কাঠামোয় সাজান। বন্ধুকে শোনান।",
            en: "Structure a daily event into a story and tell it to a friend.",
          },
          links: [
            { title: "Stanford GSB - Storytelling", url: "https://www.gsb.stanford.edu/insights/why-storytelling-makes-communication-memorable" },
          ],
        },
      },
      {
        id: "a4",
        title: { bn: "কর্তৃত্ব ছাড়া প্রভাব বিস্তার", en: "Influencing Without Authority" },
        shortDesc: {
          bn: "মিত্রতা ও সমঝোতা।",
          en: "Building alliances.",
        },
        details: {
          tips: {
            bn: "অন্যের দক্ষতাকে মূল্যায়ন করুন, পরামর্শ চান।",
            en: "Acknowledge others' expertise and ask for advice.",
          },
          importance: {
            bn: "সাংগঠনিক ক্ষমতা ছাড়াই মানুষকে অনুপ্রাণিত করার দক্ষতা নেতৃত্বের অন্যতম চাবিকাঠি।",
            en: "Influencing without formal authority is a key leadership skill.",
          },
          exercises: {
            bn: "একটি প্রকল্পের জন্য কল্পিত স্টেকহোল্ডার ম্যাপ তৈরি করুন।",
            en: "Create a stakeholder map for a hypothetical project.",
          },
          examples: {
            bn: '"এই বিষয়ে আপনার অভিজ্ঞতা অমূল্য—আপনার মতামত কী?"',
            en: '"Your expertise on this is invaluable—what\'s your take?"',
          },
          improvementTips: {
            bn: "প্রতিদিন একজন সহকর্মীর কাছ থেকে অভিমত চান এবং তার অবদানের প্রশংসা করুন।",
            en: "Daily, ask a colleague for their opinion and appreciate their input.",
          },
          links: [
            { title: "HBR - Influencing Without Authority", url: "https://hbr.org/2019/03/how-to-influence-people-when-youre-not-the-boss" },
          ],
        },
      },
    ],
  },
  expert: {
    name: "expert",
    color: "purple",
    headerClass: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    progressClass: "bg-purple-600",
    hoverBorderClass: "hover:border-purple-300 dark:hover:border-purple-700",
    milestones: [
      {
        id: "e1",
        title: { bn: "নির্বাহী উপস্থিতি", en: "Executive Presence" },
        shortDesc: {
          bn: "আত্মবিশ্বাস, স্থিরতা, প্রভাব।",
          en: "Confidence, poise, gravitas.",
        },
        details: {
          tips: {
            bn: "উত্তর দেওয়ার আগে থামুন, ধীরে কথা বলুন।",
            en: "Pause before answering, speak slowly.",
          },
          importance: {
            bn: "নির্বাহী উপস্থিতি বিশ্বাসযোগ্যতা ও কর্তৃত্ব স্থাপন করে, বড় দলের সামনে কথা বলার সক্ষমতা বাড়ায়।",
            en: "Executive presence builds credibility and authority, essential for leading large groups.",
          },
          exercises: {
            bn: "৩ মিনিটের উপস্থাপনায় ইচ্ছাকৃত বিরতি দিন।",
            en: "Deliver a 3‑minute presentation with deliberate pauses.",
          },
          examples: {
            bn: "কঠিন প্রশ্নের উত্তর দেওয়ার আগে মনে মনে ৩ পর্যন্ত গুণুন।",
            en: "Count to three silently before responding to tough questions.",
          },
          improvementTips: {
            bn: "প্রতিদিন আয়নার সামনে দাঁড়িয়ে ২ মিনিট ইতিবাচক নিশ্চয়তা দিন। স্বরগ্রাম ও ভঙ্গি পর্যবেক্ষণ করুন।",
            en: "Practice positive affirmations in front of a mirror for 2 minutes daily; observe your tone and posture.",
          },
          links: [
            { title: "Center for Talent Innovation", url: "https://www.talentinnovation.org/publications.cfm" },
          ],
        },
      },
      {
        id: "e2",
        title: { bn: "আন্তঃসাংস্কৃতিক যোগাযোগ", en: "Cross‑Cultural Communication" },
        shortDesc: {
          bn: "উচ্চ-প্রেক্ষাপট বনাম নিম্ন-প্রেক্ষাপট সংস্কৃতি।",
          en: "High‑context vs low‑context cultures.",
        },
        details: {
          tips: {
            bn: "আন্তর্জাতিক কলের আগে সংস্কৃতি সম্পর্কে জেনে নিন।",
            en: "Research cultural norms before international calls.",
          },
          importance: {
            bn: "বিশ্বায়িত পেশাজীবনে সাংস্কৃতিক পার্থক্য বোঝা ভুল বোঝাবুঝি কমায় ও বৈশ্বিক সম্পর্ক উন্নত করে।",
            en: "Understanding cultural differences minimizes misunderstandings and enhances global collaboration.",
          },
          exercises: {
            bn: "দুটি দেশের যোগাযোগ রীতির তুলনা করুন।",
            en: "Compare communication styles of two countries.",
          },
          examples: {
            bn: "জাপানে চুপ থাকা সম্মান; ব্রাজিলে একসঙ্গে কথা বলা ব্যস্ততার লক্ষণ।",
            en: "In Japan, silence is respectful; in Brazil, overlapping speech indicates engagement.",
          },
          improvementTips: {
            bn: "বিদেশি সিনেমা বা ডকুমেন্টারি দেখে বিভিন্ন সংস্কৃতির যোগাযোগশৈলী বিশ্লেষণ করুন।",
            en: "Watch foreign films or documentaries and analyze communication styles.",
          },
          links: [
            { title: "Hofstede Insights", url: "https://www.hofstede-insights.com/country-comparison/" },
          ],
        },
      },
      {
        id: "e3",
        title: { bn: "কোচিং ও মেন্টরিং", en: "Coaching & Mentoring" },
        shortDesc: {
          bn: "শক্তিশালী প্রশ্ন জিজ্ঞাসা।",
          en: "Ask powerful questions.",
        },
        details: {
          tips: {
            bn: "GROW মডেল ব্যবহার করুন (লক্ষ্য, বাস্তবতা, বিকল্প, ইচ্ছাশক্তি)।",
            en: "Use the GROW model (Goal, Reality, Options, Will).",
          },
          importance: {
            bn: "কোচিং দক্ষতা অন্যদের আত্মনির্ভরশীল করে, দলের সামগ্রিক সক্ষমতা বাড়ায়।",
            en: "Coaching empowers others and increases team capability.",
          },
          exercises: {
            bn: "একজন সহকর্মীর চ্যালেঞ্জ নেওয়ার সময় শুধু প্রশ্ন করে তাঁকে কোচিং দিন।",
            en: "Coach a peer through a challenge using only questions.",
          },
          examples: {
            bn: '"আদর্শ ফলাফল কেমন দেখতে?"',
            en: '"What would an ideal outcome look like?"',
          },
          improvementTips: {
            bn: "প্রতিদিন একটি GROW প্রশ্ন তৈরি করুন এবং তা নিজের বা অন্যের ক্ষেত্রে প্রয়োগ করুন।",
            en: "Formulate one GROW question daily and apply it to yourself or others.",
          },
          links: [
            { title: "GROW Model - MindTools", url: "https://www.mindtools.com/pages/article/grow-model.htm" },
          ],
        },
      },
      {
        id: "e4",
        title: { bn: "সংকটকালীন যোগাযোগ", en: "Crisis Communication" },
        shortDesc: {
          bn: "স্বচ্ছতা, সহানুভূতি, পদক্ষেপ।",
          en: "Transparency, empathy, action.",
        },
        details: {
          tips: {
            bn: "প্রথমে সমস্যা স্বীকার করুন, তারপর সমাধানের পথ ব্যাখ্যা করুন।",
            en: "Acknowledge the issue first, then explain the solution path.",
          },
          importance: {
            bn: "সংকটে দ্রুত ও সৎ যোগাযোগ সুনাম রক্ষা করে, স্টেকহোল্ডারদের আস্থা ধরে রাখে।",
            en: "Fast, honest communication during a crisis preserves reputation and stakeholder trust.",
          },
          exercises: {
            bn: "একটি পণ্য প্রত্যাহারের বার্তার খসড়া তৈরি করুন।",
            en: "Draft a message for a product recall.",
          },
          examples: {
            bn: '"আমরা সমস্যাটি জানি এবং সমাধানে কাজ করছি। আগামীকাল হালনাগাদ জানাব।"',
            en: '"We are aware of the issue and are working on a fix. We\'ll update you tomorrow."',
          },
          improvementTips: {
            bn: "বাস্তব সংকটের সংবাদ সম্মেলন বিশ্লেষণ করুন। আপনার নিজস্ব প্রতিক্রিয়ার খসড়া তৈরি করুন।",
            en: "Analyze real crisis press conferences; draft your own response.",
          },
          links: [
            { title: "Crisis Communication - FEMA", url: "https://training.fema.gov/emiweb/is/is242b/student%20manual/sm_05.pdf" },
          ],
        },
      },
    ],
  },
};

// ------------------------------------------------------------
// ৩. হেল্পার ফাংশন (স্টোরেজ, তারিখ)
// ------------------------------------------------------------
const PROGRESS_KEY = "comm_v4_progress";
const NOTES_KEY = "comm_v4_notes";
const LANG_KEY = "comm_v4_lang";

const loadProgress = () => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const saveProgress = (progress) => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

const loadNotes = () => {
  try {
    const saved = localStorage.getItem(NOTES_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const saveNotes = (notes) => {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

const getTodayDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
};

// ------------------------------------------------------------
// ৪. সেকশন কার্ড – সেন্টার এলাইন, প্রফেশনাল লুক
// ------------------------------------------------------------
const SectionCard = ({ icon, title, content }) => (
  <div className="w-full max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
    <h4 className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
      <span className="text-lg">{icon}</span> {title}
    </h4>
    <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed text-center">
      {content}
    </p>
  </div>
);

// ------------------------------------------------------------
// ৫. মডাল কম্পোনেন্ট – সম্পূর্ণ সেন্টার এলাইন, টাইপো ফ্রি
// ------------------------------------------------------------
const MilestoneModal = ({ isOpen, onClose, milestone, lang, levelColor }) => {
  const t = translations[lang];
  const today = getTodayDate();
  const noteKey = milestone ? `${milestone.id}_${today}` : "";
  const [noteText, setNoteText] = useState("");
  const [savedNotes, setSavedNotes] = useState(loadNotes());

  useEffect(() => {
    if (milestone) {
      setNoteText(savedNotes[noteKey] || "");
    }
  }, [milestone, noteKey, savedNotes]);

  const handleSaveNote = () => {
    const updated = { ...savedNotes, [noteKey]: noteText };
    setSavedNotes(updated);
    saveNotes(updated);
  };

  const handleClearNote = () => {
    setNoteText("");
    const updated = { ...savedNotes };
    delete updated[noteKey];
    setSavedNotes(updated);
    saveNotes(updated);
  };

  if (!milestone) return null;

  const title = milestone.title[lang];
  const tips = milestone.details.tips[lang];
  const importance = milestone.details.importance[lang];
  const exercises = milestone.details.exercises[lang];
  const examples = milestone.details.examples[lang];
  const improvementTips = milestone.details.improvementTips[lang];
  const links = milestone.details.links || [];

  const levelName = 
    lang === "bn" 
      ? milestone.id[0] === "b" ? "শিক্ষানবিশ"
        : milestone.id[0] === "i" ? "মধ্যবর্তী"
        : milestone.id[0] === "a" ? "উন্নত"
        : "বিশেষজ্ঞ"
      : milestone.id[0] === "b" ? "Beginner"
        : milestone.id[0] === "i" ? "Intermediate"
        : milestone.id[0] === "a" ? "Advanced"
        : "Expert";

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
            className="fixed left-1/2 top-1/2 z-50 w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.9, y: "-30%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-30%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* হেডার – লেভেল ব্যাজ + আজকের তারিখ (সেন্টার) */}
            <div className="flex flex-col items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full bg-${levelColor}-500`} />
                <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${levelColor}-100 text-${levelColor}-800 dark:bg-${levelColor}-900/30 dark:text-${levelColor}-300`}>
                  {levelName}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span>📅</span> {formatDate(today)}
              </div>
            </div>

            {/* শিরোনাম – সেন্টার */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {title}
            </h3>

            {/* কন্টেন্ট – সব সেকশন সেন্টার এলাইন */}
            <div className="flex flex-col items-center gap-5 w-full">
              <SectionCard icon="💡" title={t.tips} content={tips} />
              <SectionCard icon="❓" title={t.importance} content={importance} />
              <SectionCard icon="🏋️" title={t.exercises} content={exercises} />

              {/* উদাহরণ – সেন্টার এলাইন, বিশেষ উদ্ধৃতি স্টাইল */}
              <div className="w-full max-w-2xl mx-auto">
                <h4 className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <span className="text-lg">📋</span> {t.examples}
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border-l-4 border-indigo-400 dark:border-indigo-600 text-center">
                  <p className="text-base italic text-gray-800 dark:text-gray-200">
                    “{examples}”
                  </p>
                </div>
              </div>

              <SectionCard icon="🚀" title={t.improvementTips} content={improvementTips} />

              {/* বহিঃস্থ লিংক – সেন্টার এলাইন, বাটন স্টাইল */}
              {links.length > 0 && (
                <div className="w-full max-w-2xl mx-auto mt-2">
                  <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-3 text-center flex items-center justify-center gap-2">
                    <span>🔗</span> {t.externalLinks}
                  </h4>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition text-sm font-medium flex items-center gap-1"
                      >
                        {link.title} <span className="text-xs">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* দৈনিক অনুশীলন নোট – সেন্টার এলাইন */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-auto">
              <h4 className="flex items-center justify-center gap-2 text-base font-semibold text-gray-900 dark:text-white mb-4">
                <span className="text-xl">📝</span> {t.dailyNote}
              </h4>
              <div className="flex flex-col items-center gap-4 w-full">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={t.notePlaceholder}
                  rows={3}
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-indigo-600 text-center"
                />
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleSaveNote}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1-4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {t.saveNote}
                  </button>
                  <button
                    onClick={handleClearNote}
                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {t.clearNote}
                  </button>
                </div>
                {savedNotes[noteKey] && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-4 py-2 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {lang === "bn" ? "✓ আজকের নোট সংরক্ষিত হয়েছে" : "✓ Today's note saved"}
                  </div>
                )}
              </div>
            </div>

            {/* ক্লোজ বাটন – সেন্টার */}
            <div className="flex justify-center mt-6">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t.close}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ------------------------------------------------------------
// ৬. মাইলফলক কার্ড – শুরু করার তারিখ সহ
// ------------------------------------------------------------
const MilestoneCard = ({ milestone, levelData, progress, onToggleComplete, lang }) => {
  const t = translations[lang];
  const [modalOpen, setModalOpen] = useState(false);

  const isCompleted = progress[milestone.id]?.completed || false;
  const startDate = progress[milestone.id]?.startDate || null;

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleComplete(milestone.id);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -3, boxShadow: "0 12px 20px -8px rgba(0,0,0,0.06)" }}
        className={`relative flex flex-col p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer transition-all ${levelData.hoverBorderClass}`}
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white pr-6">
            {milestone.title[lang]}
          </h4>
          <button
            onClick={handleToggle}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
              isCompleted
                ? `bg-${levelData.color}-500 border-${levelData.color}-500 text-white`
                : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
            }`}
          >
            {isCompleted && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
          {milestone.shortDesc[lang]}
        </p>

        {startDate && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className={`w-1.5 h-1.5 rounded-full bg-${levelData.color}-500`} />
            <span>
              {t.started}: {formatDate(startDate)}
            </span>
          </div>
        )}

        <div className={`absolute bottom-3 right-3 w-2 h-2 rounded-full bg-${levelData.color}-400`} />
      </motion.div>

      <MilestoneModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        milestone={milestone}
        lang={lang}
        levelColor={levelData.color}
      />
    </>
  );
};

// ------------------------------------------------------------
// ৭. লেভেল কার্ড
// ------------------------------------------------------------
const LevelCard = ({ levelKey, levelData, progress, onToggleComplete, lang }) => {
  const t = translations[lang];
  const levelNames = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
    expert: t.levelExpert,
  };

  const completedCount = levelData.milestones.filter((m) => progress[m.id]?.completed).length;
  const total = levelData.milestones.length;
  const percent = total ? (completedCount / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`bg-white dark:bg-gray-800/90 rounded-2xl p-6 border ${levelData.headerClass} shadow-sm`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {levelNames[levelKey]}
        </h3>
        <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${levelData.badgeClass}`}>
          {completedCount}/{total} {t.milestones}
        </span>
      </div>

      <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full ${levelData.progressClass} rounded-full transition-all duration-700`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {levelData.milestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            levelData={levelData}
            progress={progress}
            onToggleComplete={onToggleComplete}
            lang={lang}
          />
        ))}
      </div>
    </motion.div>
  );
};

// ------------------------------------------------------------
// ৮. মূল কম্পোনেন্ট (CommunicationRoadmap)
// ------------------------------------------------------------
const CommunicationRoadmap = () => {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return saved || "bn";
  });
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "bn" ? "en" : "bn"));
  };

  const handleToggleComplete = useCallback((milestoneId) => {
    setProgress((prev) => {
      const current = prev[milestoneId] || {};
      const now = getTodayDate();
      return {
        ...prev,
        [milestoneId]: {
          completed: !current.completed,
          startDate: current.startDate || (!current.completed ? now : current.startDate),
        },
      };
    });
  }, []);

  const t = translations[lang];
  const today = getTodayDate();

  const allMilestones = useMemo(
    () => Object.values(roadmapData).flatMap((lvl) => lvl.milestones),
    []
  );
  const totalMilestones = allMilestones.length;
  const completedMilestones = allMilestones.filter((m) => progress[m.id]?.completed).length;
  const overallPercent = totalMilestones ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* হেডার – সেন্টার এলাইন */}
      <div className="flex flex-col items-center justify-center gap-4 mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          🗣️ {t.appTitle}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          {t.appSubtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              📅 {t.today}:
            </span>
            <span className="text-base font-semibold text-indigo-800 dark:text-indigo-200">
              {formatDate(today)}
            </span>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <span className="text-sm font-medium">{t.languageToggle}</span>
          </button>
        </div>
      </div>

      {/* সামগ্রিক প্রগ্রেস বার */}
      <div className="mb-10 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border border-indigo-100 dark:border-gray-700 text-center">
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

      {/* রোডম্যাপ লেভেলসমূহ */}
      <div className="space-y-8">
        {Object.entries(roadmapData).map(([key, data]) => (
          <LevelCard
            key={key}
            levelKey={key}
            levelData={data}
            progress={progress}
            onToggleComplete={handleToggleComplete}
            lang={lang}
          />
        ))}
      </div>
    </div>
  );
};

export default CommunicationRoadmap;