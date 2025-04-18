import React, { useEffect, useState, useContext } from 'react';

import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { AppBar, Toolbar, Typography, Box, Tooltip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './TopBar.module.css';
import { AuthContext } from '../../context/AuthContext';

// Mapping path ke judul halaman
const pageTitleMap = {
  '/dashboard': 'Dashboard',
  '/reports': 'Reports',
  '/create-report': 'Create Report',
  '/archives': 'Archives',
  '/profile': 'Profile',
  '/user-management': 'User Management',
  '/login': 'HIS',
};

export default function TopBar({ topBarHeight, leftOffset }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [pageTitle, setPageTitle] = useState('HIS');

  useEffect(() => {
    const pathname = location.pathname;
    setPageTitle(pageTitleMap[pathname] || 'HIS');
  }, [location]);

  // Klik judul di kiri => ke dashboard atau landing page
  const handleLeftClick = () => {
    if (auth.user) {
      navigate('/dashboard');
    } else {
      navigate('/'); // landing page
    }
  };

  // Klik di kanan => ke profile atau login
  const handleRightClick = () => {
    if (auth.user) {
      navigate('/profile');
    } else if (location.pathname !== '/login') {
      navigate('/login');
    }
  };

  // Pastikan selalu menampilkan fullName jika ada, kalau tidak ada gunakan username
  const displayName = auth.user?.fullName || auth.user?.username;

  return (
    <AppBar
      position="absolute"
      sx={{
        top: 0,
        left: leftOffset,
        width: `calc(100% - ${leftOffset}px)`,
        height: topBarHeight,
        zIndex: 1200,
      }}
      className={styles.topBar}
      elevation={2}
    >
      <Toolbar sx={{ minHeight: topBarHeight, px: 2 }}>
        {/* Bagian Kiri (Judul Halaman) */}
        <Box
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={handleLeftClick}
        >
          <Typography variant="h6" className={styles.title}>
            {pageTitle}
          </Typography>
        </Box>

        {/* Bagian Kanan (User Info atau Login) */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={handleRightClick}
        >
          {auth.user ? (
            <Tooltip title="Go to Profile">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonOutlineIcon className={styles.userIcon} />
                <Typography variant="body1" className={styles.username}>
                  {displayName}
                </Typography>
              </Box>
            </Tooltip>
          ) : (
            location.pathname !== '/login' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LoginIcon className={styles.loginIcon} />
                <Typography variant="body1" className={styles.loginText}>
                  Login
                </Typography>
              </Box>
            )
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
