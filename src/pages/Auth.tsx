import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });

  const founders = ['moontechknowledge@gmail.com', 'anuragotwal@gmail.com'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const isFounder = founders.includes(formData.email.toLowerCase());
    const requestedRole = (location.state as any)?.requestedRole;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isFounderBypass: isLogin && isFounder, // Bypass password check for founders on login
          requestedRole
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect logic
      if (data.user.role === 'founder') {
        navigate('/founder', { replace: true });
      } else {
        // Both sellers and buyers go to My Account (buyer-dashboard) first
        navigate('/buyer-dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          <div className="bg-[#003399] p-8 text-white text-center relative">
            <h1 className="text-3xl font-black mb-2">
              {isLogin ? 'Welcome Back!' : 'Join Us Today'}
            </h1>
            <p className="text-white/70 font-medium">
              {isLogin 
                ? 'Login to manage your digital shop' 
                : 'Register to start your digital journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
                {error}
              </div>
            )}

            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003399] focus:border-transparent outline-none transition-all font-medium"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      required
                      placeholder="Enter your phone number"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003399] focus:border-transparent outline-none transition-all font-medium"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003399] focus:border-transparent outline-none transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003399] focus:border-transparent outline-none transition-all font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6600] text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-[#e65c00] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Login Now' : 'Create Account'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-bold text-[#003399] hover:underline"
              >
                {isLogin 
                  ? "Don't have an account? Register here" 
                  : "Already have an account? Login here"}
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
