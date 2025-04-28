import { useState } from 'react';
import Button from './UI/Button';
import { FaStar } from 'react-icons/fa';

const StaffTable = ({ staff, showAvailability = false }) => {
  const [expandedStaffId, setExpandedStaffId] = useState(null);

  const toggleExpand = (staffId) => {
    setExpandedStaffId(expandedStaffId === staffId ? null : staffId);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Staff Member
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Experience
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {staff.map((member) => (
            <>
              <tr key={member._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {member.image ? (
                      <img
                        className="h-10 w-10 rounded-full mr-3 object-cover"
                        src={member.image}
                        alt={member.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStars(member.rating || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.yearsOfExperience} years
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpand(member._id)}
                  >
                    {expandedStaffId === member._id ? 'Hide Details' : 'View Details'}
                  </Button>
                </td>
              </tr>
              {expandedStaffId === member._id && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 bg-gray-50">
                    <div className="text-sm text-gray-700 mb-3">
                      <div className="font-medium mb-2">About {member.name}:</div>
                      <p className="mb-4">{member.bio || 'No bio available.'}</p>
                      
                      {showAvailability && member.availability && (
                        <div>
                          <div className="font-medium mb-2">Availability:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.entries(member.availability).map(([day, hours]) => (
                              <div key={day} className="flex">
                                <span className="font-medium w-24">{day}:</span>
                                <span>{hours}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {member.specialties && member.specialties.length > 0 && (
                        <div className="mt-4">
                          <div className="font-medium mb-2">Specialties:</div>
                          <div className="flex flex-wrap gap-2">
                            {member.specialties.map((specialty, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable; 