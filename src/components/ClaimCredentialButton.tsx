'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Loader2 } from 'lucide-react';

export function ClaimCredentialButton({ assessmentId }: { assessmentId: string }) {
  const router = useRouter();
  const [isClaiming, setIsClaiming] = useState(false);

  const claimCredential = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the assessment editor
    setIsClaiming(true);
    
    try {
      const res = await fetch('/api/credentials/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId })
      });
      
      const data = await res.json();
      if (data.credentialId) {
        router.push(`/verify/${data.credentialId}`);
      } else {
        alert(data.error || 'Failed to claim credential');
      }
    } catch (error) {
      alert('An error occurred while claiming your credential.');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <button
      onClick={claimCredential}
      disabled={isClaiming}
      className="mt-4 w-full py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] disabled:opacity-50"
    >
      {isClaiming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
      {isClaiming ? 'Issuing...' : 'Claim Verified Credential'}
    </button>
  );
}
