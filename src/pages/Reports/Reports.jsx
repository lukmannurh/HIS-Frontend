/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
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
import { Link as RouterLink, useLocation, Navigate } from 'react-router-dom';

import styles from './Reports.module.css';
import ReportsTableAdmin from './ReportsTableAdmin';
import ReportsTableUser from './ReportsTableUser';
import api from '../../services/api';

const Reports = () => {
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = storedUser.role?.toLowerCase() || '';
  const userId = storedUser.id || '';

  // owner tidak boleh mengakses Reports
  if (userRole === 'owner') {
    return <Navigate to="/dashboard" replace />;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSender, setFilterSender] = useState('all');
  const [filterValidation, setFilterValidation] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/reports');
      setReports(data);
    } catch {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, []);

  // re-fetch whenever URL changes (e.g. after navigation back from edit)
  useEffect(() => {
    fetchReports();
  }, [fetchReports, location]);

  // Filters
  const filteredReports = reports.filter((r) => {
    const matchSearch = r.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchSender =
      filterSender === 'all' || r.user.role.toLowerCase() === filterSender;
    const matchValidation =
      filterValidation === 'all' ||
      r.validationStatus.toLowerCase() === filterValidation;
    return matchSearch && matchSender && matchValidation;
  });

  const displayedReports = filteredReports.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const pageCount = Math.ceil(filteredReports.length / itemsPerPage);

  const getReportTimestamp = (r) =>
    r.updatedAt && r.updatedAt !== r.createdAt ? r.updatedAt : r.createdAt;

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

  // Status dialog
  const openStatusDialog = (report) => {
    setSelectedReport(report);
    setStatusDialogOpen(true);
  };
  const closeStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedReport(null);
  };
  const handleStatusUpdate = async () => {
    try {
      await api.put(`/reports/${selectedReport.id}/status`, {
        reportStatus: 'selesai',
        validationStatus: selectedReport.validationStatus,
        adminExplanation: selectedReport.adminExplanation || '',
      });
      await fetchReports();
      setSnackbarMessage('Status laporan diperbarui!');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      closeStatusDialog();
    }
  };

  // Delete dialog
  const openDeleteDialog = (report) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setReportToDelete(null);
    setConfirmationText('');
  };
  const handleDeleteConfirmation = async () => {
    if (confirmationText === `hapus ${reportToDelete.title}`) {
      try {
        await api.delete(`/reports/${reportToDelete.id}`);
        await fetchReports();
        setSnackbarMessage('Laporan berhasil dihapus!');
        setSnackbarOpen(true);
      } catch {
        setSnackbarMessage('Gagal menghapus laporan!');
        setSnackbarOpen(true);
      } finally {
        closeDeleteDialog();
      }
    }
  };

  // Loading & error states
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
        <Typography variant="h4">Reports</Typography>
        {userRole === 'user' && (
          <Button
            variant="contained"
            component={RouterLink}
            to="/create-report"
          >
            Create Report
          </Button>
        )}
      </Box>

      {/* Search & Filters */}
      <TextField
        fullWidth
        placeholder="Search by Title"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(0);
        }}
        margin="normal"
      />
      <Box className={styles.filterContainer}>
        <FormControl size="small" className={styles.filterControl}>
          <InputLabel id="filter-sender-label">Pengirim</InputLabel>
          <Select
            labelId="filter-sender-label"
            value={filterSender}
            onChange={(e) => {
              setFilterSender(e.target.value);
              setCurrentPage(0);
            }}
            label="Pengirim"
          >
            <MenuItem value="all">Semua</MenuItem>
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" className={styles.filterControl}>
          <InputLabel id="filter-validation-label">Validasi</InputLabel>
          <Select
            labelId="filter-validation-label"
            value={filterValidation}
            onChange={(e) => {
              setFilterValidation(e.target.value);
              setCurrentPage(0);
            }}
            label="Validasi"
          >
            <MenuItem value="all">Semua</MenuItem>
            <MenuItem value="valid">Valid</MenuItem>
            <MenuItem value="hoax">Hoax</MenuItem>
            <MenuItem value="diragukan">Diragikan</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      {userRole === 'user' ? (
        <ReportsTableUser
          reports={displayedReports}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          formatDateWIB={formatDateWIB}
          getReportTimestamp={getReportTimestamp}
        />
      ) : (
        <ReportsTableAdmin
          reports={displayedReports}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          formatDateWIB={formatDateWIB}
          getReportTimestamp={getReportTimestamp}
          openStatusDialog={openStatusDialog}
          openDeleteDialog={openDeleteDialog}
        />
      )}

      {/* Pagination */}
      <Box
        className={styles.paginationContainer}
        display="flex"
        justifyContent="center"
        mt={3}
      >
        <ReactPaginate
          previousLabel="Previous"
          nextLabel="Next"
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Konfirmasi Hapus Laporan</DialogTitle>
        <DialogContent>
          <Typography>
            Ketik <strong>hapus {reportToDelete?.title}</strong> untuk menghapus
            laporan ini.
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
            onClick={handleDeleteConfirmation}
            variant="contained"
            color="error"
            disabled={confirmationText !== `hapus ${reportToDelete?.title}`}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Confirmation Dialog */}
      <Dialog open={statusDialogOpen} onClose={closeStatusDialog}>
        <DialogTitle>Update Report Status</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin mengubah status laporan ini menjadi{' '}
            <strong>selesai</strong>?
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

      {/* Snackbar for feedback */}
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
};

export default Reports;
