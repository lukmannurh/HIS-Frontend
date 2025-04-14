import React, { useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';

import styles from './EditUserRole.module.css';
import api from '../../services/api';

const EditUserRole = ({ open, user, onClose }) => {
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      // Pastikan endpoint sesuai dengan API backend Anda, misalnya: /users/:userId/role
      await api.put(`/users/${user.id}/role`, { role });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      classes={{ paper: styles.dialogPaper }}
    >
      <DialogTitle className={styles.dialogTitle}>
        Edit Role for {user.username}
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" className={styles.error}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            label="Role"
            name="role"
            value={role}
            onChange={handleRoleChange}
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
          {submitting ? 'Updating...' : 'Update Role'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserRole;
