import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { Maximize2, Minimize2, MoveUp, MoveDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import GreetingsCard from '../components/GreetingsCard';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import BMIGauge from '../components/BMIGauge';
import Upload from '../components/Upload';
import UploadList from '../components/UploadList';
import UpcomingAppointments from '../components/UpcomingAppointments';
import AppointmentRequestForm from '../components/AppointmentRequestForm';
import Timeline from '../components/Timeline';
import AllergyNotices from '../components/AllergyNotices';
import MedicationHistory from '../components/MedicationHistory';
import GeneralNotes from '../components/GeneralNotes';
import DoctorPanel from '../components/DoctorCard';
import EmergencyHealthCard from '../components/EmergencyHealthCard';
import Chatbot from '../components/Chatbot';
import HealthScoreGauge from '../components/HealthScoreGauge';
import QuickActions from '../components/QuickActions';
import AnimatedSection from '../components/AnimatedSection';
import Insight from '../components/Insight';
import { useAuth } from '../context/AuthContext';

import toast, { Toaster } from 'react-hot-toast';

const PatientDashboard = () => {
  
  const { currentUser } = useAuth();
  const bpRef = useRef(null);
  const sugarRef = useRef(null);
  const bpChartInstance = useRef(null);
  const sugarChartInstance = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (bpRef.current) {
      bpChartInstance.current = new Chart(bpRef.current, {
        type: 'line',
        data: {
          labels: ['25/03', '10/04', '25/04', '12/05', '25/05', '10/06'],
          datasets: [{
            label: 'BP (mmHg)',
            data: [107, 105, 110, 120, 125, 130],
            borderColor: '#ef4444',
            tension: 0.4,
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            fill: true,
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: {
            y: {
              beginAtZero: false,
            }
          }
        }
      });
    }

    if (sugarRef.current) {
      sugarChartInstance.current = new Chart(sugarRef.current, {
        type: 'line',
        data: {
          labels: ['25/03', '10/04', '25/04', '12/05', '25/05', '10/06'],
          datasets: [{
            label: 'Sugar (mg/dL)',
            data: [110, 105, 107, 100, 99, 101],
            borderColor: '#36a2eb',
            tension: 0.4,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: {
            y: {
              beginAtZero: false,
            }
          }
        }
      });
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      bpChartInstance.current?.destroy();
      sugarChartInstance.current?.destroy();
    };
  }, []);

  const handleUploadToast = () => {
    toast.success('File uploaded successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8faff] via-[#f6f6fb] to-[#ffffff] dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 text-gray-800 dark:text-white">
      <Toaster position='top-right' />
     
      <GreetingsCard user={currentUser.name }/>

      <main className="space-y-12">
        <AnimatedSection>
          <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[
              { title: "Total Records", value: uploadedFiles.length, icon: "file", color: "blue" },
              { title: "Appointments", value: "3", icon: "calendar", color: "green" },
              { title: "AI Insights", value: "4", icon: "chart", color: "purple" },
              { title: "Active Alerts", value: "2", icon: "alert", color: "red" },
              { title: "Medicines", value: "3", icon: "access", color: "orange" },
              { title: "Next Checkup", value: "In 2 days", icon: "countdown", color: "yellow" }
            ].map((stat, index) => (
              <div
                key={index}
                className="transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-2xl"
              >
                <StatCard {...stat} />
              </div>
            ))}
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="max-w-6xl mx-auto px-4">
            <HealthScoreGauge score={92} />
          </section>
        </AnimatedSection>
       
        <AnimatedSection>
          <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            <ChartCard title="BP History" label="Latest: 122/84 mmHg " className="hover:ring-1 hover:ring-blue-400">
              <canvas ref={bpRef} className="w-full h-full" />
            </ChartCard>
            <ChartCard title="Sugar History" label="Latest: 98 mg/dL">
              <canvas ref={sugarRef} className="w-full h-full" />
            </ChartCard>
            <BMIGauge bmiValue={24.5} />
          </section>
        </AnimatedSection>



        
        <AnimatedSection>
          <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div onClick={handleUploadToast}>
              <Upload uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
            </div>
            <UploadList uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}  limit={3} />
          </section>
        </AnimatedSection>
        


        <AnimatedSection>
          <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingAppointments />
          <AppointmentRequestForm />
          </section>
        </AnimatedSection>

        
        <AnimatedSection>
          <section className="max-w-6xl mx-auto px-4 mt-6">
            <Insight />
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DoctorPanel />
          <AllergyNotices />
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MedicationHistory />
          <GeneralNotes />
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="max-w-6xl mx-auto px-4">
          <Timeline />
          </section>
        </AnimatedSection>
      </main>

      <div className="fixed bottom-4 left-4 z-30">
        <EmergencyHealthCard />
      </div>
      <div className="fixed bottom-24 left-4 z-40">
        <Chatbot />
      </div>
    </div>
  );
};

export default PatientDashboard;