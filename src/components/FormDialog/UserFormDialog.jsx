import React, { useState, useContext } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
} from '@mui/material';

import styles from './UserFormDialog.module.css';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const UserFormDialog = ({ open, onClose, onUserCreated }) => {
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    fullName: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Tentukan role yang diizinkan berdasarkan peran user yang sedang login
  const allowedRoles =
    auth.user.role === 'owner' ? ['user', 'admin'] : ['user'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      // Panggil endpoint register
      await api.post('/auth/register', form);
      onUserCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat user baru');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    onClose();
    setError('');
    setForm({
      username: '',
      email: '',
      password: '',
      role: 'user',
      fullName: '',
    });
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        Tambah User Baru
        <IconButton className={styles.closeButton} onClick={handleDialogClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && <p className={styles.errorText}>{error}</p>}
        <form onSubmit={handleSubmit} id="userForm" className={styles.form}>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            {allowedRoles.map((option) => (
              <MenuItem key={option} value={option}>
                {option.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="secondary">
          Batal
        </Button>
        <Button
          form="userForm"
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting}
        >
          {submitting ? 'Memproses...' : 'Simpan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;
