// import React from 'react';
// import {
//   CalendarCheck,
//   AlertTriangle,
//   UploadCloud,
//   FlaskConical,
// } from 'lucide-react';

// const timelineEvents = [
//   {
//     type: "appointment",
//     title: "Visited Dr. Mitra",
//     time: "Jul 10, 2025 – 11:30 AM",
//     icon: <CalendarCheck className="text-blue-500" />,
//     color: "border-blue-500",
//   },
//   {
//     type: "alert",
//     title: "High BP Alert",
//     time: "Jul 9, 2025 – 08:00 AM",
//     icon: <AlertTriangle className="text-red-500" />,
//     color: "border-red-500",
//   },
//   {
//     type: "upload",
//     title: "Uploaded Sugar Report",
//     time: "Jul 8, 2025 – 07:50 PM",
//     icon: <UploadCloud className="text-green-500" />,
//     color: "border-green-500",
//   },
//   {
//     type: "lab",
//     title: "Thyroid Test Completed",
//     time: "Jul 7, 2025 – 09:15 AM",
//     icon: <FlaskConical className="text-purple-500" />,
//     color: "border-purple-500",
//   },
// ];

// const HealthTimeline = () => {
//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
//       <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Health Timeline</h3>

//       <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-2">
//         {timelineEvents.map((event, idx) => (
//           <div
//             key={idx}
//             className={`min-w-[220px] border-l-4 ${event.color} bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm flex-shrink-0`}
//           >
//             <div className="flex items-center gap-2 mb-2">
//               <div className="bg-white dark:bg-gray-600 p-1 rounded-full shadow">
//                 {event.icon}
//               </div>
//               <p className="text-sm font-semibold text-gray-800 dark:text-white">{event.title}</p>
//             </div>
//             <p className="text-xs text-gray-500 dark:text-gray-300">{event.time}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HealthTimeline;
import React from 'react';
import { Calendar, FileText, Activity, Pill, User } from 'lucide-react';

const timelineEvents = [
  {
    id: 1,
    date: 'Jul 8',
    title: 'Prescription Uploaded',
    description: 'Blood pressure medication prescription',
    icon: FileText,
    color: 'bg-blue-500',
    position: 'top'
  },
  {
    id: 2,
    date: 'Jul 7',
    title: 'AI Health Alert',
    description: 'Detected elevated blood pressure trend',
    icon: Activity,
    color: 'bg-red-500',
    position: 'bottom'
  },
  {
    id: 3,
    date: 'Jul 5',
    title: 'Doctor Appointment',
    description: 'Consultation with Dr. Ghosh completed',
    icon: User,
    color: 'bg-emerald-500',
    position: 'top'
  },
  {
    id: 4,
    date: 'Jul 3',
    title: 'Medication Taken',
    description: 'Morning dose of Amlodipine',
    icon: Pill,
    color: 'bg-purple-500',
    position: 'bottom'
  },
  {
    id: 5,
    date: 'Jul 1',
    title: 'Health Checkup',
    description: 'Routine monthly health assessment',
    icon: Calendar,
    color: 'bg-indigo-500',
    position: 'top'
  }
];

export default function HealthTimeline() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Health Timeline</h3>
          <p className="text-sm text-gray-500">Your recent health journey</p>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div className="flex items-center min-w-max space-x-8 py-8 px-4">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 transform -translate-y-1/2 rounded-full"></div>
          
          {timelineEvents.map((event, index) => (
            <div
              key={event.id}
              className={`relative flex flex-col items-center ${
                event.position === 'top' ? 'flex-col' : 'flex-col-reverse'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Event content */}
              <div className={`bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-48 ${
                event.position === 'top' ? 'mb-6' : 'mt-6'
              } hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`p-1.5 ${event.color} rounded-lg`}>
                    <event.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {event.date}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {event.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {event.description}
                </p>
              </div>
              
              {/* Timeline dot */}
              <div className={`w-4 h-4 ${event.color} rounded-full border-4 border-white shadow-lg z-10 hover:scale-125 transition-transform duration-200`}>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline navigation */}
      <div className="flex justify-center mt-6">
        <div className="flex space-x-2">
          <button className="w-2 h-2 bg-indigo-500 rounded-full"></button>
          <button className="w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"></button>
          <button className="w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"></button>
        </div>
      </div>
    </div>
  );
}