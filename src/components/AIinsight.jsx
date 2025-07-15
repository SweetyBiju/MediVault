import React from 'react';
import { Lightbulb, HeartPulse, Syringe, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const icons = {
  general: <Lightbulb className="text-blue-500" />,
  heart: <HeartPulse className="text-red-500" />,
  diabetes: <Syringe className="text-orange-500" />,
  alert: <AlertTriangle className="text-yellow-500" />
};

const AIInsightCard = ({ type = "general", title, summary }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md transition hover:shadow-xl flex flex-col justify-between w-full max-w-sm">
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
          {icons[type]}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{summary}</p>
      <button
        onClick={() => navigate('/insights')}
        className="mt-4 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
      >
        View Details →
      </button>
    </div>
  );
};

export default AIInsightCard;
