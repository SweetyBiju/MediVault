import React, { useState } from 'react';
import { AlertTriangle, Pill, PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';

const severityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
};

const AllergyNotices = ({ allergies: initialAllergies = [] }) => {
  const [allergies, setAllergies] = useState(initialAllergies);
  const [newAllergy, setNewAllergy] = useState('');
  const [newSeverity, setNewSeverity] = useState('low');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({ name: '', severity: 'low' });

  const saveToLocal = (updated) => {
    setAllergies(updated);
    localStorage.setItem(
      'user',
      JSON.stringify({
        ...JSON.parse(localStorage.getItem('user')),
        allergies: updated,
      })
    );
    window.dispatchEvent(new Event("allergiesUpdated")); 
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      const updated = [...allergies, { name: newAllergy.trim(), severity: newSeverity, description: '' }];
      saveToLocal(updated);
      setNewAllergy('');
      setNewSeverity('low');
    }
  };

  const handleDelete = (index) => {
    const updated = allergies.filter((_, i) => i !== index);
    saveToLocal(updated);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData(allergies[index]);
  };

  const handleSaveEdit = (index) => {
    const updated = allergies.map((item, i) =>
      i === index ? { ...item, name: editData.name, severity: editData.severity } : item
    );
    saveToLocal(updated);
    setEditingIndex(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
      <h3 className="text-lg font-semibold mb-4">Allergy Notices</h3>

      {allergies.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-gray-400">
          <Pill className="w-10 h-10 opacity-50 mb-2" />
          <p>No allergies known</p>
        </div>
      ) : (
        <ul className="space-y-4 max-h-64 overflow-y-auto pr-2">
          {allergies.map((item, idx) => (
            <li key={idx} className={`flex items-start justify-between gap-3 p-4 rounded-md ${severityColors[item.severity]} transition`}>
              {editingIndex === idx ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full border rounded px-2 py-1"
                  />
                  <select
                    value={editData.severity}
                    onChange={(e) => setEditData({ ...editData, severity: e.target.value })}
                    className="border rounded px-2 py-1"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {item.severity === 'high' ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <Pill className="w-5 h-5 text-current" />}
                  </div>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {editingIndex === idx ? (
                  <>
                    <button onClick={() => handleSaveEdit(idx)} className="text-green-600 hover:text-green-800">
                      <Save className="w-5 h-5" />
                    </button>
                    <button onClick={() => setEditingIndex(null)} className="text-gray-600 hover:text-gray-800">
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(idx)} className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(idx)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add Allergy */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={newAllergy}
          onChange={(e) => setNewAllergy(e.target.value)}
          placeholder="Add new allergy"
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <select
          value={newSeverity}
          onChange={(e) => setNewSeverity(e.target.value)}
          className="border rounded-lg px-2 py-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={handleAddAllergy}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-700"
        >
          <PlusCircle className="w-4 h-4" /> Add
        </button>
      </div>
    </div>
  );
};

export default AllergyNotices;
