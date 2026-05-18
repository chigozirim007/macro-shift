'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight, Loader2, Key } from 'lucide-react';
import ErrorModal from '@/components/ErrorModal';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const otpRefs = useRef([]);

  const isOtpComplete = otp.every(d => d !== '');
  const isFormValid = email && isOtpComplete && password.length >= 8 && password === confirmPassword;

  // OTP input handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code: otp.join(''), 
          password 
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to reset password.');
        return;
      }
      
      setIsSuccess(true);
      
      // Redirect to sign in page after short delay
      setTimeout(() => {
        router.push('/signin');
      }, 3000);
      
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#000d14]">
      {/* Background Visuals */}
      <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-cyan-500/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Container */}
      <div className="relative z-20 w-full max-w-lg px-6 py-12">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-8">
            <Key size={32} className="text-cyan-400" />
          </div>

          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
            New <span className="text-cyan-500">Access Key.</span>
          </h2>
          <p className="text-sm text-slate-400 font-light leading-relaxed mb-10">
            Enter the 6-digit recovery code dispatched to your email and select a new secure password.
          </p>

          <ErrorModal 
            message={errorMessage} 
            onClose={() => setErrorMessage('')} 
          />

          {isSuccess ? (
            <div className="p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-center">
              <h3 className="text-cyan-400 font-black uppercase tracking-widest text-xs mb-2">Protocol Secured</h3>
              <p className="text-slate-300 text-xs leading-relaxed">Your password has been successfully reset. Redirecting to login...</p>
            </div>
          ) : (
            <form className="space-y-8" onSubmit={handleSubmit}>
              
              {!initialEmail && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Recovery Code</label>
                <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
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
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">New Password</label>
                  <div className="relative group">
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-1 hover:bg-white/5 rounded-md transition-all"
                    >
                      <Lock className={`w-4 h-4 transition-colors ${showPassword ? 'text-cyan-400' : 'text-slate-600 group-focus-within:text-cyan-500'}`} />
                    </button>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password" 
                      className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none transition-all placeholder:text-slate-700 ${
                        confirmPassword && password !== confirmPassword ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-cyan-500/50'
                      }`}
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest pl-1 mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all group mt-8 font-black text-[10px] uppercase tracking-widest ${
                  isFormValid && !isLoading
                    ? 'bg-cyan-500 text-[#000d14] hover:bg-cyan-400 hover:-translate-y-1 shadow-[0_15px_40px_rgba(6,182,212,0.3)]' 
                    : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                }`}
              >
                {isLoading ? <><Loader2 size={16} className="animate-spin" /> SECURING ACCESS...</> : 'CONFIRM NEW ACCESS KEY'}
                {!isLoading && <ArrowRight className={`w-4 h-4 transition-transform ${isFormValid ? 'group-hover:translate-x-1' : ''}`} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
