import React from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  BrainCircuit, 
  Network, 
  Zap, 
  ArrowUpRight, 
  Bot, 
  Microchip,
  Activity
} from 'lucide-react';

export default function AIPage() {
  const signals = [
    {
      title: "Agentic Reasoning Models",
      category: "LLM Evolution",
      signal: "Strong",
      description: "Shift from passive completion to active reasoning chains. Models are now capable of multi-step planning and self-correction without human intervention.",
      impact: "High",
      icon: <BrainCircuit className="w-6 h-6" />
    },
    {
      title: "Edge Neural Processing",
      category: "Hardware",
      signal: "Rising",
      description: "Neural engines are moving from the cloud to the silicon on your wrist and pocket. Privacy-first, zero-latency intelligence is becoming the standard.",
      impact: "Transformative",
      icon: <Microchip className="w-6 h-6" />
    },
    {
      title: "Neural Architecture Search",
      category: "Infrastructure",
      signal: "Stable",
      description: "Automating the design of neural networks themselves. AI is now optimizing its own code structures to run 40% more efficiently on existing chips.",
      impact: "Medium",
      icon: <Network className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#000d14] text-slate-300 pt-32 pb-24">
      {/* Neural Background Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        
        {/* Breadcrumb / Category Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
            <Cpu size={24} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
              AI & <span className="text-cyan-400">Machine Learning</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.4em] font-bold text-slate-500 mt-1">Intelligence Sector Report</p>
          </div>
        </div>

        {/* Hero Vantage Point */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 p-8 md:p-12 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Bot size={120} strokeWidth={1} />
            </div>
            <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">The Neural Displacement</h2>
            <p className="text-lg leading-relaxed text-slate-400 mb-8 max-w-2xl">
              We are moving beyond the era of "Chatbots" into the era of autonomous agents. The current shift indicates a 
              massive migration from centralized API dependencies to distributed, specialized reasoning models. 
              Efficiency is the new scale.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-cyan-400 flex items-center gap-2">
                <Activity size={14} />
                REAL-TIME SIGNAL: ACTIVE
              </span>
              <span className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-slate-300 uppercase tracking-widest">
                Last Audit: 2h ago
              </span>
            </div>
          </div>
          
          <div className="p-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[2rem] text-[#000d14] flex flex-col justify-between shadow-[0_20px_50px_rgba(6,182,212,0.3)]">
            <div className="space-y-4">
              <Zap size={40} strokeWidth={3} />
              <h3 className="text-2xl font-black uppercase leading-tight tracking-tighter italic">
                Get the Full Neural Audit
              </h3>
              <p className="text-sm font-bold opacity-80 leading-relaxed">
                Unlock our deep-dive data on model efficiency benchmarks and proprietary hardware roadmaps.
              </p>
            </div>
            <button className="mt-8 w-full py-4 bg-[#000d14] text-white font-black rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              UPGRADE TO PRO
              <ArrowUpRight size={20} />
            </button>
          </div>
        </section>

        {/* Signals Feed */}
        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-600 mb-10 pl-2">Latest Sector Signals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {signals.map((signal, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-cyan-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 group-hover:scale-110 transition-transform">
                  {signal.icon}
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                  signal.signal === 'Strong' ? 'bg-green-500/20 text-green-400' :
                  signal.signal === 'Rising' ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {signal.signal} Signal
                </span>
              </div>
              <h4 className="text-white font-bold text-xl mb-2 group-hover:text-cyan-400 transition-colors">{signal.title}</h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">{signal.category}</p>
              <p className="text-sm leading-relaxed text-slate-400 mb-6">
                {signal.description}
              </p>
              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Strategic Impact</span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest bg-white/10 px-2 py-1 rounded">
                  {signal.impact}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 p-12 bg-white/5 border border-white/10 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />
          <h3 className="text-3xl font-black text-white mb-6 uppercase relative z-10 italic">Decipher the next neural shift.</h3>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 relative z-10">
            Join 40,000+ engineers and strategists getting our weekly neural audit. No noise. Just the signals that matter.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <input 
              type="email" 
              placeholder="terminal@intelligence.com" 
              className="px-6 py-4 bg-[#000d14] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all w-full sm:w-80"
            />
            <button className="px-8 py-4 bg-cyan-500 text-[#000d14] font-black rounded-xl hover:bg-cyan-400 transition-all">
              SUBSCRIBE TO SIGNALS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
