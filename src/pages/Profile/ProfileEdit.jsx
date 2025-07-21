import React, { useEffect, useState, useCallback } from 'react';

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
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './Profile.module.css';
import api from '../../services/api';

export default function ProfileEdit() {
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    address: '',
    gender: 'Pria',
    age: 25,
    rt: '',
    rw: '',
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const navigate = useNavigate();

  const normalizePhotoPath = (raw) => {
    if (!raw) return '';
    try {
      const url = new URL(raw);
      return url.pathname;
    } catch {
      return raw.startsWith('/uploads') ? raw : `/uploads/${raw}`;
    }
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/me');
      setForm({
        email: data.email || '',
        fullName: data.fullName || '',
        address: data.address || '',
        gender: data.gender || 'Pria',
        age: data.age ?? 25,
        rt: data.rt ?? '',
        rw: data.rw ?? '',
      });
      setPhotoPreview(normalizePhotoPath(data.photo));
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Gagal mengambil profil',
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
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleAgeChange = (_, v) => {
    setForm((f) => ({ ...f, age: v }));
  };
  const handlePhotoChange = (e) => {
    if (e.target.files?.[0]) {
      setPhotoFile(e.target.files[0]);
      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photoFile) fd.append('photo', photoFile);

      await api.put('/users/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSnackbar({
        open: true,
        message: 'Profil berhasil diperbarui!',
        severity: 'success',
      });
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Gagal menyimpan',
        severity: 'error',
      });
    } finally {
      setSaving(false);
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
          {/* <Typography variant="h4" className={styles.profileTitle}>
            Edit Profil Saya
          </Typography> */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            className={styles.editForm}
          >
            {/* ROW 1: Email & Nama Lengkap */}
            <Box className={styles.row}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Nama Lengkap"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>

            {/* ROW 2: Alamat */}
            <TextField
              label="Alamat"
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />

            {/* ROW 3: Gender & Usia */}
            <Box className={styles.row}>
              <TextField
                select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={styles.halfField}
              >
                <MenuItem value="Pria">Pria</MenuItem>
                <MenuItem value="Wanita">Wanita</MenuItem>
              </TextField>
              <Box className={styles.halfField}>
                <Typography gutterBottom>Usia: {form.age} tahun</Typography>
                <Slider
                  value={form.age}
                  onChange={handleAgeChange}
                  min={10}
                  max={100}
                />
              </Box>
            </Box>

            {/* ROW 4: RT & RW */}
            <Box className={styles.row}>
              <TextField
                label="RT"
                name="rt"
                value={form.rt}
                onChange={handleChange}
                className={styles.halfField}
              />
              <TextField
                label="RW"
                name="rw"
                value={form.rw}
                onChange={handleChange}
                className={styles.halfField}
              />
            </Box>

            {/* ROW 5: Foto Profil */}
            <Box>
              <Typography>Ganti Foto Profil:</Typography>
              <Box className={styles.photoPreviewBox}>
                <img
                  src={photoPreview || '/default-profile.png'}
                  alt="Preview"
                  className={styles.photoPreview}
                />
              </Box>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Box>

            {/* TOMBOL */}
            <Box className={styles.formButtonContainer}>
              <Button onClick={() => navigate('/profile')} color="secondary">
                Batal
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
