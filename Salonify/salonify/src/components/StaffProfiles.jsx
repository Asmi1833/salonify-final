import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StaffProfiles = ({ staff }) => {
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const renderStars = (rating) => {
    return (
      <div className="flex">
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

  const handleStaffClick = (staffId) => {
    setSelectedStaffId(selectedStaffId === staffId ? null : staffId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {staff.map((member) => (
        <div 
          key={member._id}
          className={`bg-white rounded-lg shadow-md overflow-hidden border-2 cursor-pointer transition-all ${
            selectedStaffId === member._id 
              ? 'border-primary-500 shadow-lg' 
              : 'border-transparent hover:shadow-lg'
          }`}
          onClick={() => handleStaffClick(member._id)}
        >
          <div className="relative">
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-6xl font-light text-gray-400">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h3 className="text-xl font-semibold text-white">{member.name}</h3>
              <p className="text-white opacity-90">{member.position}</p>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                {renderStars(member.rating || 0)}
              </div>
              <div className="text-sm text-gray-600">
                {member.yearsOfExperience} years exp.
              </div>
            </div>
            
            {selectedStaffId === member._id && (
              <div className="mt-4 border-t pt-4">
                <p className="text-gray-700 mb-4">{member.bio || 'No bio available.'}</p>
                
                {member.specialties && member.specialties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
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
                
                {member.availability && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Availability:</p>
                    <div className="grid grid-cols-1 gap-1 text-sm">
                      {Object.entries(member.availability).map(([day, hours]) => (
                        <div key={day} className="flex">
                          <span className="font-medium w-20">{day}:</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StaffProfiles; 