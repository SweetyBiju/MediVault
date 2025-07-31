import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Calendar as CalendarIcon, Clock, Video, MapPin, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Appointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showPast, setShowPast] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointments/user/${currentUser._id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      // Sort by date/time
      const sorted = res.data.sort(
        (a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
      );
      setAppointments(sorted);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("Failed to fetch appointments");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointments/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
      toast.success("Appointment cancelled");
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      toast.error("Failed to cancel");
    }
  };

  const filteredAppointments = appointments.filter((appt) =>
    showPast
      ? ["cancelled", "completed"].includes(appt.status)
      : !["cancelled", "completed"].includes(appt.status)
  );

  // Convert date to YYYY-MM-DD
  const formatDateKey = (date) => new Date(date).toISOString().split("T")[0];

  const selectedDayAppointments = filteredAppointments.filter(
    (appt) => formatDateKey(appt.date) === formatDateKey(selectedDate)
  );

  const tileClassName = ({ date }) => {
    const dateStr = formatDateKey(date);
    if (appointments.some((apt) => formatDateKey(apt.date) === dateStr)) {
      return "bg-blue-200 rounded-full";
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {showPast ? "Past Appointments" : "Upcoming Appointments"}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-md ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1 rounded-md ${viewMode === "calendar" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Calendar
            </button>
            <button
              onClick={() => setShowPast(!showPast)}
              className="text-sm px-3 py-1 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
            >
              {showPast ? "View Upcoming" : "View Past"}
            </button>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appt) => (
                <motion.div
                  key={appt._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {appt.patientId?.name || "Unknown Patient"}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />{" "}
                      {new Date(appt.date).toLocaleDateString()}{" "}
                      <Clock className="w-4 h-4 ml-2" /> {appt.time}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      {appt.isVirtual ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}{" "}
                      {appt.isVirtual ? "Virtual" : "Walk-in"}
                    </p>
                    {appt.reason && (
                      <p className="text-sm text-gray-500 italic mt-1">
                        <strong>Reason:</strong> {appt.reason}
                      </p>
                    )}
                  </div>
                  {!showPast && (
                    <button
                      onClick={() => handleCancel(appt._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center py-8">No appointments to show.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={tileClassName}
              className="mx-auto mb-6 rounded-lg shadow border"
            />
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {selectedDayAppointments.length > 0 ? (
                selectedDayAppointments.map((appt) => (
                  <motion.div
                    key={appt._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md"
                  >
                    <p className="font-semibold text-lg">{appt.patientId?.name || "Unknown Patient"}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(appt.date).toLocaleDateString()} at {appt.time}
                    </p>
                    <p className="text-sm text-gray-500 italic">{appt.reason || "No reason provided"}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center">No appointments for this date.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
