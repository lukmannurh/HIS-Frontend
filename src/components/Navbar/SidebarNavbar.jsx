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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './SidebarNavbar.module.css';
import { AuthContext } from '../../context/AuthContext';

export default function SidebarNavbar({
  collapsed,
  setCollapsed,
  sidebarWidth,
}) {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const adminMenu = {
    text: 'User Management',
    icon: <GroupIcon />,
    path: '/user-management',
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(true);
  };
  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };
  const handleLogout = () => {
    setLogoutDialogOpen(false);
    logout();
    navigate('/login');
  };

  const handleNav = (path) => {
    navigate(path);
  };

  // Ambil role user
  const userRole = auth?.user?.role || 'User';

  return (
    <Box
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: sidebarWidth,
        bottom: 0,
        zIndex: 1300,
      }}
    >
      {/* Brand + Collapse Button */}
      <Box className={styles.brandSection}>
        {!collapsed && (
          <Box>
            <div className={styles.brandName}>Hamlet Information System</div>
            <div className={styles.roleLabel}>Role: {userRole}</div>
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

      <List className={styles.menuList}>
        {menuItems.map((item, idx) => {
          if (item.children) {
            return (
              <Box key={idx}>
                <Tooltip title={!collapsed ? '' : item.text} placement="right">
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
          // Menu biasa
          return (
            <Tooltip
              title={!collapsed ? '' : item.text}
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

        {/* Menu admin jika role owner/admin */}
        {(userRole === 'owner' || userRole === 'admin') && (
          <Tooltip title={!collapsed ? '' : adminMenu.text} placement="right">
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

      <Box className={styles.footer}>
        <Tooltip title={!collapsed ? '' : 'Logout'} placement="right">
          <ListItem
            button
            onClick={handleLogoutConfirm}
            className={styles.listItem}
          >
            <span className={styles.icon}>
              <LogoutIcon />
            </span>
            {!collapsed && <span className={styles.text}>Logout</span>}
          </ListItem>
        </Tooltip>
      </Box>

      {/* Dialog Konfirmasi Logout */}
      <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
        <DialogTitle>Konfirmasi Logout</DialogTitle>
        <DialogContent>Anda yakin ingin logout?</DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>Batal</Button>
          <Button onClick={handleLogout} variant="contained" color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
