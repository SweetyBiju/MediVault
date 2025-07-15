import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import PatientDashboard from './pages/PatientDashboard'; 
import AccessControl from './pages/AccessControl';
import Doctors from './pages/Doctors';
import UploadFiles from './pages/UploadFiles';
import SiteSettings from './pages/SiteSettings';
import CloudStorage from './pages/CloudStorage';
import UploadDetailsPage from './pages/UploadDetailsPage';
import Insurance from './pages/Insurance';


import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DoctorDashboard from './pages/DoctorDashboard';
import Records from './pages/Records';
import Appointments from './pages/Appointments';
import Insights from './pages/Insights';
import Feedback from './pages/Feedback';
import Forum from './pages/Forum';
import About from './pages/About';
import Contact from './pages/Contact';

import AppointmentRequestForm from './components/AppointmentRequestForm';
import Chatbot from './components/Chatbot';
import DoctorCard from './components/DoctorCard';
import EmergencyHealthCard from './components/EmergencyHealthCard';
import UploadList from './components/UploadList';
import MedicationHistory from './components/MedicationHistory';

// Dashboard Router Component
const DashboardRouter = () => {
  const { currentUser } = useAuth();
  if (currentUser?.role === 'doctor') {
    return <DoctorDashboard />;
  } else if (currentUser?.role === 'patient') {
    return <PatientDashboard />; 
  } else {
    // Fallback for unauthenticated or undefined roles
    return <Navigate to="/signin" />;
  }
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar />
            <main className="relative">
              <Routes>
                {/* Default route */}
                <Route path="/" element={<HomePage />} />

                {/* Authentication routes */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected dashboard routes */}
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>}
                />
                <Route
                  path="/records"
                  element={<ProtectedRoute><Records /></ProtectedRoute>}
                />
                <Route
                  path="/appointments"
                  element={<ProtectedRoute><Appointments /></ProtectedRoute>}
                />
                <Route
                  path="/insurance"
                  element={<ProtectedRoute><Insurance /></ProtectedRoute>}
                />
                <Route
                  path="/insights"
                  element={<ProtectedRoute><Insights /></ProtectedRoute>}
                />
                <Route
                  path="/feedback"
                  element={<ProtectedRoute><Feedback /></ProtectedRoute>}
                />
                <Route
                  path="/forum"
                  element={<ProtectedRoute><Forum /></ProtectedRoute>}
                />

                <Route path="/access" element={<ProtectedRoute><AccessControl /></ProtectedRoute>} />
                <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><UploadFiles /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SiteSettings /></ProtectedRoute>} />
                <Route path="/storage" element={<ProtectedRoute><CloudStorage /></ProtectedRoute>} />
                <Route path="/upload-details" element={<ProtectedRoute><UploadDetailsPage /></ProtectedRoute>} />

                <Route path="/components/appointment-request" element={<AppointmentRequestForm />} />
                <Route path="/components/chatbot" element={<Chatbot />} />
                <Route path="/components/doctor-card" element={<DoctorCard />} />
                <Route path="/components/emergency-health-card" element={<EmergencyHealthCard />} />
                <Route path="/components/upload-list" element={<UploadList />} />
                <Route path="/components/medication-history" element={<MedicationHistory />} />


                {/* 404 fallback */}
                <Route path="*" element={<div className="p-8 text-center text-gray-500">Page Not Found</div>} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;