/* eslint-disable no-empty */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState, useRef } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import UpdateIcon from '@mui/icons-material/Update';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Snackbar,
} from '@mui/material';
import html2pdf from 'html2pdf.js';
import { useParams, useNavigate } from 'react-router-dom';

import styles from './ReportDetail.module.css';
import api from '../../services/api';

export default function ReportDetail() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/reports/${reportId}`);
        setReport(data);
        if (data.updatedAt && data.updatedAt !== data.createdAt) {
          setIsEdited(true);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Gagal mengambil detail laporan'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [reportId]);

  const handleBack = () => navigate('/reports');

  const formatDateWIB = (dateStr) =>
    new Date(dateStr).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + ' WIB';

  let validationExplanation = '';
  if (report?.validationDetails) {
    try {
      const parsed = JSON.parse(report.validationDetails);
      validationExplanation = parsed.gemini?.explanation || '';
    } catch {}
  }

  const senderName = report
    ? report.user.fullName?.trim() || report.user.username
    : '';

  const handleDownloadPDF = () => {
    if (!contentRef.current) return;
    setSnackbar({
      open: true,
      message: 'Downloading PDF...',
      severity: 'info',
    });
    html2pdf()
      .set({
        margin: 0.5,
        filename: `${report.title}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .from(contentRef.current)
      .save()
      .then(() =>
        setSnackbar({
          open: true,
          message: 'Download successful!',
          severity: 'success',
        })
      )
      .catch(() =>
        setSnackbar({
          open: true,
          message: 'Download failed!',
          severity: 'error',
        })
      );
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

  if (loading) {
    return (
      <Box
        mt={5}
        className={styles.container}
        display="flex"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Container className={styles.container}>
        <Box mt={5}>
          <Alert severity="error">{error}</Alert>
          <Box mt={2}>
            <Button
              variant="contained"
              onClick={handleBack}
              className={styles.backButton}
            >
              Back to Reports
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  const renderValidationBadge = (status) => {
    if (status === 'hoax') {
      return (
        <Box className={`${styles.statusBadge} ${styles.hoax}`}>
          <CancelIcon className={styles.iconStatus} fontSize="large" />
          Hoax
        </Box>
      );
    }
    if (status === 'valid') {
      return (
        <Box className={`${styles.statusBadge} ${styles.valid}`}>
          <VerifiedUserIcon className={styles.iconStatus} fontSize="large" />
          Valid
        </Box>
      );
    }
    return (
      <Box className={`${styles.statusBadge} ${styles.doubtful}`}>
        <HelpOutlineIcon className={styles.iconStatus} fontSize="large" />
        Diragukan
      </Box>
    );
  };

  const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <Container className={styles.container}>
      <Box className={styles.card}>
        <Box className={styles.downloadContainer}>
          <Button
            variant="outlined"
            onClick={handleDownloadPDF}
            className={styles.downloadButton}
          >
            <PictureAsPdfIcon className={styles.pdfIcon} fontSize="small" />
            Download PDF
          </Button>
        </Box>

        {renderValidationBadge(report.validationStatus)}

        <Box mt={2} className={styles.statusSection}>
          <Typography variant="subtitle2">Status Laporan</Typography>
          <Typography
            className={
              report.reportStatus === 'selesai'
                ? styles.statusDone
                : styles.statusInProgress
            }
          >
            {report.reportStatus === 'selesai' ? 'Selesai' : 'Diproses'}
          </Typography>
        </Box>

        <Box ref={contentRef} className={styles.pdfContent}>
          <Box className={styles.timestampBox}>
            <AccessTimeIcon className={styles.icon} fontSize="small" />
            <Typography variant="body2" className={styles.timestamp}>
              Dibuat pada: {formatDateWIB(report.createdAt)}
            </Typography>
            {isEdited && (
              <Box className={styles.updatedBox}>
                <UpdateIcon className={styles.icon} fontSize="small" />
                <Typography variant="body2" className={styles.timestamp}>
                  Diubah pada: {formatDateWIB(report.updatedAt)}
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="h3" className={styles.title} mt={2}>
            {report.title}
          </Typography>

          {report.document && (
            <Box mt={3} className={styles.section}>
              <Typography variant="h6" className={styles.sectionHeader}>
                Media
              </Typography>
              <Box className={styles.mediaContainer}>
                {isVideo(report.document) ? (
                  <video controls className={styles.video}>
                    <source src={report.document} />
                    Your browser does not support video.
                  </video>
                ) : (
                  <img
                    src={report.document}
                    alt="Uploaded media"
                    className={styles.image}
                  />
                )}
              </Box>
            </Box>
          )}

          <Box mt={3} className={styles.section}>
            <Typography variant="h6" className={styles.sectionHeader}>
              Pengirim
            </Typography>
            <Typography variant="body1" className={styles.detailText}>
              {senderName} (RT {report.user.rt} / RW {report.user.rw})
            </Typography>
          </Box>

          <Box mt={3} className={styles.section}>
            <Typography variant="h6" className={styles.sectionHeader}>
              Isi Laporan
            </Typography>
            <Paper className={styles.paperContent}>
              <Typography variant="body1" className={styles.contentText}>
                {report.content}
              </Typography>
            </Paper>
          </Box>

          <Box mt={3} className={styles.section}>
            <Typography variant="h6" className={styles.sectionHeader}>
              Penjelasan Validasi
            </Typography>
            <Paper className={styles.paperContent}>
              <Box display="flex" alignItems="flex-start">
                <InfoIcon className={styles.iconInfo} fontSize="small" />
                <Typography variant="body1" className={styles.contentText}>
                  {validationExplanation || 'N/A'}
                </Typography>
              </Box>
            </Paper>
          </Box>

          {report.adminExplanation && (
            <Box mt={3} className={styles.section}>
              <Typography variant="h6" className={styles.sectionHeader}>
                Penjelasan Admin
              </Typography>
              <Paper className={styles.paperContent}>
                <Typography variant="body1" className={styles.contentText}>
                  {report.adminExplanation}
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>

      <Box className={styles.buttonContainer}>
        <Button
          variant="contained"
          onClick={handleBack}
          className={styles.backButton}
        >
          Back to Reports
        </Button>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
