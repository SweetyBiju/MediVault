import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Clock,
  MoreHorizontal,
  MapPin,
  Video,
  Bell,
  BellOff,
  ArrowLeftRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { cancelAppointment, requestChange } from "../utils/api";

const UpcomingAppointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showPast, setShowPast] = useState(false);
  const [openActions, setOpenActions] = useState(null);
  const [reminderMap, setReminderMap] = useState({});
  const [notesVisible, setNotesVisible] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [changeData, setChangeData] = useState({
    id: null,
    changeType: "",
    date: "",
    time: "",
    mode: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // Unified fetch function for appointments + count
  const fetchAppointments = async () => {
    if (!user?._id) return;
    try {
      const token = localStorage.getItem("token");
      const [appointmentsRes, countRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/appointments/user/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/appointments/count/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);
      setAppointments(appointmentsRes.data);
      // Store updated count for dashboard
      localStorage.setItem("appointmentCount", countRes.data.count);
      window.dispatchEvent(new Event("appointmentCountUpdated"));
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const filtered = appointments.filter((appt) =>
    showPast
      ? ["cancelled", "completed"].includes(appt.status)
      : [
          "upcoming",
          "requested",
          "postpone",
          "prepone",
          "mode-changed",
          "pending-doctor-decision",
        ].includes(appt.status)
  );

  const toggleReminder = (id) => {
    setReminderMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleNotes = (id) => {
    setNotesVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;
    try {
      await cancelAppointment(id);
      alert("Appointment cancelled!");
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a))
      );
    } catch (err) {
      alert("Error cancelling appointment");
    }
  };

  const handleChangeRequestClick = (id, changeType) => {
    setChangeData({ id, changeType, date: "", time: "", mode: "" });
    setModalOpen(true);
  };

  const handleChangeRequest = async (id, changeType, newDate, newTime, newMode) => {
    try {
      const response = await requestChange(id, {
        changeType,
        newDate,
        newTime,
        newMode,
        requestedBy: user._id,
      });
      const updatedAppointment = response.data.appointment;
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === id ? updatedAppointment : appt))
      );
    } catch (err) {
      console.error("Error applying change:", err.response?.data || err.message);
      alert("Error applying change");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {showPast ? "Past Appointments" : "Upcoming Appointments"}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPast(!showPast)}
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeftRight className="w-4 h-4" />
            {showPast ? "View Upcoming" : "View Past"}
          </button>
          <button
            onClick={fetchAppointments}
            className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:underline"
          >
            <RefreshCcw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Scrollable Appointment List */}
      <div className="max-h-96 overflow-y-auto pr-2 space-y-5 custom-scrollbar">
        {filtered.length > 0 ? (
          filtered.map((appt) => (
            <div
              key={appt._id}
              className="flex bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Date Badge */}
              <div className="bg-emerald-200 text-green-900 rounded-xl flex flex-col items-center justify-center px-4 py-3 text-center w-20 font-bold text-sm">
                <div className="text-xl leading-none">
                  {new Date(appt.date).getDate()}
                </div>
                <div className="uppercase">
                  {new Date(appt.date).toLocaleString("default", { month: "short" })}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 p-4 space-y-2 relative">
                {/* Doctor Name & Status */}
                <div className="flex items-center justify-between">
                  <div className="text-md font-semibold text-gray-800 dark:text-white">
                    👨‍⚕️ {appt.doctorId?.name || "Unknown Doctor"}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full 
                      ${appt.status === "requested"
                        ? "bg-yellow-100 text-yellow-700"
                        : appt.status === "pending-doctor-decision"
                        ? "bg-orange-100 text-orange-700"
                        : appt.status === "upcoming"
                        ? "bg-green-100 text-green-700"
                        : appt.status === "postpone"
                        ? "bg-orange-100 text-orange-700"
                        : appt.status === "prepone"
                        ? "bg-purple-100 text-purple-700"
                        : appt.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"}`}
                  >
                    {appt.status === "requested"
                      ? "Awaiting Confirmation"
                      : appt.status === "pending-doctor-decision"
                      ? "Change Requested"
                      : appt.status === "postpone"
                      ? "Postpone Requested"
                      : appt.status === "prepone"
                      ? "Prepone Requested"
                      : appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                  </span>
                </div>

                {/* Time + Location + Actions */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {appt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    {appt.mode === "Walk-in" ? (
                      <MapPin className="w-4 h-4" />
                    ) : (
                      <Video className="w-4 h-4" />
                    )}
                    {appt.mode === "Walk-in" ? appt.location : "Virtual"}
                  </span>

                  {/* Reminder Toggle */}
                  <button
                    onClick={() => toggleReminder(appt._id)}
                    className={`ml-auto hover:scale-105 transition-transform ${
                      reminderMap[appt._id]
                        ? "text-yellow-500"
                        : "text-green-500 dark:text-green-400"
                    }`}
                    title={reminderMap[appt._id] ? "Reminder on" : "Reminder off"}
                  >
                    {reminderMap[appt._id] ? (
                      <Bell className="w-5 h-5" />
                    ) : (
                      <BellOff className="w-5 h-5" />
                    )}
                  </button>

                  {/* More Actions Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenActions(openActions === appt._id ? null : appt._id)
                      }
                      className="text-blue-600 bg-blue-100 hover:bg-blue-200 text-xs px-3 py-1 rounded-md flex items-center gap-1"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                      More Actions
                    </button>

                    {openActions === appt._id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 shadow-lg rounded-lg z-50">
                        {["Cancel", "Postpone", "Prepone", "Change Mode"].map(
                          (action) => (
                            <button
                              key={action}
                              onClick={() =>
                                action === "Cancel"
                                  ? handleCancel(appt._id)
                                  : handleChangeRequestClick(appt._id, action.toLowerCase())
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              {action}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes Section */}
                <div className="text-right">
                  <button
                    onClick={() => toggleNotes(appt._id)}
                    className="text-xs text-purple-600 hover:underline"
                  >
                    {notesVisible[appt._id] ? "Hide Note" : "Add Note for Doctor"}
                  </button>
                </div>
                {notesVisible[appt._id] && (
                  <textarea
                    placeholder="Write a short note..."
                    className="w-full mt-1 text-sm p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white"
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No appointments to show.
          </p>
        )}
      </div>

      {/* Modal for change requests */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-96 relative overflow-hidden"
          >
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {changeData.changeType} Appointment
            </h3>
            {(changeData.changeType === "postpone" ||
              changeData.changeType === "prepone") && (
              <>
                <label className="block text-sm mb-1">New Date</label>
                <input
                  type="date"
                  value={changeData.date}
                  onChange={(e) =>
                    setChangeData({ ...changeData, date: e.target.value })
                  }
                  className="w-full mb-3 p-2 border rounded-md"
                />
                <label className="block text-sm mb-1">New Time</label>
                <input
                  type="time"
                  value={changeData.time}
                  onChange={(e) =>
                    setChangeData({ ...changeData, time: e.target.value })
                  }
                  className="w-full mb-3 p-2 border rounded-md"
                />
              </>
            )}
            {changeData.changeType === "change mode" && (
              <>
                <label className="block text-sm mb-1">New Mode</label>
                <select
                  value={changeData.mode}
                  onChange={(e) =>
                    setChangeData({ ...changeData, mode: e.target.value })
                  }
                  className="w-full mb-3 p-2 border rounded-md"
                >
                  <option value="">Select Mode</option>
                  <option value="walk-in">Walk-in</option>
                  <option value="virtual">Virtual</option>
                </select>
              </>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleChangeRequest(
                    changeData.id,
                    changeData.changeType,
                    changeData.date,
                    changeData.time,
                    changeData.mode
                  );
                  setModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;

