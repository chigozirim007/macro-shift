import { Code2, Terminal, Cpu, Braces, ArrowUpRight, Zap, Coffee, Binary } from 'lucide-react';
import PostFeed from '@/components/PostFeed';

export default function SoftwareDevelopment() {
  const stacks = [
    { name: "Rust", focus: "Systems", velocity: "Hyper", color: "text-orange-500" },
    { name: "Mojo", focus: "AI Ops", velocity: "Rising", color: "text-red-500" },
    { name: "TypeScript", focus: "Frontend", velocity: "Stable", color: "text-blue-500" }
  ];

  return (
    <div className="min-h-screen bg-[#000d14] text-white pt-32">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-20 max-w-4xl">
           <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400">
              <Code2 size={24} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Engineering Excellence</span>
          </div>
          <h1 className="text-3xl md:text-7xl font-black tracking-tighter uppercase italic mb-4 md:mb-8">
            Software <span className="text-green-400">Development</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed font-light">
            Deciphering the evolution of programming paradigms. From AI-augmented coding to memory-safe systems engineering, we analyze the tools and languages that will write the next decade.
          </p>
        </div>

        {/* Stack Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-24">
          {stacks.map((stack, i) => (
            <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-3xl group hover:border-green-500/30 transition-all">
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className={`p-2.5 md:p-3 bg-white/5 rounded-xl ${stack.color}`}>
                  <Terminal size={18} className="md:w-5 md:h-5" />
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Stack Velocity</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black italic mb-1">{stack.name}</h3>
              <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 md:mb-6">{stack.focus}</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-grow bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${stack.velocity === 'Hyper' ? 'bg-green-500 w-full' : 'bg-green-500/50 w-2/3'} rounded-full`} />
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-green-400">{stack.velocity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Feed */}
        <PostFeed activeCategory="Software Development" />
      </div>
    </div>
  );
}
