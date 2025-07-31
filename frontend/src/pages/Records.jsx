import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Upload,
  Share2,
  Search,
  Filter,
  Calendar,
  User,
  Heart,
  Brain,
  Eye,
  Bone,
  Pill,
  Activity,
  Plus,
  Download,
  Trash2,
  Clock,
  Shield,
  X,
  Send,
  XCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import InsightsModal from '../components/InsightsModal';
import { jsPDF } from 'jspdf';

const Records = () => {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [currentInsights, setCurrentInsights] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [shareForm, setShareForm] = useState({
    shareMethod: 'whatsapp',
    doctorEmail: '',
    expiresAt: '',
    accessLevel: 'read',
    message: ''
  });
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'consultation',
    description: '',
    date: new Date().toISOString().split('T')[0],
    bodyPart: '',
    severity: 'low',
    tags: '',
    files: []
  });
  const [isDragging, setIsDragging] = useState(false); // For drag-and-drop feedback

  const recordTypes = [
    { value: 'all', label: 'All Records', icon: FileText },
    { value: 'prescription', label: 'Prescriptions', icon: Pill },
    { value: 'lab-result', label: 'Lab Results', icon: Activity },
    { value: 'imaging', label: 'Imaging', icon: Eye },
    { value: 'consultation', label: 'Consultations', icon: User },
    { value: 'surgery', label: 'Surgery', icon: Heart },
    { value: 'vaccination', label: 'Vaccinations', icon: Shield },
    { value: 'other', label: 'Other', icon: FileText }
  ];

  const bodyParts = [
    { id: 'head', name: 'Head', x: 50, y: 15 },
    { id: 'chest', name: 'Chest', x: 50, y: 35 },
    { id: 'abdomen', name: 'Abdomen', x: 50, y: 50 },
    { id: 'left-arm', name: 'Left Arm', x: 25, y: 40 },
    { id: 'right-arm', name: 'Right Arm', x: 75, y: 40 },
    { id: 'left-leg', name: 'Left Leg', x: 40, y: 75 },
    { id: 'right-leg', name: 'Right Leg', x: 60, y: 75 }
  ];

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, filterType, selectedBodyPart, dateRange]);

  const fetchRecords = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No authentication token found. Please log in.');
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch records: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        const transformedRecords = await Promise.all(
          data.data.map(async (record) => {
            let aiInsight = null;
            try {
              const insightRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/insights/${record._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (insightRes.ok) {
                aiInsight = await insightRes.json();
              }
            } catch (err) {
              console.error(`Error fetching insights for record ${record._id}:`, err.message);
            }
            return {
              id: record._id,
              title: record.name || 'Untitled Record',
              type: record.type || 'other',
              description: record.description || 'No description available',
              date: record.date || new Date().toISOString().split('T')[0],
              doctor: record.doctor || { name: 'Unknown Doctor', specialty: 'Unknown' },
              bodyPart: record.bodyPart || '',
              severity: record.severity || 'low',
              tags: record.tags || [],
              files: [{ name: record.name, size: `${record.size} MB`, preview: record.preview, otp: record.otp }],
              aiInsight,
              createdAt: record.createdAt || record.date
            };
          })
        );
        setRecords(transformedRecords);
      } else {
        throw new Error(data.error || 'Failed to fetch records');
      }
    } catch (error) {
      console.error('Error fetching records:', error.message);
      toast.error('Failed to fetch records: ' + error.message);
    }
  };

  const filterRecords = () => {
    let filtered = records;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.type === filterType);
    }

    if (selectedBodyPart) {
      filtered = filtered.filter(record => record.bodyPart === selectedBodyPart);
    }

    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date).getTime();
        const start = dateRange.start ? new Date(dateRange.start).getTime() : -Infinity;
        const end = dateRange.end ? new Date(dateRange.end).getTime() : Infinity;
        return recordDate >= start && recordDate <= end;
      });
    }

    setFilteredRecords(filtered);
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const handleDownloadRecord = async (record) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.alert('Download failed. Please log in again.');
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads/${record.id}/file?otp=${record.files[0].otp}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        window.alert('Download failed. Please try again.');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = record.files[0]?.name || `${record.title}.${record.type}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      window.alert('Download successful');
    } catch (err) {
      console.error('[Error downloading record]:', err.message);
      window.alert('Download failed. Please try again.');
    }
  };

  const handleShareRecord = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing. Please log in again.');
      if (!selectedRecord) throw new Error('No record selected for sharing.');
      if (!currentUser?._id) throw new Error('User not authenticated. Please log in again.');

      if (shareForm.shareMethod === 'whatsapp') {
        const shareLink = `${selectedRecord.files[0].preview}?otp=${selectedRecord.files[0].otp}`;
        const message = encodeURIComponent(
          `${shareForm.message || 'Please review my medical record.'}\n${shareLink}`
        );
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
        window.alert('Record shared successfully');
      } else if (shareForm.shareMethod === 'portal') {
        if (!shareForm.doctorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shareForm.doctorEmail)) {
          throw new Error('Invalid doctor email');
        }

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads/share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recordId: selectedRecord.id,
            sharedWithEmail: shareForm.doctorEmail,
            expiresAt: shareForm.expiresAt,
            accessLevel: shareForm.accessLevel,
            message: shareForm.message,
            sharedByUserId: currentUser._id
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`Failed to share record: ${res.status} ${errorData.error || 'Unknown error'}`);
        }

        window.alert('Record shared successfully');
      }

      setShowShareModal(false);
      setShareForm({ shareMethod: 'whatsapp', doctorEmail: '', expiresAt: '', accessLevel: 'read', message: '' });
      setSelectedRecord(null);
    } catch (err) {
      console.error('[Error sharing record]:', err.message);
      toast.error(err.message || 'Failed to share record. Please try again.');
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing. Please log in again.');

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads/${recordId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Failed to delete record: ${res.status}`);

      setRecords(prevRecords => prevRecords.filter(r => r.id !== recordId));
      toast.success('Record deleted successfully!');
    } catch (err) {
      console.error('[Error deleting record]:', err.message);
      toast.error('Failed to delete record: ' + err.message);
    }
  };

  const handleGenerateInsights = async (record) => {
    try {
      if (!record.id) throw new Error('Invalid record ID');
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing. Please log in again.');
      if (!currentUser?._id) throw new Error('User not authenticated. Please log in again.');

      console.log('[Generate Insights Input]:', { reportId: record.id, userId: currentUser._id, token });
      setCurrentInsights(null);
      setShowInsightsModal(true);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/insights/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reportId: record.id, userId: currentUser._id }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to generate insights: ${res.status} ${res.statusText} - ${errorData.error || 'Unknown error'}`);
      }

      const newInsight = await res.json();
      console.log('[Generated Insights]:', newInsight);

      setRecords(prevRecords =>
        prevRecords.map(r =>
          r.id === record.id ? { ...r, aiInsight: newInsight } : r
        )
      );
      setCurrentInsights(newInsight);
      toast.success('Insights generated successfully!');
    } catch (err) {
      console.error('[Error generating insights]:', err.message);
      toast.error(err.message || 'Failed to generate insights. Please try again.');
      setShowInsightsModal(false);
    }
  };

  const handleDownloadInsights = (insight, recordTitle) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Medical Insights for ${recordTitle}`, 20, 20);

      doc.setFontSize(12);
      doc.text('Summary:', 20, 40);
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(insight.summary || 'No summary available', 170);
      doc.text(summaryLines, 20, 50);

      let yOffset = 50 + summaryLines.length * 7 + 10;
      doc.setFontSize(12);
      doc.text('Parameters:', 20, yOffset);
      doc.setFontSize(10);
      insight.parameters?.forEach((param, index) => {
        const paramText = `${index + 1}. ${param.name || `Parameter ${index + 1}`}: ${param.value} (${param.range}, ${param.meaning}, ${param.status}, ${param.organ})`;
        const paramLines = doc.splitTextToSize(paramText, 170);
        doc.text(paramLines, 20, yOffset + 10);
        yOffset += paramLines.length * 7 + 5;
      });

      doc.setFontSize(12);
      doc.text('Recommendations:', 20, yOffset);
      doc.setFontSize(10);
      insight.recommendations?.forEach((rec, index) => {
        const recText = `${index + 1}. ${rec}`;
        const recLines = doc.splitTextToSize(recText, 170);
        doc.text(recLines, 20, yOffset + 10);
        yOffset += recLines.length * 7 + 5;
      });

      doc.save(`${recordTitle}_insights.pdf`);
      toast.success('Insights downloaded as PDF!');
    } catch (err) {
      console.error('[Error downloading insights as PDF]:', err.message);
      toast.error('Failed to download insights as PDF.');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No authentication token found. Please log in.');
      return;
    }
    if (uploadForm.files.length === 0) {
      toast.error('Please select at least one file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('type', uploadForm.type);
    formData.append('description', uploadForm.description);
    formData.append('date', uploadForm.date);
    formData.append('bodyPart', uploadForm.bodyPart);
    formData.append('severity', uploadForm.severity);
    formData.append('tags', uploadForm.tags);
    uploadForm.files.forEach(file => formData.append('files', file));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        fetchRecords();
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          type: 'consultation',
          description: '',
          date: new Date().toISOString().split('T')[0],
          bodyPart: '',
          severity: 'low',
          tags: '',
          files: []
        });
        toast.success('Record uploaded successfully!');
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (error) {
      console.error('Upload error:', error.message);
      toast.error('Failed to upload record: ' + error.message);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setUploadForm({ ...uploadForm, files: [...uploadForm.files, ...newFiles] });
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const newFiles = Array.from(e.dataTransfer.files).filter(file => {
      const ext = path.extname(file.name).toLowerCase();
      return ['.pdf', '.docx', '.png', '.jpg', '.jpeg'].includes(ext);
    });
    if (newFiles.length < e.dataTransfer.files.length) {
      toast.error('Some files were rejected. Only PDF, DOCX, and image files are allowed.');
    }
    setUploadForm({ ...uploadForm, files: [...uploadForm.files, ...newFiles] });
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadForm({
      ...uploadForm,
      files: uploadForm.files.filter((_, index) => index !== indexToRemove)
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    const typeObj = recordTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : FileText;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Records</h1>
            <p className="text-gray-600">
              {currentUser?.role === 'patient'
                ? 'Access and manage your medical records with AI-powered insights.'
                : 'Manage your medical records securely and share them with healthcare providers.'
              }
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {currentUser?.role === 'patient' && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload Record</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (!selectedRecord) {
                      toast.error('Please select a record to share.');
                      return;
                    }
                    setShowShareModal(true);
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Records</span>
                </button>
              </div>
            </motion.div>

            {/* Body Map */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Body Map</h3>
              <div className="relative">
                <svg viewBox="0 0 100 100" className="w-full h-64 border border-gray-200 rounded-lg">
                  <ellipse cx="50" cy="15" rx="8" ry="10" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="42" y="25" width="16" height="25" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="42" y="50" width="16" height="20" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="20" y="30" width="8" height="20" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="72" y="30" width="8" height="20" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="38" y="70" width="8" height="25" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="54" y="70" width="8" height="25" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  {bodyParts.map((part) => (
                    <circle
                      key={part.id}
                      cx={part.x}
                      cy={part.y}
                      r="4"
                      fill={selectedBodyPart === part.id ? "#3b82f6" : "#6b7280"}
                      className="cursor-pointer hover:fill-blue-500 transition-colors"
                      onClick={() => setSelectedBodyPart(selectedBodyPart === part.id ? null : part.id)}
                    />
                  ))}
                </svg>
                {selectedBodyPart && (
                  <div className="mt-2 text-center">
                    <span className="text-sm text-blue-600 font-medium">
                      Filtering by: {bodyParts.find(p => p.id === selectedBodyPart)?.name}
                    </span>
                    <button
                      onClick={() => setSelectedBodyPart(null)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Filter by Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Type</h3>
              <div className="space-y-2">
                {recordTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFilterType(type.value)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      filterType === type.value
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <type.icon className="w-5 h-5" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-5 h-5" />
                    <span>Filter</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-600">to</span>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Records List */}
            <div className="space-y-4">
              {filteredRecords.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          {React.createElement(getTypeIcon(record.type), {
                            className: "w-6 h-6 text-blue-600"
                          })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(record.severity)}`}>
                              {record.severity}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{record.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(record.date).toLocaleDateString()}</span>
                            </div>
                            {record.doctor && (
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{record.doctor.name}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(record.createdAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                          {record.tags && record.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {record.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewRecord(record)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDownloadRecord(record)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRecord(record);
                            setShowShareModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        {currentUser?.role === 'patient' && (
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-900">AI Insights</span>
                      </div>
                      {record.aiInsight ? (
                        <div>
                          <p className="text-sm text-purple-800 mb-2">{record.aiInsight.summary}</p>
                          <button
                            onClick={() => {
                              setCurrentInsights(record.aiInsight);
                              setShowInsightsModal(true);
                            }}
                            className="flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-md hover:bg-purple-200"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Full Insights</span>
                          </button>
                          <button
                            onClick={() => handleDownloadInsights(record.aiInsight, record.title)}
                            className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-3 py-1 rounded-md hover:bg-green-200 ml-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Insights</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-purple-800">AI Insights Pending</span>
                          <button
                            onClick={() => handleGenerateInsights(record)}
                            className="flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-md hover:bg-purple-200"
                          >
                            <Brain className="w-4 h-4" />
                            <span>Generate Insights</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Files */}
                    {record.files && record.files.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                        <div className="flex flex-wrap gap-2">
                          {record.files.map((file, fileIndex) => (
                            <div
                              key={fileIndex}
                              className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({file.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {filteredRecords.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterType !== 'all' || selectedBodyPart || dateRange.start || dateRange.end
                      ? 'Try adjusting your search or filters'
                      : 'Upload your first medical record to get started'
                    }
                  </p>
                  {currentUser?.role === 'patient' && (
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Upload Record
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Upload Medical Record</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadForm({
                      title: '',
                      type: 'consultation',
                      description: '',
                      date: new Date().toISOString().split('T')[0],
                      bodyPart: '',
                      severity: 'low',
                      tags: '',
                      files: []
                    });
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Blood Test Results"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    required
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {recordTypes.slice(1).map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the record..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={uploadForm.date}
                    onChange={(e) => setUploadForm({...uploadForm, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Part
                  </label>
                  <select
                    value={uploadForm.bodyPart}
                    onChange={(e) => setUploadForm({...uploadForm, bodyPart: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select body part</option>
                    {bodyParts.map((part) => (
                      <option key={part.id} value={part.id}>{part.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    value={uploadForm.severity}
                    onChange={(e) => setUploadForm({...uploadForm, severity: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., routine, blood work, glucose"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Files *
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-600">Drop files here or click to upload</p>
                    <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG, DOCX up to 10MB</p>
                  </label>
                </div>
                {uploadForm.files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h4>
                    <div className="space-y-2">
                      {uploadForm.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadForm({
                      title: '',
                      type: 'consultation',
                      description: '',
                      date: new Date().toISOString().split('T')[0],
                      bodyPart: '',
                      severity: 'low',
                      tags: '',
                      files: []
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Upload Record
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Share Record</h2>
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    setSelectedRecord(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleShareRecord} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Method *
                </label>
                <select
                  value={shareForm.shareMethod}
                  onChange={(e) => setShareForm({ ...shareForm, shareMethod: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="portal">Portal</option>
                </select>
              </div>

              {shareForm.shareMethod === 'portal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor's Email *
                  </label>
                  <input
                    type="email"
                    required={shareForm.shareMethod === 'portal'}
                    value={shareForm.doctorEmail}
                    onChange={(e) => setShareForm({ ...shareForm, doctorEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="doctor@hospital.com"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expires At
                  </label>
                  <input
                    type="datetime-local"
                    value={shareForm.expiresAt}
                    onChange={(e) => setShareForm({ ...shareForm, expiresAt: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Level
                  </label>
                  <select
                    value={shareForm.accessLevel}
                    onChange={(e) => setShareForm({ ...shareForm, accessLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="read">Read Only</option>
                    <option value="write">Read & Write</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  rows={3}
                  value={shareForm.message}
                  onChange={(e) => setShareForm({ ...shareForm, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a message for the doctor..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowShareModal(false);
                    setSelectedRecord(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Share Record</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Record Modal */}
      {showViewModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">View Record</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Details</h3>
                <p className="text-gray-600"><strong>Title:</strong> {selectedRecord.title}</p>
                <p className="text-gray-600"><strong>Type:</strong> {selectedRecord.type}</p>
                <p className="text-gray-600"><strong>Date:</strong> {new Date(selectedRecord.date).toLocaleDateString()}</p>
                <p className="text-gray-600"><strong>Description:</strong> {selectedRecord.description}</p>
                <p className="text-gray-600"><strong>Severity:</strong> {selectedRecord.severity}</p>
                {selectedRecord.bodyPart && (
                  <p className="text-gray-600"><strong>Body Part:</strong> {bodyParts.find(p => p.id === selectedRecord.bodyPart)?.name}</p>
                )}
              </div>
              {selectedRecord.files && selectedRecord.files.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Files</h3>
                  {selectedRecord.files.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({file.size})</span>
                      <button
                        onClick={() => handleDownloadRecord(selectedRecord)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Insights Modal */}
      <InsightsModal
        isOpen={showInsightsModal}
        onClose={() => setShowInsightsModal(false)}
        insights={currentInsights || { summary: '', parameters: [], recommendations: [] }}
      />
    </div>
  );
};

export default Records;