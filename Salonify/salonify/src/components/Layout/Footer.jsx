import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowRight, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle email subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Show scroll button when user scrolls down
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    });
  }

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white pt-12 pb-8 relative">
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
      
      <div className="container mx-auto px-4">
        {/* Newsletter Signup */}
        <div className="bg-blue-600 rounded-lg p-6 mb-12 shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-xl font-bold">Subscribe to our newsletter</h3>
            </div>
            <div className="col-span-1 md:col-span-2">
              {subscribed ? (
                <div className="bg-green-500 text-white p-3 rounded-md text-center">
                  Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 group"
                  >
                    Subscribe 
                    <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-white hover:text-blue-300 transition-colors duration-300">
              Salonify
            </Link>
            <p className="mt-4 text-gray-300">
              The easiest way to book salon services, discover new styles, and connect with top professionals in your area.
            </p>
            
            {/* Interactive Social Icons */}
            <div className="flex space-x-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 transform hover:scale-125"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 transform hover:scale-125"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-all duration-300 transform hover:scale-125"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 transform hover:scale-125"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/salons" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform">Salons</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform">Register</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Customer Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform">FAQ</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform">Contact Us</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="transform group-hover:translate-x-2 transition-transform">Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 group hover:text-blue-300 transition-colors">
                <FaEnvelope className="text-blue-400 group-hover:scale-125 transition-transform" />
                <a href="mailto:info@salonify.com" className="text-gray-300 group-hover:text-blue-300">
                  info@salonify.com
                </a>
              </li>
              <li className="flex items-center gap-3 group hover:text-blue-300 transition-colors">
                <FaPhone className="text-blue-400 group-hover:scale-125 transition-transform" />
                <a href="tel:+11234567890" className="text-gray-300 group-hover:text-blue-300">
                  +1 (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-3 group hover:text-blue-300 transition-colors">
                <FaMapMarkerAlt className="text-blue-400 group-hover:scale-125 transition-transform" />
                <span className="text-gray-300 group-hover:text-blue-300">
                  123 Beauty Avenue, Mumbai, India
                </span>
              </li>
            </ul>
            
            {/* Interactive Map */}
            <div className="mt-4 rounded-lg overflow-hidden shadow-lg transform hover:scale-[1.02] transition-all duration-300">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15281925.10585872!2d73.72876166602134!3d20.770443841538777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1711355801051!5m2!1sen!2sin"
                width="100%" 
                height="150" 
                style={{border: 0}}
                allowFullScreen="" 
                loading="lazy"
                title="Salonify India Location"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            &copy; {currentYear} Salonify. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-gray-600">|</span>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
            <span className="text-gray-600">|</span>
            <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 