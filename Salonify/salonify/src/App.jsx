import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SalonList from './pages/SalonList';
import SalonDetails from './pages/SalonDetails';
import Booking from './pages/Booking';
import UserBookings from './pages/UserBookings';
import Payment from './pages/Payment';
import AddReview from './pages/AddReview';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import SalonOwnerDashboard from './pages/SalonOwnerDashboard';
import ManageServices from './pages/ManageServices';
import ManageStaff from './pages/ManageStaff';
import SalonSettings from './pages/SalonSettings';
import CommissionTracking from './pages/CommissionTracking';
import SalonProfile from './pages/SalonProfile';
import AllAppointments from './pages/AllAppointments';
import SalonReviews from './pages/SalonReviews';
import ServiceAnalytics from './pages/ServiceAnalytics';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Dashboard Route component
const DashboardRoute = () => {
  const { user } = useAuth();
  console.log('Dashboard route - user role:', user?.role);
  
  // Make role comparison case-insensitive for more flexibility
  if (user?.role?.toLowerCase() === 'salon_owner' || user?.role?.toLowerCase() === 'salonowner') {
    console.log('Rendering SalonOwnerDashboard');
    return <SalonOwnerDashboard />;
  }

  console.log('Rendering UserBookings');
  return <UserBookings />;
};

// Salon Owner Route component
const SalonOwnerRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Make role comparison case-insensitive for more flexibility
  const isSalonOwner = user.role?.toLowerCase() === 'salon_owner' || 
                       user.role?.toLowerCase() === 'salonowner';
  
  if (!isSalonOwner) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="salons" element={<SalonList />} />
            <Route path="salons/:id" element={<SalonDetails />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="cookies" element={<Cookies />} />
            
            {/* Protected Routes */}
            <Route
              path="booking/:id"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="bookings"
              element={
                <ProtectedRoute>
                  <UserBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="payment/:bookingId"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-review/:bookingId"
              element={
                <ProtectedRoute>
                  <AddReview />
                </ProtectedRoute>
              }
            />
            
            {/* Salon Owner Routes */}
            <Route
              path="salon/profile"
              element={
                <ProtectedRoute allowedRoles={['salon_owner', 'salonowner']}>
                  <SalonProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="salon/settings"
              element={
                <ProtectedRoute allowedRoles={['salon_owner', 'salonowner']}>
                  <SalonSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="services/manage"
              element={
                <ProtectedRoute allowedRoles={['salon_owner', 'salonowner']}>
                  <ManageServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="staff/manage"
              element={
                <ProtectedRoute allowedRoles={['salon_owner', 'salonowner']}>
                  <ManageStaff />
                </ProtectedRoute>
              }
            />
            <Route
              path="commission/tracking"
              element={
                <ProtectedRoute allowedRoles={['salon_owner', 'salonowner']}>
                  <CommissionTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/salon/appointments"
              element={
                <ProtectedRoute allowedRoles={['salon_owner']}>
                  <AllAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/salon/reviews"
              element={
                <ProtectedRoute allowedRoles={['salon_owner', 'salonowner']}>
                  <SalonReviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/analytics"
              element={
                <ProtectedRoute allowedRoles={['salon_owner', 'salonowner']}>
                  <ServiceAnalytics />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
