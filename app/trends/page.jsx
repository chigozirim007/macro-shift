import React from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Globe, 
  BarChart3, 
  Compass, 
  Zap, 
  ArrowRight, 
  Map,
  Activity,
  Layers,
  ShieldCheck
} from 'lucide-react';
import PostFeed from '@/components/PostFeed';

export default function TrendsPage() {
  const trends = [
    {
      title: "Decentralized Physical Infrastructure (DePIN)",
      category: "Infrastructure",
      status: "Hyper-Growth",
      description: "Community-owned hardware networks for wireless, compute, and energy are disrupting traditional centralized utility monopolies.",
      metric: "+142% MoM",
      icon: <Layers className="w-6 h-6" />
    },
    {
      title: "The Sovereign Tech Stack",
      category: "Global Policy",
      status: "Strategic",
      description: "Nations are increasingly mandating localized data residency and proprietary silicon as 'digital borders' begin to materialize.",
      metric: "High Priority",
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: "Predictive Economic Engines",
      category: "Financial Tech",
      status: "Emerging",
      description: "AI models trained on real-time supply chain and logistics data are replacing lagging indicators for economic forecasting.",
      metric: "Early Momentum",
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#000d14] text-slate-300 pt-32 pb-24">
      {/* Global Connectivity Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-5%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-[2rem] text-blue-400">
              <TrendingUp size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
                Global <span className="text-blue-400">Trends</span>
              </h1>
              <p className="text-xs uppercase tracking-[0.5em] font-bold text-slate-500 mt-2 flex items-center gap-2">
                <Globe size={12} className="text-blue-500" />
                Strategic Momentum Audit
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Sentiment</span>
              <span className="text-white font-bold flex items-center gap-2">
                BULLISH <Activity size={14} className="text-green-500" />
              </span>
            </div>
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Volatility Index</span>
              <span className="text-white font-bold flex items-center gap-2">
                STABLE <Compass size={14} className="text-cyan-500" />
              </span>
            </div>
          </div>
        </div>

        {/* Featured Trend Card */}
        <div className="w-full p-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-indigo-500/20 rounded-[2.5rem] mb-20 shadow-2xl">
          <div className="bg-[#000d14]/90 backdrop-blur-3xl rounded-[2.4rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-5 pointer-events-none" />
            
            <div className="relative z-10 lg:w-3/5">
              <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 inline-block">
                Quarterly Alpha Insights
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-tight uppercase italic">
                The Era of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Cognitive Automation</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light mb-10">
                We are tracking a tectonic shift from "SaaS" to "AaaS" (Agents as a Service). 
                Legacy platforms that fail to integrate autonomous reasoning workflows face 
                irrelevance by the next fiscal cycle. 
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Tracking 842 Updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Institutional Consensus: 84%</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 lg:w-2/5 w-full">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center justify-between">
                  Projected Velocity
                  <BarChart3 size={16} className="text-blue-400" />
                </h4>
                <div className="space-y-6">
                  {[
                    { label: "Market Readiness", value: "92%" },
                    { label: "Capital Inflow", value: "78%" },
                    { label: "Legal Clarity", value: "45%" }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: item.value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tectonic Shifts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {trends.map((trend, i) => (
            <div key={i} className="group p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all duration-500 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                  {trend.icon}
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{trend.status}</span>
                  <span className="text-xl font-black text-white">{trend.metric}</span>
                </div>
              </div>

              <h4 className="text-white font-black text-xl mb-3 tracking-tight group-hover:text-blue-400 transition-colors uppercase italic">{trend.title}</h4>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">{trend.category}</p>
              <p className="text-sm leading-relaxed text-slate-400 mb-8 font-light">
                {trend.description}
              </p>

              <Link href="#" className="inline-flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest group-hover:gap-4 transition-all">
                Access Audit
                <ArrowRight size={14} className="text-blue-400" />
              </Link>
            </div>
          ))}
        </div>

        {/* Community Posts */}
        <PostFeed activeCategory="Trends" />

        {/* Global Strategy CTA */}
        <div className="mt-24 p-12 bg-gradient-to-br from-blue-600/20 via-transparent to-cyan-600/20 border border-white/10 rounded-[3rem] text-center">
          <Map size={48} className="mx-auto mb-8 text-blue-400 opacity-50" />
          <h3 className="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter">Your Map for the Next Shift.</h3>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
            Don't navigate the global tech corridors blindly. Get the verified tactical data you need to position your organization correctly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-10 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all">
              DOWNLOAD GLOBAL AUDIT
            </button>
            <button className="px-10 py-4 bg-white/5 border border-white/20 text-white font-black rounded-xl hover:bg-white/10 transition-all">
              BOOK A STRATEGY BRIEF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
