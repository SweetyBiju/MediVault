import React from 'react';
import { AlertTriangle, HeartPulse, TrendingDown, TrendingUp } from 'lucide-react';

const AIInsightsCard = () => {
  const insights = [
    {
      icon: <TrendingUp className="w-5 h-5 text-orange-500" />,
      title: "Blood Pressure Increasing",
      description: "Your average BP is trending higher this month. Consider lifestyle adjustments."
    },
    {
      icon: <TrendingDown className="w-5 h-5 text-green-500" />,
      title: "Blood Sugar Stable",
      description: "Glucose levels have been stable over the past 2 weeks."
    },
    {
      icon: <HeartPulse className="w-5 h-5 text-blue-500" />,
      title: "Mild Tachycardia Noted",
      description: "Pulse rate occasionally elevated post-lunch. Monitor further."
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      title: "Missed Medication Alert",
      description: "You missed your hypertension medication twice last week."
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 w-full">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">🧠 AI Health Insights</h2>
      <ul className="space-y-4">
        {insights.map((insight, idx) => (
          <li key={idx} className="flex items-start justify-between gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition">
            <div className="flex gap-4">
              <div className="mt-1">{insight.icon}</div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{insight.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{insight.description}</p>
              </div>
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 italic self-start">Source: Medivault AI</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIInsightsCard;
