"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search as SearchIcon, 
  Sliders, 
  Zap, 
  Globe, 
  Clock, 
  ArrowRight, 
  Filter, 
  ShieldCheck, 
  CheckCircle2,
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  Share,
  MoreHorizontal
} from 'lucide-react';
import { PostSkeleton } from '@/components/Skeleton';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const fetchResults = async (searchTerm = '', filter = 'All') => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `/api/posts?query=${encodeURIComponent(searchTerm)}`;
      if (filter && filter !== 'All') {
        url += `&category=${encodeURIComponent(filter)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to retrieve intelligence');
      setResults(data.posts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(query, activeFilter);
  }, [activeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults(query, activeFilter);
  };

  function timeAgo(dateString) {
    if (!dateString) return 'Recently';
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  return (
    <div className="min-h-screen bg-[#000d14] pt-32 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mb-4 md:mb-6 block">Intelligence Retrieval</span>
          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase italic mb-6 md:mb-8">
            Query the <span className="text-cyan-400">Shift.</span>
          </h1>
          
          <form onSubmit={handleSearch} className="relative group">
            <SearchIcon className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by keyword, sector, or analyst..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] py-4 md:py-6 pl-12 md:pl-16 pr-24 md:pr-32 text-sm md:text-xl text-white focus:outline-none focus:border-cyan-500/50 transition-all shadow-2xl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 px-4 md:px-8 py-2 md:py-3 bg-cyan-500 text-[#000d14] font-black rounded-xl md:rounded-full hover:bg-cyan-400 transition-all text-[10px] md:text-xs tracking-widest uppercase">
              Analyze
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-xl">
              <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest mb-6 md:mb-8 flex items-center gap-3 italic">
                <Filter size={16} className="text-cyan-400" />
                Sector Filters
              </h3>
              <div className="space-y-2 md:space-y-3">
                {['All', 'AI & Machine Learning', 'Cloud & Infrastructure', 'Software Development', 'Emerging Hardware', 'Trends'].map((filter) => (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`w-full text-left px-4 md:px-5 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
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

          <div className="lg:col-span-9 space-y-6 md:space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col gap-1">
                <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  {isLoading ? 'Retrieving Intelligence...' : `Analysis of ${results.length} results found`}
                </p>
                {error && <p className="text-[9px] md:text-[10px] font-bold text-red-400 uppercase tracking-widest">{error}</p>}
              </div>
            </div>

            <div className="space-y-4 md:space-y-8 pb-32">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => <PostSkeleton key={i} />)
              ) : results.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-[2rem] md:rounded-[3rem]">
                  <p className="text-slate-500 uppercase tracking-widest font-black text-[10px] md:text-xs mb-4">No matching signals identified in the network.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {results.map((post) => {
                    const authorName = `${post.users?.first_name || ''} ${post.users?.last_name || ''}`.trim() || post.users?.username;
                    const isApex = post.users?.role === 'admin' || post.users?.email === 'nwokedichigozirim747@gmail.com';
                    
                    return (
                      <Link href={`/post/${post.id}`} key={post.id} className="block group">
                        <div className="relative bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-[3rem] p-4 md:p-12 hover:bg-white/[0.05] transition-all cursor-pointer shadow-2xl overflow-hidden">
                          <div className="absolute inset-0 z-0 pointer-events-none">
                            <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-gradient-radial from-cyan-500/5 via-transparent to-transparent animate-intelligence-pulse" />
                          </div>
                          
                          <div className="relative z-10">
                            <div className="flex gap-4 md:gap-8">
                              <img 
                                src={post.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=06b6d4&color=fff`} 
                                className="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-3xl border border-cyan-500/20 shrink-0 object-cover" 
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=06b6d4&color=fff`; }}
                              />
                              <div className="flex-grow space-y-2 md:space-y-6 overflow-hidden">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 md:gap-3 flex-wrap">
                                    <span className="text-xs md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none truncate max-w-[120px] md:max-w-none">
                                      {authorName}
                                    </span>
                                    {isApex && (
                                      <div className="flex items-center gap-1">
                                        <ShieldCheck size={14} className="text-cyan-400 md:w-[18px]" fill="currentColor" fillOpacity={0.1} />
                                        <CheckCircle2 size={12} className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] md:w-[16px]" fill="currentColor" fillOpacity={0.2} />
                                      </div>
                                    )}
                                    {post.users?.is_verified && !isApex && (
                                      <CheckCircle2 size={12} className="text-cyan-500 md:w-[16px]" fill="currentColor" fillOpacity={0.1} />
                                    )}
                                    <span className="text-[8px] md:text-base font-bold text-slate-500 tracking-tight">@{post.users?.username}</span>
                                  </div>
                                  <span className="text-[7px] md:text-[9px] font-black text-cyan-500/50 uppercase tracking-widest">{timeAgo(post.created_at)}</span>
                                </div>
                                <h4 className="text-sm md:text-xl font-black text-white leading-tight uppercase italic truncate">{post.title}</h4>
                                <p className="text-[11px] md:text-xl text-slate-300 leading-relaxed font-light line-clamp-2 md:line-clamp-3">{post.content}</p>
                                
                                <div className="flex items-center justify-between mt-4 md:mt-12 text-slate-500">
                                  <div className="flex items-center gap-4 md:gap-8">
                                    <div className="flex items-center gap-1.5 md:gap-2 hover:text-cyan-400 transition-colors">
                                      <MessageCircle size={14} className="md:w-[20px]" /><span className="text-[8px] md:text-sm font-black italic">{post.comments_count || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 md:gap-2 hover:text-green-400 transition-colors">
                                      <Repeat2 size={14} className="md:w-[20px]" /><span className="text-[8px] md:text-sm font-black italic">{post.reposts_count || 0}</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 md:gap-2 transition-colors ${post.liked ? 'text-pink-500' : 'hover:text-pink-500'}`}>
                                      <Heart size={14} className="md:w-[20px]" fill={post.liked ? 'currentColor' : 'none'} /><span className="text-[8px] md:text-sm font-black italic">{post.likes_count || 0}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 md:gap-4">
                                    <Bookmark size={14} className={`md:w-[20px] ${post.bookmarked ? 'text-cyan-400' : 'hover:text-cyan-400'}`} fill={post.bookmarked ? 'currentColor' : 'none'} />
                                    <Share size={14} className="md:w-[20px] hover:text-cyan-400" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
