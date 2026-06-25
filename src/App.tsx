import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  Award,
  ShieldCheck,
  CheckCircle,
  Languages,
  Activity,
  UserCheck,
  PlusCircle,
  ArrowRight,
  Clock,
  TrendingUp,
  MapPin,
  Briefcase,
  Grid,
  Database,
  BookOpen,
  Users,
  Check,
  ChevronRight,
  Coins,
  Flame,
  Globe,
  RefreshCw,
  FileText,
  Send,
  Share2,
  Trash2,
  AlertCircle,
  Play,
  Download,
  Terminal,
  Code2,
  Sun,
  Moon
} from "lucide-react";
import { Candidate, GamificationProfile, LeaderboardEntry, ContributionRecord, Badge, SAMPLE_BULK_DATASET } from "./types";
import CandidateCard from "./components/CandidateCard";

export default function App() {
  // Main states
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [gamification, setGamification] = useState<{
    profile: GamificationProfile | null;
    leaderboard: LeaderboardEntry[];
    contributions: ContributionRecord[];
  }>({
    profile: null,
    leaderboard: [],
    contributions: []
  });

  const [loadingCandidates, setLoadingCandidates] = useState<boolean>(true);
  const [matchingInProgress, setMatchingInProgress] = useState<boolean>(false);
  const [translatingInProgress, setTranslatingInProgress] = useState<boolean>(false);
  const [apiLatency, setApiLatency] = useState<number | null>(null);

  // Tab systems
  const [leftTab, setLeftTab] = useState<'translate' | 'jd' | 'add' | 'dataset'>('translate');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [bulkLoading, setBulkLoading] = useState<boolean>(false);
  const [driveUrlInput, setDriveUrlInput] = useState<string>("https://drive.google.com/file/d/1MfD47XvVdRKBGRAyzGOxDCEf2ve96Jjo/view?usp=drive_link");

  // Advanced Search & Query
  const [regionalSearchQuery, setRegionalSearchQuery] = useState<string>("");
  const [selectedSourceLang, setSelectedSourceLang] = useState<string>("Auto-detect");
  const [queryTranslationLog, setQueryTranslationLog] = useState<{
    original: string;
    translated: string;
    detectedLang: string;
    keywords: string[];
    explanation?: string;
  } | null>(null);

  // Job Description Analyze Input
  const [jobDescriptionInput, setJobDescriptionInput] = useState<string>(
    "We are looking for a Senior AI & ML Engineer with hands-on experience in PyTorch, transformers models, LLM finetuning, and RAG architectures. Knowledge of Docker and Bengaluru/Karnataka region context is advantageous."
  );

  // Add Candidate Input Forms State
  const [newCandidateForm, setNewCandidateForm] = useState({
    name: "",
    title: "",
    currentCompany: "",
    experienceYears: 4,
    location: "",
    state: "",
    skillsString: "",
    regionalLanguagesString: "English",
    contactEmail: "",
    resumeSummary: "",
    regionalBioString: ""
  });

  // Filtering Options for Search Bar
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>("All");
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>("All");
  const [feedbackNotification, setFeedbackNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'badge';
    customBadge?: Badge;
  } | null>(null);

  // Quick Multilingual Translation Templates for recruiters to easily test
  const MULTILINGUAL_TEMPLATES = [
    {
      label: "Hindi ML Query",
      query: "नोएडा में ४ साल का अनुभवी पूर्ण स्टैक रिएक्ट और नोड डेवलपर चाहिए",
      lang: "Hindi"
    },
    {
      label: "Kannada Agent Query",
      query: "ಬೆಂಗಳೂರಿನಲ್ಲಿ ೬ ವರ್ಷದ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಎಂಜಿನಿಯರ್ ಡಾಕರ್ ಮತ್ತು ಆರ್.ಎ.ಜಿ ಅನುಭವ ಹೊಂದಿದವರು",
      lang: "Kannada"
    },
    {
      label: "Tamil Data Query",
      query: "சென்னையில் 3 வருட அனுபவமுள்ள தரவு ஆய்வாளர், மெஷின் லேர்னிங் பைப்லைன் தெரிந்தவர்",
      lang: "Tamil"
    },
    {
      label: "Marathi Cloud Query",
      query: "पुण्यात ७ वर्ष काम केलेला टेराफॉर्म आणि क्लाउड इन्फ्रास्ट्रक्चर तज्ञ हवा आहे",
      lang: "Marathi"
    }
  ];

  // Load baseline on component mount
  const [pipelineMetadata, setPipelineMetadata] = useState<{
    githubUrl: string;
    sandboxUrl: string;
    aiDeclaration: string;
    teamName: string;
    teamRegion: string;
  }>({
    githubUrl: "",
    sandboxUrl: "",
    aiDeclaration: "",
    teamName: "",
    teamRegion: ""
  });

  const [pipelineState, setPipelineState] = useState<{
    isGenerating: boolean;
    generationProgress: number;
    isRanking: boolean;
    rankingProgress: number;
    totalCandidatesProcessed: number;
    logs: string[];
    lastValidationResult: {
      success: boolean;
      report: string[];
    } | null;
    top100: any[];
  }>({
    isGenerating: false,
    generationProgress: 0,
    isRanking: false,
    rankingProgress: 0,
    totalCandidatesProcessed: 0,
    logs: [],
    lastValidationResult: null,
    top100: []
  });

  const [datasetFileExists, setDatasetFileExists] = useState<boolean>(false);
  const [submissionFileExists, setSubmissionFileExists] = useState<boolean>(false);

  const fetchPipelineStatus = async () => {
    try {
      const res = await fetch("/api/pipeline/status");
      const data = await res.json();
      if (data) {
        setPipelineMetadata(data.metadata);
        setPipelineState(data.state);
        setDatasetFileExists(data.datasetFileExists);
        setSubmissionFileExists(data.submissionFileExists);
      }
    } catch (err) {
      console.error("Error fetching pipeline status:", err);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchGamificationData();
    fetchPipelineStatus();
  }, []);

  // Poll pipeline status if there's an active generation or ranking job
  useEffect(() => {
    let interval: any = null;
    if (pipelineState.isGenerating || pipelineState.isRanking) {
      interval = setInterval(() => {
        fetchPipelineStatus();
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pipelineState.isGenerating, pipelineState.isRanking]);

  const fetchCandidates = async () => {
    const startTime = performance.now();
    setLoadingCandidates(true);
    try {
      const res = await fetch("/api/candidates");
      const data = await res.json();
      if (data.candidates) {
        setCandidates(data.candidates);
      }
    } catch (err) {
      console.error("Error fetching candidates from node backend:", err);
    } finally {
      setLoadingCandidates(false);
      setApiLatency(Math.round(performance.now() - startTime));
    }
  };

  const fetchGamificationData = async () => {
    try {
      const res = await fetch("/api/gamification");
      const data = await res.json();
      if (data) {
        setGamification({
          profile: data.profile,
          leaderboard: data.leaderboard,
          contributions: data.contributions
        });
      }
    } catch (err) {
      console.error("Error fetching gamified leaderboard telemetry:", err);
    }
  };

  // 1. Trigger Lingual Translation
  const handleTranslateQuery = async (customQuery?: string, customLang?: string) => {
    const queryToUse = customQuery || regionalSearchQuery;
    const langToUse = customLang || selectedSourceLang;

    if (!queryToUse.trim()) return;

    setTranslatingInProgress(true);
    const startTime = performance.now();

    try {
      const res = await fetch("/api/translate-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToUse, sourceLang: langToUse })
      });
      const data = await res.json();

      setQueryTranslationLog({
        original: queryToUse,
        translated: data.translatedQuery,
        detectedLang: data.detectedLanguage || "Auto-detected",
        keywords: data.keywords || [],
        explanation: data.explanation || "Vernacular intent parsed by BHARAT pipeline."
      });

      // Automatically search/filter candidate roster on the English translation output
      setSearchFilter(data.translatedQuery);

      // Flash a quick informative hub toast
      showStatusNotification(`Query translated from ${data.detectedLanguage || 'regional language'}! Applied translated keyword search directly.`, 'info');

    } catch (err) {
      console.error("Linguistic translation api fail:", err);
      showStatusNotification("Translation processor timeout. Using query keywords directly.", "info");
      setSearchFilter(queryToUse);
    } finally {
      setTranslatingInProgress(false);
      setApiLatency(Math.round(performance.now() - startTime));
    }
  };

  // 2. Trigger Cognitive Match Dynamic Ranking
  const handleScoreAndRankCandidates = async () => {
    if (!jobDescriptionInput.trim()) return;

    setMatchingInProgress(true);
    const startTime = performance.now();
    showStatusNotification("Analyzing Job Context... Running server-side Gemini semantic candidate scorer...", "info");

    try {
      const res = await fetch("/api/match-candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jobDescriptionInput,
          userSelectedCandidates: candidates // Rank full pool
        })
      });
      const data = await res.json();

      if (data.candidates) {
        setCandidates(data.candidates);
        showStatusNotification(`Successfully ranked pool! Best Matches: ${data.candidates[0]?.name || 'N/A'} at ${data.candidates[0]?.matchScore}% score.`, "success");
      }
    } catch (err) {
      console.error("Match server api err:", err);
      showStatusNotification("Cognitive matchmaking error. Refined search manually.", "info");
    } finally {
      setMatchingInProgress(false);
      setApiLatency(Math.round(performance.now() - startTime));
    }
  };

  // 3. User contributes data (Earn points, levels up)
  const handleContributeLog = async (candidateId: string, contributionType: 'profile_verification' | 'placement_history' | 'skill_correction') => {
    const startTime = performance.now();
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId, contributionType })
      });
      const data = await res.json();

      if (data.success) {
        // Update local gamification records
        setGamification({
          profile: data.profile,
          leaderboard: gamification.leaderboard.map(entry => {
            if (entry.username === data.profile.username) {
              return {
                ...entry,
                points: data.profile.points,
                contributions: data.profile.contributions,
                badgeCount: data.profile.badges.length
              };
            }
            return entry;
          }).sort((a, b) => b.points - a.points),
          contributions: [
            {
              id: `contrib-${Date.now()}`,
              recruiterName: data.profile.fullName,
              type: contributionType,
              candidateName: candidates.find(c => c.id === candidateId)?.name || "Candidate",
              candidateId: candidateId,
              description: `Logged validation check for talent alignment fine-tuning.`,
              pointsEarned: data.pointsEarned,
              timestamp: new Date().toISOString()
            },
            ...gamification.contributions
          ]
        });

        // Trigger gorgeous confetti/badge sound or modal
        if (data.newbadge) {
          setFeedbackNotification({
            message: `🎉 LEVEL UP UNLOCKED! You unlocked the [${data.newbadge.name}] Badge! +${data.pointsEarned} BHARAT points.`,
            type: 'badge',
            customBadge: data.newbadge
          });
        } else if (data.levelUp) {
          showStatusNotification(`🌟 LEVEL UP! You reached Recruiter Level ${data.profile.level}! Keep verifying regional talent.`, 'success');
        } else {
          showStatusNotification(`Added Verification record! Earned +${data.pointsEarned} Bharat points.`, 'success');
        }
      }
    } catch (err) {
      console.error("Error logging database contributions:", err);
    } finally {
      setApiLatency(Math.round(performance.now() - startTime));
    }
  };

  // 4. Create Custom Profile Sourcing Action
  const handleAddCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateForm.name || !newCandidateForm.title) {
      showStatusNotification("Please fill required fields (Name and Proposed Role Title).", "info");
      return;
    }

    const startTime = performance.now();
    try {
      const payload: any = {
        name: newCandidateForm.name,
        title: newCandidateForm.title,
        currentCompany: newCandidateForm.currentCompany || "Freelance Solutions",
        experienceYears: newCandidateForm.experienceYears,
        location: newCandidateForm.location || "Remote",
        state: newCandidateForm.state || "India",
        skills: newCandidateForm.skillsString.split(",").map(sk => sk.trim()).filter(Boolean),
        regionalLanguages: newCandidateForm.regionalLanguagesString.split(",").map(l => l.trim()).filter(Boolean),
        contactEmail: newCandidateForm.contactEmail || "recruitment@bharat.dev",
        resumeSummary: newCandidateForm.resumeSummary || "Sourced and registered during BHARAT AI Talent Challenge.",
        multilingualBio: {}
      };

      if (newCandidateForm.regionalBioString.trim() && newCandidateForm.regionalLanguagesString) {
        const firstLang = newCandidateForm.regionalLanguagesString.split(",")[0].trim();
        payload.multilingualBio[firstLang || "Hindi"] = newCandidateForm.regionalBioString;
      }

      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        // Insert candidate onto state array locally
        setCandidates([data.candidate, ...candidates]);

        // Update gamification points stats immediately
        if (gamification.profile) {
          const updatedProfile = {
            ...gamification.profile,
            points: data.gamification.totalPoints,
            contributions: gamification.profile.contributions + 1,
            level: data.gamification.currentLevel
          };

          if (data.gamification.newbadge) {
            updatedProfile.badges = [...updatedProfile.badges, data.gamification.newbadge];
            setFeedbackNotification({
              message: `🎉 BHARAT AI badge unlocked: [${data.gamification.newbadge.name}]!`,
              type: 'badge',
              customBadge: data.gamification.newbadge
            });
          }

          setGamification({
            ...gamification,
            profile: updatedProfile,
            contributions: [
              {
                id: `contrib-${Date.now()}`,
                recruiterName: updatedProfile.fullName,
                type: "profile_verification",
                candidateName: data.candidate.name,
                candidateId: data.candidate.id,
                description: `Sourced regional resume profile [${data.candidate.name}] into verification stream.`,
                pointsEarned: 100,
                timestamp: new Date().toISOString()
              },
              ...gamification.contributions
            ]
          });
        }

        // Reset form
        setNewCandidateForm({
          name: "",
          title: "",
          currentCompany: "",
          experienceYears: 4,
          location: "",
          state: "",
          skillsString: "",
          regionalLanguagesString: "Hindi",
          contactEmail: "",
          resumeSummary: "",
          regionalBioString: ""
        });

        showStatusNotification(`Successfully contributed ${data.candidate.name} to the decentralised talent network! +100 Points added.`, 'success');
      }
    } catch (err) {
      console.error(err);
      showStatusNotification("Error dispatching profile telemetry to Indian Hub ledger.", "info");
    } finally {
      setApiLatency(Math.round(performance.now() - startTime));
    }
  };

  // Submission Pipeline Actions
  const handleGenerateDataset = async () => {
    try {
      showStatusNotification("Triggered 100k candidates.jsonl dataset generation!", "info");
      const res = await fetch("/api/pipeline/generate-dataset", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        fetchPipelineStatus();
      } else {
        showStatusNotification(data.error || "Failed to trigger dataset generation.", "info");
      }
    } catch (err) {
      showStatusNotification("Network error triggering dataset generator.", "info");
    }
  };

  const handleRunPipeline = async () => {
    try {
      showStatusNotification("Launching 100k Candidate Offline CPU Ranking Pipeline...", "info");
      const res = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jobDescriptionInput,
          sourceLanguage: selectedSourceLang
        })
      });
      const data = await res.json();
      if (res.ok) {
        fetchPipelineStatus();
      } else {
        showStatusNotification(data.error || "Failed to launch pipeline.", "info");
      }
    } catch (err) {
      showStatusNotification("Network error launching pipeline engine.", "info");
    }
  };

  const handleUpdatePipelineMetadata = async () => {
    try {
      const res = await fetch("/api/pipeline/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pipelineMetadata)
      });
      if (res.ok) {
        showStatusNotification("Official submission metadata saved!", "success");
        fetchPipelineStatus();
      }
    } catch (err) {
      showStatusNotification("Failed to update metadata.", "info");
    }
  };

  // File Sourcing Upload Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUploadedFile(e.target.files[0]);
    }
  };

  const handleUploadedFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        if (file.name.endsWith(".json")) {
          const json = JSON.parse(text);
          const list = Array.isArray(json) ? json : [json];
          await handleBulkImport(list);
        } else if (file.name.endsWith(".csv")) {
          const list = parseCSV(text);
          if (list.length > 0) {
            await handleBulkImport(list);
          } else {
            showStatusNotification("CSV file empty or missing valid headers.", "info");
          }
        } else {
          showStatusNotification("Unsupported file format. Please upload .json or .csv.", "info");
        }
      } catch (err: any) {
        showStatusNotification(`Parsing error: ${err.message}`, "info");
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
    const parsed: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",").map(v => v.trim().replace(/^["']|["']$/g, ""));
      if (row.length < headers.length) continue;

      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      parsed.push(obj);
    }
    return parsed;
  };

  // Bulk import candidates list helper
  const handleBulkImport = async (candidatesList: any[]) => {
    setBulkLoading(true);
    const startTime = performance.now();
    try {
      const res = await fetch("/api/candidates/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidatesList })
      });
      const data = await res.json();
      if (data.success && data.addedCount > 0) {
        // Prepend imported candidates
        setCandidates(prev => [...data.candidates, ...prev]);

        // Update gamification context if profile exists
        if (gamification.profile) {
          const updatedProfile = {
            ...gamification.profile,
            points: data.gamification.totalPoints,
            contributions: gamification.profile.contributions + data.addedCount,
            level: data.gamification.currentLevel
          };

          if (data.gamification.newbadge) {
            updatedProfile.badges = [...updatedProfile.badges, data.gamification.newbadge];
            setFeedbackNotification({
              message: `🎉 BHARAT AI badge unlocked: [${data.gamification.newbadge.name}]!`,
              type: 'badge',
              customBadge: data.gamification.newbadge
            });
          }

          setGamification({
            ...gamification,
            profile: updatedProfile,
            contributions: [
              {
                id: `contrib-${Date.now()}`,
                recruiterName: updatedProfile.fullName,
                type: "profile_verification",
                candidateName: `${data.addedCount} Imported Profiles`,
                candidateId: "bulk-import",
                description: `Sourced a bulk dataset batch of ${data.addedCount} candidate profiles into active pool.`,
                pointsEarned: data.gamification.pointsEarned,
                timestamp: new Date().toISOString()
              },
              ...gamification.contributions
            ]
          });
        }
        showStatusNotification(`Successfully imported dataset of ${data.addedCount} candidates! Sourcing score updated.`, 'success');
      } else {
        showStatusNotification("Import completed. No new unique profiles added.", "info");
      }
    } catch (err) {
      console.error(err);
      showStatusNotification("Failed to finalize bulk dataset registration.", "info");
    } finally {
      setBulkLoading(false);
      setApiLatency(Math.round(performance.now() - startTime));
    }
  };

  // Reset candidates database to baseline
  const handleResetDatabase = async () => {
    setBulkLoading(true);
    const startTime = performance.now();
    try {
      const res = await fetch("/api/candidates/reset", {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        setCandidates(data.candidates);
        showStatusNotification("Database reset to foundational sample pool (6 profiles). Initial state restored.", "success");
      }
    } catch (err) {
      console.error(err);
      showStatusNotification("Could not flush distributed database node.", "info");
    } finally {
      setBulkLoading(false);
      setApiLatency(Math.round(performance.now() - startTime));
    }
  };

  // Google Drive custom candidate dataset importer
  const handleImportFromDrive = async (customUrl?: string) => {
    const targetUrl = customUrl || driveUrlInput;
    if (!targetUrl.trim()) {
      showStatusNotification("Please input a valid Google Drive sharing link.", "info");
      return;
    }

    setBulkLoading(true);
    const startTime = performance.now();
    try {
      const res = await fetch("/api/candidates/import-drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driveUrl: targetUrl })
      });
      const data = await res.json();
      if (!res.ok) {
        showStatusNotification(data.error || "Failed to parse Google Drive stream node.", "info");
        return;
      }

      if (data.success && data.addedCount > 0) {
        setCandidates(prev => [...data.candidates, ...prev]);

        if (gamification.profile) {
          const updatedProfile = {
            ...gamification.profile,
            points: data.gamification.totalPoints,
            contributions: gamification.profile.contributions + data.addedCount,
            level: data.gamification.currentLevel
          };

          if (data.gamification.newbadge) {
            updatedProfile.badges = [...updatedProfile.badges, data.gamification.newbadge];
            setFeedbackNotification({
              message: `🎉 BHARAT AI badge unlocked: [${data.gamification.newbadge.name}]!`,
              type: 'badge',
              customBadge: data.gamification.newbadge
            });
          }

          setGamification({
            ...gamification,
            profile: updatedProfile,
            contributions: [
              {
                id: `contrib-drive-${Date.now()}`,
                recruiterName: updatedProfile.fullName,
                type: "profile_verification",
                candidateName: `${data.addedCount} Drive Records`,
                candidateId: "drive-bulk-import",
                description: `Successfully ingested a custom database stream of ${data.addedCount} candidate profiles from Google Drive.`,
                pointsEarned: data.gamification.pointsEarned,
                timestamp: new Date().toISOString()
              },
              ...gamification.contributions
            ]
          });
        }
        showStatusNotification(`Successfully synced! Ingested ${data.addedCount} candidate records from ${data.source}.`, 'success');
      }
    } catch (err: any) {
      console.error(err);
      showStatusNotification("Unexpected connection error with central node.", "info");
    } finally {
      setBulkLoading(false);
      setApiLatency(Math.round(performance.now() - startTime));
    }
  };

  // Helper notification dispatcher
  const showStatusNotification = (msg: string, type: 'success' | 'info' | 'badge') => {
    setFeedbackNotification({ message: msg, type });
    setTimeout(() => {
      setFeedbackNotification(prev => prev?.message === msg ? null : prev);
    }, 6000);
  };

  // Reset Matches to default initial values
  const handleResetFilters = () => {
    setSearchFilter("");
    setRegionalSearchQuery("");
    setQueryTranslationLog(null);
    setSelectedLanguageFilter("All");
    setSelectedLocationFilter("All");
    fetchCandidates();
    showStatusNotification("Reset active filters and cognitive scores. Reloaded foundational India pool.", "success");
  };

  // Perform quick client-side filtering on top of AI smart scores
  const filteredCandidates = candidates.filter(cand => {
    // 1. Text Search query (Checks alignment in English translation, name, skills or summaries)
    const matchesQuery = searchFilter.trim() === "" ||
      cand.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cand.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cand.skills.some(sk => sk.toLowerCase().includes(searchFilter.toLowerCase())) ||
      cand.resumeSummary.toLowerCase().includes(searchFilter.toLowerCase());

    // 2. Multilingual Dialect filter
    const matchesLanguage = selectedLanguageFilter === "All" ||
      cand.regionalLanguages.some(lang => lang.toLowerCase() === selectedLanguageFilter.toLowerCase());

    // 3. Indian Hub State filter
    const matchesLocation = selectedLocationFilter === "All" ||
      cand.location.toLowerCase() === selectedLocationFilter.toLowerCase() ||
      cand.state.toLowerCase() === selectedLocationFilter.toLowerCase();

    return matchesQuery && matchesLanguage && matchesLocation;
  });

  // Calculate high-fidelity stats
  const topMatch = candidates.length > 0 ? [...candidates].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))[0] : null;
  const verifiedCount = gamification.profile?.contributions || 0;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-300 selection:bg-indigo-500 selection:text-white ${theme === 'light'
        ? 'light-theme bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 text-slate-800'
        : 'dark-theme bg-slate-900 text-slate-100'
      }`}>

      {/* 1. Indian Tricolor Accent Top Stripe */}
      <div className="h-1.5 w-full flex">
        <div className="h-full flex-1 bg-amber-500"></div>
        <div className="h-full flex-1 bg-white"></div>
        <div className="h-full flex-1 bg-emerald-600"></div>
      </div>

      {/* 2. Main High-Contrast Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-[98%] xl:max-w-[96%] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-emerald-600 p-[2px]">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Globe className="h-5 w-5 text-indigo-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-display tracking-tight text-white">
                  BHARAT AI
                </h1>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Sourcing Co-Pilot
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Linguistic Translation & Cognitive Fit Sourcing Grid
              </p>
            </div>
          </div>

          {/* Node Operations Status Panel */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-lg font-bold transition-all duration-300 cursor-pointer select-none ${theme === 'light'
                  ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700'
                }`}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-slate-300 fill-slate-300" />
                  <span>SWITCH TO DARK</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-spin-slow" />
                  <span>SWITCH TO LIGHT</span>
                </>
              )}
            </button>

            {/* Live DB Indicator */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300">HUB STATUS: ACTIVE</span>
            </div>

            {/* Latency feedback indicator */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>Latency Index: <strong className="text-indigo-300">{apiLatency ? `${apiLatency}ms` : 'Calculating...'}</strong></span>
            </div>

            {/* Total verified telemetry count */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400">
              <Database className="h-3.5 w-3.5 text-amber-500" />
              <span>Vernacular Node Pool: <strong className="text-amber-400">{candidates.length}</strong></span>
            </div>
          </div>

        </div>
      </header>

      {/* 3. Global Toast / Hackathon Goal Notification Ledger */}
      {feedbackNotification && (
        <div className={`mx-auto mt-6 max-w-[98%] xl:max-w-[96%] w-full transition-all duration-300 ${feedbackNotification.type === 'badge'
            ? 'bg-gradient-to-r from-amber-500 via-red-500 to-indigo-600 p-0.5 rounded-2xl shadow-xl'
            : 'bg-indigo-950/80 border border-indigo-800/60 p-4 rounded-xl shadow-lg text-indigo-200'
          }`}>
          {feedbackNotification.type === 'badge' ? (
            <div className="bg-slate-950 rounded-[14px] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 shadow-md">
                  <Award className="h-8 w-8 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-display text-white">NEW BADGE UNLOCKED!</h4>
                  <p className="text-sm font-semibold text-amber-400">{feedbackNotification.customBadge?.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{feedbackNotification.customBadge?.description}</p>
                </div>
              </div>
              <button
                onClick={() => setFeedbackNotification(null)}
                className="text-xs font-mono uppercase bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-4 py-2 rounded-xl transition-colors"
              >
                Claim Points
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-indigo-400 animate-pulse" />
                <span>{feedbackNotification.message}</span>
              </div>
              <button
                onClick={() => setFeedbackNotification(null)}
                className="text-xs text-indigo-300 hover:text-white font-mono hover:underline pl-4"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Strategic Performance Metric Dashboard Widget Line */}
      <section className="px-4 md:px-8 pt-6 max-w-[98%] xl:max-w-[96%] mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Bharat-wide Pool</span>
              <span className="text-2xl font-bold font-display text-white">{candidates.length} <span className="text-xs font-mono font-normal text-slate-500">active</span></span>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">100% verified regional tech talent</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-indigo-400 shrink-0">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-300 font-bold block">Dialect Translation Nodes</span>
              <span className="text-2xl font-bold font-display text-emerald-400">7 Active</span>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">Hindi, Tamil, Kannada, Marathi, Bengali...</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-emerald-400 shrink-0">
              <Languages className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-300 font-bold block">Your Contribution Level</span>
              <span className="text-2xl font-bold font-display text-amber-400">
                Lvl {gamification.profile?.level || 3}
              </span>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">{gamification.profile?.points} Bharat Coins earned</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-amber-500 shrink-0">
              <Coins className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/70 border border-secondary p-4 rounded-2xl flex items-center justify-between gap-4 border border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-300 font-bold block">Peak Sourcing Match</span>
              <span className="text-2xl font-bold font-display text-white">
                {topMatch?.matchScore ? `${topMatch.matchScore}%` : "98% (Avg)"}
              </span>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">Top: {topMatch?.name || "Arjun Divakaran"}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-rose-500 shrink-0">
              <Flame className="h-5 w-5" />
            </div>
          </div>

        </div>
      </section>

      {/* 5. Main Double Layout Section Container */}
      <main className="flex-1 max-w-[98%] xl:max-w-[96%] mx-auto w-full px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ================= LEFT GRID: LINGUISTIC SEARCH, JD ANALYSIS AND CONTRIBUTE FORM ================= */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-6 flex flex-col h-full min-h-[400px]">

          {/* Navigation Tab selection for Left Controller */}
          <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setLeftTab('translate')}
              className={`flex-1 text-center py-2 text-[10.5px] font-display font-medium rounded-lg transition-all ${leftTab === 'translate' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'}`}
            >
              Linguistic
            </button>
            <button
              onClick={() => setLeftTab('jd')}
              className={`flex-1 text-center py-2 text-[10.5px] font-display font-medium rounded-lg transition-all ${leftTab === 'jd' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'}`}
            >
              Cognitive
            </button>
            <button
              onClick={() => setLeftTab('add')}
              className={`flex-1 text-center py-2 text-[10.5px] font-display font-medium rounded-lg transition-all ${leftTab === 'add' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'}`}
            >
              Contribute
            </button>
            <button
              onClick={() => setLeftTab('dataset')}
              className={`flex-1 text-center py-2 text-[10.5px] font-display font-medium rounded-lg transition-all ${leftTab === 'dataset' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'}`}
            >
              Official Pipeline
            </button>
          </div>

          {/* TAB 1: LATENCY-OPTIMIZED REGIONAL LANGUAGE PREPROCESSOR */}
          {leftTab === 'translate' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 flex-1">
              <div>
                <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Languages className="h-5 w-5 text-indigo-400" /> Vernacular Sourcing Port
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Type or selection query below in Hindi, Tamil, Kannada, Marathi, Hinglish, Bengali, etc. The Indian Linguistic AI Parser translates it instantly into structured keywords to bypass literal text match.
                </p>
              </div>

              {/* Languages suggestion dropdown overlay */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Select Input Accent / Dialect</label>
                <div className="flex gap-2">
                  <select
                    value={selectedSourceLang}
                    onChange={(e) => setSelectedSourceLang(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Auto-detect">✨ Auto-Detect Indian Dialect</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                    <option value="Marathi">Marathi (मराठी)</option>
                    <option value="Bengali">Bengali (বাংলা)</option>
                    <option value="Bhojpuri">Bhojpuri / Hinglish</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Textarea */}
              <div className="space-y-2">
                <textarea
                  value={regionalSearchQuery}
                  onChange={(e) => setRegionalSearchQuery(e.target.value)}
                  placeholder="e.g. बेंगलुरु में ६ साल का अनुभवी पायथॉन इंजीनियर चाहिए (Search in any regional language / dialect or type keywords...)"
                  className="w-full h-28 text-sm p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleTranslateQuery()}
                    disabled={translatingInProgress || !regionalSearchQuery.trim()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl text-xs font-bold font-display transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {translatingInProgress ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" /> Translating Vernacular Query...
                      </>
                    ) : (
                      <>
                        <Languages className="h-4 w-4" /> AI Translate & Apply Filter
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleResetFilters}
                    className="p-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all text-xs"
                    title="Reset Filter"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Template quick inject buttons */}
              <div className="space-y-1.5 pt-2 border-t border-slate-900">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Quick-Test India Talent Samples:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {MULTILINGUAL_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setRegionalSearchQuery(tmpl.query);
                        setSelectedSourceLang(tmpl.lang);
                        handleTranslateQuery(tmpl.query, tmpl.lang);
                      }}
                      className="text-left text-[10px] p-2 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 text-slate-300 rounded-lg border border-slate-800/80 leading-normal transition-all truncate"
                    >
                      💡 <strong className="text-indigo-400">{tmpl.label}:</strong> "{tmpl.query}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Query Translation Output Panel */}
              {queryTranslationLog && (
                <div className="bg-slate-900/80 border border-indigo-950 p-4 rounded-xl space-y-2 mt-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-[10px] font-mono border-b border-indigo-900/50 pb-1.5">
                    <span className="text-slate-400">DETECTED DIALECT: <strong className="text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded uppercase">{queryTranslationLog.detectedLang}</strong></span>
                    <span className="text-indigo-400">BHARAT LINGUISTIC PIPELINE</span>
                  </div>

                  <p className="text-xs text-slate-300 font-mono italic">
                    " {queryTranslationLog.original} "
                  </p>

                  <div className="text-xs text-indigo-200 bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-950/40">
                    <span className="text-[10px] uppercase font-mono text-indigo-400 font-semibold block mb-0.5">Parsed English Translation:</span>
                    {queryTranslationLog.translated}
                  </div>

                  {queryTranslationLog.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 text-slate-300 text-[10px]">
                      <span className="font-semibold text-slate-400 mr-1 mt-0.5">Tags:</span>
                      {queryTranslationLog.keywords.slice(0, 5).map((kw, i) => (
                        <span key={i} className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded-md font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: ADVANCED SEMANTIC JOB DESCRIPTION MATCH FILTER */}
          {leftTab === 'jd' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 flex-1">
              <div>
                <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-indigo-400" /> Semantic Job Scorer
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Rather than matching exact skill strings, BHARAT AI reads whole job descriptions, models requirements, and compares them against candidates' experience, regional dialect profiles, stability indicators, and platforms metrics.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Paste Complex Job Description (JD):</label>
                <textarea
                  value={jobDescriptionInput}
                  onChange={(e) => setJobDescriptionInput(e.target.value)}
                  className="w-full h-36 text-xs p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <button
                onClick={handleScoreAndRankCandidates}
                disabled={matchingInProgress || !jobDescriptionInput.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold font-display transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {matchingInProgress ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" /> Matching & Analyzing Pool (Gemini Flash)...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" /> Cognitive Score Candidate Pool
                  </>
                )}
              </button>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400">
                <strong className="text-slate-300">💡 Winning Strategy Hack:</strong> Traditional boolean search fails to screen candidates for tenure reliability or multiregional communication abilities. This tool automatically factors in candidate's **Tenure Stability Rating** (Loyalty) and **Platform Activity Score** to output an explicit **Placement Probability Ratio** alongside semantic fit.
              </div>
            </div>
          )}

          {/* TAB 3: CONTRIBUTE REGIONAL TALENT (GAMIEFIED PROFILE SOURCE) */}
          {leftTab === 'add' && (
            <form onSubmit={handleAddCandidateSubmit} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3.5 flex-1 overflow-y-auto max-h-[700px]">
              <div>
                <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-indigo-400" /> Sourcing Ledger Contribution
                </h3>
                <p className="text-xs text-slate-400">
                  Input localized technical resumes. Earn **+100 Bharat Points** immediately to boost your hub on the live leaderboard!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">FullName *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={newCandidateForm.name}
                    onChange={(e) => setNewCandidateForm({ ...newCandidateForm, name: e.target.value })}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Backend Lead"
                    value={newCandidateForm.title}
                    onChange={(e) => setNewCandidateForm({ ...newCandidateForm, title: e.target.value })}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Exp (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    placeholder="4"
                    value={newCandidateForm.experienceYears}
                    onChange={(e) => setNewCandidateForm({ ...newCandidateForm, experienceYears: Number(e.target.value) })}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Location Hub</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune"
                    value={newCandidateForm.location}
                    onChange={(e) => setNewCandidateForm({ ...newCandidateForm, location: e.target.value })}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={newCandidateForm.state}
                    onChange={(e) => setNewCandidateForm({ ...newCandidateForm, state: e.target.value })}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Technical Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Node.js, Express, PyTorch, SQL"
                  value={newCandidateForm.skillsString}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, skillsString: e.target.value })}
                  className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Regional Dialects Known (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Marathi, Hindi, English"
                  value={newCandidateForm.regionalLanguagesString}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, regionalLanguagesString: e.target.value })}
                  className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Regional Language Bio Abstract (Optional)</label>
                <textarea
                  placeholder="e.g. पुण्यात ४ वर्ष काम केलेला... (Marathi description to enhance regional linguistic matches)"
                  value={newCandidateForm.regionalBioString}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, regionalBioString: e.target.value })}
                  className="w-full h-14 text-xs p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">English Resume Abstract / Summary</label>
                <textarea
                  placeholder="Comprehensive career background or primary project metrics..."
                  value={newCandidateForm.resumeSummary}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, resumeSummary: e.target.value })}
                  className="w-full h-16 text-xs p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Contact Email</label>
                <input
                  type="email"
                  placeholder="ramesh.patel@mumbaicorps.in"
                  value={newCandidateForm.contactEmail}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, contactEmail: e.target.value })}
                  className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs font-display tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="h-3.5 w-3.5" /> Publish to Talent Ledger (+100 Pts)
              </button>
            </form>
          )}

          {leftTab === 'dataset' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 flex-1 overflow-y-auto max-h-[850px] flex flex-col">

              {/* HEADER */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-indigo-400" /> Challenge Submission Pipeline
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Official Engine
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ingest large datasets, run offline local CPU ranking models (zero LLM latency constraints), validate schema formats, and compile compliant submission CSV files.
                </p>
              </div>

              {/* PIPELINE LIVE STATUS INDICATORS */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Dataset Ingestion Source</span>
                    <span className="text-xs font-bold text-slate-200 block font-mono">candidates.jsonl</span>
                  </div>
                  <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded-md font-bold ${datasetFileExists ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40" : "bg-amber-950/40 text-amber-400 border border-amber-900/40 animate-pulse"}`}>
                    {datasetFileExists ? "100K READABLE" : "MISSING"}
                  </span>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Compiled Output File</span>
                    <span className="text-xs font-bold text-slate-200 block font-mono">submission.csv</span>
                  </div>
                  <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded-md font-bold ${submissionFileExists ? "bg-indigo-950/40 text-indigo-400 border border-indigo-900/40" : "bg-slate-900 text-slate-500 border border-slate-800"}`}>
                    {submissionFileExists ? "READY" : "NOT FOUND"}
                  </span>
                </div>
              </div>

              {/* STEP 1: HIGH-SCALE DATASET SETUP */}
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-mono font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    Step 1: Dataset Loader & Ingestion (100k Pool)
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The evaluation suite targets a massive 100k pool from <code className="bg-slate-950 text-indigo-300 px-1 py-0.5 rounded font-mono text-[10px]">candidates.jsonl</code>. If not present in your workspace, click below to generate a high-fidelity dataset containing real benchmark profiles, behavioral signals, and hidden traps.
                </p>

                {pipelineState.isGenerating ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Writing JSON Lines stream...</span>
                      <span>{pipelineState.generationProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${pipelineState.generationProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateDataset}
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 py-2 rounded-lg text-xs font-semibold cursor-pointer select-none transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="h-3 w-3 text-indigo-400" />
                    {datasetFileExists ? "Re-generate & Refresh 100K JSONL Dataset" : "Generate 100K Benchmark Candidates Dataset"}
                  </button>
                )}
              </div>

              {/* STEP 2: OFFLINE LOCAL CPU RANKING */}
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-mono font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Step 2: Local CPU Heuristic Ranking Engine
                  </span>
                  <span className="text-[9px] bg-slate-950 text-emerald-400 border border-emerald-950 px-1.5 py-0.5 rounded font-mono font-bold">
                    CPU-Only (Zero LLM Costs)
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Processes candidates.jsonl line-by-line in a high-efficiency memory buffer. Standardizes requirements, applies regional dialect matching weight, filters Redrob behavioral signals, and eliminates honeypots. Evaluates all 100k profiles under 2 seconds!
                </p>

                <div className="space-y-2">
                  <label htmlFor="pipeline-jd-preview" className="text-[10.5px] text-slate-400 font-medium block">
                    Active Job Description Target query:
                  </label>
                  <textarea
                    id="pipeline-jd-preview"
                    disabled={pipelineState.isRanking}
                    className="w-full h-16 text-[10.5px] p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono focus:outline-none"
                    value={jobDescriptionInput}
                    onChange={(e) => setJobDescriptionInput(e.target.value)}
                  />
                </div>

                {pipelineState.isRanking ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Streaming & Scoring pool...</span>
                      <span>{pipelineState.rankingProgress}% ({pipelineState.totalCandidatesProcessed}/100k)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${pipelineState.rankingProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={!datasetFileExists}
                    onClick={handleRunPipeline}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2 rounded-lg text-xs font-bold cursor-pointer select-none transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Launch 100K Ranking Pipeline Run
                  </button>
                )}
              </div>

              {/* STEP 3: SUBMISSION VALIDATOR REPORT */}
              {pipelineState.lastValidationResult && (
                <div className={`p-4 rounded-xl border ${pipelineState.lastValidationResult.success ? "bg-emerald-950/20 border-emerald-900/40" : "bg-red-950/20 border-red-900/40"} space-y-2.5`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-mono font-bold text-slate-300 uppercase tracking-wide block">
                      Step 3: Submission Validator Suite (validate_submission.py)
                    </span>
                    <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded font-bold ${pipelineState.lastValidationResult.success ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                      {pipelineState.lastValidationResult.success ? "PASSING" : "FAILED"}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono">
                    {pipelineState.lastValidationResult.report.map((line, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="text-slate-200">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: OUTPUT DOWNLOAD submission.csv */}
              {submissionFileExists && (
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-3">
                  <span className="text-[10.5px] font-mono font-bold text-slate-300 uppercase tracking-wide block">
                    Step 4: Export Certified submission.csv File
                  </span>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    The CSV format contains precisely <code className="bg-slate-950 text-indigo-300 px-1 py-0.5 rounded font-mono text-[10px]">candidate_id, rank, score, reasoning</code> for the Top 100 benchmark outcomes. Ready for instant submission.
                  </p>

                  <a
                    href="/api/pipeline/download"
                    download="submission.csv"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer select-none decoration-none text-center"
                  >
                    <Download className="h-4 w-4" /> Download submission.csv
                  </a>
                </div>
              )}

              {/* LIVE TERMINAL SCREEN */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden">
                <div className="bg-slate-900/80 px-3 py-1.5 flex items-center justify-between border-b border-slate-850">
                  <span className="text-[9.5px] font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="h-3 w-3" /> Live Pipeline Stream Console Log
                  </span>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 bg-rose-500 rounded-full"></span>
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full"></span>
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                  </div>
                </div>
                <div className="p-3 h-32 overflow-y-auto font-mono text-[9.5px] text-slate-400 space-y-1 bg-slate-950/90 leading-tight">
                  {pipelineState.logs.length === 0 ? (
                    <div className="text-slate-600 italic">No logs compiled yet. Launch dataset or run rankers to stream events...</div>
                  ) : (
                    pipelineState.logs.map((log, idx) => (
                      <div key={idx} className="truncate">
                        <span className="text-indigo-500">❯</span> {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* LIVE PIPELINE PREVIEW OF THE TOP 100 */}
              {pipelineState.top100 && pipelineState.top100.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10.5px] font-mono font-bold text-slate-300 uppercase tracking-wide block">
                    Top 15 Ranked Candidates (Compliant Preview)
                  </span>

                  <div className="border border-slate-850 rounded-xl overflow-hidden bg-slate-950 text-[10px] font-mono">
                    <div className="grid grid-cols-12 bg-slate-900 p-2 border-b border-slate-850 font-bold text-slate-300 text-center">
                      <div className="col-span-2">Rank</div>
                      <div className="col-span-3 text-left">Candidate ID</div>
                      <div className="col-span-4 text-left">Benchmark Name</div>
                      <div className="col-span-3">Score / Match</div>
                    </div>

                    <div className="divide-y divide-slate-850 max-h-48 overflow-y-auto">
                      {pipelineState.top100.slice(0, 15).map((cand, idx) => (
                        <div key={idx} className="grid grid-cols-12 p-2 hover:bg-slate-900/50 text-slate-400 items-center text-center">
                          <div className="col-span-2 text-slate-200 font-bold">#{idx + 1}</div>
                          <div className="col-span-3 text-left text-slate-300 font-bold">{cand.candidate_id}</div>
                          <div className="col-span-4 text-left truncate font-sans text-[11px] text-slate-100">{cand.name}</div>
                          <div className="col-span-3 text-indigo-400 font-bold">{cand.score}/100</div>
                          <div className="col-span-12 text-left text-[9px] text-slate-500 px-2 pt-1 border-t border-slate-900/50 bg-slate-950/20 italic font-sans">
                            Reasoning: {cand.reasoning}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Winning Pitch Strategy highlight panel */}
          <div className="bg-slate-950/40 border border-slate-800 p-4.5 rounded-2xl">
            <h4 className="text-xs font-bold text-amber-400 font-display flex items-center gap-1.5 uppercase tracking-wide">
              🇮🇳 Strategic Platform Concept
            </h4>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              <strong>Decentralised Crowdsourced Placement Verification System</strong>: Instead of standard databases that deteriorate, BHARAT AI creates a self-healing ledger. Recruiters are rewarded with digital tokens and digital credential badges for providing actual, real-world data corrections (e.g. verifying true tenure loyalty or dialect capabilities).
            </p>
            <div className="mt-3 flex gap-1.5 flex-wrap">
              <span className="text-[9px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-900/50 px-2 py-0.5 rounded">Semantic Hybrid Scoring</span>
              <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded">High Concurrency Ready</span>
              <span className="text-[9px] font-mono bg-rose-950 text-rose-400 border border-rose-900/50 px-2 py-0.5 rounded">Regional Calibration</span>
            </div>
          </div>

        </div>

        {/* ================= MIDDLE GRID: DEEP INTELLIGENT CANDIDATE STREAM ================= */}
        <div className="lg:col-span-8 xl:col-span-5 space-y-6">

          {/* Real-time search filters controller */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter pool (e.g. 'PyTorch', 'React', 'Noida')..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter("")}
                    className="absolute right-3 top-2.5 text-[10px] text-slate-500 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Reset to show original */}
              <button
                onClick={handleResetFilters}
                className="w-full sm:w-auto px-4 py-2 border border-slate-800 hover:bg-slate-900 hover:text-white text-slate-300 rounded-xl text-xs font-mono transition-colors flex items-center justify-center gap-1 shrink-0"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reload Pool
              </button>
            </div>

            {/* Quick multi-dialect query filtering select tags */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-mono font-semibold text-[10px] uppercase">Dialect:</span>
                <select
                  value={selectedLanguageFilter}
                  onChange={(e) => setSelectedLanguageFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All regional languages</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Malayalam">Malayalam (മലയാളം)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-mono font-semibold text-[10px] uppercase">State Hub:</span>
                <select
                  value={selectedLocationFilter}
                  onChange={(e) => setSelectedLocationFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Sourcing Locations</option>
                  <option value="Bengaluru">Bengaluru (Karnataka)</option>
                  <option value="Noida">Noida (Delhi/NCR)</option>
                  <option value="Chennai">Chennai (Tamil Nadu)</option>
                  <option value="Pune">Pune (Maharashtra)</option>
                  <option value="Patna">Patna (Bihar)</option>
                  <option value="Kolkata">Kolkata (West Bengal)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Intelligently Sorted Pool Stream Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-indigo-400 tracking-wider">
                Discovery shortlist
              </span>
              <span className="bg-slate-800 text-slate-200 text-[10px] px-2.5 py-0.5 rounded-full font-mono">
                {filteredCandidates.length}/600 matches
              </span>
            </div>

            {/* Quick Export action banner */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const content = JSON.stringify(filteredCandidates, null, 2);
                  const blob = new Blob([content], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `bharat-ai-shortlist-${Date.now()}.json`;
                  a.click();
                  showStatusNotification("Shortlist exported to JSON! Dynamic calibration successful.", "success");
                }}
                className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
                title="Synchronise to Enterprise Sourcing Ledger"
              >
                <Share2 className="h-3 w-3" /> Transmit to HRIS Ledger
              </button>
            </div>
          </div>

          {/* Candidates Stream Rendering */}
          {loadingCandidates ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-950 border border-slate-800 rounded-2xl p-6 h-56 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-5 bg-slate-800 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  </div>
                  <div className="h-10 bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto animate-bounce" />
              <div>
                <h4 className="text-base font-bold text-slate-200 font-display">No Sourced Profiles Match Selected Filters</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting language or location constraints, or hit "Reload Pool" above to retrieve all validated foundational entries.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs px-4 py-2 rounded-xl transition-all"
                >
                  Reset Active Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[1400px] overflow-y-auto pr-1">
              {filteredCandidates.map((cand) => (
                <CandidateCard
                  key={cand.id}
                  candidate={cand}
                  onContribute={handleContributeLog}
                />
              ))}
            </div>
          )}

        </div>

        {/* ================= RIGHT GRID: GAMIFICATION HUB, BADGES AND LEADERBOARD ================= */}
        <div className="lg:col-span-12 xl:col-span-3 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-1 gap-6">

          {/* Active Profile Stat card */}
          {gamification.profile && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 overflow-hidden relative">

              {/* Background Ambient Aura */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl"></div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-base font-bold font-mono">
                  {gamification.profile.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight font-display">
                    {gamification.profile.fullName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono text-slate-400">
                      {gamification.profile.regionalHub}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coins & Level breakdown */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60 text-center">
                  <span className="text-[9px] text-slate-400 font-mono uppercase block font-semibold">Coins Earned</span>
                  <div className="flex items-center justify-center gap-1 text-amber-400 mt-0.5">
                    <Coins className="h-3.5 w-3.5 fill-amber-500/20" />
                    <span className="text-sm font-bold font-mono">{gamification.profile.points}</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60 text-center">
                  <span className="text-[9px] text-slate-400 font-mono uppercase block font-semibold">Verification Level</span>
                  <div className="flex items-center justify-center gap-1 mt-0.5 text-indigo-400">
                    <Flame className="h-3.5 w-3.5" />
                    <span className="text-sm font-bold font-mono">Level {gamification.profile.level}</span>
                  </div>
                </div>
              </div>

              {/* Progress to next level bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span>Level-up Progress</span>
                  <span>{gamification.profile.points % 600} / 600 pts</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${((gamification.profile.points % 600) / 600) * 100}%` }}
                  />
                </div>
              </div>

              {/* Interactive Sourced Dialects Tracker Widget */}
              <div className="bg-indigo-950/20 border border-indigo-950/40 p-3 rounded-xl space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-indigo-300 font-mono">
                  <span>Hub Dialects Calibrated</span>
                  <span className="font-bold">4 / 7</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-mono">Marathi ✓</span>
                  <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-mono">Hindi ✓</span>
                  <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-mono">Kannada ✓</span>
                  <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-mono">Tamil ✓</span>
                  <span className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[9px] font-mono">Bengali –</span>
                </div>
              </div>

              {/* Digital Badges showcase rendering */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">
                  Digital Badges ({gamification.profile.badges.length})
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {gamification.profile.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all p-2.5 rounded-xl flex items-center gap-2"
                      title={badge.description}
                    >
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shrink-0">
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-200 truncate">{badge.name}</p>
                        <span className="text-[8px] font-mono text-amber-500 uppercase font-bold tracking-wider">{badge.tier}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Sourcing Hub Leaderboard Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" /> Regional Hub Sourcing Leaderboard
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Indian sourcing clusters competing live for verification accuracy.
              </p>
            </div>

            <div className="space-y-2">
              {gamification.leaderboard.map((user) => (
                <div
                  key={user.username}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all text-xs font-mono ${user.isCurrentUser
                      ? 'bg-indigo-950/40 border-indigo-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${user.rank === 1 ? 'bg-amber-500 text-slate-950' :
                        user.rank === 2 ? 'bg-slate-300 text-slate-950' :
                          user.rank === 3 ? 'bg-amber-700 text-white' :
                            'bg-slate-800 text-slate-400'
                      }`}>
                      {user.rank}
                    </span>
                    <div className="leading-tight min-w-0">
                      <p className="font-bold text-slate-100 truncate">{user.fullName}</p>
                      <span className="text-[9px] text-slate-400 block truncate">{user.regionalHub}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-1.5">
                    <span className="font-bold text-amber-400 font-mono block">
                      {user.points} <span className="text-[9px] font-normal text-slate-400">pts</span>
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono block">
                      {user.contributions} verifs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Crowdsourced contributions Log */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3.5">
            <div>
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" /> Decentralized Verification Log
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Live verification transactions contributing on alignment models.
              </p>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {gamification.contributions.map((contrib, idx) => (
                <div key={contrib.id || idx} className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-900/80 space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 leading-none">
                    <span className="truncate max-w-[120px] font-semibold text-slate-300">{contrib.recruiterName}</span>
                    <span>{new Date(contrib.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[10px] text-indigo-300 leading-tight">
                    {contrib.type === 'placement_history' ? '🏆 Placement Audited' : contrib.type === 'skill_correction' ? '🔧 Skill Tag Calibrated' : '✓ Bio Verified'}:
                    <strong className="text-white ml-1 font-sans">{contrib.candidateName}</strong>
                  </p>
                  <p className="text-[9px] text-slate-500 font-mono italic truncate">
                    {contrib.description}
                  </p>
                  <div className="flex items-center justify-between text-[8px] font-mono text-emerald-400">
                    <span>Token rewards:</span>
                    <span>+{contrib.pointsEarned} BHARAT COINS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* 6. Footer section displaying regional sourcing overview */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-[98%] xl:max-w-[96%] mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="h-1.5 w-6 bg-amber-500 rounded"></div>
            <span className="font-display font-bold text-white tracking-wider uppercase text-[10px]">BHARAT AI Talent Discovery Platform</span>
            <div className="h-1.5 w-6 bg-emerald-600 rounded"></div>
          </div>
          <p className="max-w-2xl mx-auto leading-relaxed">
            Engineered as a robust multi-dialect concept for regional talent discovery. High-efficiency linguistic translation combined with peer-validated verification ledger ensures standard matching engines bypass the raw English keyword barrier. Output synced dynamically to local node end-points.
          </p>

        </div>
      </footer>

    </div>
  );
}
