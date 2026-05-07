import React from 'react';
import { auth } from "@/auth";
import { redirect } from 'next/navigation';
import { User, Mail, Shield, Zap, Bookmark, Settings, ArrowRight, Clock, Search, Check, Globe, Bell, Home as HomeIcon } from 'lucide-react';
import Link from 'next/link';

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const user = session.user;

  // Mock data for "Saved Insights"
  const savedInsights = [
    {
      id: 1,
      title: "The Rise of Sovereign AI Stacks",
      category: "Trends",
      date: "Oct 24, 2024",
    },
    {
      id: 2,
      title: "Graphene Transistors: Post-Silicon Era",
      category: "Emerging Hardware",
      date: "Oct 22, 2024",
    }
  ];

  return (
    <div className="min-h-screen bg-[#000d14] pb-20 overflow-hidden relative">
      {/* Top Navigation Bar (Positioned below the main Navbar) */}
      <div className="fixed top-[64px] md:top-[104px] w-full z-40 bg-[#000d14]/95 backdrop-blur-3xl border-b border-cyan-500/10 py-3">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/" className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 rotate-180 text-cyan-400" />
            </Link>
            <div className="truncate max-w-[150px] md:max-w-none">
              <h2 className="text-xs md:text-sm font-black text-white uppercase italic tracking-wider truncate">{user.name}</h2>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest">124 Strategic Posts</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 text-slate-400">
             <Search size={16} className="md:w-5 md:h-5 hover:text-cyan-400 cursor-pointer transition-colors" />
             <Link href="/account/edit">
                <Zap size={16} className="md:w-5 md:h-5 hover:text-cyan-400 cursor-pointer transition-colors" />
             </Link>
             <Shield size={16} className="md:w-5 md:h-5 hover:text-cyan-400 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12 md:mb-16 animate-fade-in mt-32 md:mt-64 text-center md:text-left">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-[#001b2b] rounded-full p-1 border-4 border-[#000d14]">
              <img 
                src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                alt={user.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
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
                <span className="text-[10px] md:text-xs font-bold text-cyan-500 normal-case italic tracking-normal ml-1">Get Verified</span>
              </h1>
            </div>
            <p className="text-slate-500 font-bold tracking-widest text-[10px] md:text-xs uppercase">@{user.name.toLowerCase().replace(/ /g, '_')}</p>
            
            <div className="space-y-1 pt-2 md:pt-4">
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-[10px] md:text-xs font-light">
                <Shield size={12} className="text-slate-600 md:w-3.5 md:h-3.5" />
                Strategic Intelligence Agency • Lagos, Nigeria
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-[10px] md:text-xs font-light">
                <Clock size={12} className="text-slate-600 md:w-3.5 md:h-3.5" />
                Joined December 2021
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-6 pt-3 md:pt-4">
              <div className="flex items-center gap-1.5">
                <span className="text-xs md:text-sm font-black text-white italic">124</span>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Following</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs md:text-sm font-black text-white italic">174</span>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Followers</span>
              </div>
            </div>
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
                   <p className="text-sm font-bold text-white">2 mins ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content Feed (3/4 width) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Custom Tabs (Twitter Style) */}
            <div className="flex border-b border-white/10 mt-4 overflow-x-auto no-scrollbar scroll-smooth">
              {['Posts', 'Replies', 'Highlights', 'Articles', 'Media'].map((tab, idx) => (
                <button 
                  key={tab} 
                  className={`px-6 md:px-8 py-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${idx === 0 ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}`}
                >
                  {tab}
                  {idx === 0 && <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 rounded-t-full shadow-[0_-5px_15px_rgba(6,182,212,0.5)]" />}
                </button>
              ))}
            </div>

            {/* Posts Feed */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3 px-4 md:px-8 text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                <Zap size={12} className="rotate-12 text-cyan-400" />
                You Reposted
              </div>
              {/* Mock User Post 1 */}
              <div className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <img src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover" />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs md:text-sm font-black text-white uppercase italic tracking-wider flex items-center gap-2">
                        {user.name}
                        <Shield className="w-3 h-3 text-cyan-400 fill-cyan-400/20" />
                      </h4>
                    </div>
                    <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">2 hours ago • AI & Machine Learning</p>
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-lg md:text-xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase italic tracking-tight">
                    Optimizing Neural Latency for Edge Devices
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-light">
                    Just finished deploying the new quantization layer on the mobile NPU. Seeing a 30% reduction in inference time without accuracy drop. The shift to edge-native reasoning is accelerating.
                  </p>
                  <div className="pt-2 md:pt-4 flex items-center gap-6">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors">
                      <Zap size={14} className="md:w-4 md:h-4" />
                      <span className="text-[9px] md:text-[10px] font-bold italic">124</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors">
                      <Bookmark size={14} className="md:w-4 md:h-4" />
                      <span className="text-[9px] md:text-[10px] font-bold italic">42</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mock User Post 2 (Visual) */}
              <div className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 hover:bg-white/10 transition-all group">
                 <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <img src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover" />
                  <div className="flex-grow">
                    <h4 className="text-xs md:text-sm font-black text-white uppercase italic tracking-wider flex items-center gap-2">
                      {user.name}
                      <Shield className="w-3 h-3 text-cyan-400 fill-cyan-400/20" />
                    </h4>
                    <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">1 day ago • Global Trends</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-light">
                    The data sovereignty map of the EU is changing again. Here is the latest architecture for compliant Sovereign Stacks.
                  </p>
                  <div className="relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-white/10">
                    <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000d14] to-transparent opacity-60" />
                    <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6">
                      <span className="px-2 md:px-3 py-1 bg-cyan-500 text-[#000d14] rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest">VIEW ANALYSIS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
