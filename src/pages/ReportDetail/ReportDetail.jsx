import React, { useEffect, useState, useRef } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
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

const ReportDetail = () => {
  const { reportId } = useParams(); // Ambil reportId dari URL
  const navigate = useNavigate();
  const contentRef = useRef(null); // Ref untuk konten PDF

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
    if (!reportId) {
      setError('ID laporan tidak ditemukan.');
      setLoading(false);
      return;
    }
    const fetchReport = async () => {
      try {
        const response = await api.get(`/reports/${reportId}`);
        setReport(response.data);
        if (
          response.data.updatedAt &&
          response.data.updatedAt !== response.data.createdAt
        ) {
          setIsEdited(true);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch report details'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  const handleBack = () => {
    navigate('/reports');
  };

  const formatDateWIB = (dateStr) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return new Date(dateStr).toLocaleString('id-ID', options) + ' WIB';
  };

  // Parsing validationDetails dan menghilangkan kata pertama saja
  let fullValidationText = '';
  try {
    if (report.validationDetails) {
      const parsed = JSON.parse(report.validationDetails);
      fullValidationText = parsed.gemini?.output || '';
    }
  } catch (err) {
    fullValidationText = '';
  }
  const validationText =
    fullValidationText.trim().split(/\s+/).length > 1
      ? fullValidationText.trim().split(/\s+/).slice(1).join(' ')
      : fullValidationText || 'N/A';

  const handleDownloadPDF = () => {
    if (contentRef.current) {
      setSnackbar({
        open: true,
        message: 'Downloading PDF...',
        severity: 'info',
      });
      const opt = {
        margin: 0.5,
        filename: `${report.title}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
      html2pdf()
        .set(opt)
        .from(contentRef.current)
        .save()
        .then(() => {
          setSnackbar({
            open: true,
            message: 'Download successful!',
            severity: 'success',
          });
        })
        .catch((err) => {
          console.error(err);
          setSnackbar({
            open: true,
            message: 'Download failed!',
            severity: 'error',
          });
        });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
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
  return (
    <Container className={styles.container}>
      <Box className={styles.card}>
        {/* Tombol Download PDF di pojok kanan atas */}
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

        {/* Status Badge di pojok kiri atas */}
        <Box
          className={`${styles.statusBadge} ${report.validationStatus === 'hoax' ? styles.hoax : styles.valid}`}
        >
          {report.validationStatus === 'hoax' ? (
            <>
              <CancelIcon className={styles.iconStatus} fontSize="large" />
              Hoax
            </>
          ) : (
            <>
              <VerifiedUserIcon
                className={styles.iconStatus}
                fontSize="large"
              />
              Valid
            </>
          )}
        </Box>

        {/* Konten PDF (tidak termasuk tombol download dan back) */}
        <Box className={styles.pdfContent} ref={contentRef}>
          {/* Timestamps */}
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

          {/* Title */}
          <Typography variant="h3" className={styles.title} mt={2}>
            {report.title}
          </Typography>

          {/* Content */}
          <Box mt={3}>
            <Typography variant="h6" className={styles.sectionHeader}>
              Isi Laporan:
            </Typography>
            <Paper className={styles.paperContent}>
              <Typography variant="body1" className={styles.contentText}>
                Detail Laporan dari {report.user.username}: {report.content}
              </Typography>
            </Paper>
          </Box>

          {/* Validation Details */}
          <Box mt={3}>
            <Typography variant="h6" className={styles.sectionHeader}>
              Detail Laporan:
            </Typography>
            <Paper className={styles.paperContent}>
              <Box display="flex" alignItems="center">
                <InfoIcon className={styles.iconInfo} fontSize="small" />
                <Typography variant="body1" className={styles.contentText}>
                  {validationText}
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* User Information */}
          <Box mt={3}>
            <Typography variant="body2" className={styles.userInfo}>
              Laporan ini dibuat oleh {report.user.username}.
            </Typography>
          </Box>

          {/* Related News */}
          <Box mt={3}>
            <Typography variant="h6" className={styles.sectionHeader}>
              Berita Terkait:
            </Typography>
            {report.relatedNews.length > 0 ? (
              report.relatedNews.map((news, index) => (
                <Box key={index} className={styles.relatedNewsItem}>
                  <Typography
                    variant="body2"
                    className={styles.relatedNewsLink}
                  >
                    <a
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {news.title}
                    </a>
                  </Typography>
                  <Typography variant="body1" className={styles.contentText}>
                    {news.description}
                  </Typography>
                  <Typography variant="caption" className={styles.timestamp}>
                    Source: {news.source} - Published: {news.publishedAt}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2">
                No related news available.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Tombol Back di luar konten PDF */}
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
        autoHideDuration={3000}
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
};

export default ReportDetail;
