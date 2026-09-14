import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Cpu } from 'lucide-react';

interface AgentStatusPanelProps {
  isEvaluating: boolean;
  domain: string;
}

export const AgentStatusPanel: React.FC<AgentStatusPanelProps> = ({ isEvaluating, domain }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    { label: 'Answer analyzed for technical depth', activeText: 'Analyzing answer & domain keywords...' },
    { label: 'Communication clarity checked', activeText: 'Checking tone, conciseness & filler words...' },
    { label: 'STAR framework & metrics evaluated', activeText: 'Verifying Situation, Task, Action & Results...' },
    { label: 'Feedback generated', activeText: 'Finalizing scores, strengths & improvement tips...' },
  ];

  useEffect(() => {
    if (!isEvaluating) {
      setCompletedSteps([]);
      return;
    }

    // Sequentially complete steps to give the user a clear agent workflow experience
    setCompletedSteps([]);
    const t1 = setTimeout(() => setCompletedSteps([0]), 400);
    const t2 = setTimeout(() => setCompletedSteps([0, 1]), 900);
    const t3 = setTimeout(() => setCompletedSteps([0, 1, 2]), 1400);
    const t4 = setTimeout(() => setCompletedSteps([0, 1, 2, 3]), 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isEvaluating]);

  if (!isEvaluating) return null;

  const currentActiveIndex = completedSteps.length < steps.length ? completedSteps.length : steps.length - 1;

  return (
    <div 
      id="agent-status-panel"
      className="bg-white rounded-2xl border border-purple-200/90 shadow-xl shadow-purple-500/10 p-5 sm:p-6 my-6 transition-all animate-fadeIn"
    >
      <div className="flex items-center justify-between border-b border-purple-100 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <span>Agent Status</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping"></span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">
              AI Evaluation Agent In Progress
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Evaluating for {domain}</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isDone = completedSteps.includes(index);
          const isCurrent = index === currentActiveIndex && !isDone;

          return (
            <div 
              key={index} 
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                isDone 
                  ? 'bg-emerald-50/70 border border-emerald-200/60 text-emerald-900' 
                  : isCurrent 
                    ? 'bg-purple-50 border border-purple-200 text-purple-900' 
                    : 'bg-slate-50/60 text-slate-400 border border-transparent'
              }`}
            >
              <div className="shrink-0 flex items-center justify-center">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {index + 1}
                  </div>
                )}
              </div>

              <div className="flex-1 text-sm font-semibold">
                {isDone ? (
                  <span className="flex items-center gap-1.5">
                    <span>✓</span>
                    <span>{step.label}</span>
                  </span>
                ) : isCurrent ? (
                  <span className="text-purple-800 animate-pulse">
                    {step.activeText}
                  </span>
                ) : (
                  <span>{step.label}</span>
                )}
              </div>

              {isDone && (
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-emerald-200">
                  Ready
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-2">
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(15, (completedSteps.length / steps.length) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
