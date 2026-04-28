'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, User, ArrowRight, Zap, Globe, Mail } from 'lucide-react';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function SignIn() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#000d14]">
      
      {/* Background Video */}
      <div className="absolute top-0 left-0 w-full h-[40vh] overflow-hidden opacity-20 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover mix-blend-screen scale-110"
        >
          <source src="/bgvideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000d14]" />
      </div>

      {/* Sign In Container */}
      <div className="relative z-20 w-full max-w-4xl px-6 flex flex-col lg:flex-row items-stretch gap-0 bg-[#001b2b]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
        
        {/* Left Side - Welcome Back */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between border-r border-white/5 bg-white/5">
          <div className="space-y-8">
            <Link href="/" className="flex items-center group">
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                Macro<span className="text-cyan-400">Shift</span>
              </span>
            </Link>
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-white leading-none tracking-tighter uppercase italic">
                Welcome <br />
                <span className="text-cyan-500">Back.</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Sign in to access your dashboard, saved posts, and the latest strategic intelligence updates.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Secure Access</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Encrypted Connection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
             <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">
              Sign <span className="text-cyan-500">In</span>
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Enter your credentials to continue</p>
          </div>

          <div className="space-y-4 mb-8">
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
              <FaGoogle className="text-red-500 text-lg" />
              Sign in with Google
            </button>
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
              <FaGithub className="text-white text-lg" />
              Sign in with GitHub
            </button>
          </div>

          <div className="relative flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-grow bg-white/5"></div>
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">OR SIGN IN WITH EMAIL</span>
            <div className="h-[1px] flex-grow bg-white/5"></div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-500 transition-colors" />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-500 transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="w-3 h-3 bg-white/5 border-white/10 rounded accent-cyan-500" />
                Remember Me
              </label>
              <Link href="#" className="hover:text-cyan-500 transition-colors">Forgot Password?</Link>
            </div>

            <button className="w-full py-5 bg-cyan-500 text-[#000d14] font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-cyan-400 hover:-translate-y-1 transition-all shadow-[0_15px_40px_rgba(6,182,212,0.3)] group mt-8">
              SIGN IN
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            <div className="mt-8 text-center">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                Don't have an account? <Link href="/signup" className="text-cyan-500 hover:text-cyan-400 ml-1 font-black">Sign Up</Link>
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
