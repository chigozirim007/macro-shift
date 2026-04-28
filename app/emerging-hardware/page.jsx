import React from 'react';
import { Microchip, Cpu, Zap, Battery, ArrowUpRight, Radio, Monitor, Speaker } from 'lucide-react';
import PostFeed from '@/components/PostFeed';

export default function EmergingHardware() {
  return (
    <div className="min-h-screen bg-[#000d14] text-white pt-32">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          <div className="lg:w-2/3">
             <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
                <Microchip size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Silicon & Systems</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-8">
              Emerging <span className="text-red-400">Hardware</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed font-light mb-10">
              Tracing the physical evolution of intelligence. From custom ASICs for neural reasoning to photonics and next-generation energy density, we analyze the hardware making the software possible.
            </p>
            <div className="flex gap-4">
               <button className="px-8 py-4 bg-red-500 text-[#000d14] font-black rounded-xl hover:bg-red-400 transition-all flex items-center gap-2">
                VIEW SILICON ROADMAP <Zap size={18} />
              </button>
            </div>
          </div>

          <div className="lg:w-1/3 p-8 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col justify-center">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Sector Stability</h4>
            <div className="space-y-6">
              {[
                { label: "Silicon Supply", status: "Critical", color: "text-red-500" },
                { label: "Foundry Access", status: "Tight", color: "text-orange-500" },
                { label: "Energy Efficiency", status: "Improving", color: "text-green-500" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-sm font-bold text-white">{item.label}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { title: "Photonics", icon: <Zap size={24} />, desc: "Optical compute layers for zero-heat neural processing." },
            { title: "Solid State", icon: <Battery size={24} />, desc: "Next-gen energy storage for mobile intelligence." },
            { title: "RISC-V", icon: <Cpu size={24} />, desc: "Open-source silicon architecture gaining global momentum." },
            { title: "6G RF", icon: <Radio size={24} />, desc: "Terahertz frequency stacks for hyper-connected nodes." }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
              <div className="text-red-400 mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h4 className="text-white font-black uppercase italic mb-2 tracking-tight">{feature.title}</h4>
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
