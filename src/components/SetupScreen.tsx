import React, { useState, useRef } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Upload, 
  FileText, 
  Sparkles, 
  Code2, 
  Wrench, 
  Users, 
  Star, 
  TrendingUp, 
  Briefcase, 
  BarChart3, 
  Video, 
  ShieldCheck, 
  X,
  ChevronDown
} from 'lucide-react';

interface SetupScreenProps {
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
  resumeText: string;
  setResumeText: (text: string) => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
  onStartInterview: () => void;
  isLoading: boolean;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  selectedDomain,
  setSelectedDomain,
  resumeText,
  setResumeText,
  questionCount,
  setQuestionCount,
  onStartInterview,
  isLoading
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showPasteArea, setShowPasteArea] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const domains = [
    {
      id: 'Software Engineering',
      title: 'Software Engineering',
      icon: Code2,
      subtitle: 'System Design, Architecture, Algorithms & Behavioral Leadership',
      tags: ['System Architecture', 'DB & Caching', 'Incident Triage', 'STAR Scenarios'],
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'Core Engineering',
      title: 'Core Engineering',
      icon: Wrench,
      subtitle: 'Mechanical, Electrical, FMEA, Safety Protocols & Production',
      tags: ['FMEA & Reliability', 'Root Cause (5-Whys)', 'Safety Standards', 'Cross-Functional DFM'],
      color: 'from-amber-600 to-orange-600'
    },
    {
      id: 'Management',
      title: 'Management',
      icon: Users,
      subtitle: 'Engineering Leadership, Strategy, 1-on-1s & OKR Alignment',
      tags: ['Performance Coaching', 'RICE Prioritization', 'Culture & Feedback', 'Executive Comms'],
      color: 'from-purple-600 to-pink-600'
    }
  ];

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    // Simple client-side text extractor for session use
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setResumeText(text);
        setShowPasteArea(true);
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const currentDomainObj = domains.find(d => d.id === selectedDomain) || domains[0];

  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-20">
      {/* Top Hero Section matching Screenshot 1 & 2 */}
      <section className="pt-10 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          {/* Tag matching screenshot */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-purple-100 text-purple-700 border border-purple-200/80 mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 fill-purple-600/30" />
            <span>AI Interview Coach</span>
          </div>

          {/* Heading matching screenshot */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-5">
            Mock Interview Practice with{' '}
            <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Video Interview Coach
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            Practice with a lifelike AI video interviewer, get instant coaching, and prepare with a real AI interview simulation experience that mirrors how top companies actually hire.
          </p>

          {/* Bullet points matching screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-sm font-semibold text-slate-700 mb-10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
              <span>Practice Real Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
              <span>Improve Your Speech</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
              <span>Get Personalized Coaching</span>
            </div>
          </div>
        </div>

        {/* Interactive Configuration Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Step 1: Select Domain */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label 
                  htmlFor="domain-select" 
                  className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  Select Interview Domain
                </label>
                <span className="text-xs font-medium text-slate-500">
                  Targeted question bank
                </span>
              </div>

              <div className="relative">
                <select
                  id="domain-select"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 font-semibold text-base py-3.5 pl-4 pr-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Core Engineering">Core Engineering (Mechanical, Electrical, Civil, etc.)</option>
                  <option value="Management">Management (Engineering & Product Leadership)</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Domain Competency Preview Card */}
              <div className="mt-3 p-4 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <currentDomainObj.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-700">
                    Curriculum Focus
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {currentDomainObj.subtitle}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {currentDomainObj.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-0.5 rounded-md text-xs font-medium bg-white text-slate-700 border border-purple-200/60 shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Question Count */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  Session Length
                </label>
                <span className="text-xs text-slate-500">
                  Mix of technical & behavioral questions
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-bold border transition-all ${
                      questionCount === count
                        ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {count} Questions
                    <span className="block text-[11px] font-normal opacity-85">
                      ~{count * 3} mins
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Resume Upload or Paste (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                    3
                  </span>
                  Add Resume / Background
                  <span className="text-xs font-normal text-slate-500 ml-1">(Optional)</span>
                </label>
                {resumeText && (
                  <button
                    onClick={() => {
                      setResumeText('');
                      setFileName(null);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Clear resume
                  </button>
                )}
              </div>

              {/* Drag and Drop Zone */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.docx,.md"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-purple-600 bg-purple-50/80' 
                    : 'border-slate-300 hover:border-purple-400 bg-slate-50/60'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {fileName ? (
                      <span className="text-purple-700 flex items-center gap-1.5">
                        <FileText className="w-4 h-4" /> {fileName}
                      </span>
                    ) : (
                      'Click to upload resume or drag & drop'
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Accepts text, markdown, or text files (session-only, never saved to database)
                  </p>
                </div>
              </div>

              {/* Paste or review text */}
              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={() => setShowPasteArea(!showPasteArea)}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-800 underline underline-offset-2 flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {showPasteArea ? 'Hide pasted resume text' : 'Or paste your resume / bio text manually'}
                </button>

                {showPasteArea && (
                  <div className="mt-2">
                    <textarea
                      id="resume-text-input"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your past roles, key projects, technologies, and achievements here to help tailor the feedback..."
                      rows={4}
                      className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono bg-white"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                      <span>In-memory session buffer</span>
                      <span>{resumeText.trim().split(/\s+/).filter(Boolean).length} words</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Start Button matching screenshot */}
            <div className="pt-2">
              <button
                id="start-interview-btn"
                type="button"
                onClick={onStartInterview}
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-xl font-bold text-base text-white bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 active:scale-[0.99] shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Start Interview Session</span>
              </button>

              {/* Green Sub-badge matching screenshot */}
              <div className="flex items-center justify-center gap-2 mt-3 text-xs font-semibold text-emerald-700 bg-emerald-50/80 border border-emerald-200/80 py-2 px-3.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Simulated Real-Time AI Coaching • No Login or Card Required</span>
              </div>
            </div>

          </div>
        </div>

        {/* Trusted By Companies Banner matching screenshot */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-6">
            <span>⚡</span>
            <span>Trusted by Candidates from Top Companies Worldwide</span>
            <span>⚡</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-75 grayscale hover:grayscale-0 transition-all">
            {['Deloitte', 'Google', 'Microsoft', 'amazon', 'Adobe', 'McKinsey', 'BCG', 'stripe', 'JPMorgan'].map((company) => (
              <span 
                key={company}
                className="text-base sm:text-lg font-black tracking-tight text-slate-700 hover:text-purple-700 transition-colors"
              >
                {company}
              </span>
            ))}
          </div>
        </div>

        {/* Live Metrics Grid matching screenshot */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {/* Metric 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              4,141
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              Currently Practicing
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-purple-600 mb-1">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              746k
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              Interviews Conducted
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-indigo-600 mb-1">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              50k+
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              Users Hired
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1 text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              ))}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              4.9/5
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              User Rating
            </div>
          </div>
        </div>

        {/* How Our AI Platform Works Section matching screenshots 1 & 4 */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 mb-3">
              How It Works
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How Our AI Video Interview Platform Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Personalized AI interview coaching to guide you through every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 01 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-slate-800">01</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Choose Your Role
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select your exact domain: Software Engineering, Core Engineering, or Management. Curated for authentic hiring standards.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-slate-800">02</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Lifelike Video Interviewer
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Answer one targeted question at a time with realistic video presence, spoken questions, and natural interview pacing.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-slate-800">03</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Instant, Actionable Feedback
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receive comprehensive score breakdowns, STAR structure evaluations, communication clarity insights, and model answer tips.
                </p>
              </div>
            </div>

            {/* Step 04 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-slate-800">04</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Overall Performance Score
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Review your complete session analytics, top strengths, and priority areas for improvement before your real interview.
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};
