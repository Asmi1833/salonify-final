import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getSalonById, getServiceById, createReview } from '../services/api';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Spinner from '../components/UI/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { FaStar } from 'react-icons/fa';

const AddReview = () => {
  const { id } = useParams(); // Salon ID
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const serviceId = searchParams.get('service');

  const [salon, setSalon] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/reviews/add/' + id);
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const salonData = await getSalonById(id);
        setSalon(salonData);
        
        if (serviceId) {
          const serviceData = await getServiceById(serviceId);
          setService(serviceData);
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, serviceId, isAuthenticated, navigate]);
  
  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating < 1 || !formData.comment) {
      setError('Please provide a rating and comment');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const reviewData = {
        salon: id,
        service: serviceId || undefined,
        rating: formData.rating,
        comment: formData.comment,
      };
      
      await createReview(reviewData);
      
      setSuccess(true);
      // Reset form
      setFormData({
        rating: 5,
        comment: '',
      });
      
      // Redirect after short delay
      setTimeout(() => {
        navigate(`/salons/${id}`);
      }, 2000);
      
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const StarRating = ({ rating, onRatingChange }) => {
    const [hover, setHover] = useState(null);
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          
          return (
            <label key={index} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                className="hidden"
                onClick={() => onRatingChange(ratingValue)}
              />
              <FaStar
                className="text-2xl mr-1"
                color={ratingValue <= (hover || rating) ? '#FFA41C' : '#e4e5e9'}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          );
        })}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }
  
  if (!salon) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg mb-4">Salon not found</p>
        <Button variant="primary" onClick={() => navigate('/salons')}>
          Back to Salons
        </Button>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
          <p className="text-gray-600 mb-8">
            for {salon.name} {service ? `- ${service.name}` : ''}
          </p>
          
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Thank You For Your Review!</h2>
              <p className="mb-6">
                Your review has been successfully submitted. You will be redirected to the salon page.
              </p>
              <Link to={`/salons/${id}`}>
                <Button variant="primary">
                  Back to Salon
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Your Rating
                  </label>
                  <StarRating
                    rating={formData.rating}
                    onRatingChange={handleRatingChange}
                  />
                </div>
                
                {/* Review Comment */}
                <div className="mb-6">
                  <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Share your experience at this salon..."
                    required
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">
                    Your review helps others learn about this salon
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/salons/${id}`)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={submitting}
                  >
                    {submitting ? <Spinner size="sm" color="white" className="mr-2" /> : null}
                    Submit Review
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddReview; 