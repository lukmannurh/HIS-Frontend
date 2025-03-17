import React, { useEffect, useState, useContext } from 'react';

import LoginIcon from '@mui/icons-material/Login';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
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

  const handleLeftClick = () => {
    if (auth.user) {
      navigate('/dashboard');
    } else {
      navigate('/'); // landing page
    }
  };

  const handleRightClick = () => {
    if (auth.user) {
      navigate('/profile');
    } else if (location.pathname !== '/login') {
      navigate('/login');
    }
  };

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
      <Toolbar sx={{ minHeight: topBarHeight }}>
        <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleLeftClick}>
          <Typography variant="h6" className={styles.title}>
            {pageTitle}
          </Typography>
        </Box>
        <Box
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={handleRightClick}
        >
          {auth.user ? (
            <Typography variant="body1" className={styles.username}>
              {auth.user.fullName || auth.user.username}
            </Typography>
          ) : (
            location.pathname !== '/login' && (
              <>
                <LoginIcon className={styles.loginIcon} />
                <Typography variant="body1" className={styles.loginText}>
                  Login
                </Typography>
              </>
            )
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
