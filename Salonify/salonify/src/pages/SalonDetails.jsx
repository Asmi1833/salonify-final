import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSalonById, getServicesBySalon, getReviewsBySalon, getStaffBySalon } from '../services/api';
import Button from '../components/UI/Button';
import Spinner from '../components/UI/Spinner';
import ServiceTable from '../components/ServiceTable';
import StaffProfiles from '../components/StaffProfiles';
import { FaMapMarkerAlt, FaPhone, FaClock, FaStar, FaRegStar } from 'react-icons/fa';

const SalonDetails = () => {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        setLoading(true);
        console.log('SalonDetails: Fetching details for salon ID:', id);
        
        const salonData = await getSalonById(id);
        console.log('SalonDetails: Received salon data:', salonData);
        
        if (!salonData) {
          throw new Error('No salon data received');
        }
        
        setSalon(salonData);
        
        try {
          const servicesData = await getServicesBySalon(id);
          setServices(servicesData);
        } catch (serviceError) {
          console.error('Error fetching services:', serviceError);
          setServices([]);
        }
        
        try {
          const reviewsData = await getReviewsBySalon(id);
          setReviews(reviewsData);
        } catch (reviewError) {
          console.error('Error fetching reviews:', reviewError);
          setReviews([]);
        }
        
        try {
          const staffData = await getStaffBySalon(id);
          setStaff(staffData);
        } catch (staffError) {
          console.error('Error fetching staff:', staffError);
          setStaff([]);
        }
      } catch (err) {
        console.error('Failed to load salon details:', err);
        setError('Failed to load salon details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSalonDetails();
    } else {
      setError('Invalid salon ID');
      setLoading(false);
    }
  }, [id]);

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className="text-yellow-400">
          {i < Math.floor(rating) ? <FaStar /> : <FaRegStar />}
        </span>
      ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <Link to="/salons">
          <Button variant="primary">Back to Salons</Button>
        </Link>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg mb-4">Salon not found</p>
        <Link to="/salons">
          <Button variant="primary">Back to Salons</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-16">
      <div className="container mx-auto px-4">
        {/* Salon Header */}
        <div className="relative mb-8">
          <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg">
            <img
              src={salon.images && salon.images[0] || "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2036&q=80"}
              alt={salon.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 -mt-20 mx-4 md:mx-12 relative">
            <h1 className="text-3xl font-bold">{salon.name}</h1>
            <div className="flex items-center mt-2 mb-4">
              <div className="flex mr-2">{renderStars(salon.rating)}</div>
              <span className="text-gray-600">
                {salon.rating.toFixed(1)} ({salon.numReviews} {salon.numReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-800">Address</h3>
                  <p className="text-gray-600">{salon.address}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-800">Contact</h3>
                  <p className="text-gray-600">{salon.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaClock className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-800">Open Hours</h3>
                  <p className="text-gray-600">
                    {salon.opening_time} - {salon.closing_time}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link to={`/booking/${salon._id}`}>
                <Button variant="primary" size="lg" className="w-full md:w-auto">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Salon Description */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">About {salon.name}</h2>
          <p className="text-gray-700">
            {salon.description || 
              `${salon.name} is a premium salon offering a wide range of beauty and wellness services. 
              Our professional staff is dedicated to providing you with the best experience and results. 
              Visit us today and treat yourself to exceptional service in a relaxing environment.`}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b mb-6">
            <button
              className={`py-3 px-5 font-medium ${
                activeTab === 'services'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('services')}
            >
              Services
            </button>
            <button
              className={`py-3 px-5 font-medium ${
                activeTab === 'staff'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('staff')}
            >
              Our Team
            </button>
            <button
              className={`py-3 px-5 font-medium ${
                activeTab === 'reviews'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Our Services</h2>
              {services.length > 0 ? (
                <ServiceTable services={services} salonId={salon._id} />
              ) : (
                <p className="text-gray-500 text-center py-4">No services available at the moment.</p>
              )}
            </div>
          )}

          {/* Staff Tab */}
          {activeTab === 'staff' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Meet Our Team</h2>
              {staff.length > 0 ? (
                <StaffProfiles staff={staff} />
              ) : (
                <p className="text-gray-500 text-center py-4">Staff information is not available at the moment.</p>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                <Link to={`/reviews/add/${salon._id}`}>
                  <Button variant="outline">Write a Review</Button>
                </Link>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b pb-6 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{review.user.name}</h3>
                          <div className="flex items-center mt-1 mb-2">
                            <div className="flex mr-2">{renderStars(review.rating)}</div>
                            <span className="text-gray-500 text-sm">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No reviews yet. Be the first to write a review!</p>
                  <Link to={`/reviews/add/${salon._id}`}>
                    <Button variant="primary">Write a Review</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalonDetails; 