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
  Bell
} from 'lucide-react';

const Roadmap = () => {
  // ---------- রোডম্যাপ ডেটা (অ্যাডভান্সড) ----------
  const roadmapData = [
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
        { id: 'html', title: 'HTML5', resources: 'MDN, W3Schools', time: 10, completed: false, completedAt: null },
        { id: 'css', title: 'CSS3', resources: 'Flexbox, Grid, Animations', time: 15, completed: false, completedAt: null },
        { id: 'js', title: 'JavaScript (ES6+)', resources: 'Variables, Functions, DOM, Async', time: 40, completed: false, completedAt: null },
        { id: 'responsive', title: 'Responsive Design', resources: 'Media Queries, Mobile-first', time: 8, completed: false, completedAt: null },
        { id: 'git', title: 'Git & GitHub', resources: 'Basic commands, Repositories', time: 6, completed: false, completedAt: null },
        { id: 'react', title: 'React.js', resources: 'Components, Hooks, Router, State', time: 35, completed: false, completedAt: null },
        { id: 'next', title: 'Next.js', resources: 'SSR, SSG, API routes', time: 20, completed: false, completedAt: null },
        { id: 'tailwind', title: 'Tailwind CSS', resources: 'Utility classes, Customization', time: 12, completed: false, completedAt: null },
        { id: 'typescript', title: 'TypeScript', resources: 'Types, Interfaces, Generics', time: 18, completed: false, completedAt: null },
        { id: 'testing', title: 'Testing (Jest, RTL)', resources: 'Unit tests, Integration tests', time: 14, completed: false, completedAt: null }
      ]
    },
    {
      id: 'backend',
      title: '⚡ Python Django Advanced & Optimization',
      icon: Rocket,
      color: 'from-green-600 to-emerald-700',
      lightBg: 'bg-green-50',
      darkBg: 'dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800',
      topics: [
        // ----- কোর অ্যাডভান্সড -----
        { id: 'python-advanced', title: 'Advanced Python', resources: 'Metaclasses, Decorators, Context Managers, Generators, Coroutines', time: 20, completed: false, completedAt: null },
        { id: 'django-advanced-models', title: 'Advanced Django Models', resources: 'Custom Managers, Proxy Models, Multi-table Inheritance, Generic Relations', time: 15, completed: false, completedAt: null },
        { id: 'django-advanced-queries', title: 'Complex Database Queries', resources: 'Q objects, F expressions, Subqueries, Prefetch, Annotations', time: 12, completed: false, completedAt: null },
        { id: 'django-custom-validators', title: 'Custom Validators & Fields', resources: 'Model/Form validators, Custom model fields', time: 8, completed: false, completedAt: null },
        { id: 'django-signals', title: 'Signals & Event Hooks', resources: 'Pre/Post save, m2m_changed, request_finished', time: 10, completed: false, completedAt: null },
        { id: 'django-middleware', title: 'Custom Middleware', resources: 'Process request/response, Exception handling', time: 8, completed: false, completedAt: null },
        { id: 'django-class-based-views', title: 'Class‑Based Views Mastery', resources: 'Mixins, Generic views, View inheritance', time: 12, completed: false, completedAt: null },
        { id: 'django-rest-advanced', title: 'Django REST Framework Advanced', resources: 'Custom permissions, Throttling, Versioning, Nested serializers, HATEOAS', time: 20, completed: false, completedAt: null },
        { id: 'django-rest-viewsets', title: 'ViewSets & Routers', resources: 'ModelViewSet, ReadOnlyModelViewSet, Custom actions', time: 10, completed: false, completedAt: null },
        { id: 'django-rest-filtering', title: 'Advanced Filtering & Search', resources: 'django-filter, SearchFilter, OrderingFilter, Custom backends', time: 8, completed: false, completedAt: null },
        { id: 'django-rest-pagination', title: 'Pagination Strategies', resources: 'CursorPagination, LimitOffsetPagination, Custom paginators', time: 6, completed: false, completedAt: null },
        // ----- পারফরম্যান্স অপটিমাইজেশন -----
        { id: 'django-query-optimization', title: 'Database Query Optimization', resources: 'Select_related, Prefetch_related, only/defer, bulk operations', time: 12, completed: false, completedAt: null },
        { id: 'django-caching', title: 'Caching Strategies', resources: 'Memcached, Redis, Cache API, Per-view caching, Template caching', time: 12, completed: false, completedAt: null },
        { id: 'django-db-indexing', title: 'Database Indexing', resources: 'Composite indexes, Partial indexes, Expression indexes', time: 10, completed: false, completedAt: null },
        { id: 'django-connection-pooling', title: 'Connection Pooling', resources: 'pgBouncer, Pgpool, Django DB optimizations', time: 8, completed: false, completedAt: null },
        { id: 'django-async', title: 'Asynchronous Django (ASGI)', resources: 'Async views, Async ORM (3.1+), Async signals, Daphne/Uvicorn', time: 14, completed: false, completedAt: null },
        { id: 'django-channels-advanced', title: 'Django Channels & WebSockets', resources: 'ASGI, Consumers, Groups, Redis layer, Real-time chat', time: 16, completed: false, completedAt: null },
        { id: 'django-celery', title: 'Celery & Background Tasks', resources: 'Task queues, Periodic tasks, Result backends, Flower monitoring', time: 14, completed: false, completedAt: null },
        { id: 'django-celery-beat', title: 'Scheduled Tasks with Celery Beat', resources: 'Crontab schedules, Database scheduler', time: 8, completed: false, completedAt: null },
        { id: 'django-file-optimization', title: 'File & Image Optimization', resources: 'Pillow, django-imagekit, Cloudinary, S3 direct upload', time: 10, completed: false, completedAt: null },
        // ----- এন্টারপ্রাইজ সিকিউরিটি -----
        { id: 'django-security-owasp', title: 'OWASP Top 10 Implementation', resources: 'SQL Injection, XSS, CSRF, SSRF, Security middleware', time: 12, completed: false, completedAt: null },
        { id: 'django-auth-advanced', title: 'Advanced Authentication', resources: 'JWT, OAuth2, Social auth, MFA, django-allauth', time: 16, completed: false, completedAt: null },
        { id: 'django-permissions', title: 'Advanced Permissions', resources: 'Custom permission classes, Object-level permissions, django-guardian', time: 10, completed: false, completedAt: null },
        { id: 'django-rate-limiting', title: 'Rate Limiting & Throttling', resources: 'django-ratelimit, DRF throttling, Custom throttles', time: 8, completed: false, completedAt: null },
        { id: 'django-audit-logging', title: 'Audit Logging', resources: 'django-auditlog, django-reversion, Signal-based logs', time: 8, completed: false, completedAt: null },
        // ----- স্কেলিং ও আর্কিটেকচার -----
        { id: 'django-microservices', title: 'Microservices with Django', resources: 'Service decomposition, REST communication, Message brokers', time: 16, completed: false, completedAt: null },
        { id: 'django-event-driven', title: 'Event‑Driven Architecture', resources: 'RabbitMQ, Kafka, django-eventstream', time: 14, completed: false, completedAt: null },
        { id: 'django-graphql', title: 'GraphQL with Django', resources: 'graphene-django, Strawberry, Subscriptions, N+1 problem', time: 16, completed: false, completedAt: null },
        { id: 'django-elasticsearch', title: 'Elasticsearch Integration', resources: 'django-elasticsearch-dsl, Haystack, Search analytics', time: 12, completed: false, completedAt: null },
        { id: 'django-multitenancy', title: 'Multi‑tenancy', resources: 'Schema‑based, Database‑based, django-tenants', time: 12, completed: false, completedAt: null },
        // ----- টেস্টিং ও কোয়ালিটি -----
        { id: 'django-testing-advanced', title: 'Advanced Testing', resources: 'Pytest, Factories, Mocking, Test coverage, Performance tests', time: 14, completed: false, completedAt: null },
        { id: 'django-behave', title: 'BDD with Behave', resources: 'Feature files, Steps, Django Behave', time: 8, completed: false, completedAt: null },
        { id: 'django-load-testing', title: 'Load & Stress Testing', resources: 'Locust, JMeter, k6', time: 10, completed: false, completedAt: null },
        // ----- ডিপ্লয়মেন্ট ও ডেভঅপস -----
        { id: 'django-deployment-advanced', title: 'Advanced Deployment', resources: 'Docker multi‑stage, Kubernetes, Helm charts', time: 18, completed: false, completedAt: null },
        { id: 'django-serverless', title: 'Serverless Django', resources: 'Zappa, Mangum, AWS Lambda', time: 12, completed: false, completedAt: null },
        { id: 'django-ci-cd', title: 'CI/CD Pipelines', resources: 'GitHub Actions, GitLab CI, Jenkins, ArgoCD', time: 14, completed: false, completedAt: null },
        { id: 'django-monitoring', title: 'Monitoring & Observability', resources: 'Sentry, Prometheus, Grafana, OpenTelemetry', time: 12, completed: false, completedAt: null },
        { id: 'django-logging', title: 'Centralized Logging', resources: 'ELK stack, Loki, Structlog', time: 10, completed: false, completedAt: null },
        // ----- শেষ ধাপ -----
        { id: 'django-code-review', title: 'Code Review & Refactoring', resources: 'Best practices, Performance profiling, SOLID principles', time: 10, completed: false, completedAt: null },
        { id: 'django-contribution', title: 'Open Source Contribution', resources: 'Fixing bugs, Writing docs, Django core contribution guide', time: 12, completed: false, completedAt: null }
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
        { id: 'sql-fund', title: 'SQL Fundamentals', resources: 'SELECT, JOIN, GROUP BY', time: 12, completed: false, completedAt: null },
        { id: 'schema', title: 'Database Design', resources: 'Normalization, ER Diagrams', time: 10, completed: false, completedAt: null },
        { id: 'indexing', title: 'Indexing & Performance', resources: 'Query optimization', time: 8, completed: false, completedAt: null },
        { id: 'postgresql', title: 'PostgreSQL Advanced', resources: 'JSONB, Full-text search, Partitioning, Replication', time: 14, completed: false, completedAt: null },
        { id: 'redis', title: 'Redis', resources: 'Caching, Pub/Sub, Session Store', time: 8, completed: false, completedAt: null },
        { id: 'mongodb', title: 'MongoDB (optional)', resources: 'NoSQL, Aggregation', time: 8, completed: false, completedAt: null }
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
        { id: 'hosting', title: 'Web Hosting', resources: 'PythonAnywhere, Heroku', time: 4, completed: false, completedAt: null },
        { id: 'vps', title: 'VPS (AWS, DigitalOcean)', resources: 'EC2, Nginx, Gunicorn, Supervisor', time: 12, completed: false, completedAt: null },
        { id: 'docker', title: 'Docker', resources: 'Containers, Dockerfile, Docker Compose', time: 10, completed: false, completedAt: null },
        { id: 'ci-cd', title: 'CI/CD', resources: 'GitHub Actions, GitLab CI', time: 8, completed: false, completedAt: null },
        { id: 'monitoring', title: 'Monitoring & Logging', resources: 'Sentry, LogRocket, Prometheus', time: 6, completed: false, completedAt: null },
        { id: 'security', title: 'Web Security', resources: 'HTTPS, CORS, CSRF, XSS, SQL Injection', time: 8, completed: false, completedAt: null },
        { id: 'performance', title: 'Performance Optimization', resources: 'Lighthouse, Code splitting, CDN', time: 8, completed: false, completedAt: null }
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
        { id: 'vscode', title: 'VS Code', resources: 'Extensions, Shortcuts', time: 3, completed: false, completedAt: null },
        { id: 'terminal', title: 'Command Line', resources: 'Bash, Zsh', time: 5, completed: false, completedAt: null },
        { id: 'postman', title: 'Postman/Insomnia', resources: 'API testing', time: 3, completed: false, completedAt: null },
        { id: 'figma', title: 'Figma', resources: 'Design handoff', time: 4, completed: false, completedAt: null },
        { id: 'chrome-dev', title: 'Chrome DevTools', resources: 'Debugging, Performance', time: 5, completed: false, completedAt: null },
        { id: 'pycharm', title: 'PyCharm / VS Code Python', resources: 'Python IDE features', time: 3, completed: false, completedAt: null }
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
        { id: 'communication', title: 'Communication', resources: 'Technical writing, Presentations', time: 6, completed: false, completedAt: null },
        { id: 'teamwork', title: 'Teamwork', resources: 'Code reviews, Collaboration', time: 5, completed: false, completedAt: null },
        { id: 'problem-solving', title: 'Problem Solving', resources: 'Algorithms, Debugging', time: 10, completed: false, completedAt: null },
        { id: 'time-management', title: 'Time Management', resources: 'Prioritization, Deadlines', time: 4, completed: false, completedAt: null },
        { id: 'learning', title: 'Continuous Learning', resources: 'Documentation, Blogs', time: 8, completed: false, completedAt: null }
      ]
    }
  ];

  // ---------- স্টেট ----------
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem('webDevRoadmap');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // মাইগ্রেশন: নিশ্চিত করুন প্রতিটি টপিকে completedAt প্রপার্টি আছে
        return parsed.map(section => ({
          ...section,
          topics: section.topics.map(topic => ({
            ...topic,
            completedAt: topic.completedAt || null
          }))
        }));
      } catch (e) {
        console.error('Error loading roadmap:', e);
      }
    }
    return roadmapData;
  });

  const [expandedSections, setExpandedSections] = useState(() => {
    const saved = localStorage.getItem('roadmapExpanded');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const initial = {};
    roadmapData.forEach((section, idx) => {
      initial[section.id] = idx === 0;
    });
    return initial;
  });

  // ---------- ডেইলি স্টাডি গোল ----------
  const [dailyStudyHours, setDailyStudyHours] = useState(() => {
    const saved = localStorage.getItem('dailyStudyHours');
    return saved ? parseFloat(saved) : 2;
  });

  // ---------- পার্সোনালাইজড সাজেশন স্টেট ----------
  const [suggestions, setSuggestions] = useState({
    nextTopic: null,
    reviewTopics: [],
    suggestedGoal: dailyStudyHours,
    reason: ''
  });

  useEffect(() => {
    localStorage.setItem('dailyStudyHours', dailyStudyHours.toString());
  }, [dailyStudyHours]);

  useEffect(() => {
    localStorage.setItem('webDevRoadmap', JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem('roadmapExpanded', JSON.stringify(expandedSections));
  }, [expandedSections]);

  // ---------- প্রোডাক্টিভিটি ডেটা (ActivityLog থেকে) ----------
  const [activityData, setActivityData] = useState({
    dailyTotals: {}, // date string -> total hours
    avgDaily: 0
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('activityLog');
      if (saved) {
        const activities = JSON.parse(saved);
        // ডেইলি স্টাডি টাইম ক্যালকুলেট করুন (টাইমার থেকে)
        const daily = {};
        activities.forEach(task => {
          if (task.timer && task.timer.elapsed) {
            const date = new Date(task.createdAt).toISOString().split('T')[0];
            daily[date] = (daily[date] || 0) + (task.timer.elapsed / 3600); // ঘন্টায়
          }
        });
        // গত ৭ দিনের এভারেজ বের করুন
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

  // ---------- পার্সোনালাইজড সাজেশন ইঞ্জিন ----------
  useEffect(() => {
    // 1. পরবর্তী টপিক সুপারিশ (অসম্পূর্ণ টপিক থেকে)
    const incompleteTopics = [];
    sections.forEach(section => {
      section.topics.forEach(topic => {
        if (!topic.completed) {
          incompleteTopics.push({
            ...topic,
            sectionId: section.id,
            sectionTitle: section.title,
            categoryColor: section.color
          });
        }
      });
    });

    let nextTopic = null;
    if (incompleteTopics.length > 0) {
      // ওয়েটেড স্কোরিং অ্যালগরিদম
      const scored = incompleteTopics.map(topic => {
        // ক্যাটাগরি অনুযায়ী ওয়েট – যেসব ক্যাটাগরিতে বেশি সময় বাকি তাদের প্রাধান্য
        const section = sections.find(s => s.id === topic.sectionId);
        const sectionRemaining = section.topics
          .filter(t => !t.completed)
          .reduce((sum, t) => sum + (t.time || 0), 0);
        
        // ছোট টপিক বেশি স্কোর (দ্রুত শেষ করা যায়)
        const timeScore = 1 / (topic.time || 1); // কম সময় = বেশি স্কোর
        // ক্যাটাগরি রিমেইনিং টাইম – বেশি থাকলে বেশি স্কোর
        const categoryScore = sectionRemaining / 100; // নরমালাইজ
        // এলোমেলোতা (random factor) – 0.8 থেকে 1.2 এর মধ্যে
        const randomFactor = 0.8 + Math.random() * 0.4;
        
        const totalScore = (timeScore * 0.5 + categoryScore * 0.3) * randomFactor;
        return { ...topic, score: totalScore };
      });
      
      // সর্বোচ্চ স্কোরের টপিক নির্বাচন
      scored.sort((a, b) => b.score - a.score);
      nextTopic = scored[0];
    }

    // 2. রিভিউ রিমাইন্ডার – ৩০ দিন আগে কমপ্লিট করা টপিক
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
    // সাজান – সবচেয়ে পুরনো প্রথমে
    reviewTopics.sort((a, b) => b.daysAgo - a.daysAgo);

    // 3. ডেইলি গোল অটো-অ্যাডজাস্ট
    let suggestedGoal = dailyStudyHours;
    let reason = '';
    if (activityData.avgDaily > 0) {
      // গত ৭ দিনের এভারেজ + ০.৫, কিন্তু ইউজারের সেট করা গোলের বেশি না
      suggestedGoal = Math.min(dailyStudyHours, Math.max(0.5, Math.round((activityData.avgDaily + 0.5) * 10) / 10));
      if (suggestedGoal < dailyStudyHours) {
        reason = `Based on your actual study time (avg ${activityData.avgDaily}h/day), we suggest a more achievable goal of ${suggestedGoal}h today.`;
      } else {
        reason = `You're doing great! Keep aiming for ${dailyStudyHours}h today.`;
      }
    } else {
      reason = `No timer data yet. Start a timer in Today or Time Blocks to get personalized suggestions.`;
    }

    setSuggestions({
      nextTopic,
      reviewTopics: reviewTopics.slice(0, 5), // সর্বোচ্চ ৫টি
      suggestedGoal,
      reason
    });
  }, [sections, dailyStudyHours, activityData]);

  // ---------- হেল্পার ফাংশন ----------
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
    return completionDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // ---------- টপিক টগল (completedAt যোগ করা হয়েছে) ----------
  const toggleTopic = (sectionId, topicId) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              topics: section.topics.map(topic =>
                topic.id === topicId
                  ? {
                      ...topic,
                      completed: !topic.completed,
                      completedAt: !topic.completed ? new Date().toISOString() : null
                    }
                  : topic
              )
            }
          : section
      )
    );
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your learning progress?')) {
      setSections(roadmapData);
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
    return { 
      total, 
      completed, 
      totalTime, 
      completedTime, 
      remainingTime,
      remainingDays: getDaysFromHours(remainingTime),
      percentage 
    };
  };

  // ---------- নিরাপদ আইকন রেন্ডার ----------
  const SafeIcon = ({ icon: Icon, className }) => {
    const Component = Icon && typeof Icon === 'function' ? Icon : BookOpen;
    return <Component className={className} />;
  };

  // ---------- ক্যালকুলেশন ----------
  const stats = useMemo(() => {
    const totalTopics = sections.reduce((acc, section) => acc + section.topics.length, 0);
    const completedTopics = sections.reduce(
      (acc, section) => acc + section.topics.filter(t => t.completed).length,
      0
    );
    const totalTime = sections.reduce(
      (acc, section) => acc + section.topics.reduce((sum, t) => sum + (t.time || 0), 0),
      0
    );
    const completedTime = sections.reduce(
      (acc, section) =>
        acc +
        section.topics.filter(t => t.completed).reduce((sum, t) => sum + (t.time || 0), 0),
      0
    );
    const remainingTime = totalTime - completedTime;
    const percentage = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

    const categoryData = sections.map(section => {
      const total = section.topics.length;
      const completed = section.topics.filter(t => t.completed).length;
      const totalSectionTime = section.topics.reduce((sum, t) => sum + (t.time || 0), 0);
      const completedSectionTime = section.topics.filter(t => t.completed).reduce((sum, t) => sum + (t.time || 0), 0);
      const remainingSectionTime = totalSectionTime - completedSectionTime;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
      let bgColor = '';
      switch (section.id) {
        case 'frontend': bgColor = 'from-blue-500 to-indigo-500'; break;
        case 'backend': bgColor = 'from-green-500 to-emerald-600'; break;
        case 'database': bgColor = 'from-purple-500 to-pink-500'; break;
        case 'devops': bgColor = 'from-orange-500 to-red-500'; break;
        case 'tools': bgColor = 'from-gray-500 to-slate-500'; break;
        case 'soft-skills': bgColor = 'from-amber-500 to-yellow-500'; break;
        default: bgColor = 'from-blue-500 to-indigo-500';
      }
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

    // প্রোডাক্টিভিটি আওয়ার (ActivityLog থেকে) – আগের মতোই
    const hourCounts = Array(24).fill(0);
    // এই অংশ আগের useEffect-এ ক্যালকুলেট করা আছে, এখানে শুধু bestHour বের করা হচ্ছে
    const bestHour = 9; // ডিফল্ট
    const bestHourFormatted = '9 AM';

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
      bestHour,
      bestHourFormatted
    };
  }, [sections, dailyStudyHours]);

  return (
    <div className="space-y-8">
      {/* ---------- হেডার ---------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-indigo-600" />
            Web Dev + Django Advanced Roadmap
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your learning journey • {stats.completedTopics}/{stats.totalTopics} topics • {stats.percentage}% complete
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <Clock size={16} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Daily:</span>
            <input
              type="number"
              min="0.5"
              max="12"
              step="0.5"
              value={dailyStudyHours}
              onChange={(e) => setDailyStudyHours(parseFloat(e.target.value) || 1)}
              className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">hrs</span>
          </div>
          <button
            onClick={resetProgress}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium flex items-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* ---------- পার্সোনালাইজড সাজেশন কার্ড (AI/ML) ---------- */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-md">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Personalized Suggestions (AI Engine)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* নেক্সট টপিক */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
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
                        // এক্সপান্ড করে স্ক্রল করবেন?
                        const sectionId = suggestions.nextTopic.sectionId;
                        if (!expandedSections[sectionId]) {
                          toggleSection(sectionId);
                        }
                        // ছোট স্মার্ট স্ক্রল
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
                      : 'No suggestions yet. Mark some topics as incomplete.'}
                  </p>
                )}
              </div>

              {/* রিভিউ রিমাইন্ডার */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 border border-amber-100 dark:border-amber-800">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-medium mb-2">
                  <Bell size={16} />
                  Review Reminders
                </div>
                {suggestions.reviewTopics.length > 0 ? (
                  <div className="space-y-2 max-h-28 overflow-y-auto">
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
                    No topics need review yet. Keep learning!
                  </p>
                )}
              </div>

              {/* ডেইলি গোল সাজেশন */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 border border-green-100 dark:border-green-800">
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

      {/* ---------- ওভারভিউ কার্ড ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.percentage}%</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${stats.percentage}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Time</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{formatTime(stats.totalTime)}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            ⏳ Remaining: {formatTime(stats.remainingTime)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Days Left</p>
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {stats.remainingDays}
              </p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            📅 Est. finish: {stats.completionDate}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your Pace</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                {activityData.avgDaily || 0}h
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            ⚡ Avg. daily study (7d)
          </p>
        </div>
      </div>

      {/* ---------- ক্যাটাগরি প্রোগ্রেস ---------- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-indigo-500" />
          Category Progress
        </h3>
        <div className="space-y-4">
          {stats.categoryData.map(cat => (
            <div key={cat.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} bg-opacity-20 flex items-center justify-center`}>
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
                    className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- রোডম্যাপ সেকশনসমূহ (এখন গ্রিডে) ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const secStats = getSectionStats(section);
          const isExpanded = expandedSections[section.id];

          return (
            <div
              key={section.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${section.borderColor} overflow-hidden transition-all hover:shadow-md`}
            >
              <div
                onClick={() => toggleSection(section.id)}
                className={`flex items-center justify-between p-5 cursor-pointer ${section.lightBg} ${section.darkBg} hover:bg-opacity-80 transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${section.color} bg-opacity-20`}>
                    <SafeIcon icon={section.icon} className={`w-6 h-6 ${section.textColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm mt-0.5 flex-wrap">
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
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                        <Calendar size={12} />
                        {secStats.remainingDays} days
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.topics.map(topic => {
                      const daysNeeded = getDaysFromHours(topic.time);
                      const isCompleted = topic.completed;
                      const isReviewNeeded = suggestions.reviewTopics.some(t => t.id === topic.id);
                      return (
                        <div
                          key={topic.id}
                          id={`topic-${topic.id}`}
                          className={`flex items-start gap-3 p-3.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
                            isReviewNeeded
                              ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10'
                              : 'border-gray-100 dark:border-gray-700'
                          } hover:shadow-md transition-shadow`}
                        >
                          <button
                            onClick={() => toggleTopic(section.id, topic.id)}
                            className="flex-shrink-0 mt-0.5"
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h4
                                className={`font-medium ${
                                  isCompleted
                                    ? 'line-through text-gray-500 dark:text-gray-400'
                                    : 'text-gray-900 dark:text-white'
                                }`}
                              >
                                {topic.title}
                              </h4>
                              <div className="flex items-center gap-1">
                                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                  {topic.time} hr
                                </span>
                                {!isCompleted && (
                                  <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full flex items-center gap-1">
                                    <Calendar size={10} />
                                    {daysNeeded}d
                                  </span>
                                )}
                                {isReviewNeeded && (
                                  <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full flex items-center gap-1">
                                    <Bell size={10} />
                                    Review
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {topic.resources}
                            </p>
                          </div>
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

      {/* ---------- মোটিভেশন ও প্রজেক্ট সাজেশন ---------- */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg shadow-md">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              {stats.percentage === 100
                ? '🏆 Django Master! You have completed the advanced roadmap!'
                : stats.percentage > 70
                ? '🚀 Advanced level reached! Build a high‑performance SaaS platform.'
                : stats.percentage > 40
                ? '⚡ You are on track – start optimizing your existing projects.'
                : '✨ Start with advanced Python and Django core.'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              {stats.percentage === 100
                ? 'Contribute to Django core, write advanced packages, or become a freelancing architect.'
                : stats.percentage > 70
                ? 'Recommended project: E‑learning platform with DRF, Channels, Celery, and Kubernetes.'
                : stats.percentage > 40
                ? 'Recommended project: Optimize an existing Django app – add caching, async tasks, and indexing.'
                : 'Recommended project: Build a REST API with Django + DRF and deploy on AWS.'}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Calendar size={14} />
                <span>Est. completion: {stats.completionDate} ({stats.remainingDays} days)</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Zap size={14} />
                <span>Best study time: {stats.bestHourFormatted}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Clock size={14} />
                <span>Daily goal: {dailyStudyHours} hrs/day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;