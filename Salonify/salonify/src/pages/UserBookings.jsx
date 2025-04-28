import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserBookings, cancelBooking } from '../services/api';
import Button from '../components/UI/Button';
import Spinner from '../components/UI/Spinner';

const UserBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    // Check for success messages in location state
    if (location.state?.bookingSuccess) {
      setShowSuccess(true);
      
      // Also check for payment success
      if (location.state?.paymentSuccess) {
        setShowPaymentSuccess(true);
      }
      
      // Remove the success messages after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setShowPaymentSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/bookings', message: 'Please login to view your bookings' } });
      return;
    }

    const fetchBookings = async () => {
      try {
        console.log('Fetching user bookings...');
        setLoading(true);
        const data = await getUserBookings();
        console.log('Bookings received:', data);
        
        // Sort bookings by date (newest first) and status (pending and confirmed first)
        const sortedBookings = Array.isArray(data) 
          ? data.sort((a, b) => {
              // First sort by status priority (pending/confirmed first)
              const statusPriority = {
                'pending': 0,
                'confirmed': 1,
                'completed': 2,
                'cancelled': 3
              };
              
              const statusDiff = (statusPriority[a.status] || 999) - (statusPriority[b.status] || 999);
              if (statusDiff !== 0) return statusDiff;
              
              // Then sort by date (newest first)
              const dateA = a.date ? new Date(a.date) : new Date(0);
              const dateB = b.date ? new Date(b.date) : new Date(0);
              return dateB - dateA;
            })
          : [];
        
        setBookings(sortedBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, navigate]);

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      setCancellingId(null);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Add a function to check payment status
  const getPaymentStatusBadge = (booking) => {
    // Check if the booking has a payment property or a paid status
    if (booking.payment_status === 'paid' || booking.isPaid) {
      return (
        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          Paid
        </span>
      );
    } else if (booking.payment_status === 'pending') {
      return (
        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
          Payment Pending
        </span>
      );
    }
    
    // If no payment info, assume payment needed
    return (
      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
        Payment Required
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage all your salon appointments in one place.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <p className="text-green-700">Your appointment has been booked successfully!</p>
        </div>
      )}
      
      {showPaymentSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <p className="text-green-700">Payment processed successfully!</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Confirmed
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Completed
          </span>
        </div>
        <Button onClick={() => navigate('/salons')} variant="primary">
          Book New Appointment
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h2>
          <p className="text-gray-600 mb-6">You don't have any salon appointments yet.</p>
          <Button
            onClick={() => navigate('/salons')}
            variant="primary"
          >
            Browse Salons
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {booking.salon && booking.salon.name ? booking.salon.name : 'Salon'}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2">{booking.salon && booking.salon.address ? booking.salon.address : 'Address unavailable'}</p>
                    
                    {booking.salon && booking.salon.phone && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Phone:</span> {booking.salon.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end mt-2 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                    </span>
                    {getPaymentStatusBadge(booking)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Booking Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-500">Service</p>
                        <p className="font-medium">{booking.service && booking.service.name ? booking.service.name : booking.service || 'Service unavailable'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium">${booking.service && booking.service.price ? booking.service.price.toFixed(2) : (booking.price ? booking.price.toFixed(2) : 'N/A')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {formatDate(booking.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{booking.time || 'Time unavailable'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Staff & Notes</h3>
                    {booking.staff ? (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Stylist</p>
                        <div className="flex items-center">
                          {booking.staff.image && (
                            <img 
                              src={booking.staff.image} 
                              alt={booking.staff.name} 
                              className="w-8 h-8 rounded-full mr-2 object-cover"
                            />
                          )}
                          <p className="font-medium">{booking.staff.name}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-3">No stylist information available</p>
                    )}

                    {booking.notes ? (
                      <div>
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className="text-gray-700">{booking.notes}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No notes provided</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-4 md:mb-0">
                    Booked on {booking.created_at ? formatDate(booking.created_at) : 'Unknown date'}
                  </p>
                  <div className="flex space-x-4">
                    {/* Add Pay Now button if booking is confirmed but not paid */}
                    {booking.status === 'confirmed' && !booking.isPaid && !booking.payment_status && (
                      <Link to={`/payment/${booking._id}`}>
                        <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
                          <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                            </svg>
                            Pay Now
                          </span>
                        </Button>
                      </Link>
                    )}
                    
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <Button
                        variant="danger"
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                      </Button>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <Link to={`/salons/${booking.salon?._id}`}>
                        <Button variant="outline">
                          View Salon
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings; 