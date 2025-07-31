import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar, FileText, Users, Bell, TrendingUp, Activity,
  Brain, Stethoscope, Plus, ArrowRight, Clock, AlertCircle,
  CheckCircle, User, Video, MessageSquare, Search, Filter,
  Eye, Edit, Star, Heart, Send, RefreshCw,
  Award, Target, BarChart3, PieChart, Zap, Shield, Pill,
  Thermometer, Weight, MapPin, Download, Upload, Share2,
  Bookmark, Flag, Settings, HelpCircle
} from 'lucide-react';
import axios from 'axios';
import { getAppointments, reviewChange } from "../utils/api";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [todayStats, setTodayStats] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await getAppointments(currentUser._id);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?._id) fetchAppointments();
  }, [currentUser]);

    const handleDecision = async (appointmentId, requestId, decision) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5600/api/appointments/${appointmentId}/change-decision`,
        { requestId, decision, reviewedBy: currentUser?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Request ${decision}`);

      // Add flash effect
      setPendingRequests(prev =>
        prev.map(appt =>
          appt._id === appointmentId
            ? { ...appt, flashColor: decision === "approved" ? "green" : "red", tempStatus: decision }
            : appt
        )
      );

      // Remove from lists after animation
      setTimeout(() => {
        setPendingRequests(prev => prev.filter(appt => appt._id !== appointmentId));
        setAppointments(prev => prev.filter(appt => appt._id !== appointmentId));
      }, 1000);

    } catch (err) {
      console.error("Error updating appointment:", err.response?.data || err.message);
      toast.error("Failed to process decision");
    }
  };

    // Combined Dummy Data Loader
  useEffect(() => {
    // Second DoctorDashboard data (prioritized for existing fields)
    setTodayStats({
      totalPatients: 20,
      todayAppointments: 6,
      completedToday: 3,
      pendingReviews: 2,
      emergencyAlerts: 1,
      avgRating: 4.8,
      responseTime: '12 min',
      satisfaction: 94
    });
    setAppointments([
      {
        id: 1,
        patient: 'Riya Sharma',
        time: '11:00 AM',
        duration: 20,
        condition: 'Fever',
        lastVisit: '2024-06-28',
        type: 'General',
        isVirtual: true,
        priority: 'medium',
        status: 'confirmed' // Added for compatibility with first
      },
      // Additional appointments from first
      {
        id: 2,
        patient: 'Sarah Johnson',
        time: '9:00 AM',
        type: 'Follow-up',
        duration: 30,
        status: 'confirmed',
        isVirtual: false,
        condition: 'Hypertension',
        lastVisit: '2024-01-15',
        priority: 'normal'
      },
      {
        id: 3,
        patient: 'Michael Chen',
        time: '10:30 AM',
        type: 'Consultation',
        duration: 45,
        status: 'pending',
        isVirtual: true,
        condition: 'Diabetes',
        lastVisit: 'New Patient',
        priority: 'high'
      },
      {
        id: 4,
        patient: 'Emily Watson',
        time: '2:00 PM',
        type: 'Emergency',
        duration: 60,
        status: 'urgent',
        isVirtual: false,
        condition: 'Chest Pain',
        lastVisit: '2024-01-10',
        priority: 'urgent'
      }
    ]);

    setAiInsights([
      {
        id: 1,
        patient: 'Anil Mehta',
        type: 'Cardio Analysis',
        confidence: 0.91,
        insight: 'Mild arrhythmia detected.',
        recommendation: 'Refer to cardiologist.',
        priority: 'high'
      },
      // Additional AI insights from first
      {
        id: 2,
        patient: 'Sarah Johnson',
        insight: 'Potential drug interaction detected',
        confidence: 0.85,
        recommendation: 'Review current medications',
        priority: 'high',
        type: 'diagnostic'
      },
      {
        id: 3,
        patient: 'Michael Chen',
        insight: 'Risk of diabetic complications increasing',
        confidence: 0.72,
        recommendation: 'Consider intensifying treatment',
        priority: 'medium',
        type: 'predictive'
      },
      {
        id: 4,
        patient: 'Emily Watson',
        insight: 'Unusual pattern in vital signs',
        confidence: 0.68,
        recommendation: 'Schedule additional monitoring',
        priority: 'medium',
        type: 'anomaly'
      }
    ]);

    setPatients([
      {
        id: 1,
        name: 'Priya Yadav',
        age: 35,
        riskLevel: 'low',
        condition: 'Migraine',
        status: 'improving',
        lastVisit: '2024-06-26',
        adherence: 88,
        nextAppointment: '2024-07-15' // Added for compatibility
      },
      // Additional patients from first
      {
        id: 2,
        name: 'Sarah Johnson',
        age: 45,
        condition: 'Hypertension',
        lastVisit: '2024-01-15',
        nextAppointment: '2024-02-10',
        riskLevel: 'medium',
        adherence: 85,
        status: 'stable'
      },
      {
        id: 3,
        name: 'Michael Chen',
        age: 52,
        condition: 'Type 2 Diabetes',
        lastVisit: '2024-01-20',
        nextAppointment: '2024-02-15',
        riskLevel: 'high',
        adherence: 92,
        status: 'improving'
      },
      {
        id: 4,
        name: 'Emily Watson',
        age: 38,
        condition: 'Asthma',
        lastVisit: '2024-01-18',
        nextAppointment: '2024-02-12',
        riskLevel: 'low',
        adherence: 78,
        status: 'stable'
      }
    ]);

    setUrgentTasks([
      {
        id: 1,
        task: 'Emergency Blood Report',
        patient: 'Rahul',
        dueTime: '1 hour',
        priority: 'urgent',
        type: 'lab_review' // Added for compatibility
      },
      // Additional tasks from first
      {
        id: 2,
        task: 'Complete discharge summary',
        patient: 'Mary Smith',
        priority: 'high',
        dueTime: '2 hours',
        type: 'documentation'
      },
      {
        id: 3,
        task: 'Follow up on medication adherence',
        patient: 'Robert Johnson',
        priority: 'medium',
        dueTime: '4 hours',
        type: 'follow_up'
      }
    ]);

    setRecentActivity([
      {
        id: 1,
        action: 'Updated prescription',
        patient: 'Vikram',
        time: 'Today 9:45 AM',
        priority: 'high',
        type: 'prescription' // Added for compatibility
      },
      // Additional activities from first
      {
        id: 2,
        type: 'record_updated',
        patient: 'Sarah Johnson',
        action: 'Lab results reviewed',
        time: '30 minutes ago',
        priority: 'normal'
      },
      {
        id: 3,
        type: 'appointment_completed',
        patient: 'Michael Chen',
        action: 'Follow-up consultation completed',
        time: '1 hour ago',
        priority: 'normal'
      },
      {
        id: 4,
        type: 'alert',
        patient: 'Emily Watson',
        action: 'Critical lab value detected',
        time: '2 hours ago',
        priority: 'high'
      }
    ]);

    setNotifications([
      {
        id: 1,
        title: 'New Appointment',
        message: 'Rakesh Kumar booked for 4:30 PM',
        time: 'Just now',
        type: 'appointment',
        patient: 'Rakesh Kumar', // Added for compatibility
        action: 'Prepare for visit' // Added for compatibility
      },
      // Additional notifications from first
      {
        id: 2,
        type: 'urgent',
        title: 'Critical Lab Result',
        message: 'Patient John Doe has critically high glucose levels',
        time: '15 minutes ago',
        patient: 'John Doe',
        action: 'Review immediately'
      },
      {
        id: 3,
        type: 'system',
        title: 'New Patient Records',
        message: '3 new patient records require review',
        time: '1 hour ago',
        patient: null,
        action: 'Review records'
      }
    ]);

    setPerformanceMetrics({
      patientSatisfaction: 94,
      avgConsultationTime: 14,
      diagnosisAccuracy: 92,
      responseTime: 10,
      treatmentSuccess: 87,
      patientRetention: 76
    });
  }, []);

  useEffect(() => {
    setPendingRequests(appointments.filter(appt =>
      ['requested', 'postpone', 'prepone', 'mode-changed'].includes(appt.status)
    ));
  }, [appointments]);

  // Chart Initialization (unchanged from second)
  useEffect(() => {
    const ctx = document.getElementById('performanceChart')?.getContext('2d');
    if (ctx && window.Chart) {
      new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Satisfaction', 'Consultation', 'Accuracy', 'Response', 'Success', 'Retention'],
          datasets: [{
            label: 'Performance',
            data: [
              performanceMetrics.patientSatisfaction || 0,
              performanceMetrics.avgConsultationTime || 0,
              performanceMetrics.diagnosisAccuracy || 0,
              performanceMetrics.responseTime || 0,
              performanceMetrics.treatmentSuccess || 0,
              performanceMetrics.patientRetention || 0
            ],
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 10
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Performance Metrics', font: { size: 18 } },
            legend: { display: false }
          },
          scales: {
            x: { ticks: { color: '#333' }, grid: { display: false } },
            y: { ticks: { color: '#333' }, grid: { color: 'rgba(0,0,0,0.1)' } }
          }
        }
      });
    }
  }, [performanceMetrics]);

  const getStatusColor = (status) => {
    const map = {
      urgent: 'text-red-600 bg-red-100 border-red-200',
      high: 'text-orange-600 bg-orange-100 border-orange-200',
      medium: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      normal: 'text-green-600 bg-green-100 border-green-200',
      low: 'text-blue-600 bg-blue-100 border-blue-200'
    };
    return map[status] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const MetricCard = ({ title, value, unit, icon: Icon, color, trend }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-xl p-4 shadow-md border hover:shadow-xl transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-xl font-bold text-gray-800">{value}</h3>
            {unit && <span className="text-sm text-gray-400">{unit}</span>}
          </div>
          {trend && (
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-500">+{trend}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header (from second) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Good Morning, Dr. {currentUser?.name || 'Doctor'} 👨‍⚕️
              </h1>
              <p className="text-gray-600 mt-1">
                You have {todayStats.todayAppointments || 0} appointments today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics (from second, expanded with first’s metrics) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8"
        >
          <MetricCard title="Total Patients" value={todayStats.totalPatients} icon={Users} color="blue" />
          <MetricCard title="Appointments" value={todayStats.todayAppointments} icon={Calendar} color="green" />
          <MetricCard title="Completed" value={todayStats.completedToday} icon={CheckCircle} color="purple" />
          <MetricCard title="Pending Reviews" value={todayStats.pendingReviews} icon={FileText} color="orange" />
          <MetricCard title="Emergency Alerts" value={todayStats.emergencyAlerts} icon={AlertCircle} color="red" />
          <MetricCard title="Avg Rating" value={todayStats.avgRating} unit="/5" icon={Star} color="yellow" />
          <MetricCard title="Response Time" value={todayStats.responseTime} icon={Clock} color="cyan" />
          <MetricCard title="Satisfaction" value={todayStats.satisfaction} unit="%" icon={Heart} color="pink" trend="2.5" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Overview (from second) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">Detailed Report</span>
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(performanceMetrics).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {key.includes('Time') ? `${value} min` : `${value}%`}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(value, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pending Appointment Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Pending Appointment Requests
              </h2>
              <AnimatePresence>
                {pendingRequests && pendingRequests.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {pendingRequests.map((appt) => (
                      <motion.div
                        key={appt._id}
                        id={`req-${appt._id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 border rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition relative`}
                        style={{
                          backgroundColor: appt.flashColor
                            ? appt.flashColor === "green"
                              ? "#d1fae5"
                              : "#fee2e2"
                            : "#f9fafb"
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg">
                              {appt.patientId?.name || "Unknown Patient"}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Request Type:</strong>{" "}
                              {appt.status === "requested"
                                ? "New Appointment"
                                : appt.status === "postpone"
                                  ? "Postpone Request"
                                  : appt.status === "prepone"
                                    ? "Prepone Request"
                                    : appt.status === "mode-changed"
                                      ? "Change Mode"
                                      : "Other"}
                            </p>
                            {(appt.reason || appt.changeRequests?.[0]?.reason) && (
                              <p className="text-sm text-gray-500 italic mt-1">
                                <strong>Purpose:</strong>{" "}
                                {appt.reason || appt.changeRequests?.[0]?.reason}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Date:</strong>{" "}
                              {appt.date ? new Date(appt.date).toLocaleDateString() : "N/A"} |{" "}
                              <strong>Time:</strong> {appt.time || "N/A"} |{" "}
                              <strong>Mode:</strong> {appt.isVirtual ? "Virtual" : "Walk-in"}
                            </p>
                          </div>
                          <div className="space-x-2 flex-shrink-0">
                            <button
                              onClick={() => {
                                if (!appt.changeRequests?.[0]?._id) {
                                  console.error("No changeRequest ID for appointment:", appt);
                                  return;
                                }
                                handleDecision(appt._id, appt.changeRequests[0]._id, "approved");
                              }}
                              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                if (!appt.changeRequests?.[0]?._id) {
                                  console.error("No changeRequest ID for appointment:", appt);
                                  return;
                                }
                                handleDecision(appt._id, appt.changeRequests[0]._id, "rejected");
                              }}
                              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No pending requests.</p>
                )}
              </AnimatePresence>
            </motion.div>


            {/* Today's Schedule (from first) */}
{/*             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <Link
                    to="/appointments"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span className="text-sm">View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className={`p-4 border rounded-lg ${getStatusColor(appointment.priority)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{appointment.patient}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {appointment.type}
                          </span>
                          {appointment.isVirtual && (
                            <Video className="w-4 h-4 text-green-600" />
                          )}
                          {getPriorityIcon(appointment.priority)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time} ({appointment.duration} min)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{appointment.condition}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>Last: {appointment.lastVisit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        {appointment.isVirtual && (
                          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                            <Video className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div> */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Appointments
                </h2>
                <Link
                  to={{
                    pathname: "/appointments",
                    state: { userId: currentUser?._id, role: "doctor" }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View All →
                </Link>
              </div>
              {appointments && appointments.length > 0 ? (
                appointments
                  .filter(
                    (appt) =>
                      (appt.status === "confirmed" || appt.status === "scheduled") &&
                      appt.doctorId?._id === currentUser?._id
                  )
                  .sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time))
                  .slice(0, 6)
                  .map((appt) => (
                    <motion.div
                      key={appt._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 mb-3 border rounded-lg shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-lg">{appt.patientId?.name}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(appt.date).toLocaleDateString()} at {appt.time}{" "}
                            • {appt.isVirtual ? "Virtual" : "In-person"}
                          </p>
                          {appt.reason && (
                            <p className="text-sm text-gray-500 italic">{appt.reason}</p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${appt.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <p className="text-gray-500 italic">No upcoming appointments.</p>
              )}
            </motion.div>

            {/* AI Insights (from first) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">AI Diagnostic Insights</h2>
                </div>
                <Link
                  to="/insights"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span className="text-sm">View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{insight.patient}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(insight.priority)}`}>
                            {insight.type}
                          </span>
                          <span className="text-sm text-blue-600">
                            {Math.round(insight.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{insight.insight}</p>
                        <p className="text-sm font-medium text-green-600">{insight.recommendation}</p>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Patient Overview (from first) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Patients</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                  <Link
                    to="/records"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span className="text-sm">View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="space-y-4">
                {patients.map((patient) => (
                  <div key={patient.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{patient.name}</h3>
                          <span className="text-sm text-gray-500">Age {patient.age}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.riskLevel)}`}>
                            {patient.riskLevel} risk
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            patient.status === 'stable' ? 'bg-green-100 text-green-800' : 
                            patient.status === 'improving' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {patient.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Condition: {patient.condition}</span>
                          <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                          <span>Adherence: {patient.adherence}%</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance Metrics (from first) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">Detailed Report</span>
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(performanceMetrics).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {key.includes('Time') ? `${value} min` : `${value}%`}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(value, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions (from first) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/records"
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Patient Note</span>
                </Link>
                <Link
                  to="/appointments"
                  className="flex items-center space-x-3 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Appointment</span>
                </Link>
                <Link
                  to="/insights"
                  className="flex items-center space-x-3 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Brain className="w-5 h-5" />
                  <span>AI Diagnostics</span>
                </Link>
                <button className="flex items-center space-x-3 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full">
                  <Send className="w-5 h-5" />
                  <span>Send Prescription</span>
                </button>
              </div>
            </motion.div>

            {/* Urgent Tasks (from first) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Urgent Tasks</h3>
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="space-y-3">
                {urgentTasks.map((task) => (
                  <div key={task.id} className={`p-3 rounded-lg border-l-4 ${
                    task.priority === 'urgent' ? 'border-red-500 bg-red-50' : 
                    task.priority === 'high' ? 'border-orange-500 bg-orange-50' : 
                    'border-yellow-500 bg-yellow-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{task.task}</h4>
                        <p className="text-xs text-gray-600 mt-1">Patient: {task.patient}</p>
                        <p className="text-xs text-gray-500 mt-1">Due in: {task.dueTime}</p>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity (from first) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full ${
                      activity.priority === 'high' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        activity.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">Patient: {activity.patient}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Notifications (from first) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${
                    notification.type === 'urgent' ? 'border-red-500 bg-red-50' : 
                    notification.type === 'appointment' ? 'border-blue-500 bg-blue-50' : 
                    'border-gray-500 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
      </motion.div>
   
  );
};

export default DoctorDashboard;
