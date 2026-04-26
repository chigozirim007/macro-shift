"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { ArrowRight, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#001b2b] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center group">
              <div className="relative w-8 h-8 mr-3 transition-transform duration-500 group-hover:rotate-12">
                <Image src="/logo.png" alt="logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter text-white uppercase">
                  Macro<span className="text-cyan-400">Shift</span>
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The strategic intelligence layer for the digital evolution. Deciphering global tech trends to direct your next shift.
            </p>
            <div className="flex gap-4">
              {[FaXTwitter, FaInstagram, FaLinkedin, FaGithub].map((Icon, i) => (
                <Link key={i} href="#" className="p-2 bg-white/5 rounded-lg border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-6 text-cyan-500/80">Platform</h4>
            <ul className="space-y-4">
              {['AI & Machine Learning', 'Trends', 'Cloud & Infrastructure', 'Software Development', 'Emerging Hardware'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-slate-400 hover:text-white text-sm transition-colors flex items-center group">
                    <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-cyan-500" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-6 text-cyan-500/80">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center group">
                    <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-cyan-500" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] text-cyan-500/80">Weekly Signals</h4>
            <p className="text-slate-400 text-sm">Get the most critical tech shifts delivered to your inbox.</p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-500 text-[#001b2b] rounded-lg hover:scale-105 transition-transform">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[10px] tracking-widest uppercase font-bold">
            © {currentYear} MACROSHIFT. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <Link href="mailto:support@macroshift.com" className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-cyan-400 transition-colors tracking-widest">
              <Mail size={14} />
              SUPPORT@MACROSHIFT.COM
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;