import { Server, Database, Cloud, Shield, ArrowUpRight, Globe, Zap, Network } from 'lucide-react';
import PostFeed from '@/components/PostFeed';

export default function CloudInfrastructure() {
  const data = [
    { label: "Uptime Protocol", value: "99.9999%", momentum: "Stable" },
    { label: "Global Latency", value: "14ms", momentum: "Improving" },
    { label: "Node Density", value: "4,281", momentum: "Rising" }
  ];

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
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-8">
              Cloud & <span className="text-blue-400">Infrastructure</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed font-light">
              Analyzing the backbone of the digital economy. From decentralized compute clusters to sub-sea fiber optimizations, we map the physical and virtual structures driving the next evolution of scale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-6">
            {data.map((item, i) => (
              <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl min-w-[200px]">
                <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{item.label}</span>
                <div className="flex items-end justify-between gap-4">
                  <span className="text-2xl font-black italic">{item.value}</span>
                  <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-1 rounded-full">{item.momentum}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="p-10 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
            <Server className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black uppercase italic mb-4">Edge Displacement</h3>
            <p className="text-slate-400 mb-8 max-w-sm">The transition from centralized hyper-regions to distributed edge-native compute nodes is accelerating.</p>
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">
              Read Infrastructure Audit <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
            <Database className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black uppercase italic mb-4">Neural Data Lakes</h3>
            <p className="text-slate-400 mb-8 max-w-sm">Optimizing storage protocols for high-frequency model training and decentralized data residency.</p>
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:text-blue-400 transition-colors">
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
