import React from 'react';
import { Pill, ShoppingCart, Repeat } from 'lucide-react';

const medications = [
  {
    name: "Metformin",
    dosage: "500mg",
    startDate: "2025-07-01",
    totalPills: 28,
    dailyDosage: 2,
  },
  {
    name: "Amlodipine",
    dosage: "5mg",
    startDate: "2025-07-05",
    totalPills: 12,
    dailyDosage: 1,
  },
  {
    name: "Atorvastatin",
    dosage: "10mg",
    startDate: "2025-06-25",
    totalPills: 7,
    dailyDosage: 1,
  }
];

const getPillColor = (count) => {
  if (count > 20) return "text-green-600";
  if (count <= 20 && count >= 10) return "text-yellow-500";
  return "text-red-500";
};

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const calculateEndDate = (start, total, perDay) => {
  const days = Math.floor(total / perDay);
  const end = new Date(start);
  end.setDate(end.getDate() + days);
  return end;
};

const MedicationHistory = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Current Medications</h3>

      <ul className="space-y-4">
        {medications.map((med, idx) => {
          const pillsLeft = med.totalPills;
          const pillColor = getPillColor(pillsLeft);
          const isLow = pillsLeft < 10;
          const isMid = pillsLeft < 20;
          const endDate = calculateEndDate(med.startDate, med.totalPills, med.dailyDosage);
          const courseDuration = `${formatDate(med.startDate)} → ${formatDate(endDate)}`;

          return (
            <li
              key={idx}
              className="border border-gray-200 dark:border-gray-700 p-4 rounded-md bg-gray-50 dark:bg-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              {/* Left: Medicine info */}
              <div className="flex items-start gap-3">
                <Pill className="text-indigo-500 w-5 h-5 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {med.name} ({med.dosage})
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">{courseDuration}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">Daily: {med.dailyDosage} pill(s)</p>
                </div>
              </div>

              {/* Right: Actions and status */}
              <div className="flex flex-col gap-2 items-start sm:items-end">
                <p className={`text-xs font-semibold ${pillColor}`}>
                  {pillsLeft} pills remaining
                </p>

                <button
                  className={`flex items-center gap-1 text-xs px-3 py-1 rounded-md transition
                    ${pillsLeft > 20
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : pillsLeft > 10
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  onClick={() => alert(`Redirecting to buy ${med.name}`)}
                >
                  <ShoppingCart size={14} /> Buy Now
                </button>

                {isLow && (
                  <button
                    className="flex items-center gap-1 text-xs px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500 transition"
                    onClick={() => alert(`Repeating course for ${med.name}`)}
                  >
                    <Repeat size={14} /> Repeat Course
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MedicationHistory;
