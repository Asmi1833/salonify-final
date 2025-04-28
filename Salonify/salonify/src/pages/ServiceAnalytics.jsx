import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiUsers, FiCalendar, FiClock } from 'react-icons/fi';

const ServiceAnalytics = () => {
  const [timeframe, setTimeframe] = useState('month'); // week, month, year
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceAnalytics = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        const mockServices = [
          {
            id: 1,
            name: 'Haircut',
            bookings: 45,
            revenue: 1350,
            avgDuration: 45,
            popularityTrend: '+12%',
            customerSatisfaction: 4.8,
            topStaff: 'Sarah Smith',
            peakTimes: ['10:00 AM', '2:00 PM'],
            monthlyStats: {
              bookings: [35, 38, 42, 45],
              revenue: [1050, 1140, 1260, 1350]
            }
          },
          {
            id: 2,
            name: 'Hair Coloring',
            bookings: 32,
            revenue: 2240,
            avgDuration: 120,
            popularityTrend: '+8%',
            customerSatisfaction: 4.6,
            topStaff: 'Mike Johnson',
            peakTimes: ['11:00 AM', '3:00 PM'],
            monthlyStats: {
              bookings: [28, 30, 31, 32],
              revenue: [1960, 2100, 2170, 2240]
            }
          },
          {
            id: 3,
            name: 'Manicure',
            bookings: 38,
            revenue: 950,
            avgDuration: 60,
            popularityTrend: '+15%',
            customerSatisfaction: 4.7,
            topStaff: 'Emily Davis',
            peakTimes: ['2:00 PM', '4:00 PM'],
            monthlyStats: {
              bookings: [30, 33, 36, 38],
              revenue: [750, 825, 900, 950]
            }
          }
        ];
        setServices(mockServices);
      } catch (error) {
        console.error('Error fetching service analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAnalytics();
  }, [timeframe]);

  const MetricCard = ({ icon: Icon, title, value, trend = null, suffix = '' }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {suffix === '$' ? `${suffix}${value}` : `${value}${suffix}`}
          </p>
          {trend && (
            <p className={`text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="bg-blue-50 p-3 rounded-full">
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Analytics</h1>
          <p className="text-gray-600">Track and analyze your salon's service performance</p>
        </div>

        {/* Timeframe Selection */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-4 py-2 rounded-md ${
                timeframe === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-4 py-2 rounded-md ${
                timeframe === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-4 py-2 rounded-md ${
                timeframe === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              This Year
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                      icon={FiUsers}
                      title="Total Bookings"
                      value={service.bookings}
                      trend={service.popularityTrend}
                    />
                    <MetricCard
                      icon={FiDollarSign}
                      title="Revenue"
                      value={service.revenue}
                      suffix="$"
                    />
                    <MetricCard
                      icon={FiClock}
                      title="Avg. Duration"
                      value={service.avgDuration}
                      suffix=" min"
                    />
                    <MetricCard
                      icon={FiTrendingUp}
                      title="Customer Satisfaction"
                      value={service.customerSatisfaction}
                      suffix="/5"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Top Performing Staff</h3>
                      <p className="text-base font-medium text-gray-900">{service.topStaff}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Peak Hours</h3>
                      <div className="flex space-x-2">
                        {service.peakTimes.map((time, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Growth</h3>
                      <div className="flex items-center space-x-2">
                        <FiTrendingUp className="text-green-500" />
                        <span className="text-green-600">{service.popularityTrend}</span>
                      </div>
                    </div>
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

export default ServiceAnalytics; 