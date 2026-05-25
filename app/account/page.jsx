"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { ShieldCheck, Bookmark, Settings, ArrowRight, Clock, Search, Globe, Heart, MessageCircle, Repeat2, Loader2, CheckCircle2, Radio, Layers3 } from 'lucide-react';
import Link from 'next/link';

function timeAgo(dateString) {
  if (!dateString) return 'recently';
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const tabs = ['Posts', 'Replies', 'Reposts', 'Bookmark', 'Media'];

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [posts, setPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [repostedPosts, setRepostedPosts] = useState([]);
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
        const timestamp = Date.now();
        const [postsRes, bookmarksRes, repostsRes, statsRes] = await Promise.all([
          fetch(`/api/posts?user_id=${session.user.id}&t=${timestamp}`, { cache: 'no-store' }),
          fetch(`/api/posts?bookmarked_by=${session.user.id}&t=${timestamp}`, { cache: 'no-store' }),
          fetch(`/api/posts?reposted_by=${session.user.id}&t=${timestamp}`, { cache: 'no-store' }),
          fetch(`/api/users/${session.user.id}/stats?t=${timestamp}`, { cache: 'no-store' })
        ]);

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData.posts || []);
        }

        if (bookmarksRes.ok) {
          const bookmarksData = await bookmarksRes.json();
          setBookmarkedPosts(bookmarksData.posts || []);
        }

        if (repostsRes.ok) {
          const repostsData = await repostsRes.json();
          setRepostedPosts(repostsData.posts || []);
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
  }, [session?.user, session?.user?.id]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-[#000d14] flex items-center justify-center">
        <Loader2 size={40} className="text-cyan-500 animate-spin" />
      </div>
    );
  }

  const user = session.user;
  const isApex = user.role === 'admin' || user.email === 'nwokedichigozirim747@gmail.com';

  const getTabContent = () => {
    if (activeTab === 'Posts') return posts;
    if (activeTab === 'Bookmark') return bookmarkedPosts;
    if (activeTab === 'Reposts') return repostedPosts;
    return [];
  };

  const updatePostAcrossLists = (updater) => {
    setPosts(prev => prev.map(updater));
    setBookmarkedPosts(prev => prev.map(updater));
    setRepostedPosts(prev => prev.map(updater));
  };

  const toggleAction = async (postId, actionType, countField, activeField, endpoint) => {
    const optimisticUpdate = (post) => {
      if (post.id !== postId) return post;
      const isActive = post[activeField];
      return {
        ...post,
        [activeField]: !isActive,
        [countField]: isActive ? Math.max(0, (post[countField] || 0) - 1) : (post[countField] || 0) + 1
      };
    };

    const revertUpdate = (post) => {
      if (post.id !== postId) return post;
      const isActive = !post[activeField];
      return {
        ...post,
        [activeField]: isActive,
        [countField]: isActive ? (post[countField] || 0) + 1 : Math.max(0, (post[countField] || 0) - 1)
      };
    };

    updatePostAcrossLists(optimisticUpdate);

    try {
      const res = await fetch(`/api/posts/${postId}/${endpoint}`, { method: 'POST' });
      if (!res.ok) {
        updatePostAcrossLists(revertUpdate);
        return;
      }

      const data = await res.json().catch(() => null);
      if (data) {
        updatePostAcrossLists((post) => {
          if (post.id !== postId) return post;
          const updates = {};
          if (typeof data[activeField] === 'boolean') updates[activeField] = data[activeField];
          if (typeof data[countField] === 'number') updates[countField] = data[countField];
          return { ...post, ...updates };
        });
      }
    } catch {
      updatePostAcrossLists(revertUpdate);
    }
  };

  const handleLike = (postId) => toggleAction(postId, 'like', 'likes_count', 'liked', 'like');
  const handleBookmark = (postId) => toggleAction(postId, 'bookmark', 'bookmarks_count', 'bookmarked', 'bookmark');
  const handleRepost = (postId) => toggleAction(postId, 'repost', 'reposts_count', 'reposted', 'repost');

  const filteredContent = getTabContent();
  const tabCounts = {
    Posts: posts.length,
    Replies: 0,
    Reposts: repostedPosts.length,
    Bookmark: bookmarkedPosts.length,
    Media: 0
  };

  const displayName = user.name || user.username || 'Macro Shift';
  const avatarUrl = user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=06b6d4&color=fff`;

  return (
    <div className="min-h-screen bg-[#000d14] text-white pb-24 pt-28 md:pt-36 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(6,182,212,0.12),transparent_28%),radial-gradient(circle_at_90%_15%,rgba(59,130,246,0.08),transparent_25%),linear-gradient(180deg,rgba(0,35,50,0.45),transparent_45%)] pointer-events-none" />
      <div className="absolute left-0 top-40 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-cyan-400/15 bg-white/[0.035] shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,182,212,0.12),transparent_35%,rgba(255,255,255,0.03))] pointer-events-none" />
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative p-5 md:p-10">
            <div className="flex items-center justify-between gap-3 mb-8">
              <button onClick={() => router.back()} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300 hover:bg-cyan-400 hover:text-[#00121b] transition-all">
                <ArrowRight className="h-4 w-4 rotate-180" /> Back
              </button>
              <div className="flex items-center gap-3">
                <button className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 hover:text-white transition-colors">
                  <Search size={14} /> Search Intel
                </button>
                <Link href="/account/edit" className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300 hover:bg-cyan-400 hover:text-[#00121b] transition-all">
                  <Settings size={14} /> Edit
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr,auto] gap-6 lg:gap-10 items-center">
              <div className="relative mx-auto lg:mx-0">
                <div className="absolute -inset-4 rounded-[2rem] bg-cyan-400/10 blur-2xl" />
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="relative h-28 w-28 md:h-36 md:w-36 rounded-[2rem] border border-cyan-400/30 object-cover shadow-2xl"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=06b6d4&color=fff`; }}
                />
              </div>

              <div className="text-center lg:text-left space-y-4">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.28em] text-cyan-300">
                    <Radio size={12} /> Active Operator
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-[0.28em] text-slate-300">
                    {isApex ? <ShieldCheck size={12} className="text-amber-400" /> : <CheckCircle2 size={12} className="text-cyan-400" />}
                    {isApex ? 'Apex Protocol' : (user.is_verified ? 'Verified Strategist' : 'Standard Protocol')}
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                    {displayName}
                  </h1>
                  <p className="mt-3 text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-cyan-500/80">@{user.username || 'macro-operator'}</p>
                </div>

                <p className="max-w-2xl text-sm md:text-base leading-relaxed text-slate-300 font-light">
                  {user.bio || 'Strategic intelligence analyst tracking the signals, shifts, and systems behind the next technology cycle.'}
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><Globe size={13} className="text-cyan-500" />{user.location || 'Location hidden'}</span>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><Clock size={13} className="text-cyan-500" />Joined {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 min-w-[220px]">
                {[
                  ['Posts', posts.length],
                  ['Reposts', repostedPosts.length],
                  ['Bookmarks', bookmarkedPosts.length],
                  ['Reach', userStats.followers || 0]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-center shadow-inner shadow-white/5">
                    <p className="text-2xl font-black italic text-white">{value}</p>
                    <p className="mt-1 text-[8px] font-black uppercase tracking-[0.28em] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6 lg:gap-8 items-start">
          <aside className="space-y-4 lg:sticky lg:top-32">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-400 mb-5">Profile Matrix</h3>
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Security Tier</p>
                  <p className="text-sm font-black uppercase italic text-white">{isApex ? 'Level 5 Apex' : (user.is_verified ? 'Level 2 Verified' : 'Level 1 Standard')}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Network</p>
                  <p className="text-sm font-black uppercase italic text-white">{userStats.following || 0} Following</p>
                </div>
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <p className="text-[8px] font-black uppercase tracking-widest text-cyan-300 mb-1">Signal Mix</p>
                  <p className="text-sm font-black uppercase italic text-white">Broadcasts + Saves + Reposts</p>
                </div>
              </div>
            </div>
          </aside>

          <main className="rounded-[2rem] md:rounded-[3rem] border border-white/10 bg-white/[0.025] p-4 md:p-6 backdrop-blur-xl min-h-[560px]">
            <div className="flex overflow-x-auto no-scrollbar rounded-2xl border border-white/10 bg-black/25 p-1 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`min-w-max flex-1 rounded-xl px-4 py-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.22em] transition-all ${activeTab === tab ? 'bg-cyan-400 text-[#00121b] shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  {tab} <span className="ml-1 opacity-70">{tabCounts[tab]}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex min-h-[320px] items-center justify-center">
                  <Loader2 className="w-9 h-9 animate-spin text-cyan-500" />
                </div>
              ) : filteredContent.length === 0 ? (
                <div className="min-h-[320px] rounded-[2rem] border border-dashed border-cyan-400/20 bg-cyan-400/[0.03] flex flex-col items-center justify-center text-center p-8">
                  <Layers3 size={34} className="text-cyan-400 mb-4" />
                  <p className="text-lg font-black uppercase italic tracking-tight text-white">No {activeTab.toLowerCase()} yet</p>
                  <p className="mt-2 max-w-sm text-sm text-slate-500">When this profile collects {activeTab.toLowerCase()}, the intelligence cards will appear here.</p>
                </div>
              ) : (
                filteredContent.map((post) => {
                  const authorName = `${post.users?.first_name || ''} ${post.users?.last_name || ''}`.trim() || post.users?.username || 'Unknown Operator';
                  const authorAvatar = post.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=06b6d4&color=fff`;
                  const postIsApex = post.users?.role === 'admin' || post.users?.email === 'nwokedichigozirim747@gmail.com';

                  return (
                    <article key={post.id} className="group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/10 bg-black/25 p-5 md:p-6 hover:border-cyan-400/30 hover:bg-white/[0.045] transition-all cursor-pointer" onClick={(e) => { if (e.defaultPrevented) return; router.push(`/post/${post.id}`); }}>
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {activeTab === 'Reposts' && (
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-[8px] font-black uppercase tracking-[0.24em] text-green-300">
                          <Repeat2 size={12} /> Reposted by you
                        </div>
                      )}
                      {activeTab === 'Bookmark' && (
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[8px] font-black uppercase tracking-[0.24em] text-cyan-300">
                          <Bookmark size={12} /> Saved intelligence
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <img
                          src={authorAvatar}
                          className="h-11 w-11 md:h-12 md:w-12 rounded-2xl border border-cyan-400/20 object-cover"
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=06b6d4&color=fff`; }}
                          alt={authorName}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm md:text-base font-black uppercase italic tracking-tight text-white truncate">{authorName}</h4>
                            {postIsApex && <ShieldCheck size={14} className="text-cyan-400" fill="currentColor" fillOpacity={0.1} />}
                            {!postIsApex && post.users?.is_verified && <CheckCircle2 size={14} className="text-cyan-500" fill="currentColor" fillOpacity={0.1} />}
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">{timeAgo(post.created_at)} // {post.category}</span>
                          </div>

                          <h3 className="mt-4 text-xl md:text-2xl font-black uppercase italic tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                            {post.title}
                          </h3>
                          <p className="mt-3 text-sm md:text-base text-slate-400 leading-relaxed font-light line-clamp-3">
                            {post.content}
                          </p>

                          <div className="mt-6 flex items-center justify-between gap-4 text-slate-500">
                            <div className="flex items-center gap-5 md:gap-7">
                              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/post/${post.id}`); }} className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                                <MessageCircle size={16} /> <span className="text-[10px] font-black italic">{post.comments_count || 0}</span>
                              </button>
                              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRepost(post.id); }} className={`flex items-center gap-2 transition-colors ${post.reposted ? 'text-green-400' : 'hover:text-green-400'}`}>
                                <Repeat2 size={16} /> <span className="text-[10px] font-black italic">{post.reposts_count || 0}</span>
                              </button>
                              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLike(post.id); }} className={`flex items-center gap-2 transition-colors ${post.liked ? 'text-pink-500' : 'hover:text-pink-500'}`}>
                                <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} /> <span className="text-[10px] font-black italic">{post.likes_count || 0}</span>
                              </button>
                            </div>
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBookmark(post.id); }} className={`rounded-xl border border-white/10 p-2 transition-all ${post.bookmarked ? 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30' : 'hover:text-cyan-300 hover:border-cyan-400/30'}`}>
                              <Bookmark size={16} fill={post.bookmarked ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}
