import React from 'react';

import { Box, Toolbar } from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import CreateReport from './pages/CreateReport/CreateReport';
import Dashboard from './pages/Dashboard/Dashboard';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';
import Profile from './pages/Profile/Profile';
import Register from './pages/Register/Register';
import ReportDetail from './pages/ReportDetail/ReportDetail';
import Reports from './pages/Reports/Reports';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import UserManagement from './pages/UserManagement/UserManagement';

const DefaultLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        {/* Toolbar sebagai spacer untuk mengkompensasi tinggi AppBar */}
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />
        <Route element={<DefaultLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Sibling routes untuk Reports */}
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
            path="/create-report"
            element={
              <ProtectedRoute>
                <CreateReport />
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
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
