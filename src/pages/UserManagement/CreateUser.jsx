/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';

import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';

import styles from './CreateUser.module.css';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const CreateUser = ({ open, onClose }) => {
  // ambil auth dari context
  const { auth } = useContext(AuthContext);
  const currentRole = auth?.user?.role?.toString().toLowerCase();

  // tentukan role yang boleh dibuat
  const allowedRoles = currentRole === 'owner' ? ['admin'] : ['user'];

  // inisialisasi form
  const initialForm = {
    username: '',
    email: '',
    fullName: '',
    rt: '',
    rw: '',
    password: '',
    confirmPassword: '',
    role: allowedRoles[0],
  };
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  // setiap modal dibuka, reset form termasuk role default
  useEffect(() => {
    if (open) {
      setForm({
        ...initialForm,
        role: allowedRoles[0],
      });
      setError('');
      setErrorDialogOpen(false);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const toggle = (setter) => () => setter((v) => !v);

  const setErrorAndOpen = (msg) => {
    setError(msg);
    setErrorDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // validasi
    if (!form.username.trim()) return setErrorAndOpen('Username wajib diisi');
    if (!form.email.trim()) return setErrorAndOpen('Email wajib diisi');
    if (!form.fullName.trim())
      return setErrorAndOpen('Nama lengkap wajib diisi');
    if (!form.rt || isNaN(form.rt) || Number(form.rt) <= 0)
      return setErrorAndOpen('RT wajib angka > 0');
    if (!form.rw || isNaN(form.rw) || Number(form.rw) <= 0)
      return setErrorAndOpen('RW wajib angka > 0');
    if (!form.password || !form.confirmPassword)
      return setErrorAndOpen('Kedua kata sandi wajib diisi');
    if (form.password.length < 6)
      return setErrorAndOpen('Kata sandi minimal 6 karakter');
    if (form.password !== form.confirmPassword)
      return setErrorAndOpen('Kata sandi dan konfirmasi tidak sama');

    setSubmitting(true);
    try {
      await api.post('/auth/register', {
        username: form.username.trim(),
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        rt: Number(form.rt),
        rw: Number(form.rw),
        password: form.password,
        role: form.role,
      });
      onClose();
    } catch (err) {
      setErrorAndOpen(err.response?.data?.message || 'Gagal membuat akun');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseError = () => {
    setErrorDialogOpen(false);
    setError('');
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        classes={{ paper: styles.dialogPaper }}
      >
        <DialogTitle className={styles.dialogTitle}>
          Buat Pengguna Baru
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
              label="Nama Pengguna *"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email *"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nama Lengkap *"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <div className={styles.row}>
              <TextField
                label="RT *"
                name="rt"
                type="number"
                value={form.rt}
                onChange={handleChange}
                className={styles.halfField}
                margin="normal"
              />
              <TextField
                label="RW *"
                name="rw"
                type="number"
                value={form.rw}
                onChange={handleChange}
                className={styles.halfField}
                margin="normal"
              />
            </div>
            <TextField
              label="Kata Sandi *"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggle(setShowPassword)} edge="end">
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Konfirmasi Kata Sandi *"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggle(setShowConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Role *"
              name="role"
              value={form.role}
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              fullWidth
              margin="normal"
            >
              {allowedRoles.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            variant="text"
            className={styles.cancelButton}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            className={styles.submitButton}
          >
            {submitting ? 'Membuat...' : 'Buat'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={errorDialogOpen}
        onClose={handleCloseError}
        maxWidth="sm"
        fullWidth
        classes={{ paper: styles.errorDialogPaper }}
      >
        <DialogTitle className={styles.errorDialogTitle}>Kesalahan</DialogTitle>
        <DialogContent dividers>
          <Typography className={styles.errorDialogContent}>{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseError}
            variant="contained"
            className={styles.errorDialogButton}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateUser;
