"use client";

import React, { useState, useEffect } from 'react';
import {
  Home as HomeIcon,
  Search,
  Bell,
  Mail,
  MoreVertical,
  Plus,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Check,
  Shield,
  ShieldCheck,
  Zap,
  Bookmark,
  Globe,
  Clock,
  X,
  Loader2,
  AlertCircle,
  Edit,
  Trash2,
  CheckCircle2,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton, PostSkeleton, ProfileSkeleton } from './Skeleton';
import ErrorModal from '@/components/ErrorModal';

function timeAgo(dateString) {
  if (!dateString) return 'Recently';
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AuthenticatedHome({ session }) {
  const [activeTab, setActiveTab] = useState('for-you');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // Data states
  const [posts, setPosts] = useState([]);
  const [userStats, setUserStats] = useState({ posts: 0, followers: 0, level: 'Apex-1' });
  const [trending, setTrending] = useState([]);
  
  // Loading states
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [feedError, setFeedError] = useState(null);

  // New post state
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'AI & Machine Learning', references: [] });
  const [refInput, setRefInput] = useState('');
  
  // Edit/Delete/Success states
  const [editingPost, setEditingPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [broadcastError, setBroadcastError] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const user = session?.user;
  const isAdmin = user?.role === 'admin' || user?.email === 'nwokedichigozirim747@gmail.com';

  // Synchronize Strategic Intelligence
  useEffect(() => {
    async function synchronizeData() {
      if (!user?.id) return;
      
      setIsLoadingFeed(true);
      setFeedError(null);
      
      try {
        const interestsParam = user.interests?.length > 0 ? `?interests=${user.interests.join(',')}` : '';
        const [postsRes, statsRes, trendRes] = await Promise.all([
          fetch(`/api/posts${interestsParam}`),
          fetch('/api/users/stats'),
          fetch('/api/trending')
        ]);

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData.posts || []);
        }
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setUserStats(statsData.stats);
        }

        if (trendRes.ok) {
          const trendData = await trendRes.json();
          setTrending(trendData.trending || []);
        }
      } catch (err) {
        setFeedError(err.message);
      } finally {
        setIsLoadingFeed(false);
      }
    }
    
    if (user?.id) {
      synchronizeData();
    }
  }, [user?.id]);

  const addReference = () => {
    if (refInput.trim()) {
      setNewPost({ ...newPost, references: [...newPost.references, refInput.trim()] });
      setRefInput('');
    }
  };

  const handleBroadcast = async () => {
    if (!newPost.title || !newPost.content || !newPost.category) return;
    
    setIsBroadcasting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to broadcast post');
      }
      
      const { post } = await res.json();
      
      // Add the new post to the feed immediately with default stats
      const formattedPost = {
        ...post,
        users: {
          id: user.id,
          first_name: user.name?.split(' ')[0] || 'Unknown',
          last_name: user.name?.split(' ').slice(1).join(' ') || '',
          username: user.username,
          avatar_url: user.image,
          is_verified: user.is_verified,
          role: user.role,
          email: user.email
        },
        likes_count: 0,
        bookmarks_count: 0,
        reposts_count: 0,
        comments_count: 0,
        views_count: 0,
      };
      
      setPosts([formattedPost, ...posts]);
      setUserStats(prev => ({ ...prev, posts: prev.posts + 1 }));
      setIsPostModalOpen(false);
      setNewPost({ title: '', content: '', category: 'AI & Machine Learning', references: [] });
      setIsSuccessModalOpen(true);
    } catch (error) {
      setBroadcastError(error.message);
      setIsErrorModalOpen(true);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this strategic intelligence?")) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete post");
      setPosts(posts.filter(p => p.id !== postId));
      setUserStats(prev => ({ ...prev, posts: Math.max(0, prev.posts - 1) }));
      setActiveDropdownId(null);
    } catch (error) {
      setBroadcastError(error.message);
      setIsErrorModalOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost.title || !editingPost.content) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingPost.title,
          content: editingPost.content,
          category: editingPost.category,
          references: editingPost.post_post_references || []
        })
      });
      if (!res.ok) throw new Error("Failed to update post");
      const { post: updatedPost } = await res.json();
      setPosts(posts.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p));
      setIsEditModalOpen(false);
      setEditingPost(null);
    } catch (error) {
      setBroadcastError(error.message);
      setIsErrorModalOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Interactions
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
        return { ...p, [activeField]: isActive, [countField]: isActive ? p[countField] + 1 : Math.max(0, p[countField] - 1) };
      }));
    }
  };

  const handleLike = (postId) => toggleAction(postId, 'like', 'likes_count', 'liked', 'like');
  const handleBookmark = (postId) => toggleAction(postId, 'bookmark', 'bookmarks_count', 'bookmarked', 'bookmark');
  const handleRepost = (postId) => toggleAction(postId, 'repost', 'reposts_count', 'reposted', 'repost');

  const authorName = (post) => {
    if (!post.users) return 'Unknown Author';
    return `${post.users.first_name || ''} ${post.users.last_name || ''}`.trim() || post.users.username || 'Unknown';
  };

  const authorAvatar = (post) => {
    if (post.users?.avatar_url) return post.users.avatar_url;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName(post))}&background=06b6d4&color=fff`;
  };

  const displayClearance = isAdmin ? 'Level 5 (Apex)' : (user?.is_verified ? 'Level 2 (Verified)' : 'Level 1 (Standard)');

  return (
    <div className="min-h-screen bg-[#000d14] text-white flex flex-col max-w-[1700px] mx-auto px-4 md:px-10 lg:px-16 pb-20 pt-24 md:pt-32 relative overflow-hidden">
      <div className="fixed inset-0 bg-grid-terminal pointer-events-none" />
      <div className="fixed inset-0 animate-scan h-20 w-full pointer-events-none z-10" />

      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
        
        {/* Main Feed Column - Optimized for all screens */}
        <div className="lg:col-span-8 space-y-4 md:space-y-12">
          
          <div className="flex flex-row items-center justify-between gap-4 mb-4 md:mb-8">
            <div className="space-y-1">
              <span className="text-[8px] md:text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] block">Operational Feed</span>
              <h2 className="text-xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Global <span className="text-cyan-400">Signals</span></h2>
            </div>
            <button 
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-4 bg-cyan-500 text-[#000d14] font-black rounded-xl md:rounded-2xl hover:bg-cyan-400 transition-all uppercase tracking-[0.2em] text-[8px] md:text-[10px] shadow-lg shadow-cyan-500/20"
            >
              <Plus size={14} strokeWidth={3} className="md:w-[18px]" /> BROADCAST
            </button>
          </div>

          <main className="flex-grow space-y-4 md:space-y-12 pb-32">
            {isLoadingFeed && Array(3).fill(0).map((_, i) => <PostSkeleton key={i} />)}
            
            <ErrorModal 
              message={feedError} 
              onClose={() => setFeedError(null)} 
            />

            {!isLoadingFeed && !feedError && posts.length === 0 && (
              <div className="py-16 md:py-20 text-center border border-dashed border-white/10 rounded-2xl md:rounded-[3rem]">
                <p className="text-slate-500 uppercase tracking-widest font-black text-[10px] md:text-xs">No signals detected.</p>
              </div>
            )}

            {!isLoadingFeed && !feedError && posts.map((post) => {
              const isPostApex = post.users?.role === 'admin' || post.users?.email === 'nwokedichigozirim747@gmail.com';
              return (
                <Link href={`/post/${post.id}`} key={post.id} className="block group">
                  <div className="relative bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-[3rem] p-4 md:p-12 hover:bg-white/[0.05] transition-all cursor-pointer shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-gradient-radial from-cyan-500/5 via-transparent to-transparent animate-intelligence-pulse" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex gap-4 md:gap-8">
                        <img 
                          src={authorAvatar(post)} 
                          className="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-3xl border border-cyan-500/20 shrink-0 object-cover" 
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName(post))}&background=06b6d4&color=fff`; }}
                        />
                        <div className="flex-grow space-y-2 md:space-y-6 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 md:gap-3 flex-wrap">
                              <span className="text-xs md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none truncate max-w-[120px] md:max-w-none">
                                {authorName(post)}
                              </span>
                              {isPostApex && (
                                <div className="flex items-center gap-1">
                                  <ShieldCheck size={14} className="text-cyan-400 md:w-[18px]" fill="currentColor" fillOpacity={0.1} />
                                  <CheckCircle2 size={12} className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] md:w-[16px]" fill="currentColor" fillOpacity={0.2} />
                                </div>
                              )}
                              {!isPostApex && post.users?.is_verified && (
                                <CheckCircle2 size={12} className="text-cyan-500 md:w-[16px]" fill="currentColor" fillOpacity={0.1} />
                              )}
                              <span className="text-[8px] md:text-base font-bold text-slate-500 tracking-tight">@{post.users?.username}</span>
                            </div>
                            {user?.id === post.users?.id && (
                              <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveDropdownId(activeDropdownId === post.id ? null : post.id); }}
                                className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-all text-slate-600 hover:text-white"
                              >
                                <MoreHorizontal size={16} className="md:w-[20px]" />
                              </button>
                            )}
                          </div>
                          <h4 className="text-sm md:text-xl font-black text-white leading-tight uppercase italic truncate">{post.title}</h4>
                          <p className="text-[11px] md:text-xl text-slate-300 leading-relaxed font-light line-clamp-2 md:line-clamp-3">{post.content}</p>
                          
                          <div className="flex items-center justify-between mt-4 md:mt-12 text-slate-500">
                            <div className="flex items-center gap-4 md:gap-8">
                              <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="flex items-center gap-1.5 md:gap-2 hover:text-cyan-400 cursor-pointer transition-colors group/btn">
                                <MessageCircle size={14} className="md:w-[20px]" /><span className="text-[8px] md:text-sm font-black italic">{post.comments_count || 0}</span>
                              </div>
                              <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRepost(post.id); }} className={`flex items-center gap-1.5 md:gap-2 cursor-pointer transition-colors ${post.reposted ? 'text-green-400' : 'hover:text-green-400'}`}>
                                <Repeat2 size={14} className="md:w-[20px]" /><span className="text-[8px] md:text-sm font-black italic">{post.reposts_count || 0}</span>
                              </div>
                              <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLike(post.id); }} className={`flex items-center gap-1.5 md:gap-2 cursor-pointer transition-colors ${post.liked ? 'text-pink-500' : 'hover:text-pink-500'}`}>
                                <Heart size={14} className="md:w-[20px]" fill={post.liked ? 'currentColor' : 'none'} /><span className="text-[8px] md:text-sm font-black italic">{post.likes_count || 0}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 md:gap-4">
                              <Bookmark onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBookmark(post.id); }} size={14} className={`md:w-[20px] ${post.bookmarked ? 'text-cyan-400' : 'hover:text-cyan-400'}`} fill={post.bookmarked ? 'currentColor' : 'none'} />
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
          </main>
        </div>

        {/* Sidebar Column */}
        <div className="hidden lg:block lg:col-span-4 sticky top-32 h-[calc(100vh-160px)] space-y-8">
          {/* Profile Card */}
          <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <div className="flex flex-col items-center text-center space-y-6">
              <img 
                src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=06b6d4&color=fff`} 
                className="w-24 h-24 rounded-3xl border-2 border-cyan-500/20 object-cover" 
              />
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center justify-center gap-2">
                  {user?.name?.split(' ')[0]}
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <ShieldCheck size={18} className="text-cyan-400" />
                      <CheckCircle2 size={16} className="text-amber-500" />
                    </div>
                  )}
                  {user?.is_verified && !isAdmin && <CheckCircle2 size={16} className="text-cyan-500" />}
                </h2>
                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] italic">{isAdmin ? 'Lead Administrator' : 'Verified Strategist'}</p>
              </div>

              <div className="w-full pt-8 grid grid-cols-2 gap-4 border-t border-white/5">
                <div className="text-center">
                  <p className="text-xl font-black text-white italic">{userStats.posts}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Signals</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-white italic">{userStats.followers}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Reach</p>
                </div>
              </div>

              <div className="w-full space-y-4 pt-6">
                <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Level</span>
                  <span className="text-white italic">{userStats.level}</span>
                </div>
                <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Clearance</span>
                  <span className="text-white italic">{displayClearance}</span>
                </div>
              </div>

              <Link href="/account/edit" className="w-full">
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                  Reconfigure Identity
                </button>
              </Link>
            </div>
          </div>

          {/* Trending Card */}
          <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3 italic">
              <Zap size={16} className="text-cyan-400" />
              Trending Intel
            </h3>
            <div className="space-y-6">
              {trending.map((item) => (
                <div key={item.label} className="group cursor-pointer">
                  <p className="text-[10px] font-black text-white uppercase tracking-wider group-hover:text-cyan-400 transition-colors">{item.label}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button 
        onClick={() => setIsPostModalOpen(true)}
        className="fixed bottom-8 right-6 w-16 h-16 bg-cyan-500 text-[#000d14] rounded-2xl flex items-center justify-center shadow-2xl lg:hidden z-50"
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-[#000d14]/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#001b2b] border border-cyan-500/30 w-full max-w-2xl rounded-[3rem] p-10 relative shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Broadcast Signal</h3>
              <button onClick={() => setIsPostModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all"><X className="text-slate-500" /></button>
            </div>
            <div className="space-y-6">
              <input 
                type="text" 
                placeholder="Strategic Title..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold appearance-none"
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
              >
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                <option value="Software Development">Software Development</option>
                <option value="Emerging Hardware">Emerging Hardware</option>
                <option value="Trends">Trends</option>
              </select>
              <textarea 
                rows="4"
                placeholder="High-fidelity analysis..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
              <button 
                onClick={handleBroadcast}
                disabled={isBroadcasting}
                className="w-full py-5 bg-cyan-500 text-[#000d14] font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {isBroadcasting ? <Loader2 className="animate-spin mx-auto" /> : 'Synchronize Broadcast'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-[#000d14]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#001b2b] border border-cyan-500/30 w-full max-w-sm rounded-[3rem] p-12 text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto text-cyan-400 animate-pulse">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Signal Sync Success</h3>
            <button onClick={() => setIsSuccessModalOpen(false)} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">Acknowledge</button>
          </div>
        </div>
      )}

      {isErrorModalOpen && (
        <ErrorModal 
          message={broadcastError} 
          onClose={() => setIsErrorModalOpen(false)} 
        />
      )}
    </div>
  );
}
