import React, { useContext } from 'react';

import AdminDashboard from './AdminDashboard/AdminDashboard';
import styles from './Dashboard.module.css';
import OwnerDashboard from './OwnerDashboard/OwnerDashboard';
import UserDashboard from './UserDashboard/UserDashboard';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);

  // Jika belum login, bisa redirect atau tampilkan null
  if (!auth?.isAuthenticated) {
    return null;
    // Atau: return <Navigate to="/login" />;
  }

  // Pilih komponen dashboard berdasarkan role
  let Component;
  switch (auth.user.role) {
    case 'owner':
      Component = OwnerDashboard;
      break;
    case 'admin':
      Component = AdminDashboard;
      break;
    default:
      Component = UserDashboard;
  }

  return (
    <div className={styles.dashboardWrapper}>
      <Component />
    </div>
  );
};

export default Dashboard;
