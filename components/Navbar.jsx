"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X, UserRound, Zap } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Dynamic background adjustment on scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out ${scrolled
            ? "bg-[#001b2b]/80 backdrop-blur-2xl py-3 border-b border-cyan-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
            : "bg-[#00334e] py-6 border-b border-transparent"
            }`}>
            <div className="mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex justify-between items-center h-16">

                    {/* Logo Section with Pulsing Glow */}
                    <Link href="/" className="flex items-center group relative">
                        <div className="absolute -inset-2 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative w-10 h-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                            <Image
                                src="/logo.png"
                                alt="logo"
                                fill
                                className="object-contain"
                            />
                        </div>

                        <div className="flex flex-col leading-none ml-3">
                            <span className="text-xl font-black tracking-tighter text-white">
                                MACRO<span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">SHIFT</span>
                            </span>
                            <span className="text-[7px] uppercase tracking-[0.3em] text-cyan-500/80 font-bold">
                                Strategic Intelligence
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Animated Staggered Underlines */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {['AI & Machine Learning', 'Trends', 'Cloud & Infrastructure', 'Software Development', 'Emerging Hardware', 'Contact Us'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                                className="relative text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all duration-300 group"
                            >
                                {item}
                                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Actions Area */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search the shift..."
                                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500/50 w-32 lg:w-48 transition-all"
                            />
                        </div>

                        {/* Sign In with Micro-Bounce */}
                        <Link href="/signin" className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white hover:-translate-y-0.5 transition-all">
                            SIGN IN
                            <UserRound className="w-4 h-4 text-cyan-400" />
                        </Link>

                        {/* The "Shimmer" Button */}
                        <Link href="/get-started">
                            <button className="relative group px-6 py-2.5 bg-cyan-500 text-[#001b2b] font-black text-xs rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                <span className="relative z-10">GET STARTED</span>
                                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer with Blur */}
            {isOpen && (
                <div className="lg:hidden bg-[#001b2b]/95 backdrop-blur-3xl fixed inset-0 z-40 flex flex-col justify-center items-center space-y-8 animate-in fade-in zoom-in duration-300">
                    <button onClick={() => setIsOpen(false)} className="absolute top-10 right-10 text-white"><X className="w-10 h-10" /></button>
                    {['AI & Machine Learning', 'Trends', 'Cloud & Infrastructure', 'Software Development', 'Emerging Hardware', 'Contact Us'].map((item) => (
                        <Link key={item} href="#" className="text-3xl font-black text-white hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>
                            {item}
                        </Link>
                    ))}
                    <div className="flex items-center justify-center space-y-[1.2px] space-x-10 mt-10">
                        <button className="bg-cyan-500 text-[#001b2b] rounded-full font-black text-xl w-auto p-4">
                            <Link href="/get-started">GET STARTED</Link>
                        </button>
                        <button className="flex items-center font-bold text-slate-300 bg-cyan-500 rounded-full p-4 w-auto">
                            <Link href="/signin" className="text-[#001b2b] flex items-center gap-2 text-xl">
                                SIGN IN
                                <UserRound className="w-4 h-4 text-white text-xl" />
                            </Link>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;