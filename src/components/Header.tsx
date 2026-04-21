import React, { useState, useEffect } from 'react';
import { Search, MapPin, Store, Menu, User, ShieldCheck, Languages, CheckCircle2, Tag, Zap, X, ChevronRight, LayoutDashboard, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, token, logout, setAuthModalOpen } = useAuth();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCity, setCurrentCity] = useState(localStorage.getItem('city') || 'Delhi-NCR');
  const [hasBusiness, setHasBusiness] = useState(false);

  useEffect(() => {
    if (user?.id) {
      apiService.getBusinessesBySeller().then(data => {
        if (data && data.length > 0) {
          setHasBusiness(true);
        }
      }).catch(err => {
        console.error('Header: Failed to check for business', err);
      });
    }
  }, [user?.id]);

  const popularCities = [
    'Delhi', 'New Delhi', 'Delhi-NCR', 'Gurugram', 'Noida', 'Faridabad', 'Ghaziabad'
  ];

  const handleCitySelect = (city: string) => {
    localStorage.setItem('city', city);
    setCurrentCity(city);
    setIsCityOpen(false);
    setIsSidebarOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      } else if (searchQuery === '') {
        const params = new URLSearchParams(window.location.search);
        if (params.has('search')) {
          navigate('/');
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, navigate]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'mr', name: 'मराठी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'ଓଡ଼ିଆ' },
  ];

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    setIsProfileOpen(false);
    setIsSidebarOpen(false);
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <>
      <header className="bg-[#003399] text-white sticky top-0 z-50 shadow-2xl border-b border-white/5 py-1 md:py-0 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-auto md:h-20 flex items-center justify-between gap-2 md:gap-8">
          
          {/* Hamburger Menu & Logo Group */}
          <div className="flex items-center gap-2 md:gap-6 shrink-0">
            {/* Hamburger Menu Trigger */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 active:scale-90 group"
            >
              <Menu size={20} className="text-primary group-hover:scale-110 transition-transform" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-4 group shrink-0">
                <div className="flex items-center justify-center h-8 w-8 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full overflow-hidden group-hover:scale-110 transition-all duration-500 shadow-lg border border-white/10 shrink-0">
                  <img 
                    src="/logo.png" 
                    alt="Indraprastha Online" 
                    className="w-full h-full object-cover block"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                </div>
              <div className="flex flex-col leading-none min-w-0">
                <div className="flex items-baseline gap-0.5 md:gap-1 tracking-tighter drop-shadow-2xl whitespace-nowrap">
                  <span className="text-primary italic font-black text-xs md:text-xl lg:text-2xl uppercase">इंद्रप्रस्थ</span>
                  <span className="text-[#FFFF00] font-black text-[7px] md:text-base lg:text-lg italic tracking-widest uppercase">ONLINE</span>
                </div>
                <span className="text-[5px] md:text-[8px] lg:text-[10px] italic font-black text-red-500 uppercase tracking-[0.05em] md:tracking-[0.2em] mt-0.5 whitespace-nowrap">BHARAT KA LOCAL BAZAAR</span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Hidden on Mobile, centered on Desktop */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-auto items-center bg-[#0044cc] rounded-2xl overflow-hidden border border-white/10 focus-within:border-white/30 transition-all group shadow-inner"
          >
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder={t('search_placeholder')}
              className="flex-1 px-6 py-3 text-white text-sm font-bold focus:outline-none bg-transparent placeholder:text-muted/50"
            />
            <button type="button" onClick={() => handleSearch()} className="bg-[#003399] px-6 py-3 hover:bg-[#002288] transition-all text-white active:scale-95">
              <Search size={22} />
            </button>
          </form>

          {/* Login / Profile - Right */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {deferredPrompt && (
              <button 
                onClick={handleInstall}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-primary hover:to-primary/80 px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase italic tracking-widest transition-all shadow-xl shadow-red-500/20 border border-white/20 active:scale-95 group animate-pulse"
              >
                <Zap size={16} className="text-yellow-300 group-hover:scale-125 transition-transform" />
                <span className="text-white drop-shadow-md">INSTALL APP</span>
              </button>
            )}
            
            {(!token || !user) ? (
              <button 
                onClick={() => setAuthModalOpen(true, 'buyer')}
                className="flex items-center gap-2 md:gap-3 bg-primary hover:bg-primary/90 px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-xl shadow-primary/20 transition-all transform active:scale-95 group"
              >
                <User size={18} className="text-white group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-xs font-black text-white uppercase italic tracking-widest">{t('login')}</span>
              </button>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-1 md:p-1.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center gap-2 md:gap-3 transition-all group"
                >
                  {user?.picture ? (
                    <img src={user.picture} alt={user.full_name} className="w-8 h-8 md:w-10 md:h-10 rounded-xl border border-white/10 group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-7 h-7 md:w-9 md:h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <User size={16} className="md:w-5 md:h-5" />
                    </div>
                  )}
                  <span className="hidden md:inline text-[10px] font-black uppercase italic tracking-widest pr-2">My Account</span>
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" 
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-4 w-64 bg-surface/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/10 py-6 z-50 overflow-hidden"
                      >
                        <div className="px-6 pb-4 border-b border-white/5 mb-2">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Logged in as</p>
                          <p className="text-xs font-black text-white truncate">{user.email || user.full_name}</p>
                        </div>

                        <Link 
                          to="/buyer-dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-6 py-4 text-xs font-black text-white hover:bg-white/5 transition-all uppercase italic tracking-widest"
                        >
                          <User size={16} className="text-primary" />
                          <span>Profile & Orders</span>
                        </Link>

                        <Link 
                          to={
                            user?.role === 'founder' ? '/founder' : 
                            (user?.role === 'seller' || hasBusiness) ? '/dashboard' : '/onboarding'
                          }
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-4 px-6 py-5 text-xs font-black text-primary hover:bg-white/5 transition-all uppercase italic tracking-widest border-t border-white/5"
                        >
                          <Store size={20} />
                          <div className="flex flex-col leading-tight">
                            <span>Manage Your Business</span>
                            <span className="text-[8px] font-bold text-muted uppercase">Seller Portal</span>
                          </div>
                        </Link>

                        <div className="h-px bg-white/5 my-2" />

                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-6 py-4 text-xs font-black text-red-500 hover:bg-red-500/10 transition-all uppercase italic tracking-widest"
                        >
                          Logout System
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar - Only visible on small screens */}
        <div className="md:hidden px-4 pb-4">
          <form 
            onSubmit={handleSearch}
            className="flex items-center bg-[#0044cc] rounded-2xl overflow-hidden border border-white/10 shadow-inner"
          >
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="flex-1 px-4 py-3 text-white text-xs font-bold focus:outline-none bg-transparent placeholder:text-muted/50"
            />
            <button type="button" onClick={() => handleSearch()} className="bg-[#003399] px-6 py-3 text-white">
              <Search size={20} />
            </button>
          </form>
        </div>
      </header>

      {/* Sidebar Sidebar / Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-surface z-[101] shadow-2xl border-r border-white/10 flex flex-col pt-safe"
            >
              {/* Sidebar Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-primary italic uppercase tracking-tighter">मेन्यू</span>
                  <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Indraprastha Sidebar</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-muted hover:text-white transition-all border border-white/5 hover:border-white/20 active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Sidebar Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-10 scrollbar-hide">
                
                {/* Marketplace Link */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic ml-2">Market Space</h4>
                  <Link 
                    to="/marketplace" 
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center justify-between p-5 bg-white/5 rounded-3xl hover:bg-primary/10 group transition-all border border-white/5 hover:border-primary/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Tag size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white uppercase italic tracking-widest">Marketplace</span>
                        <span className="text-[9px] font-bold text-muted uppercase">Find local businesses</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link 
                    to="/" 
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center justify-between p-5 bg-white/5 rounded-3xl hover:bg-blue-500/10 group transition-all border border-white/5 hover:border-blue-500/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                        <Globe size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white uppercase italic tracking-widest">Browse All</span>
                        <span className="text-[9px] font-bold text-muted uppercase">Explore the bazaar</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* City Selector Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic ml-2">Location & City</h4>
                  <button 
                    onClick={() => setIsCityOpen(!isCityOpen)}
                    className="w-full flex items-center justify-between p-5 bg-[#0044cc]/10 rounded-3xl border border-primary/20 hover:bg-primary/20 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <MapPin size={22} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-muted uppercase">Selected Delivery City</span>
                        <span className="text-xs font-black text-white uppercase italic tracking-widest">{currentCity}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className={`text-primary transition-transform ${isCityOpen ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {isCityOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="grid grid-cols-2 gap-2 mt-2"
                    >
                      {popularCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleCitySelect(city)}
                          className={`text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase italic tracking-widest transition-all ${
                            currentCity === city 
                              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                              : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Language Switcher Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic ml-2">Language Setting</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`p-4 rounded-2xl text-[10px] font-black uppercase italic tracking-widest transition-all border ${
                          i18n.language === lang.code 
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105 z-10' 
                            : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manage BusinessPortal - Shortcut */}
                {user && (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic ml-2">Partner Portal</h4>
                    <Link 
                      to={
                        user?.role === 'founder' ? '/founder' : 
                        (user?.role === 'seller' || hasBusiness) ? '/dashboard' : '/onboarding'
                      }
                      onClick={() => setIsSidebarOpen(false)}
                      className="w-full flex items-center gap-5 p-6 bg-primary/10 border border-primary/30 rounded-[2.5rem] group hover:bg-primary/20 transition-all shadow-xl shadow-primary/5"
                    >
                      <div className="w-14 h-14 bg-primary/20 rounded-3xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Store size={28} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white uppercase italic tracking-widest">Business Portal</span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Growth & Analytics</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-8 border-t border-white/5 bg-black/40">
                <div className="flex items-center gap-4 text-muted mb-4">
                  <ShieldCheck size={18} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em]">Verified Secure Platform</span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black text-muted/30 uppercase tracking-[0.3em]">© 2026 Indraprastha Online</p>
                  <p className="text-[8px] font-bold text-muted/20 uppercase">Powered by Antigravity OS</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
