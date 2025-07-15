import React from 'react';
import {
  FileText,
  CalendarCheck,
  BarChart2,
  AlertTriangle,
  ClockAlert,
  Eye,
  CalendarClock
} from 'lucide-react';

const iconMap = {
  file: <FileText className="text-blue-500" />,
  calendar: <CalendarCheck className="text-green-500" />,
  chart: <BarChart2 className="text-purple-500" />,
  alert: <AlertTriangle className="text-red-500" />,
  access: <ClockAlert className="text-indigo-500" />,
  countdown: <CalendarClock className="text-yellow-500" />,
};

const StatCard = ({ title, value, icon, color = "gray" }) => {
  return (
    <div className={`bg-white text-2xl dark:bg-gray-800 rounded-xl shadow-md p-4 flex justify-between items-center hover:-translate hover:shadow-l hover:ring-1 hover:ring-blue-100 dark:hover:ring-gray-700"`}>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{value}</h3>
      </div>
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
        {iconMap[icon] || null}
      </div>
    </div>
  );
};

export default StatCard;
