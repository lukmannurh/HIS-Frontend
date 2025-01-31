import React, { useState, useContext } from 'react';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import styles from './SidebarNavbar.module.css'; // CSS Module untuk styling tambahan
import { AuthContext } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Pastikan Bootstrap diimpor

const SidebarNavbar = () => {
  const [open, setOpen] = useState(false);
  const { auth, logout, toggleTheme } = useContext(AuthContext);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'Reports', path: '/reports' },
    { text: 'Profile', path: '/profile' },
    ...(auth.user.role === 'owner' || auth.user.role === 'admin'
      ? [{ text: 'User Management', path: '/user-management' }]
      : []),
    { text: 'Logout', action: logout },
  ];

  return (
    <>
      {/* AppBar di atas sidebar */}
      <AppBar position="fixed" className={`bg-primary ${styles.appBar}`}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            HIS
          </Typography>
          <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleTheme}>
            {auth.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer dengan Bootstrap */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, // Membantu performa pada perangkat mobile
        }}
        className={styles.drawer}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
          className="bg-light"
        >
          <List className="mt-3">
            {menuItems.map((item, index) => (
              <ListItem
                button
                key={index}
                component={item.path ? RouterLink : 'button'}
                to={item.path}
                onClick={item.action ? item.action : null}
                className="text-dark"
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </>
  );
};

export default SidebarNavbar;
