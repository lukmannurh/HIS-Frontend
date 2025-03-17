import React, { useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

import styles from './LogoutDialog.module.css';
import logoutImg from '../../assets/images/logout-illustration.png';

export default function LogoutDialog({ open, onClose, onLogout, onRedirect }) {
  // stage: 'confirm' atau 'success'
  const [stage, setStage] = useState('confirm');

  const handleConfirm = () => {
    onLogout(); // Panggil fungsi logout dari AuthContext
    setStage('success');
  };

  const handleClose = () => {
    setStage('confirm'); // Reset stage ke "confirm"
    onClose();
    // Jika sudah sukses, panggil onRedirect untuk mengarahkan ke landing page
    if (stage === 'success') {
      onRedirect();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={styles.dialogContainer}
      maxWidth="xs"
      fullWidth
    >
      {stage === 'confirm' ? (
        <>
          <DialogTitle className={styles.dialogTitle}>
            Konfirmasi Keluar
          </DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <Box className={styles.illustrationBox}>
              <img
                src={logoutImg}
                alt="Logout"
                className={styles.illustration}
              />
            </Box>
            <Typography className={styles.dialogText}>
              Apakah Anda yakin ingin keluar?
            </Typography>
          </DialogContent>
          <DialogActions className={styles.dialogActions}>
            <Button onClick={handleClose} className={styles.cancelButton}>
              Batal
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirm}
              className={styles.logoutButton}
            >
              Keluar
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle className={styles.dialogTitle}>
            Anda telah berhasil keluar
          </DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <Box className={styles.illustrationBox}>
              <img
                src={logoutImg}
                alt="Logged Out"
                className={styles.illustration}
              />
            </Box>
            <Typography className={styles.dialogText}>
              Anda dapat masuk kembali kapan saja.
            </Typography>
          </DialogContent>
          <DialogActions className={styles.dialogActions}>
            <Button onClick={handleClose} className={styles.homeButton}>
              OK
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
