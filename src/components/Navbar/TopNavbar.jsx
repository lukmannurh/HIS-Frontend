import React, { useContext } from 'react';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import styles from './TopNavbar.module.css'; // CSS Module untuk styling tambahan
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

import 'bootstrap/dist/css/bootstrap.min.css'; // Pastikan Bootstrap diimpor

const TopNavbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <AppBar position="static" className={`bg-primary ${styles.appBar}`}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          HIS
        </Typography>
        {auth.isAuthenticated ? (
          <>
            <Button
              color="inherit"
              component={RouterLink}
              to="/dashboard"
              className="mx-2"
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/reports"
              className="mx-2"
            >
              Reports
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/profile"
              className="mx-2"
            >
              Profile
            </Button>
            {(auth.user.role === 'owner' || auth.user.role === 'admin') && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/user-management"
                className="mx-2"
              >
                User Management
              </Button>
            )}
            <Button color="inherit" onClick={logout} className="mx-2">
              Logout
            </Button>
          </>
        ) : (
          <Button
            color="inherit"
            component={RouterLink}
            to="/login"
            className="mx-2"
          >
            Login
          </Button>
        )}

        <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleTheme}>
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
