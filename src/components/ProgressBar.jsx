import React from 'react';

const ProgressBar = ({ value }) => {
  return (
    <div className="flex items-center space-x-2 w-full max-w-md mx-auto mt-10">
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
        <div
          className="h-full bg-yellow-400 transition-all duration-300"
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <span className="text-green-600 font-semibold">{value}%</span>
    </div>
  );
};

export default ProgressBar;