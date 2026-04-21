import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Trash2, User, Loader2 } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_picture?: string;
}

interface ReviewSectionProps {
  businessId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ businessId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const fetchReviews = async () => {
    try {
      const data = await apiService.getBusinessReviews(businessId);
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [businessId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to leave a review');
      return;
    }
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await apiService.createReview({
        business_id: businessId,
        rating,
        comment
      });
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await apiService.deleteReview(reviewId);
      fetchReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-1 h-6 bg-[#FF6600] rounded-full" />
          Ratings & Reviews
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
            <Star className="text-yellow-400 fill-yellow-400" size={16} />
            <span className="text-white font-black">{averageRating}</span>
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-white/5 rounded-[2rem] p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-all hover:scale-110"
                >
                  <Star 
                    size={24} 
                    className={`${
                      star <= (hoverRating || rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-white/20'
                    } transition-colors`} 
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-black text-white/40 uppercase tracking-widest">
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
            </span>
          </div>
          
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this shop..."
              className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-white placeholder:text-white/20 focus:border-[#FF6600]/50 outline-none transition-all min-h-[100px] resize-none font-medium"
            />
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="absolute bottom-4 right-4 bg-[#FF6600] text-white p-3 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:scale-100 active:scale-95"
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 text-center space-y-4">
          <p className="text-white/60 font-medium">Please login to share your feedback</p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="bg-[#FF6600] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all"
          >
            Login to Review
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="text-[#FF6600] animate-spin" size={32} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-white/20">
              <MessageSquare size={32} />
            </div>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No reviews yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-4 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-white/10">
                        {review.user_picture ? (
                          <img src={review.user_picture} alt={review.user_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/40">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-black text-sm uppercase italic tracking-tighter">{review.user_name}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={10} 
                              className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                      {user?.id === review.user_id && (
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-white/20 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-white/80 text-sm font-medium leading-relaxed">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
