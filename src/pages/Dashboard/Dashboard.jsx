import React, { useContext } from 'react';

import AdminDashboard from './AdminDashboard/AdminDashboard';
import OwnerDashboard from './OwnerDashboard/OwnerDashboard';
import UserDashboard from './UserDashboard/UserDashboard';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    return null; // atau redirect ke /login
  }

  switch (auth.user.role) {
    case 'owner':
      return <OwnerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <UserDashboard />;
  }
};

export default Dashboard;
