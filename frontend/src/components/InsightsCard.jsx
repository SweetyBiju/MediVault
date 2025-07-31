import React, { useState, useEffect, useRef } from "react";
import { Lightbulb } from "lucide-react";

// Dictionary for explanations (replace with backend later)
const jargonDictionary = {
  Triglycerides: "A type of fat in your blood. High levels may increase the risk of heart disease.",
  "Total Cholesterol": "A measure of the total amount of cholesterol in your blood. High levels can clog arteries.",
  "HDL (Good Cholesterol)": "Good cholesterol helps remove bad cholesterol and keeps your heart healthy.",
  "Blood Pressure": "The force of blood against artery walls. High values may indicate hypertension.",
};

const InsightsCard = ({ name, value, range, meaning, status }) => {
  const [showPopover, setShowPopover] = useState(false);
  const cardRef = useRef(null);

  const getStatusColor = () => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-300";
      case "borderline":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-xl border p-4 shadow-sm transition-transform hover:scale-[1.02] ${getStatusColor()}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{name}</h3>
        <Lightbulb
          className={`cursor-pointer transition-transform hover:scale-110 ${
            showPopover ? "text-yellow-400" : "text-gray-500 hover:text-yellow-400"
          }`}
          onClick={() => setShowPopover(!showPopover)}
          aria-label={`Toggle explanation for ${name}`}
        />
      </div>
      <p className="text-xl font-bold mt-1">{value}</p>
      <p className="text-sm text-gray-600 mt-1">
        Normal Range: <span className="font-medium">{range}</span>
      </p>
      <p className="text-sm text-gray-700 mt-2">{meaning}</p>

      {/* Popover */}
      {showPopover && (
        <div className="absolute z-20 bg-white shadow-xl rounded-lg p-4 top-[-120px] left-1/2 transform -translate-x-1/2 w-72 border before:content-[''] before:absolute before:bottom-[-10px] before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-white">
          <h4 className="text-sm font-semibold mb-1">{name} (Simple Terms)</h4>
          <p className="text-sm text-gray-700">
            {jargonDictionary[name] || "This parameter helps assess your health status."}
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightsCard;
