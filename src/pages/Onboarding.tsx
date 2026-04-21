import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Store, Rocket, ShieldCheck, Zap, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { SYSTEM_CONFIG } from '../config/systemConfig';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Onboarding: React.FC = () => {
  const { token, user, updateRole, setAuthModalOpen } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);

  const handleStart = async (plan: 'free' | 'showroom' | 'prime') => {
    if (isProcessing) return;
    setIsProcessing(plan);

    try {
      if (!token || !user) {
        sessionStorage.setItem('pendingPlan', plan);
        setAuthModalOpen(true, 'seller');
        // We don't setIsProcessing(null) here because the modal is open and we might redirect
      } else {
        // User is logged in
        if (user.role !== 'seller' && user.role !== 'founder') {
          try {
            await Promise.race([
              updateRole('seller'),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
            ]);
          } catch (e) {
            console.warn('Onboarding: updateRole skipped or timed out');
          }
        }
        window.location.href = `/dashboard/add-business?plan=${plan}`;
      }
    } catch (error) {
      console.error('Onboarding start error:', error);
      window.location.href = `/dashboard/add-business?plan=${plan}`;
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#ff6b00]">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-[#ff6b00] text-white py-16 px-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black mb-4 leading-tight tracking-tighter drop-shadow-2xl"
            >
              अपनी दुकान ऑनलाइन लायें
            </motion.h1>
            <p className="text-xl md:text-2xl font-bold mb-10 text-white/90 drop-shadow-lg">
              Indraprastha ONLINE पर अपने व्यापार को डिजिटल बनाएं
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <button 
                onClick={() => {
                  const el = document.getElementById('pricing-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-[#ff6b00] px-10 py-5 rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-2xl shadow-white/20 hover:scale-105 active:scale-95 transition-all"
              >
                Register Now
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('pricing-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-black/20 text-white border-2 border-white/20 px-10 py-5 rounded-[2.5rem] font-black text-xl uppercase tracking-widest hover:bg-black/30 transition-all active:scale-95"
              >
                View Plans
              </button>
            </motion.div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing-section" className="pt-20 pb-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[3rem] p-10 shadow-2xl flex flex-col items-center text-center relative"
              >
                <h3 className="text-3xl font-black text-gray-900 mb-1">छोटी दुकान</h3>
                <p className="text-gray-500 font-bold text-sm mb-6">छोटे व्यापारियों के लिए</p>
                <div className="text-5xl font-black text-[#ff6b00] mb-2">Free</div>
                <div className="text-sm text-gray-400 font-bold line-through mb-10">₹199 / Month</div>
                
                <ul className="space-y-4 mb-10 text-left w-full">
                  {['Digital Identity', 'Phone Number (Direct Calling)'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 font-bold text-sm">
                      <CheckCircle2 size={18} className="text-[#ff6b00] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto w-full">
                  <button 
                    onClick={() => handleStart('free')}
                    disabled={!!isProcessing}
                    className="w-full py-5 rounded-[2rem] bg-[#ff6b00] text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3"
                  >
                    {isProcessing === 'free' && <Loader2 className="animate-spin" size={24} />}
                    {isProcessing === 'free' ? 'PROCESSING...' : 'START'}
                  </button>
                </div>
              </motion.div>

              {/* Showroom Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[3rem] p-10 shadow-2xl flex flex-col items-center text-center relative border-t-8 border-orange-200 transform md:scale-105 z-10"
              >
                <div className="absolute -top-5 bg-black text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">
                  MOST POPULAR
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-1">शोरूम</h3>
                <p className="text-gray-500 font-bold text-sm mb-6">बढ़ते व्यापार के लिए</p>
                <div className="text-5xl font-black text-[#ff6b00] mb-2">₹499 / Month</div>
                <div className="text-sm text-gray-400 font-bold line-through mb-10">₹4,999 / Year</div>
                
                <ul className="space-y-4 mb-10 text-left w-full">
                  {['Digital Identity', 'Phone Number (Direct Calling)', 'Google Map Location', 'WhatsApp Order (Direct WhatsApp Open)'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 font-bold text-sm">
                      <CheckCircle2 size={18} className="text-[#ff6b00] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto w-full">
                  <button 
                    onClick={() => handleStart('showroom')}
                    disabled={!!isProcessing}
                    className="w-full py-5 rounded-[2rem] bg-[#ff6b00] text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3"
                  >
                    {isProcessing === 'showroom' && <Loader2 className="animate-spin" size={24} />}
                    {isProcessing === 'showroom' ? 'PROCESSING...' : 'UPGRADE'}
                  </button>
                </div>
              </motion.div>

              {/* Prime Plan */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[3rem] p-10 shadow-2xl flex flex-col items-center text-center relative border-t-8 border-emerald-500 group"
              >
                <div className="absolute -top-5 bg-orange-500 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">
                  SHREE RAM NAVMI SPECIAL
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-1">PRIME SHOWROOM</h3>
                <p className="text-gray-500 font-bold text-sm mb-6">प्रीमियम व्यवसायों के लिए</p>
                <div className="text-5xl font-black text-emerald-600 mb-2">₹14,999 / Year</div>
                <div className="text-sm text-gray-400 font-bold line-through mb-10">₹14,999</div>
                
                <ul className="space-y-4 mb-10 text-left w-full">
                  {['Digital Identity', 'Phone Number (Direct Calling)', 'Google Map Location', 'WhatsApp Order', 'Verified Badge', 'Social Media Links'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 font-bold text-sm">
                      <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto w-full">
                  <button 
                    onClick={() => handleStart('prime')}
                    disabled={!!isProcessing}
                    className="w-full py-5 rounded-[2rem] bg-emerald-600 text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all outline outline-offset-4 outline-transparent group-hover:outline-emerald-500/30 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3"
                  >
                    {isProcessing === 'prime' && <Loader2 className="animate-spin" size={24} />}
                    {isProcessing === 'prime' ? 'PROCESSING...' : 'JOIN PRIME'}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
