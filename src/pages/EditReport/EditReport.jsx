// File: ./src/pages/EditReport/EditReport.jsx
import React, { useState, useEffect } from 'react';

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import styles from './EditReport.module.css';
import api from '../../services/api';

const EditReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', content: '', link: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [editedBy, setEditedBy] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/reports/${reportId}`);
        const data = response.data;
        setForm({
          title: data.title,
          content: data.content,
          link: data.link || '',
        });
        setEditedBy(data.user.username);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.put(`/reports/${reportId}`, form);
      setNotification({
        open: true,
        message: 'Report updated successfully!',
        severity: 'success',
      });
      // Redirect ke detail report setelah update
      setTimeout(() => {
        navigate(`/reports/${reportId}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Box
        className={styles.loadingContainer}
        display="flex"
        justifyContent="center"
        mt={5}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" className={styles.editReportContainer}>
      <Typography variant="h4" gutterBottom align="center">
        Edit Report
      </Typography>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError('')}
          className={styles.alert}
        >
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
        <TextField
          label="Link (Optional)"
          name="link"
          value={form.link}
          onChange={handleChange}
          fullWidth
          margin="normal"
          className={styles.inputField}
        />
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Report'}
          </Button>
        </Box>
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Laporan ini akan ditandai sebagai diedit oleh {editedBy}.
          </Typography>
        </Box>
      </form>
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

export default EditReport;
