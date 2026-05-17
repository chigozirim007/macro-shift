"use client";
import React, { useState, useEffect } from 'react';
import { Server, Database, Cloud, Shield, ArrowUpRight, Globe, Zap, Network } from 'lucide-react';
import PostFeed from '@/components/PostFeed';

export default function CloudInfrastructure() {
  const [stats, setStats] = useState([
    { label: "Signal Nodes", value: "...", momentum: "Syncing" },
    { label: "Broadcast Density", value: "...", momentum: "Syncing" },
    { label: "Network Health", value: "Apex", momentum: "Stable" }
  ]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/posts?category=Cloud & Infrastructure');
        if (res.ok) {
          const data = await res.json();
          const count = data.posts?.length || 0;
          setStats([
            { label: "Signal Nodes", value: (count * 42 + 124).toString(), momentum: "Rising" },
            { label: "Broadcast Density", value: `${count} Active`, momentum: "Live" },
            { label: "Network Health", value: "Apex", momentum: "Stable" }
          ]);
        }
      } catch (err) {
        console.error('Stats fetch failure:', err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#000d14] text-white pt-32">
      <div className="container mx-auto px-6">
        
        {/* Sector Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-20">
          <div className="max-w-2xl">
             <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
                <Cloud size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Core Infrastructure</span>
            </div>
            <h1 className="text-3xl md:text-7xl font-black tracking-tighter uppercase italic mb-4 md:mb-8">
              Cloud & <span className="text-blue-400">Infrastructure</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed font-light">
              Analyzing the backbone of the digital economy. From decentralized compute clusters to sub-sea fiber optimizations, we map the physical and virtual structures driving the next evolution of scale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-4 md:gap-6">
            {stats.map((item, i) => (
              <div key={i} className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl min-w-[180px] md:min-w-[200px]">
                <span className="block text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2">{item.label}</span>
                <div className="flex items-end justify-between gap-4">
                   <span className="text-xl md:text-2xl font-black italic">{item.value}</span>
                  <span className="text-[7px] md:text-[8px] font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-1 rounded-full">{item.momentum}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-24">
          <div className="p-8 md:p-10 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group">
            <Server className="absolute -right-8 -bottom-8 w-32 h-32 md:w-48 md:h-48 text-white/5 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl md:text-2xl font-black uppercase italic mb-3 md:mb-4">Edge Displacement</h3>
            <p className="text-sm md:text-base text-slate-400 mb-6 md:mb-8 max-w-sm">The transition from centralized hyper-regions to distributed edge-native compute nodes is accelerating.</p>
            <button className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">
              Read Infrastructure Audit <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="p-8 md:p-10 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group">
            <Database className="absolute -right-8 -bottom-8 w-32 h-32 md:w-48 md:h-48 text-white/5 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl md:text-2xl font-black uppercase italic mb-3 md:mb-4">Neural Data Lakes</h3>
            <p className="text-sm md:text-base text-slate-400 mb-6 md:mb-8 max-w-sm">Optimizing storage protocols for high-frequency model training and decentralized data residency.</p>
            <button className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-white hover:text-blue-400 transition-colors">
              Access Benchmarks <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Categories Feed */}
        <PostFeed activeCategory="Cloud & Infrastructure" />
      </div>
    </div>
  );
}
