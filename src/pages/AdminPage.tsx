import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { apiService } from '../services/apiService';
import { Business } from '../types';
import { CheckCircle, XCircle, Phone, MapPin, Loader2, ShieldAlert } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/auth');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'founder') {
      setError('Access denied. Founder rights required.');
      setLoading(false);
      return;
    }

    fetchPendingBusinesses();
  }, [navigate]);

  const fetchPendingBusinesses = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdminBusinesses('pending');
      setBusinesses(data);
    } catch (err: any) {
      console.error('Failed to fetch pending businesses', err);
      setError('Failed to load pending businesses.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await apiService.updateBusinessStatus(id, status);
      // Instantly update UI by removing from list
      setBusinesses(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(`Failed to ${status} business`, err);
      alert(`Failed to ${status} business. Please try again.`);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 inline-block">
            <ShieldAlert size={64} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#003399] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all"
            >
              Back to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Admin Panel</h1>
          <p className="text-gray-500 font-medium">Review and approve pending business applications</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-[#FF6600] animate-spin mb-4" />
            <p className="text-gray-500 font-bold">Loading pending requests...</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Clear!</h2>
            <p className="text-gray-500">There are no pending business applications to review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {businesses.map((biz) => (
              <div key={biz.id} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-gray-900 mb-2">{biz.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-[#FF6600]" />
                      <span>{biz.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone size={16} className="text-[#003399]" />
                      <span>{biz.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleStatusUpdate(biz.id!, 'rejected')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 transition-all active:scale-95"
                  >
                    <XCircle size={20} />
                    <span>Reject</span>
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(biz.id!, 'approved')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-50 text-green-600 px-6 py-3 rounded-2xl font-bold hover:bg-green-100 transition-all active:scale-95"
                  >
                    <CheckCircle size={20} />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
