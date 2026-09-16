import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Terminal, CheckCircle, Clock } from 'lucide-react';
import { ClaimCredentialButton } from '@/components/ClaimCredentialButton';

export default async function AssessmentsDashboard() {
  const supabase = await createClient();

  // Fetch all questions
  const { data: questions } = await supabase.from('questions').select('*');
  
  // Try fetching user assessments if logged in
  const { data: { user } } = await supabase.auth.getUser();
  let userAssessments: any[] = [];
  
  if (user) {
    const { data } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.id);
    userAssessments = data || [];
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 p-10 pt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-8">
          Live Coding Assessments
        </h1>
        <p className="text-slate-400 mb-12 text-lg">
          Prove your skills by completing these challenges. Passing an assessment automatically issues a verified credential to your portfolio.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions?.map((q) => {
            const assessment = userAssessments.find(a => a.question_id === q.id);
            const status = assessment?.status || 'pending';

            return (
              <Link 
                href={`/assessments/${q.id}`} 
                key={q.id}
                className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl hover:border-indigo-500/50 block"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">{q.title}</h2>
                  </div>
                  
                  {status === 'passed' ? (
                    <span className="px-3 py-1 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-full text-xs font-bold flex items-center gap-1">
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

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-md text-xs font-medium uppercase tracking-wider">
                    {q.language}
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
