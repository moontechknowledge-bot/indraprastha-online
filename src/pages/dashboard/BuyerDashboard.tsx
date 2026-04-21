import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ShoppingBag, Package, Star, Clock, Heart, Search, Filter, User, MapPin, CreditCard, Bell, LogOut, MessageCircle, Store, Tag, Plus, Trash2, CheckCircle2, Image as ImageIcon, Crown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../../services/apiService';
import { Business, UsedItem } from '../../types';
import { BusinessCard } from '../../components/BusinessCard';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload';
import { MarketingDashboard } from '../../components/MarketingDashboard';
import { SellerIDCard } from '../../components/SellerIDCard';

const BuyerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'profile' | 'addresses' | 'sell'>('favorites');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Business[]>([]);
  const [myItems, setMyItems] = useState<UsedItem[]>([]);
  const [fetchedTabs, setFetchedTabs] = useState<Set<string>>(new Set());
  const [marketplaceStatus, setMarketplaceStatus] = useState<{
    plan: 'free' | 'lifetime';
    isEarlyBird: boolean;
    rank: number;
    monthlyCount: number;
    totalCount: number;
    monthlyLimit: number;
    nextResetDate: string;
  } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasBusiness, setHasBusiness] = useState(false);
  const [newItem, setNewItem] = useState<Partial<UsedItem>>({
    title: '',
    description: '',
    price: 0,
    category: 'Others',
    condition: 'Used',
    city: localStorage.getItem('city') || '',
    image_url: ''
  });

  // Unified initialization logic
  const loadDashboardData = async (targetTab: string) => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      // Run essential queries
      const bizPromise = apiService.getBusinessesBySeller(true);
      
      let tabPromises: Promise<any>[] = [];
      if (targetTab === 'favorites') {
        tabPromises = [apiService.getMyFavorites()];
      } else if (targetTab === 'sell') {
        tabPromises = [apiService.getMyUsedItems(), apiService.getUsedItemStatus()];
      }

      const [bizData, ...tabResults] = await Promise.all([bizPromise, ...tabPromises]);
      
      if (bizData && Array.isArray(bizData) && bizData.length > 0) {
        setHasBusiness(true);
      }

      if (targetTab === 'favorites') {
        setFavorites(tabResults[0] || []);
        setFetchedTabs(prev => new Set(prev).add('favorites'));
      } else if (targetTab === 'sell') {
        setMyItems(tabResults[0] || []);
        setMarketplaceStatus(tabResults[1] || null);
        setFetchedTabs(prev => new Set(prev).add('sell'));
      }
    } catch (err: any) {
      console.error('BuyerDashboard: Load failed', err);
      setError('डेटा लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const initialTab = (tabParam === 'sell') ? 'sell' : activeTab;
    
    if (tabParam === 'sell' && activeTab !== 'sell') {
      setActiveTab('sell');
    }
    
    loadDashboardData(initialTab);
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && activeTab && !fetchedTabs.has(activeTab)) {
      if (activeTab === 'favorites' || activeTab === 'sell') {
        loadDashboardData(activeTab);
      }
    }
  }, [activeTab]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await apiService.getMyFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const [items, status] = await Promise.all([
        apiService.getMyUsedItems(),
        apiService.getUsedItemStatus()
      ]);
      setMyItems(items);
      setMarketplaceStatus(status);
    } catch (error) {
      console.error('Failed to fetch my items or status', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiService.createUsedItem(newItem);
      setShowAddForm(false);
      fetchMyItems();
      setNewItem({
        title: '',
        description: '',
        price: 0,
        category: 'Others',
        condition: 'Used',
        city: localStorage.getItem('city') || '',
        image_url: ''
      });
    } catch (error: any) {
      console.error('Failed to create item', error);
      setError(error.message || 'Failed to create item. You might have reached your listing limit.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await apiService.deleteUsedItem(id);
      fetchMyItems();
    } catch (error) {
      console.error('Failed to delete item', error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await apiService.updateUsedItemStatus(id, currentStatus === 'available' ? 'sold' : 'available');
      fetchMyItems();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      await apiService.toggleFavorite(id);
      fetchFavorites();
    } catch (error) {
      console.error('Failed to remove favorite', error);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await apiService.upgradeMarketplace();
      await fetchMyItems(); // Refresh status
      alert('Congratulations! Your marketplace account has been upgraded to Lifetime Unlimited.');
    } catch (error) {
      console.error('Failed to upgrade', error);
      alert('Failed to upgrade. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col text-white">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 py-12 space-y-12">
        {/* Manage Business CTA (For everyone logged in) */}
        {user && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-6 rounded-[2rem] border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                <Store size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Manage Your Business</h3>
                <p className="text-muted text-[10px] font-bold uppercase tracking-widest">Register, edit and manage your business listings effortlessly</p>
              </div>
            </div>
            <button 
              onClick={() => {
                const targetUrl = user?.role === 'founder' ? '/founder' : 
                               (user?.role === 'seller' || hasBusiness) ? '/dashboard' : '/onboarding';
                window.location.href = targetUrl;
              }}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-black uppercase italic tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
            >
              Manage Your Business
              <ShoppingBag size={14} />
            </button>
          </motion.div>
        )}

        {/* User Profile Header */}
        <div className="bg-surface/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[2rem] bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden group-hover:scale-105 transition-transform duration-500">
              {user?.picture ? (
                <img src={user.picture} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-primary" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1">Hello, {user?.full_name || 'User'}</h2>
            <p className="text-muted text-xs font-bold uppercase tracking-[0.2em]">{user?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                <Package size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase italic tracking-widest">0 Orders</span>
              </div>
              <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                <Heart size={14} className="text-red-500" />
                <span className="text-[10px] font-black uppercase italic tracking-widest">{favorites.length} Favorites</span>
              </div>
            </div>
          </div>

          <button 
            onClick={logout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-3 rounded-2xl border border-red-500/20 transition-all flex items-center gap-2 font-black uppercase italic tracking-widest text-[10px]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* --- SELLER ONLY INSIGHTS SECTION --- */}
        {user?.role === 'seller' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <MarketingDashboard shopId={user?.id} />
            <div className="pt-4">
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] text-center mb-6 opacity-30 italic">Official Digital Merchant Identity</p>
              <SellerIDCard />
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-72 space-y-2">
            {[
              { id: 'favorites', label: 'My Favorites', icon: Heart },
              { id: 'sell', label: 'Sell Old Items', icon: Tag },
              { id: 'orders', label: 'My Orders', icon: Package },
              { id: 'profile', label: 'Profile Info', icon: User },
              { id: 'addresses', label: 'Manage Addresses', icon: MapPin },
              { id: 'cards', label: 'Saved Cards', icon: CreditCard },
              { id: 'rewards', label: 'My Rewards', icon: Star },
              { id: 'reviews', label: 'My Reviews', icon: MessageCircle },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase italic tracking-widest text-xs transition-all border ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30' 
                    : 'bg-surface/40 text-muted border-white/5 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-white' : 'text-primary'} />
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Content Area */}
          <div className="flex-1 bg-surface/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 shadow-2xl min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'favorites' && (
                <motion.div 
                  key="favorites"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">My Favorites</h3>
                    <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase italic tracking-widest">{favorites.length} Shops</span>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />
                      ))}
                    </div>
                  ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {favorites.map(business => (
                        <div key={business.id} className="relative group">
                          <BusinessCard business={business} />
                          <button 
                            onClick={() => handleRemoveFavorite(business.id)}
                            className="absolute top-4 right-4 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
                            title="Remove from favorites"
                          >
                            <Heart size={18} fill="white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-muted/20 border border-white/10">
                        <Heart size={48} />
                      </div>
                      <h4 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">No Favorites Yet</h4>
                      <p className="text-muted text-sm font-medium max-w-xs mx-auto">Save your favorite shops to find them easily later.</p>
                      <button 
                        onClick={() => window.location.href = '/'}
                        className="mt-8 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
                      >
                        Explore Shops
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'sell' && (
                <motion.div 
                  key="sell"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sell Your Old Items</h3>
                      <div className="flex flex-wrap gap-3">
                        {marketplaceStatus && (
                          <>
                            <p className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center gap-1">
                              Plan: <span className={marketplaceStatus.plan === 'lifetime' ? 'text-primary' : 'text-gray-400'}>
                                {marketplaceStatus.plan === 'lifetime' ? 'Lifetime Unlimited' : 'Free Plan'}
                              </span>
                            </p>
                            <p className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center gap-1">
                              Limit: <span className="text-white">{marketplaceStatus.monthlyCount}/{marketplaceStatus.monthlyLimit}</span> this month
                            </p>
                            {marketplaceStatus.isEarlyBird && (
                              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                <Star size={10} fill="currentColor" /> Early Bird (Rank: {marketplaceStatus.rank})
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setShowAddForm(!showAddForm);
                        setError(null);
                      }}
                      className="bg-primary text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest flex items-center gap-2"
                    >
                      {showAddForm ? 'Cancel' : 'Add New Item'}
                      {showAddForm ? <Clock size={14} /> : <Plus size={14} />}
                    </button>
                  </div>

                  {!marketplaceStatus?.plan && !loading && (
                    <div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                          <Crown size={20} fill="currentColor" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-white uppercase italic tracking-tight italic">Marketplace Lifetime Access</h4>
                          <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed">
                            Upgrade to <span className="text-primary font-black">Lifetime Unlimited</span> for just ₹999. First 1000 users get it for <span className="text-emerald-500 font-black">FREE</span>!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {marketplaceStatus?.plan === 'free' && marketplaceStatus.monthlyCount >= marketplaceStatus.monthlyLimit && (
                    <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-3xl space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                          <Zap size={20} fill="currentColor" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-white uppercase italic tracking-tight">Monthly Limit Reached</h4>
                          <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed">
                            You've used your 1 free listing for this month. Your limit will reset on {new Date(marketplaceStatus.nextResetDate).toLocaleDateString()}.
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-xl text-[10px] font-black uppercase italic tracking-widest shadow-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Upgrade to Lifetime for ₹999'}
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold text-center">
                      {error}
                    </div>
                  )}

                  {showAddForm ? (
                    <form onSubmit={handleCreateItem} className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest">Item Title</label>
                          <input 
                            required
                            type="text"
                            value={newItem.title}
                            onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                            placeholder="e.g. iPhone 13 Pro Max"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest">Price (₹)</label>
                          <input 
                            required
                            type="number"
                            value={newItem.price}
                            onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest">Category</label>
                          <select 
                            value={newItem.category}
                            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                          >
                            <option value="Mobile & Tablets">Mobile & Tablets</option>
                            <option value="Electronics & Appliances">Electronics & Appliances</option>
                            <option value="Cars & Bikes">Cars & Bikes</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Books & Hobbies">Books & Hobbies</option>
                            <option value="Others">Others</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest">Condition</label>
                          <select 
                            value={newItem.condition}
                            onChange={(e) => setNewItem({...newItem, condition: e.target.value})}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                          >
                            <option value="New">New</option>
                            <option value="Like New">Like New</option>
                            <option value="Used">Used</option>
                            <option value="Heavily Used">Heavily Used</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest">Description</label>
                        <textarea 
                          required
                          value={newItem.description}
                          onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 min-h-[100px]"
                          placeholder="Describe your item..."
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                          <ImageIcon size={14} className="text-primary/50" />
                          Item Photo
                        </label>
                        <div className="bg-black/20 p-6 rounded-3xl border border-white/10">
                          <ImageUpload 
                            value={newItem.image_url || ''} 
                            onChange={(url) => setNewItem({...newItem, image_url: url})} 
                            label="Upload Item Photo"
                          />
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase italic tracking-widest shadow-xl shadow-primary/20">
                        Post Item for Sale
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      {loading ? (
                        <div className="space-y-4">
                          {[1, 2].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />)}
                        </div>
                      ) : myItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {myItems.map(item => (
                            <div key={item.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center gap-6 group">
                              <div className="w-24 h-24 rounded-2xl bg-black/20 overflow-hidden shrink-0">
                                {item.image_url ? (
                                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted/20">
                                    <Tag size={32} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${item.status === 'available' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {item.status}
                                  </span>
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted">{item.category}</span>
                                </div>
                                <h4 className="text-lg font-black uppercase italic tracking-tighter">{item.title}</h4>
                                <p className="text-primary font-black italic">₹{Number(item.price).toLocaleString()}</p>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleToggleStatus(item.id!, item.status)}
                                  className={`p-3 rounded-xl transition-all ${item.status === 'available' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'}`}
                                  title={item.status === 'available' ? 'Mark as Sold' : 'Mark as Available'}
                                >
                                  <CheckCircle2 size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem(item.id!)}
                                  className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"
                                  title="Delete Item"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-20">
                          <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-muted/20 border border-white/10">
                            <Tag size={48} />
                          </div>
                          <h4 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">No Items for Sale</h4>
                          <p className="text-muted text-sm font-medium max-w-xs mx-auto">Have something old to sell? List it here and reach local buyers.</p>
                          <button 
                            onClick={() => setShowAddForm(true)}
                            className="mt-8 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
                          >
                            List Your First Item
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-muted/20 border border-white/10">
                    <Package size={48} />
                  </div>
                  <h4 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">No Orders Yet</h4>
                  <p className="text-muted text-sm font-medium max-w-xs mx-auto">You haven't placed any orders yet. Start exploring shops to find what you need!</p>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Profile Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest">Full Name</label>
                      <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/5 text-sm font-bold">{user?.full_name}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest">Email Address</label>
                      <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/5 text-sm font-bold">{user?.email}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest">Phone Number</label>
                      <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/5 text-sm font-bold text-muted italic">Not Provided</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest">Member Since</label>
                      <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/5 text-sm font-bold">April 2026</div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl border border-white/10 transition-all font-black uppercase italic tracking-widest text-[10px]">
                      Edit Profile
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div 
                  key="addresses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-muted/20 border border-white/10">
                    <MapPin size={48} />
                  </div>
                  <h4 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">No Addresses Saved</h4>
                  <p className="text-muted text-sm font-medium max-w-xs mx-auto">Save your delivery addresses for a faster checkout experience.</p>
                  <button className="mt-8 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95">
                    Add New Address
                  </button>
                </motion.div>
              )}

              {activeTab === 'cards' && (
                <motion.div 
                  key="cards"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-muted/20 border border-white/10">
                    <CreditCard size={48} />
                  </div>
                  <h4 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">No Cards Saved</h4>
                  <p className="text-muted text-sm font-medium max-w-xs mx-auto">Securely save your credit or debit cards for quick payments.</p>
                  <button className="mt-8 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95">
                    Add New Card
                  </button>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div 
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-muted/20 border border-white/10">
                    <Bell size={48} />
                  </div>
                  <h4 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">No Notifications</h4>
                  <p className="text-muted text-sm font-medium max-w-xs mx-auto">Stay tuned! We'll notify you about your orders and special offers here.</p>
                </motion.div>
              )}

              {activeTab === 'rewards' && (
                <motion.div 
                  key="rewards"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-muted/20 border border-white/10">
                    <Star size={48} />
                  </div>
                  <h4 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">No Rewards Yet</h4>
                  <p className="text-muted text-sm font-medium max-w-xs mx-auto">Shop more to earn rewards and exclusive discounts!</p>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div 
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-muted/20 border border-white/10">
                    <MessageCircle size={48} />
                  </div>
                  <h4 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">No Reviews Written</h4>
                  <p className="text-muted text-sm font-medium max-w-xs mx-auto">Share your experience with local businesses by leaving reviews.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyerDashboard;