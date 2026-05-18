'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Zap, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import ErrorModal from '@/components/ErrorModal';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isFormValid = email.trim() !== '' && email.includes('@');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to request password reset.');
        return;
      }
      
      setIsSuccess(true);
      
      // Redirect to reset password page with email as query param after short delay
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
      
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
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-3 text-slate-500 hover:text-white transition-all mb-10 group"
        >
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Sign In</span>
        </button>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-8">
            <ShieldCheck size={32} className="text-cyan-400" />
          </div>

          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
            Reset <span className="text-cyan-500">Access.</span>
          </h2>
          <p className="text-sm text-slate-400 font-light leading-relaxed mb-10">
            Enter the email address associated with your terminal. We will dispatch a 6-digit recovery code.
          </p>

          <ErrorModal 
            message={errorMessage} 
            onClose={() => setErrorMessage('')} 
          />

          {isSuccess ? (
            <div className="p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-center">
              <h3 className="text-cyan-400 font-black uppercase tracking-widest text-xs mb-2">Code Dispatched</h3>
              <p className="text-slate-300 text-xs leading-relaxed">Check your email for the recovery code. Redirecting...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-500 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                  />
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
                {isLoading ? <><Loader2 size={16} className="animate-spin" /> DISPATCHING CODE...</> : 'SEND RECOVERY CODE'}
                {!isLoading && <Zap className={`w-4 h-4 transition-transform ${isFormValid ? 'group-hover:scale-110' : ''}`} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
