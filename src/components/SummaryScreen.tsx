import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  Target, 
  RotateCcw, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  BarChart2, 
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { EvaluationFeedback } from '../types';

interface SummaryScreenProps {
  domain: string;
  answersHistory: Array<{
    question: string;
    answer: string;
    feedback: EvaluationFeedback;
  }>;
  onRestart: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  domain,
  answersHistory,
  onRestart,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  // Compute metrics
  const totalQuestions = answersHistory.length;
  const avgScore = totalQuestions > 0
    ? Math.round(answersHistory.reduce((acc, h) => acc + h.feedback.score, 0) / totalQuestions * 10) / 10
    : 7.5;
  const overallPercentage = Math.round(avgScore * 10);

  const avgTech = totalQuestions > 0
    ? Math.round(answersHistory.reduce((acc, h) => acc + h.feedback.metrics.technicalAccuracy, 0) / totalQuestions * 10) / 10
    : 8;
  const avgClarity = totalQuestions > 0
    ? Math.round(answersHistory.reduce((acc, h) => acc + h.feedback.metrics.clarity, 0) / totalQuestions * 10) / 10
    : 8;
  const avgSTAR = totalQuestions > 0
    ? Math.round(answersHistory.reduce((acc, h) => acc + h.feedback.metrics.structureSTAR, 0) / totalQuestions * 10) / 10
    : 7.5;
  const avgRelevance = totalQuestions > 0
    ? Math.round(answersHistory.reduce((acc, h) => acc + h.feedback.metrics.relevance, 0) / totalQuestions * 10) / 10
    : 8;

  const isReady = overallPercentage >= 80;
  const ratingTitle = overallPercentage >= 85
    ? 'Interview Ready — Top Candidate'
    : overallPercentage >= 75
      ? 'Competitive Baseline — Ready with Light Polish'
      : 'Foundational — Focus on STAR Quantification';

  // Aggregate strengths and improvements
  const allStrengths = Array.from(new Set(answersHistory.flatMap(h => h.feedback.strengths))).slice(0, 4);
  const allImprovements = Array.from(new Set(answersHistory.flatMap(h => h.feedback.improvements))).slice(0, 3);

  const handleExport = () => {
    let report = `# AI INTERVIEW PREP COACH — PERFORMANCE REPORT\n`;
    report += `Domain: ${domain}\n`;
    report += `Date: ${new Date().toLocaleDateString()}\n`;
    report += `Overall Score: ${avgScore}/10 (${overallPercentage}%)\n`;
    report += `Status: ${ratingTitle}\n\n`;

    report += `## METRICS BREAKDOWN\n`;
    report += `- Technical Accuracy: ${avgTech}/10\n`;
    report += `- Communication Clarity: ${avgClarity}/10\n`;
    report += `- STAR Method Structure: ${avgSTAR}/10\n`;
    report += `- Strategic & Role Relevance: ${avgRelevance}/10\n\n`;

    report += `## TOP STRENGTHS\n`;
    allStrengths.forEach(s => { report += `- ${s}\n`; });
    report += `\n## KEY AREAS FOR IMPROVEMENT\n`;
    allImprovements.forEach(i => { report += `- ${i}\n`; });

    report += `\n## DETAILED QUESTION BREAKDOWN\n`;
    answersHistory.forEach((item, index) => {
      report += `\n### Question ${index + 1}: ${item.question}\n`;
      report += `Candidate Answer:\n${item.answer}\n\n`;
      report += `Score: ${item.feedback.score}/10 (${item.feedback.ratingLabel})\n`;
      report += `Coach Tip: ${item.feedback.modelAnswerTips}\n`;
    });

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${domain.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    const text = `I just completed an AI Mock Interview in ${domain} on InterviewCoach.AI and scored ${overallPercentage}% (${avgScore}/10)! Rating: ${ratingTitle}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Trophy Banner */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-purple-200 border border-white/20">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Interview Simulation Complete</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Performance Evaluation
              </h1>
              <p className="text-sm text-purple-200/90 max-w-lg">
                Comprehensive evaluation for <strong className="text-white font-bold">{domain}</strong> across {totalQuestions} simulated technical & HR questions.
              </p>
            </div>

            {/* Score Ring */}
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-lg shrink-0">
              <div className="text-3xl sm:text-4xl font-black text-white flex items-baseline gap-1">
                <span>{avgScore.toFixed(1)}</span>
                <span className="text-sm font-semibold opacity-80">/10</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-200 mt-1">
                {overallPercentage}% Score
              </div>
              <div className="mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                {ratingTitle}
              </div>
            </div>
          </div>

          {/* Key Competency Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/15">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
                Technical Accuracy
              </div>
              <div className="text-lg font-black text-white mt-1">
                {avgTech.toFixed(1)}/10
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
                Communication Clarity
              </div>
              <div className="text-lg font-black text-white mt-1">
                {avgClarity.toFixed(1)}/10
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
                STAR Structure
              </div>
              <div className="text-lg font-black text-white mt-1">
                {avgSTAR.toFixed(1)}/10
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
                Role Relevance
              </div>
              <div className="text-lg font-black text-white mt-1">
                {avgRelevance.toFixed(1)}/10
              </div>
            </div>
          </div>
        </div>

        {/* Strengths and Improvements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths Card */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-md">
            <div className="flex items-center gap-2 mb-4 text-emerald-800 font-extrabold text-sm uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Demonstrated Strengths</span>
            </div>
            <div className="space-y-3">
              {allStrengths.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Improvements Card */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-md">
            <div className="flex items-center gap-2 mb-4 text-amber-800 font-extrabold text-sm uppercase tracking-wider">
              <Target className="w-4 h-4 text-amber-600" />
              <span>Priority Improvement Tips</span>
            </div>
            <div className="space-y-3">
              {allImprovements.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    !
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question by Question Detailed Review */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Question-by-Question Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Review each answered question and corresponding feedback
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
              {totalQuestions} Questions Evaluated
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {answersHistory.map((item, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div 
                  key={index}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="w-full p-4 text-left bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-bold text-sm text-slate-900 line-clamp-1">
                        {item.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-700 text-white">
                        {item.feedback.score.toFixed(1)}/10
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-4 text-xs">
                      <div>
                        <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Full Question:
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.question}
                        </p>
                      </div>

                      <div>
                        <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Your Answer:
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg text-slate-800 font-mono text-xs whitespace-pre-wrap border border-slate-200">
                          {item.answer}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                          <div className="font-bold text-emerald-800 mb-1">Key Strengths</div>
                          <ul className="list-disc pl-4 space-y-1 text-slate-700">
                            {item.feedback.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                          <div className="font-bold text-amber-800 mb-1">Areas to Polish</div>
                          <ul className="list-disc pl-4 space-y-1 text-slate-700">
                            {item.feedback.improvements.map((imp, i) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                        <span className="font-bold text-purple-900 block mb-0.5">Coach Model Tip:</span>
                        <span className="text-purple-950 font-medium">{item.feedback.modelAnswerTips}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-800 active:scale-[0.99] shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Another Session</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex-1 sm:flex-none px-4 py-3.5 rounded-xl font-bold text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Share Result'}</span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl font-bold text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4 text-purple-700" />
              <span>Export Report (.md)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
