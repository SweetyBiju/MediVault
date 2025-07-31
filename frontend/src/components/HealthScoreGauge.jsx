import React from "react";
import { Calendar, Clock, HeartPulse } from "lucide-react";

const HealthScoreGauge = ({ score = 78 }) => {
  // Color and risk based on score
  const getScoreColor = (val) => {
    if (val >= 80) return "bg-green-500";
    if (val >= 60) return "bg-yellow-400";
    return "bg-red-500";
  };

  const getRiskLabel = (val) => {
    if (val >= 80) return { label: "Low", color: "bg-green-100 text-green-800" };
    if (val >= 60) return { label: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { label: "High", color: "bg-red-100 text-red-800" };
  };

  const scoreColor = getScoreColor(score);
  const risk = getRiskLabel(score);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6 w-full max-w-6xl mx-auto relative">
      {/* Circle fill container */}
      <div className="relative w-36 h-36 rounded-full border-4 border-gray-200 overflow-hidden shadow-inner flex items-center justify-center">
        <div
          className={`absolute bottom-0 left-0 w-full ${scoreColor}`}
          style={{
            height: `${score}%`,
            transition: "height 1s ease-in-out",
            borderRadius: "0 0 9999px 9999px",
          }}
        />
        <span className="z-10 text-2xl font-semibold text-gray-900 dark:text-white">
          {score}%
        </span>
      </div>

      {/* Right Side Info */}
      <div className="flex-1 flex flex-col justify-center items-start text-left gap-2">
        <div className="flex items-center gap-2">
          <HeartPulse className="text-red-500" size={18} />
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${risk.color}`}>
            Risk Level: {risk.label}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm mt-2 text-gray-700 dark:text-gray-300">
          <Calendar size={18} />
          <span><strong>Last Checkup:</strong> July 4, 2025</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Clock size={18} />
          <span><strong>Next Appointment:</strong> Aug 10, 2025</span>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 italic">
          All vitals appear stable. Remember to keep up with your appointments.
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 items-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">
          View Details →
        </button>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg shadow transition">
          See AI Insights →
        </button>
      </div>
    </div>
  );
};

export default HealthScoreGauge;
