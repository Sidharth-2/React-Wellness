import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './components/AuthPage';
import HealthTip from './components/HealthTip';
import DailyCheckIn from './components/DailyCheckIn';
import Reports from './components/Reports';
import Dashboard from './components/Dashboard';
import OAuth2RedirectHandler from './utils/OAuth2RedirectHandler'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <div className="main-class">
        <h1 className="text-center text-blue-600 text-3xl font-bold my-4">
          Welcome to Your Wellness App
          </h1>

        <Routes>
          <Route path="/check-in" element={<DailyCheckIn />} />
          <Route path="/tips" element={<HealthTip />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        </Routes>
          <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;