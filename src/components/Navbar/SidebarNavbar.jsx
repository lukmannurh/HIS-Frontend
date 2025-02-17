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

import styles from './SidebarNavbar.module.css';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const SidebarNavbar = () => {
  const [open, setOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const { toggleTheme, mode } = useContext(ThemeContext);

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
      <AppBar position="fixed" className={styles.appBar}>
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
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        className={styles.drawer}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
          className={styles.drawerBox}
        >
          <List className="mt-3">
            {menuItems.map((item, index) => (
              <ListItem
                button
                key={index}
                component={item.path ? RouterLink : 'button'}
                to={item.path}
                onClick={item.action ? item.action : null}
                className={styles.listItem}
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
