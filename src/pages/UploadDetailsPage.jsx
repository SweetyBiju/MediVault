import React, { useEffect, useState } from 'react';
import { FileText, Trash2, Send } from 'lucide-react';
import { getUsedStorageMB } from '../utils/storage';
import  { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UploadDetailsPage = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('uploadedFiles');
        if (saved) setUploadedFiles(JSON.parse(saved));
    }, []);

    const handleDelete = (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this document?");
        if (!confirmDelete) return;

        const updated = [...uploadedFiles];
        updated.splice(index, 1);
        setUploadedFiles(updated);
        localStorage.setItem('uploadedFiles', JSON.stringify(updated));
        toast.success("Document deleted.");
    };

    const filteredFiles = uploadedFiles.filter(file => {
        return (
            (filterType === 'All' || file.type === filterType) &&
            file.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const usedMB = getUsedStorageMB();
    const totalMB = 10;
    const percentUsed = (usedMB / totalMB) * 100;

    const warning = percentUsed >= 90
        ? '⚠️ Storage almost full! Consider deleting unused files.'
        : percentUsed >= 75
            ? '🟡 You are nearing your storage limit.'
            : '';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white px-6 py-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Uploaded Documents</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by file name..."
                    className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                >
                    <option value="All">All Types</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Report">Report</option>
                    <option value="Bill">Bill</option>
                </select>

                <button
                    onClick={() => {
                        setFilterType('All');
                        setSearchQuery('');
                    }}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Clear Filters
                </button>
            </div>

            {/* Stats + Storage Bar */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                <p>Total Files: <strong>{uploadedFiles.length}</strong> | Total Size: <strong>{usedMB} MB</strong></p>
                <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden mt-2 dark:bg-gray-700">
                    <div className="h-full bg-blue-500" style={{ width: `${percentUsed}%` }}></div>
                </div>
                {warning && <p className="mt-2 text-red-600 dark:text-yellow-400">{warning}</p>}
            </div>

            {/* File List */}
            {filteredFiles.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No matching documents found.</p>
            ) : (
                <ul className="space-y-4">
                    {filteredFiles.map((file, idx) => {
                        const isOtpExpired = file.otpExpiry && Date.now() > new Date(file.otpExpiry).getTime();

                        return (
                            <li key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-blue-500 w-6 h-6" />
                                    <div>
                                        <h4 className="text-sm font-semibold flex flex-col">
                                            {file.name}
                                            <span className="mt-1 text-xs text-gray-400">
                                                Preview:
                                                {file.preview ? (
                                                    file.type.includes('image') ? (
                                                        <img src={file.preview} alt="preview" className="mt-1 w-24 rounded shadow" />
                                                    ) : file.type.includes('pdf') ? (
                                                        <iframe src={file.preview} title="preview" className="mt-1 w-24 h-28 border rounded" />
                                                    ) : (
                                                        <span className="text-xs text-gray-500">Preview not available</span>
                                                    )
                                                ) : (
                                                    <span className="text-xs text-gray-500 ml-1">Not available</span>
                                                )}
                                            </span>
                                        </h4>

                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            <span>{file.size} MB • </span>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-white ${file.type === 'Bill' ? 'bg-red-500' :
                                                    file.type === 'Report' ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`}
                                            >
                                                {file.type}
                                            </span>{' '}
                                            • Uploaded: {file.date} • OTP:{' '}
                                            <span className={isOtpExpired ? 'text-red-500' : 'text-green-600'}>
                                                {isOtpExpired ? 'Expired' : file.otp}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            if (isOtpExpired) {
                                                toast.error("OTP expired!");
                                                return;
                                            }
                                            const msg = `Hi Doctor, please access my document: ${file.name}\nAccess OTP: ${file.otp}`;
                                            navigator.clipboard.writeText(msg);
                                            toast.success("OTP copied!");
                                        }}
                                        className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                    >
                                        Copy OTP
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (isOtpExpired) {
                                                toast.error("OTP expired!");
                                                return;
                                            }
                                            const msg = `Hi Doctor, please access my document: ${file.name}\nAccess OTP: ${file.otp}`;
                                            const link = `https://wa.me/?text=${encodeURIComponent(msg)}`;
                                            window.open(link, '_blank');
                                        }}
                                        className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                                    >
                                        <Send size={14} /> WhatsApp
                                    </button>

                                    <a
                                        href={file.preview}
                                        download={file.name}
                                        className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                                    >
                                        Download
                                    </a>


                                    <button
                                        onClick={() => handleDelete(idx)}
                                        className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default UploadDetailsPage;
