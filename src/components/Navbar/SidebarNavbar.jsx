import React, { useState, useContext } from 'react';

import ArchiveIcon from '@mui/icons-material/Archive';
import ArticleIcon from '@mui/icons-material/Article';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './SidebarNavbar.module.css';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const SidebarNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const { auth, logout } = useContext(AuthContext);
  const { toggleTheme, mode } = useContext(ThemeContext);
  const navigate = useNavigate(); // untuk redirect

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  // Panggil logout dari context, lalu redirect
  const handleLogout = () => {
    setLogoutDialogOpen(false);
    logout();
    navigate('/login');
  };

  // Daftar menu
  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Reports', path: '/reports', icon: <ArticleIcon /> },
    { text: 'Archives', path: '/archives', icon: <ArchiveIcon /> },
    { text: 'Profile', path: '/profile', icon: <PersonIcon /> },
    ...(auth.user && (auth.user.role === 'owner' || auth.user.role === 'admin')
      ? [
          {
            text: 'User Management',
            path: '/user-management',
            icon: <GroupIcon />,
          },
        ]
      : []),
  ];

  return (
    <>
      <AppBar position="fixed" className={styles.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            HIS
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        classes={{ paper: styles.drawerPaper }}
      >
        <Box className={styles.drawerHeader}>
          <Typography variant="h6">
            {auth.user ? auth.user.username.toUpperCase() : 'Menu'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {auth.user && auth.user.role.toUpperCase()}
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={toggleDrawer}
                component={item.path ? 'a' : 'button'}
                href={item.path ? item.path : undefined}
              >
                <ListItemIcon className={styles.icon}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <Box className={styles.logoutContainer}>
          <ListItemButton
            onClick={handleLogoutConfirm}
            className={styles.logoutButton}
          >
            <ListItemIcon className={styles.icon}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Dialog Konfirmasi Logout */}
      <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
        <DialogTitle>Konfirmasi Logout</DialogTitle>
        <DialogContent>
          <Typography>Apakah Anda yakin ingin logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>Batal</Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SidebarNavbar;
