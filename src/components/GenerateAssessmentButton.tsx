'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';

export function GenerateAssessmentButton({ language }: { language: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ language })
      });

      let data;
      if (!res.ok) {
        try {
          data = await res.json();
        } catch(e) {
          throw new Error('Server returned an invalid response. It might have timed out.');
        }
        throw new Error(data.error || 'Failed to generate assessment');
      }

      // Refresh the page to show the new assessment
      router.refresh();
      alert('Successfully generated a new challenge! It has been added to the top of your list below.');
    } catch (error: any) {
      console.error('Error generating assessment:', error);
      alert(error.message || 'Failed to generate assessment. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
      {isGenerating ? 'AI is analyzing and generating...' : 'Generate New Custom Challenge'}
    </button>
  );
}
