import React, { useState, useEffect } from 'react';
import { FileText, Copy, Send, Trash2, Info, Brain } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InsightsModal from './InsightsModal';

const UploadList = ({ uploadedFiles, setUploadedFiles, limit = null }) => {
  const { currentUser } = useAuth();
  const [showInfo, setShowInfo] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [currentInsights, setCurrentInsights] = useState(null);

  useEffect(() => {
    const fetchUploads = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUploadedFiles(data.data);
    };
    fetchUploads();
  }, []);

  const handleOtpAction = async (file, index) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads/otp/${file._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      const updatedFiles = [...uploadedFiles];
      updatedFiles[index] = data.data;
      setUploadedFiles(updatedFiles);
      toast.info('New OTP generated and copied.');
      navigator.clipboard.writeText(`Hi Doctor, please access my file: ${file.name}\nAccess OTP: ${data.data.otp}`);
    }
  };

  const handleWhatsApp = (file) => {
    if (Date.now() > file.otpExpiry) {
      toast.error('OTP expired. Generate new OTP first.');
      return;
    }

    const msg = `Hi Doctor, please access my file: ${file.name}\nAccess OTP: ${file.otp}`;
    const link = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank');
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads/${uploadedFiles[deleteIndex]._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      const updated = [...uploadedFiles];
      updated.splice(deleteIndex, 1);
      setUploadedFiles(updated);
      toast.success('File deleted.');
    }
    setDeleteIndex(null);
  };

  const handleGenerateInsights = async (file) => {
    try {
      setCurrentInsights(null);
      setShowInsightsModal(true);

      console.log('[AI Insights Request] File data:', file);

      if (!file._id) {
        toast.error('Invalid file ID. Cannot fetch insights.');
        setShowInsightsModal(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token is missing. Please log in again.');
        setShowInsightsModal(false);
        return;
      }

      if (!currentUser || !currentUser._id) {
        toast.error('User not authenticated. Please log in again.');
        setShowInsightsModal(false);
        return;
      }

      const getRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/insights/${file._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (getRes.ok) {
        const existingData = await getRes.json();
        console.log('[Fetched Stored Insights]:', existingData);
        setCurrentInsights(existingData);
        return;
      } else if (getRes.status === 404) {
        console.log('[No existing insights found, proceeding to generate...]');
      } else {
        throw new Error(`Failed to fetch insights: ${getRes.status} ${getRes.statusText}`);
      }

      console.log('[Generating new insights...]');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/insights/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reportId: file._id, userId: currentUser._id }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to generate insights: ${res.status} ${res.statusText} - ${errorData.error || 'Unknown error'}`);
      }

      const newData = await res.json();
      console.log('[Generated Insights]:', newData);
      setCurrentInsights(newData);
    } catch (err) {
      console.error('[Error fetching/generating insights]:', err);
      toast.error(err.message || 'Failed to load insights. Please try again.');
      setShowInsightsModal(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Uploaded Prescriptions</h3>
        <Link to="/patient-documents">
          <button className="text-sm bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 transition">
            View All
          </button>
        </Link>
      </div>

      {uploadedFiles.length === 0 ? (
        <p className="text-gray-500 text-sm">No files uploaded yet.</p>
      ) : (
        <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {[...uploadedFiles]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit || uploadedFiles.length)
            .map((file, idx) => (
              <li key={idx} className="border rounded-lg p-4 space-y-2 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-500 w-5 h-5" />
                  <div>
                    <p className="font-medium text-sm text-gray-800 dark:text-white">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{file.size} MB</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          file.type === 'Bill'
                            ? 'bg-red-100 text-red-800'
                            : file.type === 'Report'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {file.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Uploaded on: {new Date(file.date).toLocaleDateString()}
                    </p>
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
                    onClick={() => handleGenerateInsights(file)}
                    className="flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-md hover:bg-purple-200"
                  >
                    <Brain className="w-4 h-4" /> AI Insights
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

      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">File Information</h3>
            <p>
              <strong>Name:</strong> {showInfo.name}
            </p>
            <p>
              <strong>Type:</strong> {showInfo.type}
            </p>
            <p>
              <strong>Size:</strong> {showInfo.size} MB
            </p>
            <p>
              <strong>Date:</strong> {new Date(showInfo.date).toLocaleDateString()}
            </p>
            <p>
              <strong>OTP:</strong> {Date.now() > showInfo.otpExpiry ? 'Expired' : showInfo.otp}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => setShowInfo(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>
              Are you sure you want to delete <strong>{uploadedFiles[deleteIndex].name}</strong>?
            </p>
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

      <InsightsModal
        isOpen={showInsightsModal}
        onClose={() => setShowInsightsModal(false)}
        insights={currentInsights || { summary: '', parameters: [], recommendations: [] }}
      />
    </div>
  );
};

export default UploadList;
