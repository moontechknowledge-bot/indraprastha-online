import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect founder to founder panel if at dashboard root
  if (location.pathname === '/dashboard' && user.role === 'founder') {
    return <Navigate to="/founder" replace />;
  }

  // Protection for /founder route
  if (location.pathname.startsWith('/founder') && user.role !== 'founder') {
    return <Navigate to="/" replace />;
  }

  // Protection for seller dashboard
  if (location.pathname.startsWith('/dashboard') && user.role !== 'seller' && user.role !== 'founder') {
    // Allow access to add-business even if role is null, provided they are logged in
    if (location.pathname === '/dashboard/add-business') {
      return <>{children}</>;
    }
    return <Navigate to="/onboarding" replace />;
  }

  // Protection for buyer dashboard
  if (location.pathname.startsWith('/buyer-dashboard') && user.role !== 'buyer' && user.role !== 'seller' && user.role !== 'founder') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
