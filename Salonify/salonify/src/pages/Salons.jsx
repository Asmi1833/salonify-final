import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SalonCard from '../components/SalonCard';
import Spinner from '../components/UI/Spinner';

const Salons = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/salons`);
        setSalons(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch salons. Please try again later.');
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Salons</h1>
      {salons.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No salons found. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salons.map((salon) => (
            <SalonCard key={salon._id} salon={salon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Salons; 