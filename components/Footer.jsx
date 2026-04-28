"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { ArrowRight, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#000d14] pt-24 pb-12 overflow-hidden border-t-2 border-cyan-500/10">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand Section */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center group">
              <div className="relative w-10 h-10 mr-4 transition-transform duration-700 group-hover:rotate-[360deg]">
                <Image src="/logo.png" alt="logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                  Macro<span className="text-cyan-400">Shift</span>
                </span>
                <span className="text-[8px] uppercase tracking-[0.4em] text-cyan-500/60 font-bold mt-1">Strategic Vantage Point</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-light">
              The strategic intelligence layer for the digital evolution. Deciphering tectonic shifts to reveal the underlying data structures of the next economic cycle.
            </p>
            <div className="flex gap-5">
              {[FaXTwitter, FaInstagram, FaLinkedin, FaGithub].map((Icon, i) => (
                <Link key={i} href="#" className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300">
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-cyan-500" />
              Platform
            </h4>
            <ul className="space-y-5">
              {['AI & Machine Learning', 'Trends', 'Cloud & Infrastructure', 'Software Development', 'Emerging Hardware'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-slate-400 hover:text-white text-sm transition-all flex items-center group">
                    <span className="w-0 h-[1px] bg-cyan-500 mr-0 opacity-0 group-hover:w-4 group-hover:mr-3 group-hover:opacity-100 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div className="lg:pl-10">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-cyan-500" />
              Intelligence
            </h4>
            <ul className="space-y-5">
              {['Market Analysis', 'Technical Audits', 'Vantage Points', 'About Macro-Shift'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-400 hover:text-white text-sm transition-all flex items-center group">
                    <span className="w-0 h-[1px] bg-cyan-500 mr-0 opacity-0 group-hover:w-4 group-hover:mr-3 group-hover:opacity-100 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-8">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-4 h-[1px] bg-cyan-500" />
              Weekly Signals
            </h4>
            <p className="text-slate-400 text-sm font-light">Get high-fidelity tech signals delivered directly to your terminal.</p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="terminal@intelligence.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
              />
              <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 text-[#001b2b] rounded-xl hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <ArrowRight size={20} strokeWidth={3} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-slate-500 text-[10px] tracking-[0.3em] uppercase font-black">
              © {currentYear} MACRO-SHIFT SYSTEM.
            </p>
            <div className="flex gap-6 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
              <Link href="#" className="hover:text-cyan-500 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-cyan-500 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-cyan-500 transition-colors">Cookies</Link>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Link href="mailto:support@macroshift.com" className="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-cyan-400 transition-all tracking-[0.2em] group">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
                <Mail size={14} className="text-cyan-500" />
              </div>
              SUPPORT@MACROSHIFT.COM
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;