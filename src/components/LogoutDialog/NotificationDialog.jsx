import React, { useEffect } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';

const NotificationDialog = ({ open, message, onClose, severity }) => {
  // Timer untuk otomatis menutup notifikasi setelah 4 detik
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  // Fungsi untuk mengembalikan background color berdasarkan severity
  const getBackgroundColor = () => {
    if (severity === 'success') return '#C8E6C9'; // hijau muda
    if (severity === 'error') return '#FFCDD2'; // merah muda
    return '#e0e0e0'; // default / netral
  };

  // Fungsi untuk mengembalikan border color berdasarkan severity
  const getBorderColor = () => {
    if (severity === 'success') return '#388E3C'; // hijau tua
    if (severity === 'error') return '#D32F2F'; // merah tua
    return '#757575'; // default / netral
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          margin: 0,
          padding: '16px 24px',
          minWidth: 300,
          backgroundColor: getBackgroundColor(),
          border: `2px solid ${getBorderColor()}`,
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 1 }}>
        Notifikasi
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: getBorderColor(),
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
