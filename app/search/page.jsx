"use client";

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Sliders, Zap, Globe, Clock, ArrowRight, Filter } from 'lucide-react';
import { PostSkeleton } from '@/components/Skeleton';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // Mock search results
  const results = [
    {
      id: 1,
      title: "Neural-Lattice Structures in Global Defense",
      category: "AI & Machine Learning",
      author: "MacroShift Intelligence",
      time: "2h ago",
      snippet: "Analyzing the tectonic shift in encryption standards as neural-lattice structures begin replacing legacy RSA protocols across sovereign stacks..."
    },
    {
      id: 2,
      title: "Graphene Transistors: Post-Silicon Supremacy",
      category: "Emerging Hardware",
      author: "Hardware Terminal",
      time: "5h ago",
      snippet: "The validation of graphene-based NPUs marks the beginning of the post-silicon era, offering 10x clock speeds with minimal thermal displacement..."
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#000d14] pt-32 pb-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Search Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mb-6 block">Intelligence Retrieval</span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic mb-8">
            Query the <span className="text-cyan-400">Shift.</span>
          </h1>
          
          <form onSubmit={handleSearch} className="relative group">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by keyword, sector, or analyst..."
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-xl text-white focus:outline-none focus:border-cyan-500/50 transition-all shadow-2xl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 px-8 py-3 bg-cyan-500 text-[#000d14] font-black rounded-full hover:bg-cyan-400 transition-all text-xs tracking-widest uppercase">
              Analyze
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3 italic">
                <Filter size={16} className="text-cyan-400" />
                Sector Filters
              </h3>
              <div className="space-y-3">
                {['All', 'AI & Machine Learning', 'Cloud & Infrastructure', 'Software Development', 'Emerging Hardware', 'Trends'].map((filter) => (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeFilter === filter 
                        ? 'bg-cyan-500 text-[#000d14] shadow-[0_10px_20px_rgba(6,182,212,0.2)]' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Feed */}
          <div className="lg:col-span-9 space-y-8">
            <div className="flex items-center justify-between px-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                {isLoading ? 'Retrieving Intelligence...' : `Analysis of ${results.length} results found`}
              </p>
              <div className="flex items-center gap-4 text-slate-500">
                <Sliders size={16} className="cursor-pointer hover:text-white" />
              </div>
            </div>

            {isLoading ? (
              Array(3).fill(0).map((_, i) => <PostSkeleton key={i} />)
            ) : (
              <div className="space-y-6">
                {results.map((result) => (
                  <Link href={`/post/${result.id}`} key={result.id}>
                    <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 md:p-10 hover:bg-white/[0.05] transition-all group cursor-pointer shadow-xl">
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-[8px] font-black text-cyan-400 uppercase tracking-widest">
                          {result.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <Clock size={12} className="text-cyan-500" />
                          {result.time}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase italic tracking-tighter mb-4">
                        {result.title}
                      </h3>
                      <p className="text-slate-400 text-base font-light leading-relaxed mb-8">
                        {result.snippet}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                            <Globe size={16} className="text-cyan-500" />
                          </div>
                          <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{result.author}</span>
                        </div>
                        <ArrowRight size={20} className="text-slate-700 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
