import React, { useState } from 'react';
import { Star, StarHalf, MessageCircle, Phone, Calendar } from 'lucide-react';

const alternativeDoctors = [
  { name: "Dr. Ananya Mitra", specialization: "Cardiology", location: "Apollo", phone: "9876100001", rating: 4.5 },
  { name: "Dr. Rakesh Nandi", specialization: "Endocrinology", location: "Fortis", phone: "9876100002", rating: 4.4 },
  { name: "Dr. Priya Das", specialization: "Neurology", location: "Belle Vue", phone: "9876100003", rating: 4.7 },
  { name: "Dr. Shilpi Roy", specialization: "Orthopedics", location: "AMRI", phone: "9876100004", rating: 4.3 }
];

const DoctorPanel = () => {
  const [view, setView] = useState('history');
  const [saved, setSaved] = useState(['Dr. Aritra Ghosh', 'Dr. Sarah Lee']);
  const [specialty, setSpecialty] = useState('Cardiology');

  const toggleSave = (name) => {
    setSaved(prev =>
      prev.includes(name) ? prev.filter(doc => doc !== name) : [...prev, name]
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Doctor Panel</h3>
        <div className="flex gap-2">
          <button
            className={`px-4 py-1 rounded-md ${view === 'history' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('history')}
          >
            Saved Doctors
          </button>
          <button
            className={`px-4 py-1 rounded-md ${view === 'alternatives' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('alternatives')}
          >
            Find Alternatives
          </button>
        </div>
      </div>

      {view === 'history' && (
        <ul className="space-y-4">
          {saved.map((name, i) => (
            <li key={i} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{name}</p>
                  <p className="text-sm text-gray-500">Recent Visit: July 5</p>
                </div>
                <button
                  className="text-sm text-red-500 hover:underline"
                  onClick={() => toggleSave(name)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {view === 'alternatives' && (
        <>
          <label className="block mb-2 text-sm text-gray-600">Select Specialization:</label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="mb-4 px-3 py-2 border rounded-md text-sm"
          >
            <option>Cardiology</option>
            <option>Endocrinology</option>
            <option>Neurology</option>
            <option>Orthopedics</option>
          </select>

          <ul className="space-y-4">
            {alternativeDoctors
              .filter(doc => doc.specialization === specialty)
              .map((doc, i) => (
                <li key={i} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.specialization} • {doc.location}</p>
                      <p className="text-xs text-gray-400">📞 {doc.phone}</p>
                      <div className="flex items-center mt-1">{renderStars(doc.rating)}</div>
                    </div>
                    <button
                      className="text-2xl"
                      onClick={() => toggleSave(doc.name)}
                    >
                      {saved.includes(doc.name) ? '⭐' : '☆'}
                    </button>
                  </div>

                  <div className="mt-3 flex gap-2 text-xs text-white">
                    <button className="bg-blue-500 px-2 py-1 rounded-md flex items-center gap-1">
                      <MessageCircle size={14} /> Text
                    </button>
                    <button className="bg-green-500 px-2 py-1 rounded-md flex items-center gap-1">
                      <Phone size={14} /> Call
                    </button>
                    <button className="bg-purple-500 px-2 py-1 rounded-md flex items-center gap-1">
                      <Calendar size={14} /> Schedule
                    </button>
                  </div>

                  <div className="mt-3">
                    <textarea
                      rows="2"
                      placeholder={`Feedback for ${doc.name}`}
                      className="w-full p-2 border rounded-md text-sm"
                    />
                    <button className="mt-2 text-sm text-green-600 hover:underline">
                      Submit Feedback
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default DoctorPanel;
