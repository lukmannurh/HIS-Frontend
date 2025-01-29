import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar.jsx";
import ProtectedRoute from "./components/Routes/ProtectedRoute.jsx";
import CreateReport from "./pages/CreateReport/CreateReport.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import Login from "./pages/Login/Login.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Register from "./pages/Register/Register.jsx";
import ReportDetail from "./pages/ReportDetail/ReportDetail.jsx";
import Reports from "./pages/Reports/Reports.jsx";
import Unauthorized from "./pages/Unauthorized/Unauthorized.jsx";
import UserManagement from "./pages/UserManagement/UserManagement.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />{" "}
        {/* Atur '/' ke LandingPage */}
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
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:id"
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
            <ProtectedRoute roles={["owner", "admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute roles={["owner", "admin"]}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
