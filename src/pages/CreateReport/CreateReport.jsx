// File: src/pages/Reports/CreateReport.jsx

import React, { useState } from 'react';

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  LinearProgress,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './CreateReport.module.css';
import api from '../../services/api';

export default function CreateReport() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '' });
  const [documentFile, setDocumentFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title' && value.length > 50) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setProgress(0);

    // simulasi progress
    let simulated = 0;
    const iv = setInterval(() => {
      simulated = Math.min(simulated + 10, 99);
      setProgress(simulated);
      if (simulated >= 99) clearInterval(iv);
    }, 300);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      if (documentFile) {
        formData.append('document', documentFile);
      }

      const res = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newReport = res.data.data;
      clearInterval(iv);
      setProgress(100);
      setNotification({
        open: true,
        message: 'Laporan berhasil dibuat!',
        severity: 'success',
      });
      setTimeout(() => {
        setLoading(false);
        navigate(`/reports/${newReport.id}`);
      }, 1000);
    } catch (err) {
      clearInterval(iv);
      setProgress(0);
      setLoading(false);
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Gagal membuat laporan',
        severity: 'error',
      });
    }
  };

  const handleCloseNotif = (_, reason) => {
    if (reason === 'clickaway') return;
    setNotification((o) => ({ ...o, open: false }));
  };

  return (
    <Container maxWidth="sm" className={`mt-5 ${styles.createReportContainer}`}>
      {!loading ? (
        <Box className={`card ${styles.card}`}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            className={styles.heading}
          >
            Create New Report
          </Typography>
          {error && (
            <Alert severity="error" className="mb-3">
              {error}
            </Alert>
          )}
          <form
            onSubmit={handleSubmit}
            className={styles.form}
            encType="multipart/form-data"
          >
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ maxLength: 50 }}
              helperText={`${form.title.length}/50`}
              className={styles.inputField}
              margin="normal"
            />
            <TextField
              label="Content"
              name="content"
              value={form.content}
              onChange={handleChange}
              fullWidth
              multiline
              rows={6}
              required
              className={styles.inputField}
              margin="normal"
            />
            <Box mt={2} mb={3}>
              <Typography variant="body1" gutterBottom>
                Upload Media (opsional)
              </Typography>
              <input
                type="file"
                name="document"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </Box>
            <Box className={styles.buttonWrapper}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                className={styles.submitButton}
              >
                Create Report
              </Button>
            </Box>
          </form>
        </Box>
      ) : (
        <Box className={styles.overlay}>
          <Box className={styles.progressContainer}>
            <Typography className={styles.progressText}>
              Processing: {progress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              className={styles.progressBar}
            />
            <Typography className={styles.processingText}>
              Mohon tunggu, laporan Anda sedang diproses.
            </Typography>
          </Box>
        </Box>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotif}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotif}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
