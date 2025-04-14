import React, { useState } from 'react';

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
import api from '../../services/api';

const CreateUser = ({ open, onClose }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  // Handle input value changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Toggle visibility for password field
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Toggle visibility for confirm password field
  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Submit form to create new user with validasi input
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi required fields
    if (!form.username.trim()) {
      setError('Username is required');
      setErrorDialogOpen(true);
      return;
    }
    if (!form.email.trim()) {
      setError('Email is required');
      setErrorDialogOpen(true);
      return;
    }
    if (!form.fullName.trim()) {
      setError('Full Name is required');
      setErrorDialogOpen(true);
      return;
    }
    if (!form.password || !form.confirmPassword) {
      setError('Password fields are required');
      setErrorDialogOpen(true);
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setErrorDialogOpen(true);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setErrorDialogOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/register', {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        fullName: form.fullName.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
      setErrorDialogOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Close error dialog
  const handleCloseErrorDialog = () => {
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
          Create New User
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
              label="Username *"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email *"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            {/* Password Field */}
            <TextField
              label="Password *"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
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
            {/* Confirm Password Field */}
            <TextField
              label="Confirm Password *"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                      aria-label="toggle confirm password visibility"
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
              label="Full Name *"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              select
              SelectProps={{ native: true }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            variant="text"
            color="secondary"
            className={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={submitting}
            className={styles.submitButton}
          >
            {submitting ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {errorDialogOpen && (
        <Dialog
          open={errorDialogOpen}
          onClose={handleCloseErrorDialog}
          maxWidth="sm"
          fullWidth
          classes={{ paper: styles.errorDialogPaper }}
        >
          <DialogTitle className={styles.errorDialogTitle}>Error</DialogTitle>
          <DialogContent dividers>
            <Typography className={styles.errorDialogContent}>
              {error}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseErrorDialog}
              color="primary"
              variant="contained"
              className={styles.errorDialogButton}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default CreateUser;
