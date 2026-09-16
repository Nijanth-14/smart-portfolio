import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Terminal, CheckCircle, Clock, Sparkles, Timer, XCircle } from 'lucide-react';
import { ClaimCredentialButton } from '@/components/ClaimCredentialButton';
import { GenerateAssessmentButton } from '@/components/GenerateAssessmentButton';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export default async function AssessmentsDashboard({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const supabase = await createClient();
  const resolvedParams = searchParams ? await searchParams : {};
  const focus = resolvedParams?.focus as string | undefined;

  const { data: { user } } = await supabase.auth.getUser();
  let userAssessments: any[] = [];
  let topLanguage = 'JavaScript';
  
  if (user) {
    const { data: assessments } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.id);
    userAssessments = assessments || [];

    const { data: profile } = await supabase.from('profiles').select('github_stats').eq('id', user.id).single();
    const stats: any = profile?.github_stats;
    if (stats?.top_languages?.length > 0) {
      topLanguage = stats.top_languages[0];
    }
  }

  // Only show questions that the user has generated (linked via assessments table)
  const { data: allQuestions } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
  const questions = (allQuestions || []).filter(q => 
    userAssessments.some(a => a.question_id === q.id) &&
    q.id !== '11111111-1111-1111-1111-111111111111' && 
    q.id !== '22222222-2222-2222-2222-222222222222'
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 p-10 pt-24">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3">
            Live Coding Assessments
          </h1>
          <p className="text-slate-400 text-lg">
            Prove your skills by completing these challenges.
          </p>
        </div>

        <div className="mb-8 p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-full mt-1">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="w-full">
            <h3 className="text-xl font-bold text-white mb-2">AI-Personalized Skill Match</h3>
            <p className="text-slate-400 leading-relaxed">
              We analyzed your GitHub profile and noticed your primary expertise is in <strong className="text-indigo-300">{topLanguage}</strong>. 
              Our AI model can dynamically generate LeetCode-style challenges to accurately evaluate your strongest skill sets.
            </p>
            {user && (
              <GenerateAssessmentButton language={topLanguage} focus={focus} />
            )}
          </div>
        </div>

        {questions.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Your Generated Challenges</h2>
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold">{questions.length}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q) => {
            const assessment = userAssessments.find(a => a.question_id === q.id);
            const status = assessment?.status || 'pending';
            const timeSpent = assessment?.time_spent || 0;

            return (
              <Link 
                href={`/assessments/${q.id}`} 
                key={q.id}
                className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-md border rounded-2xl p-6 shadow-xl transition-all block border-slate-700/50 hover:border-indigo-500/50 hover:shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 bg-indigo-500/5"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-white leading-tight">{q.title}</h2>
                  </div>
                  
                  {status === 'passed' ? (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle className="w-3 h-3" /> PASSED
                    </span>
                  ) : status === 'failed' ? (
                    <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
                      <XCircle className="w-3 h-3" /> FAILED
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" /> PENDING
                    </span>
                  )}
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                  {q.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-md text-xs font-medium uppercase tracking-wider">
                    {q.language}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    {timeSpent > 0 && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Timer className="w-3 h-3" /> {formatDuration(timeSpent)}
                      </span>
                    )}
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Generated
                    </span>
                  </div>
                </div>
                
                {status === 'passed' && assessment?.id && (
                  <div className="mt-6" onClick={(e) => e.stopPropagation()}>
                    <ClaimCredentialButton assessmentId={assessment.id} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {questions.length === 0 && (
          <div className="text-center py-20 text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            <Terminal className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-lg font-medium text-slate-400 mb-1">No challenges yet</p>
            <p className="text-sm">Click &quot;Generate New Custom Challenge&quot; above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
