"use client";

import React, { useState, useEffect } from 'react';
import { User, Globe, MapPin, Camera, Save, ArrowLeft, Zap, X, Link as LinkIcon, Loader2, Lock, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    bio: '',
    location: '',
    avatar_url: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load existing data from session
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        first_name: session.user.name?.split(' ')[0] || '',
        last_name: session.user.name?.split(' ').slice(1).join(' ') || '',
        username: session.user.username || '',
        bio: session.user.bio || '',
        location: session.user.location || '',
        avatar_url: session.user.image || ''
      }));
    }
  }, [session]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      const newUrl = data.url;
      setFormData(prev => ({ ...prev, avatar_url: newUrl }));

      // --- COMPREHENSIVE AUTO-SYNC ---
      // Bundles name, bio, location, and the new avatar into one sync
      const profileRes = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, avatar_url: newUrl })
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok) throw new Error(profileData.error || 'Asset uploaded, but profile sync failed.');

      const updatedUser = profileData.user;

      // Update NextAuth session with ALL new data
      await update({
        ...session,
        user: {
          ...session.user,
          name: `${updatedUser.first_name} ${updatedUser.last_name}`.trim(),
          image: updatedUser.avatar_url,
          bio: updatedUser.bio,
          location: updatedUser.location
        }
      });

      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 2000);
      // -------------------------

    } catch (error) {
      setErrorMessage(error.message);
      setIsErrorModalOpen(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      setErrorMessage("New passwords do not match.");
      setIsErrorModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      
      const updatedUser = data.user;

      // Update NextAuth session
      await update({
        ...session,
        user: {
          ...session.user,
          name: `${updatedUser.first_name} ${updatedUser.last_name}`.trim(),
          image: updatedUser.avatar_url,
          bio: updatedUser.bio,
          location: updatedUser.location
        }
      });
      
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
      setIsErrorModalOpen(true);
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
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Profile <span className="text-cyan-400">Protocol.</span></h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Reconfigure your strategic identity</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-10">
          
          {/* Avatar Section */}
          <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 md:p-16 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative group/avatar">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-25 group-hover/avatar:opacity-50 transition-opacity"></div>
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-[#000d14] overflow-hidden">
                  {isUploading ? (
                    <div className="absolute inset-0 bg-[#000d14]/80 flex flex-col items-center justify-center z-20">
                      <Loader2 className="text-cyan-500 animate-spin mb-2" />
                      <span className="text-[8px] font-black uppercase text-cyan-500 tracking-widest">Uploading...</span>
                    </div>
                  ) : null}
                  <img 
                    src={formData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.first_name + ' ' + formData.last_name)}&background=06b6d4&color=fff`} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.first_name || 'U')}&background=06b6d4&color=fff`; }}
                  />
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    <Camera className="text-white w-8 h-8" />
                  </label>
                </div>
              </div>
              <div className="text-center md:text-left flex-grow space-y-4">
                <h3 className="text-xl font-black text-white uppercase italic">Strategic Asset</h3>
                <p className="text-slate-500 text-sm font-light max-w-sm leading-relaxed">
                  Synchronize your intelligence marker with the platform. All assets must be hosted on the secure strategic network.
                </p>
                <div className="flex flex-col gap-4">
                  <button 
                    type="button"
                    onClick={() => document.querySelector('input[type="file"]').click()}
                    className="w-fit px-8 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-[11px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500/20 transition-all flex items-center gap-2"
                  >
                    <Camera size={14} />
                    Upload from Gallery
                  </button>
                  {formData.avatar_url && (
                    <button 
                      type="button"
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          const res = await fetch('/api/users/profile', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...formData, avatar_url: '' })
                          });
                          if (!res.ok) throw new Error('Failed to remove asset');
                          
                          setFormData({...formData, avatar_url: ''});
                          await update({
                            ...session,
                            user: { ...session.user, image: '' }
                          });
                          setIsSuccessModalOpen(true);
                          setTimeout(() => setIsSuccessModalOpen(false), 2000);
                        } catch (err) {
                          setErrorMessage(err.message);
                          setIsErrorModalOpen(true);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      className="w-fit px-8 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] font-black text-red-400 uppercase tracking-widest hover:bg-red-500/20 transition-all"
                    >
                      Remove Asset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 md:p-16 space-y-12">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4 border-b border-white/5 pb-4">Personal Identification</h3>
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
                rows="3"
                placeholder="Brief summary of your strategic focus..."
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all leading-relaxed font-light resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Primary Operation Node (Location)</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="e.g. San Francisco, CA"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 md:p-16 space-y-12">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4 border-b border-white/5 pb-4">Security Protocol Update</h3>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-1">Current Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="password" 
                    autoComplete="current-password"
                    placeholder="Verification required for security changes"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                    value={formData.current_password}
                    onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">New Access Key</label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                      type="password" 
                      autoComplete="new-password"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                      value={formData.new_password}
                      onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-1">Confirm Access Key</label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                      type="password" 
                      autoComplete="new-password"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                    />
                  </div>
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
              className={`relative overflow-hidden w-full md:w-auto px-16 py-5 bg-cyan-500 text-[#000d14] font-black rounded-2xl hover:bg-cyan-400 hover:-translate-y-1 transition-all shadow-[0_15px_40px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 text-xs tracking-[0.2em] group ${
                formData.avatar_url !== session?.user?.image || 
                formData.bio !== session?.user?.bio || 
                formData.location !== session?.user?.location || 
                formData.new_password 
                ? 'animate-intelligence-pulse ring-4 ring-cyan-400/20' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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

      {/* Premium Feedback Modals */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-cinematic-backdrop animate-in fade-in duration-500">
          <div className="bg-[#001b2b] border border-cyan-500/30 w-full max-w-lg rounded-[3rem] p-16 text-center space-y-10 shadow-2xl animate-holographic animate-holographic-glow">
            <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto text-cyan-400 animate-pulse border border-cyan-500/30">
              <CheckCircle2 size={56} />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Protocol Synchronized</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">Your strategic profile updates have been verified and integrated with the global network.</p>
            </div>
          </div>
        </div>
      )}

      {isErrorModalOpen && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-cinematic-backdrop animate-in fade-in duration-500">
          <div className="bg-[#001b2b] border border-red-500/30 w-full max-w-md rounded-[3rem] p-12 text-center space-y-8 shadow-2xl animate-holographic">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 animate-pulse border border-red-500/20">
              <AlertCircle size={48} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Sync Failure</h3>
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                 <p className="text-red-400 text-xs font-bold font-mono tracking-tight">{errorMessage}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsErrorModalOpen(false)}
              className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Acknowledge Error
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
