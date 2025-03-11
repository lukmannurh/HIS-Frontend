import React from 'react';

import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Navbar from '../components/Navbar/Navbar';

const DefaultLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar selalu ditampilkan */}
      <Navbar />

      {/* Konten halaman ditampilkan di sini */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DefaultLayout;
