import React, { useEffect, useState, useCallback } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
} from '@mui/material';
import ReactPaginate from 'react-paginate';
// eslint-disable-next-line no-unused-vars
import { Link as RouterLink, useLocation, Navigate } from 'react-router-dom';

import styles from './Reports.module.css';
import ReportsTableAdmin from './ReportsTableAdmin';
import api from '../../services/api';

export default function Reports() {
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // filter / pagination state
  const [searchSender, setSearchSender] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [validationFilter, setValidationFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // dialog & snackbar
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = storedUser.role?.toLowerCase() || '';

  // for users, redirect to create-report
  if (userRole === 'user') {
    return <Navigate to="/create-report" replace />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/reports');
      setReports(data);
    } catch {
      setError('Gagal mengambil daftar laporan');
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchReports();
  }, [fetchReports, location]);

  // helper: nama pengirim
  const getSenderName = (r) =>
    (r.user.fullName?.trim() || r.user.username).toLowerCase();

  // apply all filters
  const filtered = reports.filter((r) => {
    if (!getSenderName(r).includes(searchSender.toLowerCase())) return false;
    if (statusFilter !== 'all' && r.reportStatus !== statusFilter) return false;
    if (validationFilter !== 'all' && r.validationStatus !== validationFilter)
      return false;
    const created = new Date(r.createdAt);
    if (startDate && created < new Date(startDate)) return false;
    if (endDate && created > new Date(endDate)) return false;
    return true;
  });

  const displayed = filtered.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const pageCount = Math.ceil(filtered.length / itemsPerPage);

  // Delete dialog controls
  const openDeleteDialog = (r) => {
    setReportToDelete(r);
    setConfirmationText('');
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => setDeleteDialogOpen(false);
  const handleDelete = async () => {
    if (confirmationText === `hapus ${reportToDelete.title}`) {
      await api.delete(`/reports/${reportToDelete.id}`);
      await fetchReports();
      setSnackbarMessage('Laporan berhasil dihapus!');
      setSnackbarOpen(true);
      closeDeleteDialog();
    }
  };

  // Status dialog controls
  const openStatusDialog = (r) => {
    setSelectedReport(r);
    setStatusDialogOpen(true);
  };
  const closeStatusDialog = () => setStatusDialogOpen(false);
  const handleStatusUpdate = async () => {
    await api.put(`/reports/${selectedReport.id}/status`, {
      reportStatus: 'selesai',
      validationStatus: selectedReport.validationStatus,
      adminExplanation: selectedReport.adminExplanation || '',
    });
    await fetchReports();
    setSnackbarMessage('Status laporan diperbarui!');
    setSnackbarOpen(true);
    closeStatusDialog();
  };

  if (loading) {
    return (
      <Box
        className={styles.container}
        display="flex"
        justifyContent="center"
        mt={3}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box className={styles.container} m={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      {/* Header */}
      <Box className={styles.header}>
        <Typography variant="h4">Laporan</Typography>
      </Box>

      {/* Filters in one row */}
      <Box className={styles.filterRow}>
        <TextField
          size="small"
          placeholder="Cari Pengirim"
          value={searchSender}
          onChange={(e) => {
            setSearchSender(e.target.value);
            setCurrentPage(0);
          }}
          className={styles.searchField}
        />
        <TextField
          size="small"
          label="Dari"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setCurrentPage(0);
          }}
        />
        <TextField
          size="small"
          label="Sampai"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setCurrentPage(0);
          }}
        />
        <FormControl size="small" className={styles.filterControl}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0);
            }}
          >
            <MenuItem value="all">Semua</MenuItem>
            <MenuItem value="diproses">Diproses</MenuItem>
            <MenuItem value="selesai">Selesai</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" className={styles.filterControl}>
          <InputLabel>Validasi</InputLabel>
          <Select
            value={validationFilter}
            label="Validasi"
            onChange={(e) => {
              setValidationFilter(e.target.value);
              setCurrentPage(0);
            }}
          >
            <MenuItem value="all">Semua</MenuItem>
            <MenuItem value="valid">Valid</MenuItem>
            <MenuItem value="hoax">Hoax</MenuItem>
            <MenuItem value="diragukan">Diragukan</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Admin table */}
      <ReportsTableAdmin
        reports={displayed}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        formatDateWIB={(d) =>
          new Date(d).toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }) + ' WIB'
        }
        getReportTimestamp={(r) =>
          r.updatedAt !== r.createdAt ? r.updatedAt : r.createdAt
        }
        openStatusDialog={openStatusDialog}
        openDeleteDialog={openDeleteDialog}
      />

      {/* Pagination */}
      <Box className={styles.paginationContainer}>
        <ReactPaginate
          previousLabel="‹"
          nextLabel="›"
          pageCount={pageCount}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          pageClassName={styles.pageItem}
          pageLinkClassName={styles.pageLink}
          previousClassName={styles.pageItem}
          previousLinkClassName={styles.pageLink}
          nextClassName={styles.pageItem}
          nextLinkClassName={styles.pageLink}
        />
      </Box>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>
            Ketik <strong>hapus {reportToDelete?.title}</strong>
          </Typography>
          <TextField
            label="Teks Konfirmasi"
            fullWidth
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Batal</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={confirmationText !== `hapus ${reportToDelete?.title}`}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={closeStatusDialog}>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
          <Typography>
            Ubah status menjadi <strong>selesai</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeStatusDialog}>Batal</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            color="primary"
          >
            Konfirmasi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}
