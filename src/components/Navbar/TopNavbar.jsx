import React from 'react';

import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import styles from './TopNavbar.module.css';

const TopNavbar = () => {
  // Hook untuk mengetahui path saat ini
  const location = useLocation();

  // Jika path saat ini adalah /login, kita sembunyikan link "Login"
  const showLogin = location.pathname !== '/login';

  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        {/* Tulisan HIS di sisi kiri */}
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          className={styles.brand}
        >
          HIS
        </Typography>

        {/* Di sisi kanan, tampilkan link "Login" jika bukan di /login */}
        <div className={styles.rightSection}>
          {showLogin && (
            <Typography
              variant="h5"
              component={RouterLink}
              to="/login"
              className={styles.loginLink}
            >
              Login
            </Typography>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
