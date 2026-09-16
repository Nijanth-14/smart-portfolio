'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { LogIn, LogOut, Leaf, Swords, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
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

  // Track scroll for navbar elevation effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      <style jsx>{`
        @keyframes navSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes leafSway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        .nav-enter {
          animation: navSlideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .logo-leaf {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .logo-leaf:hover {
          animation: leafSway 0.6s ease-in-out;
        }
        .nav-link {
          position: relative;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #22c55e, #4ade80);
          border-radius: 1px;
          transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: translateX(-50%);
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link:hover {
          color: #86efac;
        }
        .profile-pill {
          transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .profile-pill:hover {
          background: rgba(34, 197, 94, 0.15);
          border-color: rgba(34, 197, 94, 0.4);
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.1), inset 0 0 20px rgba(34, 197, 94, 0.05);
          transform: translateY(-1px);
        }
        .profile-pill:active {
          transform: translateY(0) scale(0.98);
        }
        .login-btn {
          background: linear-gradient(135deg, #16a34a, #22c55e, #4ade80);
          background-size: 200% 200%;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .login-btn:hover {
          background-position: 100% 100%;
          box-shadow: 0 4px 25px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.15);
          transform: translateY(-1px);
        }
        .login-btn:active {
          transform: translateY(0) scale(0.97);
        }
        .logout-btn {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .logout-btn:hover {
          color: #f87171;
          background: rgba(248, 113, 113, 0.1);
        }
        .avatar-ring {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-pill:hover .avatar-ring {
          box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.6);
        }
        .chevron-icon {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-pill:hover .chevron-icon {
          transform: translateX(2px);
        }
      `}</style>

      <nav
        className={`nav-enter sticky top-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-[#0a0f0a]/75 border-b border-green-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-[#0a0f0a]/50 border-b border-white/[0.04]'
        }`}
        style={{ backdropFilter: 'blur(20px) saturate(1.8)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Nav Links */}
            <div className="flex items-center gap-7">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="logo-leaf relative">
                  <Leaf className="w-7 h-7 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent">
                  SkillForge
                </span>
              </Link>
              
              {user && (
                <Link href="/assessments" className="nav-link text-sm font-medium text-green-200/60 flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5" />
                  Assessments
                </Link>
              )}
            </div>

            {/* Right: Profile or Login */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {/* Single unified profile pill — avatar + name + link */}
                  <Link
                    href={`/portfolio/${user.id}`}
                    className="profile-pill flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.03]"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Avatar" 
                        className="avatar-ring w-7 h-7 rounded-full ring-1 ring-green-500/30"
                      />
                    ) : (
                      <div className="avatar-ring w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center ring-1 ring-green-500/30">
                        <span className="text-xs font-bold text-green-400">
                          {(user.user_metadata?.preferred_username || 'D')[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-green-100/80">
                      {user.user_metadata?.preferred_username || user.user_metadata?.user_name || 'Developer'}
                    </span>
                    <ChevronRight className="chevron-icon w-3.5 h-3.5 text-green-500/40" />
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="logout-btn flex items-center gap-1.5 text-sm font-medium text-green-200/40 px-3 py-2 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="login-btn flex items-center gap-2 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg"
                >
                  <LogIn className="w-4 h-4" /> Login with GitHub
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
