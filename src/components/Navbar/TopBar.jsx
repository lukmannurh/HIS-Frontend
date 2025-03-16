import React, { useEffect, useState, useContext } from 'react';

import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

import styles from './TopBar.module.css';
import { AuthContext } from '../../context/AuthContext';

// Peta path => judul halaman
const pageTitleMap = {
  '/dashboard': 'Dashboard',
  '/reports': 'Reports',
  '/create-report': 'Create Report',
  '/archives': 'Archives',
  '/profile': 'Profile',
  '/user-management': 'User Management',
  // ... sesuaikan rute lain
};

export default function TopBar({ topBarHeight, leftOffset }) {
  const location = useLocation();
  const { auth } = useContext(AuthContext);

  const [pageTitle, setPageTitle] = useState('HIS');

  useEffect(() => {
    const pathname = location.pathname;
    setPageTitle(pageTitleMap[pathname] || 'HIS');
  }, [location]);

  return (
    <AppBar
      position="absolute"
      sx={{
        top: 0,
        left: leftOffset,
        width: `calc(100% - ${leftOffset}px)`, // Agar tidak melebihi layar
        height: topBarHeight,
        zIndex: 1200, // di bawah sidebar (sidebar zIndex 1300)
      }}
      className={styles.topBar}
      elevation={2}
    >
      <Toolbar sx={{ minHeight: topBarHeight }}>
        <Typography variant="h6" className={styles.title}>
          {pageTitle}
        </Typography>

        {auth?.user && (
          <Box className={styles.userInfo}>
            <Typography variant="body1" className={styles.username}>
              {auth.user.fullName}
            </Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
