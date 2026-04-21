import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, ShoppingBasket, Shirt, Smartphone, Wrench, Sparkles, 
  Stethoscope, GraduationCap, Home, Car, Sofa, PartyPopper, 
  Gem, Dumbbell, Plane, PawPrint, Hammer, Briefcase, 
  BookOpen, Palette, UserCheck, MoreHorizontal, X
} from 'lucide-react';
import { Category } from '../types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSelect: (category: Category) => void;
}

const categoryDetails: { [key: string]: { icon: any, description: string, color: string } } = {
  'Food & Dining': { icon: Utensils, description: 'Restaurants, cafes and food services', color: 'bg-orange-500/10 text-orange-500' },
  'Groceries & Kirana': { icon: ShoppingBasket, description: 'Daily essentials and local stores', color: 'bg-emerald-500/10 text-emerald-500' },
  'Fashion & Clothing': { icon: Shirt, description: 'Apparel, footwear and accessories', color: 'bg-pink-500/10 text-pink-500' },
  'Electronics & Mobile': { icon: Smartphone, description: 'Gadgets, accessories and repairs', color: 'bg-blue-500/10 text-blue-500' },
  'Home Services': { icon: Wrench, description: 'Plumbers, electricians and repairs', color: 'bg-indigo-500/10 text-indigo-500' },
  'Beauty & Salon': { icon: Sparkles, description: 'Hair, makeup and wellness', color: 'bg-rose-500/10 text-rose-500' },
  'Medical & Health': { icon: Stethoscope, description: 'Pharmacy, doctors and clinics', color: 'bg-red-500/10 text-red-500' },
  'Education & Coaching': { icon: GraduationCap, description: 'Schools, tutors and training', color: 'bg-purple-500/10 text-purple-500' },
  'Real Estate': { icon: Home, description: 'Buy, sell and rent properties', color: 'bg-amber-500/10 text-amber-500' },
  'Automobile': { icon: Car, description: 'Cars, bikes and repair services', color: 'bg-slate-500/10 text-slate-400' },
  'Furniture & Decor': { icon: Sofa, description: 'Home furnishings and interior', color: 'bg-stone-500/10 text-stone-400' },
  'Events & Wedding': { icon: PartyPopper, description: 'Planners, venues and catering', color: 'bg-yellow-500/10 text-yellow-500' },
  'Jewelry & Gems': { icon: Gem, description: 'Gold, silver and precious stones', color: 'bg-cyan-500/10 text-cyan-500' },
  'Gym & Fitness': { icon: Dumbbell, description: 'Workouts, yoga and health clubs', color: 'bg-lime-500/10 text-lime-500' },
  'Travel & Transport': { icon: Plane, description: 'Tours, travels and logistics', color: 'bg-sky-500/10 text-sky-500' },
  'Pets & Animals': { icon: PawPrint, description: 'Pet food, clinics and grooming', color: 'bg-orange-500/10 text-orange-500' },
  'Hardware & Tools': { icon: Hammer, description: 'Construction and DIY supplies', color: 'bg-zinc-500/10 text-zinc-400' },
  'Legal & Finance': { icon: Briefcase, description: 'Lawyers, CAs and advisors', color: 'bg-blue-500/10 text-blue-400' },
  'Books & Stationery': { icon: BookOpen, description: 'Office and school supplies', color: 'bg-emerald-500/10 text-emerald-500' },
  'Arts & Crafts': { icon: Palette, description: 'Handmade and creative supplies', color: 'bg-violet-500/10 text-violet-500' },
  'Jobs & Consultancy': { icon: UserCheck, description: 'Recruitment and HR services', color: 'bg-teal-500/10 text-teal-500' },
  'Other': { icon: MoreHorizontal, description: 'Miscellaneous local services', color: 'bg-gray-500/10 text-gray-400' },
};

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, categories, onSelect }) => {
  const order = [
    'Food & Dining', 'Groceries & Kirana', 'Fashion & Clothing', 'Electronics & Mobile', 
    'Home Services', 'Beauty & Salon', 'Medical & Health', 'Education & Coaching', 
    'Real Estate', 'Automobile', 'Furniture & Decor', 'Events & Wedding', 
    'Jewelry & Gems', 'Gym & Fitness', 'Travel & Transport', 'Pets & Animals', 
    'Hardware & Tools', 'Legal & Finance', 'Books & Stationery', 'Arts & Crafts', 
    'Jobs & Consultancy', 'Other'
  ];

  const sortedCategories = [...categories].sort((a, b) => {
    const indexA = order.indexOf(a.name);
    const indexB = order.indexOf(b.name);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-surface/90 backdrop-blur-2xl w-full max-w-5xl max-h-[85vh] rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col"
          >
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Explore All Categories</h2>
                <p className="text-xs text-muted font-bold uppercase tracking-[0.2em] mt-1">Find the right business category instantly</p>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-muted hover:text-white border border-white/5"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCategories.map((cat) => {
                  const details = categoryDetails[cat.name] || categoryDetails['Other'];
                  const Icon = details.icon;
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onSelect(cat)}
                      className="flex items-center gap-6 p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/30 hover:-translate-y-1 transition-all group text-left relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className={`w-20 h-20 rounded-3xl ${details.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <Icon size={40} className="stroke-[2.5px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-1 group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
                          {details.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
