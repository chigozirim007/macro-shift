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

function timeAgo(dateString) {
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
  const [userStats, setUserStats] = useState({ followers: 0, following: 0 });
  
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

  // Synchronize Strategic Intelligence (Feed + Stats)
  useEffect(() => {
    async function synchronizeData() {
      if (!user?.id) return;
      
      setIsLoadingFeed(true);
      setFeedError(null);
      
      try {
        const [postsRes, statsRes] = await Promise.all([
          fetch('/api/posts'),
          fetch(`/api/users/${user.id}/stats`)
        ]);

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData.posts || []);
        } else {
          throw new Error('Failed to load intelligence feed.');
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setUserStats(statsData);
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
          is_verified: true 
        },
        likes_count: 0,
        bookmarks_count: 0,
        reposts_count: 0,
        comments_count: 0,
        views_count: 0,
      };
      
      setPosts([formattedPost, ...posts]);
      setIsPostModalOpen(false);
      setNewPost({ title: '', content: '', category: 'AI & Machine Learning', references: [] });
      setIsSuccessModalOpen(true); // Trigger success feedback
    } catch (error) {
      console.error('Broadcast error:', error);
      setBroadcastError(error.message);
      setIsErrorModalOpen(true);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this strategic intelligence? This action cannot be reversed.")) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete post");
      
      setPosts(posts.filter(p => p.id !== postId));
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
    // Optimistic update
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
      // Revert on failure
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        const isActive = !p[activeField]; // the reversed state
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

  const authorName = (post) => {
    if (!post.users) return 'Unknown Author';
    return `${post.users.first_name || ''} ${post.users.last_name || ''}`.trim() || post.users.username || 'Unknown';
  };

  const authorAvatar = (post) => {
    if (post.users?.avatar_url) return post.users.avatar_url;
    const name = authorName(post);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=06b6d4&color=fff`;
  };

  return (
    <div className="min-h-screen bg-[#000d14] text-white flex flex-col max-w-[1700px] mx-auto px-2 md:px-10 lg:px-16 pb-20 pt-24 md:pt-32 relative overflow-hidden">
      
      {/* Background Visual Layers (NEW) */}
      <div className="fixed inset-0 bg-grid-terminal pointer-events-none" />
      <div className="fixed inset-0 animate-scan h-20 w-full pointer-events-none z-10" />

      {/* Dashboard Grid */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">

        {/* Left/Center Column: Strategic Feed (8/12 width) */}
        <div className="lg:col-span-8 space-y-6 md:space-y-12">
          
          {/* Desktop Composer (Hidden on Tablet/Mobile) */}
          <div className="hidden lg:block bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 md:p-10 hover:bg-white/[0.05] transition-all shadow-xl group">
            <div className="flex gap-6">
              <img 
                src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=06b6d4&color=fff`} 
                className="w-14 h-14 rounded-2xl border-2 border-cyan-500/20 shrink-0 object-cover" 
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=06b6d4&color=fff`; }}
              />
              <div className="flex-grow space-y-6">
                <div 
                  onClick={() => setIsPostModalOpen(true)}
                  className="w-full bg-transparent text-xl text-slate-500 border-none cursor-pointer h-14 flex items-center"
                >
                  Broadcast strategic shift...
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <div className="flex gap-6 text-slate-500">
                    <button className="hover:text-cyan-400 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                      <Globe size={18} /> Map
                    </button>
                    <button className="hover:text-cyan-400 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                      <Zap size={18} /> Signal
                    </button>
                  </div>
                  <button 
                    onClick={() => setIsPostModalOpen(true)}
                    className="px-10 py-3 bg-cyan-500 text-[#000d14] font-black rounded-xl hover:bg-cyan-400 transition-all uppercase tracking-[0.2em] text-[10px] shadow-[0_10px_30px_rgba(6,182,212,0.3)]"
                  >
                    Broadcast
                  </button>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-grow space-y-6 md:space-y-12">
            {isLoadingFeed && Array(3).fill(0).map((_, i) => <PostSkeleton key={i} />)}
            
            {!isLoadingFeed && feedError && (
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-4">
                <AlertCircle size={24} className="text-red-400 shrink-0" />
                <p className="text-red-400 font-bold">{feedError}</p>
              </div>
            )}

            {!isLoadingFeed && !feedError && posts.length === 0 && (
              <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
                <p className="text-slate-500 uppercase tracking-widest font-black text-xs mb-4">No intelligence posts broadcasted yet.</p>
                <button onClick={() => setIsPostModalOpen(true)} className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500 hover:text-[#000d14] transition-all">
                  Be the first to broadcast
                </button>
              </div>
            )}

            {!isLoadingFeed && !feedError && posts.map((post) => {
              return (
                <Link href={`/post/${post.id}`} key={post.id} className="block group">
                  <div className="relative bg-white/[0.03] border border-white/5 rounded-[1.5rem] md:rounded-[3rem] p-4 md:p-12 hover:bg-white/[0.05] transition-all cursor-pointer shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden">
                    {/* Animated Post Background Fitting */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-gradient-radial from-cyan-500/5 via-transparent to-transparent animate-intelligence-pulse" />
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-700" />
                    </div>
                    
                    <div className="relative z-10">
                    {post.repostedBy && (
                      <div className="flex items-center gap-2 mb-4 ml-1 text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">
                        <Repeat2 size={14} className="text-cyan-400" />
                        {post.repostedBy} Reposted
                      </div>
                    )}
                    <div className="flex gap-3 md:gap-8">
                      <img 
                        src={authorAvatar(post)} 
                        className="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-3xl border-2 border-cyan-500/20 shrink-0 object-cover" 
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName(post))}&background=06b6d4&color=fff`; }}
                      />
                      <div className="flex-grow space-y-3 md:space-y-6 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                            <span className="text-base md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none truncate max-w-[150px] md:max-w-none">
                              {authorName(post)}
                            </span>
                            <div className="flex items-center gap-2">
                              {post.users?.is_verified && <Check size={12} className="text-[#000d14] p-0.5 bg-cyan-400 rounded-full" />}
                              <div 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                className="ml-1 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[8px] md:text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500 hover:text-[#000d14] transition-all cursor-pointer"
                              >
                                Follow
                              </div>
                            </div>
                            <span className="text-[10px] md:text-base font-bold text-slate-500 tracking-tight">@{post.users?.username} • {timeAgo(post.created_at)}</span>
                          </div>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDropdownId(activeDropdownId === post.id ? null : post.id);
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-all text-slate-600 hover:text-white"
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {/* Post Actions Dropdown */}
                      {activeDropdownId === post.id && user?.id === post.users?.id && (
                        <div 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="absolute right-0 mt-3 w-56 bg-[#001b2b] border border-cyan-500/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden animate-in fade-in zoom-in slide-in-from-top-2 duration-200"
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                          <button 
                            onClick={() => {
                              setEditingPost(post);
                              setIsEditModalOpen(true);
                              setActiveDropdownId(null);
                            }}
                            className="relative w-full px-5 py-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300 hover:bg-cyan-500 hover:text-[#000d14] transition-all group"
                          >
                            <Edit size={14} className="group-hover:scale-110 transition-transform" /> Edit Strategic Shift
                          </button>
                          <button 
                            onClick={() => handleDeletePost(post.id)}
                            className="relative w-full px-5 py-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all group"
                          >
                            <Trash2 size={14} className="group-hover:scale-110 transition-transform" /> Delete Intelligence
                          </button>
                        </div>
                      )}
                    </div>
                        </div>
                        <h4 className="text-lg md:text-xl font-bold text-white leading-tight uppercase italic">{post.title}</h4>
                        <p className="text-sm md:text-xl text-slate-200 leading-relaxed font-light">{post.content}</p>
                        {post.image_url && (
                          <div className="mt-8 rounded-[2.5rem] overflow-hidden border border-white/10 aspect-video relative group/image">
                            <img src={post.image_url} className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000d14]/40 to-transparent" />
                          </div>
                        )}

                        {/* Post Actions (Enhanced Size) */}
                        <div className="flex items-center justify-between mt-8 md:mt-12 max-w-2xl text-slate-400">
                          <div 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className="flex items-center gap-1.5 md:gap-3 hover:text-cyan-400 cursor-pointer transition-colors group/btn"
                          >
                            <div className="p-2 md:p-3 rounded-full group-hover/btn:bg-cyan-400/10 transition-colors">
                              <MessageCircle size={20} className="md:w-6 md:h-6" />
                            </div>
                            <span className="text-[10px] md:text-sm font-black italic">{post.comments_count || 0}</span>
                          </div>
                          <div 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRepost(post.id); }}
                            className={`flex items-center gap-1.5 md:gap-3 cursor-pointer transition-colors group/btn ${post.reposted ? 'text-green-400' : 'hover:text-green-400'}`}
                          >
                            <div className={`p-2 md:p-3 rounded-full transition-colors ${post.reposted ? 'bg-green-400/10' : 'group-hover/btn:bg-green-400/10'}`}>
                              <Repeat2 size={20} className="md:w-6 md:h-6" />
                            </div>
                            <span className="text-[10px] md:text-sm font-black italic">{post.reposts_count || 0}</span>
                          </div>
                          <div 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLike(post.id); }}
                            className={`flex items-center gap-1.5 md:gap-3 cursor-pointer transition-colors group/btn ${post.liked ? 'text-pink-500' : 'hover:text-pink-500'}`}
                          >
                            <div className={`p-2 md:p-3 rounded-full transition-colors ${post.liked ? 'bg-pink-500/10' : 'group-hover/btn:bg-pink-500/10'}`}>
                              <Heart size={20} className="md:w-6 md:h-6" fill={post.liked ? 'currentColor' : 'none'} />
                            </div>
                            <span className="text-[10px] md:text-sm font-black italic">{post.likes_count || 0}</span>
                          </div>
                          <div 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className="hidden sm:flex items-center gap-1.5 md:gap-3 hover:text-cyan-400 cursor-pointer transition-colors group/btn"
                          >
                            <div className="p-2 md:p-3 rounded-full group-hover/btn:bg-cyan-400/10 transition-colors">
                              <Zap size={20} className="md:w-6 md:h-6" />
                            </div>
                            <span className="text-[10px] md:text-sm font-black italic">{post.views_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-2 md:gap-4">
                            <div 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBookmark(post.id); }}
                              className={`p-2 md:p-3 rounded-full transition-colors cursor-pointer ${post.bookmarked ? 'text-cyan-400 bg-white/5' : 'hover:bg-white/10 hover:text-cyan-400'}`}
                            >
                              <Bookmark size={20} className="md:w-6 md:h-6" fill={post.bookmarked ? 'currentColor' : 'none'} />
                            </div>
                            <div className="p-2 md:p-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                              <Share size={20} className="md:w-6 md:h-6 hover:text-cyan-400" />
                            </div>
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

        {/* Right Column: User Intelligence Center (4/12 width) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-32 h-[calc(100vh-160px)] overflow-y-hidden hover:overflow-y-auto custom-scrollbar transition-all pb-10 space-y-10 pr-4">
          <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-cyan-500/20 transition-all duration-700" />

            <div className="relative z-10 space-y-10">
              {isLoadingFeed ? <ProfileSkeleton /> : (
                <>
                  <div className="flex items-center gap-8">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                      <img
                        src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=06b6d4&color=fff`}
                        className="relative w-28 h-28 rounded-[1.8rem] border-2 border-white/10 object-cover"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=06b6d4&color=fff`; }}
                      />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{user?.name}</h3>
                      <p className="text-cyan-500 text-sm font-bold tracking-widest mt-3 uppercase italic">Verified Strategist</p>
                    </div>
                  </div>

              <div className="space-y-6">
                <div className="p-7 bg-white/5 rounded-[2rem] border border-white/5 hover:border-cyan-500/30 transition-all">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">Location</p>
                  <p className="text-lg font-bold text-white flex items-center gap-3 italic truncate">
                    <Globe size={20} className="text-cyan-400 shrink-0" />
                    {user?.location || 'Not Specified'}
                  </p>
                </div>
                <div className="p-7 bg-white/5 rounded-[2rem] border border-white/5 hover:border-cyan-500/30 transition-all">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">Joined</p>
                  <p className="text-lg font-bold text-white flex items-center gap-3 italic">
                    <Clock size={20} className="text-cyan-400 shrink-0" />
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-8 border-t border-white/5">
                <div className="text-center">
                  <p className="text-3xl font-black text-white italic tracking-tighter">{userStats.following || 0}</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-white italic tracking-tighter">{userStats.followers || 0}</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Followers</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <Link href="/account/edit" className="w-full">
                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-[9px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                    Edit Profile
                  </button>
                </Link>
                <button 
                  onClick={() => setIsPostModalOpen(true)}
                  className="w-full py-4 bg-cyan-500 text-[#000d14] rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all shadow-[0_10px_25px_rgba(6,182,212,0.2)]"
                >
                  POST
                </button>
              </div>
            </>
          )}
        </div>
      </div>

          {/* Trending Section */}
          <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-12">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 italic">Trending Intelligence</h3>
            <div className="space-y-8">
              {[
                { label: 'AI Hardware', count: '12.4K Zaps' },
                { label: 'Sovereign Cloud', count: '8.2K Zaps' },
                { label: 'Neural Quantization', count: '5.1K Zaps' }
              ].map((item) => (
                <div key={item.label} className="group cursor-pointer">
                  <p className="text-lg font-black text-white uppercase italic group-hover:text-cyan-400 transition-colors">{item.label}</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsPostModalOpen(true)}
        className="fixed bottom-8 right-6 w-14 h-14 md:w-20 md:h-20 bg-cyan-500 text-[#000d14] rounded-2xl md:rounded-3xl flex items-center justify-center shadow-[0_20px_50px_rgba(6,182,212,0.4)] hover:scale-110 active:scale-95 transition-transform z-40 lg:hidden"
      >
        <Plus size={32} className="md:w-10 md:h-10" strokeWidth={3} />
      </button>

      {/* Broadcast Intelligence Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-2 sm:p-4 bg-cinematic-backdrop animate-in fade-in duration-500">
          <div className="bg-[#001b2b] border border-cyan-500/30 w-full max-w-4xl rounded-[2rem] sm:rounded-[4rem] p-6 sm:p-16 relative overflow-hidden shadow-2xl animate-holographic animate-holographic-glow">
            {/* Holographic Scanline Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 animate-scan" />
            
            <div className="flex justify-between items-center mb-8 sm:mb-16">
              <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-white">Broadcast Strategic Intelligence</h3>
              <button onClick={() => setIsPostModalOpen(false)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-cyan-500 hover:bg-white/10 transition-all"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Strategic Title</label>
                <input 
                  type="text" 
                  placeholder="The Rise of Sovereign AI Stacks..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Sector Category</label>
                <select 
                  className="w-full bg-[#001b2b] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold appearance-none cursor-pointer"
                  style={{ backgroundColor: '#001b2b', color: 'white' }}
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                >
                  <option style={{ backgroundColor: '#001b2b', color: 'white' }}>AI & Machine Learning</option>
                  <option style={{ backgroundColor: '#001b2b', color: 'white' }}>Cloud & Infrastructure</option>
                  <option style={{ backgroundColor: '#001b2b', color: 'white' }}>Software Development</option>
                  <option style={{ backgroundColor: '#001b2b', color: 'white' }}>Emerging Hardware</option>
                  <option style={{ backgroundColor: '#001b2b', color: 'white' }}>Trends</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Intelligence Content</label>
                <textarea 
                  rows="4"
                  placeholder="Provide your high-fidelity analysis..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Intelligence Sources</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="e.g., ArXiv:2403.12, Nvidia Blog..."
                    className="flex-grow bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all text-sm w-0"
                    value={refInput}
                    onChange={(e) => setRefInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addReference()}
                  />
                  <button 
                    onClick={addReference}
                    className="px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all uppercase text-[10px] tracking-widest shrink-0"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newPost.references.map((ref, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-[9px] font-bold text-cyan-400 flex items-center gap-2">
                      {ref}
                      <X size={10} className="cursor-pointer" onClick={() => setNewPost({...newPost, references: newPost.references.filter((_, i) => i !== idx)})} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end pt-8 border-t border-white/5 gap-4">
              <button 
                onClick={() => setIsPostModalOpen(false)}
                className="w-full sm:w-auto px-10 py-4 border border-white/10 text-slate-500 font-bold rounded-xl hover:bg-white/5 transition-all uppercase tracking-widest text-[10px]"
                disabled={isBroadcasting}
              >
                Cancel
              </button>
              <button 
                onClick={handleBroadcast}
                disabled={isBroadcasting || !newPost.title || !newPost.content}
                className="relative overflow-hidden w-full sm:w-auto px-12 py-5 bg-cyan-500 text-[#000d14] font-black rounded-2xl hover:bg-cyan-400 transition-all shadow-[0_20px_50px_rgba(6,182,212,0.4)] uppercase tracking-[0.2em] text-[10px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isBroadcasting && <Loader2 size={16} className="animate-spin" />}
                {isBroadcasting ? 'Engaging Broadcast...' : 'Initiate Broadcast'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Success Feedback Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-cinematic-backdrop animate-in fade-in duration-500">
          <div className="bg-[#001b2b] border border-cyan-500/30 w-full max-w-lg rounded-[3rem] p-16 text-center space-y-10 shadow-2xl animate-holographic animate-holographic-glow">
            <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto text-cyan-400 animate-pulse border border-cyan-500/30">
              <CheckCircle2 size={56} />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Broadcast Engaged</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Your strategic intelligence has been successfully synchronized with the global network. 
                The shift is now visible to all verified analysts.
              </p>
            </div>
            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-5 bg-cyan-500 text-[#000d14] font-black rounded-[1.5rem] hover:bg-cyan-400 transition-all uppercase tracking-[0.3em] text-xs shadow-xl"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Error Feedback Modal */}
      {isErrorModalOpen && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-cinematic-backdrop animate-in fade-in duration-500">
          <div className="bg-[#001b2b] border border-red-500/30 w-full max-w-md rounded-[3rem] p-12 text-center space-y-8 shadow-2xl animate-holographic animate-holographic-glow">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 animate-pulse border border-red-500/20">
              <AlertCircle size={48} />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Broadcast Failed</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                The strategic intelligence could not be synchronized. This typically occurs due to network interference or schema cache issues.
              </p>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest leading-relaxed">
                  System Report: {broadcastError}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsErrorModalOpen(false)}
              className="w-full py-5 bg-white/5 border border-white/10 text-white font-black rounded-[1.5rem] hover:bg-white/10 transition-all uppercase tracking-[0.3em] text-xs"
            >
              Close Link
            </button>
          </div>
        </div>
      )}

      {/* Edit Strategic Intelligence Modal */}
      {isEditModalOpen && editingPost && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-2 sm:p-4 bg-cinematic-backdrop animate-in fade-in duration-500">
          <div className="bg-[#001b2b] border border-cyan-500/30 w-full max-w-4xl rounded-[2rem] sm:rounded-[4rem] p-6 sm:p-16 relative overflow-hidden shadow-2xl animate-holographic animate-holographic-glow">
            {/* Holographic Scanline Decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500/50 animate-scan" />
            
            <div className="flex justify-between items-center mb-8 sm:mb-16">
              <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-white">Edit Strategic Intelligence</h3>
              <button onClick={() => { setIsEditModalOpen(false); setEditingPost(null); }} className="p-3 bg-white/5 border border-white/10 rounded-xl text-cyan-500 hover:bg-white/10 transition-all"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Strategic Title</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Sector Category</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold appearance-none"
                  value={editingPost.category}
                  onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                >
                  <option>AI & Machine Learning</option>
                  <option>Cloud & Infrastructure</option>
                  <option>Software Development</option>
                  <option>Emerging Hardware</option>
                  <option>Trends</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Intelligence Content</label>
                <textarea 
                  rows="4"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Intelligence Sources</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Add source..."
                    className="flex-grow bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all text-sm w-0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const refs = editingPost.post_post_references || [];
                        setEditingPost({...editingPost, post_post_references: [...refs, e.target.value.trim()]});
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editingPost.post_post_references || []).map((ref, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-[9px] font-bold text-cyan-400 flex items-center gap-2">
                      {ref}
                      <X size={10} className="cursor-pointer" onClick={() => setEditingPost({...editingPost, post_post_references: editingPost.post_post_references.filter((_, i) => i !== idx)})} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end pt-8 border-t border-white/5 gap-4">
              <button 
                onClick={() => { setIsEditModalOpen(false); setEditingPost(null); }}
                className="w-full sm:w-auto px-10 py-4 border border-white/10 text-slate-500 font-bold rounded-xl hover:bg-white/5 transition-all uppercase tracking-widest text-[10px]"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdatePost}
                disabled={isProcessing || !editingPost.title || !editingPost.content}
                className="relative overflow-hidden w-full sm:w-auto px-12 py-4 bg-cyan-500 text-[#000d14] font-black rounded-xl hover:bg-cyan-400 transition-all shadow-[0_15px_40px_rgba(6,182,212,0.3)] uppercase tracking-[0.2em] text-[10px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isProcessing && <Loader2 size={16} className="animate-spin" />}
                {isProcessing ? 'Updating Intelligence...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
