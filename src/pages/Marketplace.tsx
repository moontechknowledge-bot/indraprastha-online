import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { apiService } from '../services/apiService';
import { UsedItem } from '../types';
import { Search, MapPin, Tag, Clock, Phone, MessageCircle, Filter, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const Marketplace: React.FC = () => {
  const [items, setItems] = useState<UsedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState(localStorage.getItem('city') || '');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const categories = [
    'Mobile & Tablets',
    'Electronics & Appliances',
    'Cars & Bikes',
    'Furniture',
    'Fashion',
    'Books & Hobbies',
    'Others'
  ];

  useEffect(() => {
    fetchItems();
  }, [category, city]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await apiService.getUsedItems({ category, city, search });
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch marketplace items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">
              Marketplace <span className="text-primary">Indraprastha</span>
            </h1>
            <p className="text-gray-500 font-medium">Buy & Sell used items in your city</p>
          </div>
          
          <button 
            onClick={() => navigate('/buyer-dashboard?tab=sell')}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Sell Your Item
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 mb-10">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary/50 font-medium"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary/50 font-medium"
              />
            </div>

            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary/50 font-medium appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <button type="submit" className="bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors">
              Apply Filters
            </button>
          </form>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[400px] bg-white rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No items found</h3>
            <p className="text-gray-500">Try changing your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 group hover:shadow-2xl transition-all"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                    {item.condition}
                  </div>
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-black italic">
                    ₹{Number(item.price).toLocaleString()}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    <Tag size={12} />
                    <span>{item.category}</span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1 italic uppercase">{item.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 font-medium h-10">{item.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                      <MapPin size={14} />
                      <span>{item.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                      <Clock size={14} />
                      <span>{new Date(item.created_at!).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <a 
                      href={`tel:${item.seller_phone}`}
                      className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-xs font-black uppercase italic tracking-widest hover:bg-black transition-all"
                    >
                      <Phone size={14} />
                      Call
                    </a>
                    <a 
                      href={`https://wa.me/${item.seller_phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl text-xs font-black uppercase italic tracking-widest hover:bg-green-600 transition-all"
                    >
                      <MessageCircle size={14} />
                      Chat
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

import { ShoppingBag } from 'lucide-react';
