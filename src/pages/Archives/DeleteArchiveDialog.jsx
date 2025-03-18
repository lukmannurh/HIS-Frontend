import React, { useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material';

import styles from './DeleteArchiveDialog.module.css';

const DeleteArchiveDialog = ({ open, onClose, onConfirm, archive }) => {
  const [confirmationText, setConfirmationText] = useState('');

  const handleChange = (e) => {
    setConfirmationText(e.target.value);
  };

  const handleConfirm = () => {
    if (confirmationText === 'Hapus') {
      onConfirm();
      setConfirmationText('');
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    onClose();
  };

  if (!archive) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        Konfirmasi Hapus Archive
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <Typography>
          Apakah Anda yakin ingin menghapus archive &apos;{archive.title}&apos;?
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className={styles.confirmPrompt}
        >
          Ketik <strong>Hapus</strong> untuk mengonfirmasi.
        </Typography>
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          placeholder="Ketik 'Hapus' di sini"
          value={confirmationText}
          onChange={handleChange}
          className={styles.confirmInput}
        />
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button onClick={handleClose}>Batal</Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={confirmationText !== 'Hapus'}
        >
          Hapus
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteArchiveDialog;
