"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  MoreVertical,
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  Bookmark,
  Zap,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Check,
  Globe,
  Link as LinkIcon,
  Loader2,
  Clock
} from 'lucide-react';
import { PostSkeleton } from '@/components/Skeleton';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

function timeAgo(dateString) {
  if (!dateString) return 'Recently';
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  const [commentText, setCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const commentInputRef = useRef(null);

  const toggleLike = async () => {
    if (!session) return router.push('/signin');
    setPost(prev => ({ ...prev, liked: !prev.liked, likes_count: prev.liked ? prev.likes_count - 1 : prev.likes_count + 1 }));
    try { await fetch(`/api/posts/${post.id}/like`, { method: 'POST' }); } catch {
      setPost(prev => ({ ...prev, liked: !prev.liked, likes_count: prev.liked ? prev.likes_count - 1 : prev.likes_count + 1 }));
    }
  };

  const toggleBookmark = async () => {
    if (!session) return router.push('/signin');
    setPost(prev => ({ ...prev, bookmarked: !prev.bookmarked }));
    try { await fetch(`/api/posts/${post.id}/bookmark`, { method: 'POST' }); } catch {
      setPost(prev => ({ ...prev, bookmarked: !prev.bookmarked }));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handlePostComment = async () => {
    if (!session) return router.push('/signin');
    if (!commentText.trim()) return;
    setIsPostingComment(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText })
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        setPost(prev => ({
          ...prev,
          comments: [data.comment, ...(prev.comments || [])]
        }));
        setCommentText('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPostingComment(false);
    }
  };

  useEffect(() => {
    async function fetchPost() {
      if (!params.id) return;
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch signal');
        setPost(data.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, [params.id]);

  if (isLoading) return <div className="min-h-screen bg-[#000d14] pt-40 px-6 flex justify-center"><div className="w-full max-w-4xl"><PostSkeleton /></div></div>;

  if (error || !post) return (
    <div className="min-h-screen bg-[#000d14] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] max-w-md w-full">
        <p className="text-red-400 font-bold uppercase tracking-widest text-xs mb-4">{error || 'Signal lost in transmission'}</p>
        <button onClick={() => router.push('/')} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10">Return to Feed</button>
      </div>
    </div>
  );

  const authorName = `${post.users?.first_name || ''} ${post.users?.last_name || ''}`.trim();
  const isApex = post.users?.role === 'admin' || post.users?.email === 'nwokedichigozirim747@gmail.com';

  return (
    <div className="min-h-screen bg-[#000d14] pt-32 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-slate-500 hover:text-white transition-all mb-12 group"
        >
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10">
            <ArrowLeft size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Back to Feed</span>
        </button>

        <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
              <img
                src={post.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=06b6d4&color=fff`}
                className="w-16 h-16 rounded-2xl border-2 border-cyan-500/20 object-cover"
                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=06b6d4&color=fff`; }}
              />
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                    {authorName}

                    {/* APEX IDENTITY (ADMIN) - DUAL MARK SYSTEM */}
                    {isApex && (
                      <div className="flex items-center gap-1.5">
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur opacity-100 transition-all" />
                          <ShieldCheck size={20} className="text-cyan-400 relative" fill="currentColor" fillOpacity={0.1} />
                        </div>
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-amber-500/30 rounded-full blur-[4px] animate-pulse" />
                          <CheckCircle2 size={18} className="text-amber-500 relative drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" fill="currentColor" fillOpacity={0.2} />
                        </div>
                      </div>
                    )}

                    {/* STANDARD VERIFICATION - VERIFIED STRATEGISTS */}
                    {post.users?.is_verified && !isApex && (
                      <div className="p-0.5 bg-cyan-500/10 rounded-full">
                        <CheckCircle2 size={18} className="text-cyan-500" fill="currentColor" fillOpacity={0.1} />
                      </div>
                    )}
                  </h2>
                  <button className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500 hover:text-[#000d14] transition-all">
                    Follow
                  </button>
                </div>
                <p className="text-xs md:text-sm font-bold text-slate-500 tracking-tight mt-1 lowercase">@{post.users?.username} • {timeAgo(post.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <span className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em] inline-block">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase italic tracking-tighter">
              {post.title}
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 leading-relaxed font-light">
              {post.content}
            </p>
          </div>

          {post.post_post_references?.length > 0 && (
            <div className="mt-12 pt-12 border-t border-white/5 space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic flex items-center gap-3">
                <LinkIcon size={14} className="text-cyan-500" />
                Intelligence Sources
              </h3>
              <div className="flex flex-wrap gap-3">
                {post.post_post_references.map((ref, idx) => (
                  <span key={idx} className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer">
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 py-8 border-y border-white/5 flex items-center gap-10 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-black text-white italic">{post.reposts_count || 0}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reposts</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-black text-white italic">{post.likes_count || 0}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Likes</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-black text-white italic">{post.views_count || 0}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Views</span>
            </div>
          </div>

          <div className="mt-8 flex justify-between text-slate-500 max-w-xl mx-auto px-4">
            <button onClick={() => commentInputRef.current?.focus()} className="hover:text-cyan-400 transition-all transform hover:scale-110"><MessageCircle size={24} /></button>
            <button className="hover:text-green-400 transition-all transform hover:scale-110"><Repeat2 size={24} /></button>
            <button onClick={toggleLike} className={`transition-all transform hover:scale-110 ${post.liked ? 'text-pink-500' : 'hover:text-pink-500'}`}><Heart size={24} fill={post.liked ? 'currentColor' : 'none'} /></button>
            <button onClick={toggleBookmark} className={`transition-all transform hover:scale-110 ${post.bookmarked ? 'text-cyan-400' : 'hover:text-cyan-400'}`}><Bookmark size={24} fill={post.bookmarked ? 'currentColor' : 'none'} /></button>
            <button onClick={handleShare} className="hover:text-white transition-all transform hover:scale-110"><Share size={24} /></button>
          </div>
        </div>

        <div className="mt-16 space-y-8">
          <h3 className="text-xs font-black text-white uppercase tracking-widest italic ml-4">Analysis Thread</h3>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex gap-6 items-center">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Zap size={20} className="text-cyan-400" />
            </div>
            <input
              ref={commentInputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
              placeholder={session ? "Contribute to the strategic shift..." : "Sign in to contribute..."}
              disabled={!session || isPostingComment}
              className="flex-grow bg-transparent text-white focus:outline-none placeholder:text-slate-700 text-sm md:text-base disabled:opacity-50 w-full min-w-0"
            />
            <button
              onClick={handlePostComment}
              disabled={!session || isPostingComment || !commentText.trim()}
              className="px-6 py-2 bg-cyan-500 text-[#000d14] font-black rounded-lg text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isPostingComment ? 'Posting...' : 'Reply'}
            </button>
          </div>

          {post.comments?.map((reply) => {
            const replyAuthorName = `${reply.users?.first_name || ''} ${reply.users?.last_name || ''}`.trim();
            const replyIsApex = reply.users?.role === 'admin' || reply.users?.email === 'nwokedichigozirim747@gmail.com';

            return (
              <div key={reply.id} className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 md:p-10 hover:bg-white/[0.05] transition-all group">
                <div className="flex gap-6">
                  <img
                    src={reply.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(replyAuthorName)}&background=06b6d4&color=fff`}
                    className="w-12 h-12 rounded-xl border border-white/10 object-cover"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(replyAuthorName)}&background=06b6d4&color=fff`; }}
                  />
                  <div className="flex-grow space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase italic tracking-wider flex items-center gap-2">
                          {replyAuthorName}

                          {/* APEX IDENTITY (ADMIN) - DUAL MARK SYSTEM */}
                          {replyIsApex && (
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
                          {reply.users?.is_verified && !replyIsApex && (
                            <div className="p-0.5 bg-cyan-500/10 rounded-full">
                              <CheckCircle2 size={13} className="text-cyan-500" fill="currentColor" fillOpacity={0.1} />
                            </div>
                          )}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-500 tracking-tight lowercase">@{reply.users?.username} • {timeAgo(reply.created_at)}</p>
                      </div>
                      <MoreVertical size={16} className="text-slate-700" />
                    </div>
                    <p className="text-base text-slate-300 font-light leading-relaxed">{reply.content}</p>
                    <div className="pt-4 flex items-center gap-8 text-slate-500">
                      <button className="flex items-center gap-2 hover:text-pink-500 transition-all"><Heart size={16} /></button>
                      <button className="hover:text-cyan-400 transition-all"><MessageCircle size={16} /></button>
                      <button className="hover:text-white transition-all"><Share size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
