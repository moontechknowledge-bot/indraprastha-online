import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Package, Save, X, 
  DollarSign, ArrowLeft, Store, Loader2,
  Image as ImageIcon, Edit3, Crown, Shield, Globe, ChevronDown
} from 'lucide-react';
import { Business, Product } from '../../types';
import { fetchWithAuth } from '../../utils/api';
import { apiService } from '../../services/apiService';
import { motion, AnimatePresence } from 'motion/react';
import ImageUpload from '../../components/ImageUpload';

const PRODUCT_CATEGORY_MAP: Record<string, string[]> = {
  'BEAUTY': ['Haircut', 'Facial', 'Makeup', 'Nails', 'Skin Care', 'Massage', 'Bridal', 'Grooming', 'Supplies'],
  'SALON': ['Haircut', 'Facial', 'Makeup', 'Nails', 'Skin Care', 'Massage', 'Bridal', 'Grooming', 'Supplies'],
  'FOOD': ['North Indian', 'South Indian', 'Chinese', 'Fast Food', 'Beverages', 'Desserts', 'Main Course', 'Snacks', 'Bakery'],
  'ELECTRONICS': ['Mobiles', 'Laptops', 'Tablets', 'Audio', 'Accessories', 'Home Appliances', 'Cameras'],
  'CLOTHING': ['Men\'s Wear', 'Women\'s Wear', 'Kids Wear', 'Ethnic Wear', 'Formal', 'Casual', 'Footwear'],
  'GROCERY': ['Fresh Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Atta & Dal', 'Spices & Oil', 'Snacks & Drinks'],
  'HEALTH': ['Medicines', 'Personal Care', 'Baby Care', 'Nutrition', 'Vitamins', 'Ayurvedic'],
  'HOME': ['Furniture', 'Home Decor', 'Kitchenware', 'Bedding', 'Gardening', 'Lighting'],
  'SERVICES': ['Repairing', 'Consultation', 'Cleaning', 'Installation', 'Maintenance'],
  'OTHER': ['General', 'Miscellaneous']
};

const BusinessProductManager: React.FC = () => {
  const { business_id } = useParams<{ business_id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    image_url: '',
    description: '',
    category: '',
    business_id: business_id
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (business_id) fetchData();
  }, [business_id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bizData, prodData] = await Promise.all([
        apiService.getBusinessById(business_id!),
        apiService.getProductsByBusiness(business_id!)
      ]);
      setBusiness(bizData);
      setProducts(prodData);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/api/products/${formData.id}` : '/api/products';
      const res = await fetchWithAuth(url, {
        method,
        body: JSON.stringify({ ...formData, business_id: business_id })
      });
      if (res.ok) {
        setIsEditing(false);
        setFormData({ name: '', price: 0, image_url: '', description: '', category: '', business_id: business_id });
        fetchData();
      }
    } finally {
      setSaving(false);
    }
  };

  const getSuggestedCategories = () => {
    if (!business?.category_name) return PRODUCT_CATEGORY_MAP['OTHER'];
    const shopCat = business.category_name.toUpperCase();
    const matchedKey = Object.keys(PRODUCT_CATEGORY_MAP).find(key => shopCat.includes(key));
    return matchedKey ? PRODUCT_CATEGORY_MAP[matchedKey] : PRODUCT_CATEGORY_MAP['OTHER'];
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-white"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex items-center justify-between">
         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-white transition-colors">
            <ArrowLeft size={20} /> <span className="font-bold uppercase tracking-widest text-xs italic">Back</span>
         </button>
         <button 
           onClick={() => {
             setFormData({ name: '', price: 0, image_url: '', description: '', category: '', business_id: business_id });
             setIsEditing(true);
           }}
           className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
         >
           <Plus size={24} /> Add Product
         </button>
      </div>

      <div className="bg-surface/40 p-8 rounded-[3rem] border border-white/5 shadow-2xl flex items-center gap-8">
         <div className="w-24 h-24 rounded-3xl overflow-hidden border border-white/10">
            <img src={business?.image_url} className="w-full h-full object-cover" />
         </div>
         <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">{business?.name}</h1>
            <p className="text-muted font-bold uppercase tracking-[0.3em] text-[10px] mt-1">{business?.category_name}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(p => (
           <div key={p.id} className="bg-surface/40 rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-primary/50 transition-all shadow-2xl">
              <div className="aspect-square relative overflow-hidden bg-black/20">
                <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 flex gap-2">
                   <button onClick={() => { setFormData(p); setIsEditing(true); }} className="p-3 bg-white text-primary rounded-xl shadow-xl hover:scale-110 transition-all"><Edit3 size={18} /></button>
                   <button onClick={async () => { if(confirm('Delete?')) { await apiService.deleteProduct(p.id!); fetchData(); } }} className="p-3 bg-red-500 text-white rounded-xl shadow-xl hover:scale-110 transition-all"><Trash2 size={18} /></button>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                   <span className="text-primary font-black text-xl italic tracking-tighter">₹{p.price}</span>
                </div>
              </div>
              <div className="p-8">
                 <h4 className="text-xl font-black uppercase italic tracking-tighter truncate">{p.name}</h4>
                 <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1 opacity-60">{p.category}</p>
              </div>
           </div>
        ))}
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
             <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-surface/90 border border-white/10 p-10 rounded-[3rem] shadow-2xl w-full max-w-xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="flex justify-between items-center">
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Product Details</h2>
                      <button type="button" onClick={() => setIsEditing(false)} className="text-muted hover:text-white"><X size={32} /></button>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted">Product Name</label>
                         <input required className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted">Category</label>
                         <select required className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option value="">Select Category</option>
                            {getSuggestedCategories().map(c => <option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>)}
                            <option value="Other" className="bg-[#0a0a0a]">Other</option>
                         </select>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted">Price (₹)</label>
                         <input 
                            type="number" 
                            required 
                            className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold" 
                            placeholder="Min ₹1"
                            value={formData.price === 0 ? '' : formData.price} 
                            onChange={e => setFormData({...formData, price: e.target.value === '' ? 0 : Number(e.target.value)})} 
                         />
                      </div>

                      <ImageUpload value={formData.image_url || ''} onChange={(url) => setFormData(prev => ({...prev, image_url: url}))} label="Product Photo" />
                   </div>

                   <button type="submit" disabled={saving} className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase italic tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                      {saving ? 'SAVING...' : 'SAVE PRODUCT'}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessProductManager;