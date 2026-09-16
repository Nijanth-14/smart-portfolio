import React from 'react';
import Link from 'next/link';
import WeeklyFocus from '../components/Copilot/WeeklyFocus';
import JobReadiness from '../components/Copilot/JobReadiness';
import { Code2 } from 'lucide-react';
import HeroBadge from '../components/HeroBadge';
import MaskedHeading from '../components/MaskedHeading';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0f0a] relative overflow-hidden py-12">
      {/* Background decorations — nature green glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="mb-6 flex justify-center">
            <HeroBadge />
          </div>
          
          <div className="mb-6 h-[100px] md:h-[120px] flex items-center justify-center">
            <MaskedHeading 
              text="Level up based on your actual code." 
              tag="h1"
              className="text-4xl md:text-6xl font-extrabold tracking-tight"
              align="center"
              src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2070"
              parallax={40}
              trigger="mount"
              reveal="rise"
              duration={1.2}
            />
          </div>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Stop taking generic tests. We analyze your GitHub and Resume to tell you exactly what to fix and how to prove you&apos;re ready for the job you want.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/assessments" 
              className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center justify-center gap-2"
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
