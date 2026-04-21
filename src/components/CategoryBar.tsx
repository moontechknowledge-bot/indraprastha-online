import React, { useState, useEffect } from 'react';
import { LayoutGrid, Utensils, ShoppingBag, Smartphone, Wrench, Stethoscope, Home, Car, GraduationCap, ChevronRight } from 'lucide-react';
import { Category } from '../types';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryModal } from './CategoryModal';

const primaryCategoryIcons: { [key: string]: any } = {
  'Food': Utensils,
  'Groceries': ShoppingBag,
  'Electronics': Smartphone,
  'Home Services': Wrench,
  'Medical': Stethoscope,
  'Real Estate': Home,
  'Automobile': Car,
  'Education': GraduationCap,
};

const primaryCategoryImages: { [key: string]: string } = {
  'Food': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop',
  'Groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop',
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=200&auto=format&fit=crop',
  'Home Services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=200&auto=format&fit=crop',
  'Medical': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200&auto=format&fit=crop',
  'Real Estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=200&auto=format&fit=crop',
  'Automobile': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=200&auto=format&fit=crop',
  'Education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200&auto=format&fit=crop',
};

const categoryStyles: { [key: string]: { bg: string, text: string, border: string, gradient: string } } = {
  'Food': { bg: 'bg-orange-500', text: 'text-[#FF6B00]', border: 'border-[#FF6B00]', gradient: 'from-amber-400 to-orange-600' },
  'Groceries': { bg: 'bg-orange-500', text: 'text-[#FF6B00]', border: 'border-[#FF6B00]', gradient: 'from-amber-400 to-orange-600' },
  'Electronics': { bg: 'bg-orange-500', text: 'text-[#FF6B00]', border: 'border-[#FF6B00]', gradient: 'from-amber-400 to-orange-600' },
  'Home Services': { bg: 'bg-orange-500', text: 'text-[#FF6B00]', border: 'border-[#FF6B00]', gradient: 'from-amber-400 to-orange-600' },
  'Medical': { bg: 'bg-orange-500', text: 'text-[#FF6B00]', border: 'border-[#FF6B00]', gradient: 'from-amber-400 to-orange-600' },
  'Education': { bg: 'bg-orange-500', text: 'text-[#FF6B00]', border: 'border-[#FF6B00]', gradient: 'from-amber-400 to-orange-600' },
  'Real Estate': { bg: 'bg-orange-500', text: 'text-[#FF6B00]', border: 'border-[#FF6B00]', gradient: 'from-amber-400 to-orange-600' },
  'Automobile': { bg: 'bg-orange-500', text: 'text-[#FF6B00]', border: 'border-[#FF6B00]', gradient: 'from-amber-400 to-orange-600' },
};

interface CategoryBarProps {
  onSelectCategory?: (categoryId: string | null) => void;
  activeCategory?: string | null;
}

export const CategoryBar: React.FC<CategoryBarProps> = React.memo(({ onSelectCategory, activeCategory: externalActiveCategory }) => {
  const { user, setAuthModalOpen } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [internalActiveCategory, setInternalActiveCategory] = useState<string | null>('all');

  const activeCategory = (externalActiveCategory !== undefined && externalActiveCategory !== null) 
    ? externalActiveCategory 
    : (externalActiveCategory === null ? 'all' : internalActiveCategory);

  const fetchCategories = async (force: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('CategoryBar: Fetching categories...');
      const data = await apiService.getCategories(force);
      console.log('CategoryBar: Categories received:', data.length);
      setAllCategories(data);
      const primaryNames = ['Food & Dining', 'Groceries & Kirana', 'Electronics & Mobile', 'Home Services', 'Medical & Health', 'Real Estate', 'Automobile', 'Education & Coaching'];
      const filtered = data.filter(cat => primaryNames.includes(cat.name)).slice(0, 8);
      console.log('CategoryBar: Filtered categories:', filtered.length);
      setCategories(filtered);
    } catch (error: any) {
      console.error('CategoryBar: Failed to fetch categories', error);
      setError(error.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category | 'all') => {
    if (category === 'all') {
      setInternalActiveCategory('all');
      setIsModalOpen(true);
    } else {
      const newActive = activeCategory === category.id.toString() ? 'all' : category.id.toString();
      setInternalActiveCategory(newActive);
      if (onSelectCategory) {
        onSelectCategory(newActive === 'all' ? null : newActive);
      }
    }
  };

  const getDisplayName = (name: string) => {
    if (name.includes('&')) return name.split('&')[0].trim();
    return name;
  };

  return (
    <div className="bg-surface border-b border-orange-900/30 py-2 md:py-6 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-start md:justify-center gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-1">
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[80px] animate-pulse">
                <div className="w-14 h-14 rounded-full bg-orange-900/20" />
                <div className="w-12 h-2 bg-orange-900/20 rounded" />
              </div>
            ))
          ) : error ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <span className="text-xs text-red-400 font-medium">{error}</span>
              <button 
                onClick={() => fetchCategories(true)}
                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleCategoryClick('all')}
                className="flex flex-col items-center gap-2 min-w-[70px] md:min-w-[100px] group transition-all allow-guest-click"
              >
                <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden ${activeCategory === 'all' ? 'scale-110 shadow-lg' : 'bg-background border border-[#FF6B00] text-[#FF6B00] group-hover:bg-orange-900/20 shadow-sm'}`}>
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=200&auto=format&fit=crop" 
                      alt="" 
                      className={`w-full h-full object-cover transition-opacity duration-300 ${activeCategory === 'all' ? 'opacity-40' : 'opacity-10 group-hover:opacity-30'}`}
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute inset-0 ${activeCategory === 'all' ? 'bg-gradient-to-br from-amber-400/60 via-orange-500/60 to-amber-600/60' : 'bg-black/20'}`} />
                  </div>
                  <LayoutGrid className={`w-7 h-7 md:w-10 md:h-10 stroke-[2px] relative z-10 ${activeCategory === 'all' ? 'text-white' : 'text-[#FF6B00]'}`} />
                </div>
                <span className={`text-[12px] font-bold text-center whitespace-nowrap tracking-tight ${activeCategory === 'all' ? 'text-orange-100' : 'text-orange-200/40 group-hover:text-[#FF6B00]'}`}>
                  All
                </span>
              </button>

              {categories.map((cat) => {
                const displayName = getDisplayName(cat.name);
                const Icon = primaryCategoryIcons[displayName] || Smartphone;
                const bgImage = primaryCategoryImages[displayName];
                const isActive = activeCategory === cat.id.toString();
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="flex flex-col items-center gap-2 min-w-[70px] md:min-w-[100px] group transition-all allow-guest-click"
                  >
                    <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden ${isActive ? 'scale-110 shadow-lg' : 'bg-background border border-[#FF6B00] text-[#FF6B00] group-hover:bg-orange-900/20 shadow-sm'}`}>
                      {bgImage && (
                        <div className="absolute inset-0 z-0">
                          <img 
                            src={bgImage} 
                            alt="" 
                            className={`w-full h-full object-cover transition-opacity duration-300 ${isActive ? 'opacity-40' : 'opacity-10 group-hover:opacity-30'}`}
                            referrerPolicy="no-referrer"
                          />
                          <div className={`absolute inset-0 ${isActive ? 'bg-gradient-to-br from-amber-400/60 via-orange-500/60 to-amber-600/60' : 'bg-black/20'}`} />
                        </div>
                      )}
                      <Icon className={`w-7 h-7 md:w-10 md:h-10 stroke-[2px] relative z-10 ${isActive ? 'text-white' : 'text-[#FF6B00]'}`} />
                    </div>
                    <span className={`text-[12px] font-bold text-center whitespace-nowrap tracking-tight ${isActive ? 'text-orange-100' : 'text-orange-200/40 group-hover:text-[#FF6B00]'}`}>
                      {displayName}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={allCategories}
        onSelect={(cat) => {
          setInternalActiveCategory(cat.id.toString());
          if (onSelectCategory) onSelectCategory(cat.id.toString());
          setIsModalOpen(false);
        }}
      />
    </div>
  );
});
