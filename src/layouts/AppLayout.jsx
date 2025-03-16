import React, { useState, useContext } from 'react';

import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import SidebarNavbar from '../components/Navbar/SidebarNavbar';
import TopBar from '../components/Navbar/TopBar';
import { AuthContext } from '../context/AuthContext';

export default function AppLayout() {
  const { auth } = useContext(AuthContext);

  // State collapse/expand sidebar
  const [collapsed, setCollapsed] = useState(false);

  // Ukuran layout
  const SIDEBAR_WIDTH = 240;
  const SIDEBAR_COLLAPSED_WIDTH = 80;
  const TOPBAR_HEIGHT = 64;

  // Lebar sidebar aktif
  const currentSidebarWidth = collapsed
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_WIDTH;

  return (
    <>
      {/* Sidebar (hanya muncul jika user sudah login) */}
      {auth.user && (
        <SidebarNavbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarWidth={currentSidebarWidth}
        />
      )}

      {/* Topbar di sisi kanan (mulai dari sisi kanan sidebar jika login) */}
      <TopBar
        topBarHeight={TOPBAR_HEIGHT}
        leftOffset={auth.user ? currentSidebarWidth : 0}
      />

      {/* Konten utama: scroll vertical, tidak ada scroll horizontal */}
      <Box
        sx={{
          position: 'absolute',
          top: TOPBAR_HEIGHT,
          left: auth.user ? currentSidebarWidth : 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
