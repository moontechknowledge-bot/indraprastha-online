import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export const GlobalAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, setAuthModalOpen } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If user is already logged in, do not add the interceptor
    if (token && user) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Allow clicks inside the auth modal
      if (target.closest('.auth-modal')) return;
      
      // Allow clicks on any element with 'allow-guest-click' class
      if (target.closest('.allow-guest-click')) return;

      // Allow clicks on the login, logout, or header dropdown triggers
      if (target.closest('.login-button') || target.closest('.logout-button') || target.closest('.header-dropdown-trigger')) return;

      // If user is already logged in, do nothing
      if (token && user) return;

      // Allow navigation to auth and onboarding pages
      if (location.pathname === '/auth' || location.pathname === '/onboarding') return;

      const clickable = target.closest('a') || target.closest('button');
      
      if (clickable) {
        e.preventDefault();
        e.stopPropagation();
        console.log('GlobalAuthGuard: Intercepted click, opening auth modal');
        setAuthModalOpen(true, 'buyer');
      }
    };

    // Use capture phase to intercept before other listeners
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [token, user, setAuthModalOpen, location.pathname]);

  return <>{children}</>;
};
