import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiClock, FiStar, FiScissors, FiSettings } from 'react-icons/fi';

const SalonOwnerDashboard = () => {
  const [metrics, setMetrics] = useState({
    todayAppointments: 0,
    todayRevenue: 0,
    activeStaff: 0,
    monthlyGrowth: 0,
    upcomingAppointments: [],
    recentReviews: [],
    popularServices: []
  });

  useEffect(() => {
    // TODO: Fetch real data from your API
    // This is mock data for demonstration
    setMetrics({
      todayAppointments: 12,
      todayRevenue: 850,
      activeStaff: 5,
      monthlyGrowth: 15,
      upcomingAppointments: [
        { id: 1, client: 'John Doe', service: 'Haircut', time: '14:00' },
        { id: 2, client: 'Jane Smith', service: 'Manicure', time: '15:30' }
      ],
      recentReviews: [
        { id: 1, client: 'Alice Brown', rating: 5, comment: 'Excellent service!' },
        { id: 2, client: 'Bob Wilson', rating: 4, comment: 'Very professional' }
      ],
      popularServices: [
        { id: 1, name: 'Haircut', bookings: 45 },
        { id: 2, name: 'Manicure', bookings: 32 }
      ]
    });
  }, []);

  const MetricCard = ({ icon: Icon, title, value, suffix = '' }) => (
    <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {suffix === '$' ? `${suffix}${value}` : `${value}${suffix}`}
          </p>
        </div>
        <div className="bg-blue-50 p-3 rounded-full">
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Salon Dashboard</h1>
          <div className="flex space-x-4">
            <Link
              to="/staff/manage"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiUsers className="mr-2 -ml-1 h-5 w-5" />
              Manage Staff
            </Link>
            <Link
              to="/services/manage"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiScissors className="mr-2 -ml-1 h-5 w-5" />
              Manage Services
            </Link>
            <Link
              to="/salon/settings"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiSettings className="mr-2 -ml-1 h-5 w-5" />
              Salon Settings
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={FiCalendar}
            title="Today's Appointments"
            value={metrics.todayAppointments}
          />
          <MetricCard
            icon={FiDollarSign}
            title="Today's Revenue"
            value={metrics.todayRevenue}
            suffix="$"
          />
          <MetricCard
            icon={FiUsers}
            title="Active Staff"
            value={metrics.activeStaff}
          />
          <MetricCard
            icon={FiTrendingUp}
            title="Monthly Growth"
            value={metrics.monthlyGrowth}
            suffix="%"
          />
        </div>

        {/* Appointments and Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
              <Link
                to="/salon/appointments"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {metrics.upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <FiClock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.client}</p>
                      <p className="text-sm text-gray-500">{appointment.service}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-900">{appointment.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Reviews</h2>
              <Link
                to="/salon/reviews"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {metrics.recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{review.client}</p>
                    <div className="flex items-center">
                      <FiStar className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Services */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Popular Services</h2>
            <Link
              to="/services/analytics"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View analytics
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.popularServices.map((service) => (
              <div
                key={service.id}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-500">{service.bookings} bookings this month</p>
                  </div>
                  <FiScissors className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonOwnerDashboard; 