import React from 'react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Layout/Footer';
import Logo from '../components/Logo';
import { Outlet } from 'react-router-dom';
import { 
  FiHome, 
  FiGrid, 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiSettings, 
  FiStar,
  FiTrendingUp,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiSearch,
  FiShoppingBag,
  FiMapPin,
  FiClock
} from 'react-icons/fi';

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is a salon owner
  const isSalonOwner = user && (
    user.role?.toLowerCase() === 'salon_owner' || 
    user.role?.toLowerCase() === 'salonowner' ||
    user.role?.toLowerCase() === 'salon owner' ||
    (user.role?.toLowerCase().includes('salon') && user.role?.toLowerCase().includes('owner'))
  );
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const pathname = location.pathname;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity duration-300">
              <Logo />
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className="lg:hidden focus:outline-none text-gray-700 hover:text-blue-600 transition-colors duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
            
            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                  pathname === '/' 
                    ? 'text-blue-600 bg-blue-50 shadow-sm' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                }`}
              >
                <FiHome className="w-5 h-5 mr-2 transition-colors duration-300" />
                Home
              </Link>
              
              {isAuthenticated && !isSalonOwner && (
                <Link 
                  to="/salons" 
                  className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                    pathname === '/salons' 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                  }`}
                >
                  <FiMapPin className="w-5 h-5 mr-2 transition-colors duration-300" />
                  Find Salons
                </Link>
              )}
              
              {isAuthenticated && isSalonOwner && (
                <Link
                  to="/services/manage"
                  className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                    pathname === '/services/manage' 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                  }`}
                >
                  <FiShoppingBag className="w-5 h-5 mr-2 transition-colors duration-300" />
                  Services
                </Link>
              )}
              
              {isAuthenticated && isSalonOwner && (
                <Link
                  to="/dashboard"
                  className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                    pathname === '/dashboard' 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                  }`}
                >
                  <FiGrid className="w-5 h-5 mr-2 transition-colors duration-300" />
                  Dashboard
                </Link>
              )}

              {isAuthenticated && !isSalonOwner && (
                <Link 
                  to="/bookings" 
                  className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
                    pathname === '/bookings' 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                  }`}
                >
                  <FiClock className="w-5 h-5 mr-2 transition-colors duration-300" />
                  My Bookings
                </Link>
              )}
              
              {isAuthenticated ? (
                <div className="relative">
                  {isSalonOwner ? (
                    <>
                      <button 
                        onClick={toggleProfile}
                        className="flex items-center px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md"
                      >
                        <FiUser className="w-5 h-5 mr-2 transition-colors duration-300" />
                        {user?.name || 'Profile'}
                      </button>
                      
                      {/* Profile Dropdown */}
                      {profileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                          <Link
                            to="/salon/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                          >
                            <FiUser className="w-4 h-4 mr-2" />
                            Salon Profile
                          </Link>
                          <Link
                            to="/salon/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                          >
                            <FiSettings className="w-4 h-4 mr-2" />
                            Settings
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setProfileOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:text-white hover:bg-red-600 transition-all duration-300"
                          >
                            <FiLogOut className="w-4 h-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <button 
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 text-red-600 hover:text-white hover:bg-red-600 hover:shadow-md"
                    >
                      <FiLogOut className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md"
                  >
                    <FiUser className="w-5 h-5 mr-2 transition-colors duration-300" />
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                  >
                    <FiUser className="w-5 h-5 mr-2" />
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          {/* Mobile Menu */}
          {menuOpen && (
            <nav className="lg:hidden mt-4 space-y-2 pb-4">
              <Link 
                to="/" 
                className="flex items-center px-4 py-2 rounded-md transition-all duration-300 text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md"
                onClick={closeMenu}
              >
                <FiHome className="w-5 h-5 mr-2 transition-colors duration-300" />
                Home
              </Link>
              
              {isAuthenticated && !isSalonOwner && (
                <>
                  <Link 
                    to="/salons" 
                    className="flex items-center px-4 py-2 rounded-md transition-all duration-300 text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md"
                    onClick={closeMenu}
                  >
                    <FiMapPin className="w-5 h-5 mr-2 transition-colors duration-300" />
                    Find Salons
                  </Link>
                  <Link 
                    to="/bookings" 
                    className="flex items-center px-4 py-2 rounded-md transition-all duration-300 text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md"
                    onClick={closeMenu}
                  >
                    <FiClock className="w-5 h-5 mr-2 transition-colors duration-300" />
                    My Bookings
                  </Link>
                </>
              )}
              
              {isAuthenticated && isSalonOwner && (
                <>
                  <Link
                    to="/services/manage"
                    className="flex items-center px-4 py-2 rounded-md transition-all duration-300 text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md"
                  >
                    <FiShoppingBag className="w-5 h-5 mr-2 transition-colors duration-300" />
                    Services
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-2 rounded-md transition-all duration-300 text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md"
                  >
                    <FiGrid className="w-5 h-5 mr-2 transition-colors duration-300" />
                    Dashboard
                  </Link>
                  <Link
                    to="/salon/profile"
                    className="flex items-center px-4 py-2 rounded-md transition-all duration-300 text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md"
                  >
                    <FiUser className="w-5 h-5 mr-2 transition-colors duration-300" />
                    Salon Profile
                  </Link>
                  <Link
                    to="/salon/settings"
                    className="flex items-center px-4 py-2 rounded-md transition-all duration-300 text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md"
                  >
                    <FiSettings className="w-5 h-5 mr-2 transition-colors duration-300" />
                    Settings
                  </Link>
                </>
              )}

              {isAuthenticated && !isSalonOwner && (
                <button 
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="flex items-center w-full px-4 py-2 rounded-md text-red-600 hover:text-white hover:bg-red-600"
                >
                  <FiLogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              )}

              {!isAuthenticated && (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center px-4 py-2 rounded-md transition-all duration-300 text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md"
                    onClick={closeMenu}
                  >
                    <FiUser className="w-5 h-5 mr-2 transition-colors duration-300" />
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center px-6 py-2 rounded-lg transition-all duration-300 bg-blue-600 text-white shadow-md hover:shadow-lg"
                    onClick={closeMenu}
                  >
                    <FiUser className="w-5 h-5 mr-2" />
                    Register
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>
      
      {/* Main Content - This is where the page content is rendered */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout; 