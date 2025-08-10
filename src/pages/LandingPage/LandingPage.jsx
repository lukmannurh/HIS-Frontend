import React, { useState, useEffect } from 'react';

import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Snackbar,
  Alert,
  Link,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import styles from './LandingPage.module.css';

const LandingPage = () => {
  const location = useLocation();
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('logoutSuccess') === 'true') {
      setLogoutSuccess(true);
    }
  }, [location.search]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setLogoutSuccess(false);
  };

  return (
    <Box className={styles.landingContainer}>
      {/* HERO */}
      <Box className={styles.heroSection} role="banner">
        <Box className={styles.heroOverlay} />
        <Container maxWidth="lg" className={styles.heroContent}>
          <Typography variant="h2" className={styles.heroTitle}>
            Hamlet Information System
          </Typography>
          <Typography variant="h6" className={styles.heroSubtitle}>
            HIS memudahkan warga dan pengelola Desa Kalisuren untuk memeriksa
            kebenaran laporan secara cepat, otomatis, dan akurat, sehingga
            informasi yang beredar tetap tepercaya.
          </Typography>
          <Box className={styles.heroButtons}>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/login"
              className={styles.heroButtonPrimary}
            >
              Mulai Verifikasi
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="#features"
              className={styles.heroButtonSecondary}
            >
              Lihat Cara Kerja
            </Button>
          </Box>
        </Container>
      </Box>

      {/* FEATURES */}
      <Box
        id="features"
        className={styles.featuresSection}
        component="section"
        aria-labelledby="fitur-title"
      >
        <Container maxWidth="lg">
          <Typography
            id="fitur-title"
            variant="h3"
            className={styles.sectionTitle}
            align="center"
            gutterBottom
          >
            Fitur Unggulan
          </Typography>
          <Typography className={styles.sectionSubtitle} align="center">
            Dibangun dengan praktik keamanan dan skalabilitas yang baik agar
            nyaman dipakai oleh warga dan pengelola.
          </Typography>

          <Grid
            container
            spacing={4}
            justifyContent="center"
            className={styles.featuresGrid}
          >
            <Grid item xs={12} sm={6} md={4}>
              <Box className={styles.featureCard}>
                <Box className={styles.iconWrap} aria-hidden>
                  <SecurityIcon className={styles.featureIcon} />
                </Box>
                <Typography variant="h6" className={styles.featureTitle}>
                  Hoaks Checker
                </Typography>
                <Typography variant="body2" className={styles.featureDesc}>
                  Verifikasi cepat untuk memfilter kabar bohong sebelum menyebar
                  di warga.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box className={styles.featureCard}>
                <Box className={styles.iconWrap} aria-hidden>
                  <VerifiedUserIcon className={styles.featureIcon} />
                </Box>
                <Typography variant="h6" className={styles.featureTitle}>
                  Verifikasi Data
                </Typography>
                <Typography variant="body2" className={styles.featureDesc}>
                  Alur verifikasi transparan—data lebih tepercaya untuk
                  keputusan sehari-hari.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box className={styles.featureCard}>
                <Box className={styles.iconWrap} aria-hidden>
                  <GroupIcon className={styles.featureIcon} />
                </Box>
                <Typography variant="h6" className={styles.featureTitle}>
                  Kolaborasi Multi-Peran
                </Typography>
                <Typography variant="body2" className={styles.featureDesc}>
                  Akses terarah (Owner, Admin, User) untuk proses yang rapi dan
                  terintegrasi.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box
        className={styles.ctaSection}
        component="section"
        aria-labelledby="cta-title"
      >
        <Container maxWidth="md" className={styles.ctaContainer}>
          <Typography
            id="cta-title"
            variant="h4"
            className={styles.ctaTitle}
            gutterBottom
          >
            Bangun Desa Cerdas, Mulai Hari Ini
          </Typography>
          <Typography
            variant="body1"
            className={styles.ctaSubtitle}
            gutterBottom
          >
            Wujudkan komunikasi yang tertata dan data yang tepercaya. Coba HIS
            sekarang juga.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/login"
            className={styles.ctaButton}
          >
            Masuk & Mulai Kelola
          </Button>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box component="footer" className={styles.footer} id="contact">
        <Container maxWidth="lg" className={styles.footerContent}>
          <Box className={styles.footerCols}>
            <Box className={styles.footerBrand}>
              <Box className={styles.brandDot} aria-hidden />
              <Typography className={styles.footerBrandText}>
                Hamlet Information System
              </Typography>
            </Box>
            <Box className={styles.footerLinks}>
              <Link
                href="#features"
                underline="none"
                className={styles.footerLink}
              >
                Fitur
              </Link>
              <Link
                component={RouterLink}
                to="/login"
                underline="none"
                className={styles.footerLink}
              >
                Masuk
              </Link>
            </Box>
          </Box>
          <Typography
            variant="body2"
            align="center"
            className={styles.footerCopy}
          >
            © {new Date().getFullYear()} Hamlet Information System. All rights
            reserved.
          </Typography>
        </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={logoutSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Berhasil logout!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LandingPage;
