"use client";

import React, { useState, useEffect } from 'react';
import { Microchip, Cpu, Zap, Battery, Radio, Monitor, Speaker, ArrowUpRight } from 'lucide-react';
import PostFeed from '@/components/PostFeed';

export default function EmergingHardware() {
  const [stability, setStability] = useState([
    { label: "Silicon Supply", status: "Critical", color: "text-red-500" },
    { label: "Foundry Access", status: "Tight", color: "text-orange-500" },
    { label: "Energy Efficiency", status: "Improving", color: "text-green-500" }
  ]);

  useEffect(() => {
    async function fetchStability() {
      try {
        const res = await fetch('/api/posts?category=Emerging Hardware');
        if (res.ok) {
          const data = await res.json();
          const count = data.posts?.length || 0;
          setStability([
            { label: "Signal Density", status: `${count} Active`, color: count > 0 ? "text-cyan-400" : "text-slate-500" },
            { label: "Foundry Access", status: count > 3 ? "Open" : "Tight", color: count > 3 ? "text-green-500" : "text-orange-500" },
            { label: "Market Sync", status: "Verified", color: "text-cyan-500" }
          ]);
        }
      } catch (err) {
        console.error('Hardware stability sync failure:', err);
      }
    }
    fetchStability();
  }, []);

  return (
    <div className="min-h-screen bg-[#000d14] text-white pt-32">
      <div className="container mx-auto px-6">
        
        {/* Header - Authority Broadcast */}
        <div className="flex flex-col lg:flex-row gap-12 md:gap-20 mb-20 md:mb-32">
          <div className="lg:w-2/3">
             <div className="flex items-center gap-5 mb-8">
              <div className="p-4 md:p-5 bg-red-600 text-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                <Microchip size={32} className="md:w-10 md:h-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-red-500/50">Silicon & Systems Sector</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Network Node: Active</span>
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-8xl font-black tracking-tighter uppercase italic mb-6 md:mb-10 leading-[0.9]">
              Emerging <br/><span className="text-red-400">Hardware</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-400 leading-relaxed font-light mb-10 md:mb-12 max-w-3xl">
              Tracing the physical evolution of intelligence. From custom ASICs for neural reasoning to photonics and next-generation energy density, we analyze the hardware making the software possible.
            </p>
            <div className="flex gap-4">
               <button className="w-full sm:w-auto px-10 py-5 bg-red-600 text-[#000d14] font-black rounded-2xl hover:bg-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-3 text-xs md:text-sm uppercase tracking-widest shadow-2xl">
                VIEW SILICON ROADMAP <Zap size={20} />
              </button>
            </div>
          </div>

          <div className="lg:w-1/3 p-8 md:p-12 bg-white/[0.03] border border-white/5 rounded-[3rem] backdrop-blur-3xl shadow-2xl flex flex-col justify-center">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 italic">Sector Stability</h4>
            <div className="space-y-8">
              {stability.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-4 border-b border-white/5">
                  <span className="text-base font-black text-white italic uppercase tracking-tighter">{item.label}</span>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/5 rounded-lg ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24">
          {[
            { title: "Photonics", icon: <Zap size={24} />, desc: "Optical compute layers for zero-heat neural processing." },
            { title: "Solid State", icon: <Battery size={24} />, desc: "Next-gen energy storage for mobile intelligence." },
            { title: "RISC-V", icon: <Cpu size={24} />, desc: "Open-source silicon architecture gaining global momentum." },
            { title: "6G RF", icon: <Radio size={24} />, desc: "Terahertz frequency stacks for hyper-connected nodes." }
          ].map((feature, idx) => (
            <div key={idx} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl hover:bg-white/10 transition-all group">
              <div className="text-red-400 mb-4 md:mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h4 className="text-lg md:text-xl font-black uppercase italic mb-2 tracking-tight text-white">{feature.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Community Posts */}
        <PostFeed activeCategory="Emerging Hardware" />
      </div>
    </div>
  );
}
