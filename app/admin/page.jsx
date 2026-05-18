'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Trash2, 
  Search, 
  LayoutDashboard, 
  ArrowRight, 
  Zap, 
  ShieldAlert, 
  Loader2,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Activity,
  Globe,
  Lock,
  Unlock,
  AlertTriangle,
  ChevronRight,
  EyeOff,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); 
  const [searchQuery, setSearchQuery] = useState('');

  const user = session?.user;
  const isAdmin = user?.role === 'admin' || user?.email === 'nwokedichigozirim747@gmail.com';

  useEffect(() => {
    if (status !== 'loading' && session && !isAdmin) {
      router.push('/');
    }
  }, [session, status, isAdmin, router]);

  useEffect(() => {
    async function fetchAdminData() {
      if (!session || !isAdmin) return;
      
      setIsLoading(true);
      try {
        const [usersRes, postsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/posts')
        ]);
        
        const userData = await usersRes.json();
        const postData = await postsRes.json();
        
        setUsers(userData.users || []);
        setPosts(postData.posts || []);
        setStats({
          totalUsers: userData.users?.length || 0,
          totalPosts: postData.posts?.length || 0
        });
      } catch (error) {
        console.error("Admin data fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (session && isAdmin) fetchAdminData();
  }, [session, isAdmin]);

  const toggleVerification = async (userId, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_verified: !currentStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, is_verified: !currentStatus } : u));
      }
    } catch (error) {
      console.error("Verification toggle failed:", error);
    }
  };

  const deleteAnyPost = async (postId) => {
    if (!confirm("Confirm neutralization of this intelligence signal?")) return;
    
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== postId));
        setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
      }
    } catch (error) {
      console.error("Post deletion failed:", error);
    }
  };

  const maskEmail = (email) => {
    if (!email) return '***@***.com';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  };

  if (status === 'loading' || !session || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#000d14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
            <Loader2 className="w-16 h-16 text-cyan-500 animate-spin relative z-10" />
          </div>
          <p className="text-xs font-black text-cyan-500/50 uppercase tracking-[0.5em] animate-pulse">Establishing Oversight Connection</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#000d14] text-white selection:bg-cyan-500 selection:text-[#000d14] font-sans">
      {/* Background FX */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-[110] shadow-[0_0_20px_rgba(6,182,212,0.5)]" />

      {/* Sidebar - High Fidelity Desktop Only */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-[#000d14]/80 backdrop-blur-3xl border-r border-white/5 z-[60] flex-col py-10 px-6">
        <div className="mb-12 flex items-center gap-4 px-2">
          <div className="p-3 bg-cyan-500 text-[#000d14] rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <ShieldCheck size={28} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter uppercase italic leading-none">Admin <span className="text-cyan-500">Core</span></span>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Oversight Center</span>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { id: 'users', label: 'Strategists', icon: <Users size={18} /> },
            { id: 'posts', label: 'Intelligence', icon: <MessageSquare size={18} /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                activeTab === tab.id 
                  ? 'bg-cyan-500 text-[#000d14] shadow-[0_10px_30px_rgba(6,182,212,0.2)]' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                {tab.icon}
                <span className="font-black text-[10px] uppercase tracking-widest">{tab.label}</span>
              </div>
              <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'} />
            </button>
          ))}
        </nav>

        <Link href="/" className="mt-auto">
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20">
            <ArrowRight size={18} />
            <span className="font-black text-[10px] uppercase tracking-widest">Exit Command</span>
          </button>
        </Link>
      </aside>

      {/* Main Command Area */}
      <main className="lg:pl-72 flex flex-col">
        {/* Authoritative Header - Simplified for Clarity */}
        <header className="sticky top-0 bg-[#000d14]/90 backdrop-blur-xl border-b border-white/5 z-[100] px-6 py-6 md:px-12 md:py-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
              <span className="text-[8px] md:text-[9px] font-black text-cyan-500 uppercase tracking-[0.4em]">Oversight: Master Clearance Confirmed</span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">Command <span className="text-cyan-400">Hub</span></h1>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <Shield size={10} className="text-cyan-500" /> Authorized: <span className="text-white italic">{session.user.name}</span>
            </p>
          </div>

          <div className="relative group w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder={`Query ${activeTab} stream...`}
              className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 pr-8 text-[10px] md:text-xs focus:outline-none focus:border-cyan-500/50 transition-all font-bold placeholder:text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-8 md:space-y-16 pb-32">
          
          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl md:rounded-[3rem] p-6 md:p-10 relative overflow-hidden group hover:bg-white/[0.05] transition-all">
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[80px] md:min-h-[160px]">
                <div className="p-2 md:p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl md:rounded-2xl w-fit">
                  <Users size={16} className="text-cyan-400 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="text-4xl md:text-7xl font-black italic tracking-tighter text-white">{stats.totalUsers}</p>
                  <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">Strategists</p>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-3xl md:rounded-[3rem] p-6 md:p-10 relative overflow-hidden group hover:bg-white/[0.05] transition-all">
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[80px] md:min-h-[160px]">
                <div className="p-2 md:p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl md:rounded-2xl w-fit">
                  <Globe size={16} className="text-blue-400 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="text-4xl md:text-7xl font-black italic tracking-tighter text-white">{stats.totalPosts}</p>
                  <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">Signals</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group hover:bg-white/[0.05] transition-all">
               <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl w-fit">
                  <Shield size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-7xl font-black italic tracking-tighter text-white">Apex</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Integrity Level</p>
                </div>
              </div>
            </div>
          </div>

          {/* Records Section */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[9px] md:text-xs font-black text-white uppercase tracking-[0.4em] italic flex items-center gap-2 md:gap-3">
                <LayoutDashboard size={14} className="text-cyan-500 md:w-4 md:h-4" />
                Records Command
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest">Encrypted Stream</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
              {isLoading ? (
                <div className="p-20 md:p-32 flex flex-col items-center justify-center gap-4 md:gap-6">
                  <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-cyan-500 animate-spin" />
                  <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Decrypting...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {activeTab === 'users' ? (
                    <table className="w-full text-left min-w-full lg:min-w-[800px]">
                      <thead className="bg-white/5 border-b border-white/5 hidden md:table-header-group">
                        <tr>
                          <th className="p-8 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Strategist</th>
                          <th className="p-8 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Credentials</th>
                          <th className="p-8 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Status</th>
                          <th className="p-8 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredUsers.map(user => (
                          <tr key={user.id} className="hover:bg-white/[0.04] transition-colors group flex flex-col md:table-row p-4 md:p-0">
                            <td className="md:p-8 mb-4 md:mb-0">
                              <div className="flex items-center gap-4 md:gap-5">
                                <div className="relative shrink-0">
                                  <div className={`absolute -inset-1 rounded-xl md:rounded-2xl blur-md opacity-20 ${user.is_verified ? 'bg-cyan-500' : 'bg-slate-500'}`} />
                                  <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name)}&background=06b6d4&color=fff`} 
                                    className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl object-cover bg-white/5 relative z-10 border border-white/10" />
                                </div>
                                <div>
                                  <p className="font-black text-sm md:text-lg text-white uppercase italic tracking-tighter">{user.first_name} {user.last_name}</p>
                                  <p className="text-[8px] md:text-[10px] text-cyan-500/60 font-black uppercase tracking-[0.2em]">{user.username || '@node_anon'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="md:p-8 mb-4 md:mb-0">
                              <div className="flex items-center gap-2 text-slate-400">
                                <EyeOff size={10} className="text-slate-600 shrink-0" />
                                <p className="text-[10px] md:text-xs font-bold tracking-tight">{maskEmail(user.email)}</p>
                              </div>
                              <div className="mt-1 md:mt-2 flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-white/5 rounded text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest">ID_{user.id.substring(0, 6)}</span>
                              </div>
                            </td>
                            <td className="md:p-8 mb-6 md:mb-0">
                              {user.is_verified ? (
                                <div className="flex items-center gap-2 text-cyan-400">
                                  <ShieldCheck size={12} className="md:w-3.5 md:h-3.5" />
                                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Verified Access</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-slate-500">
                                  <ShieldAlert size={12} className="md:w-3.5 md:h-3.5" />
                                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Standard Access</span>
                                </div>
                              )}
                            </td>
                            <td className="md:p-8 md:text-right">
                              {user.id !== session.user.id ? (
                                <button 
                                  onClick={() => toggleVerification(user.id, user.is_verified)}
                                  className={`w-full md:w-auto px-6 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                                    user.is_verified 
                                      ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                                      : 'bg-cyan-500 text-[#000d14] shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95'
                                  }`}
                                >
                                  {user.is_verified ? 'Revoke Master' : 'Grant Master'}
                                </button>
                              ) : (
                                <span className="inline-block px-6 py-3 text-[9px] md:text-[10px] font-black text-cyan-500 uppercase tracking-widest border border-cyan-500/20 rounded-xl bg-cyan-500/5">
                                  Root Analyst (Self)
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-left min-w-full lg:min-w-[800px]">
                       <thead className="bg-white/5 border-b border-white/5 hidden md:table-header-group">
                        <tr>
                          <th className="p-8 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Signal</th>
                          <th className="p-8 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Sector</th>
                          <th className="p-8 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Metrics</th>
                          <th className="p-8 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] text-right">Neutralize</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredPosts.map(post => (
                          <tr key={post.id} className="hover:bg-white/[0.04] transition-colors group flex flex-col md:table-row p-4 md:p-0">
                            <td className="md:p-8 mb-3 md:mb-0">
                              <p className="font-black text-sm md:text-lg text-white uppercase italic tracking-tighter mb-1">{post.title}</p>
                              <p className="text-[10px] text-slate-500 font-light line-clamp-1">{post.content}</p>
                            </td>
                            <td className="md:p-8 mb-4 md:mb-0">
                              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-cyan-400 uppercase tracking-[0.2em]">
                                {post.category}
                              </span>
                            </td>
                            <td className="md:p-8 mb-6 md:mb-0">
                              <div className="flex gap-4">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <Activity size={10} className="text-cyan-500" />
                                  <span className="text-[10px] font-black italic">{post.likes_count || 0}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <Globe size={10} className="text-blue-500" />
                                  <span className="text-[10px] font-black italic">{post.comments_count || 0}</span>
                                </div>
                              </div>
                            </td>
                            <td className="md:p-8 md:text-right">
                              <button 
                                onClick={() => deleteAnyPost(post.id)}
                                className="w-full md:w-auto p-3.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                              >
                                <Trash2 size={16} className="md:w-5 md:h-5" />
                                <span className="md:hidden text-[9px] font-black uppercase tracking-widest">Neutralize Signal</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Command Nav - Restored & Optimized */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#00111a]/95 backdrop-blur-2xl border-t border-white/5 z-[120] px-6 py-4 flex items-center justify-around pb-8">
        {[
          { id: 'users', label: 'Nodes', icon: <Users size={18} /> },
          { id: 'posts', label: 'Signals', icon: <MessageSquare size={18} /> }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === tab.id ? 'text-cyan-400' : 'text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-transparent'}`}>
              {tab.icon}
            </div>
            <span className="text-[7px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
        <Link href="/" className="flex flex-col items-center gap-1.5 text-slate-600">
          <div className="p-2">
            <ArrowRight size={18} />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">Exit Hub</span>
        </Link>
      </div>
    </div>
  );
}
