import React from 'react';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const Dashboard = () => {
  const theme = useTheme(); // Menggunakan tema dari context
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm')); // sm = 600px

  return (
    <Box
      sx={{
        padding: 3,
        mt: '64px', // Menyesuaikan dengan tinggi AppBar
        ml: isDesktop ? '250px' : 0, // Menyesuaikan dengan lebar sidebar
        backgroundColor: theme.palette.background.default, // Sesuaikan background dengan tema
        color: theme.palette.text.primary, // Sesuaikan warna teks dengan tema
        overflowY: 'auto', // Menambahkan scroll vertikal jika diperlukan
      }}
    >
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {/* Contoh konten */}
      <Typography variant="body1">
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
