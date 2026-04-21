import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export const ContactUs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#FF6600] flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-[#0a192f] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF9933] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFFF00] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
            >
              {t('contact_page.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-blue-100 font-medium"
            >
              {t('contact_page.subtitle')}
            </motion.p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-20 -mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: MapPin, title: 'Head Office', value: 'Pan India', color: 'bg-orange-500/10 text-orange-400' },
                { icon: Phone, title: 'Phone', value: '+91 8505897985', color: 'bg-blue-500/10 text-blue-400', link: 'tel:+918505897985' },
                { icon: Phone, title: 'Landline', value: '011-41626407', color: 'bg-indigo-500/10 text-indigo-400', link: 'tel:01141626407' },
                { icon: Mail, title: 'Email', value: 'info@indraprasthaonline.co.in', color: 'bg-emerald-500/10 text-emerald-400', link: 'https://mail.google.com/mail/?view=cm&fs=1&to=info@indraprasthaonline.co.in' }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#0a192f] p-10 rounded-[2.5rem] shadow-xl border border-white/10 text-center group hover:border-[#FF6A00] transition-all duration-500"
                >
                  <div className={`w-20 h-20 ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  {item.link ? (
                    <a 
                      href={item.link} 
                      className="text-white/60 hover:text-[#FF6A00] font-medium transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-white/60 font-medium">{item.value}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Support Note */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-20 bg-[#0a192f] p-10 md:p-16 rounded-[3rem] shadow-xl border border-white/10 flex flex-col md:flex-row items-center gap-12"
            >
              <div className="w-24 h-24 bg-[#FF6A00]/10 rounded-full flex items-center justify-center shrink-0">
                <MessageSquare size={40} className="text-[#FF6A00]" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Need Support?</h2>
                <p className="text-xl text-white/70 leading-relaxed">
                  {t('contact_page.note')}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};
