import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Globe, Shield, TrendingUp, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#000d14]">
      
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
      
      {/* Content Layer */}
      <main className="relative z-20 container mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
        
        {/* Hero Title */}
        <h1 className="max-w-4xl text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tight leading-none mb-12 uppercase italic">
          Welcome to <br />
          <span className="relative inline-block">
            <span className="absolute -inset-1 bg-cyan-500/20 blur-2xl rounded-full" />
            <span className="relative bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] pr-2">
              Macro-Shift
            </span>
          </span>
        </h1>

        {/* Sophisticated Write-up */}
        <div className="max-w-3xl space-y-8 text-lg md:text-xl text-slate-300 leading-relaxed font-light drop-shadow-lg">
          <p className="animate-fade-in-up [animation-delay:200ms]">
            In an era defined by rapid technological displacement, staying informed is no longer enough. 
            The difference between a market leader and a legacy organization lies in the ability to 
            distinguish between, real and hype. 
          </p>
          <p className="animate-fade-in-up [animation-delay:400ms] text-slate-400 border-l-2 border-cyan-500/30 pl-6 text-left italic">
            <span className="text-white font-bold not-italic">Macro-Shift</span> was engineered to be your strategic vantage point. 
            We don't just track tools; we analyze the tectonic movements within AI, decentralized infrastructure, 
            and emerging hardware ecosystems. Our platform serves as a high-fidelity intelligence layer, stripping 
            away the hype to reveal the underlying data structures that drive the next economic cycle.
          </p>

          <p className="animate-fade-in-up [animation-delay:600ms] text-white/90 font-medium">
            Whether you are optimizing a global communications network or deploying the next generation of 
            interactive web experiences, Macro-Shift provides the predictive clarity required to navigate 
            complexity. <span className="text-cyan-400">We provide the maps; you direct the shift.</span>
          </p>
        </div>

      </main>
    </div>
  );
}
