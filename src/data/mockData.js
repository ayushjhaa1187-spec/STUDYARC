// ============================================================
// SkillBridge Pro — Comprehensive Mock Data
// All data is realistic placeholder data for UI/UX development.
// Ready to swap for real API calls.
// ============================================================

// ── User Profiles ─────────────────────────────────────────────
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
  currentPath: "AI Internship Portfolio Sprint",
  completedCourses: ["intro-python", "ml-fundamentals", "react-masterclass"],
  enrolledCourses: ["langchain-agents", "system-design-mastery"],
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

// ── Agent Activity ─────────────────────────────────────────────
export const AGENT_ACTIVITY_LOG = [
  { id: 1, action: "Adjusted execution plan", detail: "Added PyTorch optimization sprint based on your recent code diagnostic.", time: "10 mins ago", type: "plan" },
  { id: 2, action: "Suggested mentor review", detail: "Matched Dr. Alex Chen for your Multi-Agent Orchestrator codebase.", time: "1 hour ago", type: "mentor" },
  { id: 3, action: "Code submission reviewed", detail: "AI check passed — 94% test coverage, 0 critical lint errors.", time: "3 hours ago", type: "code" },
  { id: 4, action: "Project milestone verified", detail: "RAG Pipeline v2 verified & ready for portfolio showcase.", time: "Yesterday", type: "verify" },
  { id: 5, action: "New course recommended", detail: "LangChain Agents Bootcamp matches your Q4 AI internship goal.", time: "2 days ago", type: "plan" },
];

// ── Sessions ───────────────────────────────────────────────────
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

// ── Journeys (Career Paths) ────────────────────────────────────
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
    requiredCourses: ["intro-python", "ml-fundamentals", "langchain-agents"],
    capstonePropject: "Autonomous AI Research Assistant",
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
    requiredCourses: ["react-masterclass", "node-backend", "system-design-mastery"],
    capstoneProject: "Multi-tenant SaaS Platform",
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
    requiredCourses: ["data-analysis-python", "sql-mastery", "data-visualization"],
    capstoneProject: "Enterprise Analytics Dashboard",
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
  },
  {
    id: "product-manager-sprint",
    title: "Product Manager Career Sprint",
    tagline: "Build a PM portfolio with case studies, roadmaps, and user research artifacts.",
    category: "Product",
    duration: "35 Days",
    difficulty: "Intermediate",
    timeCommitment: "10-12 hrs/week",
    outcome: "3 PM Case Studies + Product Strategy Document",
    enrolledCount: 640,
    rating: 4.88,
    badge: "New Path",
    requiredCourses: ["product-strategy", "ux-research", "growth-metrics"],
    capstoneProject: "Zero-to-One Product Pitch Deck",
    phases: [
      { step: 1, name: "Discover", desc: "User research, competitive analysis, and problem framing." },
      { step: 2, name: "Learn", desc: "PRDs, roadmap prioritization, OKR frameworks." },
      { step: 3, name: "Build", desc: "Create 3 full case studies with metrics and outcomes." },
      { step: 4, name: "Review", desc: "Portfolio review by senior PM from a top tech company." },
      { step: 5, name: "Publish", desc: "Publish on Notion + share in PM communities." }
    ],
    challenges: [
      "Feature Prioritization Using RICE Framework",
      "User Interview & Synthesis Report",
      "Go-to-Market Strategy for a B2B SaaS Product"
    ]
  },
  {
    id: "devops-cloud-sprint",
    title: "DevOps & Cloud Engineer Sprint",
    tagline: "Get AWS/GCP certified, deploy microservices, and automate CI/CD pipelines.",
    category: "DevOps",
    duration: "40 Days",
    difficulty: "Advanced",
    timeCommitment: "15-18 hrs/week",
    outcome: "AWS Architect Associate Cert Prep + Production Kubernetes Cluster",
    enrolledCount: 520,
    rating: 4.81,
    badge: "High Salary Path",
    requiredCourses: ["docker-kubernetes", "aws-fundamentals", "cicd-automation"],
    capstoneProject: "Multi-Region Kubernetes Deployment",
    phases: [
      { step: 1, name: "Discover", desc: "Map existing infra gaps and cloud cost optimization opportunities." },
      { step: 2, name: "Learn", desc: "Docker, Kubernetes, Terraform, GitHub Actions CI/CD." },
      { step: 3, name: "Build", desc: "Deploy a 3-tier app on EKS with auto-scaling and monitoring." },
      { step: 4, name: "Review", desc: "Infrastructure code review by Senior DevOps engineer." },
      { step: 5, name: "Publish", desc: "Publish architecture diagram & IaC code to GitHub." }
    ],
    challenges: [
      "Zero-Downtime Deployment with Blue-Green Strategy",
      "Kubernetes HPA & Resource Limit Tuning",
      "Multi-Account AWS Landing Zone with Terraform"
    ]
  }
];

// ── Daily Tasks ────────────────────────────────────────────────
export const DAILY_TASKS = [
  { id: 1, title: "Implement vector search chunking strategy in RAG pipeline", journey: "AI Internship Portfolio Sprint", estimate: "45 mins", difficulty: "Hard", completed: true, dueTime: "2:00 PM" },
  { id: 2, title: "Connect Gemini Flash streaming endpoint to React Frontend", journey: "AI Internship Portfolio Sprint", estimate: "30 mins", difficulty: "Medium", completed: false, dueTime: "4:30 PM" },
  { id: 3, title: "Submit pull request for automated unit testing (80%+ coverage)", journey: "AI Internship Portfolio Sprint", estimate: "20 mins", difficulty: "Easy", completed: false, dueTime: "6:00 PM" },
  { id: 4, title: "Schedule 30-min preparation sync for Dr. Alex Chen session", journey: "General Execution", estimate: "10 mins", difficulty: "Easy", completed: true, dueTime: "11:00 AM" },
];

// ── Courses (15 total) ─────────────────────────────────────────
export const COURSES = [
  {
    id: "intro-python",
    slug: "intro-python",
    title: "Python for Everyone",
    subtitle: "Master Python from basics to OOP and data structures",
    instructor: "Dr. Priya Nair",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    instructorBio: "PhD in CS from IIT Delhi. 10+ years teaching Python to 50k+ learners.",
    partner: "SkillBridge Academy",
    category: "Programming",
    type: "Course",
    difficulty: "Beginner",
    rating: 4.8,
    reviewCount: 3420,
    learnersCount: 45200,
    duration: "24 hours",
    modules: 6,
    lessons: 48,
    language: "English",
    price: 0,
    isFree: true,
    shortDescription: "Start coding with Python and build your first programs from scratch.",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80",
    skills: ["Python", "OOP", "Data Structures", "Algorithms"],
    outcomes: [
      "Write clean Python code using modern best practices",
      "Build CLI tools and automation scripts",
      "Understand OOP concepts and design patterns",
      "Handle files, APIs, and web scraping with Python"
    ],
    syllabus: [
      { module: 1, title: "Python Fundamentals", lessons: ["Variables & Types", "Control Flow", "Functions", "Quiz: Python Basics"], duration: "4h" },
      { module: 2, title: "Data Structures", lessons: ["Lists & Tuples", "Dictionaries & Sets", "Comprehensions", "Project: Task Manager CLI"], duration: "4h" },
      { module: 3, title: "OOP Concepts", lessons: ["Classes & Objects", "Inheritance", "Polymorphism", "Dunder Methods"], duration: "5h" },
      { module: 4, title: "File & API Handling", lessons: ["File I/O", "JSON & CSV", "REST APIs with requests", "Quiz: APIs"], duration: "4h" },
      { module: 5, title: "Web Scraping", lessons: ["BeautifulSoup4", "Selenium Basics", "Rate Limiting", "Project: Price Tracker"], duration: "4h" },
      { module: 6, title: "Capstone", lessons: ["Capstone Project", "Code Review", "Portfolio Submission"], duration: "3h" }
    ]
  },
  {
    id: "ml-fundamentals",
    slug: "ml-fundamentals",
    title: "Machine Learning Fundamentals",
    subtitle: "From linear regression to neural networks with scikit-learn",
    instructor: "Marcus Vance",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Principal Data Scientist @ Databricks. Former ML researcher at DeepMind.",
    partner: "Databricks Academy",
    category: "AI & ML",
    type: "Course",
    difficulty: "Intermediate",
    rating: 4.9,
    reviewCount: 2180,
    learnersCount: 28400,
    duration: "32 hours",
    modules: 8,
    lessons: 64,
    language: "English",
    price: 1999,
    isFree: false,
    shortDescription: "Build, train, and evaluate ML models using Python and scikit-learn.",
    thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&auto=format&fit=crop&q=80",
    skills: ["Machine Learning", "scikit-learn", "Pandas", "NumPy", "Model Evaluation"],
    outcomes: [
      "Implement supervised and unsupervised learning algorithms",
      "Evaluate and tune ML models for production use",
      "Build end-to-end ML pipelines with scikit-learn",
      "Understand bias-variance tradeoff and model selection"
    ],
    syllabus: [
      { module: 1, title: "ML Foundations", lessons: ["What is ML?", "Types of Learning", "Data Preprocessing", "Quiz: ML Basics"], duration: "4h" },
      { module: 2, title: "Regression", lessons: ["Linear Regression", "Polynomial Features", "Regularization", "Project: House Price Predictor"], duration: "5h" },
      { module: 3, title: "Classification", lessons: ["Logistic Regression", "Decision Trees", "Random Forests", "SVM"], duration: "5h" },
      { module: 4, title: "Clustering", lessons: ["K-Means", "DBSCAN", "Hierarchical Clustering", "Project: Customer Segments"], duration: "4h" },
      { module: 5, title: "Neural Networks", lessons: ["Perceptrons", "Backpropagation", "Keras Basics", "Quiz: NNs"], duration: "6h" },
      { module: 6, title: "Model Evaluation", lessons: ["Cross Validation", "Confusion Matrix", "ROC-AUC", "Hyperparameter Tuning"], duration: "4h" },
      { module: 7, title: "ML Pipelines", lessons: ["Pipelines with sklearn", "Feature Engineering", "Data Leakage"], duration: "4h" },
      { module: 8, title: "Capstone", lessons: ["Capstone Project", "Peer Review", "Portfolio Badge"], duration: "0h" }
    ]
  },
  {
    id: "langchain-agents",
    slug: "langchain-agents",
    title: "LangChain & AI Agents Bootcamp",
    subtitle: "Build production-grade autonomous agents with LangChain and Gemini",
    instructor: "Dr. Alex Chen",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Ex-Google Staff AI Engineer. Pioneered agentic AI deployments at scale.",
    partner: "Anthropic Academy",
    category: "AI & ML",
    type: "Specialization",
    difficulty: "Advanced",
    rating: 4.95,
    reviewCount: 876,
    learnersCount: 9200,
    duration: "40 hours",
    modules: 8,
    lessons: 72,
    language: "English",
    price: 3999,
    isFree: false,
    shortDescription: "Master LangChain, LlamaIndex, and tool calling to build real AI agents.",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop&q=80",
    skills: ["LangChain", "LlamaIndex", "Gemini API", "RAG", "Tool Calling", "Python"],
    outcomes: [
      "Build autonomous agents with planning, memory, and tool use",
      "Implement RAG pipelines with hybrid search",
      "Design multi-agent orchestration systems",
      "Deploy production AI apps with streaming responses"
    ],
    syllabus: [
      { module: 1, title: "LLM Foundations", lessons: ["Tokens & Context Windows", "Prompting Strategies", "LangChain Intro"], duration: "5h" },
      { module: 2, title: "Chains & Pipelines", lessons: ["LCEL", "Sequential Chains", "Router Chains", "Quiz: Chains"], duration: "5h" },
      { module: 3, title: "RAG Systems", lessons: ["Vector Stores", "Embeddings", "Hybrid Search", "Project: RAG Q&A"], duration: "6h" },
      { module: 4, title: "Tool Calling", lessons: ["Function Calling", "Custom Tools", "API Integration"], duration: "5h" },
      { module: 5, title: "Agentic Loops", lessons: ["ReAct Pattern", "AgentExecutor", "Memory Systems"], duration: "5h" },
      { module: 6, title: "Multi-Agent", lessons: ["LangGraph", "Supervisor Pattern", "State Machines"], duration: "6h" },
      { module: 7, title: "Production", lessons: ["Streaming UI", "Error Recovery", "Rate Limiting", "Observability"], duration: "5h" },
      { module: 8, title: "Capstone", lessons: ["Capstone Project: Autonomous Research Agent", "Code Review", "Deploy & Verify"], duration: "3h" }
    ]
  },
  {
    id: "react-masterclass",
    slug: "react-masterclass",
    title: "React 19 Masterclass",
    subtitle: "Modern React with hooks, context, and production patterns",
    instructor: "Priya Sharma",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Senior Full-Stack Lead @ Stripe. React contributor and open source author.",
    partner: "Stripe Engineering",
    category: "Web Dev",
    type: "Course",
    difficulty: "Intermediate",
    rating: 4.87,
    reviewCount: 4120,
    learnersCount: 62000,
    duration: "28 hours",
    modules: 7,
    lessons: 56,
    language: "English",
    price: 1499,
    isFree: false,
    shortDescription: "Build scalable React apps with the latest patterns and best practices.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop&q=80",
    skills: ["React", "TypeScript", "Hooks", "Zustand", "React Query", "Testing"],
    outcomes: [
      "Master all React 19 hooks and concurrent features",
      "Build performant component architectures",
      "Implement global state with Zustand and server state with React Query",
      "Write unit and integration tests with Vitest and Testing Library"
    ],
    syllabus: [
      { module: 1, title: "React Foundations", lessons: ["JSX & Components", "Props & State", "Event Handling", "Quiz: React Basics"], duration: "4h" },
      { module: 2, title: "Hooks Deep Dive", lessons: ["useState & useEffect", "useCallback & useMemo", "Custom Hooks", "Project: Todo App"], duration: "5h" },
      { module: 3, title: "Advanced Patterns", lessons: ["Compound Components", "Render Props", "Context API", "Portal & Refs"], duration: "5h" },
      { module: 4, title: "State Management", lessons: ["Zustand Setup", "Slices & Selectors", "Persist Middleware", "Quiz: State"], duration: "4h" },
      { module: 5, title: "Data Fetching", lessons: ["React Query", "Optimistic Updates", "Infinite Queries", "Server State"], duration: "4h" },
      { module: 6, title: "Testing", lessons: ["Vitest Setup", "Testing Library", "Mocking APIs", "E2E with Playwright"], duration: "4h" },
      { module: 7, title: "Capstone", lessons: ["Full-stack SaaS Clone", "Deploy & Review", "Portfolio Badge"], duration: "2h" }
    ]
  },
  {
    id: "system-design-mastery",
    slug: "system-design-mastery",
    title: "System Design Mastery",
    subtitle: "Design scalable systems like a Staff engineer at FAANG",
    instructor: "Priya Sharma",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Senior Full-Stack Lead @ Stripe. Hired 40+ engineers after systems interviews.",
    partner: "Stripe Engineering",
    category: "Web Dev",
    type: "Specialization",
    difficulty: "Advanced",
    rating: 4.93,
    reviewCount: 1890,
    learnersCount: 21000,
    duration: "36 hours",
    modules: 9,
    lessons: 72,
    language: "English",
    price: 2999,
    isFree: false,
    shortDescription: "Crack system design interviews and build production architecture skills.",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80",
    skills: ["System Design", "Distributed Systems", "Load Balancing", "Caching", "Databases", "Microservices"],
    outcomes: [
      "Design distributed systems for millions of users",
      "Make trade-off decisions with CAP theorem knowledge",
      "Implement caching, load balancing, and sharding strategies",
      "Pass system design interviews at top tech companies"
    ],
    syllabus: [
      { module: 1, title: "Fundamentals", lessons: ["Scalability Concepts", "CAP Theorem", "Latency vs Throughput", "Quiz: Basics"], duration: "4h" },
      { module: 2, title: "Databases", lessons: ["SQL vs NoSQL", "Indexing & Sharding", "Replication", "ACID vs BASE"], duration: "5h" },
      { module: 3, title: "Caching", lessons: ["Redis Patterns", "Cache Invalidation", "CDN", "Project: Cache Layer"], duration: "4h" },
      { module: 4, title: "APIs & Protocols", lessons: ["REST vs GraphQL vs gRPC", "WebSockets", "Event Streaming"], duration: "4h" },
      { module: 5, title: "Microservices", lessons: ["Service Mesh", "Event-Driven Architecture", "Saga Pattern", "CQRS"], duration: "5h" },
      { module: 6, title: "Real-world Systems", lessons: ["Design Twitter", "Design Uber", "Design Netflix", "Design Slack"], duration: "8h" },
      { module: 7, title: "Interview Prep", lessons: ["STAR Framework", "Whiteboarding", "Mock Interview"], duration: "4h" },
      { module: 8, title: "Cloud Infra", lessons: ["AWS Architecture", "Multi-Region", "Disaster Recovery"], duration: "4h" },
      { module: 9, title: "Capstone", lessons: ["Design a SkillBridge-like Platform", "Expert Review"], duration: "2h" }
    ]
  },
  {
    id: "node-backend",
    slug: "node-backend",
    title: "Node.js Backend Engineering",
    subtitle: "Build production APIs, workers, and microservices with Node.js",
    instructor: "James Okafor",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Principal Backend Engineer @ Vercel. Author of 3 popular npm packages.",
    partner: "Vercel Academy",
    category: "Web Dev",
    type: "Course",
    difficulty: "Intermediate",
    rating: 4.82,
    reviewCount: 2840,
    learnersCount: 34600,
    duration: "30 hours",
    modules: 7,
    lessons: 58,
    language: "English",
    price: 1799,
    isFree: false,
    shortDescription: "Build bulletproof REST APIs, auth systems, and background workers.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14431b9?w=400&auto=format&fit=crop&q=80",
    skills: ["Node.js", "Express", "TypeScript", "PostgreSQL", "Redis", "JWT Auth"],
    outcomes: [
      "Build production-ready REST APIs with Express and TypeScript",
      "Implement JWT authentication and refresh token rotation",
      "Work with PostgreSQL, Redis, and Prisma ORM",
      "Deploy scalable Node.js services on cloud platforms"
    ],
    syllabus: [
      { module: 1, title: "Node.js Fundamentals", lessons: ["Event Loop", "Modules & NPM", "Async/Await", "Streams"], duration: "4h" },
      { module: 2, title: "Express APIs", lessons: ["Routing", "Middleware", "Validation with Zod", "Error Handling"], duration: "5h" },
      { module: 3, title: "Authentication", lessons: ["JWT Basics", "Refresh Tokens", "OAuth 2.0", "Project: Auth System"], duration: "5h" },
      { module: 4, title: "Databases", lessons: ["Prisma ORM", "Migrations", "Query Optimization", "Transactions"], duration: "5h" },
      { module: 5, title: "Caching & Queues", lessons: ["Redis Caching", "BullMQ Workers", "Rate Limiting"], duration: "5h" },
      { module: 6, title: "Testing & Security", lessons: ["Jest API Tests", "SQL Injection Prevention", "Helmet.js"], duration: "4h" },
      { module: 7, title: "Capstone", lessons: ["Build a Payments API", "Deploy to Railway", "Expert Review"], duration: "2h" }
    ]
  },
  {
    id: "data-analysis-python",
    slug: "data-analysis-python",
    title: "Data Analysis with Python",
    subtitle: "pandas, NumPy, matplotlib, and real-world dataset projects",
    instructor: "Dr. Ananya Singh",
    instructorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Lead Data Scientist @ Swiggy. PhD in Statistics from IISc Bangalore.",
    partner: "Analytics Vidhya",
    category: "Data Science",
    type: "Course",
    difficulty: "Beginner",
    rating: 4.85,
    reviewCount: 5620,
    learnersCount: 71400,
    duration: "22 hours",
    modules: 6,
    lessons: 44,
    language: "English & Hindi",
    price: 0,
    isFree: true,
    shortDescription: "Analyze real datasets and build professional charts using Python.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
    skills: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter", "EDA"],
    outcomes: [
      "Perform exploratory data analysis on real datasets",
      "Clean, transform, and aggregate data with pandas",
      "Create publication-quality visualizations",
      "Build automated data analysis notebooks"
    ],
    syllabus: [
      { module: 1, title: "Python Data Stack", lessons: ["NumPy Arrays", "Pandas DataFrames", "Jupyter Notebooks", "Quiz: Setup"], duration: "3h" },
      { module: 2, title: "Data Cleaning", lessons: ["Missing Values", "Outliers", "String Normalization", "Type Casting"], duration: "4h" },
      { module: 3, title: "Data Transformation", lessons: ["GroupBy & Aggregation", "Merges & Joins", "Pivot Tables", "Apply & Lambda"], duration: "4h" },
      { module: 4, title: "Visualization", lessons: ["Matplotlib Basics", "Seaborn Plots", "Interactive Plotly", "Project: Sales Dashboard"], duration: "5h" },
      { module: 5, title: "Statistics", lessons: ["Descriptive Stats", "Hypothesis Testing", "Correlation & Causation"], duration: "3h" },
      { module: 6, title: "Capstone", lessons: ["E-commerce EDA Project", "Peer Review", "Portfolio Badge"], duration: "3h" }
    ]
  },
  {
    id: "sql-mastery",
    slug: "sql-mastery",
    title: "SQL & Database Mastery",
    subtitle: "From SELECT queries to advanced window functions and query optimization",
    instructor: "Marcus Vance",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Principal Data Scientist @ Databricks. SQL optimization veteran.",
    partner: "Databricks Academy",
    category: "Data Science",
    type: "Course",
    difficulty: "Beginner",
    rating: 4.88,
    reviewCount: 7340,
    learnersCount: 89200,
    duration: "20 hours",
    modules: 6,
    lessons: 42,
    language: "English",
    price: 0,
    isFree: true,
    shortDescription: "Master SQL for data analysis, reporting, and backend development.",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&auto=format&fit=crop&q=80",
    skills: ["SQL", "PostgreSQL", "Window Functions", "CTEs", "Query Optimization"],
    outcomes: [
      "Write complex multi-table SQL queries with confidence",
      "Use window functions for advanced analytics",
      "Optimize slow queries using EXPLAIN and indexes",
      "Design normalized database schemas"
    ],
    syllabus: [
      { module: 1, title: "SQL Basics", lessons: ["SELECT, WHERE, ORDER BY", "GROUP BY & HAVING", "Aggregate Functions", "Quiz: Basics"], duration: "3h" },
      { module: 2, title: "Joins & Subqueries", lessons: ["INNER, LEFT, RIGHT Joins", "Self Joins", "Correlated Subqueries", "EXISTS & IN"], duration: "4h" },
      { module: 3, title: "Window Functions", lessons: ["ROW_NUMBER", "RANK & DENSE_RANK", "LAG & LEAD", "Project: Sales Ranking"], duration: "4h" },
      { module: 4, title: "CTEs & Advanced", lessons: ["Common Table Expressions", "Recursive CTEs", "CASE Statements"], duration: "4h" },
      { module: 5, title: "Performance", lessons: ["EXPLAIN ANALYZE", "Index Types", "Query Plans", "Vacuuming PostgreSQL"], duration: "3h" },
      { module: 6, title: "Capstone", lessons: ["Analytics Capstone Project", "Schema Design Challenge", "Badge"], duration: "2h" }
    ]
  },
  {
    id: "data-visualization",
    slug: "data-visualization",
    title: "Data Visualization & Dashboard Design",
    subtitle: "Build executive BI dashboards with Tableau, Power BI, and D3.js",
    instructor: "Elena Rostova",
    instructorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Director of Product @ Linear. Turned data into strategic decisions for 5+ unicorns.",
    partner: "Linear Design Studio",
    category: "Data Science",
    type: "Course",
    difficulty: "Intermediate",
    rating: 4.79,
    reviewCount: 1980,
    learnersCount: 22800,
    duration: "26 hours",
    modules: 6,
    lessons: 48,
    language: "English",
    price: 1299,
    isFree: false,
    shortDescription: "Design dashboards that communicate insights to executives and stakeholders.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80",
    skills: ["Tableau", "Power BI", "D3.js", "Dashboard Design", "Storytelling with Data"],
    outcomes: [
      "Build interactive Tableau and Power BI dashboards",
      "Apply data storytelling principles for executive audiences",
      "Create custom D3.js visualizations for web apps",
      "Design KPI tracking systems for SaaS businesses"
    ],
    syllabus: [
      { module: 1, title: "Visualization Principles", lessons: ["Chart Selection Guide", "Color Theory", "Typography in Data", "Quiz: Viz Design"], duration: "3h" },
      { module: 2, title: "Tableau", lessons: ["Tableau Desktop Setup", "Calculated Fields", "LOD Expressions", "Project: Sales Dashboard"], duration: "6h" },
      { module: 3, title: "Power BI", lessons: ["Power Query", "DAX Measures", "Drill-through Reports", "Sharing & Embedding"], duration: "6h" },
      { module: 4, title: "D3.js", lessons: ["SVG Basics", "Scales & Axes", "Bar & Line Charts", "Interactive Tooltips"], duration: "7h" },
      { module: 5, title: "Dashboard Design", lessons: ["Layout Grids", "Mobile Responsiveness", "Color Accessibility"], duration: "2h" },
      { module: 6, title: "Capstone", lessons: ["Executive KPI Dashboard", "Stakeholder Presentation", "Badge"], duration: "2h" }
    ]
  },
  {
    id: "product-strategy",
    slug: "product-strategy",
    title: "Product Strategy & Management",
    subtitle: "Learn how top PMs define vision, roadmaps, and ship winning products",
    instructor: "Elena Rostova",
    instructorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Director of Product @ Linear. Ex-PM at Notion and Figma.",
    partner: "Linear Design Studio",
    category: "Product",
    type: "Specialization",
    difficulty: "Intermediate",
    rating: 4.91,
    reviewCount: 1420,
    learnersCount: 17600,
    duration: "30 hours",
    modules: 7,
    lessons: 56,
    language: "English",
    price: 2499,
    isFree: false,
    shortDescription: "Go from idea to shipped product using proven PM frameworks.",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80",
    skills: ["Product Strategy", "Roadmapping", "PRD Writing", "OKRs", "User Research", "Go-to-Market"],
    outcomes: [
      "Define product vision and strategy using Jobs-to-be-Done",
      "Write clear PRDs and user stories that engineers love",
      "Prioritize features using RICE, MoSCoW, and Kano models",
      "Build and present product roadmaps to executives"
    ],
    syllabus: [
      { module: 1, title: "PM Fundamentals", lessons: ["What PMs Do", "PM vs TPM vs Designer", "Product Thinking", "Quiz: PM Basics"], duration: "3h" },
      { module: 2, title: "Discovery", lessons: ["User Interviews", "Jobs-to-be-Done", "Competitive Analysis", "Opportunity Sizing"], duration: "5h" },
      { module: 3, title: "Strategy", lessons: ["Vision & Mission", "OKR Framework", "North Star Metrics", "Strategic Bets"], duration: "5h" },
      { module: 4, title: "Execution", lessons: ["PRD Writing", "Sprint Planning", "Working with Engineers", "QA & Launch"], duration: "5h" },
      { module: 5, title: "Prioritization", lessons: ["RICE Scoring", "MoSCoW", "Kano Model", "Impact vs Effort Matrix"], duration: "4h" },
      { module: 6, title: "Analytics", lessons: ["Product Metrics", "A/B Testing", "Funnel Analysis", "Retention Loops"], duration: "5h" },
      { module: 7, title: "Capstone", lessons: ["Build a Full PRD", "Mock PM Interview", "Portfolio Badge"], duration: "3h" }
    ]
  },
  {
    id: "ux-research",
    slug: "ux-research",
    title: "UX Research & Design Fundamentals",
    subtitle: "Master user research methods, wireframing, and prototyping in Figma",
    instructor: "Sofia Marcini",
    instructorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Lead UX Designer @ Airbnb. 8 years designing products for 100M+ users.",
    partner: "Airbnb Design",
    category: "Design",
    type: "Course",
    difficulty: "Beginner",
    rating: 4.84,
    reviewCount: 3810,
    learnersCount: 47200,
    duration: "24 hours",
    modules: 6,
    lessons: 48,
    language: "English",
    price: 1199,
    isFree: false,
    shortDescription: "Learn user research and Figma prototyping to design products users love.",
    thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&auto=format&fit=crop&q=80",
    skills: ["UX Research", "Figma", "Wireframing", "Prototyping", "Usability Testing"],
    outcomes: [
      "Conduct user interviews and synthesize insights",
      "Create wireframes and high-fidelity prototypes in Figma",
      "Run usability tests and iterate on designs",
      "Build a UX portfolio with 3 case studies"
    ],
    syllabus: [
      { module: 1, title: "UX Fundamentals", lessons: ["UX vs UI", "Design Thinking", "Double Diamond", "Quiz: UX Basics"], duration: "3h" },
      { module: 2, title: "User Research", lessons: ["Interview Methods", "Survey Design", "Affinity Mapping", "Persona Creation"], duration: "5h" },
      { module: 3, title: "Information Architecture", lessons: ["Card Sorting", "Sitemaps", "User Flows", "Wireframing"], duration: "5h" },
      { module: 4, title: "Figma Deep Dive", lessons: ["Components & Variants", "Auto Layout", "Prototyping", "Design Systems"], duration: "6h" },
      { module: 5, title: "Usability Testing", lessons: ["Test Planning", "Moderated Tests", "A/B Testing", "Iteration Cycles"], duration: "3h" },
      { module: 6, title: "Capstone", lessons: ["Full Product Design Case Study", "Portfolio Polish", "Badge"], duration: "2h" }
    ]
  },
  {
    id: "docker-kubernetes",
    slug: "docker-kubernetes",
    title: "Docker & Kubernetes for Developers",
    subtitle: "Containerize apps and orchestrate deployments with Kubernetes",
    instructor: "Raj Patel",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Staff DevOps Engineer @ Cloudflare. Kubernetes community contributor.",
    partner: "Cloudflare Academy",
    category: "DevOps",
    type: "Course",
    difficulty: "Intermediate",
    rating: 4.86,
    reviewCount: 2610,
    learnersCount: 31400,
    duration: "28 hours",
    modules: 7,
    lessons: 56,
    language: "English",
    price: 1699,
    isFree: false,
    shortDescription: "Go from Docker basics to running production Kubernetes clusters.",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&auto=format&fit=crop&q=80",
    skills: ["Docker", "Kubernetes", "Helm", "CI/CD", "AWS EKS", "Monitoring"],
    outcomes: [
      "Containerize any application with Docker and Docker Compose",
      "Deploy and manage Kubernetes clusters on AWS EKS",
      "Set up Helm charts and GitOps workflows",
      "Implement monitoring with Prometheus and Grafana"
    ],
    syllabus: [
      { module: 1, title: "Docker Fundamentals", lessons: ["Containers vs VMs", "Dockerfile Best Practices", "Multi-stage Builds", "Docker Compose"], duration: "4h" },
      { module: 2, title: "Docker Networking", lessons: ["Bridge Networks", "Volumes & Bind Mounts", "Docker Hub", "Security Scanning"], duration: "4h" },
      { module: 3, title: "Kubernetes Basics", lessons: ["K8s Architecture", "Pods & Deployments", "Services & Ingress", "ConfigMaps & Secrets"], duration: "5h" },
      { module: 4, title: "Advanced K8s", lessons: ["StatefulSets", "DaemonSets", "RBAC", "Network Policies"], duration: "5h" },
      { module: 5, title: "Production K8s", lessons: ["EKS Setup", "Cluster Autoscaler", "HPA", "Pod Disruption Budgets"], duration: "6h" },
      { module: 6, title: "Monitoring", lessons: ["Prometheus Setup", "Grafana Dashboards", "Alertmanager", "Log Aggregation"], duration: "3h" },
      { module: 7, title: "Capstone", lessons: ["Deploy a Microservices App", "Load Test", "Expert Review"], duration: "1h" }
    ]
  },
  {
    id: "aws-fundamentals",
    slug: "aws-fundamentals",
    title: "AWS Cloud Fundamentals",
    subtitle: "Prepare for AWS Solutions Architect Associate certification",
    instructor: "Raj Patel",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Staff DevOps Engineer @ Cloudflare. 5x AWS certified.",
    partner: "Cloudflare Academy",
    category: "DevOps",
    type: "Certificate",
    difficulty: "Beginner",
    rating: 4.88,
    reviewCount: 4220,
    learnersCount: 58600,
    duration: "32 hours",
    modules: 8,
    lessons: 64,
    language: "English",
    price: 2199,
    isFree: false,
    shortDescription: "Master AWS services and prepare for the SAA-C03 certification exam.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80",
    skills: ["AWS", "EC2", "S3", "RDS", "Lambda", "VPC", "IAM"],
    outcomes: [
      "Deploy and manage AWS infrastructure confidently",
      "Pass the AWS Solutions Architect Associate exam",
      "Design highly available and fault-tolerant systems on AWS",
      "Optimize cloud costs using reserved instances and spot fleets"
    ],
    syllabus: [
      { module: 1, title: "AWS Foundations", lessons: ["Global Infrastructure", "IAM & Policies", "CLI & SDK Setup", "Quiz: AWS Basics"], duration: "4h" },
      { module: 2, title: "Compute", lessons: ["EC2 Instance Types", "Auto Scaling Groups", "Elastic Load Balancers", "Lambda Basics"], duration: "5h" },
      { module: 3, title: "Storage", lessons: ["S3 & Glacier", "EBS & EFS", "Storage Gateway", "Project: Static Site on S3"], duration: "4h" },
      { module: 4, title: "Databases", lessons: ["RDS Multi-AZ", "Aurora", "DynamoDB", "ElastiCache"], duration: "5h" },
      { module: 5, title: "Networking", lessons: ["VPC Design", "Subnets & NACLs", "Route 53", "CloudFront CDN"], duration: "5h" },
      { module: 6, title: "Security", lessons: ["KMS Encryption", "WAF & Shield", "Inspector & GuardDuty"], duration: "4h" },
      { module: 7, title: "Architecture", lessons: ["Well-Architected Framework", "Disaster Recovery", "High Availability Design"], duration: "4h" },
      { module: 8, title: "Exam Prep", lessons: ["300 Practice Questions", "Mock Exam", "Exam Tips", "Certificate Badge"], duration: "1h" }
    ]
  },
  {
    id: "growth-metrics",
    slug: "growth-metrics",
    title: "Growth Analytics & Product Metrics",
    subtitle: "Master activation, retention, revenue, and referral loops",
    instructor: "Neil Kapoor",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80",
    instructorBio: "VP of Growth @ Razorpay. Scaled 4 products from 0 to 1M users.",
    partner: "Razorpay Growth Labs",
    category: "Product",
    type: "Course",
    difficulty: "Intermediate",
    rating: 4.83,
    reviewCount: 940,
    learnersCount: 11800,
    duration: "18 hours",
    modules: 5,
    lessons: 38,
    language: "English",
    price: 1499,
    isFree: false,
    shortDescription: "Build data-driven growth systems that compound over time.",
    thumbnail: "https://images.unsplash.com/photo-1642790551116-304c56e76f6b?w=400&auto=format&fit=crop&q=80",
    skills: ["Growth Hacking", "AARRR Metrics", "A/B Testing", "Mixpanel", "Amplitude", "Retention"],
    outcomes: [
      "Define and track the metrics that matter for growth",
      "Build A/B testing frameworks to validate growth hypotheses",
      "Identify and fix retention leaks in user journeys",
      "Design viral loops and referral systems"
    ],
    syllabus: [
      { module: 1, title: "Growth Fundamentals", lessons: ["AARRR Framework", "North Star Metric", "Growth Loops vs Funnels", "Quiz: Growth Basics"], duration: "3h" },
      { module: 2, title: "Acquisition", lessons: ["Channel Attribution", "CAC & LTV", "Paid vs Organic", "SEO Basics"], duration: "4h" },
      { module: 3, title: "Activation & Retention", lessons: ["Aha Moment Mapping", "Onboarding Flows", "Churn Analysis", "Project: Retention Dashboard"], duration: "5h" },
      { module: 4, title: "Experimentation", lessons: ["A/B Test Design", "Statistical Significance", "Multivariate Testing", "Common Pitfalls"], duration: "4h" },
      { module: 5, title: "Capstone", lessons: ["Growth Plan Document", "Data Analysis Project", "Portfolio Badge"], duration: "2h" }
    ]
  },
  {
    id: "cicd-automation",
    slug: "cicd-automation",
    title: "CI/CD & DevOps Automation",
    subtitle: "GitHub Actions, Terraform, and automated deployment pipelines",
    instructor: "Raj Patel",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    instructorBio: "Staff DevOps Engineer @ Cloudflare. Architected CI/CD for 200+ services.",
    partner: "Cloudflare Academy",
    category: "DevOps",
    type: "Course",
    difficulty: "Intermediate",
    rating: 4.87,
    reviewCount: 1680,
    learnersCount: 19400,
    duration: "24 hours",
    modules: 6,
    lessons: 48,
    language: "English",
    price: 1599,
    isFree: false,
    shortDescription: "Automate your entire software delivery pipeline with modern DevOps tools.",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80",
    skills: ["GitHub Actions", "Terraform", "Jenkins", "ArgoCD", "GitOps", "Secrets Management"],
    outcomes: [
      "Build end-to-end CI/CD pipelines with GitHub Actions",
      "Provision infrastructure as code with Terraform",
      "Implement GitOps workflows with ArgoCD",
      "Manage secrets securely in deployment pipelines"
    ],
    syllabus: [
      { module: 1, title: "CI/CD Fundamentals", lessons: ["DevOps Culture", "CI vs CD vs CD", "Pipeline Design", "Quiz: CI/CD Basics"], duration: "3h" },
      { module: 2, title: "GitHub Actions", lessons: ["Workflow YAML", "Matrix Builds", "Reusable Workflows", "Custom Actions"], duration: "5h" },
      { module: 3, title: "Terraform", lessons: ["HCL Basics", "State Management", "Modules", "Project: AWS Infra with TF"], duration: "6h" },
      { module: 4, title: "Containerized CI", lessons: ["Docker in CI", "Layer Caching", "Registry Integration", "Security Scanning"], duration: "4h" },
      { module: 5, title: "GitOps & ArgoCD", lessons: ["GitOps Principles", "ArgoCD Setup", "Sync Policies", "Rollbacks"], duration: "4h" },
      { module: 6, title: "Capstone", lessons: ["Full Pipeline from Code to K8s", "Expert Review", "Badge"], duration: "2h" }
    ]
  }
];

// ── Experts (12 total) ─────────────────────────────────────────
export const EXPERTS = [
  {
    id: "alex-chen",
    name: "Dr. Alex Chen",
    role: "Staff AI Engineer",
    company: "Anthropic (ex-Google)",
    expertise: ["AI Agents", "LLM Fine-tuning", "RAG Systems", "Python", "LangChain"],
    category: "AI & ML",
    rating: 4.98,
    reviewCount: 142,
    sessionsCount: 380,
    responseTime: "< 1 hour",
    price: 499,
    pricePerMinute: 17,
    nextSlot: "Today, 5:30 PM",
    languages: ["English", "Mandarin"],
    availability: "today",
    isAIRecommended: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "10+ years in AI research and production deployments at Google Brain and Anthropic. Helped 150+ engineers land top-tier AI roles at OpenAI, Google, and Scale AI. Specialist in agentic systems, RAG pipelines, and LLM fine-tuning.",
    services: [
      { id: "code-review", name: "Code Review", duration: "45 min", price: 499, description: "Deep review of your AI/ML codebase with actionable feedback." },
      { id: "mock-interview", name: "Mock Interview", duration: "60 min", price: 699, description: "ML/AI system design interview with FAANG-level questions." },
      { id: "career-guidance", name: "Career Guidance", duration: "30 min", price: 299, description: "Personalized roadmap to land your target AI role." },
      { id: "resume-roast", name: "Resume Roast", duration: "30 min", price: 349, description: "Critical feedback on your resume from an AI hiring manager." }
    ],
    testimonials: [
      { name: "Siddharth M.", role: "Now @ Google Brain", comment: "Alex's feedback on my agent loop saved me weeks of debugging. Landed my dream AI role!", rating: 5, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80" },
      { name: "Jessica T.", role: "ML Engineer @ Scale AI", comment: "Direct, highly technical, and extremely encouraging. Worth 10x the session price.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80" },
      { name: "Rahul V.", role: "AI Intern @ Cohere", comment: "The mock interview prep was exactly what I needed. Alex knew the exact questions these companies ask.", rating: 5, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&auto=format&fit=crop&q=80" }
    ],
    availabilitySlots: [
      { date: "Today", times: ["5:30 PM", "7:00 PM"] },
      { date: "Tomorrow", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { date: "Aug 6", times: ["11:00 AM", "4:00 PM"] }
    ]
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    role: "Senior Full-Stack Lead",
    company: "Stripe",
    expertise: ["Next.js", "System Design", "TypeScript", "Node.js", "React"],
    category: "Web Dev",
    rating: 4.95,
    reviewCount: 98,
    sessionsCount: 240,
    responseTime: "< 2 hours",
    price: 499,
    pricePerMinute: 17,
    nextSlot: "Tomorrow, 2:00 PM",
    languages: ["English", "Hindi"],
    availability: "tomorrow",
    isAIRecommended: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    bio: "Specializing in high-throughput distributed systems and crisp frontend architecture. Passionate about developer mentorship and open source. Hired 40+ engineers as a technical interviewer at Stripe.",
    services: [
      { id: "code-review", name: "Code Review", duration: "45 min", price: 499, description: "Review of your full-stack codebase and architecture decisions." },
      { id: "mock-interview", name: "Mock Interview", duration: "60 min", price: 699, description: "System design & coding interview simulation." },
      { id: "career-guidance", name: "Career Guidance", duration: "30 min", price: 299, description: "Navigate your full-stack career trajectory with expert advice." },
      { id: "project-review", name: "Project Review", duration: "60 min", price: 549, description: "Holistic review of your portfolio project for production readiness." }
    ],
    testimonials: [
      { name: "Rohan V.", role: "SWE @ Stripe", comment: "Priya's system design mock interview gave me the exact confidence boost I needed for Stripe.", rating: 5, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80" },
      { name: "Aisha K.", role: "Frontend Lead @ Zomato", comment: "Best mentor I've had. She breaks down complex concepts in incredibly simple ways.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80" }
    ],
    availabilitySlots: [
      { date: "Tomorrow", times: ["2:00 PM", "5:00 PM"] },
      { date: "Aug 6", times: ["10:00 AM", "3:00 PM"] },
      { date: "Aug 7", times: ["4:00 PM", "6:00 PM"] }
    ]
  },
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "Principal Data Scientist",
    company: "Databricks",
    expertise: ["Python ETL", "PyTorch", "Data Pipelines", "SQL", "Spark", "MLflow"],
    category: "Data Science",
    rating: 4.91,
    reviewCount: 84,
    sessionsCount: 196,
    responseTime: "< 3 hours",
    price: 599,
    pricePerMinute: 20,
    nextSlot: "Aug 6, 11:00 AM",
    languages: ["English"],
    availability: "weekend",
    isAIRecommended: false,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Data architecture veteran with 12 years building production ML systems. Passionate about helping analysts transition into full Lead Data Science roles. Former researcher at DeepMind.",
    services: [
      { id: "code-review", name: "Data Pipeline Review", duration: "45 min", price: 599, description: "Review your ETL pipeline and ML workflow architecture." },
      { id: "mock-interview", name: "DS Interview Prep", duration: "60 min", price: 749, description: "Statistics, ML case studies, and SQL interview simulation." },
      { id: "career-guidance", name: "Data Career Path", duration: "30 min", price: 349, description: "Tailored advice for breaking into data science or leveling up." },
      { id: "portfolio-review", name: "Portfolio Review", duration: "45 min", price: 499, description: "Review your data science portfolio for maximum impact." }
    ],
    testimonials: [
      { name: "Ananya K.", role: "Data Scientist @ Amazon", comment: "Incredible guidance on building production SQL pipelines. Highly recommended!", rating: 5, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80" },
      { name: "Dev P.", role: "ML Engineer @ Swiggy", comment: "Marcus helped me understand Spark internals in one session what took me months to grasp alone.", rating: 5, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&auto=format&fit=crop&q=80" }
    ],
    availabilitySlots: [
      { date: "Aug 6", times: ["11:00 AM", "3:00 PM"] },
      { date: "Aug 7", times: ["10:00 AM", "2:00 PM", "5:00 PM"] },
      { date: "Aug 8", times: ["11:00 AM"] }
    ]
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Director of Product",
    company: "Linear",
    expertise: ["Product Strategy", "SaaS UX", "Portfolio Review", "Hiring", "PRD Writing"],
    category: "Product",
    rating: 4.97,
    reviewCount: 110,
    sessionsCount: 280,
    responseTime: "< 1 hour",
    price: 699,
    pricePerMinute: 23,
    nextSlot: "Aug 7, 6:00 PM",
    languages: ["English", "Russian"],
    availability: "weekend",
    isAIRecommended: false,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    bio: "Product leader behind sleek developer toolings at Linear. Ex-PM at Notion and Figma. Will turn your technical projects into compelling product case studies that get you hired.",
    services: [
      { id: "portfolio-review", name: "Portfolio Review", duration: "45 min", price: 699, description: "Transform your raw projects into executive-ready product stories." },
      { id: "mock-interview", name: "PM Interview Prep", duration: "60 min", price: 899, description: "Product case studies, strategy questions, and behavioral prep." },
      { id: "career-guidance", name: "PM Career Strategy", duration: "30 min", price: 449, description: "Navigate the PM career ladder with a senior PM as your guide." },
      { id: "prd-review", name: "PRD Review", duration: "30 min", price: 399, description: "Critical feedback on your product requirements document." }
    ],
    testimonials: [
      { name: "David L.", role: "PM @ Notion", comment: "Transformed my raw code portfolio into an executive-ready product demo. Got 3 offers!", rating: 5, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80" },
      { name: "Meera S.", role: "APM @ Razorpay", comment: "Elena's feedback on my case study was the difference-maker in my PM interviews.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80" }
    ],
    availabilitySlots: [
      { date: "Aug 7", times: ["6:00 PM", "8:00 PM"] },
      { date: "Aug 8", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { date: "Aug 9", times: ["11:00 AM", "4:00 PM"] }
    ]
  },
  {
    id: "james-okafor",
    name: "James Okafor",
    role: "Principal Backend Engineer",
    company: "Vercel",
    expertise: ["Node.js", "PostgreSQL", "Redis", "API Design", "Performance"],
    category: "Web Dev",
    rating: 4.89,
    reviewCount: 67,
    sessionsCount: 154,
    responseTime: "< 2 hours",
    price: 549,
    pricePerMinute: 18,
    nextSlot: "Tomorrow, 11:00 AM",
    languages: ["English"],
    availability: "tomorrow",
    isAIRecommended: false,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    bio: "Principal engineer at Vercel building edge infrastructure at global scale. Author of 3 popular npm packages with 2M+ weekly downloads. Specializes in high-performance Node.js systems.",
    services: [
      { id: "code-review", name: "API Code Review", duration: "45 min", price: 549, description: "Deep dive into your backend architecture and API design." },
      { id: "performance-audit", name: "Performance Audit", duration: "60 min", price: 699, description: "Identify and fix bottlenecks in your Node.js application." },
      { id: "mock-interview", name: "Backend Interview", duration: "60 min", price: 649, description: "System design and backend coding interview simulation." },
      { id: "career-guidance", name: "Backend Career Path", duration: "30 min", price: 299, description: "Get actionable advice on leveling up as a backend engineer." }
    ],
    testimonials: [
      { name: "Carlos R.", role: "Backend @ Vercel", comment: "James's code review caught 3 critical security vulnerabilities I would have shipped. Incredible!", rating: 5, avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&auto=format&fit=crop&q=80" }
    ],
    availabilitySlots: [
      { date: "Tomorrow", times: ["11:00 AM", "4:00 PM"] },
      { date: "Aug 6", times: ["2:00 PM", "5:00 PM"] },
      { date: "Aug 7", times: ["10:00 AM"] }
    ]
  },
  {
    id: "raj-patel",
    name: "Raj Patel",
    role: "Staff DevOps Engineer",
    company: "Cloudflare",
    expertise: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Docker", "GitOps"],
    category: "DevOps",
    rating: 4.88,
    reviewCount: 93,
    sessionsCount: 218,
    responseTime: "< 3 hours",
    price: 549,
    pricePerMinute: 18,
    nextSlot: "Today, 8:00 PM",
    languages: ["English", "Hindi", "Gujarati"],
    availability: "today",
    isAIRecommended: false,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    bio: "5x AWS certified DevOps engineer scaling infrastructure at Cloudflare. Kubernetes community contributor. Has helped 80+ engineers pass cloud certifications and land DevOps roles.",
    services: [
      { id: "code-review", name: "IaC Code Review", duration: "45 min", price: 549, description: "Review Terraform, Kubernetes, and CI/CD pipeline code." },
      { id: "cert-prep", name: "AWS Cert Prep", duration: "60 min", price: 649, description: "Targeted prep session for AWS certification exams." },
      { id: "architecture-review", name: "Architecture Review", duration: "60 min", price: 699, description: "Cloud architecture review with optimization recommendations." },
      { id: "career-guidance", name: "DevOps Career Path", duration: "30 min", price: 299, description: "Map your path from developer to senior DevOps engineer." }
    ],
    testimonials: [
      { name: "Vikram S.", role: "DevOps @ AWS", comment: "Raj's Terraform review saved us from a major config drift issue. He's brilliant!", rating: 5, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&auto=format&fit=crop&q=80" }
    ],
    availabilitySlots: [
      { date: "Today", times: ["8:00 PM"] },
      { date: "Tomorrow", times: ["7:00 PM", "9:00 PM"] },
      { date: "Aug 6", times: ["6:00 PM", "8:00 PM"] }
    ]
  },
  {
    id: "sofia-marcini",
    name: "Sofia Marcini",
    role: "Lead UX Designer",
    company: "Airbnb",
    expertise: ["UX Research", "Figma", "Design Systems", "Accessibility", "Prototyping"],
    category: "Design",
    rating: 4.93,
    reviewCount: 76,
    sessionsCount: 182,
    responseTime: "< 2 hours",
    price: 449,
    pricePerMinute: 15,
    nextSlot: "Aug 6, 3:00 PM",
    languages: ["English", "Italian"],
    availability: "weekend",
    isAIRecommended: true,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    bio: "8 years designing products for 100M+ users at Airbnb. Expert in research-driven design, accessible interfaces, and scalable design systems. Passionate about helping designers build award-winning portfolios.",
    services: [
      { id: "portfolio-review", name: "Portfolio Review", duration: "45 min", price: 449, description: "Critical review of your UX/UI design portfolio." },
      { id: "figma-review", name: "Figma File Review", duration: "45 min", price: 399, description: "Deep-dive review of your Figma designs for quality and accessibility." },
      { id: "mock-interview", name: "Design Interview Prep", duration: "60 min", price: 599, description: "Portfolio walkthrough + design challenge simulation." },
      { id: "career-guidance", name: "Design Career Path", duration: "30 min", price: 249, description: "Navigate your UX career with a senior Airbnb designer." }
    ],
    testimonials: [
      { name: "Tanya M.", role: "UX Designer @ Figma", comment: "Sofia spotted UX issues in 5 minutes that I hadn't noticed in months. Game changer!", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&auto=format&fit=crop&q=80" }
    ],
    availabilitySlots: [
      { date: "Aug 6", times: ["3:00 PM", "5:00 PM"] },
      { date: "Aug 7", times: ["11:00 AM", "3:00 PM"] },
      { date: "Aug 8", times: ["10:00 AM", "2:00 PM"] }
    ]
  },
  {
    id: "neil-kapoor",
    name: "Neil Kapoor",
    role: "VP of Growth",
    company: "Razorpay",
    expertise: ["Growth Marketing", "Product Analytics", "A/B Testing", "Retention", "Revenue"],
    category: "Product",
    rating: 4.85,
    reviewCount: 58,
    sessionsCount: 134,
    responseTime: "< 4 hours",
    price: 599,
    pricePerMinute: 20,
    nextSlot: "Aug 7, 10:00 AM",
    languages: ["English", "Hindi"],
    availability: "weekend",
    isAIRecommended: false,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    bio: "VP of Growth at Razorpay who has scaled 4 products from 0 to 1M+ users. Expert in PLG motion, growth analytics, and building retention systems that compound over time.",
    services: [
      { id: "growth-review", name: "Growth Strategy Review", duration: "60 min", price: 699, description: "Review your product's growth levers and prioritize experiments." },
      { id: "analytics-setup", name: "Analytics Audit", duration: "45 min", price: 549, description: "Review your Mixpanel/Amplitude setup and event taxonomy." },
      { id: "career-guidance", name: "Growth Career Path", duration: "30 min", price: 349, description: "Land a growth role with a focused career strategy." },
      { id: "mock-interview", name: "Growth PM Interview", duration: "60 min", price: 749, description: "Growth case studies and metrics question simulation." }
    ],
    testimonials: [
      { name: "Akash B.", role: "Growth PM @ Meesho", comment: "Neil's frameworks transformed how I think about product metrics. Incredibly valuable.", rating: 5, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80" }
    ],
    availabilitySlots: [
      { date: "Aug 7", times: ["10:00 AM", "2:00 PM"] },
      { date: "Aug 8", times: ["11:00 AM", "3:00 PM", "5:00 PM"] },
      { date: "Aug 9", times: ["2:00 PM"] }
    ]
  },
  {
    id: "ananya-singh",
    name: "Dr. Ananya Singh",
    role: "Lead Data Scientist",
    company: "Swiggy",
    expertise: ["Statistics", "Python", "A/B Testing", "Experimentation", "Causal Inference"],
    category: "Data Science",
    rating: 4.9,
    reviewCount: 72,
    sessionsCount: 168,
    responseTime: "< 2 hours",
    price: 499,
    pricePerMinute: 17,
    nextSlot: "Tomorrow, 7:00 PM",
    languages: ["English", "Hindi", "Tamil"],
    availability: "tomorrow",
    isAIRecommended: true,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    bio: "PhD in Statistics from IISc Bangalore. Lead Data Scientist at Swiggy building recommendation systems. Expert in causal inference, A/B testing design, and turning data insights into product decisions.",
    services: [
      { id: "stats-review", name: "Stats & ML Review", duration: "45 min", price: 499, description: "Review your statistical approach and ML model choices." },
      { id: "ab-testing", name: "A/B Test Design", duration: "30 min", price: 349, description: "Design a statistically valid experiment for your product." },
      { id: "career-guidance", name: "DS Career Guidance", duration: "30 min", price: 299, description: "Navigate the data science job market with expert advice." },
      { id: "mock-interview", name: "DS Interview Prep", duration: "60 min", price: 649, description: "Statistics, ML, and case study interview simulation." }
    ],
    testimonials: [
      { name: "Preethi K.", role: "Data Scientist @ Flipkart", comment: "Dr. Ananya's guidance on causal inference saved my analysis from a critical bias issue!", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&auto=format&fit=crop&q=80" }
    ],
    availabilitySlots: [
      { date: "Tomorrow", times: ["7:00 PM", "9:00 PM"] },
      { date: "Aug 6", times: ["11:00 AM", "4:00 PM", "7:00 PM"] },
      { date: "Aug 7", times: ["10:00 AM"] }
    ]
  },
  {
    id: "carlos-reyes",
    name: "Carlos Reyes",
    role: "Principal Frontend Engineer",
    company: "Shopify",
    expertise: ["React", "Performance", "Accessibility", "GraphQL", "Design Systems"],
    category: "Web Dev",
    rating: 4.87,
    reviewCount: 54,
    sessionsCount: 128,
    responseTime: "< 3 hours",
    price: 499,
    pricePerMinute: 17,
    nextSlot: "Aug 6, 5:00 PM",
    languages: ["English", "Spanish"],
    availability: "weekend",
    isAIRecommended: false,
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    bio: "Principal frontend engineer at Shopify building the storefront platform used by 2M+ merchants. Expert in performance optimization, accessibility, and large-scale React architecture.",
    services: [
      { id: "code-review", name: "Frontend Code Review", duration: "45 min", price: 499, description: "Performance, accessibility, and architecture review of your React app." },
      { id: "perf-audit", name: "Performance Audit", duration: "60 min", price: 649, description: "Lighthouse audit + Core Web Vitals optimization session." },
      { id: "mock-interview", name: "Frontend Interview", duration: "60 min", price: 599, description: "Frontend coding and system design interview simulation." },
      { id: "career-guidance", name: "Frontend Career Path", duration: "30 min", price: 299, description: "Actionable advice on becoming a senior frontend engineer." }
    ],
    testimonials: [
      { name: "Lena P.", role: "Frontend @ Shopify", comment: "Carlos helped me reduce my app's LCP from 4.2s to 1.1s. Absolute wizard!", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&auto=format&fit=crop&q=80" }
    ],
    availabilitySlots: [
      { date: "Aug 6", times: ["5:00 PM", "7:00 PM"] },
      { date: "Aug 7", times: ["3:00 PM", "6:00 PM"] },
      { date: "Aug 8", times: ["11:00 AM", "4:00 PM"] }
    ]
  },
  {
    id: "yuki-tanaka",
    name: "Yuki Tanaka",
    role: "ML Research Scientist",
    company: "Google DeepMind",
    expertise: ["Deep Learning", "PyTorch", "Computer Vision", "NLP", "Research"],
    category: "AI & ML",
    rating: 4.96,
    reviewCount: 48,
    sessionsCount: 112,
    responseTime: "< 2 hours",
    price: 799,
    pricePerMinute: 27,
    nextSlot: "Aug 8, 3:00 PM",
    languages: ["English", "Japanese"],
    availability: "weekend",
    isAIRecommended: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    bio: "ML Research Scientist at Google DeepMind with publications at NeurIPS, ICML, and ICLR. Specializes in training large neural networks and implementing SOTA research papers.",
    services: [
      { id: "research-review", name: "Research Paper Review", duration: "60 min", price: 899, description: "Deep review of your ML research paper or implementation." },
      { id: "model-review", name: "Model Architecture Review", duration: "45 min", price: 799, description: "Expert review of your neural network architecture and training setup." },
      { id: "mock-interview", name: "Research Scientist Interview", duration: "90 min", price: 999, description: "Research presentation + ML theory interview simulation." },
      { id: "career-guidance", name: "AI Research Career", duration: "30 min", price: 499, description: "Navigate the path from ML engineer to AI research scientist." }
    ],
    testimonials: [
      { name: "Arjun N.", role: "PhD Student @ MIT", comment: "Yuki reviewed my NeurIPS paper and caught a major methodological flaw. Saved my submission!", rating: 5, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&auto=format&fit=crop&q=80" }
    ],
    availabilitySlots: [
      { date: "Aug 8", times: ["3:00 PM", "6:00 PM"] },
      { date: "Aug 9", times: ["2:00 PM", "5:00 PM"] },
      { date: "Aug 10", times: ["11:00 AM", "3:00 PM"] }
    ]
  },
  {
    id: "maya-brooks",
    name: "Maya Brooks",
    role: "Senior Mobile Engineer",
    company: "Meta",
    expertise: ["React Native", "iOS", "Android", "Mobile Architecture", "Performance"],
    category: "Mobile",
    rating: 4.83,
    reviewCount: 41,
    sessionsCount: 96,
    responseTime: "< 4 hours",
    price: 449,
    pricePerMinute: 15,
    nextSlot: "Aug 6, 7:00 PM",
    languages: ["English"],
    availability: "weekend",
    isAIRecommended: false,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "Senior Mobile Engineer at Meta building React Native infrastructure for Facebook and Instagram. Expert in cross-platform performance optimization and native module bridging.",
    services: [
      { id: "code-review", name: "Mobile Code Review", duration: "45 min", price: 449, description: "Review of your React Native or native mobile codebase." },
      { id: "performance-audit", name: "App Performance Audit", duration: "60 min", price: 599, description: "Identify render bottlenecks and memory leaks in your mobile app." },
      { id: "mock-interview", name: "Mobile Interview Prep", duration: "60 min", price: 549, description: "React Native and mobile system design interview simulation." },
      { id: "career-guidance", name: "Mobile Career Path", duration: "30 min", price: 249, description: "Navigate the mobile engineering career ladder with expert advice." }
    ],
    testimonials: [
      { name: "Dev K.", role: "iOS Developer @ PhonePe", comment: "Maya identified the exact cause of our app's memory leak within 10 minutes. Incredible expertise!", rating: 5, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80" }
    ],
    availabilitySlots: [
      { date: "Aug 6", times: ["7:00 PM", "9:00 PM"] },
      { date: "Aug 7", times: ["5:00 PM", "7:00 PM"] },
      { date: "Aug 8", times: ["3:00 PM"] }
    ]
  }
];

// Keep backward compatibility alias
export const MENTORS = EXPERTS.slice(0, 4);

// ── Portfolio Projects ─────────────────────────────────────────
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

// ── Community Threads ──────────────────────────────────────────
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
  },
  {
    id: 4,
    title: "How to structure a monorepo for a full-stack TypeScript project?",
    author: "Preethi Nair",
    authorRole: "Full-Stack Developer",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    tags: ["TypeScript", "Monorepo", "Turborepo"],
    upvotes: 35,
    status: "Answered",
    snippet: "Use Turborepo with packages/ui, packages/api, and packages/shared. Configure tsconfig paths for cross-package imports and shared types...",
    aiAnswer: "For TypeScript monorepos: Turborepo + pnpm workspaces is the gold standard. Key: share a base tsconfig.json with strict mode enabled across all packages.",
    humanAnswersCount: 5,
    hasAcceptedSolution: true,
    timeAgo: "3 hours ago"
  },
  {
    id: 5,
    title: "Best strategy for getting your first AI/ML internship with no prior experience?",
    author: "Aditya Kumar",
    authorRole: "3rd Year CS Student",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    tags: ["Career", "AI & ML", "Internship"],
    upvotes: 87,
    status: "Verified Solution",
    snippet: "Build 2 specific, niche AI projects (not generic chatbots). Open-source them. Write a detailed blog post for each. Apply to 50+ companies. Network on LinkedIn...",
    aiAnswer: "Key insight: HR filters by GitHub activity before looking at GPA. Ship 2 real projects, write case studies, and get them reviewed by a mentor. This is the AI internship funnel.",
    humanAnswersCount: 12,
    hasAcceptedSolution: true,
    timeAgo: "2 days ago"
  },
  {
    id: 6,
    title: "Confused about when to use Zustand vs React Context vs React Query",
    author: "Mei Chen",
    authorRole: "React Developer",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    tags: ["React", "State Management", "React Query"],
    upvotes: 61,
    status: "Answered",
    snippet: "Rule: React Query for server state, Zustand for global client state, Context for theme/auth. Never use Context for frequently updated state — it causes unnecessary re-renders...",
    aiAnswer: "Mental model: Server state (async, cached) → React Query. Global UI state (cart, modals) → Zustand. Rare, static state (theme) → Context.",
    humanAnswersCount: 8,
    hasAcceptedSolution: true,
    timeAgo: "4 hours ago"
  }
];

// ── Leaderboard ────────────────────────────────────────────────
export const LEADERBOARD = [
  { rank: 1, name: "Rahul Verma", score: "4,890 XP", projects: 8, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" },
  { rank: 2, name: "Alex Rivera (You)", score: "3,450 XP", projects: 4, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
  { rank: 3, name: "Sophia Martinez", score: "3,120 XP", projects: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
  { rank: 4, name: "Devansh Patel", score: "2,840 XP", projects: 3, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80" },
];

// ── Admin Analytics ────────────────────────────────────────────
export const ADMIN_STATS = {
  users: {
    total: 14280,
    learners: 13102,
    mentors: 89,
    admins: 12,
    pendingVerification: 47,
    newThisMonth: 1420,
    growthPercent: 18.4
  },
  courses: {
    total: 48,
    active: 42,
    inactive: 6,
    totalEnrollments: 184600,
    completionRate: 62,
    avgRating: 4.87
  },
  experts: {
    total: 89,
    approved: 76,
    pending: 13,
    avgRating: 4.88,
    totalSessions: 8420,
    topCategory: "AI & ML"
  },
  bookings: {
    total: 8420,
    confirmed: 6840,
    completed: 6120,
    cancelled: 380,
    noShow: 220,
    pending: 860,
    revenueThisMonth: 284000,
    growthPercent: 24.1
  },
  revenue: {
    total: 1842000,
    thisMonth: 284000,
    lastMonth: 228900,
    growthPercent: 24.1,
    breakdown: [
      { name: "Expert Sessions", amount: 168400, percent: 59.3 },
      { name: "Course Enrollments", amount: 82600, percent: 29.1 },
      { name: "Pro Subscriptions", amount: 33000, percent: 11.6 }
    ],
    monthlyTrend: [180000, 195000, 212000, 198000, 228900, 284000]
  },
  agentEvents: [
    { id: 1, type: "diagnostic", user: "Karan M.", detail: "Career diagnostic completed — Full-Stack path recommended", time: "2 min ago" },
    { id: 2, type: "match", user: "Preethi N.", detail: "Matched with Dr. Alex Chen for AI code review session", time: "8 min ago" },
    { id: 3, type: "verify", user: "Rahul V.", detail: "RAG pipeline project verified — Portfolio badge issued", time: "15 min ago" },
    { id: 4, type: "plan", user: "Aditya K.", detail: "Execution plan updated — Added LangChain sprint based on diagnostic", time: "32 min ago" },
    { id: 5, type: "booking", user: "Mei C.", detail: "Session booked with Priya Sharma — Mock interview scheduled", time: "1 hr ago" },
    { id: 6, type: "complete", user: "Sofia L.", detail: "SQL Mastery course completed — Certificate issued", time: "2 hrs ago" },
  ]
};
