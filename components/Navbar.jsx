"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, UserRound, Zap, LogOut, User, CreditCard, Bookmark, LifeBuoy, ShieldCheck } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
const Navbar = () => {
    const pathname = usePathname();
    const isAdminPage = pathname === '/admin';
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'admin' || session?.user?.email === 'nwokedichigozirim747@gmail.com';

    // Dynamic background adjustment and scroll lock
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (isAdminPage) return null;

    return (
        <nav className={`fixed top-0 w-full z-[2000] transition-all duration-700 ease-in-out ${scrolled
            ? "bg-[#000d14]/95 backdrop-blur-3xl py-3 border-b border-cyan-500/30 shadow-[0_10px_50px_rgba(0,0,0,0.5)]"
            : "bg-gradient-to-b from-[#000d14]/90 via-[#000d14]/40 to-transparent py-5 border-b border-white/5"
            }`}>
            <div className="mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex justify-between items-center h-16">

                    {/* Logo Section with Pulsing Glow */}
                    <Link href="/" className="flex items-center group relative scale-90 md:scale-100 origin-left">
                        <div className="absolute -inset-2 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                            <Image
                                src="/logo.png"
                                alt="logo"
                                fill
                                className="object-contain"
                            />
                        </div>

                        <div className="flex flex-col leading-none ml-2 md:ml-3">
                            <span className="text-lg md:text-xl font-black tracking-tighter text-white">
                                MACRO<span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">SHIFT</span>
                            </span>
                            <span className="text-[6px] md:text-[7px] uppercase tracking-[0.3em] text-cyan-500/80 font-bold">
                                Strategic Intelligence
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Authority Stream */}
                    <div className="hidden xl:flex items-center gap-3 xl:gap-4">
                        {session && isAdmin && (
                            <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 text-[#000d14] border border-cyan-400 rounded-xl hover:bg-cyan-400 transition-all group/admin shadow-[0_0_20px_rgba(6,182,212,0.4)] whitespace-nowrap">
                                <ShieldCheck size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Oversight Console</span>
                            </Link>
                        )}
                        {!session && (
                            <div className="flex items-center gap-3 xl:gap-4.5">
                                {['AI & Machine Learning', 'Trends', 'Cloud & Infrastructure', 'Software Development', 'Emerging Hardware', 'Contact Us'].map((item) => (
                                    <Link
                                        key={item}
                                        href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                                        className="relative text-[10px] xl:text-[11px] font-black uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-all duration-300 group whitespace-nowrap"
                                    >
                                        {item}
                                        <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-hover:w-full" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions Area */}
                    <div className="hidden xl:flex items-center gap-3 xl:gap-5">
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                window.location.href = `/search?q=${e.target.search.value}`;
                            }}
                            className="relative group"
                        >
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                name="search"
                                type="text"
                                placeholder="Search the shift..."
                                className="pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] xl:text-xs text-white focus:outline-none focus:border-cyan-500/50 w-24 xl:w-36 transition-all"
                            />
                        </form>

                        {/* Auth Logic */}
                        {session ? (
                            <div className="flex items-center gap-3">
                                <Link href="/account" className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group/user">
                                    <img 
                                        src={session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || 'User')}&background=06b6d4&color=fff`} 
                                        alt={session?.user?.name || 'User'}
                                        className="w-5 h-5 rounded-full border border-cyan-500/50 group-hover/user:border-cyan-400 transition-colors object-cover"
                                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || 'User')}&background=06b6d4&color=fff`; }}
                                    />
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest group-hover/user:text-cyan-400 transition-colors">{session?.user?.name?.split(' ')[0] || 'User'}</span>
                                </Link>
                                <button 
                                    onClick={async () => { await signOut({ redirect: false }); window.location.href = "/"; }}
                                    className="flex items-center gap-0 hover:gap-2 px-2 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-300 group/logout"
                                    title="Sign Out"
                                >
                                    <LogOut size={14} />
                                    <span className="max-w-0 overflow-hidden group-hover/logout:max-w-[100px] transition-all duration-500 ease-in-out text-[9px] font-black uppercase tracking-widest">
                                        Logout
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Sign In with Micro-Bounce */}
                                <Link href="/signin" className="flex items-center gap-1.5 text-[10px] xl:text-xs font-black uppercase tracking-wider text-slate-300 hover:text-cyan-400 hover:-translate-y-0.5 transition-all whitespace-nowrap">
                                    SIGN IN
                                    <UserRound className="w-3.5 h-3.5 text-cyan-400" />
                                </Link>

                                {/* The "Shimmer" Button */}
                                <Link 
                                    href="/get-started"
                                    className="relative group px-4 py-2 xl:px-5 xl:py-2.5 bg-cyan-500 text-[#001b2b] font-black text-[10px] xl:text-xs rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)] block whitespace-nowrap"
                                >
                                    <span className="relative z-10">GET STARTED</span>
                                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex xl:hidden items-center gap-4">
                         {session && (
                             <Link href="/account" className="p-2 bg-white/5 border border-white/10 rounded-full">
                                <img 
                                    src={session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || 'User')}&background=06b6d4&color=fff`} 
                                    alt={session?.user?.name || 'User'}
                                    className="w-6 h-6 rounded-full border border-cyan-500/50 object-cover"
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || 'User')}&background=06b6d4&color=fff`; }}
                                />
                             </Link>
                         )}
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer with Advanced Blur */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-[4000] bg-[#000d14]/98 backdrop-blur-3xl flex flex-col p-8 overflow-y-auto animate-in fade-in slide-in-from-top duration-500 w-full h-full">
                    
                    {/* Header in Drawer */}
                    <div className="flex justify-between items-center mb-12 pt-4">
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-black tracking-tighter text-white italic">
                                MACRO<span className="text-cyan-400">SHIFT</span>
                            </span>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all hover:rotate-90"
                        >
                            <X className="w-6 h-6 text-cyan-400" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col space-y-6 mb-10">
                        {session ? (
                            <>
                                <div className="flex flex-col space-y-4">
                                    {[
                                        { label: 'Profile', icon: <User size={24} />, href: '/account' },
                                        { label: 'Admin Console', icon: <ShieldCheck size={24} />, href: '/admin', adminOnly: true },
                                        { label: 'Premium', icon: <CreditCard size={24} />, href: '#', disabled: true },
                                        { label: 'Bookmarks', icon: <Bookmark size={24} />, href: '#' },
                                        { label: 'Support', icon: <LifeBuoy size={24} />, href: '/contact-us' },
                                    ].filter(item => !item.adminOnly || isAdmin).map((item) => (
                                        <Link 
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => !item.disabled && setIsOpen(false)}
                                            className={`flex items-center gap-4 text-2xl font-black uppercase italic tracking-tighter transition-all transform hover:translate-x-2 ${
                                                item.disabled ? 'text-slate-700 cursor-not-allowed' : 'text-slate-300 hover:text-cyan-400'
                                            }`}
                                        >
                                            <div className={item.disabled ? 'text-slate-800' : 'text-cyan-500'}>
                                                {item.icon}
                                            </div>
                                            {item.label}
                                            {item.disabled && <span className="text-[8px] font-bold tracking-widest bg-slate-800 text-slate-500 px-2 py-1 rounded ml-2">Coming Soon</span>}
                                        </Link>
                                    ))}
                                </div>
                                <div className="h-[1px] bg-white/5 my-6" />
                                <button 
                                    onClick={async () => { await signOut({ redirect: false }); setIsOpen(false); window.location.href = "/"; }}
                                    className="flex items-center gap-4 text-2xl font-black uppercase italic tracking-tighter text-red-500/70 hover:text-red-400 transition-all transform hover:translate-x-2"
                                >
                                    <LogOut size={24} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            ['AI & Machine Learning', 'Trends', 'Cloud & Infrastructure', 'Software Development', 'Emerging Hardware', 'Contact Us'].map((item, index) => (
                                <Link 
                                    key={item} 
                                    href={`/${item.toLowerCase().replace(/ /g, '-')}`} 
                                    className="text-lg font-black text-slate-300 hover:text-cyan-400 transition-all transform hover:translate-x-2"
                                    onClick={() => setIsOpen(false)}
                                    style={{ animationDelay: `${index * 40}ms` }}
                                >
                                    {item}
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Action Buttons (Guest Only) */}
                    {!session && (
                        <div className="flex flex-col space-y-3 mt-auto">
                            <Link 
                                href="/get-started" 
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 bg-cyan-500 text-[#000d14] rounded-xl font-black text-base shadow-[0_8px_20px_rgba(6,182,212,0.25)] flex items-center justify-center"
                            >
                                GET STARTED
                            </Link>
                            <Link 
                                href="/signin" 
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-base flex items-center justify-center gap-3"
                            >
                                SIGN IN
                                <UserRound className="w-4 h-4 text-cyan-400" />
                            </Link>
                        </div>
                    )}

                    {/* Footer in Drawer */}
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <p className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">
                            © {new Date().getFullYear()} Macro-Shift System
                        </p>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;