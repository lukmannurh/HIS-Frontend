import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/Routes/ProtectedRoute';
import DefaultLayout from './layouts/AppLayout';
import Archives from './pages/Archives/Archives';
import CreateReport from './pages/CreateReport/CreateReport';
import Dashboard from './pages/Dashboard/Dashboard';
import EditReport from './pages/EditReport/EditReport';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';
import Profile from './pages/Profile/Profile';
import Register from './pages/Register/Register';
import ReportDetail from './pages/ReportDetail/ReportDetail';
import Reports from './pages/Reports/Reports';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import UserManagement from './pages/UserManagement/UserManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Semua route kita bungkus dengan DefaultLayout */}
        <Route element={<DefaultLayout />}>
          {/* LandingPage tidak butuh ProtectedRoute */}
          <Route path="/" element={<LandingPage />} />

          {/* Halaman login & unauthorized juga di dalam layout,
              tapi tidak perlu ProtectedRoute */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Sisanya perlu ProtectedRoute sesuai role */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/:reportId"
            element={
              <ProtectedRoute>
                <ReportDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/edit/:reportId"
            element={
              <ProtectedRoute>
                <EditReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-report"
            element={
              <ProtectedRoute>
                <CreateReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/archives"
            element={
              <ProtectedRoute>
                <Archives />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute roles={['owner', 'admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute roles={['owner', 'admin']}>
                <Register />
              </ProtectedRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
