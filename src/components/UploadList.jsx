import React, { useState } from 'react';
import { FileText, Copy, Send, Trash2, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const UploadList = ({ uploadedFiles, setUploadedFiles }) => {
  const [showInfo, setShowInfo] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleOtpAction = (file, index) => {
    const updatedFiles = [...uploadedFiles];

    if (Date.now() > file.otpExpiry) {
      const newOtp = Math.floor(100000 + Math.random() * 900000);
      updatedFiles[index].otp = newOtp;
      updatedFiles[index].otpExpiry = Date.now() + 3600000;
      file = updatedFiles[index];
      toast.info("OTP expired. New OTP generated and copied.");
    } else {
      toast.success("OTP copied to clipboard!");
    }

    const text = `Hi Doctor, please access my file: ${file.name}\nAccess OTP: ${file.otp}`;
    navigator.clipboard.writeText(text);

    setUploadedFiles(updatedFiles);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
  };

  const handleWhatsApp = (file) => {
    if (Date.now() > file.otpExpiry) {
      toast.error("OTP expired. Generate new OTP first.");
      return;
    }

    const msg = `Hi Doctor, please access my file: ${file.name}\nAccess OTP: ${file.otp}`;
    const link = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank');
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;

    const file = uploadedFiles[deleteIndex];
    const updated = [...uploadedFiles];
    updated.splice(deleteIndex, 1);

    setUploadedFiles(updated);
    localStorage.setItem('uploadedFiles', JSON.stringify(updated));

    const currentStorage = parseFloat(localStorage.getItem('cloudStorageUsed') || '0');
    const newStorage = currentStorage - parseFloat(file.size);
    localStorage.setItem('cloudStorageUsed', newStorage.toFixed(2));

    toast.success("File deleted.");
    setDeleteIndex(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Uploaded Prescriptions</h3>
        <Link to="/upload-details">
          <button className="text-sm bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 transition">
            View All
          </button>
        </Link>
      </div>


      {uploadedFiles.length === 0 ? (
        <p className="text-gray-500 text-sm">No files uploaded yet.</p>
      ) : (
        <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {uploadedFiles.map((file, idx) => (
            <li key={idx} className="border rounded-lg p-4 space-y-2 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-500 w-5 h-5" />
                <div>
                  <p className="font-medium text-sm text-gray-800 dark:text-white">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{file.size} MB</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${file.type === 'Bill'
                        ? 'bg-red-100 text-red-800'
                        : file.type === 'Report'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                      {file.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Uploaded on: {file.date}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                Access OTP:{' '}
                {Date.now() > file.otpExpiry ? (
                  <span className="text-red-500">Expired</span>
                ) : (
                  <span className="font-semibold">{file.otp}</span>
                )}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => handleOtpAction(file, idx)}
                  className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-md hover:bg-green-200"
                >
                  🔐 OTP
                </button>

                <button
                  onClick={() => handleWhatsApp(file)}
                  className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-3 py-1 rounded-md hover:bg-green-200"
                >
                  <Send className="w-4 h-4" /> WhatsApp
                </button>

                <button
                  onClick={() => setShowInfo(file)}
                  className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200"
                >
                  <Info className="w-4 h-4" /> Info
                </button>

                <button
                  onClick={() => setDeleteIndex(idx)}
                  className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">File Information</h3>
            <p><strong>Name:</strong> {showInfo.name}</p>
            <p><strong>Type:</strong> {showInfo.type}</p>
            <p><strong>Size:</strong> {showInfo.size} MB</p>
            <p><strong>Date:</strong> {showInfo.date}</p>
            <p><strong>OTP:</strong> {Date.now() > showInfo.otpExpiry ? 'Expired' : showInfo.otp}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => setShowInfo(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete <strong>{uploadedFiles[deleteIndex].name}</strong>?</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDeleteIndex(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadList;
