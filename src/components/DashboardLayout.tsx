import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, Package, Settings, ChevronRight, MessageSquare, HelpCircle, LogOut } from 'lucide-react';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isFounder = user.role === 'founder';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const menuItems = isFounder ? [
    { path: '/founder', label: 'Founder Panel', icon: LayoutDashboard },
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/dashboard/my-businesses', label: 'My Businesses', icon: Store },
    { path: '/dashboard/leads', label: 'Leads', icon: MessageSquare },
    { path: '/dashboard/products', label: 'Products', icon: Package },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
    { path: '/dashboard/help', label: 'Help', icon: HelpCircle },
  ] : [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/dashboard/my-businesses', label: 'My Businesses', icon: Store },
    { path: '/dashboard/leads', label: 'Leads', icon: MessageSquare },
    { path: '/dashboard/products', label: 'Products', icon: Package },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
    { path: '/dashboard/help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background text-white flex flex-col md:flex-row font-sans selection:bg-primary/30">
      {/* Sidebar / Mobile Nav */}
      <aside className="w-full md:w-80 bg-surface/40 backdrop-blur-3xl border-b md:border-r border-white/5 flex-shrink-0 z-50 relative flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="p-10 relative">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden group-hover:scale-110 transition-all duration-500 shadow-2xl border-4 border-primary/20">
              <img 
                src="/logo.png" 
                alt="Indraprastha Online" 
                className="w-full h-full object-cover block"
                referrerPolicy="no-referrer"
                loading="eager"
              />
            </div>
            <div className="flex flex-col leading-none min-w-0">
              <div className="flex items-baseline gap-1 tracking-tighter drop-shadow-2xl whitespace-nowrap">
                <span className="text-primary italic font-black text-xl md:text-2xl uppercase">इंद्रप्रस्थ</span>
                <span className="text-[#FFFF00] font-black text-[10px] md:text-sm italic tracking-widest">ONLINE</span>
              </div>
              <span className="text-[6px] md:text-[8px] italic font-black text-red-500 uppercase tracking-[0.1em] md:tracking-[0.2em] mt-1 whitespace-nowrap">BHARAT KA LOCAL BAZAAR</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 mt-6 bg-white/5 px-4 py-2 rounded-xl border border-white/5 w-fit">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(255,102,0,0.8)]" />
            <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-black italic">
              {isFounder ? 'Founder Console' : 'Seller Console'}
            </p>
          </div>
        </div>
        
        <nav className="flex-1 px-6 pb-8 space-y-2 relative overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-6">
            <p className="text-[10px] text-muted/30 uppercase tracking-[0.3em] font-black italic">Navigation</p>
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-5 py-4 rounded-[1.5rem] transition-all duration-500 border ${
                  isActive 
                    ? 'bg-primary text-white border-primary/50 shadow-[0_20px_40px_-15px_rgba(255,102,0,0.3)] scale-[1.02]' 
                    : 'text-muted border-transparent hover:bg-white/5 hover:text-white hover:border-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20' : 'bg-white/5 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                    <Icon size={20} />
                  </div>
                  <span className="font-black uppercase italic tracking-widest text-[11px]">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-white/70 animate-pulse" />}
              </Link>
            );
          })}
          
          <div className="pt-10 px-4">
            <p className="text-[10px] text-muted/30 uppercase tracking-[0.3em] font-black italic">Account</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all text-red-400/60 hover:text-red-400 hover:bg-red-400/10 mt-2 font-black uppercase italic tracking-widest text-[11px] border border-transparent hover:border-red-400/20"
          >
            <div className="p-2 rounded-xl bg-red-400/5">
              <LogOut size={20} />
            </div>
            <span>Logout Session</span>
          </button>
        </nav>

        {/* User Profile Mini Card */}
        <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-xl relative">
          <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:scale-105 transition-transform">
              <img 
                src={user.picture || `https://ui-avatars.com/api/?name=${user.full_name}&background=FF6600&color=fff`} 
                alt={user.full_name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate uppercase italic tracking-tighter">{user.full_name}</p>
              <p className="text-[10px] text-muted truncate font-bold">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <div className="max-w-7xl mx-auto p-8 md:p-12 pb-32">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
