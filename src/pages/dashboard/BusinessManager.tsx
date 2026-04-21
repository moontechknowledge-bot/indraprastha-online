import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Save, X, Store } from 'lucide-react';
import { Business, Category } from '../../types';
import { apiService } from '../../services/apiService';
import { fetchWithAuth } from '../../utils/api';

const BusinessManager: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Business>>({
    name: '',
    category_id: '',
    description: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    images: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBusinesses();
    fetchCategories();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const data = await apiService.getBusinessesBySeller();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching businesses', error);
      setBusinesses([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories', error);
      setCategories([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      
      const businessData = { ...formData, seller_id: user.id };
      
      if (formData.id) {
        await apiService.updateBusiness(businessData);
      } else {
        await apiService.createBusiness(businessData);
      }

      setIsEditing(false);
      setFormData({ name: '', category_id: '', description: '', phone: '', whatsapp: '', address: '', city: '', state: '', pincode: '', images: [] });
      fetchBusinesses();
    } catch (error) {
      console.error('Error saving business', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;
    await fetch(`/api/businesses/${id}`, { method: 'DELETE' });
    fetchBusinesses();
  };

  const handleAddImage = () => {
    const url = prompt('Enter image URL:');
    if (url && (formData.images?.length || 0) < 5) {
      setFormData({ ...formData, images: [...(formData.images || []), url] });
    }
  };

  return (
    <div className="space-y-10 text-white">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Business Manager</h2>
          <p className="text-muted text-xs font-bold uppercase tracking-[0.2em]">Manage your business listings and profiles</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => { setIsEditing(true); setFormData({ name: '', category_id: '', description: '', phone: '', whatsapp: '', address: '', city: '', state: '', pincode: '', images: [] }); }}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-sm shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <Plus size={20} />
            Add New
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-surface/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-4 relative z-10">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{formData.id ? 'Edit Business' : 'New Business'}</h3>
            <button type="button" onClick={() => setIsEditing(false)} className="w-12 h-12 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all flex items-center justify-center text-muted">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Business Name</label>
              <input 
                required
                placeholder="e.g. Indraprastha Coffee"
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Category</label>
              <select 
                required
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold appearance-none cursor-pointer"
                value={formData.category_id}
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="" className="bg-surface">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id} className="bg-surface">{c.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Description</label>
              <textarea 
                required
                rows={3}
                placeholder="Describe your business..."
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all resize-none font-bold"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Phone Number</label>
              <input 
                required
                placeholder="+91 00000 00000"
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">WhatsApp (Optional)</label>
              <input 
                placeholder="+91 00000 00000"
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Address</label>
              <input 
                required
                placeholder="Full Address"
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-6 md:col-span-2">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">City</label>
                <input required placeholder="City" className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">State</label>
                <input required placeholder="State" className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Pincode</label>
                <input required placeholder="000000" className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Images (Max 5)</label>
              <button type="button" onClick={handleAddImage} className="text-primary text-xs font-black uppercase italic tracking-widest flex items-center gap-2 hover:underline">
                <Plus size={16} /> Add Image
              </button>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {formData.images?.map((img, i) => (
                <div key={i} className="relative w-32 h-32 rounded-2xl bg-black/40 flex-shrink-0 border border-white/5 overflow-hidden group">
                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, images: formData.images?.filter((_, idx) => idx !== i) })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {(!formData.images || formData.images.length === 0) && (
                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-muted/20 bg-black/20">
                  <ImageIcon size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest mt-2">No images</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-6 pt-6 relative z-10">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-primary text-white py-5 rounded-2xl font-black uppercase italic tracking-widest text-sm shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
            >
              <Save size={20} />
              {loading ? 'Saving...' : 'Save Business'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {businesses.map(b => (
            <div key={b.id} className="bg-surface/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex items-center justify-between group hover:border-primary/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-[1.5rem] bg-black/40 overflow-hidden border border-white/5">
                  {b.images?.[0] && <img src={b.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors">{b.name}</h4>
                  <p className="text-xs text-muted font-bold uppercase tracking-widest">{b.city}, {b.state}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => { setFormData(b); setIsEditing(true); }} className="w-12 h-12 bg-white/5 text-muted hover:text-primary hover:bg-primary/10 rounded-2xl transition-all flex items-center justify-center">
                  <Save size={20} />
                </button>
                <button onClick={() => handleDelete(b.id!)} className="w-12 h-12 bg-white/5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all flex items-center justify-center">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {businesses.length === 0 && (
            <div className="text-center py-32 bg-surface/20 rounded-[3rem] border-2 border-dashed border-white/5 shadow-inner">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10">
                <Store size={48} className="text-muted/20" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">No businesses yet</h3>
              <p className="text-muted font-medium mt-2">You haven't added any businesses yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessManager;
