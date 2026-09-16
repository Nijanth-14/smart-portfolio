import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Terminal, CheckCircle, Clock, Sparkles, Building2, Briefcase } from 'lucide-react';
import { ClaimCredentialButton } from '@/components/ClaimCredentialButton';

export default async function AssessmentsDashboard({ searchParams }: { searchParams: Promise<{ company?: string }> }) {
  const { company } = await searchParams;
  const currentCompany = company || 'general';
  const supabase = await createClient();

  // Fetch questions dynamically based on the active company mode
  let questionQuery = supabase.from('questions').select('*');
  if (currentCompany === 'stripe') {
    questionQuery = questionQuery.eq('id', '11111111-1111-1111-1111-111111111111');
  } else if (currentCompany === 'google') {
    questionQuery = questionQuery.eq('id', '22222222-2222-2222-2222-222222222222');
  } else {
    // General questions are the ones not matching our dummy UUIDs
    questionQuery = questionQuery.not('id', 'in', '("11111111-1111-1111-1111-111111111111", "22222222-2222-2222-2222-222222222222")');
  }
  const { data: questions } = await questionQuery;
  
  // Try fetching user assessments and profile if logged in
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 p-10 pt-24">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3">
              Live Coding Assessments
            </h1>
            <p className="text-slate-400 text-lg">
              Prove your skills by completing these challenges.
            </p>
          </div>
          
          <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-800 self-start md:self-auto">
            <Link 
              href="/assessments?company=general"
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${currentCompany === 'general' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Sparkles className="w-4 h-4" /> General Skills
            </Link>
            <Link 
              href="/assessments?company=stripe"
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${currentCompany === 'stripe' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Building2 className="w-4 h-4" /> Stripe
            </Link>
            <Link 
              href="/assessments?company=google"
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${currentCompany === 'google' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Building2 className="w-4 h-4" /> Google
            </Link>
          </div>
        </div>

        {currentCompany === 'general' ? (
          <div className="mb-8 p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-full mt-1">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">AI-Personalized Skill Match</h3>
              <p className="text-slate-400 leading-relaxed">
                We analyzed your GitHub profile and noticed your primary expertise is in <strong className="text-indigo-300">{topLanguage}</strong>. 
                Our AI model has dynamically selected the following LeetCode-style challenges to accurately evaluate your strongest skill sets.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-5 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-teal-500/20 rounded-full mt-1">
              <Briefcase className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{currentCompany.charAt(0).toUpperCase() + currentCompany.slice(1)}'s Custom Question Bank</h3>
              <p className="text-slate-400 leading-relaxed">
                You are applying to {currentCompany.charAt(0).toUpperCase() + currentCompany.slice(1)}. 
                Our AI has selected these proprietary questions from their custom question set because they perfectly match your <strong className="text-teal-300">{topLanguage}</strong> experience on GitHub.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions?.map((q) => {
            const assessment = userAssessments.find(a => a.question_id === q.id);
            const status = assessment?.status || 'pending';

            return (
              <Link 
                href={`/assessments/${q.id}`} 
                key={q.id}
                className={`group relative overflow-hidden bg-slate-900/50 backdrop-blur-md border rounded-2xl p-6 shadow-xl transition-all block
                  ${currentCompany === 'general' ? 'border-slate-700/50 hover:border-indigo-500/50' : 'border-slate-700/50 hover:border-teal-500/50'}
                  hover:shadow-2xl`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150
                  ${currentCompany === 'general' ? 'bg-indigo-500/5' : 'bg-teal-500/5'}`}></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${currentCompany === 'general' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-teal-500/20 text-teal-400'}`}>
                      <Terminal className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">{q.title}</h2>
                  </div>
                  
                  {status === 'passed' ? (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> PASSED
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {status.toUpperCase()}
                    </span>
                  )}
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 mb-6">
                  {q.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-md text-xs font-medium uppercase tracking-wider">
                    {q.language}
                  </span>
                  
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Matched
                  </span>
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

        {(!questions || questions.length === 0) && (
          <div className="text-center py-20 text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            <p>No assessments available right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
