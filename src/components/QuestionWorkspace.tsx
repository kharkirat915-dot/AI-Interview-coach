import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Lightbulb, 
  HelpCircle, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { InterviewQuestion } from '../types';
import { createSpeechRecognizer, isSpeechRecognitionAvailable } from '../lib/speech';

interface QuestionWorkspaceProps {
  question: InterviewQuestion;
  questionIndex: number;
  totalQuestions: number;
  userAnswer: string;
  setUserAnswer: (val: string) => void;
  onSubmitAnswer: () => void;
  isEvaluating: boolean;
  hasFeedback: boolean;
}

export const QuestionWorkspace: React.FC<QuestionWorkspaceProps> = ({
  question,
  questionIndex,
  totalQuestions,
  userAnswer,
  setUserAnswer,
  onSubmitAnswer,
  isEvaluating,
  hasFeedback,
}) => {
  const [isDictating, setIsDictating] = useState(false);
  const [showStarGuide, setShowStarGuide] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognizer, setRecognizer] = useState<any>(null);

  useEffect(() => {
    setSpeechSupported(isSpeechRecognitionAvailable());
  }, []);

  const toggleDictation = () => {
    if (isDictating) {
      if (recognizer) {
        recognizer.stop();
      }
      setIsDictating(false);
    } else {
      const rec = createSpeechRecognizer(
        (transcript) => {
          setUserAnswer(userAnswer ? `${userAnswer} ${transcript}` : transcript);
        },
        (error) => {
          console.warn('Speech recognition error:', error);
          setIsDictating(false);
        },
        () => {
          setIsDictating(false);
        }
      );

      if (rec) {
        try {
          rec.start();
          setRecognizer(rec);
          setIsDictating(true);
        } catch (e) {
          console.warn('Cannot start dictation:', e);
        }
      }
    }
  };

  const wordsCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
  const isSubmitDisabled = isEvaluating || userAnswer.trim().length < 5;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
      {/* Top Question Meta & Category */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-800">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
            question.category === 'Technical'
              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
              : question.category === 'HR / Behavioral'
                ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
          }`}>
            {question.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowStarGuide(!showStarGuide)}
          className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1.5 transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
          <span>STAR Method Framework</span>
          {showStarGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* STAR Framework expandable guide */}
      {showStarGuide && (
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-slate-700 space-y-2 animate-fadeIn">
          <div className="font-bold text-purple-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Structure your answer for maximum score:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
            <div className="p-2 bg-white rounded-lg border border-purple-100">
              <span className="font-bold text-purple-700 block">S - Situation</span>
              <span className="text-slate-600 text-[11px]">Set the stage, context & challenge</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-purple-100">
              <span className="font-bold text-purple-700 block">T - Task</span>
              <span className="text-slate-600 text-[11px]">What was your specific responsibility?</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-purple-100">
              <span className="font-bold text-purple-700 block">A - Action</span>
              <span className="text-slate-600 text-[11px]">Exact technical steps & decisions you made</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-purple-100">
              <span className="font-bold text-purple-700 block">R - Result</span>
              <span className="text-slate-600 text-[11px]">Measurable outcome, metrics & learnings</span>
            </div>
          </div>
        </div>
      )}

      {/* Question Headline */}
      <div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight">
          "{question.question}"
        </h3>
        
        {/* Intent hint */}
        <div className="mt-2.5 flex items-start gap-2 text-xs text-slate-500">
          <HelpCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
          <span><strong className="font-semibold text-slate-700">What interviewer evaluates:</strong> {question.intent}</span>
        </div>
      </div>

      {/* Answer Input Area (Only active if answer hasn't been submitted or during revision) */}
      {!hasFeedback && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label 
              htmlFor="answer-textarea"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
            >
              <span>Your Response</span>
              <span className="text-slate-400 font-normal">
                (Speak naturally or type your complete answer)
              </span>
            </label>

            {speechSupported && (
              <button
                type="button"
                onClick={toggleDictation}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isDictating
                    ? 'bg-red-600 text-white animate-pulse shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="Dictate with microphone"
              >
                {isDictating ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-purple-600" />}
                <span>{isDictating ? 'Listening (Click to Stop)' : 'Dictate with Voice'}</span>
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              id="answer-textarea"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isEvaluating}
              rows={7}
              placeholder="Type your response here... Tip: Be specific about your actions and quantify your results (e.g., 'I redesigned our indexing strategy, which reduced p99 query latency from 850ms to 95ms...')"
              className="w-full text-base p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-slate-900 bg-slate-50/50 focus:bg-white transition-all resize-y leading-relaxed disabled:opacity-60"
            />
          </div>

          {/* Counters & Guidelines */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-700">
                {wordsCount} {wordsCount === 1 ? 'word' : 'words'}
              </span>
              <span>•</span>
              <span className={`${wordsCount >= 70 && wordsCount <= 250 ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}>
                {wordsCount < 50 
                  ? 'Aim for ~80-200 words for depth' 
                  : wordsCount > 250 
                    ? 'Good depth, keep it focused' 
                    : 'Optimal answer depth'}
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              Evaluated via modular backend endpoint <code className="font-mono text-purple-700 bg-purple-50 px-1 py-0.5 rounded">/api/evaluate</code>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3">
            <button
              id="submit-answer-btn"
              type="button"
              onClick={onSubmitAnswer}
              disabled={isSubmitDisabled}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base text-white bg-purple-700 hover:bg-purple-800 active:scale-[0.99] shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isEvaluating ? 'Evaluating Answer...' : 'Submit Answer'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
