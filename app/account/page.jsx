"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Shield, Zap, Bookmark, Settings, ArrowRight, Clock, Search, Check, Globe, Heart, MessageCircle, Repeat2, Share, Loader2 } from 'lucide-react';
import Link from 'next/link';

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [posts, setPosts] = useState([]);
  const [userStats, setUserStats] = useState({ followers: 0, following: 0 });
  const [activeTab, setActiveTab] = useState('Posts');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.id) return;
      setIsLoading(true);
      try {
        const [postsRes, statsRes] = await Promise.all([
          fetch(`/api/posts?user_id=${session.user.id}`),
          fetch(`/api/users/${session.user.id}/stats`)
        ]);

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData.posts || []);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setUserStats(statsData);
        }
      } catch (err) {
        console.error('Error fetching profile data', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (session?.user) {
      fetchData();
    }
  }, [session?.user]);

  if (status === "loading" || !session) {
    return <div className="min-h-screen bg-[#000d14] flex items-center justify-center">
      <Loader2 size={40} className="text-cyan-500 animate-spin" />
    </div>;
  }

  const user = session.user;

  // Filter content based on active tab
  const getTabContent = () => {
    if (activeTab === 'Posts') return posts;
    if (activeTab === 'Bookmark') return posts.filter(p => p.bookmarked);
    return []; // For now, other tabs are empty
  };

  const filteredContent = getTabContent();

  // Interactions (same as dashboard)
  const toggleAction = async (postId, actionType, countField, activeField, endpoint) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const isActive = p[activeField];
      return { 
        ...p, 
        [activeField]: !isActive, 
        [countField]: isActive ? Math.max(0, p[countField] - 1) : p[countField] + 1 
      };
    }));

    try {
      await fetch(`/api/posts/${postId}/${endpoint}`, { method: 'POST' });
    } catch {
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        const isActive = !p[activeField]; 
        return { 
          ...p, 
          [activeField]: isActive, 
          [countField]: isActive ? p[countField] + 1 : Math.max(0, p[countField] - 1) 
        };
      }));
    }
  };

  const handleLike = (postId) => toggleAction(postId, 'like', 'likes_count', 'liked', 'like');
  const handleBookmark = (postId) => toggleAction(postId, 'bookmark', 'bookmarks_count', 'bookmarked', 'bookmark');
  const handleRepost = (postId) => toggleAction(postId, 'repost', 'reposts_count', 'reposted', 'repost');

  return (
    <div className="min-h-screen bg-[#000d14] pb-20 overflow-hidden relative">
      {/* Top Navigation Bar */}
      <div className="fixed top-[64px] md:top-[104px] w-full z-40 bg-[#000d14]/95 backdrop-blur-3xl border-b border-cyan-500/10 py-3">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/" className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 rotate-180 text-cyan-400" />
            </Link>
            <div className="truncate max-w-[150px] md:max-w-none">
              <h2 className="text-xs md:text-sm font-black text-white uppercase italic tracking-wider truncate">{user.name}</h2>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest">{posts.length} Strategic Posts</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 text-slate-400">
             <Search size={16} className="md:w-5 md:h-5 hover:text-cyan-400 cursor-pointer transition-colors" />
             <Link href="/account/edit">
                <Settings size={16} className="md:w-5 md:h-5 hover:text-cyan-400 cursor-pointer transition-colors" />
             </Link>
          </div>
        </div>
      </div>

      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12 md:mb-16 mt-32 md:mt-48 text-center md:text-left">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-[#001b2b] rounded-full p-1 border-4 border-[#000d14]">
              <img 
                src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=06b6d4&color=fff`} 
                alt={user.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=06b6d4&color=fff`; }}
              />
            </div>
          </div>

          <div className="space-y-2 flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase italic flex items-center justify-center md:justify-start gap-2">
                {user.name}
                <div className="w-4 h-4 md:w-5 md:h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                   <Check size={10} className="text-[#000d14] md:w-3 md:h-3 stroke-[4]" />
                </div>
                <span className="text-[10px] md:text-xs font-bold text-cyan-500 normal-case italic tracking-normal ml-1">Verified Strategist</span>
              </h1>
            </div>
            <p className="text-slate-500 font-bold tracking-widest text-[10px] md:text-xs uppercase">@{user.username}</p>
            
            <p className="text-sm md:text-base text-slate-300 font-light max-w-2xl mt-2">{user.bio || 'Strategic Intelligence Analyst'}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 md:pt-4">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] md:text-xs font-light">
                <Globe size={12} className="text-slate-600 md:w-3.5 md:h-3.5" />
                {user.location || 'Not Specified'}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] md:text-xs font-light">
                <Clock size={12} className="text-slate-600 md:w-3.5 md:h-3.5" />
                Joined {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-6 pt-3 md:pt-4">
              <div className="flex items-center gap-1.5">
                <span className="text-xs md:text-sm font-black text-white italic">{userStats.following || 0}</span>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Following</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs md:text-sm font-black text-white italic">{userStats.followers || 0}</span>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Followers</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
             <Link href="/account/edit">
                 <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                     Edit Profile
                 </button>
             </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: System Info (1/4 width) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Account Status</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[8px] font-black text-cyan-500 uppercase tracking-widest mb-1">Security Tier</p>
                   <p className="text-sm font-bold text-white italic uppercase tracking-tighter">Level 1 Protocol</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[8px] font-black text-cyan-500 uppercase tracking-widest mb-1">Last Sync</p>
                   <p className="text-sm font-bold text-white">Live</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content Feed (3/4 width) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Custom Tabs */}
            <div className="flex border-b border-white/10 mt-4 overflow-x-auto no-scrollbar scroll-smooth">
              {['Posts', 'Replies', 'Bookmark', 'Media'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 md:px-8 py-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 rounded-t-full shadow-[0_-5px_15px_rgba(6,182,212,0.5)]" />}
                </button>
              ))}
            </div>

            {/* Content Feed */}
            <div className="space-y-6 pt-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                </div>
              ) : filteredContent.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
                  <p className="text-slate-500 uppercase tracking-widest font-black text-xs mb-4">no {activeTab.toLowerCase()}.............</p>
                </div>
              ) : (
                filteredContent.map((post) => (
                  <div key={post.id} className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 hover:bg-white/10 transition-all group cursor-pointer">
                    <Link href={`/post/${post.id}`}>
                      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                        <img 
                            src={post.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=06b6d4&color=fff`} 
                            className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover" 
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=06b6d4&color=fff`; }}
                        />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs md:text-sm font-black text-white uppercase italic tracking-wider flex items-center gap-2">
                              {post.users?.first_name} {post.users?.last_name}
                              {post.users?.is_verified && <Shield className="w-3 h-3 text-cyan-400 fill-cyan-400/20" />}
                            </h4>
                          </div>
                          <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{timeAgo(post.created_at)} • {post.category}</p>
                        </div>
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <h3 className="text-lg md:text-xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase italic tracking-tight">
                          {post.title}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-light">
                          {post.content}
                        </p>
                        {post.image_url && (
                          <div className="mt-4 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 aspect-video relative group/image">
                            <img src={post.image_url} className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-1000" />
                          </div>
                        )}
                        
                        {/* Post Actions */}
                        <div className="flex items-center justify-between mt-6 max-w-lg text-slate-400">
                          <div className="flex items-center gap-1.5 md:gap-3 hover:text-cyan-400 transition-colors">
                            <MessageCircle size={16} />
                            <span className="text-[10px] md:text-xs font-black italic">{post.comments_count || 0}</span>
                          </div>
                          <div 
                            onClick={(e) => { e.preventDefault(); handleRepost(post.id); }}
                            className={`flex items-center gap-1.5 md:gap-3 transition-colors ${post.reposted ? 'text-green-400' : 'hover:text-green-400'}`}
                          >
                            <Repeat2 size={16} />
                            <span className="text-[10px] md:text-xs font-black italic">{post.reposts_count || 0}</span>
                          </div>
                          <div 
                            onClick={(e) => { e.preventDefault(); handleLike(post.id); }}
                            className={`flex items-center gap-1.5 md:gap-3 transition-colors ${post.liked ? 'text-pink-500' : 'hover:text-pink-500'}`}
                          >
                            <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} />
                            <span className="text-[10px] md:text-xs font-black italic">{post.likes_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1.5 md:gap-3 hover:text-cyan-400 transition-colors">
                            <Zap size={16} />
                            <span className="text-[10px] md:text-xs font-black italic">{post.views_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
