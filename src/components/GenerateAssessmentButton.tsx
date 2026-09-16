'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, Bot } from 'lucide-react';
import toast from 'react-hot-toast';

export function GenerateAssessmentButton({ language, focus }: { language?: string, focus?: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  // Fake progress animation for better UX
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setProgress(10);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.floor(Math.random() * 10) + 2;
        });
      }, 500);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: language || 'JavaScript', focus })
      });

      if (!res.ok) {
        let errMsg = 'Failed to generate assessment';
        try {
          const data = await res.json();
          errMsg = data.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      setProgress(100);
      toast.success('New challenge generated! It has appeared below.');
      // Brief pause so the user sees 100%, then hard reload to fetch fresh server data
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate assessment. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-sm mt-4">
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {isGenerating ? 'AI is generating...' : 'Generate New Custom Challenge'}
      </button>

      {isGenerating && (
        <div className="mt-3 bg-slate-900 rounded-lg p-3 border border-indigo-500/30">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-indigo-400 font-medium flex items-center gap-1">
              <Bot className="w-3 h-3" /> AI Engine
            </span>
            <span className="text-slate-400">{Math.min(progress, 100)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-center">
            {progress < 40 ? 'Analyzing your GitHub profile...' : 
             progress < 70 ? 'Crafting personalized logic problem...' : 
             progress < 100 ? 'Writing test cases...' :
             'Done!'}
          </p>
        </div>
      )}
    </div>
  );
}
