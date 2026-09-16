'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { LogIn, LogOut, Code2, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        fetch('/api/github/sync', { method: 'POST' }).catch(console.error);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user && _event === 'SIGNED_IN') {
        fetch('/api/github/sync', { method: 'POST' }).catch(console.error);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Code2 className="w-8 h-8 text-indigo-500" />
              <span className="text-xl font-bold text-white tracking-tight">SkillProof</span>
            </Link>
            
            {user && (
              <Link href="/assessments" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Assessments
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 mr-4 pl-4 border-l border-slate-800">
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full border border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-indigo-400" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-300">
                    {user.user_metadata?.preferred_username || user.user_metadata?.user_name || 'Developer'}
                  </span>
                </div>
                
                <Link 
                  href={`/portfolio/${user.id}`}
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
                >
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors px-3 py-2 rounded-md hover:bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
              >
                <LogIn className="w-4 h-4" /> Login with GitHub
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
