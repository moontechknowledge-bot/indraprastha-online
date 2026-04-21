import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Globe, Instagram, Facebook, Youtube, Loader2, Image as ImageIcon, ChevronRight, MessageCircle, Crown } from 'lucide-react';
import { Business, BusinessLinks, Category } from '../../types';
import { apiService } from '../../services/apiService';
import ImageUpload from '../../components/ImageUpload';
import MultiImageUpload from '../../components/MultiImageUpload';

const EditBusiness: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState<Partial<Business>>({});
  const [links, setLinks] = useState<Partial<BusinessLinks>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    setBusiness(prev => ({ ...prev, image_url: url }));
  };

  const handleImagesChange = (images: string[]) => {
    setBusiness(prev => ({ ...prev, images }));
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async (force: boolean = false) => {
    setLoading(true);
    try {
      const [bizData, linksData, catsData] = await Promise.all([
        apiService.getBusinessById(id!),
        apiService.getBusinessLinks(id!),
        apiService.getCategories(force)
      ]);
      setBusiness(bizData);
      setLinks(linksData);
      setCategories(catsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Promise.all([
        apiService.updateBusiness(business),
        apiService.upsertBusinessLinks({ ...links, business_id: id })
      ]);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 text-white">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate(-1)} 
          className="w-14 h-14 bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 transition-all group"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Edit Profile</h1>
          <p className="text-muted text-xs font-bold uppercase tracking-[0.2em]">Update your business information and social presence</p>
        </div>
        <div className="ml-auto">
          <button 
            onClick={() => navigate(business.slug ? `/${business.slug}` : `/business/${business.id}`)}
            className="bg-white/5 text-white px-6 py-4 rounded-2xl font-black uppercase italic tracking-widest text-xs border border-white/10 hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2"
          >
            <Globe size={16} />
            View Live
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Information */}
        <section className="bg-surface/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-xl font-black italic">1</div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Business Name</label>
              <input 
                required
                placeholder="e.g. Indraprastha Coffee"
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold"
                value={business.name || ''}
                onChange={e => setBusiness({ ...business, name: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Category</label>
              <div className="relative">
                <select 
                  required
                  className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold appearance-none cursor-pointer"
                  value={business.category_id || ''}
                  onChange={e => {
                    const value = e.target.value;
                    setBusiness(prev => {
                      const newData = { ...prev, category_id: value };
                      if (value) {
                        const selectedCategory = categories.find(c => c.id === value);
                        if (selectedCategory) {
                          const categoryKey = selectedCategory.name.toLowerCase().replace(/[^a-z]/g, '');
                          if (!prev.description || prev.description.length < 5) {
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
                  }}
                >
                  <option value="" className="bg-surface">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id} className="bg-surface">{c.name}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                  <ChevronRight size={16} className="rotate-90" />
                </div>
              </div>
              {categories.length === 0 && !loading && (
                <button 
                  type="button"
                  onClick={() => fetchData(true)}
                  className="text-[9px] text-primary font-black uppercase tracking-widest hover:underline ml-1"
                >
                  Retry Loading Categories
                </button>
              )}
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Description</label>
              <textarea 
                required
                rows={4}
                placeholder="Tell us about your business..."
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all resize-none font-bold"
                value={business.description || ''}
                onChange={e => setBusiness({ ...business, description: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Phone Number</label>
              <input 
                required
                placeholder="+91 00000 00000"
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold"
                value={business.phone || ''}
                onChange={e => setBusiness({ ...business, phone: e.target.value })}
              />
            </div>
            <div className={`space-y-3 transition-opacity ${business.plan_type === 'free' ? 'opacity-50' : ''}`}>
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                <MessageCircle size={14} className="text-emerald-500/50" />
                WhatsApp (Optional)
                {business.plan_type === 'free' && (
                  <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Showroom/Prime Only</span>
                )}
              </label>
              <input 
                disabled={business.plan_type === 'free'}
                placeholder={business.plan_type === 'free' ? "Available in Showroom/Prime" : "+91 00000 00000"}
                className={`w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white outline-none transition-all font-bold ${business.plan_type !== 'free' ? 'focus:border-primary/50' : 'cursor-not-allowed'}`}
                value={business.whatsapp || ''}
                onChange={e => setBusiness({ ...business, whatsapp: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Opening Time</label>
              <input 
                type="time"
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold appearance-none cursor-pointer"
                value={business.opening_time || '10:00'}
                onChange={e => setBusiness({ ...business, opening_time: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Closing Time</label>
              <input 
                type="time"
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold appearance-none cursor-pointer"
                value={business.closing_time || '20:00'}
                onChange={e => setBusiness({ ...business, closing_time: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Location & Media */}
        <section className="bg-surface/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -ml-32 -mt-32" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-xl font-black italic">2</div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Location & Media</h2>
          </div>

          <div className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Full Address</label>
              <input 
                required
                placeholder="Shop No, Building, Area..."
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold"
                value={business.address || ''}
                onChange={e => setBusiness({ ...business, address: e.target.value })}
              />
            </div>
            <div className={`space-y-3 transition-opacity ${business.plan_type === 'free' ? 'opacity-50' : ''}`}>
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                Google Maps URL (Optional)
                {business.plan_type === 'free' && (
                  <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Showroom/Prime Only</span>
                )}
              </label>
              <input 
                disabled={business.plan_type === 'free'}
                placeholder={business.plan_type === 'free' ? "Available in Showroom/Prime" : "https://goo.gl/maps/..."}
                className={`w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white outline-none transition-all font-bold ${business.plan_type !== 'free' ? 'focus:border-primary/50' : 'cursor-not-allowed'}`}
                value={business.map_url || ''}
                onChange={e => setBusiness({ ...business, map_url: e.target.value })}
              />
              <p className="text-[9px] text-muted/50 font-bold uppercase tracking-widest ml-1">Paste your Google Maps location link here</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">City</label>
                <input required placeholder="City" className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold" value={business.city || ''} onChange={e => setBusiness({ ...business, city: e.target.value })} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">State</label>
                <input required placeholder="State" className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold" value={business.state || ''} onChange={e => setBusiness({ ...business, state: e.target.value })} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Pincode</label>
                <input required placeholder="000000" className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold" value={business.pincode || ''} onChange={e => setBusiness({ ...business, pincode: e.target.value })} />
              </div>
            </div>
            <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5">
              <ImageUpload 
                value={business.image_url || ''} 
                onChange={handleImageChange} 
                label="Business Profile Image"
              />
            </div>
            <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5">
              <MultiImageUpload 
                images={business.images || []} 
                onChange={handleImagesChange} 
                maxImages={5}
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-surface/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mb-32" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-xl font-black italic">3</div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Social Presence</h2>
            </div>
            {business.plan_type !== 'prime' && (
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
                <Crown size={14} className="text-primary" />
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Available in Prime Plan</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className={`space-y-3 transition-opacity ${business.plan_type !== 'prime' ? 'opacity-50' : ''}`}>
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                <Globe size={14} className="text-primary" /> Website
              </label>
              <input 
                disabled={business.plan_type !== 'prime'}
                className={`w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white outline-none transition-all font-bold ${business.plan_type === 'prime' ? 'focus:border-primary/50' : 'cursor-not-allowed'}`}
                placeholder={business.plan_type === 'prime' ? "https://yourwebsite.com" : "Available in Prime Plan"}
                value={links.website || ''}
                onChange={e => setLinks({ ...links, website: e.target.value })}
              />
            </div>
            <div className={`space-y-3 transition-opacity ${business.plan_type !== 'prime' ? 'opacity-50' : ''}`}>
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                <Instagram size={14} className="text-primary" /> Instagram
              </label>
              <input 
                disabled={business.plan_type !== 'prime'}
                className={`w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white outline-none transition-all font-bold ${business.plan_type === 'prime' ? 'focus:border-primary/50' : 'cursor-not-allowed'}`}
                placeholder={business.plan_type === 'prime' ? "https://instagram.com/yourprofile" : "Available in Prime Plan"}
                value={links.instagram || ''}
                onChange={e => setLinks({ ...links, instagram: e.target.value })}
              />
            </div>
            <div className={`space-y-3 transition-opacity ${business.plan_type !== 'prime' ? 'opacity-50' : ''}`}>
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                <Facebook size={14} className="text-primary" /> Facebook
              </label>
              <input 
                disabled={business.plan_type !== 'prime'}
                className={`w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white outline-none transition-all font-bold ${business.plan_type === 'prime' ? 'focus:border-primary/50' : 'cursor-not-allowed'}`}
                placeholder={business.plan_type === 'prime' ? "https://facebook.com/yourpage" : "Available in Prime Plan"}
                value={links.facebook || ''}
                onChange={e => setLinks({ ...links, facebook: e.target.value })}
              />
            </div>
            <div className={`space-y-3 transition-opacity ${business.plan_type !== 'prime' ? 'opacity-50' : ''}`}>
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                <Youtube size={14} className="text-primary" /> YouTube
              </label>
              <input 
                disabled={business.plan_type !== 'prime'}
                className={`w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white outline-none transition-all font-bold ${business.plan_type === 'prime' ? 'focus:border-primary/50' : 'cursor-not-allowed'}`}
                placeholder={business.plan_type === 'prime' ? "https://youtube.com/@yourchannel" : "Available in Prime Plan"}
                value={links.youtube || ''}
                onChange={e => setLinks({ ...links, youtube: e.target.value })}
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-6 pt-6">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest text-xs text-muted bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="flex-[2] bg-primary text-white py-5 rounded-2xl font-black uppercase italic tracking-widest text-sm shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBusiness;
