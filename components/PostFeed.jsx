'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Trash2, Clock, Share2, Bookmark, MessageSquare, Heart, Edit3, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function PostFeed({ activeCategory = null }) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from API
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      try {
        const url = activeCategory
          ? `/api/posts?category=${encodeURIComponent(activeCategory)}`
          : '/api/posts';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load posts.');
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [activeCategory]);

  const toggleLike = async (postId) => {
    if (!session) return;
    // Optimistic update
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes_count: p.liked ? p.likes_count - 1 : p.likes_count + 1 }
        : p
    ));
    try {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    } catch {
      // Revert optimistic update on failure
      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes_count: p.liked ? p.likes_count - 1 : p.likes_count + 1 }
          : p
      ));
    }
  };

  const toggleBookmark = async (postId) => {
    if (!session) return;
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, bookmarked: !p.bookmarked } : p
    ));
    try {
      await fetch(`/api/posts/${postId}/bookmark`, { method: 'POST' });
    } catch {
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, bookmarked: !p.bookmarked } : p
      ));
    }
  };

  const deletePost = async (postId) => {
    if (!session) return;
    setPosts(prev => prev.filter(p => p.id !== postId));
    try {
      await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    } catch {
      // Silently fail — post will reappear on next refresh
    }
  };

  const authorName = (post) => {
    if (!post.users) return 'Unknown Author';
    return `${post.users.first_name || ''} ${post.users.last_name || ''}`.trim() || post.users.username || 'Unknown';
  };

  const authorAvatar = (post) => {
    if (post.users?.avatar_url) return post.users.avatar_url;
    const name = authorName(post);
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
  };

  const isAuthor = (post) => session?.user?.email && post.users?.email === session.user.email;

  return (
    <section className="py-24 bg-[#000d14] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <span className="text-[9px] md:text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mb-3 md:mb-4 block">
              {activeCategory ? `${activeCategory} Feed` : 'Global Community Stream'}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
              Community <span className="text-cyan-400">{activeCategory ? 'Insights' : 'Posts & News'}</span>
            </h2>
          </div>
          <Link href={session ? "/post/new" : "/signin"} className="w-full sm:w-auto">
            <button className="w-full px-6 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              SUBMIT UPDATE <ArrowRight size={14} className="text-cyan-500" />
            </button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={28} className="text-cyan-500 animate-spin" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading Intelligence Feed...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
              <AlertCircle size={18} className="text-red-400" />
              <p className="text-xs font-bold text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <Link href={`/post/${post.id}`} key={post.id} className="block group">
                <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] overflow-hidden hover:bg-white/10 transition-all duration-500 hover:border-cyan-500/30 shadow-2xl">
                  <div className="p-6 md:p-8 pb-4">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                      <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[8px] md:text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                        {post.category}
                      </span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isAuthor(post) && (
                          <>
                            <Link href={`/post/${post.id}/edit`} onClick={e => e.stopPropagation()}>
                              <button className="p-2 text-slate-500 hover:text-white transition-colors"><Edit3 size={14} /></button>
                            </Link>
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); deletePost(post.id); }}
                              className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                          </>
                        )}
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(post.id); }}
                          className={`p-2 transition-colors ${post.bookmarked ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}`}>
                          <Bookmark size={14} fill={post.bookmarked ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-white leading-tight mb-3 md:mb-4 group-hover:text-cyan-400 transition-colors uppercase italic">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed mb-4 md:mb-6 line-clamp-3">
                      {post.content}
                    </p>
                  </div>

                  <div className="mt-auto p-6 md:p-8 pt-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={authorAvatar(post)} alt={authorName(post)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 object-cover"
                          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName(post))}&background=06b6d4&color=fff`; }} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-wider">{authorName(post)}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                            <Clock size={10} className="text-cyan-500" />
                            {timeAgo(post.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(post.id); }}
                          className={`flex items-center gap-1.5 text-[10px] font-black cursor-pointer transition-colors ${post.liked ? 'text-red-500' : 'text-slate-500 hover:text-white'}`}>
                          <Heart size={14} fill={post.liked ? 'currentColor' : 'none'} />
                          {post.likes_count}
                        </div>
                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="text-slate-500 hover:text-white cursor-pointer transition-colors">
                          <MessageSquare size={14} />
                        </div>
                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="text-slate-500 hover:text-white cursor-pointer transition-colors">
                          <Share2 size={14} />
                        </div>
                      </div>
                    </div>
                    <div className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] group-hover:bg-cyan-500 group-hover:text-[#000d14] transition-all flex items-center justify-center gap-2">
                      READ POST <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-slate-500 uppercase tracking-widest font-black text-xs mb-4">No intelligence posts in this sector yet.</p>
            <Link href={session ? "/post/new" : "/signin"}>
              <button className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500 hover:text-[#000d14] transition-all">
                Be the first to post
              </button>
            </Link>
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <button className="px-10 py-4 bg-transparent border-2 border-white/10 rounded-2xl text-xs font-black text-white uppercase tracking-[0.3em] hover:border-cyan-500 transition-all">
            LOAD MORE
          </button>
        </div>
      </div>
    </section>
  );
}
