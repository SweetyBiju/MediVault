import React, { useState, useMemo } from "react";

const HumanBodyVisualization = ({ parameters = [] }) => {
  const [activeOrgan, setActiveOrgan] = useState(null);

  // Memoize organ highlights to prevent unnecessary recalculations
  const organHighlights = useMemo(
    () =>
      parameters.reduce((acc, param) => {
        if (!param.organ) return acc;
        acc[param.organ] = {
          name: param.name,
          status: param.status,
          value: param.value,
          meaning: param.meaning,
        };
        return acc;
      }, {}),
    [parameters]
  );

  const handleMouseEnter = (organ) => setActiveOrgan(organ);
  const handleMouseLeave = () => setActiveOrgan(null);

  // Organ styles for better maintainability
  const organStyles = {
    heart: {
      top: "110px",
      left: "86px",
      className: "w-8 h-8 bg-red-500 rounded-full opacity-70 cursor-pointer",
    },
    liver: {
      top: "150px",
      left: "74px",
      className: "w-12 h-6 bg-yellow-500 rounded-lg opacity-70 cursor-pointer",
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-[500px]">
        {/* Human body silhouette */}
        <svg viewBox="0 0 200 500" className="w-full h-full text-gray-300">
          <title>Human Body Outline</title>
          <circle cx="100" cy="40" r="30" className="fill-current" />
          <rect x="70" y="70" width="60" height="150" className="fill-current" />
          <rect x="40" y="80" width="30" height="130" className="fill-current" />
          <rect x="130" y="80" width="30" height="130" className="fill-current" />
          <rect x="70" y="220" width="25" height="180" className="fill-current" />
          <rect x="105" y="220" width="25" height="180" className="fill-current" />
        </svg>

        {/* Highlighted organs */}
        {Object.keys(organHighlights).map(
          (organ) =>
            organStyles[organ] && (
              <div
                key={organ}
                onMouseEnter={() => handleMouseEnter(organ)}
                onMouseLeave={handleMouseLeave}
                className={`absolute ${organStyles[organ].className}`}
                style={{ top: organStyles[organ].top, left: organStyles[organ].left }}
                aria-label={`${organ} highlight`}
              />
            )
        )}
      </div>

      {/* Tooltip / Info Card */}
      {activeOrgan && organHighlights[activeOrgan] && (
        <div className="mt-4 bg-white shadow-lg rounded-lg p-4 w-64 text-center">
          <h3 className="text-lg font-semibold capitalize">{activeOrgan}</h3>
          <p className="text-sm text-gray-700">{organHighlights[activeOrgan].name}</p>
          <p className="text-sm text-gray-600">{organHighlights[activeOrgan].meaning}</p>
          <p
            className={`mt-2 text-sm font-medium ${
              organHighlights[activeOrgan].status === "high"
                ? "text-red-500"
                : organHighlights[activeOrgan].status === "normal"
                ? "text-green-500"
                : "text-yellow-500"
            }`}
          >
            Value: {organHighlights[activeOrgan].value}
          </p>
        </div>
      )}
    </div>
  );
};

export default HumanBodyVisualization;
