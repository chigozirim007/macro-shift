"use client";

import React, { useState } from 'react';
import { User, Mail, Globe, MapPin, Camera, Save, ArrowLeft, Shield, Zap, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    username: session?.user?.name?.toLowerCase().replace(/ /g, '_') || '',
    bio: 'Strategic Intelligence Analyst specializing in neural-lattice security and sovereign AI stacks.',
    location: 'Lagos, Nigeria',
    website: 'macroshift.com/protocol/01'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock save logic
    setTimeout(() => {
      setIsLoading(false);
      router.push('/account');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#000d14] pt-32 pb-20 relative overflow-hidden">
      {/* Background Visuals */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.back()}
              className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-slate-500 hover:text-white transition-all group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Edit <span className="text-cyan-400">Protocol.</span></h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Adjust your strategic intelligence profile</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-10">
          
          {/* Avatar Section */}
          <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 md:p-16 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative group/avatar">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-25 group-hover/avatar:opacity-50 transition-opacity"></div>
                <img 
                  src={session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=06b6d4&color=fff`} 
                  className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-[#000d14] object-cover" 
                />
                <button className="absolute bottom-4 right-4 p-4 bg-cyan-500 text-[#000d14] rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all">
                  <Camera size={24} strokeWidth={3} />
                </button>
              </div>
              <div className="text-center md:text-left space-y-4">
                <h3 className="text-xl font-black text-white uppercase italic">Display Asset</h3>
                <p className="text-slate-500 text-sm font-light max-w-sm leading-relaxed">
                  Update your high-fidelity visual identifier. Recommended size: 512x512px.
                </p>
                <div className="flex gap-4">
                  <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">Upload New</button>
                  <button className="px-6 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/20 transition-all">Remove</button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 md:p-16 space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Strategic Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Unique Identifier</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">@</span>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Strategic Intelligence Bio</label>
              <textarea 
                rows="4"
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all leading-relaxed font-light resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Primary Node Node (Location)</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Terminal Link (Website)</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-end gap-6 pt-10">
            <button 
              type="button"
              onClick={() => router.back()}
              className="w-full md:w-auto px-12 py-5 text-slate-500 font-black uppercase tracking-widest hover:text-white transition-all text-xs"
            >
              Discard Changes
            </button>
            <button 
              disabled={isLoading}
              className="w-full md:w-auto px-16 py-5 bg-cyan-500 text-[#000d14] font-black rounded-2xl hover:bg-cyan-400 hover:-translate-y-1 transition-all shadow-[0_15px_40px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 text-xs tracking-[0.2em]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#000d14]/30 border-t-[#000d14] rounded-full animate-spin" />
              ) : (
                <>
                  SYNCHRONIZE PROTOCOL
                  <Zap size={18} />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
