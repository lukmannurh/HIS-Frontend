import React, { useContext } from 'react';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import styles from './Navbar.module.css';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const { mode, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          HIS
        </Typography>
        {auth.isAuthenticated ? (
          <>
            <Button color="inherit" component={RouterLink} to="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={RouterLink} to="/reports">
              Reports
            </Button>
            <Button color="inherit" component={RouterLink} to="/profile">
              Profile
            </Button>
            {(auth.user.role === 'owner' || auth.user.role === 'admin') && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/user-management"
              >
                User Management
              </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          </>
        )}
        <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleTheme}>
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
