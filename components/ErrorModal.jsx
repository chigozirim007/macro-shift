import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorModal({ message, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000d14]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#001b2b] border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] rounded-3xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
        >
          <X size={16} />
        </button>
        
        <div className="flex flex-col items-center text-center gap-5 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Access Denied</h3>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase leading-relaxed px-2">
              {message}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full mt-4 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all hover:border-white/20"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
