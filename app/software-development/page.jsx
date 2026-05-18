"use client";
import React, { useState, useEffect } from 'react';
import { Code2, Terminal, Cpu, Braces, ArrowUpRight, Zap, Coffee, Binary } from 'lucide-react';
import PostFeed from '@/components/PostFeed';

export default function SoftwareDevelopment() {
  const [stacks, setStacks] = useState([
    { name: "Rust", focus: "Systems", velocity: "Hyper", color: "text-orange-500", progress: "w-full" },
    { name: "Python", focus: "AI Ops", velocity: "Rising", color: "text-blue-400", progress: "w-2/3" },
    { name: "TypeScript", focus: "Fullstack", velocity: "Stable", color: "text-blue-500", progress: "w-1/2" }
  ]);

  useEffect(() => {
    async function fetchVelocity() {
      try {
        const res = await fetch('/api/posts?category=Software Development');
        if (res.ok) {
          const data = await res.json();
          const count = data.posts?.length || 0;
          // Dynamic velocity logic
          setStacks([
            { name: "System Integration", focus: "Memory Safety", velocity: count > 5 ? "Apex" : "High", color: "text-green-400", progress: count > 5 ? "w-full" : "w-3/4" },
            { name: "AI Orchestration", focus: "Agentic Ops", velocity: count > 2 ? "Rising" : "Emerging", color: "text-cyan-400", progress: count > 2 ? "w-2/3" : "w-1/3" },
            { name: "Network Security", focus: "Zero Trust", velocity: "Stable", color: "text-blue-400", progress: "w-1/2" }
          ]);
        }
      } catch (err) {
        console.error('Software velocity sync failure:', err);
      }
    }
    fetchVelocity();
  }, []);

  return (
    <div className="min-h-screen bg-[#000d14] text-white pt-32">
      <div className="container mx-auto px-6">
        
        {/* Header - Authority Broadcast */}
        <div className="mb-16 md:mb-24 max-w-5xl">
           <div className="flex items-center gap-5 mb-8">
            <div className="p-4 md:p-5 bg-green-500 text-[#000d14] rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <Code2 size={32} className="md:w-10 md:h-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-green-500/50">Engineering Excellence Sector</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Network Node: Active</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter uppercase italic mb-6 md:mb-10 leading-[0.9]">
            Software <br/><span className="text-green-400">Development</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 leading-relaxed font-light max-w-3xl">
            Deciphering the evolution of programming paradigms. From AI-augmented coding to memory-safe systems engineering, we analyze the tools and languages that will write the next decade.
          </p>
        </div>

        {/* Stack Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-24">
          {stacks.map((stack, i) => (
            <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-3xl group hover:border-green-500/30 transition-all">
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className={`p-2.5 md:p-3 bg-white/5 rounded-xl ${stack.color}`}>
                  <Terminal size={18} className="md:w-5 md:h-5" />
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Stack Velocity</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black italic mb-1">{stack.name}</h3>
              <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 md:mb-6">{stack.focus}</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-grow bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-green-500 ${stack.progress} rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]`} />
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-green-400">{stack.velocity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Feed */}
        <PostFeed activeCategory="Software Development" />
      </div>
    </div>
  );
}
