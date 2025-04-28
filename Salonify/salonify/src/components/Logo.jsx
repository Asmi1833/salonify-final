import React from 'react';
import { FiScissors, FiStar } from 'react-icons/fi';

const Logo = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex items-center">
        {/* Background shape */}
        <div className="absolute -left-2 -top-2 w-12 h-12 bg-blue-100 rounded-full opacity-50"></div>
        
        {/* Main logo icon */}
        <div className="relative">
          <FiScissors className="w-8 h-8 text-blue-600 transform -rotate-45" />
          <FiStar className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-current" />
        </div>

        {/* Logo text */}
        <div className="ml-3">
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Salon</span>
            <span className="text-gray-800">ify</span>
          </span>
          <span className="block text-xs text-blue-600 -mt-1 font-medium tracking-wider">BEAUTY & STYLE</span>
        </div>
      </div>
    </div>
  );
};

export default Logo; 