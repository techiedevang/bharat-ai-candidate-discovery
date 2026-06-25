import React, { useState } from "react";
import { 
  Sparkles, 
  MapPin, 
  Award, 
  CheckCircle, 
  Languages, 
  Clock, 
  UserCheck,
  Star,
  Activity,
  ThumbsUp,
  AlertTriangle,
  Send,
  Check
} from "lucide-react";
import { Candidate } from "../types";

interface CandidateCardProps {
  key?: string;
  candidate: Candidate;
  onContribute: (candidateId: string, contributionType: 'profile_verification' | 'placement_history' | 'skill_correction') => Promise<void>;
}

export default function CandidateCard({ candidate, onContribute }: CandidateCardProps) {
  const [selectedLang, setSelectedLang] = useState<string>("English");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState<boolean>(false);
  const [selectedContribType, setSelectedContribType] = useState<'profile_verification' | 'placement_history' | 'skill_correction'>('profile_verification');
  const [successMsg, setSuccessMsg] = useState<string>("");

  const handleVerificationSubmit = async () => {
    setIsVerifying(true);
    try {
      await onContribute(candidate.id, selectedContribType);
      setVerifiedSuccess(true);
      setSuccessMsg(
        selectedContribType === 'placement_history' 
          ? "Placement confirmed! +150 BHARAT Coins granted." 
          : selectedContribType === 'skill_correction'
          ? "Skills corrected! +80 BHARAT Coins granted."
          : "Profile verified! +50 BHARAT Coins granted."
      );
      setTimeout(() => {
        setVerifiedSuccess(false);
      }, 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  // Score badge color calculation
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 70) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const getPercentageColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 70) return 'text-amber-500 stroke-amber-500';
    return 'text-blue-500 stroke-blue-500';
  };

  return (
    <div 
      className={`relative bg-white rounded-2xl border ${candidate.isHoneypot ? 'border-red-200 bg-red-50/10' : 'border-slate-100'} shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden flex flex-col md:flex-row p-6 md:p-8 gap-6`}
      id={`candidate-card-${candidate.id}`}
    >
      {/* Top Banner Accent */}
      {candidate.isHoneypot ? (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] uppercase tracking-widest font-mono font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
          <AlertTriangle className="h-3 w-3 animate-bounce" /> Honeypot Warning
        </div>
      ) : candidate.matchScore && candidate.matchScore >= 85 ? (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] uppercase tracking-widest font-mono font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
          <Sparkles className="h-3 w-3 animate-pulse" /> Strong Fit
        </div>
      ) : null}

      {/* Left section: Identity, Language Translation, and Bio */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div>
          {candidate.isHoneypot && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 items-start text-red-800">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <span className="text-xs font-bold block uppercase tracking-wider font-mono">⚠️ SHIELD SECURE: Honeypot Decoy Detected</span>
                <span className="text-[11px] leading-tight font-mono">{candidate.honeypotReason}</span>
              </div>
            </div>
          )}

          {/* Rank & Basic Info */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-display text-slate-800 leading-tight">
                  {candidate.name}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/50">
                  {candidate.id}
                </span>
              </div>
              <p className="text-sm font-medium text-indigo-600 mt-1 font-sans">
                {candidate.title}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-mono">
                <MapPin className="h-3.5 w-3.5 text-rose-500" /> {candidate.location}, {candidate.state}
              </p>
            </div>

            {/* Platform Activity Ring */}
            <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 font-medium">Activity Index</span>
              <span className="text-base font-bold font-mono text-slate-800">{candidate.platformActivityScore}/100</span>
            </div>
          </div>

          {/* Experience & Company history */}
          <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/40">
            <span>
              <strong>Exp: </strong>{candidate.experienceYears} Years
            </span>
            <span className="text-slate-300">|</span>
            <span className="truncate">
              <strong>Current: </strong>{candidate.currentCompany}
            </span>
          </div>

          {/* Resume Summary with Language Translation Tab Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Languages className="h-3.5 w-3.5 text-indigo-500" /> Profile Abstract
              </span>
              
              {/* Language Switch Tabs */}
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setSelectedLang("English")} 
                  className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-colors ${selectedLang === "English" ? "bg-indigo-100 text-indigo-700 font-bold" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
                >
                  English
                </button>
                {candidate.multilingualBio && Object.keys(candidate.multilingualBio).map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setSelectedLang(lang)} 
                    className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-colors ${selectedLang === lang ? "bg-indigo-100 text-indigo-700 font-bold" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Translation render block */}
            <p className="text-sm text-slate-600 leading-relaxed italic bg-indigo-50/20 p-3 rounded-xl border border-indigo-50/40 font-sans">
              {selectedLang === "English" 
                ? candidate.resumeSummary 
                : (candidate.multilingualBio && candidate.multilingualBio[selectedLang]) || candidate.resumeSummary}
            </p>
          </div>
        </div>

        {/* Skills alignment */}
        <div className="space-y-2">
          {/* Matched Skills */}
          {candidate.skillsAnalysis ? (
            <>
              {candidate.skillsAnalysis.matched.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-mono uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">Matched Skills:</span>
                  {candidate.skillsAnalysis.matched.map(skill => (
                    <span key={skill} className="text-xs font-medium px-2 py-0.5 bg-slate-50 text-slate-700 rounded-md border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {candidate.skillsAnalysis.missing.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Other Skills:</span>
                  {candidate.skillsAnalysis.missing.map(skill => (
                    <span key={skill} className="text-xs font-mono px-2 py-0.5 text-slate-400 bg-slate-50/50 rounded-md border border-slate-100">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold border-b border-light pb-0.5">Primary Skills:</span>
              {candidate.skills.map(skill => (
                <span key={skill} className="text-xs font-medium px-2.5 py-0.5 bg-slate-50 text-slate-700 rounded-md border border-slate-200/50">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Redrob 23 Behavioral Signals Dashboard */}
        {candidate.redrobSignals && (
          <div className="mt-4 pt-3 border-t border-dashed border-slate-100 space-y-2">
            <span className="text-[10px] font-mono font-bold text-indigo-700 block uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-600 animate-pulse" /> Redrob Talent Intelligence (23 Behavioral Signals)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Notice Period</span>
                <span className="font-semibold text-slate-800">{candidate.redrobSignals.noticePeriodDays} Days</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Work Mode</span>
                <span className="font-semibold text-slate-800 capitalize">{candidate.redrobSignals.preferredWorkMode}</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Relocation</span>
                <span className={`font-semibold ${candidate.redrobSignals.willingToRelocate ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {candidate.redrobSignals.willingToRelocate ? 'Willing' : 'On-Site/Local'}
                </span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Expected Salary</span>
                <span className="font-semibold text-slate-800">{candidate.redrobSignals.expectedSalaryLpaMin}-{candidate.redrobSignals.expectedSalaryLpaMax} LPA</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Response Speed</span>
                <span className="font-semibold text-slate-800">{candidate.redrobSignals.avgResponseTimeHours} hrs avg</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">GitHub Intensity</span>
                <span className="font-semibold text-slate-800">{candidate.redrobSignals.githubActivityScore}/100</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Views (30d)</span>
                <span className="font-semibold text-slate-800">{candidate.redrobSignals.profileViews30d} views</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Apps (30d)</span>
                <span className="font-semibold text-slate-800">{candidate.redrobSignals.applications30d} apps</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100 flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Offer Acceptance</span>
                <span className="font-semibold text-slate-800">{candidate.redrobSignals.offerAcceptanceRate >= 0 ? `${Math.floor(candidate.redrobSignals.offerAcceptanceRate * 100)}%` : 'N/A'}</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100 col-span-3">
                <span className="text-[9px] text-slate-400 block uppercase font-bold mb-1">BHARAT Verified Identity Keys</span>
                <div className="flex gap-1.5 flex-wrap">
                  {candidate.redrobSignals.verifiedEmail && <span className="bg-emerald-50 text-emerald-800 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase border border-emerald-200">Email HMAC Auth</span>}
                  {candidate.redrobSignals.verifiedPhone && <span className="bg-emerald-50 text-emerald-800 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase border border-emerald-200">OTP verified</span>}
                  {candidate.redrobSignals.linkedinConnected && <span className="bg-indigo-50 text-indigo-800 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase border border-indigo-200">LinkedIn verified</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: AI Scores, Behavioral Radar, & Verification Contribution Terminal */}
      <div className="w-full md:w-72 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
        
        {/* Match Fit Score display */}
        {candidate.matchScore != null ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Semantic Validation</span>
              <span className={`text-xs font-bold font-mono px-2.5 py-1 border rounded-lg ${getScoreColor(candidate.matchScore)}`}>
                {candidate.matchScore}% Fit Match
              </span>
            </div>

            {/* Double Radial Metric Displays */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-400 font-semibold block leading-tight">Career Match Strength</span>
                <span className={`text-lg font-bold font-mono block ${candidate.matchScore >= 80 ? 'text-emerald-600' : 'text-indigo-600'}`}>{candidate.matchScore}%</span>
              </div>
              <div className="text-center border-l border-slate-200/50">
                <span className="text-[10px] font-mono text-slate-400 font-semibold block leading-tight">Placement Probability</span>
                <span className="text-lg font-bold font-mono text-emerald-600 block">{candidate.placementProbability || 80}%</span>
              </div>
            </div>

            {/* AI Reasoning Text */}
            {candidate.matchExplanation && (
              <p className="text-[11px] leading-relaxed text-slate-500 font-mono italic">
                <strong>Model Note:</strong> "{candidate.matchExplanation}"
              </p>
            )}
          </div>
        ) : (
          <div className="h-full min-h-[80px] bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 p-4 text-center">
            <p className="text-xs text-slate-400 italic">
              Submit requirements on the left sidebar to activate deep AI semantic scoring.
            </p>
          </div>
        )}

        {/* Behavioral Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 text-emerald-500" /> Behavioral Integrity
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs font-mono text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 block leading-none mb-0.5">Tenure Loyalty</span>
              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < candidate.behavioralSignals.loyalty ? 'fill-amber-500 stroke-amber-500' : 'text-slate-200 fill-none'}`} 
                  />
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block leading-none mb-0.5">Adaptability Index</span>
              <div className="flex items-center gap-0.5 text-indigo-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < candidate.behavioralSignals.adaptability ? 'fill-indigo-500 stroke-indigo-500' : 'text-slate-200 fill-none'}`} 
                  />
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block leading-none mb-0.5">Message Response</span>
              <span className="font-bold text-slate-700">{candidate.behavioralSignals.responseRate}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block leading-none mb-0.5">Interview Attend</span>
              <span className="font-bold text-slate-700">{candidate.behavioralSignals.interviewAttendance}%</span>
            </div>
          </div>
        </div>

        {/* Gamified Crowdsourcing Contribution Terminal */}
        <div className="mt-auto pt-3 border-t border-slate-100 space-y-2">
          <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-100 rounded-xl p-3">
            <span className="text-[10px] font-mono text-indigo-700 font-bold block mb-1">CROWDSOURCED PLACEMENT LEDGER</span>
            
            {verifiedSuccess ? (
              <div className="flex items-start gap-1.5 text-emerald-700 text-xs mt-1 animate-pulse">
                <Check className="h-4 w-4 shrink-0 bg-emerald-100 text-emerald-800 rounded-full p-0.5" />
                <span className="font-sans leading-snug">{successMsg}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 leading-tight">
                  Validate this candidate to calibrate the AI ranking model. Earn points for your regional sourcing hub!
                </p>

                <div className="flex gap-1">
                  <select 
                    value={selectedContribType}
                    onChange={(e) => setSelectedContribType(e.target.value as any)}
                    className="flex-1 text-[10px] font-mono border border-indigo-200 bg-white rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="profile_verification">Verify Profile Info (+50)</option>
                    <option value="placement_history">Log Past Placement Match (+150)</option>
                    <option value="skill_correction">Suggest Skill Correction (+80)</option>
                  </select>

                  <button
                    onClick={handleVerificationSubmit}
                    disabled={isVerifying}
                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center justify-center shrink-0"
                    title="Submit Verification to Sourcing Network"
                  >
                    {isVerifying ? (
                      <Clock className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
