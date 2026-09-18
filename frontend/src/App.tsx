import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout';
import { ProtectedRoute, AdminRoute } from './routes';
import { ToastContainer } from './components/common/Toast';
import { useToastStore } from './store/toastStore';
import { Home, Login, Signup, Flights, BookingPage, BookingConfirmationPage, MyBookingsPage, AdminDashboard } from './pages';
import { ManageFlights, ManageCities, ManageAirports, ManageAirplanes } from './pages/admin';
import { WelcomePage } from './pages/WelcomePage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { ManageUsers } from './pages/admin/ManageUsers';
import { useAuthStore } from './store';
import { ROUTES } from './utils/constants';
import { DynamicBackground } from './components/animations';

const UnauthorizedHandler: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  useEffect(() => {
    const handle = () => { logout(); navigate(ROUTES.LOGIN, { replace: true }); };
    window.addEventListener('auth:unauthorized', handle);
    return () => window.removeEventListener('auth:unauthorized', handle);
  }, [navigate, logout]);
  return null;
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<WelcomePage />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />
          <Route path={ROUTES.FLIGHTS} element={<Flights />} />
          <Route path="/flights/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path={ROUTES.BOOKING_CONFIRMATION} element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
          <Route path={ROUTES.MY_BOOKINGS} element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        </Route>
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="flights" element={<ManageFlights />} />
          <Route path="cities" element={<ManageCities />} />
          <Route path="airports" element={<ManageAirports />} />
          <Route path="airplanes" element={<ManageAirplanes />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.WELCOME} replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const { checkAuth } = useAuthStore();
  const { toasts, removeToast } = useToastStore();
  useEffect(() => { checkAuth(); }, [checkAuth]);
  return (
    <BrowserRouter>
      <UnauthorizedHandler />
      <DynamicBackground />
      <div className="relative z-10"><AnimatedRoutes /></div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </BrowserRouter>
  );
};

export default App;
