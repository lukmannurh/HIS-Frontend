/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';

import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import styles from './ReportsTableAdmin.module.css';
import api from '../../services/api';

export default function ReportsTableAdmin({
  reports,
  currentPage,
  itemsPerPage,
  getReportTimestamp,
  openDeleteDialog,
}) {
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [reportToArchive, setReportToArchive] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // buka dialog arsip
  const handleOpenArchiveDialog = (report) => {
    setReportToArchive(report);
    setArchiveDialogOpen(true);
  };
  const handleCloseArchiveDialog = () => {
    setReportToArchive(null);
    setArchiveDialogOpen(false);
  };

  // konfirmasi arsip
  const handleConfirmArchive = async () => {
    try {
      await api.put(`/reports/${reportToArchive.id}/archive`);
      setSnackbar({
        open: true,
        message: 'Laporan berhasil diarsipkan',
        severity: 'success',
      });
      // TODO: panggil ulang data laporan di parent jika perlu
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Gagal mengarsipkan laporan',
        severity: 'error',
      });
    } finally {
      handleCloseArchiveDialog();
    }
  };

  return (
    <>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table className={styles.table}>
          <TableHead className={styles.tableHeader}>
            <TableRow>
              <TableCell className={styles.center}>No</TableCell>
              <TableCell>RT</TableCell>
              <TableCell>RW</TableCell>
              <TableCell>Pengirim</TableCell>
              <TableCell>Validasi</TableCell>
              <TableCell>Tanggal</TableCell>
              <TableCell className={styles.center}>Status</TableCell>
              <TableCell className={`ps-4 ${styles.actionsCell}`}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className={styles.center}>
                  Tidak ada laporan.
                </TableCell>
              </TableRow>
            )}
            {reports.map((report, idx) => {
              const dateOnly = new Date(
                getReportTimestamp(report)
              ).toLocaleDateString('id-ID');
              const sender =
                report.user.fullName?.trim() || report.user.username;
              const validation = report.validationStatus;
              const status = report.reportStatus || 'diproses';

              const validationColor =
                validation === 'valid'
                  ? 'success'
                  : validation === 'hoax'
                    ? 'error'
                    : 'warning';
              const statusColor = status === 'selesai' ? 'success' : 'warning';

              return (
                <TableRow key={report.id} className={styles.row}>
                  <TableCell className={styles.center}>
                    {currentPage * itemsPerPage + idx + 1}
                  </TableCell>
                  <TableCell>{report.user.rt}</TableCell>
                  <TableCell>{report.user.rw}</TableCell>
                  <TableCell>{sender}</TableCell>
                  <TableCell>
                    <Chip
                      label={validation.toUpperCase()}
                      color={validationColor}
                      size="small"
                      className={styles.chip}
                    />
                  </TableCell>
                  <TableCell>{dateOnly}</TableCell>
                  <TableCell className={styles.center}>
                    <Chip
                      label={status === 'selesai' ? 'SELESAI' : 'DIPROSES'}
                      color={statusColor}
                      size="small"
                      className={styles.chip}
                    />
                  </TableCell>
                  <TableCell className={`ps-4 ${styles.actionsCell}`}>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View" arrow>
                        <IconButton
                          component={RouterLink}
                          to={`/reports/${report.id}`}
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          component={RouterLink}
                          to={`/reports/edit/${report.id}`}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openDeleteDialog(report)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Archive" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenArchiveDialog(report)}
                        >
                          <ArchiveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Konfirmasi Arsip */}
      <Dialog open={archiveDialogOpen} onClose={handleCloseArchiveDialog}>
        <DialogTitle>Arsipkan Laporan</DialogTitle>
        <DialogContent>
          <Typography>
            Anda yakin ingin mengarsipkan laporan
            <strong>"{reportToArchive?.title}?"</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseArchiveDialog}>Batal</Button>
          <Button onClick={handleConfirmArchive} color="primary">
            Arsipkan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifikasi */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}
