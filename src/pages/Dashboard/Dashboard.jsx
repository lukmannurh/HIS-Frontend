import React from 'react';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const Dashboard = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm')); // sm = 600px

  return (
    <Box
      sx={{
        padding: 3,
        mt: '64px', // Menyesuaikan dengan tinggi AppBar
        ml: isDesktop ? '250px' : 0, // Menyesuaikan dengan lebar sidebar
        backgroundColor: '#ffffff', // Atur latar belakang putih
        overflowY: 'auto', // Menambahkan scroll vertikal jika diperlukan
      }}
    >
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {/* Tambahkan lebih banyak konten untuk menguji scroll */}
      <Typography variant="body1">
        {/* Contoh konten */}
        {Array.from({ length: 100 }, (_, i) => (
          <p key={i}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </Typography>
    </Box>
  );
};

export default Dashboard;
