import React from 'react';
import { AlertTriangle, Pill } from 'lucide-react';

const allergyList = [
  {
    name: "Penicillin",
    severity: "high",
    description: "Causes skin rashes and breathing issues"
  },
  {
    name: "Lactose",
    severity: "medium",
    description: "Triggers indigestion and nausea"
  },
  {
    name: "Ibuprofen",
    severity: "low",
    description: "May cause mild headaches or dizziness"
  }
];

const severityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800'
};

const AllergyNotices = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">Allergy Notices</h3>

      {allergyList.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No current allergy warnings.</p>
      ) : (
        <ul className="space-y-4">
          {allergyList.map((item, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-md ${severityColors[item.severity]} transition`}
            >
              <div className="mt-1">
                {item.severity === "high" ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <Pill className="w-5 h-5 text-current" />
                )}
              </div>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllergyNotices;
