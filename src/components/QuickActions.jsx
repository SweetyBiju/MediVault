import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import {
  FileText,
  CalendarPlus,
  Send,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  Bot,
  PillBottleIcon,
  QrCode,
  ShieldCheck,
  Key,
  LucideUploadCloud,
} from 'lucide-react';



const QuickActions = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const scrollRef = useRef();
  const navigate = useNavigate();

  const actions = [
    { label: "Upload", icon: <FileText className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600', action: () => navigate('/storage') }, // Changed to /storage
    { label: "Book Appt", icon: <CalendarPlus className="w-5 h-5" />, color: 'bg-green-100 text-green-600', action: () => navigate('/appoinment') }, // Fixed typo
    { label: "Share OTP", icon: <Key className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600', action: () => navigate('/doctors') }, // Changed to /doctors
    { label: "Generate OTP", icon: <Send className="w-5 h-5" />, color: 'bg-pink-100 text-pink-600', action: () => navigate('/doctors') }, // Changed to /doctors
    { label: "Chatbot", icon: <Bot className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600', action: () => navigate('/dashboard') }, // Redirect to dashboard
    { label: "View Uploaded", icon: <LucideUploadCloud className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600', action: () => navigate('/upload') },
    { label: "Security", icon: <ShieldCheck className="w-5 h-5" />, color: 'bg-green-100 text-green-600', action: () => navigate('/settings') }, // Changed to /settings
    { label: "Medicines", icon: <PillBottleIcon className="w-5 h-5" />, color: 'bg-teal-100 text-teal-600', action: () => navigate('/dashboard') }, // Redirect to dashboard
    { label: "EmergencyQR", icon: <QrCode className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600', action: () => navigate('/dashboard') }, // Redirect to dashboard
  ];


  const scrollByOffset = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: offset, behavior: 'smooth' });
    }
  };

  if (!expanded) {
    return (
      <button
        className="fixed right-2 top-[25%] z-40 bg-white/70 dark:bg-gray-800/70 p-3 rounded-l-xl shadow-inner hover:shadow-lg transition"
        onClick={() => setExpanded(true)}
      >
        <ChevronsLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>
    );
  }

  return (
    <div className="fixed right-4 top-[40%] -translate-y-1/2 z-40 flex flex-col items-center space-y-2">
      {/* Scroll Up */}
      <button
        onClick={() => scrollByOffset(-80)}
        className="bg-white dark:bg-gray-700 p-1 rounded-full shadow-inner hover:shadow-md transition"
      >
        <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-300" />
      </button>

      {/* Action Icon Container */}
      <div
        ref={scrollRef}
        className="relative w-25 bg-white/90 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-inner ring-1 ring-gray-300 dark:ring-gray-700 h-[280px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 flex flex-col items-center space-y-4 px-1 py-3"
      >
        {actions.map((action, idx) => (
          <div key={idx} className="relative group w-full flex justify-center">
            <button
              onClick={() => {
                setActiveIndex(idx);
                toast.success(`${action.label} clicked`);
                action.action(); // Call the navigation function
              }}
              className={`transition transform hover:scale-110 p-3 rounded-full ${action.color} shadow-sm w-12 h-12 flex items-center justify-center ${activeIndex === idx ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
            >
              {action.icon}
            </button>



            {/* Hover Label outside container */}
            <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap  shadow-md z-50">
              {action.label}
            </span>
          </div>

        ))}
      </div>

      {/* Scroll Down */}
      <button
        onClick={() => scrollByOffset(80)}
        className="bg-white dark:bg-gray-700 p-1 rounded-full shadow-inner hover:shadow-md transition"
      >
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
      </button>

      {/* Collapse Button */}
      <button
        onClick={() => setExpanded(false)}
        className="mt-2 bg-white/80 dark:bg-gray-800/80 p-1 rounded-full shadow-inner hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <ChevronsLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
};

export default QuickActions;
