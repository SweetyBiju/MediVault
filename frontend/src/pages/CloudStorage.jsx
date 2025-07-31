import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getUsedStorageMB, getFileList, deleteFile, renameFile, tagFile, getStorageHistory } from '../utils/storage';
import { Pie, Line } from 'react-chartjs-2';
import { Trash2, Edit2, Tag, FileText, DownloadCloud, Eye } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';


const plans = [
  {
    name: 'Basic',
    price: '₹199/mo',
    storage: '5 GB',
    color: 'from-blue-100 to-blue-300',
    features: ['Delete/Rename files', 'Smart Cleanup'],
  },
  {
    name: 'Advanced',
    price: '₹499/mo',
    storage: '20 GB',
    color: 'from-green-100 to-green-300',
    features: ['All Basic features', 'Tags & Previews', 'Download All Files'],
  },
  {
    name: 'Ultimate',
    price: '₹999/mo',
    storage: '50 GB',
    color: 'from-purple-100 to-purple-300',
    features: ['All Advanced features', 'Usage History Graph'],
  }
];

// const [plan, setPlan] = useState('free');

const CloudStorage = () => {
  const [plan] = useState('basic');
  const [usedMB, setUsedMB] = useState(0);
  const [files, setFiles] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  const totalMB = plan === 'free' ? 250 : plan === 'basic' ? 5120 : plan === 'advanced' ? 20480 : 51200;
  const percentUsed = ((usedMB / totalMB) * 100).toFixed(1);

  useEffect(() => {
    setUsedMB(parseFloat(getUsedStorageMB()));
    setFiles(getFileList());
    if (plan === 'ultimate') setHistoryData(getStorageHistory());
  }, []);

  const breakdown = {
    labels: ['PDF', 'Image', 'Other'],
    datasets: [{
      data: [40, 30, 30],
      backgroundColor: ['#3b82f6', '#10b981', '#6b7280']
    }]
  };

  const historyChart = {
    labels: historyData.map(d => d.date),
    datasets: [{ label: 'Used (MB)', data: historyData.map(d => d.used), borderColor: '#3b82f6', fill: false }]
  };

  const handleDelete = (id) => {
    deleteFile(id);
    setFiles(getFileList());
    setUsedMB(parseFloat(getUsedStorageMB()));
    toast.success('File deleted!');
  };

  const handleRename = (id) => {
    const name = prompt('Enter new file name:');
    if (name) {
      renameFile(id, name);
      setFiles(getFileList());
      toast.success('File renamed!');
    }
  };

  const handleTag = (id) => {
    if (plan === 'free' || plan === 'basic') {
      toast.error('Upgrade to use tags.');
    } else {
      const tag = prompt('Enter a tag (e.g., Prescription)');
      if (tag) {
        tagFile(id, tag);
        setFiles(getFileList());
        toast.success('Tag added.');
      }
    }
  };

  const handleBackup = () => {
    toast.error('Download All is a premium feature.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-white">
      <Toaster />
      <div className="mb-4">
        <label className="font-semibold mr-2">Simulate Plan:</label>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="advanced">Advanced</option>
          <option value="ultimate">Ultimate</option>
        </select>
      </div>
     
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">MediVault Cloud Storage</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your medical documents securely and efficiently.</p>
        </div>

        {/* Storage Overview */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
            <p className="text-sm text-gray-500">Storage Used</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div className="bg-blue-500 h-full transition-all" style={{ width: `${percentUsed}%` }}></div>
            </div>
            <p><strong>{usedMB} MB</strong> of <strong>{totalMB} MB</strong> used</p>
            <div className="w-40 h-40 mx-auto">
              <Pie data={breakdown} options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#4b5563', font: { size: 12 } }
                  }
                },
                maintainAspectRatio: false,
              }} />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => { localStorage.clear(); setFiles([]); setUsedMB(0); toast.success('Cleared all files.'); }}
              >
                Clear All
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => toast.error("Smart Cleanup is a premium feature.")}
              >
                Smart Cleanup
              </button>
            </div>
          </div>

          {/* File List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md h-[400px] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Your Files</h2>
            {files.length === 0 ? (
              <p className="text-gray-500">No files uploaded yet.</p>
            ) : (
              <ul className="space-y-4">
                {files.map((file, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-blue-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.type} · {file.size} MB</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(file.id)}><Trash2 size={16} /></button>
                      <button onClick={() => handleRename(file.id)}><Edit2 size={16} /></button>
                      <button onClick={() => handleTag(file.id)}><Tag size={16} /></button>
                      <button onClick={() => toast.info('Preview coming soon.')}><Eye size={16} /></button>
                      <button onClick={() => window.open(file.preview, '_blank')}><DownloadCloud size={16} /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Usage History */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Storage Usage History</h2>
          {plan === 'ultimate' ? (
            <Line data={historyChart} />
          ) : (
            <div className="text-center text-gray-400 italic">Upgrade to Ultimate to see your usage history.</div>
          )}
        </div>

        {/* Backup */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex justify-between items-center">
          <p className="font-medium flex items-center gap-2"><DownloadCloud /> Backup & Download</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleBackup}
          >
            Download All
          </button>
        </div>

        Premium Plans
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Premium Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div
                key={plan.name}
                className={`rounded-2xl shadow-md p-6 bg-gradient-to-br ${plan.color} text-gray-800 dark:text-white hover:scale-[1.02] transition`}
              >
                <h3 className="text-xl font-semibold">{plan.name} Plan</h3>
                <p className="text-3xl font-bold mt-2">{plan.price}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Includes {plan.storage} of cloud storage</p>
                <ul className="mt-4 space-y-2 text-sm list-disc pl-5">
                  {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                <button className="mt-6 w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800">
                  Upgrade →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 mt-10">MediVault Cloud · Free Tier Limited to 250 MB · Powered by Secure Cloud</footer>
      </div>
    </div>
  );
};

export default CloudStorage;
