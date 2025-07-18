import React, { useState, useEffect } from 'react';

import {
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Link as MuiLink,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import styles from './EditReport.module.css';
import api from '../../services/api';

export default function EditReport() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [reportStatus, setReportStatus] = useState('diproses');
  const [validationStatus, setValidationStatus] = useState('');
  const [adminExplanation, setAdminExplanation] = useState('');

  // Fetch report data
  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get(`/reports/${reportId}`);
        setReport(resp.data);
        setReportStatus(resp.data.reportStatus || 'diproses');
        setValidationStatus(resp.data.validationStatus || '');
        setAdminExplanation(resp.data.adminExplanation || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat laporan');
      } finally {
        setLoading(false);
      }
    })();
  }, [reportId]);

  const handleSave = async () => {
    setError('');
    setSaving(true);
    if (reportStatus === 'selesai' && !adminExplanation.trim()) {
      setError('Penjelasan admin wajib diisi jika status selesai');
      setSaving(false);
      return;
    }
    try {
      await api.put(`/reports/${reportId}/status`, {
        reportStatus,
        validationStatus,
        adminExplanation,
      });
      setNotification({
        open: true,
        message: 'Laporan berhasil diperbarui!',
        severity: 'success',
      });
      navigate(`/reports/${reportId}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNotif = (_, reason) => {
    if (reason === 'clickaway') return;
    setNotification((n) => ({ ...n, open: false }));
  };

  if (loading) {
    return (
      <Box
        className={styles.loadingWrapper}
        display="flex"
        justifyContent="center"
        mt={5}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.loadingWrapper} mx={2} my={4}>
        <Alert severity="error" className="mb-3">
          {error}
        </Alert>
        <Box mt={2}>
          <Button variant="contained" onClick={() => navigate('/reports')}>
            Kembali ke Daftar
          </Button>
        </Box>
      </Box>
    );
  }

  // parse explanation only
  let validationExplanation = '';
  try {
    const parsed = JSON.parse(report.validationDetails || '{}');
    validationExplanation = parsed.gemini?.explanation || '';
    // eslint-disable-next-line no-empty
  } catch {}

  const senderName = report.user.fullName?.trim() || report.user.username;

  return (
    <Box className={styles.pageWrapper}>
      <Paper elevation={3} className={styles.card}>
        <Typography variant="h5" className={styles.title}>
          Detail & Edit Laporan
        </Typography>

        {/* Detail */}
        <Box className={`${styles.detailField} mb-3`}>
          <Typography variant="subtitle2">Judul</Typography>
          <Typography>{report.title}</Typography>
        </Box>

        <Box className={`${styles.detailField} mb-3`}>
          <Typography variant="subtitle2">Pengirim</Typography>
          <Typography>
            {senderName} (RT {report.user.rt} / RW {report.user.rw})
          </Typography>
        </Box>

        <Box className={`${styles.detailField} mb-3`}>
          <Typography variant="subtitle2">Isi Laporan</Typography>
          <Typography className={styles.content}>{report.content}</Typography>
        </Box>

        {report.link && (
          <Box className={`${styles.detailField} mb-3`}>
            <Typography variant="subtitle2">Link</Typography>
            <MuiLink href={report.link} target="_blank" rel="noopener">
              {report.link}
            </MuiLink>
          </Box>
        )}

        {report.document && (
          <Box className={`${styles.detailField} mb-3`}>
            <Typography variant="subtitle2">Dokumen</Typography>
            <MuiLink href={report.document} target="_blank" rel="noopener">
              Unduh Dokumen
            </MuiLink>
          </Box>
        )}

        <Box className={`${styles.detailField} mb-3`}>
          <Typography variant="subtitle2">Validasi Otomatis</Typography>
          <Typography
            component="span"
            className={
              report.validationStatus === 'hoax'
                ? styles.hoaxStatus
                : report.validationStatus === 'valid'
                  ? styles.validStatus
                  : styles.durigStatus
            }
          >
            {report.validationStatus.charAt(0).toUpperCase() +
              report.validationStatus.slice(1)}
          </Typography>
          {validationExplanation && (
            <Typography
              variant="body2"
              className={`${styles.validationDetails} mt-1`}
            >
              {validationExplanation}
            </Typography>
          )}
        </Box>

        {/* Edit Status Form */}
        <Box className={`d-flex flex-column gap-3 ${styles.form}`}>
          <FormControl fullWidth className={`mb-3 ${styles.formField}`}>
            <InputLabel id="status-label">Status Laporan</InputLabel>
            <Select
              labelId="status-label"
              value={reportStatus}
              label="Status Laporan"
              onChange={(e) => setReportStatus(e.target.value)}
            >
              <MenuItem value="diproses">Diproses</MenuItem>
              <MenuItem value="selesai">Selesai</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth className={`mb-3 ${styles.formField}`}>
            <InputLabel id="validation-label">Validasi</InputLabel>
            <Select
              labelId="validation-label"
              value={validationStatus}
              label="Validasi"
              onChange={(e) => setValidationStatus(e.target.value)}
            >
              <MenuItem value="">-- Tidak diubah --</MenuItem>
              <MenuItem value="valid">Valid</MenuItem>
              <MenuItem value="hoax">Hoax</MenuItem>
            </Select>
          </FormControl>

          {reportStatus === 'selesai' && (
            <TextField
              label="Penjelasan Admin"
              value={adminExplanation}
              onChange={(e) => setAdminExplanation(e.target.value)}
              fullWidth
              multiline
              rows={4}
              className="mb-3"
            />
          )}

          <Box className={`d-flex justify-content-end ${styles.buttons}`}>
            <Button
              variant="outlined"
              className="me-2"
              onClick={() => navigate(`/reports/${reportId}`)}
              disabled={saving}
            >
              Batal
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
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
    </Box>
  );
}
