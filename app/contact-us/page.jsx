"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, Globe, ArrowRight, Zap, MapPin, Phone, Loader2 } from 'lucide-react';
import ErrorModal from '@/components/ErrorModal';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Strategic Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setModalMessage("All fields must be populated.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setModalMessage("Transmission Successful: Your strategic inquiry has been received by our terminal.");
      setFormData({ name: '', email: '', subject: 'Strategic Inquiry', message: '' });
    } catch (error) {
      setModalMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000d14] text-white pt-32 pb-24 relative overflow-hidden">

      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <span className="text-[9px] md:text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mb-4 md:mb-6 block">Direct Communication</span>
          <h1 className="text-3xl md:text-7xl font-black tracking-tighter uppercase italic mb-6 md:mb-8">
            Connect with the <span className="text-cyan-400">Shift.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Whether you have a strategic inquiry, a high-fidelity tech update, or need specialized terminal access, our intelligence team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">

          {/* Contact Info */}
          <div className="space-y-8 md:space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-3xl hover:bg-white/10 transition-all group">
                <Mail className="text-cyan-400 mb-4 md:mb-6 group-hover:scale-110 transition-transform md:w-7 md:h-7" size={24} />
                <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-white mb-1 md:mb-2 italic">General Inquiries</h3>
                <p className="text-[10px] md:text-xs text-slate-500 mb-4 font-bold truncate">macroshift.noreply@gmail.com</p>
                <Link href="mailto:macroshift.noreply@gmail.com" className="text-[9px] md:text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                  Send Message <ArrowRight size={12} />
                </Link>
              </div>
              <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-3xl hover:bg-white/10 transition-all group">
                <MessageSquare className="text-blue-400 mb-4 md:mb-6 group-hover:scale-110 transition-transform md:w-7 md:h-7" size={24} />
                <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-white mb-1 md:mb-2 italic">Technical Support</h3>
                <p className="text-[10px] md:text-xs text-slate-500 mb-4 font-bold truncate">macroshift.noreply@gmail.com</p>
                <Link href="mailto:macroshift.noreply@gmail.com" className="text-[9px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                  Open Ticket <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 border-b border-white/5">
                <MapPin className="text-slate-500 shrink-0" size={18} className="md:w-5 md:h-5" />
                <div>
                  <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">Global Headquarters</h4>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-1 uppercase">Node 01: Silicon Valley / Decentralized</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 border-b border-white/5">
                <Phone className="text-slate-500 shrink-0" size={18} className="md:w-5 md:h-5" />
                <div>
                  <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">Urgent Connection</h4>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-1">+1 (888) MACRO-SHIFT</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[3rem] backdrop-blur-3xl shadow-2xl">
            <h3 className="text-xl md:text-2xl font-black text-white mb-8 md:mb-10 uppercase italic tracking-tight">Send a Message</h3>
            <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Your Name</label>
                  <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Email Address</label>
                  <input type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Subject</label>
                <select value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all appearance-none text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                  <option>Strategic Inquiry</option>
                  <option>Community News Submission</option>
                  <option>Terminal Support</option>
                  <option>Partnership Proposal</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Message Content</label>
                <textarea rows="4" placeholder="How can we help?" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all resize-none text-white"></textarea>
              </div>
              <button disabled={isSubmitting} className="w-full py-4 md:py-5 bg-cyan-500 text-[#000d14] font-black rounded-xl md:rounded-2xl hover:bg-cyan-400 hover:-translate-y-1 transition-all shadow-[0_15px_40px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3 text-xs md:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>SEND MESSAGE <Zap size={18} /></>}
              </button>
            </form>
          </div>

        </div>

      </div>

      <ErrorModal 
        message={modalMessage} 
        onClose={() => setModalMessage(null)} 
      />
    </div>
  );
}
