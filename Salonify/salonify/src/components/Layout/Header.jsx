import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar, FiCreditCard } from 'react-icons/fi';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Salonify</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-base font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/salons"
              className={({ isActive }) =>
                `text-base font-medium ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`
              }
            >
              Salons
            </NavLink>
          </nav>

          {/* User Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                >
                  <FiUser className="mr-1" />
                  {user?.name?.split(' ')[0] || 'User'}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      Signed in as <span className="font-semibold">{user?.email}</span>
                    </div>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FiCalendar className="mr-2" />
                      My Bookings
                    </Link>
                    <Link
                      to="/payments"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FiCreditCard className="mr-2" />
                      Payments
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FiLogOut className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-base font-medium py-2 ${
                    isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/salons"
                className={({ isActive }) =>
                  `text-base font-medium py-2 ${
                    isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Salons
              </NavLink>
              
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/bookings"
                    className={({ isActive }) =>
                      `text-base font-medium py-2 flex items-center ${
                        isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiCalendar className="mr-2" />
                    My Bookings
                  </NavLink>
                  <NavLink
                    to="/payments"
                    className={({ isActive }) =>
                      `text-base font-medium py-2 flex items-center ${
                        isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiCreditCard className="mr-2" />
                    Payments
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-base font-medium py-2 text-red-600 hover:text-red-700 flex items-center"
                  >
                    <FiLogOut className="mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" fullWidth>
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" fullWidth>
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header; 