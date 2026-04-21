import React, { createContext, useContext, useState, useEffect } from 'react';

import { apiService } from '../services/apiService';

interface User {
  id: string;
  email?: string;
  phone?: string;
  full_name: string;
  picture?: string;
  role: 'buyer' | 'seller' | 'founder' | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credential: string) => Promise<void>;
  sendEmailOtp: (email: string) => Promise<void>;
  verifyEmailOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  updateRole: (role: 'buyer' | 'seller') => Promise<void>;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean, mode?: 'buyer' | 'seller' | 'none') => void;
  authModalMode: 'buyer' | 'seller' | 'none';
  loginAsTestUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthModalOpen, setAuthModalOpenState] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'buyer' | 'seller' | 'none'>('none');

  const setAuthModalOpen = (open: boolean, mode: 'buyer' | 'seller' | 'none' = 'none') => {
    setAuthModalOpenState(open);
    setAuthModalMode(mode);
    if (open && mode !== 'none') {
      localStorage.setItem('preferredRole', mode);
    } else if (!open) {
      localStorage.removeItem('preferredRole');
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    } else if (savedToken && !savedUser) {
      // Clear stale token if user data is missing
      logout();
    }
  }, []);

  const login = async (credential: string, onStatusUpdate?: (status: string) => void) => {
    console.log('AuthContext: Initiating login with credential');
    if (onStatusUpdate) onStatusUpdate('Verifying with Google...');
    
    const preferredRole = localStorage.getItem('preferredRole');
    const startTime = Date.now();
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, preferredRole }),
      });
      
      console.log(`AuthContext: Received response from /api/auth/google in ${Date.now() - startTime}ms, status:`, res.status);
      
      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error('Login: Response was not JSON:', text);
        throw new Error(`Server Error (${res.status}): ${text.substring(0, 100)}`);
      }
      
      if (res.ok && data.token) {
        if (onStatusUpdate) onStatusUpdate('Login successful! Preparing your dashboard...');
        console.log('AuthContext: Login successful, user:', data.user?.email);
        
        // Save to localStorage first for persistence
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update state
        setToken(data.token);
        setUser(data.user);
        
        // Clear preferred role as it's now handled by the server
        localStorage.removeItem('preferredRole');
        
        console.log('AuthContext: Login successful, user token saved');
        if (onStatusUpdate) onStatusUpdate('Redirecting...');
        
        // Always close modal and redirect
        setTimeout(async () => {
          setAuthModalOpen(false);
          const role = data.user.role;
          const pendingPlan = sessionStorage.getItem('pendingPlan');
          
          let targetUrl = '/';
          if (role === 'founder') {
            targetUrl = '/founder';
          } else if (role === 'seller') {
            targetUrl = '/dashboard';
            if (pendingPlan) {
              targetUrl = `/dashboard/add-business?plan=${pendingPlan}`;
              sessionStorage.removeItem('pendingPlan');
            }
          } else if (pendingPlan) {
            // User doesn't have a role yet but clicked a plan - Upgrade them to seller
            console.log('AuthContext: Upgrading new user to seller role based on pending plan');
            try {
              // We try to update but don't block the redirect for too long
              await Promise.race([
                updateRole('seller'),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
              ]);
            } catch (e) {
              console.warn('AuthContext: Role upgrade failed or slow, redirecting anyway');
            }
            targetUrl = `/dashboard/add-business?plan=${pendingPlan}`;
            sessionStorage.removeItem('pendingPlan');
          }
          
          window.location.replace(targetUrl);
        }, 800);
      } else {
        console.error('AuthContext: Login failed:', data.error || 'Unknown error');
        if (onStatusUpdate) onStatusUpdate('Error: ' + (data.error || 'Login failed'));
        alert('Login failed: ' + (data.error || 'Please check your connection and try again.'));
      }
    } catch (err: any) {
      console.error('AuthContext: Login error:', err);
      const errorMessage = err.message || 'Connection failed';
      if (onStatusUpdate) onStatusUpdate('Error: ' + errorMessage);
      alert('Login error: ' + errorMessage);
    }
  };

  const logout = () => {
    console.log('AuthContext: Final robust logout');
    apiService.clearCache();
    localStorage.clear();
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    window.location.replace('/');
  };

  const updateRole = async (role: 'buyer' | 'seller') => {
    console.log('updateRole called with role:', role);
    
    // Try to get token from state or localStorage
    const currentToken = token || localStorage.getItem('token');
    
    // For test users, bypass the server call if it's hanging
    if (currentToken && (currentToken.startsWith('test-token-') || currentToken.startsWith('mock-token-'))) {
      console.log('Test user detected, performing local role update');
      const updatedUser: User = { ...user!, role };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAuthModalOpen(false);
      return;
    }
    
    if (!currentToken) {
      console.error('No token found in updateRole');
      alert('Error: Session expired. Please login again.');
      return;
    }
    
    try {
      const res = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: currentToken, role }),
      });
      
      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('updateRole: Response was not JSON:', text);
        throw new Error(`Invalid server response (${res.status}): ${text.substring(0, 50)}`);
      }
      
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setAuthModalOpen(false);
      } else {
        alert('Update role failed: ' + (data.error || 'Please try again.'));
      }
    } catch (err: any) {
      console.error('Update role error:', err);
      alert('Update role error: ' + (err.message || 'Could not connect to the server.'));
    }
  };

  const loginAsTestUser = () => {
    const testUser: User = {
      id: '00000000-0000-0000-0000-000000000999',
      email: 'test@example.com',
      full_name: 'Test User',
      picture: 'https://ui-avatars.com/api/?name=Test+User',
      role: null
    };
    const testToken = 'mock-token-' + Date.now();
    setToken(testToken);
    setUser(testUser);
    localStorage.setItem('token', testToken);
    localStorage.setItem('user', JSON.stringify(testUser));
    setAuthModalOpen(true);
  };

  const sendEmailOtp = async (email: string) => {
    try {
      const res = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('sendEmailOtp: Failed to parse JSON:', text);
        throw new Error('Server returned an invalid response. Check console for details.');
      }
      
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
    } catch (err) {
      console.error('sendEmailOtp error:', err);
      throw err;
    }
  };

  const verifyEmailOtp = async (email: string, otp: string) => {
    const preferredRole = localStorage.getItem('preferredRole');
    try {
      const res = await fetch('/api/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, preferredRole }),
      });
      
      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('verifyEmailOtp: Failed to parse JSON:', text);
        throw new Error('Invalid server response during verification');
      }
      
      if (res.ok && data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.removeItem('preferredRole');
        
        setAuthModalOpen(false);
        const role = data.user.role;
        const pendingPlan = sessionStorage.getItem('pendingPlan');
        
        let targetUrl = '/';
        if (role === 'founder') {
          targetUrl = '/founder';
        } else if (role === 'seller') {
          targetUrl = '/dashboard';
          if (pendingPlan) {
            targetUrl = `/dashboard/add-business?plan=${pendingPlan}`;
            sessionStorage.removeItem('pendingPlan');
          }
        } else if (pendingPlan) {
          // Upgrade to seller
          try {
            await Promise.race([
              updateRole('seller'),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
            ]);
          } catch (e) {
            console.warn('AuthContext: Role upgrade failed or slow during OTP, redirecting anyway');
          }
          targetUrl = `/dashboard/add-business?plan=${pendingPlan}`;
          sessionStorage.removeItem('pendingPlan');
        }
        
        window.location.replace(targetUrl);
      } else {
        throw new Error(data.error || 'Verification failed');
      }
    } catch (err) {
      console.error('verifyEmailOtp error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, login, sendEmailOtp, verifyEmailOtp, logout, updateRole, 
      isAuthModalOpen, setAuthModalOpen, authModalMode,
      loginAsTestUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
