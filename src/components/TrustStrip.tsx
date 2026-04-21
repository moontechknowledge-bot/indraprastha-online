import React from 'react';
import { ShieldCheck, MessageCircle, Zap, TrendingUp } from 'lucide-react';

const trustItems = [
  { icon: <ShieldCheck className="text-[#1E4ED8]" />, label: "Verified Sellers" },
  { icon: <MessageCircle className="text-[#22C55E]" />, label: "Direct WhatsApp" },
  { icon: <Zap className="text-[#FF6A00]" />, label: "0% Commission" },
  { icon: <TrendingUp className="text-[#1E4ED8]" />, label: "Local Growth" }
];

export const TrustStrip: React.FC = React.memo(() => {
  return (
    <div className="bg-[#0a192f] border-y border-white/5 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {trustItems.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center md:items-start gap-4 group text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/5 shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 border border-white/10 group-hover:border-primary/30">
                {React.cloneElement(item.icon as React.ReactElement, { size: 28, className: "stroke-[2px] transition-colors duration-500" })}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm md:text-base font-black text-white uppercase italic tracking-wider group-hover:text-primary transition-colors">{item.label}</h4>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-60">Indraprastha Verified</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
