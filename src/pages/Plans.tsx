import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CheckCircle2, Zap, Star, Store, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Plans: React.FC = () => {
  const { token, user, updateRole, setAuthModalOpen } = useAuth();
  const navigate = useNavigate();

  const handleStart = async (plan: 'free' | 'showroom' | 'prime') => {
    if (!token || !user) {
      setAuthModalOpen(true, 'seller');
      sessionStorage.setItem('pendingPlan', plan);
    } else {
      if (user.role !== 'seller' && user.role !== 'founder') {
        await updateRole('seller');
      }
      navigate(`/dashboard/add-business?plan=${plan}`);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'छोटी दुकान',
      subtitle: 'छोटे व्यापारियों के लिए',
      price: 'Free',
      originalPrice: '₹199 / Month',
      features: [
        'Digital Identity',
        'Phone Number (Direct Calling)'
      ],
      buttonText: 'START',
      color: 'blue',
      icon: <Store className="w-8 h-8 text-orange-600" />
    },
    {
      id: 'showroom',
      name: 'शोरूम',
      subtitle: 'बढ़ते व्यापार के लिए',
      price: '₹499 / Month',
      originalPrice: '₹4,999 / Year',
      features: [
        'Digital Identity',
        'Phone Number (Direct Calling)',
        'Google Map Location',
        'WhatsApp Order (Direct WhatsApp Open)'
      ],
      buttonText: 'UPGRADE',
      color: 'orange',
      popular: true,
      icon: <Zap className="w-8 h-8 text-orange-600" />
    },
    {
      id: 'prime',
      name: 'PRIME SHOWROOM',
      subtitle: 'प्रीमियम व्यवसायों के लिए',
      price: '₹14,999 / Year',
      originalPrice: '₹14,999',
      features: [
        'Digital Identity',
        'Phone Number (Direct Calling)',
        'Google Map Location',
        'WhatsApp Order',
        'Verified Badge',
        'Social Media Links'
      ],
      buttonText: 'JOIN PRIME',
      color: 'green',
      special: 'SHREE RAM NAVMI SPECIAL',
      icon: <Star className="w-8 h-8 text-green-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF9933] via-[#FF8C00] to-[#FF4500] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-300 rounded-full blur-[120px]" />
      </div>
      
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4 relative">
          {(user?.role === 'seller' || user?.role === 'founder') && (
            <button 
              onClick={() => navigate('/dashboard')}
              className="absolute left-0 top-0 flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden md:inline">Back to Dashboard</span>
            </button>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white drop-shadow-lg"
          >
            अपनी दुकान के लिए सही प्लान चुनें
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 font-medium drop-shadow-md"
          >
            Indraprastha ONLINE पर अपने व्यापार को डिजिटल बनाएं
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative bg-white rounded-[2.5rem] p-8 shadow-xl border-2 transition-all hover:scale-[1.02] flex flex-col ${
                plan.popular ? 'border-orange-600 ring-4 ring-orange-600/10' : 
                plan.special ? 'border-orange-200 bg-gradient-to-b from-white to-orange-50/30' : 
                'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-6 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  MOST POPULAR
                </div>
              )}
              {plan.special && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-6 py-1 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap">
                  {plan.special}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm font-medium mb-6">{plan.subtitle}</p>
                
                <div className="space-y-1">
                  <div className="text-4xl font-black text-orange-600">
                    {plan.price}
                  </div>
                  <div className="text-sm text-gray-400 font-bold line-through">
                    {plan.originalPrice}
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className={`shrink-0 mt-0.5 ${plan.color === 'green' ? 'text-green-500' : 'text-orange-500'}`} size={18} />
                    <span className="text-gray-700 font-bold text-sm leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleStart(plan.id as any)}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg ${
                  plan.color === 'green' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
