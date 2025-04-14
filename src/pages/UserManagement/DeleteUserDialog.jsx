import React, { useState, useEffect } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';

import styles from './DeleteUserDialog.module.css';

const DeleteUserDialog = ({ open, user, onClose, onConfirm }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const expectedText = `Hapus "${user.username}"`;

  // Reset input tiap kali dialog terbuka
  useEffect(() => {
    if (open) {
      setConfirmationText('');
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        Konfirmasi Hapus Akun
      </DialogTitle>
      <DialogContent>
        <Typography className={styles.instruction}>
          Untuk menghapus akun <strong>{user.username}</strong> dengan role{' '}
          <strong>{user.role}</strong>, ketikkan persis:
        </Typography>
        <Typography variant="body2" className={styles.expectedText}>
          {expectedText}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
        />
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button
          onClick={onClose}
          variant="text"
          color="secondary"
          className={styles.cancelButton}
        >
          Batal
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={confirmationText !== expectedText}
          className={styles.deleteButton}
        >
          Hapus Akun
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;
