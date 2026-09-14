import React from 'react';
import { Sparkles, MessageSquare, RotateCcw } from 'lucide-react';

interface NavbarProps {
  currentStage: 'setup' | 'interview' | 'summary';
  domain: string;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentStage, domain, onReset }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo matching screenshots */}
        <div 
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5 fill-white/20 stroke-white" />
          </div>
          <div className="flex items-baseline font-extrabold tracking-tight text-xl text-slate-900">
            <span>InterviewCoach</span>
            <span className="text-purple-600">.AI</span>
          </div>
        </div>

        {/* Center / Stage Indicator */}
        <div className="hidden md:flex items-center gap-2">
          {currentStage === 'setup' ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/70">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Interactive AI Mock Simulation</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Live Simulation:
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {domain}
              </span>
            </div>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {currentStage !== 'setup' && (
            <button
              id="reset-interview-btn"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Return to setup"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Session</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="hidden lg:inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Ready to Practice
            </span>
            <div className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-700 shadow-sm hover:bg-purple-800 transition-colors cursor-default">
              AI Coach
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
