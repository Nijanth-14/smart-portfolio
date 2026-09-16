"use client";
import React, { useState } from 'react';
import { Target, Code, FileText, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function WeeklyFocus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [focusArea, setFocusArea] = useState<{
    weakness: string;
    evidence: string;
    action: string;
  } | null>(null);

  const handleConnect = async () => {
    setIsAnalyzing(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    try {
      const response = await fetch('/api/analyze-github', { 
        method: 'POST',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }
      const data = await response.json();
      
      setIsConnected(true);
      // We take the first weakness or generate a message
      const primaryWeakness = data.analysis_data.weaknesses?.[0] || 'General Improvement';
      
      setFocusArea({
        weakness: primaryWeakness,
        evidence: `Based on your GitHub profile and common stack: ${data.analysis_data.common_stack?.join(', ')}`,
        action: data.analysis_data.weekly_focus || 'Keep coding and building projects!'
      });
    } catch (error: any) {
      console.error(error);
      if (error.name === 'AbortError') {
        toast.error('The analysis timed out. The server took too long to respond.');
      } else {
        toast.error(error.message || 'Analysis failed');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <Target className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Weekly Improvement Focus</h2>
          <p className="text-slate-400 text-sm">Personalized advice based on your code and resume</p>
        </div>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/50">
          <div className="flex gap-4 mb-4">
            <Code className="w-8 h-8 text-slate-500" />
            <FileText className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-300 mb-4 max-w-sm">Connect your GitHub and upload your resume to get your personalized technical focus for the week.</p>
          <button 
            onClick={handleConnect}
            disabled={isAnalyzing}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-900/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-lg shadow-red-500/20 flex items-center gap-2"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">Analyzing Profile... <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span></span>
            ) : (
              "Connect & Analyze"
            )}
          </button>
        </div>
      ) : (
        focusArea && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-rose-400 mb-1 uppercase tracking-wider">Identified Weakness</h3>
              <p className="text-white font-medium text-lg">{focusArea.weakness}</p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Evidence from GitHub</h3>
              <p className="text-slate-300">{focusArea.evidence}</p>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-indigo-400 mb-1 uppercase tracking-wider">Action Plan</h3>
              <p className="text-indigo-100 mb-4">{focusArea.action}</p>
              
              <Link href="/assessments?company=general" className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md transition-colors w-full justify-center">
                Start 20-Min Exercise <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
}
