"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  BrainCircuit, 
  Network, 
  Zap, 
  ArrowUpRight, 
  Bot, 
  Microchip,
  Activity
} from 'lucide-react';
import PostFeed from '@/components/PostFeed';

export default function AIPage() {
  const [news, setNews] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  useEffect(() => {
    async function fetchHighlights() {
      try {
        const res = await fetch('/api/posts?category=AI & Machine Learning');
        if (res.ok) {
          const data = await res.json();
          // Take top 3 most significant (could be by likes, but here just latest for now)
          const highlights = (data.posts || []).slice(0, 3).map(post => ({
            status: "Active",
            category: post.category,
            title: post.title,
            description: post.content.substring(0, 150) + '...',
            impact: "Significant",
            icon: <BrainCircuit className="w-6 h-6" />,
            id: post.id
          }));
          setNews(highlights);
        }
      } catch (err) {
        console.error('Failed to fetch AI highlights:', err);
      } finally {
        setIsLoadingNews(false);
      }
    }
    fetchHighlights();
  }, []);

  return (
    <div className="min-h-screen bg-[#000d14] text-slate-300 pt-32 pb-24">
      {/* Neural Background Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        
        {/* Header Section - Authority Broadcast */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex items-center gap-5 md:gap-8">
            <div className="p-4 md:p-5 bg-cyan-500 text-[#000d14] rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_0_30px_rgba(6,182,212,0.3)] shrink-0">
              <Cpu size={32} className="md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                AI & <span className="text-cyan-400">Machine Learning</span>
              </h1>
              <p className="text-[10px] md:text-sm uppercase tracking-[0.4em] font-black text-cyan-500/50 mt-3 md:mt-4 flex items-center gap-2">
                <Activity size={14} className="animate-pulse" /> Intelligence Sector Node
              </p>
            </div>
          </div>
        </div>

        {/* Hero Vantage Point */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mb-20 md:mb-32">
          <div className="lg:col-span-2 p-8 md:p-16 bg-white/[0.03] border border-white/5 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity hidden md:block">
              <Bot size={160} strokeWidth={1} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 md:mb-10 uppercase italic tracking-tighter">The Neural Displacement</h2>
            <p className="text-lg md:text-2xl leading-relaxed text-slate-400 mb-10 md:mb-12 max-w-3xl font-light">
              We are moving beyond the era of "Chatbots" into the era of autonomous agents. The current shift indicates a 
              massive migration from centralized API dependencies to distributed, specialized reasoning models. 
              <span className="text-white font-bold italic"> Efficiency is the new scale.</span>
            </p>
            <div className="flex flex-wrap gap-6">
              <span className="px-6 py-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-[10px] font-black text-cyan-400 flex items-center gap-3 uppercase tracking-widest">
                <Activity size={16} className="animate-pulse" />
                Live Network Stream: Active
              </span>
              <span className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                Last Sector Audit: 2.4h ago
              </span>
            </div>
          </div>
          
          <div className="p-8 md:p-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[3rem] text-[#000d14] flex flex-col justify-between shadow-[0_30px_60px_rgba(6,182,212,0.4)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-10 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="p-4 bg-[#000d14] text-cyan-400 rounded-2xl w-fit shadow-xl group-hover:scale-110 transition-transform">
                <Zap size={32} strokeWidth={3} />
              </div>
              <h3 className="text-3xl md:text-4xl font-black uppercase leading-none tracking-tighter italic">
                Neural <br/> Mastery
              </h3>
              <p className="text-sm md:text-base font-bold opacity-90 leading-relaxed uppercase tracking-tight">
                Unlock our deep-dive data on model efficiency benchmarks and proprietary hardware roadmaps.
              </p>
            </div>
            <button className="mt-10 md:mt-12 w-full py-5 bg-[#000d14] text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-xs md:text-sm uppercase tracking-widest shadow-2xl relative z-10">
              ELEVATE TO APEX
              <ArrowUpRight size={20} />
            </button>
          </div>
        </section>

        {/* News Feed */}
        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-600 mb-10 pl-2">Sector Updates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {news.map((item, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-cyan-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                  item.status === 'Strong' ? 'bg-green-500/20 text-green-400' :
                  item.status === 'Rising' ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {item.status} Momentum
                </span>
              </div>
              <h4 className="text-white font-bold text-xl mb-2 group-hover:text-cyan-400 transition-colors uppercase italic">{item.title}</h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">{item.category}</p>
              <p className="text-sm leading-relaxed text-slate-400 mb-6">
                {item.description}
              </p>
              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Strategic Impact</span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest bg-white/10 px-2 py-1 rounded">
                  {item.impact}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Community Posts */}
        <PostFeed activeCategory="AI & Machine Learning" />

        {/* Bottom CTA */}
        <div className="mt-16 md:mt-24 p-8 md:p-12 bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />
          <h3 className="text-xl md:text-3xl font-black text-white mb-4 md:mb-6 uppercase relative z-10 italic">Decipher the next neural shift.</h3>
          <p className="text-xs md:text-base text-slate-400 max-w-xl mx-auto mb-8 md:mb-10 relative z-10">
            Join 40,000+ engineers and strategists getting our weekly neural audit. No noise. Just the news that matters.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 relative z-10">
            <input 
              type="email" 
              placeholder="terminal@intelligence.com" 
              className="px-6 py-4 bg-[#000d14] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all w-full sm:w-80 text-sm"
            />
            <button className="px-8 py-4 bg-cyan-500 text-[#000d14] font-black rounded-xl hover:bg-cyan-400 transition-all text-xs md:text-sm">
              SUBSCRIBE TO NEWS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
