import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DailyCheckIn from './DailyCheckIn';
import HealthTip from './HealthTip';
import Reports from './Reports';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('check-in');
  const navigate = useNavigate();

useEffect(() => {
  if (!localStorage.getItem('token')) {
    navigate('/dashboard');
  }
}, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'check-in':
        return <DailyCheckIn />;
      case 'tips':
        return <HealthTip />;
      case 'reports':
        return <Reports />;
      case 'logout':
        localStorage.clear();
        navigate('/auth', { replace: true });
      default:
        return <div className="ml-5 mt-5">Select an option above to begin</div>;
    }
  };

  return (
    <div className="main-class">
      <h1 className="text-center text-blue-600 text-3xl font-bold my-4">
        Dashboard
      </h1>
      <nav className="topics-class flex gap-6 ml-6">
        <button
          onClick={() => setActiveSection('check-in')}
          className="checkin-class bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Daily Health Check-In
        </button>
        <button
          onClick={() => setActiveSection('tips')}
          className="tips-class bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Wellness Tips
        </button>
        <button
          onClick={() => setActiveSection('reports')}
          className="reports-class bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Weekly Reports
        </button>

        <button
          onClick={() => setActiveSection('logout')}
          className="reports-class bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Logout
        </button>

      </nav>

      <div className="content-section mt-6 ml-5">
        {renderContent()}
      </div>
    </div>
  );
}
