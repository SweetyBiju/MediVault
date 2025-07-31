// import React, { useState } from "react";
// import { Send } from "lucide-react";
// import { createAppointment } from "../utils/api";
// import axios from "axios";

// const AppointmentRequestForm = () => {
//   const [form, setForm] = useState({
//     doctor: "",
//     specialization: "",
//     date: "",
//     time: "",
//     message: "",
//   });

//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.doctor || !form.specialization || !form.date || !form.time) {
//       return alert("Please fill in all required fields.");
//     }

//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Not logged in. Please log in again.");
//         return;
//       }

//       console.log("Current user:", user); // Debug

//       // Use a known-good doctorId from your seeded doctors
//       const hardcodedDoctorId = "68867985a7ac9865914033b9"; // <-- Replace with a valid one

//       // Build appointment payload
//       const appointmentBody = {
//         patientId: user._id,
//         doctorId: hardcodedDoctorId,
//         date: form.date,
//         time: form.time,
//         type: "consultation",
//         reason: form.message,
//         notes: "",
//         isVirtual: false,
//         meetingLink: ""
//       };

//       console.log("Submitting appointment:", appointmentBody); // Debug log

//       // Send POST request
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/appointments`,
//         appointmentBody,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log("Appointment created:", response.data);

//       // Save to localStorage (optional)
//       const existing = JSON.parse(localStorage.getItem("appointments")) || [];
//       localStorage.setItem("appointments", JSON.stringify([...existing, response.data]));

//       // Reset form and show success
//       setSubmitted(true); 
//       setTimeout(() => {
//         setSubmitted(false);
//         setForm({ doctor: "", specialization: "", date: "", time: "", message: "" });
//       }, 2000);

//     } catch (error) {
//       console.error("Error submitting appointment:", error.response?.data || error.message);
//       alert(error.response?.data?.message || "Error submitting appointment request");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
//       <h3 className="text-lg font-semibold mb-4">Request New Appointment</h3>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Doctor Name *</label>
//           <input
//             type="text"
//             name="doctor"
//             value={form.doctor}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Specialization *</label>
//           <select
//             name="specialization"
//             value={form.specialization}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
//           >
//             <option value="">Select</option>
//             <option>Cardiology</option>
//             <option>Endocrinology</option>
//             <option>Neurology</option>
//             <option>Orthopedics</option>
//             <option>General Medicine</option>
//           </select>
//         </div>

//         <div className="flex gap-3">
//           <div className="flex-1">
//             <label className="block text-sm font-medium mb-1">Preferred Date *</label>
//             <input
//               type="date"
//               name="date"
//               value={form.date}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
//             />
//           </div>
//           <div className="flex-1">
//             <label className="block text-sm font-medium mb-1">Preferred Time *</label>
//             <input
//               type="time"
//               name="time"
//               value={form.time}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Message (Optional)</label>
//           <textarea
//             name="message"
//             value={form.message}
//             onChange={handleChange}
//             rows={3}
//             className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
//             placeholder="Include any symptoms or notes..."
//           ></textarea>
//         </div>

//         <button
//           type="submit"
//           disabled={submitted || loading}
//           className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//         >
//           <Send size={16} /> {submitted ? "Submitted!" : loading ? "Sending..." : "Send Request"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AppointmentRequestForm;
import React, { useState, useEffect } from "react";
import { Send, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "axios";

const AppointmentRequestForm = () => {
  const [form, setForm] = useState({
    doctor: "",
    specialization: "",
    date: "",
    time: "",
    message: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctor || !form.specialization || !form.date || !form.time) {
      return toast.error("Please fill in all required fields.");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const appointmentBody = {
        patientId: currentUser._id,
        doctorId: form.doctor,
        date: form.date,
        time: form.time,
        type: "consultation",
        reason: form.message,
        notes: "",
        isVirtual: false,
        meetingLink: "",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointments`,
        appointmentBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const existing = JSON.parse(localStorage.getItem("appointments")) || [];
      localStorage.setItem("appointments", JSON.stringify([...existing, response.data]));
      window.dispatchEvent(new Event("appointmentsUpdated"));
      toast.success("Appointment Request Sent!");

      // Animate: submitting → submitted
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setForm({ doctor: "", specialization: "", date: "", time: "", message: "" });
        }, 1500);
      }, 700);
    } catch (error) {
      console.error("Error submitting appointment:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error submitting appointment request");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">Request New Appointment</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Doctor Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Doctor *</label>
          <select
            name="doctor"
            value={form.doctor}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name} ({doc.specialization || "General"})
              </option>
            ))}
          </select>
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium mb-1">Specialization *</label>
          <select
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select</option>
            <option>Cardiology</option>
            <option>Endocrinology</option>
            <option>Neurology</option>
            <option>Orthopedics</option>
            <option>General Medicine</option>
          </select>
        </div>

        {/* Date & Time */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Preferred Date *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Preferred Time *</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Optional message */}
        <div>
          <label className="block text-sm font-medium mb-1">Message (Optional)</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            placeholder="Include any symptoms or notes..."
          ></textarea>
        </div>

        {/* Animated Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 px-4 py-2 rounded-md text-white transition-all duration-300
            ${submitted ? "bg-green-500" : loading ? "bg-blue-500 animate-pulse" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {submitted ? (
            <>
              <CheckCircle size={18} /> Confirmed!
            </>
          ) : loading ? (
            "Submitting..."
          ) : (
            <>
              <Send size={16} /> Send Request
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default AppointmentRequestForm;
