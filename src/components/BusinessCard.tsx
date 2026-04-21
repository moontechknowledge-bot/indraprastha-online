import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin, CheckCircle, Star, Heart, Share2 } from 'lucide-react';
import { Business } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, setAuthModalOpen } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && business.id) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(business.id));
    }
  }, [business.id, user]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setAuthModalOpen(true, 'buyer');
      return;
    }

    try {
      const { favorited } = await apiService.toggleFavorite(business.id!);
      setIsFavorite(favorited);
      
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      let newFavorites;
      if (favorited) {
        newFavorites = [...new Set([...favorites, business.id])];
      } else {
        newFavorites = favorites.filter((id: string) => id !== business.id);
      }
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to toggle favorite', error);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const businessLink = business.slug 
      ? `${window.location.origin}/${business.slug}` 
      : `${window.location.origin}/business/${business.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: `Check out ${business.name} on Indraprastha Online!`,
          url: businessLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(businessLink);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const businessLink = business.slug ? `/${business.slug}` : `/business/${business.id}`;

  const handleCardClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setAuthModalOpen(true, 'buyer');
    }
  };

  return (
    <div className="bg-surface rounded-2xl shadow-md border border-orange-900/30 overflow-hidden hover:shadow-lg transition-all group relative">
      <Link to={businessLink} onClick={handleCardClick} className="block relative h-48 overflow-hidden">
        <img 
          src={business.image_url || `https://picsum.photos/seed/${business.id}/400/300`} 
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {business.plan_type === 'prime' && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-wider">
            PRIME
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <button 
            onClick={handleShare}
            className="p-2 rounded-full shadow-md backdrop-blur-sm bg-white/90 text-muted hover:text-primary transition-all hover:scale-110"
            title="Share"
          >
            <Share2 size={16} />
          </button>
          <button 
            onClick={toggleFavorite}
            className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-110 ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-muted hover:text-red-500'}`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          {business.is_verified && (
            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md">
              <CheckCircle size={16} className="text-blue-500" />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <Link to={businessLink} onClick={handleCardClick}>
            <h3 className="font-bold text-orange-100 text-lg leading-tight group-hover:text-primary transition-colors">
              {business.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 bg-orange-900/20 px-1.5 py-0.5 rounded text-orange-400 font-bold text-xs">
            <Star size={12} fill="currentColor" />
            <span>4.5</span>
          </div>
        </div>
        
        <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
          {business.category_name || 'Business'}
        </p>

        <div className="flex items-start gap-1.5 text-orange-200/40 mb-4">
          <MapPin size={14} className="shrink-0 mt-0.5" />
          <p className="text-xs line-clamp-1 font-medium">{business.address}, {business.city}</p>
        </div>

        <Link 
          to={businessLink}
          onClick={handleCardClick}
          className="flex items-center justify-center gap-2 bg-[#0044cc] text-white py-2.5 rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:bg-[#0055ee] transition-all shadow-lg active:scale-95"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
