import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSalons, getPopularServices } from '../services/api';
import Button from '../components/UI/Button';
import Spinner from '../components/UI/Spinner';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [salons, setSalons] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  
  // Check if user is a salon owner
  const isSalonOwner = user && (
    user.role?.toLowerCase() === 'salon_owner' || 
    user.role?.toLowerCase() === 'salonowner'
  );
  
  console.log('Home: User role:', user?.role);
  console.log('Home: Is salon owner:', isSalonOwner);

  // Helper function to safely get salon link from a service object
  const getSalonLink = (service) => {
    if (!service) return '/salons';
    
    // Handle different service data structures
    if (service.salon_id) {
      // If salon_id is an object with _id property
      if (typeof service.salon_id === 'object' && service.salon_id._id) {
        return `/salons/${service.salon_id._id}`;
      }
      // If salon_id is a string ID
      if (typeof service.salon_id === 'string') {
        return `/salons/${service.salon_id}`;
      }
    }
    
    // If service has direct salon property
    if (service.salon && service.salon._id) {
      return `/salons/${service.salon._id}`;
    }
    
    // If service has salonId property
    if (service.salonId) {
      return `/salons/${service.salonId}`;
    }
    
    // Fallback to salons list
    return '/salons';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Add more detailed logging
        console.log('Home: Fetching salons and services data');
        
        // Get salons and services sequentially to avoid race conditions
        let salonsData = [];
        let servicesData = [];
        
        try {
          salonsData = await getAllSalons();
          console.log('Home: Received salons data:', salonsData);
          
          // Debug logging for salon IDs
          if (salonsData && salonsData.salons) {
            console.log('Home: Salon IDs:', salonsData.salons.map(salon => salon._id));
          } else if (Array.isArray(salonsData)) {
            console.log('Home: Salon IDs:', salonsData.map(salon => salon._id));
          }
        } catch (error) {
          console.error('Home: Error fetching salons:', error);
          // Continue execution to attempt services fetch
        }
        
        try {
          servicesData = await getPopularServices();
          console.log('Home: Received services data:', servicesData);
          
          // Debug salon IDs in services
          if (Array.isArray(servicesData)) {
            console.log('Home: Service salon IDs:', servicesData.map(svc => 
              svc.salon_id ? (typeof svc.salon_id === 'object' ? svc.salon_id._id : svc.salon_id) : 'no_salon_id'
            ));
          }
        } catch (error) {
          console.error('Home: Error fetching services:', error);
          // Continue execution to use what data we have
        }

        // Safely handle different response formats
        // If salonsData.salons exists, use it, otherwise use salonsData directly if it's an array
        const salonsArray = salonsData && salonsData.salons ? 
          salonsData.salons.slice(0, 4) : 
          (Array.isArray(salonsData) ? salonsData.slice(0, 4) : []);
        
        console.log('Home: Processed salons array:', salonsArray);
        setSalons(salonsArray);
        
        // Ensure servicesData is an array before slicing
        const servicesArray = Array.isArray(servicesData) ? 
          servicesData.slice(0, 4) : 
          (servicesData && servicesData.services && Array.isArray(servicesData.services) ? 
            servicesData.services.slice(0, 4) : []);
          
        console.log('Home: Processed services array:', servicesArray);
        setServices(servicesArray);
      } catch (err) {
        console.error('Home: Fatal error in fetchData:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section - Different for salon owners */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              {isSalonOwner ? (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Welcome to Your <span className="text-blue-600">Salon Dashboard</span>
                  </h1>
                  <p className="text-lg text-gray-700 mb-8">
                    Streamline your salon operations, manage appointments, track staff performance, and grow your business with Salonify's comprehensive management tools.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/dashboard">
                      <Button variant="primary" size="lg">
                        View Dashboard
                      </Button>
                    </Link>
                    <Link to="/services/manage">
                      <Button variant="outline" size="lg">
                        Manage Services
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Book Your Perfect <span className="text-blue-600">Salon Experience</span>
                  </h1>
                  <p className="text-lg text-gray-700 mb-8">
                    Find and book appointments with the best salons in your area. Salonify makes it easy to discover services, read reviews, and schedule your next appointment.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/salons">
                      <Button variant="primary" size="lg">
                        Find Salons
                      </Button>
                    </Link>
                    {isAuthenticated ? (
                      <Link to="/bookings">
                        <Button variant="outline" size="lg">
                          My Bookings
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/register">
                        <Button variant="outline" size="lg">
                          Join as Salon Owner
                        </Button>
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="md:w-1/2">
              <img
                src={isSalonOwner 
                  ? "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2066&q=80" 
                  : "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2066&q=80"}
                alt={isSalonOwner ? "Salon management" : "Salon interior"}
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* User Dashboard Section - Different content for salon owners */}
      {isAuthenticated && (
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="bg-blue-50 rounded-lg p-6 shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  {isSalonOwner ? (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Management Hub</h2>
                      <p className="text-gray-700 mb-4 md:mb-0">
                        Access all your salon management tools and business analytics in one place.
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Your Appointments</h2>
                      <p className="text-gray-700 mb-4 md:mb-0">
                        View and manage your upcoming salon appointments in one place.
                      </p>
                    </>
                  )}
                </div>
                <div className="flex space-x-4">
                  {isSalonOwner ? (
                    <>
                      <Link to="/commission/tracking">
                        <Button variant="primary">
                          Commission Tracking
                        </Button>
                      </Link>
                      <Link to="/staff/manage">
                        <Button variant="outline">
                          Manage Staff
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/bookings">
                        <Button variant="primary">
                          View My Bookings
                        </Button>
                      </Link>
                      <Link to="/salons">
                        <Button variant="outline">
                          Book New Appointment
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Content - Show only to non-salon owners */}
      {!isSalonOwner && (
        <>
          {/* Featured Salons Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Featured Salons</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover top-rated salons in your area offering a wide range of services.
                </p>
              </div>

              {error ? (
                <div className="text-center text-red-600 my-8">{error}</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {salons.length > 0 ? (
                      salons.map((salon) => (
                        <div
                          key={salon._id}
                          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                          <img
                            src={salon.image || "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                            alt={salon.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{salon.name}</h3>
                            <p className="text-gray-500 mb-3">{salon.address}</p>
                            <div className="flex items-center mb-3">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < Math.round(salon.rating) ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-gray-600 ml-2">
                                {salon.numReviews} {salon.numReviews === 1 ? 'review' : 'reviews'}
                              </span>
                            </div>
                            <Link to={salon._id ? `/salons/${salon._id}` : '/salons'}>
                              <Button variant="primary" fullWidth>
                                {salon._id ? 'View Salon' : 'Browse Salons'}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 text-center py-8">
                        <p className="text-gray-500">No salons found.</p>
                      </div>
                    )}
                  </div>

                  <div className="text-center mt-10">
                    <Link to="/salons">
                      <Button variant="outline">View All Salons</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Popular Services Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Popular Services</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover trending services and treatments offered by our salons.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.length > 0 ? (
                  services.map((service) => (
                    <div
                      key={service._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <img
                        src={service.image || "https://images.unsplash.com/photo-1595944024804-5f64103fb0c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                        alt={service.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-blue-600 font-bold">
                            ${service.price ? Number(service.price).toFixed(2) : 'N/A'}
                          </span>
                          <span className="text-gray-500">
                            {service.duration ? `${service.duration} min` : 'Duration N/A'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {service.description || 'No description available.'}
                        </p>
                        <Link to={getSalonLink(service)}>
                          <Button variant="outline" fullWidth>
                            View Salon
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center py-8">
                    <p className="text-gray-500">No services found.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Salon Owner Stats Section - Only visible to salon owners */}
      {isSalonOwner && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Business Performance Overview</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Monitor your salon's key metrics and performance indicators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500">Today's Appointments</p>
                    <h3 className="text-2xl font-bold">5</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500">Today's Revenue</p>
                    <h3 className="text-2xl font-bold">$1,250</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500">Active Staff</p>
                    <h3 className="text-2xl font-bold">8</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500">Monthly Growth</p>
                    <h3 className="text-2xl font-bold">+12%</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link to="/dashboard">
                <Button variant="primary">
                  View Detailed Analytics
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {isSalonOwner ? "Powerful Salon Management Tools" : "How It Works"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {isSalonOwner 
                ? "Everything you need to run your salon business efficiently and profitably." 
                : "Booking your next salon appointment is easy with Salonify."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isSalonOwner ? (
              <>
                <div className="text-center bg-white p-6 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Smart Appointment Management</h3>
                  <p className="text-gray-600">
                    Handle bookings, cancellations, and rescheduling with our intuitive calendar system.
                  </p>
                </div>

                <div className="text-center bg-white p-6 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Staff & Commission Tracking</h3>
                  <p className="text-gray-600">
                    Manage staff schedules, track performance, and automate commission calculations.
                  </p>
                </div>

                <div className="text-center bg-white p-6 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Business Analytics</h3>
                  <p className="text-gray-600">
                    Get detailed insights into revenue, customer trends, and business growth.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center bg-white p-6 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Find a Salon</h3>
                  <p className="text-gray-600">
                    Browse through our curated list of top-rated salons in your area.
                  </p>
                </div>

                <div className="text-center bg-white p-6 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Choose a Service</h3>
                  <p className="text-gray-600">
                    Select from a wide range of services and choose your preferred stylist.
                  </p>
                </div>

                <div className="text-center bg-white p-6 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Book & Enjoy</h3>
                  <p className="text-gray-600">
                    Schedule your appointment online and enjoy a hassle-free salon experience.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section - Different for salon owners */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          {isSalonOwner ? (
            <>
              <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Salon Operations?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Take advantage of Salonify's comprehensive management tools to streamline your business and boost profitability.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/services/manage">
                  <Button variant="primary" size="lg" className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 shadow-lg mx-2">
                    Manage Services
                  </Button>
                </Link>
                <Link to="/staff/manage">
                  <Button variant="primary" size="lg" className="bg-pink-600 text-white hover:bg-pink-700 shadow-lg mx-2">
                    Manage Staff
                  </Button>
                </Link>
                <Link to="/salon/settings">
                  <Button variant="primary" size="lg" className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg mx-2">
                    Salon Settings
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Look?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have found their perfect salon experience with Salonify.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 border-4 border-white shadow-lg">
                    Sign Up Now
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 