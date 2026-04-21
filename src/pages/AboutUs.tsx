import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Target, Users, Eye } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#FF6600] flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-[#0a192f] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF9933] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFFF00] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
            >
              {t('about_page.title')}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-1.5 bg-[#FF9933] mx-auto rounded-full"
            />
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 -mt-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 gap-12">
              {/* Mission */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-[#0a192f] p-8 md:p-12 rounded-3xl shadow-xl border border-white/10 flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="w-16 h-16 bg-[#FF6600]/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Target className="text-[#FF6600] w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    Our Mission
                  </h2>
                  <p className="text-lg text-white/70 leading-relaxed">
                    {t('about_page.p1')}
                  </p>
                </div>
              </motion.div>

              {/* Values */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-[#0a192f] p-8 md:p-12 rounded-3xl shadow-xl border border-white/10 flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Users className="text-blue-400 w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Our Values
                  </h2>
                  <p className="text-lg text-white/70 leading-relaxed">
                    {t('about_page.p2')}
                  </p>
                </div>
              </motion.div>

              {/* Vision */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#0a192f] p-8 md:p-12 rounded-3xl shadow-xl border border-white/10 flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Eye className="text-emerald-400 w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Our Vision
                  </h2>
                  <p className="text-lg text-white/70 leading-relaxed">
                    {t('about_page.p3')}
                  </p>
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
