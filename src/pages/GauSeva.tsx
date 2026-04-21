import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Image as ImageIcon, Info, ExternalLink, Users, History, Clock } from 'lucide-react';

const GauSeva: React.FC = () => {
  const updates = [
    {
      date: 'March 15, 2026',
      title: 'Monthly Donation Completed',
      description: '10% of our platform revenue for February has been donated to Shri Krishna Gaushala.',
      image: 'https://picsum.photos/seed/gaushala1/800/600',
      amount: '₹12,450'
    },
    {
      date: 'February 10, 2026',
      title: 'Medical Camp Support',
      description: 'Supported a medical checkup camp for over 200 cows in the local area.',
      image: 'https://picsum.photos/seed/gaushala2/800/600',
      amount: '₹8,000'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FF6600]">
      <Header />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto space-y-20">
          
          {/* Hero Section */}
          <section className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white font-black uppercase tracking-[0.3em] text-xs"
            >
              <Heart className="text-red-400 fill-red-400" size={14} />
              Our Commitment
            </motion.div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
                Gau Seva <br />
                <span className="text-white/40">Transparency</span>
              </h1>
              <p className="text-white/60 max-w-2xl mx-auto font-medium text-lg">
                At Indraprastha Online, we believe in giving back. 10% of our platform's revenue is dedicated to the welfare of cows (Gau Seva).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-10">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 space-y-2">
                <div className="text-3xl font-black text-white italic">10%</div>
                <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">Revenue Share</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 space-y-2">
                <div className="text-3xl font-black text-white italic">500+</div>
                <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">Cows Supported</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 space-y-2">
                <div className="text-3xl font-black text-white italic">100%</div>
                <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">Transparency</div>
              </div>
            </div>
          </section>

          {/* Transparency Updates */}
          <section className="space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                <History className="text-[#FF6600]" />
                Recent Updates
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {updates.map((update, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#0044cc] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={update.image} 
                      alt={update.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 right-6 bg-white text-[#0044cc] px-4 py-2 rounded-full font-black text-sm shadow-xl">
                      {update.amount}
                    </div>
                  </div>
                  <div className="p-10 space-y-4">
                    <div className="text-[10px] text-white/40 font-black uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} />
                      {update.date}
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{update.title}</h3>
                    <p className="text-white/60 font-medium leading-relaxed">
                      {update.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-white/5 backdrop-blur-md rounded-[3rem] p-12 md:p-20 border border-white/10 text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                Want to <span className="text-[#FF6600]">Contribute?</span>
              </h2>
              <p className="text-white/60 max-w-xl mx-auto font-medium">
                If you'd like to contribute directly to Gau Seva or want to visit the Gaushalas we support, please get in touch with us.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <a 
                  href="/contact" 
                  className="bg-white text-[#0044cc] px-10 py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-white/90 transition-all shadow-xl active:scale-95"
                >
                  Contact Us
                </a>
                <button className="bg-white/10 text-white border border-white/20 px-10 py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-white/20 transition-all active:scale-95">
                  Learn More
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GauSeva;
