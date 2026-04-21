import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Store, ShieldCheck, Zap, Globe, Clock, ArrowRight, CheckCircle2, Star, ShoppingBag, Smartphone, GraduationCap, Home, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const HeroBanner: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const handleCtaClick = (slide: any) => {
    if (slide.id === 'slide1') {
      navigate('/gau-seva');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isSeller = user.role === 'seller' || user.role === 'founder';

    if (slide.type === 'contact' || slide.type === 'promo') {
      navigate(isSeller ? '/dashboard' : '/onboarding');
      return;
    }

    // For category slides
    if (slide.id === 'slide5') {
      navigate('/?category=Fashion%20%26%20Lifestyle');
    } else if (slide.id === 'slide6') {
      navigate('/?category=Electronics%20%26%20Mobile');
    } else if (slide.id === 'slide7') {
      navigate('/?category=Education%20%26%20Coaching');
    } else if (slide.id === 'slide8') {
      navigate('/?category=Real%20Estate');
    } else {
      navigate(isSeller ? '/dashboard' : '/onboarding');
    }
  };

  const slides = [
    {
      id: 'slide1',
      type: 'standard',
      title: t('hero.slide1.title'),
      subtitle: t('hero.slide1.subtitle'),
      cta: t('hero.slide1.cta'),
      icon: <Heart className="w-16 h-16 text-red-500" />,
      bg: "bg-gradient-to-br from-orange-400 via-yellow-600 to-black",
      image: "https://ais-pre-loatzuep5rbi22z43jwltm-415967612205.asia-southeast1.run.app/attachment/733857e4-98ae-443b-828e-57b8565a415a",
      accent: "text-white"
    },
    {
      id: 'slide2',
      type: 'standard',
      title: t('hero.slide2.title'),
      subtitle: t('hero.slide2.subtitle'),
      cta: t('hero.slide2.cta'),
      icon: <Store className="w-16 h-16 text-orange-500" />,
      bg: "bg-gradient-to-br from-blue-900 via-blue-800 to-black",
      image: "https://ais-pre-loatzuep5rbi22z43jwltm-415967612205.asia-southeast1.run.app/attachment/0f89831f-998d-473d-8153-066378f8885c",
      accent: "text-white"
    },
    {
      id: 'slide3',
      type: 'contact',
      title: t('hero.slide3.title'),
      subtitle: t('hero.slide3.subtitle'),
      phone: "8505897985",
      email: "info@indraprasthaonline.co.in",
      website: "indraprasthaonline.co.in",
      poweredBy: "Powered by moontechknowledge",
      cta: t('hero.slide3.cta'),
      icon: <Zap className="w-16 h-16 text-white" />,
      bg: "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2923216?q=60&w=1200&auto=format&fit=crop&fm=webp",
      accent: "text-white"
    },
    {
      id: 'slide4',
      type: 'promo',
      title: t('hero.slide4.title'),
      price: "₹1,499/-",
      originalPrice: "₹14,999",
      subtitle: t('hero.slide4.subtitle'),
      features: [
        "Priority Listing (Top of Search)",
        "Blue Tick Verified Badge",
        "Founding Member Badge",
        "Social Media Integration (YT, IG, FB Ads)",
        "Video Promo Maker Access",
        "Digital Visiting Card",
        "24/7 Priority Support (Chat/Call/WA)"
      ],
      footer: "To der kis baat ki? Mobile uthaiye aur boliye 'Bharat Ka Local Bazar'!",
      cta: t('hero.slide4.cta'),
      icon: <Star className="w-16 h-16 text-yellow-400" />,
      bg: "bg-gradient-to-br from-orange-600 via-red-700 to-black",
      image: "https://images.unsplash.com/photo-1556740734-7f96267b118a?q=60&w=1200&auto=format&fit=crop&fm=webp",
      accent: "text-white"
    },
    {
      id: 'slide5',
      type: 'standard',
      title: t('hero.slide5.title'),
      subtitle: t('hero.slide5.subtitle'),
      cta: t('hero.slide5.cta'),
      icon: <ShoppingBag className="w-16 h-16 text-white" />,
      bg: "bg-gradient-to-br from-pink-600 via-purple-700 to-black",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=60&w=1200&auto=format&fit=crop&fm=webp",
      accent: "text-white"
    },
    {
      id: 'slide6',
      type: 'standard',
      title: t('hero.slide6.title'),
      subtitle: t('hero.slide6.subtitle'),
      cta: t('hero.slide6.cta'),
      icon: <Smartphone className="w-16 h-16 text-white" />,
      bg: "bg-gradient-to-br from-blue-600 via-indigo-700 to-black",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=60&w=1200&auto=format&fit=crop&fm=webp",
      accent: "text-white"
    },
    {
      id: 'slide7',
      type: 'standard',
      title: t('hero.slide7.title'),
      subtitle: t('hero.slide7.subtitle'),
      cta: t('hero.slide7.cta'),
      icon: <GraduationCap className="w-16 h-16 text-white" />,
      bg: "bg-gradient-to-br from-emerald-600 via-teal-700 to-black",
      image: "https://images.unsplash.com/photo-1523050335456-c38730b0ebf4?q=60&w=1200&auto=format&fit=crop&fm=webp",
      accent: "text-white"
    },
    {
      id: 'slide8',
      type: 'standard',
      title: t('hero.slide8.title'),
      subtitle: t('hero.slide8.subtitle'),
      cta: t('hero.slide8.cta'),
      icon: <Home className="w-16 h-16 text-white" />,
      bg: "bg-gradient-to-br from-amber-600 via-orange-700 to-black",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=60&w=1200&auto=format&fit=crop&fm=webp",
      accent: "text-white"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000); // Increased time for reading the promo slide
    
    // Preload next image
    const nextIndex = (current + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
    
    return () => clearInterval(timer);
  }, [current, slides.length]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-2 md:py-6 overflow-hidden">
      <div className="relative h-[420px] md:h-[520px] rounded-[2rem] overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "linear" }}
            className={`absolute inset-0 flex items-center p-6 md:p-12 ${slides[current].bg}`}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src={slides[current].image} 
                alt="" 
                className="w-full h-full object-cover opacity-20"
                referrerPolicy="no-referrer"
                loading={current === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            </div>

            <div className="flex-1 z-10 h-full flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4 md:mb-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-black/30 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-2xl border border-white/10 w-fit">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#FF6600] italic font-black text-lg md:text-2xl uppercase">इंद्रप्रस्थ</span>
                    <span className="text-[#FFFF00] font-black text-sm md:text-lg italic tracking-widest">ONLINE</span>
                  </div>
                  <div className="hidden sm:block w-px h-4 bg-white/20" />
                  <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#FF0000] whitespace-nowrap">
                    BHARAT KA LOCAL BAZAAR
                  </div>
                </div>
              </motion.div>

              {slides[current].type === 'contact' ? (
                <div className="flex flex-col gap-4">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight"
                  >
                    {slides[current].title}
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl text-orange-100 font-medium"
                  >
                    {slides[current].subtitle}
                  </motion.p>

                  <div className="flex flex-col gap-3 mt-4">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-4 text-white text-lg md:text-xl font-bold"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      Call: {slides[current].phone}
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-4 text-white text-lg md:text-xl font-bold"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      {slides[current].website}
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-orange-200/80 text-lg font-black italic uppercase tracking-widest mt-6"
                    >
                      {slides[current].poweredBy}
                    </motion.div>
                  </div>
                </div>
              ) : slides[current].type === 'promo' ? (
                <div className="flex flex-col gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-baseline gap-3 mb-2"
                  >
                    <span className="text-5xl md:text-7xl font-black text-white tracking-tighter">{slides[current].price}</span>
                    <span className="text-xl md:text-2xl text-white/50 line-through font-light">Original: {slides[current].originalPrice}</span>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-4xl font-bold text-primary mb-2"
                  >
                    {slides[current].title}
                  </motion.h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-6">
                    {slides[current].features?.map((feature, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (idx * 0.05) }}
                        className="flex items-center gap-2 text-white/90 text-sm md:text-base font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {feature}
                      </motion.div>
                    ))}
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-orange-200 font-serif italic text-lg md:text-xl mb-6 max-w-2xl"
                  >
                    "{slides[current].footer}"
                  </motion.p>
                </div>
              ) : (
                <>
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-[1.1] tracking-tighter"
                  >
                    {slides[current].title}
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mb-10 leading-relaxed"
                  >
                    {slides[current].subtitle}
                  </motion.p>
                </>
              )}
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCtaClick(slides[current])}
                className="bg-white text-gray-900 px-10 py-4 rounded-full font-black text-lg shadow-xl transition-all flex items-center gap-3 group w-fit allow-guest-click"
              >
                {slides[current].cta}
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </div>
            
            <div className="hidden lg:flex flex-1 justify-center items-center relative">
              <motion.div
                initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                className="bg-white/10 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/20 shadow-2xl w-[160px] h-[160px] flex items-center justify-center"
              >
                {slides[current].icon}
              </motion.div>
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/5 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute bottom-10 right-10 flex gap-4 z-20">
          <button 
            onClick={prev}
            className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/40 transition-all shadow-xl border border-white/30 active:scale-90 text-white allow-guest-click"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={next}
            className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/40 transition-all shadow-xl border border-white/30 active:scale-90 text-white allow-guest-click"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-10 left-10 flex gap-3 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-3 rounded-full transition-all duration-500 allow-guest-click ${current === i ? 'w-16 bg-white' : 'w-3 bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
