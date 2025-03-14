import React, { useContext } from 'react';

import AdminDashboard from './AdminDashboard';
import OwnerDashboard from './OwnerDashboard';
import UserDashboard from './UserDashboard';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    return null;
  }

  // Pilih dashboard sesuai role
  if (auth.user.role === 'owner') {
    return <OwnerDashboard />;
  } else if (auth.user.role === 'admin') {
    return <AdminDashboard />;
  } else {
    return <UserDashboard />;
  }
};

export default Dashboard;
