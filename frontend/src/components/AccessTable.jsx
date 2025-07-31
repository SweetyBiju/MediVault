import React, { useState } from 'react';
import { Eye, XCircle } from 'lucide-react';

const AccessHistory = () => {
  const [history, setHistory] = useState([
    {
      doctor: "Dr. Ananya Mitra",
      file: "sugar_report.pdf",
      time: "July 10, 2025 – 12:34 PM"
    },
    {
      doctor: "Dr. Rakesh Nandi",
      file: "bp_tracking.xlsx",
      time: "July 8, 2025 – 9:00 AM"
    }
  ]);

  const handleRevoke = (index) => {
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Access History</h3>

      {history.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">No access history yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {history.map((entry, idx) => (
            <li key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="text-blue-500 w-5 h-5" />
                <div className="text-sm">
                  <p className="text-gray-800 dark:text-white font-medium">{entry.doctor}</p>
                  <p className="text-gray-500 dark:text-gray-300 text-xs">
                    {entry.file} • {entry.time}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRevoke(idx)}
                className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition"
              >
                <XCircle className="w-4 h-4" /> Revoke
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccessHistory;
