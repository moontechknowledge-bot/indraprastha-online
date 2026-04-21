import React, { useEffect, useState } from 'react';
import { Phone, MessageCircle, Calendar, Store, Search, Filter } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useLocation, useNavigate } from 'react-router-dom';

interface Lead {
  id: string;
  business_id: string;
  business_name: string;
  type: 'call' | 'whatsapp';
  created_at: string;
}

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const businessIdFilter = queryParams.get('business_id');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await apiService.getLeads();
        setLeads(data);
      } catch (error) {
        console.error('Failed to fetch leads', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.business_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBusiness = businessIdFilter ? lead.business_id === businessIdFilter : true;
    return matchesSearch && matchesBusiness;
  });

  if (loading) return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-20 bg-surface rounded-2xl border border-border"></div>
      ))}
    </div>
  );

  return (
    <div className="space-y-10 text-white">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Leads History</h2>
          <p className="text-muted font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            Track every customer interaction with your businesses.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {businessIdFilter && (
            <button 
              onClick={() => navigate('/dashboard/leads')}
              className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all border border-primary/20 shadow-xl"
            >
              <Filter size={18} />
              Clear Filter
            </button>
          )}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by business..."
              className="pl-12 pr-6 py-4 rounded-2xl border border-white/5 bg-surface/40 backdrop-blur-md text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full md:w-80 font-bold text-sm shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="bg-surface/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Type</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Business</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Date & Time</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <MessageCircle size={48} />
                      <p className="text-xl font-black uppercase italic tracking-widest">No leads found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${
                          lead.type === 'call' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {lead.type === 'call' ? <Phone size={20} /> : <MessageCircle size={20} />}
                        </div>
                        <span className="font-black text-white uppercase italic tracking-widest text-sm">{lead.type}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                          <Store size={16} className="text-primary/50" />
                        </div>
                        <span className="font-bold tracking-tight text-lg group-hover:text-primary transition-colors">{lead.business_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-muted font-bold text-xs uppercase tracking-widest">
                        <Calendar size={14} className="text-primary/50" />
                        {new Date(lead.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 rounded-full bg-white/5 text-muted text-[10px] font-black uppercase tracking-[0.15em] border border-white/5 group-hover:border-primary/30 group-hover:text-primary transition-all">
                        Received
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leads;
