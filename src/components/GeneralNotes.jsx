import React, { useState, useEffect } from 'react';
import { StickyNote, Save } from 'lucide-react';

const GeneralNotes = () => {
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  // Optionally restore from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("medivaultNotes");
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("medivaultNotes", notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-yellow-500" />
          General Notes
        </h3>
        {saved && <span className="text-xs text-green-600">✓ Saved</span>}
      </div>

      <textarea
        rows={8}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write anything you want to remember..."
        className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />

      <button
        onClick={handleSave}
        className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
      >
        <Save size={16} /> Save Notes
      </button>
    </div>
  );
};

export default GeneralNotes;
