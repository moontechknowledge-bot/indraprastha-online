import React, { useState, useEffect } from 'react';
import { Globe, Instagram, Facebook, Youtube, Save, CheckCircle, User, Mail, Phone, Shield, Loader2 } from 'lucide-react';
import { fetchWithAuth } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState({
    website: '',
    instagram: '',
    facebook: '',
    youtube: ''
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetchWithAuth('/api/seller/social-links');
      if (res.ok) {
        const data = await res.json();
        setLinks(data || { website: '', instagram: '', facebook: '', youtube: '' });
      }
    } catch (error) {
      console.error('Error fetching links', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/seller/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(links)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving links', error);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'website', label: 'Website URL', icon: Globe, placeholder: 'https://yourwebsite.com' },
    { name: 'instagram', label: 'Instagram Profile', icon: Instagram, placeholder: 'https://instagram.com/yourprofile' },
    { name: 'facebook', label: 'Facebook Page', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
    { name: 'youtube', label: 'YouTube Channel', icon: Youtube, placeholder: 'https://youtube.com/@yourchannel' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 text-white">
      <header className="space-y-2">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Settings</h2>
        <p className="text-muted text-sm font-bold uppercase tracking-[0.2em]">Manage your account profile and online presence.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-surface/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-2xl text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src={user?.picture || `https://ui-avatars.com/api/?name=${user?.full_name || 'User'}&background=FF6600&color=fff`} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white/5 shadow-2xl mx-auto object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-2xl border-4 border-surface shadow-2xl z-20">
                <Shield size={16} />
              </div>
            </div>
            
            <div className="mt-8 space-y-2">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{user?.full_name}</h3>
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <p className="text-muted text-[10px] font-black uppercase tracking-widest">{user?.role} Account</p>
              </div>
            </div>
            
            <div className="mt-10 space-y-4 text-left">
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-4 group/item hover:border-primary/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted group-hover/item:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-muted/50 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-4 group/item hover:border-primary/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted group-hover/item:text-primary transition-colors">
                  <User size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-muted/50 uppercase tracking-widest">Account ID</p>
                  <p className="text-sm font-bold text-white truncate">#{user?.id?.slice(0, 12)}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-primary/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-primary/10 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <h4 className="text-xl font-black text-primary uppercase italic tracking-tighter mb-3">Need Help?</h4>
            <p className="text-muted text-xs font-bold leading-relaxed mb-6 uppercase tracking-widest">
              Our support team is available 24/7 to help you with any issues or questions.
            </p>
            <button className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase italic tracking-[0.2em] hover:bg-primary/90 transition-all shadow-2xl shadow-primary/20 active:scale-95">
              Contact Support
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-10">
          <form onSubmit={handleSubmit} className="bg-surface/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Social Presence</h3>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                <Globe size={24} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fields.map(field => (
                <div key={field.name} className="space-y-3">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                    <field.icon size={14} className="text-primary" />
                    {field.label}
                  </label>
                  <div className="relative group">
                    <input 
                      type="url"
                      className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-black/20 text-white focus:border-primary/50 outline-none transition-all text-sm font-bold placeholder:text-muted/20"
                      placeholder={field.placeholder}
                      value={(links as any)[field.name]}
                      onChange={e => setLinks({ ...links, [field.name]: e.target.value })}
                    />
                    <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-[0.98] ${
                  saved 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-primary text-white hover:bg-primary/90 shadow-primary/30'
                }`}
              >
                {saved ? (
                  <>
                    <CheckCircle size={20} className="animate-bounce" />
                    Changes Saved!
                  </>
                ) : (
                  <>
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    {loading ? 'Saving...' : 'Save All Changes'}
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="bg-surface/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                <Shield size={24} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Account Security</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-black/20 border border-white/5 group hover:border-primary/30 transition-all space-y-6">
                <div className="space-y-2">
                  <h4 className="font-black text-white text-lg uppercase italic tracking-tighter">Two-Factor Auth</h4>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed">Add an extra layer of security to your account.</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-muted uppercase tracking-widest">Disabled</span>
                  <div className="w-14 h-7 bg-white/5 rounded-full relative cursor-not-allowed border border-white/10 p-1">
                    <div className="w-5 h-5 bg-muted rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-black/20 border border-white/5 group hover:border-primary/30 transition-all space-y-6">
                <div className="space-y-2">
                  <h4 className="font-black text-white text-lg uppercase italic tracking-tighter">Login Notifications</h4>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed">Get notified when someone logs into your account.</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Enabled</span>
                  <div className="w-14 h-7 bg-primary rounded-full relative cursor-pointer shadow-lg shadow-primary/20 p-1">
                    <div className="w-5 h-5 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
