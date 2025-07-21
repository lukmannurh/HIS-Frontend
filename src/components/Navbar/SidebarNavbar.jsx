import React, { useState, useContext } from 'react';

import ArchiveIcon from '@mui/icons-material/Archive';
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './SidebarNavbar.module.css';
import logoNavbar from '../../assets/images/logo-navbar.png';
import { AuthContext } from '../../context/AuthContext';
import LogoutDialog from '../LogoutDialog/LogoutDialog';

export default function SidebarNavbar({ collapsed, setCollapsed }) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userRole = auth?.user?.role?.toLowerCase() || 'user';

  // build menu based on role
  let menuItems = [];
  if (userRole === 'user') {
    menuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { text: 'Create Report', icon: <ArticleIcon />, path: '/create-report' },
      { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    ];
  } else if (userRole === 'admin') {
    menuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { text: 'Report Data', icon: <ArticleIcon />, path: '/reports' },
      { text: 'Archives', icon: <ArchiveIcon />, path: '/archives' },
      { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
      {
        text: 'User Management',
        icon: <GroupIcon />,
        path: '/user-management',
      },
    ];
  } else if (userRole === 'owner') {
    menuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { text: 'Archives', icon: <ArchiveIcon />, path: '/archives' },
      { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
      {
        text: 'User Management',
        icon: <GroupIcon />,
        path: '/user-management',
      },
    ];
  }

  const handleToggleCollapse = () => setCollapsed(!collapsed);
  const handleLogoutClick = () => setLogoutOpen(true);
  const handleLogoutClose = () => setLogoutOpen(false);
  const handleLogoutConfirm = () => logout();
  const handleNav = (path) => navigate(path);

  return (
    <Box className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Brand */}
      <Box className={styles.brandSection}>
        {!collapsed && (
          <Box className={styles.logoContainer}>
            <img src={logoNavbar} alt="Logo" className={styles.logoImage} />
            <Button
              variant="outlined"
              size="small"
              className={styles.roleButton}
            >
              Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </Button>
          </Box>
        )}
        <IconButton
          onClick={handleToggleCollapse}
          className={styles.toggleButton}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Menu items */}
      <List className={styles.menuList}>
        {menuItems.map((item) => (
          <Tooltip
            key={item.text}
            title={collapsed ? item.text : ''}
            placement="right"
          >
            <ListItem
              button
              onClick={() => handleNav(item.path)}
              className={styles.listItem}
            >
              <ListItemIcon className={styles.icon}>{item.icon}</ListItemIcon>
              {!collapsed && (
                <ListItemText primary={item.text} className={styles.text} />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {/* Logout */}
      <Box className={styles.footer}>
        <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
          <ListItem
            button
            onClick={handleLogoutClick}
            className={styles.listItem}
          >
            <ListItemIcon className={styles.icon}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary="Logout" className={styles.text} />
            )}
          </ListItem>
        </Tooltip>
      </Box>

      <LogoutDialog
        open={logoutOpen}
        onClose={handleLogoutClose}
        onLogout={handleLogoutConfirm}
        onRedirect={() => navigate('/')}
      />
    </Box>
  );
}
