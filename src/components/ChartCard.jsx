import React from 'react';
import { Line } from 'react-chartjs-2';

const ChartCard = ({ title, label, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg hover:ring-1 hover:ring-blue-400 transition duration-300">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="w-full h-48">
        {children}
      </div>
      {label && <p className="text-sm text-gray-500 mt-2 text-center">{label}</p>}
    </div>
  );
};

export default ChartCard;
