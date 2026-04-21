import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { BusinessDetails } from './pages/BusinessDetails';
import { Onboarding } from './pages/Onboarding';
import { Auth } from './pages/Auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { GlobalAuthGuard } from './components/GlobalAuthGuard';

// Lazy load imports (Spellings wahi hain jo aapke explorer me hain)
const FounderDashboard = lazy(() => import('./pages/FounderDashboard').then(m => ({ default: m.FounderDashboard })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const DashboardLayout = lazy(() => import('./components/DashboardLayout'));
const Overview = lazy(() => import('./pages/dashboard/Overview'));
const MyBusinesses = lazy(() => import('./pages/dashboard/MyBusinesses'));
const Leads = lazy(() => import('./pages/dashboard/Leads'));
const AddBusiness = lazy(() => import('./pages/dashboard/AddBusiness'));
const EditBusiness = lazy(() => import('./pages/dashboard/EditBusiness'));
const BusinessProductManager = lazy(() => import('./pages/dashboard/BusinessProductManager'));
const BusinessManager = lazy(() => import('./pages/dashboard/BusinessManager'));
const ProductManager = lazy(() => import('./pages/dashboard/ProductManager'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const Help = lazy(() => import('./pages/dashboard/Help'));
const BuyerDashboard = lazy(() => import('./pages/dashboard/BuyerDashboard'));
const AboutUs = lazy(() => import('./pages/AboutUs').then(m => ({ default: m.AboutUs })));
const ContactUs = lazy(() => import('./pages/ContactUs').then(m => ({ default: m.ContactUs })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsConditions = lazy(() => import('./pages/TermsConditions').then(m => ({ default: m.TermsConditions })));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy').then(m => ({ default: m.RefundPolicy })));
const GauSeva = lazy(() => import('./pages/GauSeva'));
const Plans = lazy(() => import('./pages/Plans').then(m => ({ default: m.Plans })));
const Marketplace = lazy(() => import('./pages/Marketplace').then(m => ({ default: m.Marketplace })));

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "366702757456-6g8uqn2e4g49iuefill75gusap6naig0.apps.googleusercontent.com";

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <GlobalAuthGuard>
            <ScrollToTop />
            <AuthModal />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/business/:id" element={<BusinessDetails />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/founder" element={<ProtectedRoute><FounderDashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsConditions />} />
                <Route path="/refund" element={<RefundPolicy />} />
                <Route path="/gau-seva" element={<GauSeva />} />
                <Route path="/plans" element={<Navigate to="/onboarding" replace />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/buyer-dashboard" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
                
                <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Overview /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/my-businesses" element={<ProtectedRoute><DashboardLayout><MyBusinesses /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/leads" element={<ProtectedRoute><DashboardLayout><Leads /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/add-business" element={<ProtectedRoute><DashboardLayout><AddBusiness /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/business/:id/edit" element={<ProtectedRoute><DashboardLayout><EditBusiness /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/products/:business_id" element={<ProtectedRoute><DashboardLayout><BusinessProductManager /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/business" element={<ProtectedRoute><DashboardLayout><BusinessManager /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/products" element={<ProtectedRoute><DashboardLayout><ProductManager /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/help" element={<ProtectedRoute><DashboardLayout><Help /></DashboardLayout></ProtectedRoute>} />
                
                <Route path="/:id" element={<BusinessDetails />} />
              </Routes>
            </Suspense>
          </GlobalAuthGuard>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;