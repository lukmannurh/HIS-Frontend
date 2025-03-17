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

  // Menu utama
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    {
      text: 'Reports',
      icon: <ArticleIcon />,
      children: [
        { text: 'Create Report', path: '/create-report' },
        { text: 'Report Data', path: '/reports' },
      ],
    },
    { text: 'Archives', icon: <ArchiveIcon />, path: '/archives' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  // Menu admin
  const adminMenu = {
    text: 'User Management',
    icon: <GroupIcon />,
    path: '/user-management',
  };

  const userRole = auth?.user?.role || 'User';

  // Toggle collapse
  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Buka dialog logout
  const handleLogoutClick = () => {
    setLogoutOpen(true);
  };

  // Tutup dialog logout
  const handleLogoutClose = () => {
    setLogoutOpen(false);
  };

  // Eksekusi logout
  const handleLogoutConfirm = () => {
    logout();
  };

  // Navigasi menu
  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <Box className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Brand Section */}
      <Box className={styles.brandSection}>
        {!collapsed && (
          <Box className={styles.logoContainer}>
            <img src={logoNavbar} alt="Logo" className={styles.logoImage} />
            <Button variant="outlined" className={styles.roleButton}>
              Role: {userRole}
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

      <Divider className={styles.divider} />

      {/* Menu */}
      <List className={styles.menuList}>
        {menuItems.map((item, idx) => {
          if (item.children) {
            return (
              <Box key={idx}>
                <Tooltip title={collapsed ? item.text : ''} placement="right">
                  <ListItem
                    button
                    onClick={() => handleNav(item.children[0].path)}
                    className={styles.listItem}
                  >
                    <span className={styles.icon}>{item.icon}</span>
                    {!collapsed && (
                      <span className={styles.text}>{item.text}</span>
                    )}
                  </ListItem>
                </Tooltip>
                {!collapsed && (
                  <Box className={styles.subMenu}>
                    {item.children.map((subItem, subIdx) => (
                      <ListItem
                        button
                        key={subIdx}
                        onClick={() => handleNav(subItem.path)}
                        className={styles.subMenuItem}
                      >
                        <span className={styles.subMenuText}>
                          {subItem.text}
                        </span>
                      </ListItem>
                    ))}
                  </Box>
                )}
              </Box>
            );
          }
          return (
            <Tooltip
              title={collapsed ? item.text : ''}
              placement="right"
              key={idx}
            >
              <ListItem
                button
                onClick={() => handleNav(item.path)}
                className={styles.listItem}
              >
                <span className={styles.icon}>{item.icon}</span>
                {!collapsed && <span className={styles.text}>{item.text}</span>}
              </ListItem>
            </Tooltip>
          );
        })}

        {(userRole === 'owner' || userRole === 'admin') && (
          <Tooltip title={collapsed ? adminMenu.text : ''} placement="right">
            <ListItem
              button
              onClick={() => handleNav(adminMenu.path)}
              className={styles.listItem}
            >
              <span className={styles.icon}>{adminMenu.icon}</span>
              {!collapsed && (
                <span className={styles.text}>{adminMenu.text}</span>
              )}
            </ListItem>
          </Tooltip>
        )}
      </List>

      {/* Footer: Logout di bagian paling bawah */}
      <Box className={styles.footer}>
        <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
          <ListItem
            button
            onClick={handleLogoutClick}
            className={styles.listItem}
          >
            <span className={styles.icon}>
              <LogoutIcon />
            </span>
            {!collapsed && <span className={styles.text}>Logout</span>}
          </ListItem>
        </Tooltip>
      </Box>

      {/* Dialog logout */}
      <LogoutDialog
        open={logoutOpen}
        onClose={handleLogoutClose}
        onLogout={handleLogoutConfirm}
        onRedirect={() => navigate('/')}
      />
    </Box>
  );
}
