import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    bio: '',
    image: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch staff members
    fetchStaff();
  }, []);

  const fetchStaff = () => {
    // First try to get data from localStorage
    try {
      const savedStaff = localStorage.getItem('salon_staff');
      if (savedStaff) {
        const parsedStaff = JSON.parse(savedStaff);
        console.log('Loading staff from localStorage:', parsedStaff);
        setStaff(parsedStaff);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.warn('Error loading staff from localStorage:', error);
    }

    // If no localStorage data, use simulated API call
    // This would be replaced with an actual API call in production
    setTimeout(() => {
      const defaultStaff = [
        {
          id: '1',
          name: 'Priya Sharma',
          role: 'Senior Stylist',
          phone: '+91 9876543210',
          email: 'priya@example.com',
          bio: 'Priya is a talented stylist with over 5 years of experience in hair styling and coloring.',
          image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3'
        },
        {
          id: '2',
          name: 'Rahul Singh',
          role: 'Barber',
          phone: '+91 9876543211',
          email: 'rahul@example.com',
          bio: 'Rahul specializes in modern haircuts and traditional shaving techniques.',
          image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3'
        },
        {
          id: '3',
          name: 'Neha Gupta',
          role: 'Nail Technician',
          phone: '+91 9876543212',
          email: 'neha@example.com',
          bio: 'Neha is a certified nail technician with expertise in nail art and extensions.',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3'
        }
      ];
      setStaff(defaultStaff);
      
      // Store default staff in localStorage for future use
      try {
        localStorage.setItem('salon_staff', JSON.stringify(defaultStaff));
      } catch (error) {
        console.warn('Error saving default staff to localStorage:', error);
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
    if (!formData.name || !formData.role) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    let updatedStaffList;
    
    // Save the staff member (create new or update existing)
    if (currentStaff) {
      // Update existing staff
      updatedStaffList = staff.map(member => 
        member.id === currentStaff.id 
          ? { ...member, ...formData }
          : member
      );
      setStaff(updatedStaffList);
      setSuccessMessage('Staff member updated successfully!');
    } else {
      // Create new staff
      const newStaff = {
        id: Date.now().toString(),
        ...formData
      };
      updatedStaffList = [...staff, newStaff];
      setStaff(updatedStaffList);
      setSuccessMessage('New staff member added successfully!');
    }
    
    // Persist staff data to localStorage
    try {
      localStorage.setItem('salon_staff', JSON.stringify(updatedStaffList));
      console.log('Staff data saved to localStorage:', updatedStaffList);
    } catch (error) {
      console.error('Error saving staff data to localStorage:', error);
      setErrorMessage('Staff saved but may not persist between page refreshes');
    }

    // Reset form
    resetForm();
  };

  const editStaff = (member) => {
    setCurrentStaff(member);
    setFormData({
      name: member.name,
      role: member.role,
      phone: member.phone || '',
      email: member.email || '',
      bio: member.bio || '',
      image: member.image || ''
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const deleteStaff = (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      const updatedStaff = staff.filter(member => member.id !== staffId);
      setStaff(updatedStaff);
      
      // Update localStorage
      try {
        localStorage.setItem('salon_staff', JSON.stringify(updatedStaff));
        console.log('Updated staff data in localStorage after deletion');
      } catch (error) {
        console.error('Error updating localStorage after staff deletion:', error);
      }
      
      setSuccessMessage('Staff member deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      phone: '',
      email: '',
      bio: '',
      image: ''
    });
    setCurrentStaff(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Manage Staff</h1>
          <p className="text-gray-600">Add, edit or remove staff members from your salon</p>
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
          Add New Staff Member
        </button>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
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
                  Role/Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  Bio/Description
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
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
                {currentStaff ? 'Update Staff Member' : 'Add Staff Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Your Staff</h3>
          <p className="mt-1 text-sm text-gray-500">A list of all the staff members at your salon</p>
        </div>
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading staff members...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-600">No staff members found. Add staff to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {staff.map((member) => (
              <div key={member.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="h-20 w-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-blue-600">{member.role}</p>
                  {member.phone && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Phone:</span> {member.phone}
                    </p>
                  )}
                  {member.email && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {member.email}
                    </p>
                  )}
                  {member.bio && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{member.bio}</p>
                  )}
                  <div className="flex justify-end mt-4 space-x-2">
                    <button
                      onClick={() => editStaff(member)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStaff(member.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStaff; 