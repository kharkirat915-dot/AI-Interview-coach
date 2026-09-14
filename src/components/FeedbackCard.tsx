import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  Target, 
  RotateCcw, 
  Award, 
  Zap,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { EvaluationFeedback } from '../types';

interface FeedbackCardProps {
  feedback: EvaluationFeedback;
  userAnswer: string;
  isLastQuestion: boolean;
  onNextQuestion: () => void;
  onRetryAnswer: () => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  userAnswer,
  isLastQuestion,
  onNextQuestion,
  onRetryAnswer,
}) => {
  const [showSubmittedAnswer, setShowSubmittedAnswer] = useState(false);

  // Determine score color badge
  const isExcellent = feedback.score >= 8.5;
  const isGood = feedback.score >= 7.0;

  const scoreBadgeColor = isExcellent
    ? 'bg-emerald-500 text-white border-emerald-400'
    : isGood
      ? 'bg-purple-600 text-white border-purple-500'
      : 'bg-amber-500 text-white border-amber-400';

  return (
    <div 
      id="feedback-card" 
      className="bg-white rounded-2xl border border-purple-200/90 shadow-xl shadow-purple-500/5 overflow-hidden transition-all animate-fadeIn"
    >
      {/* Top Banner with Score */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 p-6 sm:p-7 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-purple-200 border border-white/10">
              <Award className="w-3.5 h-3.5 text-purple-300" />
              <span>Question Evaluation</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {feedback.ratingLabel}
            </h3>
            <p className="text-xs text-purple-200/80">
              Instant feedback analyzed across technical accuracy, STAR method, and clarity
            </p>
          </div>

          {/* Large Numerical Score Badge */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-200">
                Score Rating
              </div>
              <div className="text-xs text-purple-300/80">
                {feedback.scorePercentage}% benchmark
              </div>
            </div>
            <div className={`px-4 py-2.5 rounded-2xl font-black text-2xl sm:text-3xl flex items-baseline gap-1 shadow-lg border ${scoreBadgeColor}`}>
              <span>{feedback.score.toFixed(1)}</span>
              <span className="text-sm font-semibold opacity-80">/10</span>
            </div>
          </div>
        </div>

        {/* Sub-Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
              Technical Accuracy
            </div>
            <div className="text-base font-extrabold text-white mt-0.5">
              {feedback.metrics.technicalAccuracy}/10
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
              Communication Clarity
            </div>
            <div className="text-base font-extrabold text-white mt-0.5">
              {feedback.metrics.clarity}/10
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
              STAR Structure
            </div>
            <div className="text-base font-extrabold text-white mt-0.5">
              {feedback.metrics.structureSTAR}/10
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
              Role Relevance
            </div>
            <div className="text-base font-extrabold text-white mt-0.5">
              {feedback.metrics.relevance}/10
            </div>
          </div>
        </div>
      </div>

      {/* Main Feedback Body */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Strengths Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-sm font-extrabold text-emerald-800 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Key Strengths</span>
          </div>
          <div className="space-y-2.5">
            {feedback.strengths.map((strength, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-sm text-slate-800 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  ✓
                </span>
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Areas to Improve Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-sm font-extrabold text-amber-800 uppercase tracking-wider">
            <Target className="w-4 h-4 text-amber-600" />
            <span>Areas to Improve</span>
          </div>
          <div className="space-y-2.5">
            {feedback.improvements.map((improvement, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-sm text-slate-800 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  !
                </span>
                <span>{improvement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Communication Clarity & Cadence Note */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>Communication & Delivery Analysis</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {feedback.communicationClarity}
          </p>
        </div>

        {/* Model Answer Coaching Tip */}
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-800">
              Coach Recommendation
            </div>
            <p className="text-sm text-purple-950 font-medium leading-relaxed mt-0.5">
              {feedback.modelAnswerTips}
            </p>
          </div>
        </div>

        {/* Accordion to view candidate's own submitted text */}
        <div>
          <button
            type="button"
            onClick={() => setShowSubmittedAnswer(!showSubmittedAnswer)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>{showSubmittedAnswer ? 'Hide your submitted answer' : 'View your submitted answer'}</span>
          </button>

          {showSubmittedAnswer && (
            <div className="mt-2 p-3.5 rounded-xl bg-slate-100 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed border border-slate-200">
              {userAnswer}
            </div>
          )}
        </div>

        {/* Action Buttons: Next Question or Final Summary */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRetryAnswer}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revise & Practice Answer Again</span>
          </button>

          <button
            id="next-question-btn"
            type="button"
            onClick={onNextQuestion}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm text-white bg-purple-700 hover:bg-purple-800 active:scale-[0.99] shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{isLastQuestion ? 'Complete Interview & View Final Summary' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
