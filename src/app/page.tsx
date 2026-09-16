import React from 'react';
import Link from 'next/link';
import WeeklyFocus from '../components/Copilot/WeeklyFocus';
import JobReadiness from '../components/Copilot/JobReadiness';
import { Rocket, Code2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0F0F0F] relative overflow-hidden py-12">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#282828] border border-[#3F3F3F] rounded-full text-red-500 text-sm font-medium mb-6 shadow-sm">
            <Rocket className="w-4 h-4" /> Technical Career Copilot
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Level up based on <span className="text-red-500">your actual code.</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Stop taking generic tests. We analyze your GitHub and Resume to tell you exactly what to fix and how to prove you're ready for the job you want.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/assessments" 
              className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2"
            >
              <Code2 className="w-5 h-5" /> Take an Assessment
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <WeeklyFocus />
          <JobReadiness />
        </div>
      </div>
    </div>
  );
}
