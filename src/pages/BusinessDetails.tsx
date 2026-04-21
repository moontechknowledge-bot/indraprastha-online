import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Business, BusinessLinks, Product } from '../types';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Naya Import
import { Phone, MessageCircle, MapPin, Globe, Facebook, Instagram, Youtube, Share2, Star, CheckCircle, Clock, Package, Store, Heart, ShoppingCart } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';

export const BusinessDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [links, setLinks] = useState<BusinessLinks | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const { user, setAuthModalOpen } = useAuth();
  const { addToCart } = useCart(); // Cart Hook

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id || id === 'buyer-dashboard' || id === 'dashboard' || id === 'onboarding') return;
      try {
        const [bizData, linksData, productsData] = await Promise.all([
          apiService.getBusinessById(id),
          apiService.getBusinessLinks(id),
          apiService.getProductsByBusiness(id)
        ]);
        setBusiness(bizData);
        setLinks(linksData);
        setProducts(productsData);

        if (user) {
          const { favorited } = await apiService.checkFavoriteStatus(bizData.id);
          setIsFavorited(favorited);
        }
      } catch (error) {
        console.error('Failed to fetch business', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id, user]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!business) return <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4"><h2>Business not found</h2><Link to="/">Back to Home</Link></div>;

  return (
    <div className="min-h-screen bg-[#FF6600] pb-12">
      {/* Top Bar matching your logo style */}
      <div className="bg-[#003399] py-3 px-4 shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
             <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
             <div className="text-white font-black italic text-xl">इंद्रप्रस्थ <span className="text-[#FFFF00]">ONLINE</span></div>
          </Link>
          {/* Cart Icon in Header */}
          <Link to="/cart" className="relative p-2 text-white hover:text-[#FFFF00] transition-colors">
            <ShoppingCart size={24} />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#003399]">1</span>
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        {/* Business Hero & Products Section */}
        <div className="bg-[#003399] rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white/5 p-5 rounded-3xl border border-white/10 flex gap-4 group">
                <div className="w-24 h-24 bg-black/20 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                  <img src={product.image_url || '/placeholder.png'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">{product.name}</h4>
                    <p className="text-[#FF6600] font-black text-xl italic mt-1">₹{product.price}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-[#FFFF00] text-[#003399] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-95 transition-all flex items-center gap-2"
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                    <a 
                      href={`https://wa.me/${business.whatsapp}`} 
                      className="bg-[#25D366] text-white p-2 rounded-xl hover:scale-95 transition-all"
                    >
                      <MessageCircle size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};