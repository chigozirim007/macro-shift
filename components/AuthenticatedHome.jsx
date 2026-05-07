"use client";

import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton, PostSkeleton, ProfileSkeleton } from './Skeleton';

export default function AuthenticatedHome({ session }) {
  const [activeTab, setActiveTab] = useState('for-you');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'AI & Machine Learning', references: [] });
  const [refInput, setRefInput] = useState('');
  const user = session?.user;

  const addReference = () => {
    if (refInput.trim()) {
      setNewPost({ ...newPost, references: [...newPost.references, refInput.trim()] });
      setRefInput('');
    }
  };

  // Mock posts data
  const posts = [
    {
      id: 1,
      user: {
        name: "NEFERTITI",
        username: "firstladyship",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=nefertiti",
        verified: true
      },
      content: "Strategic shifts are happening in the AI corridor. The move from cloud-centric to edge-native reasoning is no longer a prediction—it's the current reality for high-performance networks.",
      time: "1d",
      stats: { replies: "592", reposts: "1.9K", likes: "35.2K", views: "3.1M" },
      repostedBy: "BEYONDTHYSEASEE"
    },
    {
      id: 2,
      user: {
        name: "MacroShift",
        username: "macroshift_hq",
        image: "/logo.png",
        verified: true
      },
      content: "We've just released the Q4 Strategic Map for Sovereign AI. Access the terminal to see the tectonic movements in the EU data landscape.",
      time: "4h",
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop",
      stats: { replies: "124", reposts: "842", likes: "12.5K", views: "1.2M" }
    }
  ];

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
            {isLoading ? (
              Array(3).fill(0).map((_, i) => <PostSkeleton key={i} />)
            ) : (
              posts.map((post) => {
                return (
                  <Link href={`/post/${post.id}`} key={post.id} className="block group">
                    <div className="bg-white/[0.03] border border-white/5 rounded-[1.5rem] md:rounded-[3rem] p-4 md:p-12 hover:bg-white/[0.05] transition-all cursor-pointer shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
                      {post.repostedBy && (
                        <div className="flex items-center gap-2 mb-4 ml-1 text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">
                          <Repeat2 size={14} className="text-cyan-400" />
                          {post.repostedBy} Reposted
                        </div>
                      )}
                      <div className="flex gap-3 md:gap-8">
                        <img 
                          src={post.user.image} 
                          className="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-3xl border-2 border-cyan-500/20 shrink-0 object-cover" 
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&background=06b6d4&color=fff`; }}
                        />
                        <div className="flex-grow space-y-3 md:space-y-6 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                              <span className="text-base md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none truncate max-w-[150px] md:max-w-none">{post.user.name}</span>
                              <div className="flex items-center gap-2">
                                {post.user.verified && <Check size={12} className="text-[#000d14] p-0.5 bg-cyan-400 rounded-full" />}
                                <div 
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                  className="ml-1 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[8px] md:text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500 hover:text-[#000d14] transition-all cursor-pointer"
                                >
                                  Follow
                                </div>
                              </div>
                              <span className="text-[10px] md:text-base font-bold text-slate-500 tracking-tight">@{post.user.username} • {post.time}</span>
                            </div>
                            <MoreVertical size={20} className="text-slate-600 hover:text-white transition-colors" />
                          </div>
                          <p className="text-sm md:text-xl text-slate-200 leading-relaxed font-light">{post.content}</p>
                          {post.image && (
                            <div className="mt-8 rounded-[2.5rem] overflow-hidden border border-white/10 aspect-video relative group/image">
                              <img src={post.image} className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-1000" />
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
                        <span className="text-[10px] md:text-sm font-black italic">{post.stats.replies}</span>
                      </div>
                      <div 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="flex items-center gap-1.5 md:gap-3 hover:text-green-400 cursor-pointer transition-colors group/btn"
                      >
                        <div className="p-2 md:p-3 rounded-full group-hover/btn:bg-green-400/10 transition-colors">
                          <Repeat2 size={20} className="md:w-6 md:h-6" />
                        </div>
                        <span className="text-[10px] md:text-sm font-black italic">{post.stats.reposts}</span>
                      </div>
                      <div 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="flex items-center gap-1.5 md:gap-3 hover:text-pink-500 cursor-pointer transition-colors group/btn"
                      >
                        <div className="p-2 md:p-3 rounded-full group-hover/btn:bg-pink-500/10 transition-colors">
                          <Heart size={20} className="md:w-6 md:h-6" />
                        </div>
                        <span className="text-[10px] md:text-sm font-black italic">{post.stats.likes}</span>
                      </div>
                      <div 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="hidden sm:flex items-center gap-1.5 md:gap-3 hover:text-cyan-400 cursor-pointer transition-colors group/btn"
                      >
                        <div className="p-2 md:p-3 rounded-full group-hover/btn:bg-cyan-400/10 transition-colors">
                          <Zap size={20} className="md:w-6 md:h-6" />
                        </div>
                        <span className="text-[10px] md:text-sm font-black italic">{post.stats.views}</span>
                      </div>
                        <div className="flex items-center gap-2 md:gap-4">
                          <div className="p-2 md:p-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                            <Bookmark size={20} className="md:w-6 md:h-6 hover:text-cyan-400" />
                          </div>
                          <div className="p-2 md:p-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                            <Share size={20} className="md:w-6 md:h-6 hover:text-cyan-400" />
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
                );
              })
            )}
          </main>
        </div>

        {/* Right Column: User Intelligence Center (4/12 width) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-32 h-[calc(100vh-160px)] overflow-y-hidden hover:overflow-y-auto custom-scrollbar transition-all pb-10 space-y-10 pr-4">
          <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-cyan-500/20 transition-all duration-700" />

            <div className="relative z-10 space-y-10">
              {isLoading ? <ProfileSkeleton /> : (
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
                  <p className="text-lg font-bold text-white flex items-center gap-3 italic">
                    <Globe size={20} className="text-cyan-400" />
                    Lagos, Nigeria
                  </p>
                </div>
                <div className="p-7 bg-white/5 rounded-[2rem] border border-white/5 hover:border-cyan-500/30 transition-all">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">Joined</p>
                  <p className="text-lg font-bold text-white flex items-center gap-3 italic">
                    <Clock size={20} className="text-cyan-400" />
                    December 2021
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-8 border-t border-white/5">
                <div className="text-center">
                  <p className="text-3xl font-black text-white italic tracking-tighter">124</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-white italic tracking-tighter">174</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Followers</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <Link href="/account" className="w-full">
                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-[9px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                    Profile
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

      {/* Mock Create Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-2 sm:p-4 bg-[#000d14]/98 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-[#001b2b] border border-white/10 w-full max-w-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 space-y-8 shadow-2xl scale-in-center max-h-[95vh] overflow-y-auto custom-scrollbar overflow-x-hidden relative">
            <div className="sticky top-0 bg-[#001b2b] z-10 flex justify-between items-center border-b border-white/5 pb-6 mb-2">
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
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold appearance-none"
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
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
                  placeholder="Provide your high-fidelity analysis..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                />
              </div>

              {/* Media Section (NEW) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Intelligence Media</label>
                <div className="group relative w-full h-40 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all">
                  <Plus size={24} className="text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Attach Visual Evidence</span>
                </div>
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
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsLoading(true);
                  setIsPostModalOpen(false);
                  setTimeout(() => setIsLoading(false), 2000);
                }}
                className="w-full sm:w-auto px-12 py-4 bg-cyan-500 text-[#000d14] font-black rounded-xl hover:bg-cyan-400 transition-all shadow-[0_15px_40px_rgba(6,182,212,0.3)] uppercase tracking-[0.2em] text-[10px]"
              >
                Broadcast Intelligence
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
