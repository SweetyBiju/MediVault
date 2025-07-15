import React from 'react';

const EmergencyHealthCard = () => {
  return (
    <div className="fixed bottom-4 right-4 w-[170px] bg-white dark:bg-gray-800 border border-red-500 rounded-lg shadow-lg z-30 p-3">
      <h4 className="text-xs font-bold text-red-700 dark:text-red-400 mb-2 text-center">
        Emergency QR
      </h4>
      <div className="flex justify-center">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Emergency+Health+Info"
          alt="QR Code"
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default EmergencyHealthCard;
