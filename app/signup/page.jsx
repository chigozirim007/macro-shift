'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, Mail, User, ChevronRight, Check, Lock,
  Cpu, Globe, TrendingUp, ShieldCheck, Loader2, MailCheck,
  AlertCircle, RefreshCw
} from 'lucide-react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { signIn } from "next-auth/react";
import ErrorModal from '@/components/ErrorModal';

const STEPS = [
  { num: 1, label: 'Personal' },
  { num: 2, label: 'Profile' },
  { num: 3, label: 'Interests' },
  { num: 4, label: 'Security' },
  { num: 5, label: 'Verify' },
];

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [formData, setFormData] = useState({
    firstName: '', surname: '', username: '', email: '',
    phoneNumber: '', location: '', bio: '', password: '',
    confirmPassword: '', interests: []
  });

  // OTP state — 6 separate inputs
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const isStep1Valid = formData.firstName && formData.surname && formData.email.includes('@') && formData.phoneNumber;
  const isStep2Valid = formData.username && formData.location && formData.bio;
  const isStep3Valid = formData.interests.length > 0;
  const isStep4Valid = formData.password && formData.confirmPassword &&
    formData.password === formData.confirmPassword && formData.password.length >= 8;
  const isOtpComplete = otp.every(d => d !== '');

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

  const nextStep = () => { setError(''); setStep(prev => Math.min(prev + 1, 5)); };
  const prevStep = () => { setError(''); setStep(prev => Math.max(prev - 1, 1)); };

  // OTP input handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  // Step 4 → Submit registration
  const handleFinalize = async () => {
    if (!isStep4Valid) return;
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      // Success — move to OTP step
      setStep(5);
      setResendCooldown(60);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Step 5 → Verify OTP
  const handleVerify = async () => {
    if (!isOtpComplete) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: otp.join('') }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification failed.');
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
        return;
      }

      // Verified! Redirect to sign in
      router.push('/signin?verified=true');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to resend code.');
        return;
      }

      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
      setResendCooldown(60);
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000d14] text-white flex flex-col items-center justify-center p-4 font-sans overflow-hidden">

      {/* Progress Indicator */}
      <div className="w-full max-w-sm mb-8 flex items-center justify-between relative px-2">
        <div className="absolute top-4 left-0 w-full h-[1px] bg-white/10 z-0" />
        {STEPS.map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs transition-all duration-300 ${
              step > s.num ? 'bg-cyan-500 border-cyan-500 text-[#000d14]' :
              step === s.num ? 'bg-[#000d14] border-cyan-500 text-cyan-400' :
              'bg-[#000d14] border-white/10 text-slate-500'
            }`}>
              {step > s.num ? <Check size={14} /> : s.num}
            </div>
            <span className={`text-[7px] font-bold mt-2 uppercase tracking-wider ${
              step >= s.num ? 'text-cyan-400' : 'text-slate-500'
            }`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="w-full max-w-lg bg-[#0a111a] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl">

        {/* Global Error Modal */}
        <ErrorModal 
          message={error} 
          onClose={() => setError('')} 
        />

        {/* ── STEP 1: Personal ── */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">Create Account</h1>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Personal details to begin</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                <FaGoogle className="text-red-500 text-sm" /> Google
              </button>
              <button onClick={() => signIn("github", { callbackUrl: "/" })}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                <FaGithub className="text-white text-sm" /> GitHub
              </button>
            </div>

            <div className="relative flex items-center gap-4 py-2">
              <div className="h-[1px] flex-grow bg-white/5" />
              <span className="text-[7px] font-black text-slate-600 uppercase tracking-[0.4em]">OR</span>
              <div className="h-[1px] flex-grow bg-white/5" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Surname</label>
                <input type="text" name="surname" value={formData.surname} onChange={handleChange} placeholder="Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="flex gap-2">
                <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-[10px] text-white focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer">
                  <option>+1</option><option>+44</option><option>+234</option>
                </select>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="800 123 4567"
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700" />
              </div>
            </div>

            <button onClick={nextStep} disabled={!isStep1Valid}
              className={`w-full py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 group uppercase tracking-widest mt-2 ${
                isStep1Valid ? 'bg-cyan-500 text-[#000d14] hover:bg-cyan-400' : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'}`}>
              Continue <ChevronRight size={16} className={isStep1Valid ? "group-hover:translate-x-1 transition-transform" : ""} />
            </button>
          </div>
        )}

        {/* ── STEP 2: Profile ── */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">Strategic Profile</h1>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Define your terminal identity</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs">@</span>
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="janedoe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-9 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Lagos, Nigeria"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Strategic Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="I specialize in..." rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700 resize-none" />
              <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest text-right">{formData.bio.length}/160</p>
            </div>
            <div className="flex gap-3">
              <button onClick={prevStep} className="w-1/3 border border-white/10 hover:bg-white/5 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all text-slate-500">Back</button>
              <button onClick={nextStep} disabled={!isStep2Valid}
                className={`flex-grow py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 group uppercase tracking-widest ${
                  isStep2Valid ? 'bg-cyan-500 text-[#000d14] hover:bg-cyan-400' : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'}`}>
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Interests ── */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">Tailor Feed</h1>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Select your intelligence sectors</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => toggleInterest(cat.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    formData.interests.includes(cat.id) ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${formData.interests.includes(cat.id) ? 'bg-cyan-500 text-[#000d14]' : 'bg-white/5 text-slate-500'}`}>{cat.icon}</div>
                    <span className="font-bold text-xs">{cat.label}</span>
                  </div>
                  {formData.interests.includes(cat.id) && <Check size={14} className="text-cyan-400" />}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={prevStep} className="w-1/3 border border-white/10 hover:bg-white/5 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all text-slate-500">Back</button>
              <button onClick={nextStep} disabled={!isStep3Valid}
                className={`flex-grow py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
                  isStep3Valid ? 'bg-cyan-500 text-[#000d14] hover:bg-cyan-400' : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'}`}>
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Security ── */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">Security</h1>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Terminal access protection</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-1 hover:bg-white/5 rounded-md transition-all"
                  >
                    <Lock className={`w-3.5 h-3.5 transition-colors ${showPassword ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </button>
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Min. 8 characters"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password"
                    className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none transition-all placeholder:text-slate-700 ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-cyan-500/50'}`} />
                </div>
              </div>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest">Passwords do not match.</p>
            )}
            <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
              <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
                📧 A 6-digit verification code will be sent to <span className="text-white">{formData.email}</span> after you finalize.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={prevStep} className="w-1/3 border border-white/10 hover:bg-white/5 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all text-slate-500">Back</button>
              <button onClick={handleFinalize} disabled={!isStep4Valid || loading}
                className={`flex-grow py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
                  isStep4Valid && !loading ? 'bg-cyan-500 text-[#000d14] hover:bg-cyan-400' : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'}`}>
                {loading ? <><Loader2 size={14} className="animate-spin" /> Sending Code...</> : 'Finalize & Send Code'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Email Verification ── */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MailCheck size={28} className="text-cyan-400" />
              </div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">Verify Email</h1>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                We've sent a 6-digit code to<br />
                <span className="text-cyan-400 font-bold">{formData.email}</span>
              </p>
            </div>

            {/* 6-digit OTP Input */}
            <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => otpRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  className={`w-12 h-14 text-center text-xl font-black bg-white/5 border rounded-xl text-white focus:outline-none transition-all ${
                    digit ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 focus:border-cyan-500/50'}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button onClick={handleVerify} disabled={!isOtpComplete || loading}
              className={`w-full py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
                isOtpComplete && !loading ? 'bg-cyan-500 text-[#000d14] hover:bg-cyan-400' : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'}`}>
              {loading ? <><Loader2 size={14} className="animate-spin" /> Verifying...</> : <><ShieldCheck size={14} /> Verify & Activate</>}
            </button>

            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Didn't receive the code?</p>
              <button onClick={handleResend} disabled={resendCooldown > 0 || loading}
                className={`flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest transition-colors ${
                  resendCooldown > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-cyan-400 hover:text-cyan-300'}`}>
                <RefreshCw size={11} className={resendCooldown > 0 ? '' : 'group-hover:animate-spin'} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>

            <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest">
              Check your spam folder if you don't see it. Code expires in 15 minutes.
            </p>
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
