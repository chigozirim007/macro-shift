'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  Loader2, 
  MailCheck, 
  AlertCircle, 
  RefreshCw,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import ErrorModal from '@/components/ErrorModal';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      router.push('/signin');
    }
  }, [email, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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

  const handleVerify = async () => {
    if (otp.some(d => d === '')) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp.join('') }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification failed.');
        return;
      }

      setSuccess(true);
      // Wait a moment for the success animation then sign out to force re-login with new email
      setTimeout(() => {
        signOut({ callbackUrl: '/signin?verified=true' });
      }, 2000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to resend code.');
        return;
      }

      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000d14] text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#0a111a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Success Overlay */}
        {success && (
          <div className="absolute inset-0 bg-[#0a111a] z-50 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-cyan-500/20 border border-cyan-500/50 rounded-full flex items-center justify-center mb-6 scale-110">
              <ShieldCheck size={40} className="text-cyan-400" />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Node Verified</h2>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest leading-relaxed">
              Identity successfully synchronized.<br />Redirecting to primary terminal...
            </p>
          </div>
        )}

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MailCheck size={28} className="text-cyan-400" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Verify Identity</h1>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-3 leading-relaxed">
            A 6-digit access code was broadcast to<br />
            <span className="text-cyan-400 font-black">{email}</span>
          </p>
        </div>

        <ErrorModal 
          message={error} 
          onClose={() => setError('')} 
        />

        <div className="space-y-8">
          <div className="flex gap-2.5 justify-center">
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
                className={`w-12 h-16 text-center text-2xl font-black bg-white/5 border rounded-2xl text-white focus:outline-none transition-all ${
                  digit ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-white/10 focus:border-cyan-500/50'}`}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button 
            onClick={handleVerify} 
            disabled={otp.some(d => d === '') || loading}
            className={`w-full py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] ${
              !otp.some(d => d === '') && !loading ? 'bg-cyan-500 text-[#000d14] hover:bg-cyan-400 shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'}`}
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying Node...</> : <><ShieldCheck size={16} /> Activate Node</>}
          </button>

          <div className="text-center space-y-4">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Signal lost? Resend broadcast</p>
            <button 
              onClick={handleResend} 
              disabled={resendCooldown > 0 || loading}
              className={`flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                resendCooldown > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-cyan-400 hover:text-cyan-300'}`}
            >
              <RefreshCw size={12} className={resendCooldown > 0 ? '' : 'animate-spin-slow'} />
              {resendCooldown > 0 ? `Retry in ${resendCooldown}s` : 'Resend Broadcast'}
            </button>
          </div>
        </div>

        <Link href="/signin" className="mt-10 flex items-center justify-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">
          <ChevronLeft size={12} /> Abort Operation
        </Link>
      </div>
    </div>
  );
}
