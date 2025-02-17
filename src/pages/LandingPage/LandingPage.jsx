import React from 'react';

import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import styles from './LandingPage.module.css'; // Import CSS Module

const LandingPage = () => {
  return (
    <Box className={styles.landingContainer}>
      <Box className={styles.parallax}>
        <Container maxWidth="md" className={styles.landingContent}>
          <Typography variant="h2" gutterBottom align="center" color="white">
            Hamlet Information System
          </Typography>
          <Typography variant="h5" gutterBottom align="center" color="white">
            Hamlet Information System (HIS) adalah aplikasi web yang dirancang
            untuk memfasilitasi komunikasi dan manajemen informasi di tingkat
            desa dengan fitur utama yaitu hoaks checker.
          </Typography>
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/login"
            >
              Mulai Sekarang
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
