import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated when layout loads
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('user');
      
      // If location is login but user is already authenticated, redirect to home
      if (token && userInfo && location.pathname === '/login') {
        console.log('User already authenticated, redirecting to home');
        navigate('/');
      }
    };
    
    checkAuth();
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Use the Navbar component */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout; 