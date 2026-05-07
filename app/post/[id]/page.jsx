"use client";

import React, { useState, useEffect } from 'react';
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
  Check, 
  Globe, 
  Link as LinkIcon 
} from 'lucide-react';
import { PostSkeleton } from '@/components/Skeleton';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Mock post data
  const post = {
    id: params.id,
    user: {
      name: "NEFERTITI",
      username: "firstladyship",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=nefertiti",
      verified: true
    },
    title: "The Rise of Sovereign AI Stacks",
    content: "Strategic shifts are happening in the AI corridor. The move from cloud-centric to edge-native reasoning is no longer a prediction—it's the current reality for high-performance networks. As we transition to local-first reasoning, the data sovereignty map of the EU is changing again. Compliance is no longer a checkbox; it is the core architecture.",
    time: "2h ago",
    category: "AI & Machine Learning",
    stats: { replies: "592", reposts: "1.9K", likes: "35.2K", views: "3.1M" },
    references: ["Nature Quantum", "ArXiv:2403.12", "EU Data Gazette"],
    replies: [
      {
        id: 101,
        user: { name: "System Admin", username: "macroshift_hq", image: "/logo.png" },
        content: "Excellent analysis. The shift to edge-native inference is exactly what we're seeing in the Q4 telemetry data.",
        time: "1h ago",
        likes: "42"
      }
    ]
  };

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) return <div className="min-h-screen bg-[#000d14] pt-40 px-6 flex justify-center"><div className="w-full max-w-4xl"><PostSkeleton /></div></div>;

  return (
    <div className="min-h-screen bg-[#000d14] pt-32 pb-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-3 text-slate-500 hover:text-white transition-all mb-12 group"
        >
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10">
            <ArrowLeft size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Back to Feed</span>
        </button>

        {/* Post Detail Card */}
        <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-8 md:p-16 shadow-2xl backdrop-blur-3xl">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
              <img src={post.user.image} className="w-16 h-16 rounded-2xl border-2 border-cyan-500/20" />
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                    {post.user.name}
                    {post.user.verified && <Check size={14} className="text-[#000d14] p-0.5 bg-cyan-400 rounded-full" />}
                  </h2>
                  <button className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500 hover:text-[#000d14] transition-all">
                    Follow
                  </button>
                </div>
                <p className="text-sm font-bold text-slate-500 tracking-tight mt-1">@{post.user.username} • {post.time}</p>
              </div>
            </div>
            <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-slate-500 transition-all">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Content */}
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

          {/* Sources */}
          <div className="mt-12 pt-12 border-t border-white/5 space-y-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic flex items-center gap-3">
              <LinkIcon size={14} className="text-cyan-500" />
              Intelligence Sources
            </h3>
            <div className="flex flex-wrap gap-3">
              {post.references.map((ref, idx) => (
                <span key={idx} className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer">
                  {ref}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 py-8 border-y border-white/5 flex items-center gap-10">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white italic">{post.stats.reposts}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reposts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white italic">{post.stats.likes}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Likes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white italic">{post.stats.views}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Views</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-between text-slate-500 max-w-xl mx-auto px-4">
            <button className="hover:text-cyan-400 transition-all transform hover:scale-110"><MessageCircle size={28} /></button>
            <button className="hover:text-green-400 transition-all transform hover:scale-110"><Repeat2 size={28} /></button>
            <button className="hover:text-pink-500 transition-all transform hover:scale-110"><Heart size={28} /></button>
            <button className="hover:text-cyan-400 transition-all transform hover:scale-110"><Bookmark size={28} /></button>
            <button className="hover:text-white transition-all transform hover:scale-110"><Share size={28} /></button>
          </div>

        </div>

        {/* Replies Section */}
        <div className="mt-16 space-y-8">
          <h3 className="text-xs font-black text-white uppercase tracking-widest italic ml-4">Analysis Thread</h3>
          
          {/* Quick Reply Box */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex gap-6 items-center">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center shrink-0">
               <Zap size={20} className="text-[#000d14]" />
            </div>
            <input 
              type="text" 
              placeholder="Contribute to the strategic shift..." 
              className="flex-grow bg-transparent text-white focus:outline-none placeholder:text-slate-700"
            />
            <button className="px-6 py-2 bg-cyan-500 text-[#000d14] font-black rounded-lg text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all">
              Reply
            </button>
          </div>

          {/* Threaded Replies */}
          {post.replies.map((reply) => (
            <div key={reply.id} className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 md:p-10 hover:bg-white/[0.05] transition-all group">
              <div className="flex gap-6">
                <img src={reply.user.image} className="w-12 h-12 rounded-xl border border-white/10" />
                <div className="flex-grow space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase italic tracking-wider flex items-center gap-2">{reply.user.name}</h4>
                      <p className="text-[10px] font-bold text-slate-500 tracking-tight">@{reply.user.username} • {reply.time}</p>
                    </div>
                    <MoreVertical size={16} className="text-slate-700" />
                  </div>
                  <p className="text-base text-slate-300 font-light leading-relaxed">{reply.content}</p>
                  <div className="pt-4 flex items-center gap-8 text-slate-500">
                    <button className="flex items-center gap-2 hover:text-pink-500 transition-all"><Heart size={16} /><span className="text-[10px] font-bold">{reply.likes}</span></button>
                    <button className="hover:text-cyan-400 transition-all"><MessageCircle size={16} /></button>
                    <button className="hover:text-white transition-all"><Share size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
