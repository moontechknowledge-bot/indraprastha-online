import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Plus, MapPin, Phone, Clock, Loader2, Package, Crown, ShieldCheck, QrCode, Upload, X, CheckCircle2, MessageSquare, Zap } from 'lucide-react';
import { Business } from '../../types';
import { apiService } from '../../services/apiService';
import { motion, AnimatePresence } from 'motion/react';

const MyBusinesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgradingId, setUpgradingId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const navigate = useNavigate();

  const [debugInfo, setDebugInfo] = useState<string>('');

  const fetchMyBusinesses = async (force = false) => {
    console.log('MyBusinesses: fetchMyBusinesses started', { force });
    setLoading(true);
    setError(null);
    
    try {
      console.log('MyBusinesses: Calling apiService.getBusinessesBySeller()');
      const data = await apiService.getBusinessesBySeller(force);
      console.log('MyBusinesses: Data received:', data);
      setBusinesses(data);
    } catch (err: any) {
      console.error('MyBusinesses: Error fetching businesses:', err);
      setError(err.message || 'Failed to load businesses. Please try again.');
    } finally {
      console.log('MyBusinesses: Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBusinesses();
    
    // Auto-stop loading after 15 seconds as a fallback
    const timer = setTimeout(() => {
      setLoading(prev => {
        if (prev) {
          console.warn('MyBusinesses: Loading timed out, forcing stop');
          return false;
        }
        return prev;
      });
    }, 15000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleUpgradeClick = (business: Business) => {
    if (business.payment_status === 'SUCCESS') {
      return;
    }
    setSelectedBusiness(business);
    setPromoCode('');
    setIsPromoApplied(false);
    setShowPaymentModal(true);
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'BHARAT1000' || promoCode.toUpperCase() === 'FIRST1000') {
      setIsPromoApplied(true);
    } else {
      alert('Invalid Promo Code');
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness) return;

    setSubmitting(true);
    try {
      // Use the provided screenshot URL (from demo) or a default one
      const finalScreenshotUrl = screenshotUrl || 'https://picsum.photos/seed/receipt/800/1200';
      
      await apiService.submitPayment(selectedBusiness.id!, finalScreenshotUrl);
      
      alert('Payment submitted successfully! Our team will verify it within 3 hours.');
      setShowPaymentModal(false);
      setScreenshotUrl('');
      setSelectedBusiness(null);
      
      // Refresh businesses to show pending status if needed
      fetchMyBusinesses(true);
    } catch (err: any) {
      console.error('Failed to submit payment:', err);
      alert(err.message || 'Failed to submit payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForceReload = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  const handleSeedDemoData = async () => {
    setLoading(true);
    try {
      await apiService.seedDemoData();
      await fetchMyBusinesses(true);
    } catch (err: any) {
      setError(err.message || 'Failed to seed demo data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-white">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-white font-black uppercase italic tracking-widest">Loading Businesses</p>
          <p className="text-muted text-xs font-bold uppercase tracking-widest animate-pulse">Connecting to system...</p>
        </div>
        
        <button 
          onClick={handleForceReload}
          className="mt-8 text-[10px] text-muted hover:text-white underline uppercase tracking-widest font-black"
        >
          Force Reload App
        </button>
      </div>
    );
  }

  if (error && businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-6 text-white">
        <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center mb-4 border border-red-500/20 shadow-2xl shadow-red-500/10">
          <ShieldCheck className="text-red-400" size={40} />
        </div>
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">System Error</h3>
        <p className="text-muted max-w-xs mx-auto font-medium">{error}</p>
        
        <div className="flex flex-col gap-4 items-center mt-8">
          <div className="flex gap-4">
            <button 
              onClick={() => fetchMyBusinesses(true)}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 active:scale-95"
            >
              Retry Connection
            </button>
            <button 
              onClick={() => {
                setError(null);
                setLoading(false);
              }}
              className="bg-surface text-muted px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-white/5 hover:text-white border border-border transition-all active:scale-95"
            >
              Skip
            </button>
          </div>

          <button 
            onClick={handleForceReload}
            className="text-[10px] text-muted hover:text-white underline uppercase tracking-widest font-black"
          >
            Force Reload App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">My Businesses</h1>
          <p className="text-muted font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            Manage and monitor your business listings
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => fetchMyBusinesses(true)}
            className="w-12 h-12 bg-surface/40 backdrop-blur-md border border-white/5 text-muted hover:text-primary hover:bg-primary/10 rounded-2xl transition-all flex items-center justify-center shadow-xl"
            title="Refresh"
          >
            <Loader2 size={22} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => navigate('/onboarding')}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-wider flex items-center gap-3 hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95"
          >
            <Plus size={20} />
            Add Business
          </button>
        </div>
      </div>

      {businesses.length === 0 ? (
        <div className="bg-surface/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-white/5 p-20 text-center shadow-2xl">
          <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
            <Store className="text-muted/30" size={48} />
          </div>
          <h3 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tight">No businesses yet</h3>
          <p className="text-muted mb-10 max-w-sm mx-auto font-medium">
            You haven't added any businesses to your account yet. Start listing your services today and reach more customers!
          </p>
          <button 
            onClick={() => navigate('/onboarding')}
            className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase italic tracking-widest hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95"
          >
            Add Your First Business
          </button>

          <div className="mt-12 pt-12 border-t border-white/5">
            <p className="text-muted text-xs font-bold uppercase tracking-[0.2em] mb-6 italic">Testing the dashboard?</p>
            <button 
              onClick={handleSeedDemoData}
              disabled={loading}
              className="text-[10px] font-black uppercase tracking-widest bg-white/5 text-muted px-8 py-4 rounded-xl hover:bg-white/10 hover:text-white border border-white/5 transition-all flex items-center gap-3 mx-auto disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} className="text-yellow-500" />}
              Seed Demo Businesses
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((business) => (
            <div 
              key={business.id}
              className={`group bg-surface/40 backdrop-blur-md rounded-[2.5rem] border transition-all duration-500 overflow-hidden shadow-2xl hover:scale-[1.02] ${
                business.plan_type === 'prime' ? 'border-primary/50 ring-1 ring-primary/20' : 'border-white/5'
              }`}
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${
                    business.plan_type === 'prime' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted'
                  }`}>
                    {business.plan_type === 'prime' ? <Crown size={32} /> : <Store size={32} />}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${
                      business.status === 'approved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : business.status === 'rejected'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {business.status || 'pending'}
                    </span>
                    {business.plan_type === 'prime' && (
                      <span className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 shadow-lg shadow-primary/20">
                        <ShieldCheck size={12} />
                        PRIME
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-black text-white text-2xl tracking-tighter group-hover:text-primary transition-colors flex items-center gap-3 uppercase italic">
                    {business.name}
                    {business.is_verified && <ShieldCheck size={20} className="text-blue-400" />}
                  </h3>
                  <div className="flex items-center gap-2 text-muted font-bold text-xs uppercase tracking-widest">
                    <MapPin size={14} className="text-primary/50" />
                    <span>{business.city}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2 text-muted group-hover:text-white transition-colors">
                    <Phone size={14} className="text-primary/50" />
                    <span>{business.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted/40">
                    <Clock size={14} />
                    <span>{new Date(business.created_at!).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 p-6 flex flex-col gap-3 border-t border-white/5">
                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(business.slug ? `/${business.slug}` : `/business/${business.id}`)}
                    className="flex-1 bg-white/5 border border-white/10 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                  >
                    View Page
                  </button>
                  <button 
                    onClick={() => navigate(`/dashboard/business/${business.id}/edit`)}
                    className="flex-1 bg-white/5 border border-white/10 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                  >
                    Edit
                  </button>
                </div>
                
                {business.plan_type !== 'prime' && (
                  <button 
                    onClick={() => handleUpgradeClick(business)}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 active:scale-95 group/btn"
                  >
                    <Crown size={16} className="group-hover/btn:rotate-12 transition-transform" />
                    Upgrade to PRIME {isPromoApplied ? '₹1499' : '₹14,999'}
                  </button>
                )}

                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/dashboard/products/${business.id}`)}
                    className="flex-1 bg-primary/10 border border-primary/20 text-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Package size={16} />
                    Products
                  </button>
                  <button 
                    onClick={() => navigate(`/dashboard/leads?business_id=${business.id}`)}
                    className="flex-1 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <MessageSquare size={16} />
                    Leads
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-border"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Upgrade to PRIME</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6 text-center">
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-1">
                    <h4 className="text-3xl font-black text-white italic tracking-tighter">
                      Scan & Pay ₹{isPromoApplied ? (selectedBusiness?.plan_type === 'showroom' ? '499' : '1499') : (selectedBusiness?.plan_type === 'showroom' ? '4,999' : '14,999')}
                    </h4>
                    {!isPromoApplied && (
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        Use Promo Code for 90% OFF
                      </p>
                    )}
                  </div>
                  <p className="text-muted text-xs font-medium">Scan this QR and complete payment to activate {selectedBusiness?.plan_type === 'showroom' ? 'SHOWROOM' : 'PRIME'}</p>
                </div>

                {/* Promo Code Input */}
                {!isPromoApplied ? (
                  <div className="flex gap-2 p-2 bg-black/20 rounded-2xl border border-white/5">
                    <input 
                      type="text" 
                      placeholder="Enter Promo Code"
                      className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm font-bold uppercase tracking-widest placeholder:text-muted/30"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button 
                      onClick={applyPromoCode}
                      className="bg-primary text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Promo Applied</p>
                        <p className="text-xs font-bold text-white">90% Discount Applied</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsPromoApplied(false)}
                      className="text-[10px] font-black text-muted hover:text-white uppercase tracking-widest"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-[2.5rem] border border-white/5 shadow-inner">
                  <div className="bg-white p-4 rounded-3xl shadow-2xl mb-6">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=8505897985@okbizaxis&pn=Indraprastha Online&am=${isPromoApplied ? (selectedBusiness?.plan_type === 'showroom' ? '499' : '1499') : (selectedBusiness?.plan_type === 'showroom' ? '4999' : '14999')}&cu=INR`)}`}
                      alt="Payment QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <div className="bg-surface/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
                    <p className="text-xs font-black text-white tracking-[0.2em]">8505897985@okbizaxis</p>
                  </div>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-6 text-left">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-muted ml-1 flex items-center gap-2">
                      <Upload size={18} className="text-primary" />
                      Upload Payment Screenshot
                    </label>
                    <div className="relative group">
                      <input 
                        type="file"
                        required
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            // In a real app, we would upload to S3/Cloudinary here
                            // For now, we'll use a placeholder URL to simulate success
                            setScreenshotUrl('https://picsum.photos/seed/payment/800/1200');
                          }
                        }}
                        className="w-full px-4 py-4 bg-background border-2 border-border rounded-2xl font-bold text-sm focus:border-primary outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer text-muted"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/10 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={20} />
                    )}
                    {submitting ? 'Submitting...' : 'Submit Payment'}
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      setScreenshotUrl('https://picsum.photos/seed/demo/800/1200');
                      const form = document.querySelector('form');
                      if (form) form.requestSubmit();
                    }}
                    disabled={submitting}
                    className="w-full bg-white/5 text-muted py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                  >
                    Test with Dummy Payment (Demo)
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBusinesses;

