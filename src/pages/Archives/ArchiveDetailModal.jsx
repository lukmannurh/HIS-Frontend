import React, { useRef, useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import UpdateIcon from '@mui/icons-material/Update';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import html2pdf from 'html2pdf.js';

import styles from './Archives.module.css';

const ArchiveDetailModal = ({ open, onClose, archive }) => {
  const contentRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  if (!archive) return null;

  const isEdited = archive.updatedAt && archive.updatedAt !== archive.createdAt;

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

  let fullValidationText = '';
  try {
    if (archive.validationDetails) {
      const parsed = JSON.parse(archive.validationDetails);
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
        filename: `${archive.title}.pdf`,
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className={styles.detailTitle}>{archive.title}</DialogTitle>
      <DialogContent dividers className={styles.detailContent} ref={contentRef}>
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

        {archive.validationStatus === 'hoax' ? (
          <Box className={`${styles.statusBadge} ${styles.hoax}`}>
            <CancelIcon className={styles.iconStatus} fontSize="large" />
            Hoax
          </Box>
        ) : archive.validationStatus === 'valid' ? (
          <Box className={`${styles.statusBadge} ${styles.valid}`}>
            <VerifiedUserIcon className={styles.iconStatus} fontSize="large" />
            Valid
          </Box>
        ) : (
          <Box className={`${styles.statusBadge} ${styles.doubtful}`}>
            <HelpOutlineIcon className={styles.iconStatus} fontSize="large" />
            Diragukan
          </Box>
        )}

        <Box className={styles.timestampBox}>
          <AccessTimeIcon className={styles.icon} fontSize="small" />
          <Typography variant="body2" className={styles.timestamp}>
            Dibuat pada: {formatDateWIB(archive.createdAt)}
          </Typography>
          {isEdited && (
            <Box className={styles.updatedBox}>
              <UpdateIcon className={styles.icon} fontSize="small" />
              <Typography variant="body2" className={styles.timestamp}>
                Diubah pada: {formatDateWIB(archive.updatedAt)}
              </Typography>
              {archive.editedBy && (
                <Typography variant="body2" className={styles.editedBy}>
                  Archive ini diedit oleh {archive.editedBy}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        <Typography variant="h3" className={styles.title} mt={2}>
          {archive.title}
        </Typography>

        <Box mt={3}>
          <Typography variant="h6" className={styles.sectionHeader}>
            Isi Archive:
          </Typography>
          <Paper className={styles.paperContent}>
            <Typography variant="body1" className={styles.contentText}>
              {archive.content}
            </Typography>
            {archive.document && (
              <Box mt={2}>
                <Typography variant="subtitle2">Dokumen/Lampiran:</Typography>
                <a
                  href={archive.document}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {archive.document}
                </a>
              </Box>
            )}
          </Paper>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" className={styles.sectionHeader}>
            Detail Archive:
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

        <Box mt={3}>
          <Typography variant="body2" className={styles.userInfo}>
            Archive ini dibuat oleh {archive.user.username}.
          </Typography>
        </Box>

        {archive.relatedNews && archive.relatedNews.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" className={styles.sectionHeader}>
              Berita Terkait:
            </Typography>
            {archive.relatedNews.map((news, index) => (
              <Box key={index} className={styles.relatedNewsItem}>
                <Typography variant="body2" className={styles.relatedNewsLink}>
                  <a href={news.url} target="_blank" rel="noopener noreferrer">
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
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions className={styles.detailActions}>
        <Button onClick={onClose} color="primary">
          Tutup
        </Button>
      </DialogActions>
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
    </Dialog>
  );
};

export default ArchiveDetailModal;
