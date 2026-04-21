import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { businessService } from '../services/businessService';
import { useCategories } from '../hooks/useCategories';
import { Store, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(3, 'Business name is required'),
  category_id: z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number'),
  whatsapp: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Enter a valid 6-digit pincode'),
  image_url: z.string().url('Enter a valid image URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export const SellerOnboarding: React.FC = () => {
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState('Registering your business...');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      city: 'Delhi',
      state: 'Delhi',
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitMessage('Starting registration...');
    
    // Change message after 10 seconds to keep user informed
    const messageTimer = setTimeout(() => {
      setSubmitMessage('Database is waking up, please wait...');
    }, 10000);

    const longWaitTimer = setTimeout(() => {
      setSubmitMessage('Almost there, finalizing details...');
    }, 25000);

    try {
      await businessService.createBusiness(data);
      clearTimeout(messageTimer);
      clearTimeout(longWaitTimer);
      setSubmitMessage('Registration Successful!');
      setTimeout(() => navigate('/dashboard'), 2000); 
    } catch (error: any) {
      clearTimeout(messageTimer);
      clearTimeout(longWaitTimer);
      console.error(error);
      const errorMessage = error.message || 'Failed to register business. Please try again.';
      setSubmitMessage(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar Info */}
          <div className="bg-[#003399] text-white p-8 md:w-1/3">
            <div className="bg-white/20 p-3 rounded-xl inline-block mb-6">
              <Store size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-6">Grow Your Business Online</h2>
            <p className="text-white/80 mb-8">Join thousands of local businesses reaching millions of customers daily.</p>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-[#FF6600] shrink-0 mt-1" />
                <div>
                  <p className="font-bold">Chhoti Dukaan (Free)</p>
                  <p className="text-xs opacity-70">Get discovered by local buyers for free.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-[#FF6600] shrink-0 mt-1" />
                <div>
                  <p className="font-bold">Showroom (₹4,999)</p>
                  <p className="text-xs opacity-70">Google Map & WhatsApp integration.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-[#FF6600] shrink-0 mt-1" />
                <div>
                  <p className="font-bold">Prime Showroom (₹14,999)</p>
                  <p className="text-xs opacity-70">Top priority & Verified Badge.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="p-8 md:w-2/3">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">Register Your Business</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Business Name *</label>
                  <input 
                    {...register('name')}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 outline-none transition-all disabled:bg-gray-100"
                    placeholder="e.g. Sharma Electronics"
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Category *</label>
                  <select 
                    {...register('category_id')}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 outline-none transition-all disabled:bg-gray-100"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.category_id && <p className="text-red-500 text-xs">{errors.category_id.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Phone Number *</label>
                  <input 
                    {...register('phone')}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 outline-none transition-all disabled:bg-gray-100"
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">WhatsApp Number</label>
                  <input 
                    {...register('whatsapp')}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 outline-none transition-all disabled:bg-gray-100"
                    placeholder="Same as phone or different"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Description *</label>
                <textarea 
                  {...register('description')}
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 outline-none transition-all disabled:bg-gray-100"
                  placeholder="Tell customers about your products or services..."
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Full Address *</label>
                <input 
                  {...register('address')}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 outline-none transition-all disabled:bg-gray-100"
                  placeholder="Shop No, Street, Landmark..."
                />
                {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">City *</label>
                  <input 
                    {...register('city')}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 outline-none transition-all disabled:bg-gray-100"
                  />
                  {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">State *</label>
                  <input 
                    {...register('state')}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 outline-none transition-all disabled:bg-gray-100"
                  />
                  {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Pincode *</label>
                  <input 
                    {...register('pincode')}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 outline-none transition-all disabled:bg-gray-100"
                  />
                  {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Business Image URL</label>
                <input 
                  {...register('image_url')}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 outline-none transition-all disabled:bg-gray-100"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image_url && <p className="text-red-500 text-xs">{errors.image_url.message}</p>}
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF6600] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e65c00] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      <span>{submitMessage}</span>
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
                {isSubmitting && (
                  <p className="text-center text-xs text-blue-600 font-bold animate-pulse">
                    Please don't refresh. This might take up to 45 seconds for a new database to start.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
