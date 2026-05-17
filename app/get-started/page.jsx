import React from 'react';
import Link from 'next/link';
import { Rocket, Shield, Cpu, Globe, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function GetStarted() {
  const steps = [
    {
      title: "Initialize Terminal",
      desc: "Create your unique Terminal ID and synchronize with the global intelligence network.",
      icon: <Rocket size={24} />
    },
    {
      title: "Select Strategic Sectors",
      desc: "Customize your dashboard by selecting the technology shifts that matter to your mission.",
      icon: <Cpu size={24} />
    },
    {
      title: "Access Proprietary Intelligence",
      desc: "Begin receiving high-fidelity audits and community-submitted posts directly in your terminal.",
      icon: <Zap size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#000d14] text-white pt-32 pb-24 relative overflow-hidden">
      
      {/* Ambient Visuals */}
      <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-cyan-500/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mb-6 block">Onboarding Protocol</span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic mb-8">
            Begin Your <br />
            <span className="text-cyan-400">Shift.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-12">
            The era of technological noise is over. Join 40,000+ industry leaders who decipher the future with high-fidelity intelligence. 
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 bg-cyan-500 text-[#000d14] font-black rounded-2xl hover:bg-cyan-400 hover:-translate-y-1 transition-all shadow-[0_15px_40px_rgba(6,182,212,0.4)]">
                INITIALIZE TERMINAL ACCESS
              </button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 bg-white/5 border border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition-all backdrop-blur-xl">
                EXPLORE PUBLIC NEWS
              </button>
            </Link>
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group p-10 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all duration-500">
              <div className="absolute -left-4 -top-4 w-12 h-12 bg-cyan-500 text-[#000d14] rounded-full flex items-center justify-center font-black italic text-xl shadow-lg">
                0{idx + 1}
              </div>
              <div className="text-cyan-400 mb-8 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic mb-4 tracking-tight">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Membership Tiers */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Terminal <span className="text-cyan-500">Membership.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Standard Access */}
            <div className="p-12 bg-white/5 border border-white/10 rounded-[3rem] flex flex-col justify-between">
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Standard Protocol</h4>
                  <p className="text-4xl font-black text-white uppercase italic">Free</p>
                </div>
                <ul className="space-y-4">
                  {['Public News Feed', 'Weekly Tech Audits', 'Mobile Terminal Access'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                      <CheckCircle2 size={16} className="text-cyan-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup">
                <button className="w-full py-4 mt-12 bg-white/10 text-white font-black rounded-xl hover:bg-white/20 transition-all">
                  JOIN PUBLIC NETWORK
                </button>
              </Link>
            </div>

            {/* Pro Access */}
            <div className="p-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[3rem] text-[#000d14] flex flex-col justify-between shadow-[0_20px_50px_rgba(6,182,212,0.3)] relative overflow-hidden group border-2 border-white/20">
              <div className="absolute top-6 right-6 px-3 py-1 bg-[#000d14] text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full z-20">
                Coming Soon
              </div>
              <Zap className="absolute -right-12 -top-12 w-48 h-48 text-white/10 group-hover:scale-110 transition-transform" />
              <div className="space-y-8 relative z-10">
                <div>
                  <h4 className="text-xs font-black text-[#000d14]/60 uppercase tracking-[0.4em] mb-2">Intelligence Pro</h4>
                  <p className="text-4xl font-black text-[#000d14] uppercase italic">$49/mo</p>
                </div>
                <ul className="space-y-4">
                  {[
                    'Inside Information & Market Whispers', 
                    'Real-time Decentralized Network Access', 
                    'Unrestricted Apex Level Clearance', 
                    'Direct 1-on-1 Strategic Consulting',
                    'Priority Terminal Support'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle2 size={16} className="text-[#000d14]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button disabled className="w-full py-4 mt-12 bg-[#000d14]/20 text-[#000d14]/40 cursor-not-allowed font-black rounded-xl relative z-10 border border-[#000d14]/10">
                UPGRADE UNAVAILABLE
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
