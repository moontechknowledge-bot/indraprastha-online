import React from 'react';
import { TrendingUp, Users, Eye, Target } from 'lucide-react';

export const MarketingDashboard: React.FC<{ shopId?: string }> = ({ shopId }) => {
  return (
    <div className="bg-[#003399]/10 rounded-[2.5rem] p-8 border border-white/10 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Marketing Analytics</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-muted uppercase tracking-widest">Shop ID:</span>
            <code className="text-[10px] font-mono text-primary bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {shopId || 'VERIFYING...'}
            </code>
          </div>
        </div>
        <span className="bg-emerald-500/20 text-emerald-500 text-[9px] font-black px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest text-center">
          Active Merchant Status
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black/30 p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
           <Eye className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
           <p className="text-[9px] font-black text-muted uppercase tracking-widest">Store Views</p>
           <p className="text-2xl font-black text-white italic tracking-tighter">1,280</p>
        </div>
        <div className="bg-black/30 p-6 rounded-3xl border border-white/5 hover:border-red-500/30 transition-all group">
           <Target className="text-red-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
           <p className="text-[9px] font-black text-muted uppercase tracking-widest">Customer Clicks</p>
           <p className="text-2xl font-black text-white italic tracking-tighter">342</p>
        </div>
        <div className="bg-black/30 p-6 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group">
           <Users className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
           <p className="text-[9px] font-black text-muted uppercase tracking-widest">Inquiries</p>
           <p className="text-2xl font-black text-white italic tracking-tighter">24</p>
        </div>
        <div className="bg-black/30 p-6 rounded-3xl border border-white/5 hover:border-orange-500/30 transition-all group">
           <TrendingUp className="text-orange-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
           <p className="text-[9px] font-black text-muted uppercase tracking-widest">Sales Trend</p>
           <p className="text-2xl font-black text-white italic tracking-tighter">+18%</p>
        </div>
      </div>
    </div>
  );
};