import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Globe, Shield, TrendingUp, Cpu } from 'lucide-react';
import PostFeed from '@/components/PostFeed';
import { auth } from "@/auth";
import AuthenticatedHome from '@/components/AuthenticatedHome';

export default async function Home() {
  const session = await auth();

  if (session) {
    return <AuthenticatedHome session={session} />;
  }

  return (
    <div className="relative min-h-screen bg-[#000d14]">
      {/* Hero Section with Cinematic Background */}
      <section className="relative min-h-screen md:min-h-[100dvh] pt-32 md:pt-40 pb-20 flex flex-col items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-screen"
        >
          <source src="/bgvideo.mp4" type="video/mp4" />
          <img src="/bgimage.png" alt="Background" className="w-full h-full object-cover opacity-50" />
        </video>

        {/* Dynamic Overlay for Depth & Readability */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#000d14] via-[#001b2b]/40 to-[#000d14] z-10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-11 pointer-events-none" />

        {/* Hero Content */}
        <main className="relative z-20 container mx-auto px-6 text-center flex flex-col items-center">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-6xl lg:text-8xl font-black text-white tracking-tight uppercase italic leading-none pr-2">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Macro-Shift
              </span>
            </h1>
          </div>

          <div className="max-w-3xl space-y-8 animate-fade-in-up delay-200">
            <p className="text-base md:text-xl text-slate-300 leading-relaxed font-light">
              In an era defined by rapid technological displacement, staying informed is no longer enough. 
              The difference between a market leader and a legacy organization lies in the ability to 
              distinguish between <span className="text-cyan-400 font-bold">"noise"</span> and 
              <span className="text-blue-400 font-bold"> "strategic news."</span>
            </p>
            
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              Macro-Shift was engineered to be your strategic vantage point. We don't just track tools; we analyze the 
              tectonic movements within AI, decentralized infrastructure, and emerging hardware ecosystems. Our platform 
              serves as a high-fidelity intelligence layer, stripping away the hype to reveal the underlying data 
              structures that drive the next economic cycle.
            </p>
            
            <p className="text-xs md:text-sm text-slate-500 italic">
              Whether you are optimizing a global communications network or deploying the next generation of 
              interactive web experiences, Macro-Shift provides the predictive clarity required to navigate 
              complexity. <span className="text-cyan-400">We provide the maps; you direct the shift.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-8">
               <Link href="/get-started" className="w-full sm:w-auto">
                <button className="w-full px-10 py-4 bg-cyan-500 text-[#000d14] font-black rounded-xl hover:bg-cyan-400 hover:-translate-y-1 transition-all shadow-[0_15px_40px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group text-sm md:text-base">
                   GET STARTED
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/ai-&-machine-learning" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all backdrop-blur-md text-sm md:text-base">
                  VIEW LATEST NEWS
                </button>
              </Link>
            </div>
          </div>
        </main>
      </section>

      {/* Feature Highlights Section (Solid Theme Color) */}
      <section className="bg-[#000d14] py-24 border-y border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          <div className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-cyan-500/30 transition-all group">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <h3 className="text-white font-black text-lg uppercase tracking-widest italic">Rapid Insights</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Real-time analysis of market-defining tech breakthroughs as they happen.
            </p>
          </div>
          <div className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <h3 className="text-white font-black text-lg uppercase tracking-widest italic">Global Trends</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Connecting dots across international tech corridors to map your strategic path.
            </p>
          </div>
          <div className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all group">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <h3 className="text-white font-black text-lg uppercase tracking-widest italic">Verified News</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Deep-dive reporting backed by industry veterans and verified data points.
            </p>
          </div>
        </div>
      </section>

      {/* Post Feed (Solid Theme Color) */}
      <PostFeed />

    </div>
  );
}
