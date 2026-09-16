import React from 'react';
import WeeklyFocus from '../components/Copilot/WeeklyFocus';
import JobReadiness from '../components/Copilot/JobReadiness';
import { Rocket } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 relative overflow-hidden py-12">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-indigo-400 text-sm font-medium mb-6 shadow-sm">
            <Rocket className="w-4 h-4" /> Technical Career Copilot
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-6 tracking-tight">
            Level up based on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">your actual code.</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop taking generic tests. We analyze your GitHub and Resume to tell you exactly what to fix and how to prove you're ready for the job you want.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <WeeklyFocus />
          <JobReadiness />
        </div>
      </div>
    </div>
  );
}
