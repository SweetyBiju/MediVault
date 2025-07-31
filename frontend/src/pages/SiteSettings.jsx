import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const SiteSettings = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition duration-300">
      

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Site Settings</h2>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 space-y-6 transition-all">

          {/* Dark Mode Toggle */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Dark Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark/light theme for the dashboard</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 relative after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {/* Notifications Toggle */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Health Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enable alerts for appointments, reports, and risks</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 relative after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {/* Placeholder for more settings */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Language</h3>
            <select className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none shadow-inner">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Hindi</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
