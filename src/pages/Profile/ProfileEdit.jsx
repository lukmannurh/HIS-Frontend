import React, { useContext, useEffect, useState, useCallback } from 'react';

import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  MenuItem,
  Slider,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './Profile.module.css';
import NotificationDialog from '../../components/LogoutDialog/NotificationDialog';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const ProfileEdit = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [editForm, setEditForm] = useState({
    email: '',
    fullName: '',
    address: '',
    gender: 'Pria',
    age: 25,
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: '', // 'success' atau 'error'
  });
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/me');
      const { email, fullName, address, gender, age, photo } = response.data;
      setEditForm({
        email,
        fullName: fullName || '',
        address: address || '',
        gender: gender || 'Pria',
        age: age || 25,
      });
      setPhotoPreview(photo || '');
    } catch (err) {
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Gagal mengambil data profil',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleAgeChange = (e, newValue) => {
    setEditForm({ ...editForm, age: newValue });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ open: false, message: '', severity: '' });
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('email', editForm.email);
      formData.append('fullName', editForm.fullName);
      formData.append('address', editForm.address);
      formData.append('gender', editForm.gender);
      formData.append('age', editForm.age);
      if (photoFile) {
        formData.append('photo', photoFile);
      }
      const response = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedProfile = response.data.data;
      setAuth({ ...auth, user: updatedProfile });
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      setNotification({
        open: true,
        message: 'Profil berhasil diperbarui.',
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Gagal memperbarui profil',
        severity: 'error',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" className={styles.profileContainer}>
      <Card className={styles.profileCard}>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            className={styles.profileTitle}
          >
            Edit Profil Saya
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            className={styles.editForm}
          >
            <TextField
              label="Email"
              name="email"
              type="email"
              value={editForm.email}
              onChange={handleChange}
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Nama Lengkap"
              name="fullName"
              value={editForm.fullName}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={editForm.address}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              select
              label="Gender"
              name="gender"
              value={editForm.gender}
              onChange={handleChange}
              margin="normal"
              fullWidth
              required
            >
              <MenuItem value="Pria">Pria</MenuItem>
              <MenuItem value="Wanita">Wanita</MenuItem>
            </TextField>
            <Typography variant="subtitle1" className={styles.fieldLabel}>
              Age: {editForm.age}
            </Typography>
            <Slider
              value={editForm.age}
              onChange={handleAgeChange}
              valueLabelDisplay="auto"
              min={15}
              max={80}
              marks={[
                { value: 15, label: '15' },
                { value: 80, label: '80' },
              ]}
              sx={{ marginY: 2 }}
            />
            <Box mt={2}>
              <Typography variant="body1">Ganti Foto Profil:</Typography>
              <Box className={styles.photoPreviewBox}>
                <img
                  src={photoPreview || '/default-profile.png'}
                  alt="Preview"
                  className={styles.photoPreview}
                />
              </Box>
              <input
                type="file"
                name="photo"
                accept="image/jpeg,image/png,image/svg+xml"
                onChange={handlePhotoChange}
              />
            </Box>
            <Box className={styles.formButtonContainer}>
              <Button onClick={() => navigate('/profile')} color="secondary">
                Batal
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={updating}
              >
                {updating ? 'Memperbarui...' : 'Simpan'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      {/* Menampilkan notifikasi sebagai dialog di tengah layar */}
      <NotificationDialog
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Container>
  );
};

export default ProfileEdit;
