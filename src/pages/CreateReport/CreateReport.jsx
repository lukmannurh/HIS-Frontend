import React, { useState } from 'react';

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  LinearProgress,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './CreateReport.module.css';
import api from '../../services/api';

const CreateReport = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setProgress(0);

    // Simulate progress from 0 to 99%
    let simulatedProgress = 0;
    const progressInterval = setInterval(() => {
      simulatedProgress += 10;
      if (simulatedProgress >= 99) {
        simulatedProgress = 99;
        clearInterval(progressInterval);
      }
      setProgress(simulatedProgress);
    }, 300); // 300ms interval, 2x faster than reference

    try {
      const response = await api.post('/reports', form);
      const newReport = response.data.data;
      clearInterval(progressInterval);
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
      clearInterval(progressInterval);
      setProgress(0);
      setLoading(false);
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Gagal membuat laporan',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="sm" className={`mt-5 ${styles.createReportContainer}`}>
      {/* Form visible only when not loading */}
      {!loading && (
        <div className={`card ${styles.card}`}>
          <div className="card-body">
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              className={styles.heading}
            >
              Create New Report
            </Typography>
            {error && (
              <Alert severity="error" className="mb-3">
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
              <TextField
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                inputProps={{ maxLength: 50 }}
                helperText={`${form.title.length}/50`}
                className={styles.inputField}
              />
              <TextField
                label="Content"
                name="content"
                value={form.content}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={6}
                required
                className={styles.inputField}
              />
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
                {loading && (
                  <Box className={styles.loadingOverlay}>
                    <CircularProgress color="inherit" size={24} />
                    <Typography className={styles.processingText}>
                      Please wait, your report is being processed...
                    </Typography>
                  </Box>
                )}
              </Box>
            </form>
          </div>
        </div>
      )}

      {/* Full-page overlay displayed during processing */}
      {loading && (
        <Box className={styles.overlay}>
          <Box className={styles.progressContainer}>
            {/* Envelope animation above the progress bar */}
            <div className={styles.letterImage}>
              <div className={styles.animatedMail}>
                <div className={styles.backFold}></div>
                <div className={styles.letter}>
                  <div className={styles.letterBorder}></div>
                  <div className={styles.letterTitle}></div>
                  <div className={styles.letterContext}></div>
                  <div className={styles.letterStamp}>
                    <div className={styles.letterStampInner}></div>
                  </div>
                </div>
                <div className={styles.topFold}></div>
                <div className={styles.body}></div>
                <div className={styles.leftFold}></div>
              </div>
              <div className={styles.shadow}></div>
            </div>
            {/* Progress Indicator */}
            <Typography variant="h6" className={styles.progressText}>
              Processing: {progress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              className={styles.progressBar}
            />
            <Typography variant="h6" className={styles.processingText}>
              Mohon tunggu, laporan Anda sedang diproses.
            </Typography>
          </Box>
        </Box>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateReport;
