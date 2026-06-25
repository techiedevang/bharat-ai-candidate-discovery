export interface Candidate {
  id: string;
  name: string;
  title: string;
  currentCompany: string;
  experienceYears: number;
  location: string;
  state: string;
  skills: string[];
  preferredRoles: string[];
  regionalLanguages: string[];
  contactEmail: string;
  resumeSummary: string;
  multilingualBio?: { [lang: string]: string }; // Regional language snippet
  platformActivityScore: number; // 1-100 indicating active search representation
  behavioralSignals: {
    loyalty: number;        // 1-5 rating (historical tenure stability)
    responseRate: number;   // % response rate to messages
    adaptability: number;   // 1-5 rating (cross-domain capability)
    interviewAttendance: number; // % attendance of scheduled talks
  };
  metrics: {
    projectsSubmitted: number;
    gptsBuilt?: number;
    hackathonsWon: number;
  };
  placementProbability?: number; // Calculated dynamic fit
  matchScore?: number;           // Calculated matching score
  matchExplanation?: string;     // AI matching reasoning
  skillsAnalysis?: { matched: string[]; missing: string[] };
  isHoneypot?: boolean;
  honeypotReason?: string;
  redrobSignals?: {
    profileCompleteness: number;
    signupDate: string;
    lastActiveDate: string;
    openToWork: boolean;
    profileViews30d: number;
    applications30d: number;
    avgResponseTimeHours: number;
    noticePeriodDays: number;
    expectedSalaryLpaMin: number;
    expectedSalaryLpaMax: number;
    preferredWorkMode: 'onsite' | 'hybrid' | 'remote' | 'flexible';
    willingToRelocate: boolean;
    githubActivityScore: number;
    searchAppearance30d: number;
    savedByRecruiters30d: number;
    interviewCompletionRate: number;
    offerAcceptanceRate: number;
    verifiedEmail: boolean;
    verifiedPhone: boolean;
    linkedinConnected: boolean;
  };
}

export interface JobDescription {
  id: string;
  title: string;
  department: string;
  minExperience: number;
  location: string;
  primarySkills: string[];
  rawText: string;
  regionalVariant?: string; // Multilingual input option
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  tier: 'bronze' | 'silver' | 'gold';
  color: string;
  dateEarned: string;
}

export interface GamificationProfile {
  username: string;
  fullName: string;
  regionalHub: string; // e.g. "Bengaluru Tech", "Chennai Sourcing Hub", "Noida AI Circle"
  points: number;
  contributions: number; // Verification count
  level: number;
  badges: Badge[];
}

export interface ContributionRecord {
  id: string;
  recruiterName: string;
  type: 'profile_verification' | 'placement_history' | 'skill_correction';
  candidateName: string;
  candidateId: string;
  description: string;
  pointsEarned: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  username: string;
  fullName: string;
  regionalHub: string;
  points: number;
  contributions: number;
  badgeCount: number;
  rank: number;
  isCurrentUser?: boolean;
}

// Initial national Indian regional candidate database containing balanced diversity
export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "cand-001",
    name: "Arjun Divakaran",
    title: "Senior AI / ML Engineer",
    currentCompany: "NextGen Software Bangalore",
    experienceYears: 6,
    location: "Bengaluru",
    state: "Karnataka",
    skills: ["PyTorch", "Transformers", "Python", "VLLM", "Docker", "RAG Systems", "Kubernetes"],
    preferredRoles: ["AI Architect", "Lead Machine Learning Engineer"],
    regionalLanguages: ["Kannada", "Malayalam", "English"],
    contactEmail: "arjun.divak@bharatrec.in",
    resumeSummary: "Highly specialized AI practitioner having built scalable fine-tuned vision models and distributed indexing. Proficient in optimizing LLMs on server endpoints (such as vLLM). Active GitHub contributor to open-source agent frameworks.",
    multilingualBio: {
      "Kannada": "ಬೆಂಗಳೂರಿನಲ್ಲಿ ೬ ವರ್ಷದ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ಯಂತ್ರ ಕಲಿಕೆ (AI/ML) ಅನುಭವ ಹೊಂದಿದ ಎಂಜಿನಿಯರ್. ಸುಧಾರಿತ ಮಾದರಿಗಳ ಅಭಿವೃದ್ಧಿಯಲ್ಲಿ ಪರಿಣತಿ ಹೊಂದಿದ್ದಾರೆ.",
      "English": "Senior AI engineer with 6 years experience in Bengaluru specializing in foundational model fine-tuning and hosting optimizations."
    },
    platformActivityScore: 94,
    behavioralSignals: {
      loyalty: 4,
      responseRate: 98,
      adaptability: 5,
      interviewAttendance: 100
    },
    metrics: {
      projectsSubmitted: 14,
      hackathonsWon: 3
    }
  },
  {
    id: "cand-002",
    name: "Priyanka Sharma",
    title: "Full Stack Engineer & React Specialist",
    currentCompany: "FinTech Innovations Delhi",
    experienceYears: 4,
    location: "Noida",
    state: "Uttar Pradesh",
    skills: ["React", "TypeScript", "Node.js", "Express", "Tailwind CSS", "MongoDB", "PostgreSQL"],
    preferredRoles: ["Senior Full Stack Developer", "Frontend Architect"],
    regionalLanguages: ["Hindi", "English"],
    contactEmail: "priyanka.sharma@noida-talent.dev",
    resumeSummary: "MERN stack specialist with outstanding performance optimization track record. Deeply focused on localized responsive web designs and low-latency API proxy layers. Handled user-flows exceeding 2M monthly clicks.",
    multilingualBio: {
      "Hindi": "नोएडा स्थित ४ साल के अनुभव वाली सीनियर फुल स्टैक डेवलपर। रिएक्ट, नोड और टाइपस्क्रिप्ट के माध्यम से उत्कृष्ट वेब एप्लिकेशन्स निर्माण में विशेषज्ञ।",
      "English": "Senior MERN stack developer with 4 years experience creating fast, dynamic financial portals in Noida/NCR."
    },
    platformActivityScore: 89,
    behavioralSignals: {
      loyalty: 5,
      responseRate: 92,
      adaptability: 4,
      interviewAttendance: 95
    },
    metrics: {
      projectsSubmitted: 22,
      hackathonsWon: 1
    }
  },
  {
    id: "cand-003",
    name: "Muthu Kumaran",
    title: "Data Scientist",
    currentCompany: "TIDEL Tech Solutions",
    experienceYears: 3,
    location: "Chennai",
    state: "Tamil Nadu",
    skills: ["Python", "Pandas", "Scikit-Learn", "SQL", "Tableau", "FastAPI", "Data Pipeline"],
    preferredRoles: ["Data Scientist", "Analytics Engineer"],
    regionalLanguages: ["Tamil", "English"],
    contactEmail: "muthu.kumaran@chennaitech.net",
    resumeSummary: "Analytical problem solver specializing in predictive modeling, statistical testing, and custom visual metrics in Recharts. Experienced in translating user intent signals for conversion boost.",
    multilingualBio: {
      "Tamil": "சென்னையில் 3 வருட அனுபவமுள்ள தரவு ஆய்வாளர். இயந்திர கற்றல் கருவிகள் மற்றும் பைப்லைன்களை உருவாக்குவதில் நிபுணர்.",
      "English": "Data scientist with 3 years tenure in Chennai, focusing on custom analytical insights and pipeline management."
    },
    platformActivityScore: 78,
    behavioralSignals: {
      loyalty: 3,
      responseRate: 85,
      adaptability: 4,
      interviewAttendance: 90
    },
    metrics: {
      projectsSubmitted: 9,
      hackathonsWon: 2
    }
  },
  {
    id: "cand-004",
    name: "Ananya Deshmukh",
    title: "Lead Cloud Infrastructure Engineer",
    currentCompany: "SaaS Rocket Pune",
    experienceYears: 7,
    location: "Pune",
    state: "Maharashtra",
    skills: ["AWS", "Terraform", "CI/CD", "Docker", "Python", "Prometheus", "GCP"],
    preferredRoles: ["DevOps Architect", "Cloud Security Lead"],
    regionalLanguages: ["Marathi", "Hindi", "English"],
    contactEmail: "ananya.deshmukh@puneactive.io",
    resumeSummary: "Expert system administrator and automation specialist. Leveraged infrastructure-as-code to reduce cloud overhead by 35% in enterprise multi-region setups. Certified Kubernetes Administrator.",
    multilingualBio: {
      "Marathi": "पुण्यातील अग्रगण्य क्लाउड इन्फ्रास्ट्रक्चर तज्ञ. ७ वर्षांचा प्रदीर्घ अनुभव, टेराफॉर्म आणि कुबर्नेटीस मधील प्रगत नैपुण्य.",
      "English": "Cloud scaling veteran with 7 years background in continuous integration, microservices deployment, and robust cloud monitoring."
    },
    platformActivityScore: 82,
    behavioralSignals: {
      loyalty: 4,
      responseRate: 90,
      adaptability: 5,
      interviewAttendance: 92
    },
    metrics: {
      projectsSubmitted: 18,
      hackathonsWon: 0
    }
  },
  {
    id: "cand-005",
    name: "Rajesh Kumar Mahto",
    title: "Junior Backend Developer",
    currentCompany: "Patna TechLabs",
    experienceYears: 2,
    location: "Patna",
    state: "Bihar",
    skills: ["Python", "Django", "PostgreSQL", "REST API", "Redis", "Git"],
    preferredRoles: ["Backend Engineer", "API Integrator"],
    regionalLanguages: ["Bhojpuri", "Hindi", "English"],
    contactEmail: "rajesh.mahto@patnatech.co.in",
    resumeSummary: "Dedicated Python/Django developer working in tier-2 cities. Built microservice logic for localized educational apps. Excellent problem solver in standard SQL query optimizations.",
    multilingualBio: {
      "Hindi": "पटना से वेब बैकएंड डेवलपर। २ साल के अनुभव के साथ डेटाबेस डिज़ाइन, एपीआई रूटिंग और जंगो विकास में कुशल।",
      "English": "Backend specialist based in Patna focusing on Django backends, API optimizations, and structured query writing."
    },
    platformActivityScore: 91,
    behavioralSignals: {
      loyalty: 4,
      responseRate: 100,
      adaptability: 4,
      interviewAttendance: 100
    },
    metrics: {
      projectsSubmitted: 25, // Extensively submits local projects
      hackathonsWon: 4
    }
  },
  {
    id: "cand-006",
    name: "Sujata Banerjee",
    title: "AI Specialist & NLP Lead",
    currentCompany: "SaltLake AI Systems",
    experienceYears: 5,
    location: "Kolkata",
    state: "West Bengal",
    skills: ["NLP", "Transformers", "BERT", "Large Language Models", "Python", "HuggingFace"],
    preferredRoles: ["NLP Researcher", "AI Prompt Architect"],
    regionalLanguages: ["Bengali", "English"],
    contactEmail: "sujata.ban@saltlake.org",
    resumeSummary: "Passionate AI specialist targeting Indic languages. Researched cross-lingual semantic matching for regional databases. Created novel transformers for Indian vernacular translations.",
    multilingualBio: {
      "Bengali": "কলকাতার ৫ বছরের অভিজ্ঞতাসম্পন্ন কৃত্তিম বুদ্ধিমত্তা গবেষক। ভারতীয় স্থানীয় ভাষা প্রক্রিয়াকরণ (NLP) এবং ট্রান্সফরমার্স তৈরিতে ওনার অসামান্য পারদর্শিতা আছে।",
      "English": "Kolkata-based NLP specialist working on regional language translation vectors and neural models."
    },
    platformActivityScore: 87,
    behavioralSignals: {
      loyalty: 5,
      responseRate: 94,
      adaptability: 4,
      interviewAttendance: 96
    },
    metrics: {
      projectsSubmitted: 11,
      hackathonsWon: 2
    }
  },
  {
    id: "CAND_0012871",
    name: "Sravan Kumar",
    title: "Senior AI Engineer (Applied ML)",
    currentCompany: "Talentflow AI Systems Noida",
    experienceYears: 7,
    location: "Noida",
    state: "Uttar Pradesh",
    skills: ["Python", "Sentence-Transformers", "Milvus", "FAISS", "HuggingFace", "RAG Systems", "Evaluation Frameworks", "NDCG Metrics"],
    preferredRoles: ["Founding AI Engineer", "Senior ML Infrastructure Engineer"],
    regionalLanguages: ["Hindi", "English"],
    contactEmail: "sravan.kumar@talentflow.ai",
    resumeSummary: "Applied ML Practitioner with 7+ years building real production search rankers. Architected neural dual-encoder matching layer boosting recall by 28%. Expert in evaluating sparse/dense hybrid indexing models using NDCG/MRR benchmarks. Hands-on with Pinecone/Milvus.",
    multilingualBio: {
      "Hindi": "नोएडा स्थित ७ साल के अनुभव वाले सीनियर एआई इंजीनियर। वाक्य-ट्रांसफॉर्मर, मिलवस और हाइब्रिड सर्च इंडेक्सिंग सिस्टम के उत्पादन में विशेषज्ञता।",
      "English": "Senior AI engineer with 7 years applied experience in Noida optimizing multi-region hybrid dense vector retrievals."
    },
    platformActivityScore: 98,
    behavioralSignals: {
      loyalty: 5,
      responseRate: 98,
      adaptability: 5,
      interviewAttendance: 100
    },
    metrics: {
      projectsSubmitted: 29,
      hackathonsWon: 5
    },
    redrobSignals: {
      profileCompleteness: 95,
      signupDate: "2024-03-12",
      lastActiveDate: "2026-06-18",
      openToWork: true,
      profileViews30d: 142,
      applications30d: 14,
      avgResponseTimeHours: 1.2,
      noticePeriodDays: 30,
      expectedSalaryLpaMin: 28,
      expectedSalaryLpaMax: 35,
      preferredWorkMode: "hybrid",
      willingToRelocate: true,
      githubActivityScore: 88,
      searchAppearance30d: 310,
      savedByRecruiters30d: 45,
      interviewCompletionRate: 0.98,
      offerAcceptanceRate: 0.90,
      verifiedEmail: true,
      verifiedPhone: true,
      linkedinConnected: true
    }
  },
  {
    id: "CAND_0019884",
    name: "Dr. Rohan Mehra",
    title: "Principal ML Research Scientist",
    currentCompany: "National Research Lab & Institute",
    experienceYears: 8,
    location: "Pune",
    state: "Maharashtra",
    skills: ["PyTorch", "arXiv Research", "Theoretical NLP", "Transformers", "LoRA Fine-Tuned", "TensorFlow"],
    preferredRoles: ["NLP Researcher", "Chief Scientist"],
    regionalLanguages: ["Marathi", "English"],
    contactEmail: "r.mehra@academic-lab.res.in",
    resumeSummary: "Distinguished AI researcher with 8+ years publishing NLP breakthroughs. Expert in theoretical loss-function engineering for large transformers. Note: Entirely academic career with no production code deployment or real-world scale experience.",
    platformActivityScore: 75,
    behavioralSignals: {
      loyalty: 3,
      responseRate: 60,
      adaptability: 2,
      interviewAttendance: 80
    },
    metrics: {
      projectsSubmitted: 4,
      hackathonsWon: 0
    },
    redrobSignals: {
      profileCompleteness: 80,
      signupDate: "2025-01-08",
      lastActiveDate: "2026-06-10",
      openToWork: false,
      profileViews30d: 38,
      applications30d: 1,
      avgResponseTimeHours: 48,
      noticePeriodDays: 90,
      expectedSalaryLpaMin: 45,
      expectedSalaryLpaMax: 55,
      preferredWorkMode: "remote",
      willingToRelocate: false,
      githubActivityScore: 12,
      searchAppearance30d: 45,
      savedByRecruiters30d: 6,
      interviewCompletionRate: 0.70,
      offerAcceptanceRate: -1,
      verifiedEmail: true,
      verifiedPhone: false,
      linkedinConnected: true
    }
  },
  {
    id: "CAND_0488312",
    name: "Deepa Nair",
    title: "Lead AI Vector Engineer",
    currentCompany: "Pinecone Systems India",
    experienceYears: 8,
    location: "Pune",
    state: "Maharashtra",
    skills: ["Pinecone", "Qdrant", "E5 Embeddings", "MRR", "NDCG", "LangChain", "OpenAI API"],
    preferredRoles: ["Lead AI Architect"],
    regionalLanguages: ["Malayalam", "English"],
    contactEmail: "deepa.nair@vector-expert.dev",
    resumeSummary: "Expert with 8 years of deep experience working solely with Pinecone database (founded 3 years ago) and LangChain (founded 1.5 years ago) in enterprise cloud-native deployment. Highly active in vector embeddings.",
    platformActivityScore: 92,
    behavioralSignals: {
      loyalty: 5,
      responseRate: 90,
      adaptability: 5,
      interviewAttendance: 95
    },
    metrics: {
      projectsSubmitted: 15,
      hackathonsWon: 1
    },
    isHoneypot: true,
    honeypotReason: "Impossible Profile: Claims 8 years of specialized experience with Pinecone database (founded in 2021) and LangChain (founded in 2022), which is physically impossible and indicates a high-risk chatbot keyword-stuffer trap.",
    redrobSignals: {
      profileCompleteness: 90,
      signupDate: "2024-11-20",
      lastActiveDate: "2026-06-17",
      openToWork: true,
      profileViews30d: 210,
      applications30d: 20,
      avgResponseTimeHours: 2.1,
      noticePeriodDays: 15,
      expectedSalaryLpaMin: 32,
      expectedSalaryLpaMax: 40,
      preferredWorkMode: "hybrid",
      willingToRelocate: true,
      githubActivityScore: 95,
      searchAppearance30d: 450,
      savedByRecruiters30d: 98,
      interviewCompletionRate: 0.95,
      offerAcceptanceRate: 0.85,
      verifiedEmail: true,
      verifiedPhone: true,
      linkedinConnected: true
    }
  },
  {
    id: "CAND_0091235",
    name: "Anil Deshpande",
    title: "Product Marketing Manager & LangChain Enthusiast",
    currentCompany: "Enterprise Services Corp",
    experienceYears: 5,
    location: "Mumbai",
    state: "Maharashtra",
    skills: ["LangChain", "OpenAI APIs", "Prompt Engineering", "Digital Marketing", "Enterprise Consulting"],
    preferredRoles: ["Product Manager", "Relational Systems Lead"],
    regionalLanguages: ["Marathi", "Hindi", "English"],
    contactEmail: "anil.desh@marketing-expert.io",
    resumeSummary: "Dynamic marketing lead with 5 years consulting corporate firms. Transitioned over last 9 months to calling OpenAI APIs with LangChain wrappers showing exquisite prompt-based automation. No pre-LLM ML experience or database engineering roots.",
    platformActivityScore: 85,
    behavioralSignals: {
      loyalty: 2,
      responseRate: 95,
      adaptability: 3,
      interviewAttendance: 90
    },
    metrics: {
      projectsSubmitted: 8,
      hackathonsWon: 0
    },
    redrobSignals: {
      profileCompleteness: 75,
      signupDate: "2025-05-15",
      lastActiveDate: "2026-06-19",
      openToWork: true,
      profileViews30d: 65,
      applications30d: 8,
      avgResponseTimeHours: 1.5,
      noticePeriodDays: 45,
      expectedSalaryLpaMin: 18,
      expectedSalaryLpaMax: 24,
      preferredWorkMode: "flexible",
      willingToRelocate: true,
      githubActivityScore: 10,
      searchAppearance30d: 80,
      savedByRecruiters30d: 12,
      interviewCompletionRate: 0.90,
      offerAcceptanceRate: 0.50,
      verifiedEmail: true,
      verifiedPhone: true,
      linkedinConnected: false
    }
  },
  {
    id: "CAND_0007729",
    name: "Sneha Patel",
    title: "Senior Machine Learning Engineer",
    currentCompany: "ScaleGraph Data Systems",
    experienceYears: 6,
    location: "Hyderabad",
    state: "Telangana",
    skills: ["SentenceTransformers", "Weaviate", "Python", "BERT Embeddings", "XGBoost", "Large-Scale Indexing"],
    preferredRoles: ["Senior Applied ML Engineer"],
    regionalLanguages: ["Telugu", "Gujarati", "English"],
    contactEmail: "sneha.patel@scalegraph.net",
    resumeSummary: "Highly competent 6-year veteran building recommendations and neural indices at high scale. Shipped real-time search queries across 12M inventory lines. Very dormant profile status: has not checked Redrob for several months.",
    platformActivityScore: 15,
    behavioralSignals: {
      loyalty: 4,
      responseRate: 4,
      adaptability: 4,
      interviewAttendance: 45
    },
    metrics: {
      projectsSubmitted: 14,
      hackathonsWon: 2
    },
    redrobSignals: {
      profileCompleteness: 85,
      signupDate: "2023-01-10",
      lastActiveDate: "2025-12-15",
      openToWork: false,
      profileViews30d: 5,
      applications30d: 0,
      avgResponseTimeHours: 120,
      noticePeriodDays: 90,
      expectedSalaryLpaMin: 35,
      expectedSalaryLpaMax: 42,
      preferredWorkMode: "remote",
      willingToRelocate: false,
      githubActivityScore: 40,
      searchAppearance30d: 12,
      savedByRecruiters30d: 2,
      interviewCompletionRate: 0.35,
      offerAcceptanceRate: 0.20,
      verifiedEmail: true,
      verifiedPhone: true,
      linkedinConnected: true
    }
  },
  {
    id: "CAND_0023412",
    name: "Vikram Sen",
    title: "Software Engineer - Matching Systems",
    currentCompany: "TalentHive India (Series B HR-tech)",
    experienceYears: 6,
    location: "Pune",
    state: "Maharashtra",
    skills: ["Python", "Semantic Embeddings", "Inverted Indices", "Evaluation Benchmarks", "NDCG Metrics", "Search & Retrieval"],
    preferredRoles: ["Senior Software Engineer", "Founding AI Engineer"],
    regionalLanguages: ["Marathi", "Hindi", "English"],
    contactEmail: "vikram.sen@talenthive.co.in",
    resumeSummary: "Built and scaled the lookup, routing, and catalog matching engines handling 4M active profiles. Evaluated neural rankers using NDCG/MRR offline testing pipelines. Extremely capable developer prioritizing shipped systems over trending frameworks.",
    multilingualBio: {
      "Marathi": "पुण्यातील ६ वर्षांचे अनुभव असलेले सिनियर सॉफ्टवेअर इंजिनिअर. शोध व मूल्यांकन (NDCG) प्रणाली तयार करण्यात विशेष नैपुण्य.",
      "English": "Applied Software engineer with 6 years experience in Pune scaling marketplace search and relevance ranking indexes."
    },
    platformActivityScore: 95,
    behavioralSignals: {
      loyalty: 5,
      responseRate: 96,
      adaptability: 5,
      interviewAttendance: 100
    },
    metrics: {
      projectsSubmitted: 12,
      hackathonsWon: 1
    },
    redrobSignals: {
      profileCompleteness: 92,
      signupDate: "2024-05-20",
      lastActiveDate: "2026-06-19",
      openToWork: true,
      profileViews30d: 110,
      applications30d: 9,
      avgResponseTimeHours: 2,
      noticePeriodDays: 20,
      expectedSalaryLpaMin: 22,
      expectedSalaryLpaMax: 28,
      preferredWorkMode: "hybrid",
      willingToRelocate: true,
      githubActivityScore: 70,
      searchAppearance30d: 280,
      savedByRecruiters30d: 38,
      interviewCompletionRate: 0.97,
      offerAcceptanceRate: 0.88,
      verifiedEmail: true,
      verifiedPhone: true,
      linkedinConnected: true
    }
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { username: "amit_sourced_it", fullName: "Amit Sourcing Wizard", regionalHub: "Bengaluru Tech Hub", points: 3450, contributions: 68, badgeCount: 5, rank: 1 },
  { username: "kavitha_recruits", fullName: "Kavitha Rajasekaran", regionalHub: "Chennai Talents", points: 2900, contributions: 56, badgeCount: 4, rank: 2 },
  { username: "puneet_delhi", fullName: "Puneet Malhotra", regionalHub: "NCR Recruiters", points: 2650, contributions: 51, badgeCount: 4, rank: 3 },
  { username: "itsmedevu16", fullName: "Tensor Titans (You)", regionalHub: "Mumbai Recruiting", points: 1950, contributions: 39, badgeCount: 3, rank: 4, isCurrentUser: true },
  { username: "rahul_kolkata", fullName: "Rahul Sengupta", regionalHub: "Kolkata AI Sourcing", points: 1800, contributions: 35, badgeCount: 3, rank: 5 },
  { username: "maharashtra_talent", fullName: "Sagar Shinde", regionalHub: "Pune Tech Sourcing", points: 1550, contributions: 31, badgeCount: 2, rank: 6 }
];

export const AVAILABLE_BADGES_TEMPLATES: Badge[] = [
  {
    id: "badge-01",
    name: "Vernacular Pioneer",
    description: "Successfully validated 10+ profiles submitted in regional Indian languages.",
    icon: "Languages",
    tier: "gold",
    color: "from-amber-400 to-amber-600",
    dateEarned: "2026-06-01"
  },
  {
    id: "badge-02",
    name: "Golden Scout",
    description: "Contributed high-retention post-placement data for model fine-tuning.",
    icon: "Compass",
    tier: "gold",
    color: "from-yellow-400 to-orange-500",
    dateEarned: "2026-06-03"
  },
  {
    id: "badge-03",
    name: "Stability Anchor",
    description: "Validated 15+ candidate behavioral signals and tenure loyalty reports.",
    icon: "ShieldCheck",
    tier: "silver",
    color: "from-blue-400 to-indigo-600",
    dateEarned: "2026-06-05"
  },
  {
    id: "badge-04",
    name: "Pioneer Sourcing Agent",
    description: "Successfully registered on the BHARAT AI Sourcing network.",
    icon: "UserCheck",
    tier: "bronze",
    color: "from-gray-300 to-slate-500",
    dateEarned: "2026-06-08"
  }
];

export const SAMPLE_BULK_DATASET = [
  {
    name: "Karan Johar",
    title: "Senior Android Developer",
    currentCompany: "Mumbai Mobile Labs",
    experienceYears: 5,
    location: "Mumbai",
    state: "Maharashtra",
    skills: ["Kotlin", "Jetpack Compose", "Coroutines", "Dagger Hilt", "Retrofit", "Git"],
    regionalLanguages: ["Hindi", "Marathi", "English"],
    contactEmail: "karan.j@mumbaimobile.in",
    resumeSummary: "Expert Android app developer with 5+ years building stable high-load apps in Mumbai. Spearheaded migration to Jetpack Compose resulting in 40% code shrink."
  },
  {
    name: "Sunitha Venugopal",
    title: "Lead QA Automation Engineer",
    currentCompany: "Quality Assurance Chennai",
    experienceYears: 6,
    location: "Chennai",
    state: "Tamil Nadu",
    skills: ["Selenium", "Cypress", "Python", "CI/CD", "Playwright", "Docker"],
    regionalLanguages: ["Tamil", "Malayalam", "English"],
    contactEmail: "sunitha.v@chennaicheck.net",
    resumeSummary: "Lead quality architect passionate about low-latency automation pipelines. Cut integration suite runtime by 50% using parallelized Playwright nodes."
  },
  {
    name: "Rahul Verma",
    title: "Backend Platform Engineer",
    currentCompany: "NCR Logistics Platforms",
    experienceYears: 4,
    location: "Gurugram",
    state: "Haryana",
    skills: ["Go", "gRPC", "Docker", "Kubernetes", "Redis", "Kafka", "PostgreSQL"],
    regionalLanguages: ["Hindi", "Punjabi", "English"],
    contactEmail: "rahul.verma@ncrplatform.org",
    resumeSummary: "Golang microservices backend veteran dealing with throughput exceeding 12,000 requests per minute. Scaled Kafka message buses across diverse availability zones."
  },
  {
    name: "Aaditya Joshi",
    title: "UI / UX Designer",
    currentCompany: "Design Craft Bengaluru",
    experienceYears: 3,
    location: "Bengaluru",
    state: "Karnataka",
    skills: ["Figma", "Tailwind CSS", "Prototyping", "Design Systems", "HTML5", "Motion Design"],
    regionalLanguages: ["Kannada", "Marathi", "English"],
    contactEmail: "aaditya.j@designcraft.co",
    resumeSummary: "Creatively driven UI engineer merging design engineering with pristine React elements. Created design tokens used internationally."
  },
  {
    name: "Meera Nair",
    title: "Principal DevOps Engineer",
    currentCompany: "Technopark Systems",
    experienceYears: 8,
    location: "Thiruvananthapuram",
    state: "Kerala",
    skills: ["Terraform", "AWS", "Ansible", "Kubernetes", "EKS", "Prometheus", "Linux"],
    regionalLanguages: ["Malayalam", "Tamil", "English"],
    contactEmail: "meera.nair@technopark.org",
    resumeSummary: "High-performance DevOps architect managing multi-cluster infrastructure. Transitioned legacy systems to AWS EKS with zero downtime."
  },
  {
    name: "Harpreet Singh",
    title: "Product Manager",
    currentCompany: "Chandigarh AI Hub",
    experienceYears: 5,
    location: "Chandigarh",
    state: "Punjab",
    skills: ["Product Roadmap", "RAG Systems", "SQL", "LLMs", "Agile Methodologies", "Jira"],
    regionalLanguages: ["Punjabi", "Hindi", "English"],
    contactEmail: "harpreet.s@chandigarhai.dev",
    resumeSummary: "Product leader bringing deep-tech LLM concepts to enterprise delivery. Guided cross-functional team of 15 researchers to launch regional search bots."
  },
  {
    name: "Shruti Hegde",
    title: "Data Platform Architect",
    currentCompany: "Silicon Valley Bangalore",
    experienceYears: 7,
    location: "Bengaluru",
    state: "Karnataka",
    skills: ["Scala", "Apache Spark", "Hadoop", "Python", "Snowflake", "Databricks"],
    regionalLanguages: ["Kannada", "Tulu", "English"],
    contactEmail: "shruti.hegde@dataworld.in",
    resumeSummary: "Architect specialized in high-volume Spark computation engines. Directed scalable lakehouse migration handling over 140TB of geo-distributed logs."
  },
  {
    name: "Gopal Mukherjee",
    title: "Embedded Systems Developer",
    currentCompany: "Howrah Robotics & Automation",
    experienceYears: 4,
    location: "Kolkata",
    state: "West Bengal",
    skills: ["C", "C++", "FreeRTOS", "Raspberry Pi", "IoT", "Microcontrollers"],
    regionalLanguages: ["Bengali", "Hindi", "English"],
    contactEmail: "g.mukherjee@howrahrobotics.co",
    resumeSummary: "Firmware generalist targeting low-resource telemetry nodes. Wrote high-efficiency scheduler for lithium battery array monitoring."
  }
];
