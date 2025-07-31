import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { User, XCircle } from 'lucide-react';

const initialDoctors = [
  {
    id: 1,
    name: "Dr. Aritra Ghosh",
    specialization: "Cardiology",
    hospital: "Apollo Kolkata",
    contact: "9876543210"
  },
  {
    id: 2,
    name: "Dr. Sneha Roy",
    specialization: "Endocrinology",
    hospital: "Fortis Salt Lake",
    contact: "9876543201"
  },
  {
    id: 3,
    name: "Dr. Subhashis Roy",
    specialization: "Endocrinology",
    hospital: "Fortis Salt Lake",
    contact: "9876543201"
  }
];

const Doctors = () => {
  const [doctors, setDoctors] = useState(initialDoctors);

  const removeDoctor = (id) => {
    const confirmRemove = window.confirm("Remove this doctor?");
    if (confirmRemove) {
      setDoctors(prev => prev.filter(doc => doc.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition">
      
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Saved Doctors</h2>

        {doctors.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No saved doctors found.</p>
        ) : (
          <div className="space-y-4">
            {doctors.map(doc => (
              <div key={doc.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <User className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold">{doc.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{doc.specialization} • {doc.hospital}</p>
                    <p className="text-xs text-gray-400">📞 {doc.contact}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeDoctor(doc.id)}
                  className="text-red-500 hover:underline flex items-center gap-1 text-sm"
                >
                  <XCircle className="w-4 h-4" /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
