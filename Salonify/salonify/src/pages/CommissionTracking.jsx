import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiUsers, FiCalendar } from 'react-icons/fi';

const CommissionTracking = () => {
  const [staffCommissions, setStaffCommissions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [commissionStats, setCommissionStats] = useState({
    totalCommissions: 0,
    averageCommission: 0,
    topEarner: '',
    totalServices: 0
  });

  useEffect(() => {
    // TODO: Replace with actual API call
    fetchCommissionData();
  }, [selectedMonth]);

  const fetchCommissionData = () => {
    // Simulated API call
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          staffName: 'John Smith',
          role: 'Senior Stylist',
          services: 45,
          revenue: 3600,
          commissionRate: 30,
          commissionEarned: 1080,
          performance: 95
        },
        {
          id: 2,
          staffName: 'Sarah Johnson',
          role: 'Beautician',
          services: 38,
          revenue: 2800,
          commissionRate: 25,
          commissionEarned: 700,
          performance: 88
        }
      ];

      setStaffCommissions(mockData);
      setCommissionStats({
        totalCommissions: mockData.reduce((sum, staff) => sum + staff.commissionEarned, 0),
        averageCommission: mockData.reduce((sum, staff) => sum + staff.commissionEarned, 0) / mockData.length,
        topEarner: mockData.reduce((prev, current) => 
          prev.commissionEarned > current.commissionEarned ? prev : current
        ).staffName,
        totalServices: mockData.reduce((sum, staff) => sum + staff.services, 0)
      });
      setLoading(false);
    }, 1000);
  };

  const StatCard = ({ icon: Icon, title, value, suffix = '' }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {suffix === '$' ? `${suffix}${value.toLocaleString()}` : `${value.toLocaleString()}${suffix}`}
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Commission Tracking</h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor staff performance and earnings
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="month" className="text-sm font-medium text-gray-700">
              Select Month
            </label>
            <input
              type="month"
              id="month"
              name="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiDollarSign}
            title="Total Commissions"
            value={commissionStats.totalCommissions}
            suffix="$"
          />
          <StatCard
            icon={FiTrendingUp}
            title="Average Commission"
            value={Math.round(commissionStats.averageCommission)}
            suffix="$"
          />
          <StatCard
            icon={FiUsers}
            title="Top Earner"
            value={commissionStats.topEarner}
          />
          <StatCard
            icon={FiCalendar}
            title="Total Services"
            value={commissionStats.totalServices}
          />
        </div>

        {/* Commission Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Staff Commissions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Earned
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffCommissions.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{staff.staffName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{staff.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staff.services}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${staff.revenue.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staff.commissionRate}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${staff.commissionEarned.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${
                              staff.performance >= 90 ? 'bg-green-500' :
                              staff.performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${staff.performance}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-500">{staff.performance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionTracking; 