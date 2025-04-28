import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ManageServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch services for this salon owner
    fetchServices();
  }, []);

  const fetchServices = () => {
    // First try to get data from localStorage
    try {
      const savedServices = localStorage.getItem('salon_services');
      if (savedServices) {
        const parsedServices = JSON.parse(savedServices);
        console.log('Loading services from localStorage:', parsedServices);
        setServices(parsedServices);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.warn('Error loading services from localStorage:', error);
    }

    // If no localStorage data, use simulated API call
    // This would be replaced with an actual API call in production
    setTimeout(() => {
      const defaultServices = [
        {
          id: '1',
          name: 'Haircut & Styling',
          description: 'Professional haircut and styling service with our experienced stylists.',
          price: 800,
          duration: 60,
          image: 'https://images.unsplash.com/photo-1595944024804-5f64103fb0c1?ixlib=rb-4.0.3'
        },
        {
          id: '2',
          name: 'Manicure & Pedicure',
          description: 'Complete nail care package including manicure and pedicure.',
          price: 1200,
          duration: 90,
          image: 'https://images.unsplash.com/photo-1610992235683-e39ada262e80?ixlib=rb-4.0.3'
        },
        {
          id: '3',
          name: 'Facial Treatment',
          description: 'Revitalizing facial treatment to cleanse and rejuvenate your skin.',
          price: 1500,
          duration: 60,
          image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3'
        }
      ];
      setServices(defaultServices);
      
      // Store default services in localStorage for future use
      try {
        localStorage.setItem('salon_services', JSON.stringify(defaultServices));
      } catch (error) {
        console.warn('Error saving default services to localStorage:', error);
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate form
    if (!formData.name || !formData.price || !formData.duration) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    let updatedServicesList;
    
    // Save the service (create new or update existing)
    if (currentService) {
      // Update existing service
      updatedServicesList = services.map(service => 
        service.id === currentService.id 
          ? { ...service, ...formData, price: parseFloat(formData.price), duration: parseInt(formData.duration) }
          : service
      );
      setServices(updatedServicesList);
      setSuccessMessage('Service updated successfully!');
    } else {
      // Create new service
      const newService = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration)
      };
      updatedServicesList = [...services, newService];
      setServices(updatedServicesList);
      setSuccessMessage('New service added successfully!');
    }
    
    // Persist services data to localStorage
    try {
      localStorage.setItem('salon_services', JSON.stringify(updatedServicesList));
      console.log('Services data saved to localStorage:', updatedServicesList);
    } catch (error) {
      console.error('Error saving services data to localStorage:', error);
      setErrorMessage('Service saved but may not persist between page refreshes');
    }

    // Reset form
    resetForm();
  };

  const editService = (service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      duration: service.duration.toString(),
      image: service.image || ''
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const deleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const updatedServices = services.filter(service => service.id !== serviceId);
      setServices(updatedServices);
      
      // Update localStorage
      try {
        localStorage.setItem('salon_services', JSON.stringify(updatedServices));
        console.log('Updated services data in localStorage after deletion');
      } catch (error) {
        console.error('Error updating localStorage after service deletion:', error);
      }
      
      setSuccessMessage('Service deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      image: ''
    });
    setCurrentService(null);
    setShowForm(false);
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Manage Services</h1>
          <p className="text-gray-600">Add, edit or remove services from your salon</p>
        </div>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Dashboard
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>{successMessage}</p>
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center mb-6"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Service
        </button>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentService ? 'Edit Service' : 'Add New Service'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {currentService ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Your Services</h3>
          <p className="mt-1 text-sm text-gray-500">A list of all the services your salon offers</p>
        </div>
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-600">No services found. Add a new service to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {service.image && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img className="h-10 w-10 rounded-full object-cover" src={service.image} alt={service.name} />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          {service.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{service.duration} minutes</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(service.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => editService(service)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageServices; 