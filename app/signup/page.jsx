'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  User, 
  Phone, 
  ChevronRight, 
  Check, 
  Lock,
  Cpu,
  Globe,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    interests: []
  });

  const categories = [
    { id: 'ai', label: 'AI & Machine Learning', icon: <Cpu size={14} /> },
    { id: 'cloud', label: 'Cloud & Infrastructure', icon: <Globe size={14} /> },
    { id: 'dev', label: 'Software Development', icon: <TrendingUp size={14} /> },
    { id: 'hardware', label: 'Emerging Hardware', icon: <ShieldCheck size={14} /> },
    { id: 'trends', label: 'Global Trends', icon: <Globe size={14} /> }
  ];

  const toggleInterest = (id) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id) 
        ? prev.interests.filter(i => i !== id) 
        : [...prev.interests, id]
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-[#000d14] text-white flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* Progress Multi-step Indicator */}
      <div className="w-full max-w-sm mb-8 flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
        
        {[
          { num: 1, label: 'Personal' },
          { num: 2, label: 'Interests' },
          { num: 3, label: 'Security' }
        ].map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs transition-all duration-300 ${
              step >= s.num ? 'bg-cyan-500 border-cyan-500 text-[#000d14]' : 'bg-[#000d14] border-white/10 text-slate-500'
            }`}>
              {step > s.num ? <Check size={16} /> : s.num}
            </div>
            <span className={`text-[8px] font-bold mt-2 uppercase tracking-wider ${
              step >= s.num ? 'text-cyan-400' : 'text-slate-500'
            }`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-lg bg-[#0a111a] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl">
        
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">Create Account</h1>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Personal details to begin</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <input 
                  type="text" 
                  placeholder="Jane" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Surname</label>
                <input 
                  type="text" 
                  placeholder="Doe" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs">@</span>
                <input 
                  type="text" 
                  placeholder="janedoe" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-9 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="flex gap-2">
                <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-[10px] text-white focus:outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer">
                  <option>+1</option>
                  <option>+44</option>
                  <option>+234</option>
                </select>
                <input 
                  type="tel" 
                  placeholder="800 123 4567" 
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Min. 8 char" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                <input 
                  type="password" 
                  placeholder="Repeat" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <button 
              onClick={nextStep}
              className="w-full bg-cyan-500 hover:bg-cyan-400 py-4 rounded-xl font-black text-[#000d14] text-xs transition-all flex items-center justify-center gap-2 group uppercase tracking-widest mt-2"
            >
              Continue
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">Tailor Feed</h1>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Select your interests</p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleInterest(cat.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    formData.interests.includes(cat.id) 
                      ? 'bg-cyan-500/10 border-cyan-500 text-white' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${formData.interests.includes(cat.id) ? 'bg-cyan-500 text-[#000d14]' : 'bg-white/5 text-slate-500'}`}>
                      {cat.icon}
                    </div>
                    <span className="font-bold text-xs">{cat.label}</span>
                  </div>
                  {formData.interests.includes(cat.id) && <Check size={14} className="text-cyan-400" />}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={prevStep}
                className="w-1/3 border border-white/10 hover:bg-white/5 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all text-slate-500"
              >
                Back
              </button>
              <button 
                onClick={nextStep}
                className="flex-grow bg-cyan-500 hover:bg-cyan-400 py-4 rounded-xl font-black text-[#000d14] text-xs transition-all flex items-center justify-center gap-2 group uppercase tracking-widest"
              >
                Continue
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 text-center">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">Final Security</h1>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Set up terminal protection</p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-left space-y-3">
               <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="text-slate-500" size={16} />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest">2FA Protection</h4>
                    <p className="text-[8px] text-slate-500 font-bold uppercase mt-0.5">Secure with mobile token</p>
                  </div>
                </div>
                <div className="w-8 h-4 bg-white/10 rounded-full relative cursor-pointer group">
                  <div className="absolute left-1 top-1 w-2 h-2 bg-slate-500 rounded-full group-hover:bg-cyan-400 transition-colors" />
                </div>
              </div>
            </div>

             <div className="flex gap-3 pt-4">
              <button 
                onClick={prevStep}
                className="w-1/3 border border-white/10 hover:bg-white/5 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all text-slate-500"
              >
                Back
              </button>
              <button 
                className="flex-grow bg-cyan-500 hover:bg-cyan-400 py-4 rounded-xl font-black text-[#000d14] text-xs transition-all uppercase tracking-widest"
              >
                Finalize
              </button>
            </div>
          </div>
        )}

      </div>

      <div className="mt-6 text-center">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Already have an account? <Link href="/signin" className="text-cyan-400 hover:text-cyan-300 font-black ml-1">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
