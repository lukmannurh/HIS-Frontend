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

const ProfileView = () => {
  const [profile, setProfile] = useState({
    username: '',
    role: '',
    fullName: '',
    email: '',
    address: '',
    gender: '',
    age: '',
    photo: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/me');
      const { username, role, fullName, email, address, gender, age, photo } =
        response.data;
      setProfile({
        username,
        role,
        fullName: fullName || '',
        email,
        address: address || '',
        gender: gender || '',
        age: age || '',
        photo: photo || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil data profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" className={styles.profileContainer}>
      <Card className={styles.profileCard}>
        <CardContent>
          {error && (
            <Alert severity="error" className={styles.alert} onClose={() => {}}>
              {error}
            </Alert>
          )}

          <Box className={styles.headerSection}>
            <Avatar
              src={profile.photo || '/default-profile.png'}
              className={styles.avatar}
            >
              {!profile.photo &&
                (profile.fullName?.[0]?.toUpperCase() ||
                  profile.username[0]?.toUpperCase())}
            </Avatar>
            <Box className={styles.titleBox}>
              <Typography variant="h5" className={styles.fullName}>
                {profile.fullName || profile.username}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {profile.role.toUpperCase()}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ marginY: 2 }} />

          <Grid container spacing={2} className={styles.infoGrid}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" className={styles.infoLabel}>
                Username
              </Typography>
              <Typography variant="subtitle1" className={styles.infoValue}>
                {profile.username}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" className={styles.infoLabel}>
                Role
              </Typography>
              <Typography variant="subtitle1" className={styles.infoValue}>
                {profile.role}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" className={styles.infoLabel}>
                Nama Lengkap
              </Typography>
              <Typography variant="subtitle1" className={styles.infoValue}>
                {profile.fullName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" className={styles.infoLabel}>
                Email
              </Typography>
              <Typography variant="subtitle1" className={styles.infoValue}>
                {profile.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" className={styles.infoLabel}>
                Address
              </Typography>
              <Typography variant="subtitle1" className={styles.infoValue}>
                {profile.address || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" className={styles.infoLabel}>
                Gender
              </Typography>
              <Typography variant="subtitle1" className={styles.infoValue}>
                {profile.gender || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" className={styles.infoLabel}>
                Age
              </Typography>
              <Typography variant="subtitle1" className={styles.infoValue}>
                {profile.age || '-'}
              </Typography>
            </Grid>
          </Grid>

          <Box className={styles.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/profile/edit')}
            >
              Perbarui Profil
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfileView;
