import Link from 'next/link';
import { ArrowRight, Code2, FileCheck2, GitBranch, Sparkles, Zap } from 'lucide-react';
import MaskedHeading from '../components/MaskedHeading';
import WeeklyFocus from '../components/Copilot/WeeklyFocus';
import JobReadiness from '../components/Copilot/JobReadiness';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden pt-24">
      <div className="app-grid absolute inset-0" />
      <div className="noise" />
      <div className="orb w-[34rem] h-[34rem] bg-cyan-400/10 -top-32 -left-40" />
      <div className="orb w-[30rem] h-[30rem] bg-fuchsia-500/10 top-20 -right-40" style={{animationDelay:'-3s'}} />
      <div className="orb w-[28rem] h-[28rem] bg-violet-500/10 bottom-0 left-1/3" style={{animationDelay:'-6s'}} />

      <main className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6">
        <section className="min-h-[680px] flex flex-col justify-center items-center text-center py-20">
          <div className="reveal-up inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.06] px-4 py-2 text-xs font-bold uppercase tracking-[.22em] text-cyan-200 shadow-[0_0_35px_rgba(0,229,255,.08)]">
            <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-lime-300" />
            Evidence-driven developer growth
          </div>

          <h1 className="reveal-up mt-8 max-w-5xl w-full flex flex-col items-center text-5xl sm:text-7xl lg:text-[6.8rem] leading-[.9] font-black tracking-[-.055em]" style={{animationDelay:'.08s'}}>
            <span>Build proof.</span>
            <div className="w-full flex justify-center mt-1 sm:mt-2 h-[1.2em]">
              <MaskedHeading 
                text="Not promises."
                src="/bright-water-bg.jpg"
                tag="div"
                trigger="view"
                reveal="wipe"
                parallax={34}
                drift={15}
                align="center"
                textScale={0.13}
                className="font-black tracking-[-.055em] leading-[0.9] whitespace-nowrap"
              />
            </div>
          </h1>

          <p className="reveal-up mt-8 max-w-2xl text-base sm:text-lg leading-8 text-slate-400" style={{animationDelay:'.16s'}}>
            SkillForge reads your real code, resume and projects to create personalized challenges — then turns what you prove into a portfolio recruiters can verify.
          </p>

          <div className="reveal-up mt-10 flex flex-col sm:flex-row gap-3" style={{animationDelay:'.24s'}}>
            <Link href="/assessments" className="glow-button rounded-2xl px-7 py-4 bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300 text-slate-950 font-black flex items-center justify-center gap-2 shadow-[0_0_45px_rgba(0,229,255,.16)]">
              <Zap className="w-5 h-5" /> Enter the forge <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how" className="interactive-bounce rounded-2xl px-7 py-4 glass text-slate-200 font-semibold hover:bg-white/[.09] transition">
              See how it works
            </a>
          </div>

          <div className="reveal-up mt-14 w-full max-w-4xl" style={{animationDelay:'.32s'}}>
            <div className="lightning-line" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                [GitBranch,'Real code','Analyze the work you actually ship.'],
                [Sparkles,'Adaptive AI','Challenges shaped around your stack.'],
                [FileCheck2,'Verifiable proof','Earn credentials backed by evidence.']
              ].map(([Icon,title,desc]: any) => (
                <div key={title} className="glass rounded-2xl p-5 text-left card-lift">
                  <Icon className="w-5 h-5 text-cyan-300 mb-4" />
                  <div className="font-bold text-white">{title}</div>
                  <div className="text-xs leading-5 text-slate-500 mt-1">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="pb-28">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-violet-300">Your developer copilot</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">Turn your gaps into a plan.</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <WeeklyFocus />
            <JobReadiness />
          </div>
        </section>
      </main>
    </div>
  );
}
