import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { 
  Utensils, 
  ShoppingBag, 
  Smartphone, 
  Home, 
  Stethoscope, 
  Building2, 
  Car, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';

const categories = [
  { 
    name: 'Food & Dining', 
    icon: <Utensils />, 
    color: 'from-orange-400 to-red-500', 
    size: 'large', 
    count: '120+ Places', 
    desc: 'Top rated local restaurants and cafes',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    name: 'Home Services', 
    icon: <Home />, 
    color: 'from-blue-400 to-indigo-600', 
    size: 'medium', 
    count: '85+ Experts', 
    desc: 'Trusted professionals',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    name: 'Electronics & Mobile', 
    icon: <Smartphone />, 
    color: 'from-cyan-400 to-blue-500', 
    size: 'medium', 
    count: '210+ Shops', 
    desc: 'Latest gadgets & repairs',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    name: 'Real Estate', 
    icon: <Building2 />, 
    color: 'from-amber-400 to-orange-600', 
    size: 'small', 
    count: '45+ Agents', 
    desc: 'Find your dream home',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    name: 'Medical & Health', 
    icon: <Stethoscope />, 
    color: 'from-rose-400 to-red-600', 
    size: 'medium', 
    count: '150+ Clinics', 
    desc: 'Expert healthcare',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    name: 'Education & Coaching', 
    icon: <GraduationCap />, 
    color: 'from-violet-400 to-purple-600', 
    size: 'medium', 
    count: '95+ Tutors', 
    desc: 'Learn from the best',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    name: 'Automobile', 
    icon: <Car />, 
    color: 'from-slate-400 to-slate-700', 
    size: 'small', 
    count: '60+ Services', 
    desc: 'Car care & sales',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    name: 'Groceries & Kirana', 
    icon: <ShoppingBag />, 
    color: 'from-emerald-400 to-green-600', 
    size: 'large', 
    count: '300+ Stores', 
    desc: 'Fresh daily essentials',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop'
  },
];

export const CategoryGrid: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setAuthModalOpen } = useAuth();

  const handleCategoryClick = (name: string) => {
    navigate(`/?category=${encodeURIComponent(name)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-32 bg-background text-white overflow-hidden border-t border-orange-900/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-primary font-mono text-sm tracking-[0.2em] uppercase mb-4"
          >
            // Service Directory 2026
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-light tracking-tighter leading-[0.9]"
          >
            Explore the <br />
            <span className="font-serif italic text-primary">Local Ecosystem.</span>
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[240px]">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 0.98 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleCategoryClick(cat.name)}
              className={`group relative rounded-[2.5rem] p-8 overflow-hidden border border-orange-900/20 bg-surface/50 backdrop-blur-sm cursor-pointer allow-guest-click
                ${cat.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                ${cat.size === 'medium' ? 'md:col-span-2' : ''}
              `}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              </div>

              {/* Abstract background glow */}
              <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 z-1`} />
              
              <div className="h-full flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                  <div className={`w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-xl`}>
                    {React.cloneElement(cat.icon as React.ReactElement, { size: cat.size === 'large' ? 48 : 40, className: "stroke-[1.5px]" })}
                  </div>
                  <ArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500 text-white" />
                </div>
                
                <div>
                  <div className="text-xs font-mono text-orange-200/40 mb-2 uppercase tracking-widest">{cat.count}</div>
                  <h3 className={`font-medium tracking-tight leading-none mb-2 ${cat.size === 'large' ? 'text-4xl' : 'text-2xl'}`}>
                    {cat.name}
                  </h3>
                  <p className="text-orange-200/40 text-sm font-light max-w-[200px] line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {cat.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
