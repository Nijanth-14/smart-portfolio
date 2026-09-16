import React from 'react';
import Link from 'next/link';
import { Code2, ShieldCheck, LogIn } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 text-center z-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-indigo-400 text-sm font-medium mb-8">
          <ShieldCheck className="w-4 h-4" /> Team Nexus
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-8 tracking-tight">
          Prove your skills.<br />Not just your resume.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          SkillProof turns your GitHub activity and live coding assessments into a single, cryptographically verified proof of skill. 
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/assessments" 
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2"
          >
            <Code2 className="w-5 h-5" /> Take an Assessment
          </Link>
          <p className="text-slate-500 text-sm mx-2 hidden sm:block">or</p>
          <span className="text-slate-400 text-sm sm:hidden">or</span>
          <p className="text-slate-400 text-sm font-medium border border-slate-800 bg-slate-900/50 px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto">
            Login via the Navbar above!
          </p>
        </div>
      </div>
    </div>
  );
}
