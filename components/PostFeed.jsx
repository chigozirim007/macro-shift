'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Trash2, Clock, Share2, Bookmark, MessageSquare, Heart, Edit3, Loader2, AlertCircle, ShieldCheck, Repeat2, CheckCircle2, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PostSkeleton } from './Skeleton';
import ErrorModal from '@/components/ErrorModal';

// Measures rendered line count and shows a 'Read More' link for posts > 5 lines
function PostContent({ content, postId }) {
  const measureRef = useRef(null);
  const [isLong, setIsLong] = useState(false);

  useEffect(() => {
    if (!measureRef.current) return;
    const el = measureRef.current;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
    const totalHeight = el.scrollHeight;
    const lines = Math.round(totalHeight / lineHeight);
    setIsLong(lines > 5);
  }, [content]);

  return (
    <div>
      {/* Hidden full-text div for measuring line count */}
      <p
        ref={measureRef}
        className="text-slate-400 text-xs md:text-sm font-light leading-relaxed"
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: '100%', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        aria-hidden="true"
      >
        {content}
      </p>

      {/* Visible content — clamped if long */}
      <p
        className="text-slate-400 text-xs md:text-sm font-light leading-relaxed mb-2"
        style={isLong ? { display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 5, overflow: 'hidden' } : {}}
      >
        {content}
      </p>

      {isLong && (
        <Link
          href={`/post/${postId}`}
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-cyan-300 transition-colors mt-1 mb-4"
        >
          Read More <ChevronDown size={11} className="rotate-[-90deg]" />
        </Link>
      )}
    </div>
  );
}

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function PostFeed({ activeCategory = null }) {
  const router = useRouter();
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
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=06b6d4&color=fff`;
  };

  const isAuthor = (post) => session?.user?.email && post.users?.email === session.user.email;

  return (
    <section className="py-24 pb-32 bg-[#000d14] relative overflow-hidden">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array(6).fill(0).map((_, i) => <PostSkeleton key={i} />)}
          </div>
        )}

        <ErrorModal 
          message={error} 
          onClose={() => setError(null)} 
        />

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <Link href={`/post/${post.id}`} key={post.id} className="block group">
                <div className="relative flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] overflow-hidden hover:bg-white/10 transition-all duration-500 hover:border-cyan-500/30 shadow-2xl">
                  {/* Animated Post Background Fitting */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-gradient-radial from-cyan-500/5 via-transparent to-transparent animate-intelligence-pulse" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
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
                    <div className="relative mb-4 md:mb-6">
                      <PostContent content={post.content} postId={post.id} />
                    </div>
                  </div>

                  <div className="mt-auto p-6 md:p-8 pt-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={authorAvatar(post)} alt={authorName(post)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 object-cover"
                          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName(post))}&background=06b6d4&color=fff`; }} />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                            <span className="font-black text-white hover:text-cyan-400 transition-colors cursor-pointer truncate">
                              {post.users?.first_name} {post.users?.last_name}
                            </span>
                            
                            {/* APEX IDENTITY (ADMIN) - DUAL MARK SYSTEM */}
                            {(post.users?.role === 'admin' || post.users?.email === 'nwokedichigozirim747@gmail.com') && (
                              <div className="flex items-center gap-1">
                                <div className="relative group">
                                  <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur opacity-100 transition-all" />
                                  <ShieldCheck size={14} className="text-cyan-400 relative" fill="currentColor" fillOpacity={0.1} />
                                </div>
                                <div className="relative group">
                                  <div className="absolute -inset-1 bg-amber-500/30 rounded-full blur-[4px] animate-pulse" />
                                  <CheckCircle2 size={13} className="text-amber-500 relative drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" fill="currentColor" fillOpacity={0.2} />
                                </div>
                              </div>
                            )}

                            {/* STANDARD VERIFICATION - VERIFIED STRATEGISTS */}
                            {post.users?.is_verified && post.users?.role !== 'admin' && post.users?.email !== 'nwokedichigozirim747@gmail.com' && (
                              <div className="p-0.5 bg-cyan-500/10 rounded-full">
                                <CheckCircle2 size={13} className="text-cyan-500" fill="currentColor" fillOpacity={0.1} />
                              </div>
                            )}
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
                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/post/${post.id}`); }}
                          className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors">
                          <MessageSquare size={14} />
                        </div>
                        <div onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation(); 
                            navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                            alert('Link copied to clipboard!');
                          }}
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

        {posts.length >= 10 && (
          <div className="mt-16 flex justify-center">
            <button className="px-10 py-4 bg-transparent border-2 border-white/10 rounded-2xl text-xs font-black text-white uppercase tracking-[0.3em] hover:border-cyan-500 transition-all">
              LOAD MORE
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
