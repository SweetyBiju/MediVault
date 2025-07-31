import React, { useState } from 'react';
import { Send } from 'lucide-react';

const AppointmentRequestForm = () => {
  const [form, setForm] = useState({
    doctor: '',
    specialization: '',
    date: '',
    time: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.doctor && form.specialization && form.date && form.time) {
      setSubmitted(true);
      // Future: Send to backend or notification
      setTimeout(() => {
        setSubmitted(false);
        setForm({ doctor: '', specialization: '', date: '', time: '', message: '' });
      }, 2000);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">Request New Appointment</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Doctor Name *</label>
          <input
            type="text"
            name="doctor"
            value={form.doctor}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

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

        <button
          type="submit"
          disabled={submitted}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <Send size={16} /> {submitted ? "Submitted!" : "Send Request"}
        </button>
      </form>
    </div>
  );
};

export default AppointmentRequestForm;
