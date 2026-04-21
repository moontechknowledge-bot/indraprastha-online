import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Store, Phone, MapPin, Info, Image as ImageIcon, Save, ArrowLeft, Loader2, Tag, MessageCircle, Crown, User, Clock, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { apiService } from '../../services/apiService';
import { Category } from '../../types';
import { useAuth } from '../../context/AuthContext';

import ImageUpload from '../../components/ImageUpload';
import MultiImageUpload from '../../components/MultiImageUpload';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'retail', name: 'Groceries & Kirana', slug: 'retail', icon: 'ShoppingBag', order_index: 1, is_active: true },
  { id: 'food', name: 'Food & Dining', slug: 'food', icon: 'Utensils', order_index: 2, is_active: true },
  { id: 'electronics', name: 'Electronics & Mobile', slug: 'electronics', icon: 'Smartphone', order_index: 3, is_active: true },
  { id: 'services', name: 'Home Services', slug: 'services', icon: 'Wrench', order_index: 4, is_active: true },
  { id: 'health', name: 'Medical & Health', slug: 'health', icon: 'Stethoscope', order_index: 5, is_active: true },
  { id: 'education', name: 'Education & Coaching', slug: 'education', icon: 'GraduationCap', order_index: 6, is_active: true },
  { id: 'automotive', name: 'Automobile', slug: 'automotive', icon: 'Car', order_index: 7, is_active: true },
  { id: 'realestate', name: 'Real Estate', slug: 'realestate', icon: 'Home', order_index: 8, is_active: true }
];

const AddBusiness: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get plan and promo from URL query params
  const queryParams = new URLSearchParams(location.search);
  const initialPlan = queryParams.get('plan') as 'free' | 'showroom' | 'prime' || 'free';
  const initialPromo = queryParams.get('promo') === 'true';

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    phone: '',
    city: '',
    description: '',
    whatsapp: '',
    address: '',
    state: '',
    pincode: '',
    image_url: '',
    seller_email: '',
    map_url: '',
    opening_time: '09:00',
    closing_time: '21:00',
    images: [] as string[],
    plan_type: initialPlan
  });

  const [promoCode, setPromoCode] = useState(initialPromo ? 'FIRST1000' : '');
  const [isPromoApplied, setIsPromoApplied] = useState(initialPromo);

  const [links, setLinks] = useState({
    website: '',
    instagram: '',
    facebook: '',
    youtube: ''
  });

  const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    'retail': 'Best quality groceries and daily essentials available at competitive prices. We ensure fresh stock and friendly service.',
    'food': 'Delicious and authentic food prepared with fresh ingredients. Visit us for a great dining experience or order for home delivery.',
    'electronics': 'Latest mobile phones, gadgets, and electronic accessories. We provide genuine products with warranty and excellent after-sales support.',
    'services': 'Professional home repair and maintenance services. Our experienced technicians ensure quality work for all your household needs.',
    'health': 'Dedicated healthcare services and quality medicines. Your health and well-being are our top priority.',
    'education': 'Quality education and coaching for students. We focus on conceptual clarity and success in competitive exams.',
    'automotive': 'Complete automobile care and maintenance. From routine service to major repairs, we keep your vehicle running smoothly.',
    'realestate': 'Find your dream home or the perfect commercial space. We provide expert guidance for all your real estate needs.'
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const fetchCategories = async (force: boolean = false) => {
    setCategoriesLoading(true);
    setError(null);
    try {
      console.log('AddBusiness: Fetching categories...', { force });
      const data = await apiService.getCategories(force);
      console.log('AddBusiness: Categories fetched:', data.length);
      setCategories(data);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to load categories. Please check your internet or reload.');
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-write description when category changes
      if (name === 'category_id' && value) {
        const selectedCategory = categories.find(c => c.id === value);
        if (selectedCategory) {
          const categoryKey = selectedCategory.name.toLowerCase().replace(/[^a-z]/g, '');
          // Only auto-write if description is empty or looks like a placeholder
          if (!prev.description || prev.description.length < 5) {
            // Find a match in our descriptions map
            for (const key in CATEGORY_DESCRIPTIONS) {
              if (categoryKey.includes(key) || key.includes(categoryKey)) {
                newData.description = CATEGORY_DESCRIPTIONS[key];
                break;
              }
            }
          }
        }
      }
      
      return newData;
    });
  };

  const [showSuccess, setShowSuccess] = useState(false);
  const [createdBusiness, setCreatedBusiness] = useState<any>(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'BHARAT1000' || promoCode.toUpperCase() === 'FIRST1000') {
      setIsPromoApplied(true);
    } else {
      alert('Invalid Promo Code');
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    
    // Pre-warm DB to avoid cold start issues during submission
    console.log('AddBusiness: Pre-warming database...');
    fetch('/api/health').catch(() => {});

    // Catch any unexpected global errors
    const handleError = (event: ErrorEvent) => {
      console.error('AddBusiness: Global Error captured:', event.error);
      if (event.error?.message?.includes('WebSocket')) return; // Ignore vite HMR errors
      setError(`Critical Error: ${event.error?.message || 'Unknown. Please hard reload.'}`);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitStatus(null);

    // Validation
    if (!formData.name || !formData.phone || !formData.city || !formData.category_id) {
      setError('Please fill in all required fields (Business Name, Category, Phone, and City).');
      return;
    }

    if (!user) {
      setError('You must be logged in to add a business.');
      navigate('/auth');
      return;
    }

    setLoading(true);
    setIsSubmitting(true);
    setSubmitStatus('Preparing registration...');

    const startTime = Date.now();
    let isTimedOut = false;
    
    // Status update timer
    const statusTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      if (elapsed > 40) setSubmitStatus('Almost there... Setting up your portal.');
      else if (elapsed > 20) setSubmitStatus('Finalizing business details...');
      else if (elapsed > 5) setSubmitStatus('Communicating with server...');
    }, 5000);

    // Force timeout after 100 seconds
    const submissionTimeout = setTimeout(() => {
      if (loading) {
        isTimedOut = true;
        setLoading(false);
        setIsSubmitting(false);
        clearInterval(statusTimer);
        setError('Registration is taking longer than expected. Please check "My Businesses" to see if it was created, or try again.');
        setSubmitStatus(null);
      }
    }, 100000);

    try {
      console.log('AddBusiness: Submitting data:', { ...formData, seller_id: user.id });
      
      const newBusiness = await apiService.createBusiness({
        ...formData,
        seller_id: user.id,
        seller_email: user.role === 'founder' ? formData.seller_email : undefined
      });

      if (isTimedOut) return;
      clearTimeout(submissionTimeout);
      console.log('AddBusiness: Success!', newBusiness.id);
      clearInterval(statusTimer);
      setSubmitStatus('Registration Successful!');

      // Clear caches
      apiService.clearSellerCache();
      if (apiService.clearCache) apiService.clearCache();

      // Background link creation
      const hasLinks = Object.values(links).some(link => typeof link === 'string' && link.length > 0);
      if (hasLinks) {
        apiService.upsertBusinessLinks({ ...links, business_id: newBusiness.id })
          .catch(err => console.error('AddBusiness: Link update background failed:', err));
      }

      setCreatedBusiness(newBusiness);
      setShowSuccess(true);
      
      if (formData.plan_type === 'free') {
        setTimeout(() => {
          window.location.href = '/dashboard/my-businesses';
        }, 2000);
      }
    } catch (err: any) {
      if (isTimedOut) return;
      clearTimeout(submissionTimeout);
      clearInterval(statusTimer);
      const msg = err.message || 'Registration failed. Server might be under heavy load.';
      console.error('AddBusiness: Fatal Error:', err);
      setError(msg);
      setSubmitStatus(null);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdBusiness?.id) return;

    setSubmittingPayment(true);
    try {
      const finalUrl = screenshotUrl || 'https://picsum.photos/seed/receipt/800/1200';
      await apiService.submitPayment(createdBusiness.id, finalUrl);
      setPaymentSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Failed to submit payment screenshot');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const [paymentStep, setPaymentStep] = useState<'promo' | 'qr'>('promo');

  if (showSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface/40 backdrop-blur-md p-10 rounded-[3rem] border border-white/5 shadow-2xl max-w-lg w-full text-center space-y-8"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
            <CheckCircle2 size={40} />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Registration Successful!</h2>
            <p className="text-muted font-medium">
              {formData.plan_type === 'free' 
                ? 'Your business has been sent for approval. It will be live soon!' 
                : 'Your business is registered. Final step: Activate your plan.'}
            </p>
          </div>

          {formData.plan_type !== 'free' && !paymentSubmitted && (
            <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 space-y-6">
              {paymentStep === 'promo' && !isPromoApplied ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-primary uppercase tracking-widest leading-relaxed">Wait! Do you have a Promo Code?</p>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Get 90% discount with a valid code</p>
                  </div>
                  <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/5">
                    <input 
                      type="text" 
                      placeholder="Enter Code"
                      className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-xs font-bold uppercase tracking-widest placeholder:text-muted/30"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button 
                      onClick={() => {
                        applyPromoCode();
                        if (promoCode.toUpperCase() === 'BHARAT1000' || promoCode.toUpperCase() === 'FIRST1000') {
                          setPaymentStep('qr');
                        }
                      }}
                      className="bg-primary text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  <button 
                    onClick={() => setPaymentStep('qr')}
                    className="text-[9px] text-muted font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
                  >
                    Continue without Promo Code
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-primary uppercase tracking-widest">
                      Scan to Pay ₹{isPromoApplied ? (formData.plan_type === 'prime' ? '1,499' : '499') : (formData.plan_type === 'prime' ? '14,999' : '4,999')}
                    </p>
                    {isPromoApplied && (
                      <div className="flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 py-1 rounded-full border border-emerald-500/20">
                        <Zap size={10} fill="currentColor" />
                        <span className="text-[9px] font-black uppercase tracking-widest">90% Discount Applied!</span>
                      </div>
                    )}
                  </div>

                  <div className="aspect-square w-48 mx-auto bg-white p-4 rounded-3xl shadow-2xl">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=8505897985@okbizaxis&pn=Indraprastha Online&am=${isPromoApplied ? (formData.plan_type === 'prime' ? '1499' : '499') : (formData.plan_type === 'prime' ? '14999' : '4999')}&cu=INR`)}`}
                      alt="Payment QR Code" 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Upload Payment Screenshot</label>
                      <input 
                        type="file" 
                        required
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setScreenshotUrl('https://picsum.photos/seed/payment/800/1200');
                          }
                        }}
                        className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs font-bold text-muted file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-primary/10 file:text-primary"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={submittingPayment}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase italic tracking-widest text-xs shadow-xl shadow-primary/20 disabled:opacity-50"
                    >
                      {submittingPayment ? 'Submitting...' : 'Submit Screenshot'}
                    </button>
                  </form>

                  <div className="space-y-2">
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed">UPI ID: <span className="text-primary font-black">8505897985@okbizaxis</span></p>
                    {!isPromoApplied && (
                      <button onClick={() => setPaymentStep('promo')} className="text-[9px] text-primary/70 font-black uppercase tracking-widest hover:text-primary underline">Have a promo code?</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {paymentSubmitted && (
            <div className="p-8 bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/20 space-y-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Payment Submitted!</h3>
                <p className="text-xs text-muted font-medium">We are verifying your payment. Your business will be active soon.</p>
              </div>
            </div>
          )}

          <button 
            onClick={() => navigate('/dashboard/my-businesses')}
            className="w-full bg-white/5 text-white py-4 rounded-2xl font-black uppercase italic tracking-widest text-xs border border-white/10 hover:bg-white/10 transition-all"
          >
            Go to My Businesses
          </button>
        </motion.div>
      </div>
    );
  }

  const fillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      name: 'Sample Business ' + Math.floor(Math.random() * 1000),
      category_id: categories[0]?.id || '',
      phone: '9876543210',
      city: 'Delhi',
      description: 'This is a sample business for testing.',
      whatsapp: '9876543210',
      address: '123, Sample Street',
      state: 'Delhi',
      pincode: '110001',
      image_url: '',
      map_url: 'https://maps.google.com'
    }));
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase();
    if (code === 'BHARAT1000' || code === 'FIRST1000') {
      setIsPromoApplied(true);
    } else {
      setIsPromoApplied(false);
    }
  };

  return (
    <div className="space-y-10 text-white relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-12 h-12 bg-surface/40 backdrop-blur-md border border-white/5 text-muted hover:text-primary hover:bg-primary/10 rounded-2xl transition-all flex items-center justify-center shadow-xl group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-primary tracking-tighter uppercase italic">Add Business</h2>
            <p className="text-muted font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Register your business on Indraprastha
            </p>
          </div>
        </div>
        
        <button 
          onClick={fillSampleData}
          className="text-[10px] font-black uppercase tracking-widest bg-white/5 text-muted px-6 py-3 rounded-xl hover:bg-white/10 hover:text-white border border-white/5 transition-all shadow-xl"
        >
          Fill Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative">
        <div className="p-10 space-y-10">
          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-bold flex flex-col gap-4 animate-shake">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {error}
              </div>
              <button 
                type="button"
                onClick={() => window.location.reload()}
                className="bg-red-500/20 text-red-500 py-2 px-4 rounded-xl text-xs hover:bg-red-500/30 transition-all border border-red-500/20 uppercase tracking-widest"
              >
                Hard Reload Page
              </button>
            </div>
          )}

          {/* Required Fields Section */}
          <div className="space-y-8">
            
            {user?.role === 'founder' && (
              <div className="p-8 bg-primary/5 border border-primary/20 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <Crown size={20} className="text-primary" />
                  <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Founder Action: Assign Seller</h4>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User size={14} className="text-primary/50" />
                    Seller Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="seller_email"
                    placeholder="Enter user email to add business for them"
                    className="w-full px-6 py-4 rounded-2xl border border-primary/20 focus:border-primary outline-none transition-all bg-black/40 text-white font-bold placeholder:text-muted/30"
                    value={formData.seller_email}
                    onChange={handleChange}
                  />
                  <p className="text-[9px] text-muted/60 font-bold uppercase tracking-widest ml-1">
                    If provided, this business will be owned by the user with this email. They must have logged in at least once.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Store size={14} className="text-primary/50" />
                  Business Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Sharma General Store"
                  className="w-full px-6 py-4 rounded-2xl border border-white/5 focus:border-primary/50 outline-none transition-all bg-black/20 text-white font-bold placeholder:text-muted/30"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Tag size={14} className="text-primary/50" />
                  Category *
                </label>
                <div className="relative">
                  <select
                    name="category_id"
                    required
                    className="w-full px-6 py-4 rounded-2xl border border-white/5 focus:border-primary/50 outline-none transition-all bg-black/20 text-white font-bold appearance-none cursor-pointer"
                    value={formData.category_id}
                    onChange={handleChange}
                  >
                    <option value="" className="bg-surface">
                      Select Category
                    </option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-surface">{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                    {categoriesLoading && categories.length === 0 ? (
                      <Loader2 size={16} className="animate-spin text-primary" />
                    ) : (
                      <ChevronRight size={16} className="rotate-90" />
                    )}
                  </div>
                </div>
                {error && error.toLowerCase().includes('category') && (
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest">{error}</p>
                    <button 
                      type="button"
                      onClick={() => fetchCategories(true)}
                      className="text-[9px] text-primary font-black uppercase tracking-widest hover:underline"
                    >
                      Retry Loading
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Clock size={14} className="text-primary/50" />
                  Opening Time *
                </label>
                <input
                  type="time"
                  name="opening_time"
                  required
                  className="w-full px-6 py-4 rounded-2xl border border-white/5 focus:border-primary/50 outline-none transition-all bg-black/20 text-white font-bold"
                  value={formData.opening_time}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Clock size={14} className="text-primary/50" />
                  Closing Time *
                </label>
                <input
                  type="time"
                  name="closing_time"
                  required
                  className="w-full px-6 py-4 rounded-2xl border border-white/5 focus:border-primary/50 outline-none transition-all bg-black/20 text-white font-bold"
                  value={formData.closing_time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Phone size={14} className="text-primary/50" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 9876543210"
                  className="w-full px-6 py-4 rounded-2xl border border-white/5 focus:border-primary/50 outline-none transition-all bg-black/20 text-white font-bold placeholder:text-muted/30"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MapPin size={14} className="text-primary/50" />
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. New Delhi"
                  className="w-full px-6 py-4 rounded-2xl border border-white/5 focus:border-primary/50 outline-none transition-all bg-black/20 text-white font-bold placeholder:text-muted/30"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Optional Fields Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-muted border border-white/10">
                <ImageIcon size={20} />
              </div>
              <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] italic">Optional Details</h3>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                <Info size={14} className="text-primary/50" />
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Tell customers about your business..."
                className="w-full px-6 py-4 rounded-2xl border border-white/5 focus:border-primary/50 outline-none transition-all resize-none bg-black/20 text-white font-bold placeholder:text-muted/30"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-black/20 p-6 rounded-3xl border border-white/5">
                <ImageUpload 
                  value={formData.image_url} 
                  onChange={handleImageChange} 
                  label="Business Profile Image"
                />
              </div>

              <div className={`space-y-3 transition-opacity ${formData.plan_type === 'free' ? 'opacity-50' : ''}`}>
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MessageCircle size={14} className="text-emerald-500/50" />
                  WhatsApp Number
                  {formData.plan_type === 'free' && (
                    <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Showroom/Prime Only</span>
                  )}
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  disabled={formData.plan_type === 'free'}
                  placeholder={formData.plan_type === 'free' ? "Available in Showroom/Prime" : "e.g. 9876543210"}
                  className={`w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white font-bold placeholder:text-muted/30 outline-none transition-all ${formData.plan_type !== 'free' ? 'focus:border-primary/50' : 'cursor-not-allowed'}`}
                  value={formData.whatsapp}
                  onChange={handleChange}
                />
                <p className="text-[9px] text-muted/50 font-bold uppercase tracking-widest ml-1">Leave empty if same as phone</p>
              </div>
            </div>

            <div className="bg-black/20 p-8 rounded-3xl border border-white/5">
              <MultiImageUpload 
                images={formData.images} 
                onChange={handleImagesChange} 
                maxImages={5}
              />
            </div>

            <div className="h-px bg-white/5" />

            {/* Social Links Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                    <MessageCircle size={20} />
                  </div>
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">Social Links</h3>
                </div>
                {formData.plan_type !== 'prime' && (
                  <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
                    <Crown size={14} className="text-primary" />
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">Available in Prime Plan</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`space-y-3 transition-opacity ${formData.plan_type !== 'prime' ? 'opacity-50' : ''}`}>
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Website</label>
                  <input
                    type="url"
                    placeholder={formData.plan_type === 'prime' ? "https://yourwebsite.com" : "Available in Prime Plan"}
                    disabled={formData.plan_type !== 'prime'}
                    className={`w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white font-bold placeholder:text-muted/30 outline-none transition-all ${formData.plan_type === 'prime' ? 'focus:border-primary/50' : 'cursor-not-allowed'}`}
                    value={links.website}
                    onChange={e => setLinks({ ...links, website: e.target.value })}
                  />
                </div>
                <div className={`space-y-3 transition-opacity ${formData.plan_type !== 'prime' ? 'opacity-50' : ''}`}>
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Instagram</label>
                  <input
                    type="url"
                    placeholder={formData.plan_type === 'prime' ? "https://instagram.com/yourprofile" : "Available in Prime Plan"}
                    disabled={formData.plan_type !== 'prime'}
                    className={`w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white font-bold placeholder:text-muted/30 outline-none transition-all ${formData.plan_type === 'prime' ? 'focus:border-primary/50' : 'cursor-not-allowed'}`}
                    value={links.instagram}
                    onChange={e => setLinks({ ...links, instagram: e.target.value })}
                  />
                </div>
                <div className={`space-y-3 transition-opacity ${formData.plan_type !== 'prime' ? 'opacity-50' : ''}`}>
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Facebook</label>
                  <input
                    type="url"
                    placeholder={formData.plan_type === 'prime' ? "https://facebook.com/yourpage" : "Available in Prime Plan"}
                    disabled={formData.plan_type !== 'prime'}
                    className={`w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white font-bold placeholder:text-muted/30 outline-none transition-all ${formData.plan_type === 'prime' ? 'focus:border-primary/50' : 'cursor-not-allowed'}`}
                    value={links.facebook}
                    onChange={e => setLinks({ ...links, facebook: e.target.value })}
                  />
                </div>
                <div className={`space-y-3 transition-opacity ${formData.plan_type !== 'prime' ? 'opacity-50' : ''}`}>
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">YouTube</label>
                  <input
                    type="url"
                    placeholder={formData.plan_type === 'prime' ? "https://youtube.com/@yourchannel" : "Available in Prime Plan"}
                    disabled={formData.plan_type !== 'prime'}
                    className={`w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white font-bold placeholder:text-muted/30 outline-none transition-all ${formData.plan_type === 'prime' ? 'focus:border-primary/50' : 'cursor-not-allowed'}`}
                    value={links.youtube}
                    onChange={e => setLinks({ ...links, youtube: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin size={14} className="text-primary/50" />
                Full Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Shop No, Street, Landmark..."
                className="w-full px-6 py-4 rounded-2xl border border-white/5 focus:border-primary/50 outline-none transition-all bg-black/20 text-white font-bold placeholder:text-muted/30"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className={`space-y-3 transition-opacity ${formData.plan_type === 'free' ? 'opacity-50' : ''}`}>
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin size={14} className="text-primary/50" />
                Google Maps URL (Optional)
                {formData.plan_type === 'free' && (
                  <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Showroom/Prime Only</span>
                )}
              </label>
              <input
                type="url"
                name="map_url"
                disabled={formData.plan_type === 'free'}
                placeholder={formData.plan_type === 'free' ? "Available in Showroom/Prime" : "https://goo.gl/maps/..."}
                className={`w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white font-bold placeholder:text-muted/30 outline-none transition-all ${formData.plan_type !== 'free' ? 'focus:border-primary/50' : 'cursor-not-allowed'}`}
                value={formData.map_url}
                onChange={handleChange}
              />
              <p className="text-[9px] text-muted/50 font-bold uppercase tracking-widest ml-1">Paste your Google Maps location link here</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="e.g. Delhi"
                  className="w-full px-6 py-4 rounded-2xl border border-white/5 focus:border-primary/50 outline-none transition-all bg-black/20 text-white font-bold placeholder:text-muted/30"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="e.g. 110001"
                  className="w-full px-6 py-4 rounded-2xl border border-white/5 focus:border-primary/50 outline-none transition-all bg-black/20 text-white font-bold placeholder:text-muted/30"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 bg-black/40 border-t border-white/5">
          {formData.plan_type !== 'free' && (
            <div className="mb-8 p-6 bg-primary/10 border border-primary/20 rounded-3xl flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Zap size={20} fill="currentColor" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-white uppercase italic tracking-tight">Payment Required for {formData.plan_type === 'prime' ? 'Prime' : 'Showroom'}</p>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed">
                  After registration, please scan the QR code to pay <span className="text-primary font-black">
                    {formData.plan_type === 'prime' ? (isPromoApplied ? '₹1,499' : '₹14,999') : (isPromoApplied ? '₹499' : '₹4,999')}
                  </span> and activate your plan.
                </p>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-6 rounded-[2rem] font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 disabled:opacity-70 disabled:cursor-wait hover:scale-[1.01] active:scale-95 group"
          >
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                {submitStatus || 'Registering Your Business...'}
              </>
            ) : (
              <>
                <Save size={24} className="group-hover:rotate-12 transition-transform" />
                Register Business
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBusiness;
