import React from 'react';
import { ShieldCheck, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SellerIDCard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-[340px] mx-auto bg-gradient-to-br from-[#003399] to-black rounded-[2.5rem] p-8 border-4 border-white/10 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
      {/* Decorative Blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all" />
      
      <div className="relative z-10 flex flex-col items-center space-y-6">
        <div className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black px-4 py-1 rounded-full border border-emerald-500/20 uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/10">
          Official Merchant Verified
        </div>

        <div className="w-28 h-28 rounded-[2.2rem] border-4 border-white/10 p-1 bg-white/5 overflow-hidden shadow-2xl">
          <img 
            src={user?.picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=merchants'} 
            className="w-full h-full object-cover rounded-[2rem]" 
            alt="Seller Profile" 
          />
        </div>

        <div className="text-center">
          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{user?.full_name}</h4>
          <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] mt-2">SELLER ID: {user?.id?.substring(0, 12)}</p>
        </div>

        <div className="w-full h-px bg-white/10" />

        <div className="bg-white p-4 rounded-3xl shadow-inner transform rotate-2 group-hover:rotate-0 transition-transform">
          <QrCode size={54} className="text-[#003399]" />
        </div>

        <div className="text-[8px] font-black text-white/20 uppercase tracking-widest text-center mt-2">
          Indraprastha Online Network
        </div>
      </div>
    </div>
  );
};