import React, { useEffect, useState } from 'react';
import { Store, Package, TrendingUp, Eye, Phone, MessageCircle, ArrowRight, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Business, Product } from '../../types';
import { fetchWithAuth } from '../../utils/api';
import { Link } from 'react-router-dom';

const Overview: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [leadsSummary, setLeadsSummary] = useState<{ call: number; whatsapp: number }>({ call: 0, whatsapp: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Overview: fetchData started');
      try {
        console.log('Overview: Calling getBusinessesBySeller and getLeadsSummary in parallel');
        const results = await Promise.allSettled([
          apiService.getBusinessesBySeller(),
          apiService.getLeadsSummary()
        ]);
        
        let bizData: Business[] = [];
        let leadsData = { call: 0, whatsapp: 0 };

        if (results[0].status === 'fulfilled') {
          bizData = results[0].value;
        } else {
          console.error('Overview: Failed to fetch businesses', results[0].reason);
        }

        if (results[1].status === 'fulfilled') {
          leadsData = results[1].value;
        } else {
          console.error('Overview: Failed to fetch leads summary', results[1].reason);
        }
        
        console.log('Overview: Data received', { bizData, leadsData });
        
        setBusinesses(bizData);
        setLeadsSummary(leadsData);
      } catch (error) {
        console.error('Overview: Failed to fetch dashboard data', error);
      } finally {
        console.log('Overview: Setting loading to false');
        setLoading(false);
      }
    };
    fetchData();

    // Auto-stop loading after 15 seconds as a fallback
    const timer = setTimeout(() => {
      setLoading(prev => {
        if (prev) {
          console.warn('Overview: Loading timed out, forcing stop');
          return false;
        }
        return prev;
      });
    }, 15000);
    
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Total Businesses', value: businesses.length, icon: Store, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Listings', value: businesses.filter(b => b.is_active).length, icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Prime Businesses', value: businesses.filter(b => b.plan_type === 'prime').length, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Verified', value: businesses.filter(b => b.is_verified).length, icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  if (loading && businesses.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-white font-black uppercase italic tracking-widest">Loading Dashboard</p>
        <p className="text-muted text-xs font-bold uppercase tracking-widest animate-pulse">Syncing your data...</p>
      </div>
      
      <button 
        onClick={() => setLoading(false)}
        className="text-[10px] bg-white/5 text-muted px-6 py-3 rounded-xl hover:bg-white/10 hover:text-white border border-white/5 transition-all font-black uppercase tracking-widest"
      >
        Skip Loading
      </button>
    </div>
  );

  return (
    <div className="space-y-10 text-white">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Welcome back!
          </h2>
          <p className="text-muted font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            Here's what's happening with your business today.
          </p>
        </div>
        <Link 
          to="/onboarding"
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-wider flex items-center gap-3 hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 group"
        >
          <Store size={20} className="group-hover:rotate-12 transition-transform" />
          Add New Business
        </Link>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 shadow-2xl group hover:border-primary/30 transition-all duration-500">
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
              <stat.icon size={28} />
            </div>
            <p className="text-xs text-muted font-black uppercase tracking-[0.2em]">{stat.label}</p>
            <p className="text-4xl font-black text-white mt-2 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1 bg-surface/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div>
              <h3 className="font-black text-white uppercase italic tracking-tight">Leads Summary</h3>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Total interactions</p>
            </div>
            <Link to="/dashboard/leads" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="p-8 space-y-6 flex-1">
            <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 group hover:bg-blue-500/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-blue-400">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Voice Calls</span>
                </div>
                <TrendingUp size={14} className="text-blue-400/50" />
              </div>
              <p className="text-5xl font-black text-blue-100 tracking-tighter">{leadsSummary.call}</p>
            </div>
            <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10 group hover:bg-emerald-500/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-emerald-400">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <MessageCircle size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">WhatsApp</span>
                </div>
                <TrendingUp size={14} className="text-emerald-400/50" />
              </div>
              <p className="text-5xl font-black text-emerald-100 tracking-tighter">{leadsSummary.whatsapp}</p>
            </div>
          </div>
        </section>

        <section className="lg:col-span-2 bg-surface/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div>
              <h3 className="font-black text-white uppercase italic tracking-tight">Your Businesses</h3>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Manage your listings</p>
            </div>
            <Link to="/dashboard/my-businesses" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
            {businesses.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <Store size={40} className="text-muted/30" />
                </div>
                <p className="text-muted font-medium">No businesses found. Start by adding one!</p>
              </div>
            ) : (
              businesses.map((business) => (
                <div key={business.id} className="p-6 flex items-center gap-6 hover:bg-white/5 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-black/40 overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-primary/50 transition-colors">
                    {business.image_url ? (
                      <img src={business.image_url} alt={business.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted/50">
                        <Store size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-white truncate text-lg tracking-tight group-hover:text-primary transition-colors">{business.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted font-bold uppercase tracking-wider">{business.city}</p>
                      <span className="w-1 h-1 bg-muted/30 rounded-full" />
                      <p className="text-xs text-muted font-bold uppercase tracking-wider">{business.category_id || 'General'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ${
                      business.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}>
                      {business.status || 'Pending'}
                    </span>
                    {business.plan_type === 'prime' && (
                      <span className="bg-primary text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-[0.15em] flex items-center gap-1 shadow-lg shadow-primary/20">
                        <Zap size={10} fill="currentColor" /> Prime
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Overview;
