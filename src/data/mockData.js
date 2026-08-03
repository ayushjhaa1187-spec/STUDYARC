export const INITIAL_USER = {
  name: "Alex Rivera",
  role: "learner",
  title: "AI & Full-Stack Aspirant",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  readinessScore: 72,
  metrics: {
    projectsShipped: 4,
    hoursExecuted: 128,
    mentorReviews: 6,
    verifiedProofs: 3,
  },
  xp: 3450,
  level: 14,
  nextLevelXp: 4000,
  streak: 12,
  agentStatus: "Online",
  weeklyAvailabilityHours: 18,
  goals: ["Secure AI Internship by Q4", "Ship 2 Agentic Web Applications", "Pass Expert Code Verification"],
  plan: "Pro Tier",
  privacy: {
    githubAccess: true,
    codeInspection: true,
    dataSharing: false,
  }
};

export const INITIAL_MENTOR_USER = {
  name: "Dr. Alex Chen",
  role: "mentor",
  title: "Ex-Google Staff AI Engineer",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  metrics: {
    reviewsCompleted: 45,
    studentsHelped: 30,
    averageRating: 4.98
  },
  payoutBalance: 1250,
  upcomingSessions: 3,
};

export const INITIAL_ADMIN_USER = {
  name: "Admin Super",
  role: "admin",
  title: "Platform Administrator",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  metrics: {
    totalUsers: 1420,
    activeMentors: 45,
    revenue: 15400
  }
};

export const AGENT_ACTIVITY_LOG = [
  { id: 1, action: "Adjusted your execution plan", detail: "Added PyTorch optimization sprint based on your recent code diagnostic.", time: "10 mins ago", type: "plan" },
  { id: 2, action: "Suggested a mentor review", detail: "Matched Dr. Alex Chen for your Multi-Agent Orchestrator codebase.", time: "1 hour ago", type: "mentor" },
  { id: 3, action: "Reviewed your code submission", detail: "AI check passed (94% test coverage, 0 critical lint errors).", time: "3 hours ago", type: "code" },
  { id: 4, action: "Verified project milestone", detail: "RAG Pipeline v2 verified & ready for portfolio showcase.", time: "Yesterday", type: "verify" },
];

export const UPCOMING_SESSIONS = [
  {
    id: 1,
    mentorName: "Dr. Alex Chen",
    mentorRole: "Ex-Google Staff AI Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    topic: "Multi-Agent System Code Review & Architecture Roast",
    date: "Today, 5:30 PM",
    duration: "45 mins",
    type: "Code Review",
    status: "Confirmed",
    link: "https://meet.google.com/xyz-abc-def"
  },
  {
    id: 2,
    mentorName: "Priya Sharma",
    mentorRole: "Senior Full-Stack Lead @ Stripe",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    topic: "Mock Technical Interview & System Design",
    date: "Aug 5, 4:00 PM",
    duration: "60 mins",
    type: "Mock Interview",
    status: "Scheduled",
    link: "https://meet.google.com/uvw-xyz-rst"
  }
];

export const JOURNEYS = [
  {
    id: "ai-internship",
    title: "AI Internship Portfolio Sprint",
    tagline: "Build & ship 2 production-grade AI agent systems with verified code reviews.",
    category: "AI & ML",
    duration: "30 Days",
    difficulty: "Advanced",
    timeCommitment: "15-20 hrs/week",
    outcome: "2 Verified Portfolio Projects + 3 Expert Reviews",
    enrolledCount: 1420,
    rating: 4.9,
    badge: "Most Popular",
    phases: [
      { step: 1, name: "Discover", desc: "Identify high-value AI problem statement & dataset selection." },
      { step: 2, name: "Learn", desc: "Deep dive into LangChain, LlamaIndex, & Agentic Tool Calling." },
      { step: 3, name: "Build", desc: "Construct full-stack dashboard with real-time streaming LLM UI." },
      { step: 4, name: "Review", desc: "Automated Gemini code audit + 1-on-1 Senior AI Mentor review." },
      { step: 5, name: "Publish", desc: "Deploy to Vercel/Cloudflare with live verified evidence badge." }
    ],
    challenges: [
      "Autonomous Web Scraping Agent with Error Fallbacks",
      "Multi-Agent Code Refactoring & Testing Workbench",
      "Vector DB RAG Pipeline with Hybrid Search"
    ]
  },
  {
    id: "fullstack-job-ready",
    title: "Full-Stack Job-Ready Sprint",
    tagline: "Master modern Next.js 14, Node microservices, and database optimization.",
    category: "Web Dev",
    duration: "45 Days",
    difficulty: "Intermediate",
    timeCommitment: "12-15 hrs/week",
    outcome: "1 Scalable Enterprise Web App + Verified System Design",
    enrolledCount: 2150,
    rating: 4.85,
    badge: "Job Guarantee Path",
    phases: [
      { step: 1, name: "Discover", desc: "System architecture blueprinting & API schema design." },
      { step: 2, name: "Learn", desc: "TypeScript strict mode, Next.js App Router, Prisma ORM." },
      { step: 3, name: "Build", desc: "Implement auth, payment webhooks, and Redis caching." },
      { step: 4, name: "Review", desc: "Security audit & load testing under 10k virtual users." },
      { step: 5, name: "Publish", desc: "Ship to production & link verified proof to LinkedIn." }
    ],
    challenges: [
      "Real-time Distributed Messaging System",
      "Stripe Subscription & Webhook Processing Engine",
      "Role-Based Access Control (RBAC) Security System"
    ]
  },
  {
    id: "data-analyst-sprint",
    title: "Data Analyst Job-Ready Sprint",
    tagline: "Turn messy enterprise datasets into executive dashboards & automated insights.",
    category: "Data Science",
    duration: "30 Days",
    difficulty: "Beginner-Intermediate",
    timeCommitment: "10-12 hrs/week",
    outcome: "2 Tableau/PowerBI Executive Dashboards + Python ETL Pipeline",
    enrolledCount: 980,
    rating: 4.92,
    badge: "High Hiring Demand",
    phases: [
      { step: 1, name: "Discover", desc: "Formulate business hypotheses and data collection plan." },
      { step: 2, name: "Learn", desc: "Advanced SQL queries, pandas transformations, seaborn vis." },
      { step: 3, name: "Build", desc: "Automate daily data pipeline with Airflow & PostgreSQL." },
      { step: 4, name: "Review", desc: "Expert feedback from Lead Data Scientist." },
      { step: 5, name: "Publish", desc: "Publish interactive web dashboard portfolio." }
    ],
    challenges: [
      "E-Commerce Customer Churn Prediction & Cohort Analysis",
      "Financial Fraud Detection SQL & Python Audit",
      "Executive SaaS KPI Dashboard with Real-Time Metrics"
    ]
  }
];

export const DAILY_TASKS = [
  { id: 1, title: "Implement vector search chunking strategy in RAG pipeline", journey: "AI Internship Portfolio Sprint", estimate: "45 mins", difficulty: "Hard", completed: true, dueTime: "2:00 PM" },
  { id: 2, title: "Connect Gemini Flash streaming endpoint to React Frontend", journey: "AI Internship Portfolio Sprint", estimate: "30 mins", difficulty: "Medium", completed: false, dueTime: "4:30 PM" },
  { id: 3, title: "Submit pull request for automated unit testing (80%+ coverage)", journey: "AI Internship Portfolio Sprint", estimate: "20 mins", difficulty: "Easy", completed: false, dueTime: "6:00 PM" },
  { id: 4, title: "Schedule 30-min preparation sync for Dr. Alex Chen session", journey: "General Execution", estimate: "10 mins", difficulty: "Easy", completed: true, dueTime: "11:00 AM" },
];

export const MENTORS = [
  {
    id: "alex-chen",
    name: "Dr. Alex Chen",
    role: "Ex-Google Staff AI Engineer",
    company: "Anthropic / Ex-Google",
    expertise: ["AI Agents", "LLM Fine-tuning", "RAG Systems", "Python"],
    rating: 4.98,
    reviewCount: 142,
    price: 499,
    nextSlot: "Today, 5:30 PM",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "10+ years in AI research and production deployments. Helped 150+ engineers land top tier AI roles at OpenAI, Google, and Scale AI.",
    testimonials: [
      { name: "Siddharth M.", comment: "Alex's feedback on my agent loop saved me weeks of debugging. Landed my dream AI role!", rating: 5 },
      { name: "Jessica T.", comment: "Direct, highly technical, and extremely encouraging. Worth 10x the session price.", rating: 5 }
    ]
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    role: "Senior Full-Stack Lead",
    company: "Stripe",
    expertise: ["Next.js", "System Design", "TypeScript", "Node.js"],
    rating: 4.95,
    reviewCount: 98,
    price: 499,
    nextSlot: "Tomorrow, 2:00 PM",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    bio: "Specializing in high-throughput distributed systems and crisp frontend architecture. Passionate about developer mentorship.",
    testimonials: [
      { name: "Rohan V.", comment: "Priya's system design mock interview gave me the exact confidence boost I needed for Stripe.", rating: 5 }
    ]
  },
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "Principal Data Scientist",
    company: "Databricks",
    expertise: ["Python ETL", "PyTorch", "Data Pipelines", "SQL"],
    rating: 4.91,
    reviewCount: 84,
    price: 599,
    nextSlot: "Aug 6, 11:00 AM",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Data architecture veteran. Passionate about helping analysts transition into full Lead Data Science roles.",
    testimonials: [
      { name: "Ananya K.", comment: "Incredible guidance on building production SQL pipelines. Highly recommended!", rating: 5 }
    ]
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Director of Product",
    company: "Linear",
    expertise: ["Product Strategy", "SaaS UX", "Portfolio Review", "Hiring"],
    rating: 4.97,
    reviewCount: 110,
    price: 699,
    nextSlot: "Aug 7, 6:00 PM",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    bio: "Product leader behind sleek developer toolings. Will turn your technical projects into compelling product case studies.",
    testimonials: [
      { name: "David L.", comment: "Transformed my raw code portfolio into an executive-ready product demo.", rating: 5 }
    ]
  }
];

export const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: "Agentic AI Task Execution Engine",
    isFeatured: true,
    techStack: ["React", "Python", "Gemini API", "FastAPI", "TailwindCSS"],
    description: "Autonomous agent system that breaks down complex user goals into executable subtasks with self-healing code execution.",
    githubUrl: "https://github.com/alexrivera/agentic-task-engine",
    liveDemoUrl: "https://agentic-task-engine.vercel.app",
    status: "Verified",
    verificationBadge: "AI Audit & Human Mentor Approved",
    mentorReviewSummary: "Approved by Dr. Alex Chen (Ex-Google). Exceptional error handling, clean prompt separation, and high test coverage.",
    timeline: [
      { step: "Project Submitted", date: "Jul 18, 2026", done: true },
      { step: "AI Automated Code Check Passed", date: "Jul 19, 2026", done: true },
      { step: "Mentor Review Completed", date: "Jul 22, 2026", done: true },
      { step: "Verified Proof Badge Issued", date: "Jul 23, 2026", done: true },
      { step: "Shared on SkillBridge Network", date: "Jul 24, 2026", done: true }
    ]
  },
  {
    id: 2,
    title: "Distributed RAG Vector Knowledge Base",
    isFeatured: false,
    techStack: ["PyTorch", "Qdrant", "Docker", "LangChain"],
    description: "High-speed document retrieval system capable of indexing 100k+ PDF pages with hybrid keyword & semantic search.",
    githubUrl: "https://github.com/alexrivera/rag-vector-kb",
    liveDemoUrl: "https://rag-vector-kb.demo.com",
    status: "Verified",
    verificationBadge: "AI Verified",
    mentorReviewSummary: "Automated test suite passed 100%. Verified sub-50ms latency response across 50 test queries.",
    timeline: [
      { step: "Project Submitted", date: "Jul 10, 2026", done: true },
      { step: "AI Automated Code Check Passed", date: "Jul 11, 2026", done: true },
      { step: "Verified Proof Badge Issued", date: "Jul 12, 2026", done: true }
    ]
  },
  {
    id: 3,
    title: "Real-time Multi-User Analytics Dashboard",
    isFeatured: false,
    techStack: ["Next.js 14", "WebSockets", "TailwindCSS", "PostgreSQL"],
    description: "SaaS telemetry interface displaying live traffic spikes, conversion funnels, and error trace graphs.",
    githubUrl: "https://github.com/alexrivera/realtime-analytics",
    liveDemoUrl: "https://analytics-demo.vercel.app",
    status: "In Review",
    verificationBadge: "Under Mentor Audit",
    mentorReviewSummary: "Currently scheduled for code review with Priya Sharma on Aug 5.",
    timeline: [
      { step: "Project Submitted", date: "Aug 1, 2026", done: true },
      { step: "AI Automated Code Check Passed", date: "Aug 1, 2026", done: true },
      { step: "Mentor Review Scheduled", date: "Aug 5, 2026", done: false }
    ]
  }
];

export const COMMUNITY_THREADS = [
  {
    id: 1,
    title: "How do you prevent cyclic fallback loops in LangChain multi-agent orchestration?",
    author: "Karan Mehta",
    authorRole: "Student @ IIT Bombay",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    tags: ["AI Agents", "LangChain", "Python"],
    upvotes: 42,
    status: "Answered",
    snippet: "Set an explicit max_iterations limit in the AgentExecutor and implement a supervisor evaluator node that breaks cycles if state doesn't mutate...",
    aiAnswer: "To prevent infinite loops in multi-agent graphs: 1. Introduce a recursion_limit in graph state. 2. Implement a Guardrail Evaluator node to check state diffs between iterations.",
    humanAnswersCount: 4,
    hasAcceptedSolution: true,
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    title: "Next.js 14 Server Actions vs API Routes for streaming LLM responses",
    author: "Sarah Jenkins",
    authorRole: "Frontend Dev",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    tags: ["Next.js", "React", "Streaming"],
    upvotes: 29,
    status: "Verified Solution",
    snippet: "Use Route Handlers (`app/api/chat/route.ts`) with `createDataStreamResponse` from `ai` package for stable ReadableStream handling.",
    aiAnswer: "Route Handlers provide better control over HTTP headers like `Content-Type: text/event-stream` compared to Server Actions.",
    humanAnswersCount: 6,
    hasAcceptedSolution: true,
    timeAgo: "5 hours ago"
  },
  {
    id: 3,
    title: "Looking for code review on my Qdrant Hybrid Search indexing pipeline",
    author: "Vikram R.",
    authorRole: "Data Science Learner",
    authorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    tags: ["Qdrant", "VectorDB", "Python"],
    upvotes: 18,
    status: "Open",
    snippet: "I'm combining dense embeddings (BGE-large) with sparse BM25 vectors. Getting higher latency than expected. Any quick optimization tips?",
    aiAnswer: "Check if your BM25 tokenizer is recalculating inverted index in-memory during query time. Pre-index sparse payloads in Qdrant payload filters.",
    humanAnswersCount: 2,
    hasAcceptedSolution: false,
    timeAgo: "1 day ago"
  }
];

export const LEADERBOARD = [
  { rank: 1, name: "Rahul Verma", score: "4,890 XP", projects: 8, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" },
  { rank: 2, name: "Alex Rivera (You)", score: "3,450 XP", projects: 4, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
  { rank: 3, name: "Sophia Martinez", score: "3,120 XP", projects: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
  { rank: 4, name: "Devansh Patel", score: "2,840 XP", projects: 3, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80" },
];
