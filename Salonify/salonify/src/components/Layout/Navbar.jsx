import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../services/api';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSalonOwner, setIsSalonOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth check function with more detailed logging
  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');
    
    console.log('Navbar: Checking authentication status');
    console.log('Navbar: Token exists:', !!token);
    console.log('Navbar: User info exists:', !!userInfo);
    
    if (token && userInfo) {
      try {
        // Parse user info to make sure it's valid JSON
        const userData = JSON.parse(userInfo);
        console.log('Navbar: User data:', userData);
        setIsAuthenticated(true);
        setCurrentUser(userData);
        
        // Check if user is a salon owner - improved detection
        const userRole = userData.role ? userData.role.toLowerCase() : '';
        console.log('Navbar: User role detected:', userRole);
        
        // Check multiple variations of salon owner role
        const salonOwner = 
          userRole === 'salon_owner' || 
          userRole === 'salonowner' || 
          userRole === 'salon owner' ||
          (userRole.includes('salon') && userRole.includes('owner'));
          
        console.log('Navbar: Is salon owner:', salonOwner);
        
        // Force state update
        if (salonOwner !== isSalonOwner) {
          console.log('Navbar: Updating salon owner state from', isSalonOwner, 'to', salonOwner);
          setIsSalonOwner(salonOwner);
        }
        
        return true;
      } catch (error) {
        console.error('Navbar: Error parsing user info:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setIsSalonOwner(false);
        setCurrentUser(null);
        return false;
      }
    } else {
      console.log('Navbar: No valid auth data found');
      setIsAuthenticated(false);
      setIsSalonOwner(false);
      setCurrentUser(null);
      return false;
    }
  };

  useEffect(() => {
    // Check authentication on initial load and route changes
    const checkAuth = checkAuthentication();
    console.log('Navbar: Authentication check result:', checkAuth);
    
    // Set up a listener for storage events to detect login/logout
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        console.log('Navbar: Storage change detected for:', e.key);
        checkAuthentication();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check every 2 seconds in case of manual localStorage changes
    const interval = setInterval(() => {
      checkAuthentication();
    }, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    console.log('Navbar: Logging out');
    logout();
    setIsAuthenticated(false);
    setIsSalonOwner(false);
    setCurrentUser(null);
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Function to check if we should show the Salons link
  const shouldShowSalonsLink = () => {
    console.log('Navbar: Checking if should show Salons link');
    console.log('Navbar: isSalonOwner state value:', isSalonOwner);
    
    // Don't show if user is a salon owner based on state
    if (isSalonOwner) {
      console.log('Navbar: Hiding Salons link because isSalonOwner state is true');
      return false;
    }
    
    // Direct check from localStorage as an additional validation
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        console.log('Navbar: Direct localStorage check - user:', userData);
        
        if (userData && userData.role) {
          const roleCheck = userData.role.toLowerCase();
          console.log('Navbar: Direct localStorage check - role:', roleCheck);
          
          if (
            roleCheck === 'salon_owner' || 
            roleCheck === 'salonowner' || 
            roleCheck === 'salon owner' ||
            (roleCheck.includes('salon') && roleCheck.includes('owner'))
          ) {
            console.log('Navbar: Hiding Salons link from direct localStorage check');
            // Update the state for future checks
            if (!isSalonOwner) setIsSalonOwner(true);
            return false;
          }
        }
      }
    } catch (e) {
      console.error('Navbar: Error in direct localStorage check:', e);
    }
    
    // Double check against current user data as a fallback
    if (currentUser && currentUser.role) {
      const role = currentUser.role.toLowerCase();
      console.log('Navbar: Checking against currentUser state:', role);
      
      if (
        role === 'salon_owner' || 
        role === 'salonowner' || 
        role === 'salon owner' ||
        (role.includes('salon') && role.includes('owner'))
      ) {
        console.log('Navbar: Hiding Salons link based on currentUser check');
        return false;
      }
    }
    
    // Show in all other cases
    console.log('Navbar: Showing Salons link, no salon owner detected');
    return true;
  };

  // Add CSS classes instead of inline styles for better responsiveness
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-blue-600 font-bold text-2xl">
          Salonify
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-gray-700 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
          >
            Home
          </Link>

          {isAuthenticated && !isSalonOwner && (
            <Link to="/salons" className="text-gray-700 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
              Find Salons
            </Link>
          )}
          
          {isAuthenticated && isSalonOwner && (
            <Link to="/services/manage" className="text-gray-700 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
              Services
            </Link>
          )}
          
          {isAuthenticated && isSalonOwner && (
            <Link 
              to="/dashboard" 
              className="text-gray-700 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              Dashboard
            </Link>
          )}
          
          {isAuthenticated && !isSalonOwner && (
            <Link 
              to="/bookings" 
              className="text-gray-700 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              My Bookings
            </Link>
          )}
          
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-red-600 px-3 py-2 rounded-md hover:text-white hover:bg-red-600 transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-700 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none transform hover:scale-110 transition-all duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden py-2 px-4 bg-white border-t border-gray-100">
          <div className="flex flex-col space-y-2">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 px-4 py-2 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {isAuthenticated && !isSalonOwner && (
              <Link 
                to="/salons" 
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 px-4 py-2 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Salons
              </Link>
            )}
            
            {isAuthenticated && isSalonOwner && (
              <Link 
                to="/services/manage" 
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 px-4 py-2 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
            )}
            
            {isAuthenticated && isSalonOwner && (
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 px-4 py-2 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            {isAuthenticated && !isSalonOwner && (
              <Link 
                to="/bookings" 
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 px-4 py-2 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                My Bookings
              </Link>
            )}
            
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-left text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 px-4 py-2 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 