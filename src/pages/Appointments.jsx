import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    type: 'consultation',
    reason: '',
    isVirtual: false,
    notes: ''
  });

  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation', color: 'bg-blue-100 text-blue-800' },
    { value: 'followup', label: 'Follow-up', color: 'bg-green-100 text-green-800' },
    { value: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-800' },
    { value: 'telehealth', label: 'Telehealth', color: 'bg-purple-100 text-purple-800' }
  ];

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800',
    'no-show': 'bg-orange-100 text-orange-800'
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, filterStatus, searchTerm, selectedDate]);

  const fetchAppointments = async () => {
    // Mock data - in real app, this would be an API call
    const mockAppointments = [
      {
        id: 1,
        patient: { name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
        doctor: { name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
        date: '2024-01-20',
        time: '10:00',
        duration: 30,
        type: 'consultation',
        status: 'confirmed',
        reason: 'Regular checkup',
        notes: 'Patient reports chest pain',
        telehealth: {
          isVirtual: false,
          meetingLink: null
        },
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        patient: { name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891' },
        doctor: { name: 'Dr. Michael Chen', specialty: 'Internal Medicine' },
        date: '2024-01-22',
        time: '14:30',
        duration: 45,
        type: 'telehealth',
        status: 'scheduled',
        reason: 'Follow-up consultation',
        notes: 'Virtual appointment for medication review',
        telehealth: {
          isVirtual: true,
          meetingLink: 'https://meet.medivault.com/room/abc123'
        },
        createdAt: '2024-01-16T14:00:00Z'
      },
      {
        id: 3,
        patient: { name: 'Bob Wilson', email: 'bob@example.com', phone: '+1234567892' },
        doctor: { name: 'Dr. Emily Watson', specialty: 'Dermatology' },
        date: '2024-01-18',
        time: '09:15',
        duration: 30,
        type: 'followup',
        status: 'completed',
        reason: 'Skin condition follow-up',
        notes: 'Treatment showing good progress',
        telehealth: {
          isVirtual: false,
          meetingLink: null
        },
        createdAt: '2024-01-10T09:00:00Z'
      }
    ];

    setAppointments(mockAppointments);
  };

  const fetchDoctors = async () => {
    // Mock doctors data
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        hospitalAffiliation: 'City General Hospital',
        avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Internal Medicine',
        hospitalAffiliation: 'Metro Medical Center',
        avatar: 'https://images.pexels.com/photos/582750/pexels-photo-582750.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        id: 3,
        name: 'Dr. Emily Watson',
        specialty: 'Dermatology',
        hospitalAffiliation: 'Skin Care Clinic',
        avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    ];

    setDoctors(mockDoctors);
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected date in calendar view
    if (viewMode === 'calendar') {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(apt => apt.date === selectedDateStr);
    }

    setFilteredAppointments(filtered);
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    // Mock available slots
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allSlots.push(time);
      }
    }

    // Remove some slots to simulate bookings
    const bookedSlots = ['10:00', '14:30', '15:00'];
    const available = allSlots.filter(slot => !bookedSlots.includes(slot));
    
    setAvailableSlots(available);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    const newAppointment = {
      id: Date.now(),
      patient: { name: user.name, email: user.email, phone: user.phone },
      doctor: doctors.find(d => d.id === parseInt(bookingForm.doctorId)),
      date: bookingForm.date,
      time: bookingForm.time,
      duration: 30,
      type: bookingForm.type,
      status: 'scheduled',
      reason: bookingForm.reason,
      notes: bookingForm.notes,
      telehealth: {
        isVirtual: bookingForm.isVirtual,
        meetingLink: bookingForm.isVirtual ? `https://meet.medivault.com/room/${Date.now()}` : null
      },
      createdAt: new Date().toISOString()
    };

    setAppointments([newAppointment, ...appointments]);
    setShowBookingModal(false);
    setBookingForm({
      doctorId: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      type: 'consultation',
      reason: '',
      isVirtual: false,
      notes: ''
    });
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments</h1>
            <p className="text-gray-600">
              {user?.role === 'patient' 
                ? 'Manage your appointments and book new consultations with healthcare providers.'
                : 'View and manage your appointment schedule with patients.'
              }
            </p>
          </motion.div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Calendar
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {user?.role === 'patient' && (
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Book Appointment</span>
                </button>
              )}
              <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5" />
                <span>Reminders</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedDate(new Date())}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i - 6);
                  const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  const dayAppointments = appointments.filter(apt => 
                    apt.date === date.toISOString().split('T')[0]
                  );

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={`p-2 text-sm rounded-lg transition-colors relative ${
                        isCurrentMonth
                          ? isSelected
                            ? 'bg-blue-600 text-white'
                            : isToday
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-900 hover:bg-gray-100'
                          : 'text-gray-400'
                      }`}
                    >
                      {date.getDate()}
                      {dayAppointments.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                          <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      {appointment.telehealth.isVirtual ? (
                        <Video className="w-6 h-6 text-blue-600" />
                      ) : (
                        <User className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user?.role === 'patient' ? appointment.doctor.name : appointment.patient.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointmentTypes.find(t => t.value === appointment.type)?.color
                        }`}>
                          {appointmentTypes.find(t => t.value === appointment.type)?.label}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{appointment.reason}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(appointment.time)} ({appointment.duration} min)</span>
                        </div>
                        {user?.role === 'doctor' && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{appointment.patient.phone}</span>
                          </div>
                        )}
                        {appointment.telehealth.isVirtual && (
                          <div className="flex items-center space-x-1">
                            <Video className="w-4 h-4" />
                            <span>Virtual Meeting</span>
                          </div>
                        )}
                      </div>
                      
                      {appointment.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {appointment.telehealth.isVirtual && appointment.status === 'confirmed' && (
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Video className="w-5 h-5" />
                      </button>
                    )}
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    {user?.role === 'patient' && appointment.status === 'scheduled' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons for Doctors */}
                {user?.role === 'doctor' && appointment.status === 'scheduled' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-3">
                    <button
                      onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm</span>
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {filteredAppointments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : user?.role === 'patient'
                  ? 'Book your first appointment to get started'
                  : 'No appointments scheduled yet'
                }
              </p>
              {user?.role === 'patient' && (
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Book Appointment
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleBookAppointment} className="p-6 space-y-6">
              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Doctor *
                </label>
                <div className="grid gap-3">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() => {
                        setBookingForm({...bookingForm, doctorId: doctor.id.toString()});
                        setSelectedDoctor(doctor);
                        fetchAvailableSlots(doctor.id, bookingForm.date);
                      }}
                      className={`flex items-center space-x-4 p-4 border rounded-lg transition-colors ${
                        bookingForm.doctorId === doctor.id.toString()
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <p className="text-xs text-gray-500">{doctor.hospitalAffiliation}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => {
                      setBookingForm({...bookingForm, date: e.target.value});
                      if (selectedDoctor) {
                        fetchAvailableSlots(selectedDoctor.id, e.target.value);
                      }
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <select
                    required
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!selectedDoctor}
                  >
                    <option value="">Select time</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>{formatTime(slot)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Appointment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type *
                </label>
                <select
                  required
                  value={bookingForm.type}
                  onChange={(e) => setBookingForm({...bookingForm, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {appointmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Virtual Option */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isVirtual"
                  checked={bookingForm.isVirtual}
                  onChange={(e) => setBookingForm({...bookingForm, isVirtual: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isVirtual" className="text-sm font-medium text-gray-700">
                  Virtual appointment (Telehealth)
                </label>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit *
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.reason}
                  onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your concern"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional information for the doctor..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Appointments;