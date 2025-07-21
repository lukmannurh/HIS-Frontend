import React, { useEffect, useState } from 'react';

import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Grid,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './Profile.module.css';
import api from '../../services/api';

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const normalizePhotoPath = (raw) => {
    if (!raw) return '/default-profile.png';
    try {
      const url = new URL(raw);
      return url.pathname;
    } catch {
      return raw.startsWith('/uploads') ? raw : `/uploads/${raw}`;
    }
  };

  useEffect(() => {
    api
      .get('/users/me')
      .then(({ data }) => setProfile(data))
      .catch((err) =>
        setError(err.response?.data?.message || 'Gagal memuat profil')
      );
  }, []);

  if (!profile && !error) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Container maxWidth="sm" className={styles.profileContainer}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const {
    username,
    role,
    fullName,
    email,
    address,
    gender,
    age,
    rt,
    rw,
    photo,
  } = profile;

  const avatarSrc = normalizePhotoPath(photo);

  return (
    <Container maxWidth="sm" className={styles.profileContainer}>
      <Card className={styles.profileCard}>
        <CardContent>
          <Box className={styles.headerSection}>
            <Avatar src={avatarSrc} className={styles.avatar}>
              {!photo &&
                (fullName?.[0]?.toUpperCase() || username[0]?.toUpperCase())}
            </Avatar>
            <Box className={styles.titleBox}>
              <Typography variant="h5" className={styles.fullName}>
                {fullName || username}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {role.toUpperCase()}
              </Typography>
            </Box>
          </Box>

          <Divider className={styles.divider} />

          <Grid container spacing={3} className={styles.infoGrid}>
            {[
              ['Username', username],
              ['Email', email],
              ['Nama Lengkap', fullName],
              ['Alamat', address],
              ['Gender', gender],
              ['Usia', age],
              ['RT', rt],
              ['RW', rw],
            ].map(([label, value]) => (
              <Grid item xs={12} sm={6} key={label}>
                <Typography variant="caption" className={styles.infoLabel}>
                  {label}
                </Typography>
                <Typography variant="body1" className={styles.infoValue}>
                  {value || '-'}
                </Typography>
              </Grid>
            ))}
          </Grid>

          <Box className={styles.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/profile/edit')}
            >
              Edit Profil
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
