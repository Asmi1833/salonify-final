import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SalonCard = ({ salon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img
          src={salon.images[0]}
          alt={salon.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold">
          {salon.rating} ★
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{salon.name}</h3>
        <p className="text-gray-600 mb-2">{salon.description}</p>
        <div className="flex items-center text-gray-500 mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{salon.address}</span>
        </div>
        <div className="flex items-center text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{salon.opening_time} - {salon.closing_time}</span>
        </div>
        <Link
          to={`/salons/${salon._id}`}
          className="block w-full text-center bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

SalonCard.propTypes = {
  salon: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    rating: PropTypes.number.isRequired,
    opening_time: PropTypes.string.isRequired,
    closing_time: PropTypes.string.isRequired,
  }).isRequired,
};

export default SalonCard; 