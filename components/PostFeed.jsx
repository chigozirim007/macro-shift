'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Trash2, 
  Clock, 
  User, 
  Link as LinkIcon, 
  Share2,
  Bookmark,
  MessageSquare,
  Heart,
  Edit3
} from 'lucide-react';

const mockUpdates = [
  {
    id: 1,
    title: "Quantum-Resistant Encryption Protocols",
    category: "AI & Machine Learning",
    content: "New neural-lattice structures are providing unprecedented security against Shor's algorithm, ensuring long-term data sovereignty.",
    author: "Dr. Aris Thorne",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aris",
    timestamp: "2h ago",
    references: ["Nature Quantum", "ArXiv:2403.12"],
    likes: 124,
    isAuthor: true,
  },
  {
    id: 2,
    title: "Decentralized GPU Clusters for LLM Training",
    category: "Cloud & Infrastructure",
    content: "The shift towards community-owned compute clusters is reducing training costs by 60% compared to centralized hyperscalers.",
    author: "Elena Vance",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    timestamp: "5h ago",
    references: ["ComputeDAO", "Nvidia Blog"],
    likes: 89,
    isAuthor: false,
  },
  {
    id: 3,
    title: "Rust-Based Kernel Optimizations for 6G",
    category: "Software Development",
    content: "Next-gen communication stacks are being rewritten in memory-safe languages to handle millisecond-latency requirements of 6G.",
    author: "Marcus Chen",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    timestamp: "12h ago",
    references: ["IETF Draft", "Rust Foundation"],
    likes: 256,
    isAuthor: false,
  },
  {
    id: 4,
    title: "Graphene-Based Neural Processing Units",
    category: "Emerging Hardware",
    content: "Experimental NPUs using graphene transistors are achieving 10x clock speeds with 1/5th the thermal output of silicon.",
    author: "Sarah Jenkins",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    timestamp: "1d ago",
    references: ["MIT Tech Review"],
    likes: 412,
    isAuthor: true,
  },
  {
    id: 5,
    title: "Global Data Residency Shifts in EU",
    category: "Trends",
    content: "New legislative mandates are forcing a 'Sovereign Stack' approach for all AI providers operating within the Eurozone.",
    author: "Liam O'Neill",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    timestamp: "1d ago",
    references: ["EU Gazette"],
    likes: 67,
    isAuthor: false,
  },
  {
    id: 6,
    title: "Edge-Native Agentic Frameworks",
    category: "AI & Machine Learning",
    content: "Autonomous agents are now running locally on mobile NPU hardware, reducing reliance on cloud-based reasoning.",
    author: "Yuki Tanaka",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
    timestamp: "2d ago",
    references: ["EdgeAI Journal"],
    likes: 198,
    isAuthor: false,
  }
];

export default function PostFeed({ activeCategory = null }) {
  const [posts, setPosts] = useState(
    activeCategory 
      ? mockUpdates.filter(post => post.category.toLowerCase() === activeCategory.toLowerCase()) 
      : mockUpdates
  );

  const toggleLike = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
    ));
  };

  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <section className="py-24 bg-[#000d14] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mb-4 block">
              {activeCategory ? `${activeCategory} Feed` : 'Global Community Stream'}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
              Community <span className="text-cyan-400">{activeCategory ? 'Insights' : 'Posts & News'}</span>
            </h2>
          </div>
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2">
            SUBMIT UPDATE
            <ArrowRight size={14} className="text-cyan-500" />
          </button>
        </div>

        {/* Grid Feed */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] overflow-hidden hover:bg-white/10 transition-all duration-500 hover:border-cyan-500/30 shadow-2xl"
              >
                <div className="p-4 md:p-8 pb-4">
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[7px] md:text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                      {post.category}
                    </span>
                    <div className="flex gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {post.isAuthor && (
                        <>
                          <button className="p-1 md:p-2 text-slate-500 hover:text-white transition-colors">
                            <Edit3 size={12} className="md:w-3.5 md:h-3.5" />
                          </button>
                          <button 
                            onClick={() => deletePost(post.id)}
                            className="p-1 md:p-2 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={12} className="md:w-3.5 md:h-3.5" />
                          </button>
                        </>
                      )}
                      <button className="p-1 md:p-2 text-slate-500 hover:text-white transition-colors">
                        <Bookmark size={12} className="md:w-3.5 md:h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm md:text-xl font-black text-white leading-tight mb-2 md:mb-4 group-hover:text-cyan-400 transition-colors uppercase italic">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-[10px] md:text-sm font-light leading-relaxed mb-4 md:mb-6 line-clamp-2 md:line-clamp-3">
                    {post.content}
                  </p>
                </div>

                <div className="mt-auto p-4 md:p-8 pt-0 space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <img src={post.authorImg} alt={post.author} className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/5 border border-white/10" />
                      <div className="hidden sm:block">
                        <h4 className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-wider">{post.author}</h4>
                        <div className="flex items-center gap-1 md:gap-2 text-[6px] md:text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                          <Clock size={8} className="md:w-2.5 md:h-2.5 text-cyan-500" />
                          {post.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1 md:gap-1.5 text-[8px] md:text-[10px] font-black transition-colors ${post.liked ? 'text-red-500' : 'text-slate-500 hover:text-white'}`}
                      >
                        <Heart size={12} className="md:w-4 md:h-4" fill={post.liked ? 'currentColor' : 'none'} />
                        {post.likes}
                      </button>
                      <button className="text-slate-500 hover:text-white transition-colors">
                        <MessageSquare size={12} className="md:w-4 md:h-4" />
                      </button>
                      <button className="text-slate-500 hover:text-white transition-colors">
                        <Share2 size={12} className="md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>

                  <button className="w-full py-2.5 md:py-4 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black text-white uppercase tracking-[0.2em] group-hover:bg-cyan-500 group-hover:text-[#000d14] transition-all flex items-center justify-center gap-2">
                    READ POST
                    <ArrowRight size={10} className="md:w-3.5 md:h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-slate-500 uppercase tracking-widest font-black text-xs">No posts available in this sector yet.</p>
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <button className="px-10 py-4 bg-transparent border-2 border-white/10 rounded-2xl text-xs font-black text-white uppercase tracking-[0.3em] hover:border-cyan-500 transition-all">
            LOAD ARCHIVED NEWS
          </button>
        </div>

      </div>
    </section>
  );
}
