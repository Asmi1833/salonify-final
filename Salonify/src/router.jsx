import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';
import SalonSettings from './pages/SalonSettings';
import SalonProfile from './pages/SalonProfile';
import ManageServices from './pages/ManageServices';
import ManageStaff from './pages/ManageStaff';
import CommissionTracking from './pages/CommissionTracking';
import AllAppointments from './pages/AllAppointments';
import SalonReviews from './pages/SalonReviews';
import ProtectedRoute from './components/ProtectedRoute';
import { UNSTABLE_useBlocker as useBlocker } from 'react-router-dom';

// Enable future flags
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
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
    </Route>
  ),
  routerOptions
);

export default router; 