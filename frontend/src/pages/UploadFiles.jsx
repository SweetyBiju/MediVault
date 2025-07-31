import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Eye } from 'lucide-react';

const UploadFiles = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setFiles(data.data);
    };
    fetchFiles();
  }, []);

  const deleteFile = async (id) => {
    const confirmed = window.confirm("Delete this file?");
    if (confirmed) {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setFiles(prev => prev.filter(f => f._id !== id)); // Use _id from MongoDB
      }
    }
  };

  const viewFile = (file) => {
    alert(`Previewing: ${file.name}\n\n${file.preview || 'Preview not available'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Uploaded Prescriptions / Documents</h2>

        {files.length === 0 ? (
          <p className="text-center text-gray-500">No uploaded documents available.</p>
        ) : (
          <div className="space-y-4">
            {files.map(file => (
              <div
                key={file._id} // Use _id from MongoDB
                className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {file.type} • {file.size} MB • Uploaded: {new Date(file.date).toLocaleDateString()}
                    </p>
                    <span className="inline-block text-xs text-white bg-green-500 px-2 py-0.5 rounded-full mt-1">
                      {file.type}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => viewFile(file)}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md flex items-center gap-1 text-sm"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() => deleteFile(file._id)} // Use _id from MongoDB
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-md flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFiles;