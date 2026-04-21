import React from 'react';
import { Store, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SYSTEM_CONFIG } from '../config/systemConfig';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { token, user, setAuthModalOpen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isGauSevaPage = location.pathname === '/gau-seva';
  const isHomePage = location.pathname === '/';

  const handleListBusiness = () => {
    if (user?.role === 'founder') {
      navigate('/founder');
    } else if (user?.role === 'seller') {
      navigate('/dashboard');
    } else {
      // For buyers or logged out users, show the onboarding landing page first
      navigate('/onboarding');
    }
  };

  return (
    <footer className="bg-[#0a192f] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* List Your Business CTA - Only show on Home Page */}
        {isHomePage && !isGauSevaPage && (
          <div className="mb-20 bg-primary/10 rounded-[2.5rem] p-8 md:p-12 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-primary/30 transition-all duration-700" />
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl md:text-4xl font-black text-white mb-4 uppercase italic tracking-tighter">{t('footer.grow_business')}</h3>
              <p className="text-muted font-medium max-w-xl">{t('footer.join_indraprastha')}</p>
            </div>
            <button 
              onClick={handleListBusiness}
              className="relative z-10 bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest shadow-2xl shadow-primary/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 whitespace-nowrap"
            >
              <Store size={24} />
              <span>{t('footer.list_your_business')}</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 group">
              <div className="flex flex-col leading-none min-w-fit">
                <div className="flex items-baseline gap-1 whitespace-nowrap">
                  <span className="text-primary italic font-black text-4xl uppercase">इंद्रप्रस्थ</span>
                  <span className="text-[#FFFF00] font-black text-2xl italic tracking-widest">ONLINE</span>
                </div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF0000] mt-1 whitespace-nowrap">
                  BHARAT KA LOCAL BAZAAR
                </div>
              </div>
            </div>
            <p className="text-muted font-medium leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, link: "https://www.facebook.com/share/1CFDj1r9su/", hoverColor: "hover:bg-[#1877F2]" },
                { icon: Instagram, link: "https://www.instagram.com/indraprasthonline?igsh=MWQxNTVteG9nZndtYw==", hoverColor: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]" },
                { icon: Youtube, link: "https://www.youtube.com/@Indraprasthaonline", hoverColor: "hover:bg-[#FF0000]" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${social.hoverColor} hover:text-white transition-all hover:scale-110 shadow-2xl border border-white/5`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black mb-8 uppercase italic tracking-widest text-white border-b border-white/5 pb-4">{t('quick_links')}</h4>
            <ul className="space-y-4 text-muted font-bold uppercase italic tracking-widest text-xs">
              <li><Link to="/about" className="hover:text-primary transition-colors">{t('about_us')}</Link></li>
              <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
              <li><Link to="/gau-seva" className="hover:text-primary transition-colors">Gau Seva</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t('contact_us')}</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">{t('privacy_policy')}</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">{t('terms_conditions')}</Link></li>
              <li><Link to="/refund" className="hover:text-primary transition-colors">{t('refund_policy')}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-black mb-8 uppercase italic tracking-widest text-white border-b border-white/5 pb-4">{t('top_categories')}</h4>
            <ul className="space-y-4 text-muted font-bold uppercase italic tracking-widest text-xs">
              <li><Link to="/?category=Food%20%26%20Dining" className="hover:text-primary transition-colors">Food & Dining</Link></li>
              <li><Link to="/?category=Groceries%20%26%20Kirana" className="hover:text-primary transition-colors">Groceries & Kirana</Link></li>
              <li><Link to="/?category=Electronics%20%26%20Mobile" className="hover:text-primary transition-colors">Electronics & Mobile</Link></li>
              <li><Link to="/?category=Home%20Services" className="hover:text-primary transition-colors">Home Services</Link></li>
              <li><Link to="/?category=Medical%20%26%20Health" className="hover:text-primary transition-colors">Medical & Health</Link></li>
              <li><Link to="/?category=Real%20Estate" className="hover:text-primary transition-colors">Real Estate</Link></li>
              <li><Link to="/?category=Automobile" className="hover:text-primary transition-colors">Automobile</Link></li>
              <li><Link to="/?category=Education%20%26%20Coaching" className="hover:text-primary transition-colors">Education & Coaching</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-black mb-8 uppercase italic tracking-widest text-white border-b border-white/5 pb-4">{t('contact_us')}</h4>
            <ul className="space-y-6 text-muted font-medium text-sm">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <span className="mt-2">Head Office: Delhi-NCR, India</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                  <Phone size={18} className="text-primary" />
                </div>
                <div className="flex flex-col">
                  <a href={`tel:+91${SYSTEM_CONFIG.contactNumber}`} className="hover:text-primary transition-colors">
                    +91 {SYSTEM_CONFIG.contactNumber}
                  </a>
                  <a href="tel:01141626407" className="hover:text-primary transition-colors text-xs opacity-70">
                    011-41626407 (Landline)
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                  <Mail size={18} className="text-primary" />
                </div>
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=info@indraprasthaonline.co.in" 
                  className="hover:text-primary transition-colors truncate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  info@indraprasthaonline.co.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase italic tracking-[0.3em] text-muted/40">
            <span>© 2025 IndraprasthaOnline</span>
            <span className="w-1 h-1 bg-white/10 rounded-full" />
            <span>{t('footer.made_in_bharat')}</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full group hover:scale-110 transition-all duration-500 overflow-hidden flex items-center justify-center">
              <img 
                src="/moontech-logo.png" 
                alt="MoonTechKnowledge" 
                className="w-full h-full object-cover scale-150"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-sm md:text-base font-black uppercase italic tracking-[0.2em] text-primary/80 hover:text-primary transition-all duration-300 cursor-default">{t('footer.powered_by')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
});
