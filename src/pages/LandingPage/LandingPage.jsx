import React from 'react';

import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import styles from './LandingPage.module.css';

const LandingPage = () => {
  return (
    <Box className={styles.landingContainer}>
      {/* HERO SECTION */}
      <Box className={styles.heroSection}>
        <Box className={styles.heroOverlay}>
          <Container maxWidth="md" className={styles.heroContent}>
            <Typography variant="h3" className={styles.heroTitle} gutterBottom>
              Hamlet Information System
            </Typography>
            <Typography
              variant="h6"
              className={styles.heroSubtitle}
              gutterBottom
            >
              Aplikasi web untuk memfasilitasi komunikasi dan manajemen
              informasi di tingkat desa,
              <br />
              dengan fitur hoaks checker.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/login"
              className={styles.heroButton}
            >
              Mulai Sekarang
            </Button>
          </Container>
        </Box>
      </Box>

      {/* FEATURES SECTION */}
      <Box className={styles.featuresSection}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            className={styles.sectionTitle}
            align="center"
            gutterBottom
          >
            Fitur Unggulan
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Box className={styles.featureCard}>
                <SecurityIcon className={styles.featureIcon} />
                <Typography variant="h6" className={styles.featureTitle}>
                  Hoaks Checker
                </Typography>
                <Typography variant="body2" className={styles.featureDesc}>
                  Periksa validitas informasi dengan cepat dan akurat.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box className={styles.featureCard}>
                <VerifiedUserIcon className={styles.featureIcon} />
                <Typography variant="h6" className={styles.featureTitle}>
                  Verifikasi Data
                </Typography>
                <Typography variant="body2" className={styles.featureDesc}>
                  Proses verifikasi yang transparan dan terpercaya.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box className={styles.featureCard}>
                <GroupIcon className={styles.featureIcon} />
                <Typography variant="h6" className={styles.featureTitle}>
                  Kolaborasi Multi-Peran
                </Typography>
                <Typography variant="body2" className={styles.featureDesc}>
                  Dukungan peran Owner, Admin, dan User untuk pengelolaan yang
                  terintegrasi.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA SECTION */}
      <Box className={styles.ctaSection}>
        <Container maxWidth="sm" className={styles.ctaContainer}>
          <Typography variant="h5" className={styles.ctaTitle} gutterBottom>
            Bangun Desa Cerdas Anda
          </Typography>
          <Typography
            variant="body1"
            className={styles.ctaSubtitle}
            gutterBottom
          >
            Bergabunglah sekarang untuk mewujudkan sistem informasi desa yang
            efektif dan bebas hoaks.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/login"
            className={styles.ctaButton}
          >
            Masuk
          </Button>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box component="footer" className={styles.footer}>
        <Container maxWidth="lg" className={styles.footerContent}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Hamlet Information System. All rights
            reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
