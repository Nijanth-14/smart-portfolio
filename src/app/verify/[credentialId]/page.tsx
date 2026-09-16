import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { jwtVerify } from 'jose';
import { ExternalLink, Code2, Calendar } from 'lucide-react';
import Link from 'next/link';

// Using a custom verified icon since CheckDecagram might not be in older lucide-react versions
// If CheckDecagram is missing, we'll fall back to standard icons or just use a custom SVG for the "Verified" badge

export default async function VerifyPage({ params }: { params: Promise<{ credentialId: string }> }) {
  const { credentialId } = await params;
  
  if (!credentialId || credentialId.length < 10) {
    notFound();
  }

  const supabase = await createClient();

  const { data: credential, error } = await supabase
    .from('credentials')
    .select('*, profiles(full_name, username, avatar_url), assessments(questions(title, language))')
    .eq('id', credentialId)
    .single();

  if (error || !credential) {
    notFound();
  }

  let isVerified = false;
  let decodedPayload: any = null;

  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(credential.jwt_token, secretKey);
    decodedPayload = payload;
    isVerified = true;
  } catch (err) {
    console.error('JWT Verification failed:', err);
    isVerified = false;
  }

  const profile = credential.profiles;
  const question = credential.assessments?.questions;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-teal-500/30">
      <div className="max-w-2xl w-full">
        
        {/* Certificate Card */}
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-bl-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-tr-full -ml-10 -mb-10"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            
            {/* Verification Status */}
            <div className="mb-10">
              {isVerified ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-full font-bold shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  CRYPTOGRAPHICALLY VERIFIED
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full font-bold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  VERIFICATION FAILED
                </div>
              )}
            </div>

            {/* Candidate Info */}
            <img 
              src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name}&background=random`} 
              alt={profile?.full_name} 
              className="w-24 h-24 rounded-full border-4 border-slate-800 shadow-xl mb-6"
            />
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{profile?.full_name}</h1>
            
            <Link 
              href={`/portfolio/${credential.user_id}`}
              className="text-indigo-400 flex items-center justify-center gap-1 hover:text-indigo-300 transition-colors mb-10"
            >
              @{profile?.username} <ExternalLink className="w-4 h-4" />
            </Link>

            <div className="w-full h-px bg-slate-800 mb-10"></div>

            {/* Skill Proved */}
            <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-6">Has Successfully Demonstrated</p>
            
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 w-full mb-10">
              <h2 className="text-2xl font-bold text-slate-200 mb-2">{question?.title || decodedPayload?.skill || 'Coding Assessment'}</h2>
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <Code2 className="w-4 h-4" />
                <span className="capitalize">{question?.language || decodedPayload?.language || 'Programming Language'}</span>
              </div>
            </div>

            {/* Metadata */}
            <div className="w-full flex justify-between items-center text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Issued on {new Date(credential.issued_at).toLocaleDateString()}</span>
              </div>
              <div className="font-mono text-xs opacity-50 truncate max-w-[150px]" title={credential.id}>
                ID: {credential.id.split('-')[0]}
              </div>
            </div>

          </div>
        </div>
        
        <p className="text-center text-slate-600 mt-8 text-sm">
          Powered by <strong>SkillProof</strong> • Team Nexus
        </p>

      </div>
    </div>
  );
}
