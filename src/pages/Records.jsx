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
  Edit,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
  X,
  Send
} from 'lucide-react';

const Records = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'consultation',
    description: '',
    date: new Date().toISOString().split('T')[0],
    bodyPart: '',
    severity: 'low',
    tags: '',
    notes: '',
    files: []
  });
  const [shareForm, setShareForm] = useState({
    doctorEmail: '',
    expiresAt: '',
    accessLevel: 'read',
    message: ''
  });

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
  }, [records, searchTerm, filterType, selectedBodyPart]);

  const fetchRecords = async () => {
    // Mock data - in real app, this would be an API call
    const mockRecords = [
      {
        id: 1,
        title: 'Annual Physical Exam',
        type: 'consultation',
        description: 'Routine annual checkup with Dr. Smith',
        date: '2024-01-15',
        doctor: { name: 'Dr. John Smith', specialty: 'Family Medicine' },
        bodyPart: 'chest',
        severity: 'low',
        tags: ['routine', 'physical', 'checkup'],
        files: [
          { name: 'physical_exam_report.pdf', size: '2.3 MB', type: 'application/pdf' }
        ],
        aiInsights: {
          riskScore: 15,
          recommendations: ['Continue regular exercise', 'Monitor blood pressure']
        },
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        title: 'Blood Work Results',
        type: 'lab-result',
        description: 'Complete blood count and metabolic panel',
        date: '2024-01-10',
        doctor: { name: 'Dr. Sarah Johnson', specialty: 'Internal Medicine' },
        bodyPart: 'abdomen',
        severity: 'medium',
        tags: ['blood', 'lab', 'glucose'],
        files: [
          { name: 'blood_work_jan_2024.pdf', size: '1.8 MB', type: 'application/pdf' }
        ],
        aiInsights: {
          riskScore: 35,
          recommendations: ['Monitor glucose levels', 'Consider dietary changes']
        },
        createdAt: '2024-01-10T14:20:00Z'
      },
      {
        id: 3,
        title: 'Chest X-Ray',
        type: 'imaging',
        description: 'Chest X-ray for persistent cough',
        date: '2024-01-05',
        doctor: { name: 'Dr. Michael Chen', specialty: 'Radiology' },
        bodyPart: 'chest',
        severity: 'low',
        tags: ['xray', 'chest', 'cough'],
        files: [
          { name: 'chest_xray_jan_2024.jpg', size: '5.2 MB', type: 'image/jpeg' }
        ],
        aiInsights: {
          riskScore: 10,
          recommendations: ['Follow up if symptoms persist']
        },
        createdAt: '2024-01-05T09:15:00Z'
      }
    ];

    setRecords(mockRecords);
  };

  const filterRecords = () => {
    let filtered = records;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.type === filterType);
    }

    // Filter by body part
    if (selectedBodyPart) {
      filtered = filtered.filter(record => record.bodyPart === selectedBodyPart);
    }

    setFilteredRecords(filtered);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    // Mock upload - in real app, this would upload to server
    const newRecord = {
      id: Date.now(),
      ...uploadForm,
      tags: uploadForm.tags.split(',').map(tag => tag.trim()),
      doctor: user.role === 'doctor' ? { name: user.name, specialty: user.specialty } : null,
      aiInsights: {
        riskScore: Math.floor(Math.random() * 100),
        recommendations: ['AI analysis pending']
      },
      createdAt: new Date().toISOString()
    };

    setRecords([newRecord, ...records]);
    setShowUploadModal(false);
    setUploadForm({
      title: '',
      type: 'consultation',
      description: '',
      date: new Date().toISOString().split('T')[0],
      bodyPart: '',
      severity: 'low',
      tags: '',
      notes: '',
      files: []
    });
  };

  const handleShare = async (e) => {
    e.preventDefault();
    // Mock share - in real app, this would create a secure share link
    alert(`Record shared with ${shareForm.doctorEmail} until ${shareForm.expiresAt}`);
    setShowShareModal(false);
    setShareForm({
      doctorEmail: '',
      expiresAt: '',
      accessLevel: 'read',
      message: ''
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
            <p className="text-gray-600">
              {user?.role === 'patient' 
                ? 'Manage your medical records securely and share them with healthcare providers.'
                : 'Access and manage patient medical records with AI-powered insights.'
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
                {user?.role === 'patient' && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload Record</span>
                  </button>
                )}
                <button
                  onClick={() => setShowShareModal(true)}
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
                  {/* Simple body outline */}
                  <ellipse cx="50" cy="15" rx="8" ry="10" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="42" y="25" width="16" height="25" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="42" y="50" width="16" height="20" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="20" y="30" width="8" height="20" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="72" y="30" width="8" height="20" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="38" y="70" width="8" height="25" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="54" y="70" width="8" height="25" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                  
                  {/* Interactive body parts */}
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
                  <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Calendar className="w-5 h-5" />
                    <span>Date</span>
                  </button>
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
                              <span>{new Date(record.createdAt).toLocaleDateString()}</span>
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
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                        {user?.role === 'patient' && (
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* AI Insights */}
                    {record.aiInsights && (
                      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-purple-900">AI Insights</span>
                          <span className="text-sm text-purple-600">Risk Score: {record.aiInsights.riskScore}/100</span>
                        </div>
                        <ul className="text-sm text-purple-800 space-y-1">
                          {record.aiInsights.recommendations.map((rec, recIndex) => (
                            <li key={recIndex} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

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
                    {searchTerm || filterType !== 'all' || selectedBodyPart
                      ? 'Try adjusting your search or filters'
                      : 'Upload your first medical record to get started'
                    }
                  </p>
                  {user?.role === 'patient' && (
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
                  onClick={() => setShowUploadModal(false)}
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
                  Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Drop files here or click to upload</p>
                  <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setUploadForm({...uploadForm, files: Array.from(e.target.files)})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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
                <h2 className="text-2xl font-bold text-gray-900">Share Records</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleShare} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor's Email *
                </label>
                <input
                  type="email"
                  required
                  value={shareForm.doctorEmail}
                  onChange={(e) => setShareForm({...shareForm, doctorEmail: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="doctor@hospital.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expires At
                  </label>
                  <input
                    type="datetime-local"
                    value={shareForm.expiresAt}
                    onChange={(e) => setShareForm({...shareForm, expiresAt: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Level
                  </label>
                  <select
                    value={shareForm.accessLevel}
                    onChange={(e) => setShareForm({...shareForm, accessLevel: e.target.value})}
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
                  onChange={(e) => setShareForm({...shareForm, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a message for the doctor..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Share Records</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Records;