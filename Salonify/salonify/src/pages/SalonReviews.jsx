import React, { useState, useEffect } from 'react';
import { FiStar, FiSearch, FiFilter, FiCalendar } from 'react-icons/fi';

const SalonReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, positive, negative
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        const mockReviews = [
          {
            id: 1,
            customerName: 'John Doe',
            rating: 5,
            comment: 'Excellent service! The stylist was very professional and skilled.',
            service: 'Haircut',
            date: '2024-03-20',
            staffMember: 'Sarah Smith'
          },
          {
            id: 2,
            customerName: 'Jane Smith',
            rating: 4,
            comment: 'Great experience overall. Will definitely come back.',
            service: 'Manicure',
            date: '2024-03-19',
            staffMember: 'Mike Johnson'
          },
          {
            id: 3,
            customerName: 'Alice Brown',
            rating: 3,
            comment: 'Good service but had to wait a bit longer than expected.',
            service: 'Hair Coloring',
            date: '2024-03-18',
            staffMember: 'Emily Davis'
          }
        ];
        setReviews(mockReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [filter, dateRange]);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.service.toLowerCase().includes(searchTerm.toLowerCase());
    const reviewDate = new Date(review.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const isInDateRange = reviewDate >= startDate && reviewDate <= endDate;
    
    const matchesFilter = filter === 'all' ||
                         (filter === 'positive' && review.rating >= 4) ||
                         (filter === 'negative' && review.rating <= 2);
    
    return matchesSearch && isInDateRange && matchesFilter;
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`h-5 w-5 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Salon Reviews</h1>
        <p className="text-gray-600">View and manage all customer reviews for your salon</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          />
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          />
        </div>

        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Reviews</option>
          <option value="positive">Positive Reviews (4-5 ★)</option>
          <option value="negative">Negative Reviews (1-2 ★)</option>
        </select>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No reviews found
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{review.customerName}</h3>
                  <p className="text-sm text-gray-500">{review.service}</p>
                </div>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{review.comment}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <FiCalendar className="mr-2" />
                  {review.date}
                </div>
                <p>Served by: {review.staffMember}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SalonReviews; 