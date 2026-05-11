"use client";

import React, { useState, useEffect } from 'react';
import { User, Globe, MapPin, Camera, Save, ArrowLeft, Zap, X, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    bio: '',
    location: '',
    avatar_url: ''
  });

  // Load existing data from session
  useEffect(() => {
    if (session?.user) {
      setFormData({
        first_name: session.user.name?.split(' ')[0] || '',
        last_name: session.user.name?.split(' ').slice(1).join(' ') || '',
        username: session.user.username || '',
        bio: session.user.bio || '',
        location: session.user.location || '',
        avatar_url: session.user.image || ''
      });
    }
  }, [session]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed to update profile');
      
      // Update NextAuth session so it reflects globally immediately
      await update({
        ...session,
        user: {
          ...session.user,
          name: `${formData.first_name} ${formData.last_name}`.trim(),
          image: formData.avatar_url,
          bio: formData.bio,
          location: formData.location
        }
      });
      
      router.push('/account'); // Navigate back to profile
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
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
                  src={formData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.first_name + ' ' + formData.last_name)}&background=06b6d4&color=fff`} 
                  className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-[#000d14] object-cover" 
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.first_name || 'U')}&background=06b6d4&color=fff`; }}
                />
              </div>
              <div className="text-center md:text-left flex-grow space-y-4">
                <h3 className="text-xl font-black text-white uppercase italic">Display Asset</h3>
                <p className="text-slate-500 text-sm font-light max-w-sm leading-relaxed">
                  Provide a direct image URL for your avatar (e.g. Imgur, GitHub). Database direct uploads require active bucket permissions.
                </p>
                <div className="relative group w-full max-w-md mt-4">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="url" 
                    placeholder="https://example.com/avatar.png"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 md:p-16 space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">First Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Last Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
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
                <Loader2 size={18} className="animate-spin" />
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
