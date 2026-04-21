import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package, Save, X, DollarSign, Image as ImageIcon, Loader2, Store } from 'lucide-react';
import { Business, Product } from '../../types';
import { fetchWithAuth } from '../../utils/api';
import ImageUpload from '../../components/ImageUpload';

const ProductManager: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    image_url: '',
    description: '',
    business_id: ''
  });
  const [loading, setLoading] = useState(false);

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      fetchProducts(selectedBusinessId);
    } else {
      setProducts([]);
    }
  }, [selectedBusinessId]);

  const fetchBusinesses = async () => {
    try {
      const res = await fetchWithAuth('/api/seller/businesses');
      const data = await res.json();
      const businessesArray = Array.isArray(data) ? data : [];
      setBusinesses(businessesArray);
      if (businessesArray.length > 0) setSelectedBusinessId(businessesArray[0].id);
    } catch (error) {
      console.error('Error fetching businesses', error);
      setBusinesses([]);
    }
  };

  const fetchProducts = async (businessId: string) => {
    try {
      const res = await fetchWithAuth(`/api/seller/products/${businessId}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products', error);
      setProducts([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/api/seller/products/${formData.id}` : '/api/seller/products';
      
      const res = await fetchWithAuth(url, {
        method,
        body: JSON.stringify({ ...formData, business_id: selectedBusinessId })
      });

      if (res.ok) {
        setIsEditing(false);
        setFormData({ name: '', price: 0, image_url: '', description: '', business_id: selectedBusinessId });
        fetchProducts(selectedBusinessId);
      }
    } catch (error) {
      console.error('Error saving product', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await new Promise(resolve => {
      const res = window.confirm('Delete this product?');
      resolve(res);
    });
    if (!confirmed) return;
    await fetchWithAuth(`/api/seller/products/${id}`, { method: 'DELETE' });
    fetchProducts(selectedBusinessId);
  };

  return (
    <div className="space-y-10 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Product Inventory</h2>
          <p className="text-muted text-xs font-bold uppercase tracking-[0.2em]">Manage your products and services</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative group">
            <select 
              className="pl-6 pr-12 py-4 rounded-2xl border border-white/5 bg-surface/40 backdrop-blur-md text-white font-black uppercase italic tracking-widest text-xs outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer shadow-2xl"
              value={selectedBusinessId}
              onChange={e => setSelectedBusinessId(e.target.value)}
            >
              {businesses.map(b => <option key={b.id} value={b.id} className="bg-surface">{b.name}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover:text-primary transition-colors">
              <Store size={16} />
            </div>
          </div>
          {!isEditing && selectedBusinessId && (
            <button 
              onClick={() => { setIsEditing(true); setFormData({ name: '', price: 0, image_url: '', description: '', business_id: selectedBusinessId }); }}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={20} /> Add Product
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-surface/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{formData.id ? 'Edit Product' : 'New Product'}</h3>
            <button type="button" onClick={() => setIsEditing(false)} className="w-12 h-12 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all flex items-center justify-center text-muted">
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Product Name</label>
              <input 
                required 
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold" 
                placeholder="e.g. Premium Coffee Beans"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Price (₹)</label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">₹</div>
                <input 
                  type="number" 
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all font-bold" 
                  placeholder="0.00"
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <ImageUpload 
                value={formData.image_url || ''} 
                onChange={handleImageChange} 
                label="Product Image"
              />
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Description</label>
              <textarea 
                rows={3} 
                className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all resize-none font-bold" 
                placeholder="Describe your product features and benefits..."
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase italic tracking-widest text-sm shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-surface/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden group hover:border-primary/30 transition-all flex flex-col">
              <div className="aspect-square bg-black/40 relative overflow-hidden border-b border-white/5">
                {p.image_url ? (
                  <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted/10"><Package size={80} /></div>
                )}
                <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300">
                  <button 
                    onClick={() => { setFormData(p); setIsEditing(true); }} 
                    className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl text-white hover:bg-primary transition-all flex items-center justify-center"
                  >
                    <Save size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id!)} 
                    className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl text-white hover:bg-red-500 transition-all flex items-center justify-center"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-primary text-white px-4 py-2 rounded-xl font-black text-sm shadow-2xl">
                    ₹{p.price || 0}
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-3 flex-1 flex flex-col">
                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter truncate group-hover:text-primary transition-colors">{p.name}</h4>
                <p className="text-xs text-muted font-bold uppercase tracking-widest line-clamp-2 leading-relaxed flex-1">{p.description}</p>
                
                {/* --- PRODUCT ID SECTION FOR SELLER --- */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-black text-muted uppercase tracking-[0.2em] mb-1">Product Identity</p>
                    <code className="text-[9px] font-mono bg-white/5 px-2 py-1 rounded text-primary">ID: {p.id?.substring(0, 16)}...</code>
                  </div>
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-full">STOCK ACTIVE</span>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && selectedBusinessId && (
            <div className="col-span-full py-32 text-center bg-surface/20 rounded-[3rem] border-2 border-dashed border-white/5 shadow-inner">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10">
                <Package size={48} className="text-muted/20" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">No products found</h3>
              <p className="text-muted font-medium mt-2">Start adding products to your business inventory.</p>
              <button 
                onClick={() => setIsEditing(true)}
                className="mt-8 text-primary font-black uppercase italic tracking-widest text-sm hover:underline"
              >
                Add your first product
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManager;