import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/Header';
import { CategoryBar } from '../components/CategoryBar';
import { MarqueeBar } from '../components/MarqueeBar';
import { HeroBanner } from '../components/HeroBanner';
import { TrustStrip } from '../components/TrustStrip';
import { CategoryGrid } from '../components/CategoryGrid';
import { BusinessCard } from '../components/BusinessCard';
import { Footer } from '../components/Footer';
import { Business, Category } from '../types';
import { apiService } from '../services/apiService';
import { Filter, SortAsc, Clock, Star } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openNow, setOpenNow] = useState(false);
  const [topRated, setTopRated] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const handleSelectCategory = React.useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
  }, []);

  const [lastFetchParams, setLastFetchParams] = useState<string>('');

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchQueryFromUrl = searchParams.get('search');
    const city = localStorage.getItem('city') || undefined;

    const performFetch = async () => {
      // Resolve category ID if name is provided in URL
      let resolvedCategoryId = selectedCategory;
      if (categoryFromUrl && !selectedCategory) {
        try {
          // apiService.getCategories is cached, so this is fast
          const categories = await apiService.getCategories();
          const found = categories.find(c => 
            c.name.toLowerCase().trim() === categoryFromUrl.toLowerCase().trim()
          );
          if (found) {
            resolvedCategoryId = found.id.toString();
            setSelectedCategory(resolvedCategoryId);
          }
        } catch (error) {
          console.error('HomePage: Failed to resolve category', error);
        }
      }

      // Create a unique key for the current fetch parameters
      const currentParams = JSON.stringify({
        category_id: resolvedCategoryId,
        category: (!resolvedCategoryId && categoryFromUrl) ? categoryFromUrl : undefined,
        city,
        search: searchQueryFromUrl,
        open_now: openNow,
        top_rated: topRated
      });

      // Skip if parameters haven't changed
      if (currentParams === lastFetchParams) return;

      setLoading(true);
      try {
        // Fetch businesses
        const response = await apiService.getBusinesses({ 
          category_id: resolvedCategoryId || undefined,
          category: (!resolvedCategoryId && categoryFromUrl) ? categoryFromUrl : undefined,
          city: city,
          search: searchQueryFromUrl || undefined,
          open_now: openNow,
          top_rated: topRated
        } as any);
        setBusinesses(Array.isArray(response.businesses) ? response.businesses : []);
        setLastFetchParams(currentParams);
      } catch (error) {
        console.error('HomePage: Failed to fetch businesses', error);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    performFetch();
  }, [selectedCategory, searchParams, lastFetchParams, openNow, topRated]);

  // Reset selected category when URL category is removed
  useEffect(() => {
    if (!searchParams.get('category')) {
      setSelectedCategory(null);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex flex-col text-white overflow-x-hidden">
      <Header />
      <CategoryBar onSelectCategory={handleSelectCategory} activeCategory={selectedCategory} />
      <MarqueeBar />
      
      <main className="flex-1">
        <HeroBanner />
        <TrustStrip />

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                {t('home.recommended')} <span className="text-[#FF6A00]">{t('home.businesses')}</span>
              </h2>
              <p className="text-orange-200/60 text-sm font-medium">{t('home.top_rated_in')} {localStorage.getItem('city') || 'Delhi-NCR'}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setOpenNow(!openNow)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-bold ${
                  openNow 
                    ? 'bg-[#FF6A00] border-[#FF6A00] text-white shadow-lg shadow-orange-900/20' 
                    : 'bg-surface border-orange-900/50 text-orange-100 hover:bg-orange-900/30'
                }`}
              >
                <Clock size={16} />
                <span>{t('home.open_now')}</span>
              </button>
              <button 
                onClick={() => setTopRated(!topRated)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-bold ${
                  topRated 
                    ? 'bg-[#FF6A00] border-[#FF6A00] text-white shadow-lg shadow-orange-900/20' 
                    : 'bg-surface border-orange-900/50 text-orange-100 hover:bg-orange-900/30'
                }`}
              >
                <Star size={16} />
                <span>{t('home.top_rated')}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-surface rounded-xl border border-orange-900/50 shadow-sm hover:bg-orange-900/30 transition-colors text-sm font-bold text-orange-100">
                <Filter size={18} />
                <span>{t('home.more')}</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[350px] bg-surface rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {businesses.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          )}

          {!loading && businesses.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-surface w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter size={40} className="text-orange-900" />
              </div>
              <h3 className="text-xl font-bold text-orange-100">{t('home.no_biz_found')}</h3>
              <p className="text-orange-200/60">{t('home.try_changing')}</p>
            </div>
          )}
        </div>

        <CategoryGrid />
      </main>

      <Footer />
    </div>
  );
};
