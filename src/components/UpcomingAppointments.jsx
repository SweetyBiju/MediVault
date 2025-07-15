import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  MoreHorizontal,
  MapPin,
  Video,
  Bell,
  BellOff,
  ArrowLeftRight,
} from "lucide-react";

const sampleAppointments = [
  {
    id: 1,
    doctor: "Dr. Aritra Ghosh",
    specialization: "Physician",
    date: "14 JUL",
    time: "10:30 AM",
    location: "Ghosh Medical Chambers",
    mode: "Walk-in",
    status: "upcoming",
  },
  {
    id: 2,
    doctor: "Dr. Neha Kapoor",
    specialization: "Cardiologist",
    date: "10 JUL",
    time: "3:30 PM",
    location: "",
    mode: "Virtual",
    status: "completed",
  },
  {
    id: 3,
    doctor: "Dr. Ravi Patel",
    specialization: "ENT",
    date: "07 JUL",
    time: "1:00 PM",
    location: "City Health Hub",
    mode: "Walk-in",
    status: "cancelled",
  },
];

const UpcomingAppointments = () => {
  const [showPast, setShowPast] = useState(false);
  const [openActions, setOpenActions] = useState(null);
  const [reminderMap, setReminderMap] = useState({});
  const [notesVisible, setNotesVisible] = useState({});

  const filtered = sampleAppointments.filter((appt) =>
    showPast
      ? appt.status === "cancelled" || appt.status === "completed"
      : appt.status === "upcoming"
  );

  const toggleReminder = (id) => {
    setReminderMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleNotes = (id) => {
    setNotesVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {showPast ? "Past Appointments" : "Upcoming Appointments"}
        </h3>
        <button
          onClick={() => setShowPast(!showPast)}
          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeftRight className="w-4 h-4" />
          {showPast ? "View Upcoming" : "View Past"}
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-5">
        {filtered.length > 0 ? (
          filtered.map((appt) => (
            <div
              key={appt.id}
              className="flex bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Date Badge */}
              <div className="bg-emerald-200 text-green-900 rounded-xl flex flex-col items-center justify-center px-4 py-3 text-center w-20 font-bold text-sm">
                <div className="text-xl leading-none">{appt.date.split(" ")[0]}</div>
                <div className="uppercase">{appt.date.split(" ")[1]}</div>
              </div>

              {/* Details */}
              <div className="flex-1 p-4 space-y-2 relative">
                {/* Doctor Name & Status */}
                <div className="flex items-center justify-between">
                  <div className="text-md font-semibold text-gray-800 dark:text-white">
                    👨‍⚕️ {appt.doctor}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      appt.status === "upcoming"
                        ? "bg-green-100 text-green-700"
                        : appt.status === "postponed"
                        ? "bg-yellow-100 text-yellow-800"
                        : appt.status === "preponed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                  </span>
                </div>

                {/* Time + Location + Actions */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {appt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    {appt.mode === "Walk-in" ? <MapPin className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    {appt.mode === "Walk-in" ? appt.location : "Virtual"}
                  </span>

                  {/* Reminder Toggle */}
                  <button
                    onClick={() => toggleReminder(appt.id)}
                    className={`ml-auto hover:scale-105 transition-transform ${
                      reminderMap[appt.id]
                        ? "text-yellow-500"
                        : "text-green-500 dark:text-green-400"
                    }`}
                    title={reminderMap[appt.id] ? "Reminder on" : "Reminder off"}
                  >
                    {reminderMap[appt.id] ? (
                      <Bell className="w-5 h-5" />
                    ) : (
                      <BellOff className="w-5 h-5" />
                    )}
                  </button>

                  {/* More Actions Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenActions(openActions === appt.id ? null : appt.id)}
                      className="text-blue-600 bg-blue-100 hover:bg-blue-200 text-xs px-3 py-1 rounded-md flex items-center gap-1"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                      More Actions
                    </button>

                    {openActions === appt.id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 shadow-lg rounded-lg z-50">
                        {["Cancel", "Postpone", "Prepone", "Change Mode"].map((action) => (
                          <button
                            key={action}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes Section */}
                <div className="text-right">
                  <button
                    onClick={() => toggleNotes(appt.id)}
                    className="text-xs text-purple-600 hover:underline"
                  >
                    {notesVisible[appt.id] ? "Hide Note" : "Add Note for Doctor"}
                  </button>
                </div>
                {notesVisible[appt.id] && (
                  <textarea
                    placeholder="Write a short note..."
                    className="w-full mt-1 text-sm p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white"
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No appointments to show.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
