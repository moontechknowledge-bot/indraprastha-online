import React from 'react';
import { HelpCircle, MessageCircle, Mail, Phone, ExternalLink, FileText } from 'lucide-react';

const Help: React.FC = () => {
  const supportOptions = [
    {
      title: 'WhatsApp Support',
      description: 'Get instant help from our support team via WhatsApp.',
      icon: MessageCircle,
      action: 'Chat Now',
      link: 'https://wa.me/919876543210',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Email Support',
      description: 'Send us an email and we will get back to you within 24 hours.',
      icon: Mail,
      action: 'Send Email',
      link: 'mailto:support@indraprastha.online',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Call Support',
      description: 'Available Monday to Saturday, 10 AM to 6 PM.',
      icon: Phone,
      action: 'Call Now',
      link: 'tel:+919876543210',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-12 text-white">
      <header className="space-y-1">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Help & Support</h2>
        <p className="text-muted text-xs font-bold uppercase tracking-[0.2em]">We're here to help you grow your business.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {supportOptions.map((option, i) => (
          <div key={i} className="bg-surface/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col items-center text-center group hover:border-primary/30 transition-all">
            <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
              <option.icon size={36} className={option.color.replace('text-', 'text-')} />
            </div>
            <h3 className="text-xl font-black text-white mb-3 uppercase italic tracking-tighter">{option.title}</h3>
            <p className="text-muted font-medium text-sm mb-8 flex-1 leading-relaxed">{option.description}</p>
            <a 
              href={option.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-4 rounded-2xl font-black uppercase italic tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-2xl ${
                option.color.includes('emerald') 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-900/20' 
                  : option.color.includes('blue')
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/20'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-900/20'
              }`}
            >
              {option.action}
              <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>

      <section className="bg-surface/40 backdrop-blur-md rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/5">
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { q: 'How do I upgrade to PRIME?', a: 'You can upgrade any of your businesses to PRIME from the "My Businesses" section by clicking the "Upgrade to PRIME" button.' },
            { q: 'What are the benefits of PRIME?', a: 'PRIME businesses get priority listing, a verified badge, more product uploads, and direct lead notifications.' },
            { q: 'How long does business approval take?', a: 'Our team typically reviews and approves businesses within 24-48 hours of submission.' },
            { q: 'Can I add multiple businesses?', a: 'Yes! You can add as many businesses as you want under a single seller account.' }
          ].map((faq, i) => (
            <div key={i} className="p-8 hover:bg-white/5 transition-colors group">
              <h4 className="text-lg font-black text-white mb-3 flex items-start gap-4 uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                <HelpCircle size={22} className="text-primary mt-0.5 flex-shrink-0" />
                {faq.q}
              </h4>
              <p className="text-muted font-medium ml-10 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-gradient-to-br from-surface to-black rounded-[3rem] p-12 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-primary/10 transition-colors" />
        
        <div className="space-y-3 relative z-10">
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Need a custom solution?</h3>
          <p className="text-muted font-medium max-w-xl">Our enterprise team can help you with bulk listings, custom integrations, and dedicated support.</p>
        </div>
        <button className="bg-white text-black px-12 py-5 rounded-[2rem] font-black uppercase italic tracking-widest text-sm hover:bg-primary hover:text-white transition-all shadow-2xl relative z-10 active:scale-95">
          Contact Enterprise
        </button>
      </div>
    </div>
  );
};

export default Help;
