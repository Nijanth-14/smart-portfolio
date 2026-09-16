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
          // Slowly increment up to 90%
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ language: language || 'JavaScript', focus })
      });

      let data;
      if (!res.ok) {
        try {
          data = await res.json();
        } catch(e) {
          throw new Error('Server returned an invalid response. It might have timed out.');
        }
        throw new Error(data.error || 'Failed to generate assessment');
      } else {
        data = await res.json();
      }

      setProgress(100);
      setTimeout(() => {
        router.push(`/assessments/${data.question.id}`);
        toast.success('Successfully generated a new challenge!');
      }, 500);
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
        <div className="mt-3 bg-slate-900 rounded-lg p-3 border border-indigo-500/30 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-indigo-400 font-medium flex items-center gap-1">
              <Bot className="w-3 h-3" /> AI Engine
            </span>
            <span className="text-slate-400">{progress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-center">
            {progress < 40 ? 'Analyzing your GitHub profile...' : 
             progress < 70 ? 'Crafting personalized logic problem...' : 
             'Writing test cases...'}
          </p>
        </div>
      )}
    </div>
  );
}
