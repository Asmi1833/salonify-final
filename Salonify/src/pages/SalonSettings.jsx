import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUpload, FiClock, FiMapPin, FiPhone, FiMail, FiDollarSign } from 'react-icons/fi';

const SalonSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [salonData, setSalonData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    openingHours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '09:00', close: '18:00', isOpen: true },
      sunday: { open: '09:00', close: '18:00', isOpen: false }
    },
    paymentMethods: {
      cash: true,
      card: true,
      upi: true,
      wallet: false
    },
    images: []
  });

  const fetchSalonDetails = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const token = localStorage.getItem('token');

    try {
      // First try to get data from API
      if (token) {
        const response = await fetch(`${API_URL}/api/salons`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.salons?.length > 0) {
            const userSalon = data.salons.find(salon => 
              salon.owner && (salon.owner === user._id || salon.owner._id === user._id)
            );
            
            if (userSalon) {
              setSalonData(prev => ({
                ...prev,
                ...userSalon,
                openingHours: userSalon.openingHours || prev.openingHours,
                paymentMethods: userSalon.paymentMethods || prev.paymentMethods
              }));
              setLoading(false);
              return;
            }
          }
        }
      }

      // If API fails, try localStorage
      const savedSettings = localStorage.getItem('salon_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSalonData(prev => ({
          ...prev,
          ...parsedSettings
        }));
      }
    } catch (error) {
      console.error('Error fetching salon data:', error);
      setErrorMessage('Failed to load salon settings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchSalonDetails();
  }, [fetchSalonDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setSalonData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: field === 'isOpen' ? value === 'true' : value
        }
      }));
    } else {
      setSalonData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setSalonData(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setSaving(true);

    try {
      // Validate required fields
      const requiredFields = ['name', 'address', 'phone', 'email'];
      const missingFields = requiredFields.filter(field => !salonData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(salonData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone number
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(salonData.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('token');

      // Save to localStorage first for offline support
      localStorage.setItem('salon_settings', JSON.stringify(salonData));

      // Try to save to API
      if (token) {
        const response = await fetch(`${API_URL}/api/salons/update-settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...salonData,
            owner_id: user?._id
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update salon settings on the server');
        }
      }

      setSuccessMessage('Salon settings updated successfully!');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error saving salon settings:', error);
      setErrorMessage(error.message || 'Failed to update salon settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading salon details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Salon Settings</h1>
          <p className="text-gray-600">Manage your salon profile and details</p>
        </div>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Rest of your existing JSX remains the same */}
      {/* ... */}
    </div>
  );
};

export default SalonSettings; 