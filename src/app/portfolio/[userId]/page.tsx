import React from 'react';
import { notFound } from 'next/navigation';
import { PortfolioCard } from '@/components/PortfolioCard';
import { User, Code, Award, ExternalLink, GitBranch, Star } from 'lucide-react';

async function getPortfolioData(userId: string) {
  // Use absolute URL for server-side fetching
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${appUrl}/api/portfolio/${userId}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch portfolio data');
  }
  return res.json();
}

export default async function PortfolioPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const data = await getPortfolioData(userId);

  if (!data) {
    notFound();
  }

  const { profile, verifiedCredentials } = data;
  const githubStats = profile.github_stats || {};
  const repos = githubStats.repos || [];
  const topLanguages = githubStats.top_languages || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 pt-24 pb-32 border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-teal-500/10"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}&background=random`} 
              alt={profile.full_name} 
              className="relative w-40 h-40 rounded-full object-cover border-4 border-slate-900 shadow-2xl"
            />
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-4">
              {profile.full_name}
            </h1>
            <p className="text-xl text-slate-400 flex items-center justify-center md:justify-start gap-2">
              <User className="w-5 h-5" /> 
              @{profile.username}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                <span className="text-indigo-400 font-bold">{githubStats.followers || 0}</span> Followers
              </div>
              <div className="px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                <span className="text-teal-400 font-bold">{githubStats.public_repos || 0}</span> Public Repos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Skills & Credentials */}
          <div className="space-y-8 lg:col-span-1">
            <PortfolioCard title="Top Languages" icon={<Code className="w-5 h-5" />}>
              <div className="flex flex-wrap gap-2">
                {topLanguages.length > 0 ? (
                  topLanguages.map((lang: string) => (
                    <span key={lang} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md text-sm font-medium">
                      {lang}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No languages found.</p>
                )}
              </div>
            </PortfolioCard>

            <PortfolioCard title="Verified Credentials" icon={<Award className="w-5 h-5" />}>
              <div className="space-y-4">
                {verifiedCredentials.map((cred: any) => (
                  <div key={cred.id} className="group relative overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 p-4 hover:border-teal-500/50 transition-colors">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                    <h3 className="font-semibold text-slate-200 mb-1">{cred.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{cred.issuer}</p>
                    <a 
                      href={cred.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300"
                    >
                      View Credential <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </PortfolioCard>
          </div>

          {/* Right Column: Repositories */}
          <div className="lg:col-span-2">
            <PortfolioCard title="Featured Repositories" icon={<GitBranch className="w-5 h-5" />} className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.map((repo: any) => (
                  <a 
                    key={repo.id} 
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-5 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/80 hover:border-slate-600 transition-all group"
                  >
                    <h3 className="text-lg font-semibold text-indigo-300 group-hover:text-indigo-200 mb-2 truncate">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">
                      {repo.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                        {repo.language || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" />
                        {repo.stargazers_count}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
              {repos.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  <p>No repositories found.</p>
                </div>
              )}
            </PortfolioCard>
          </div>

        </div>
      </div>
    </div>
  );
}
