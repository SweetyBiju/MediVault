import React from "react";
import { FileText, X } from "lucide-react";

const InsightsModal = ({ isOpen, onClose, insights }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="text-blue-500" /> AI-Generated Insights
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">{insights.summary}</p>

        <h3 className="font-semibold text-lg mb-2">Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-h-64 overflow-y-auto">
          {insights.parameters.map((param, idx) => (
            <div key={idx} className="p-3 border rounded-lg shadow-sm bg-gray-50">
              <p className="font-semibold">{param.name}</p>
              <p className="text-sm">Value: {param.value}</p>
              <p className="text-xs text-gray-500">Range: {param.range}</p>
              <p className="text-xs italic text-gray-600">{param.meaning}</p>
            </div>
          ))}
        </div>

        <h3 className="font-semibold text-lg mb-2">Recommendations</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          {insights.recommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InsightsModal;
