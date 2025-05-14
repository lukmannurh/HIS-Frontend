// src/pages/Reports/Reports.jsx

import React, { useEffect, useState } from 'react';

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
import { Link as RouterLink } from 'react-router-dom';

import styles from './Reports.module.css';
import ReportsTableAdmin from './ReportsTableAdmin';
import ReportsTableUser from './ReportsTableUser';
import api from '../../services/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userRole = storedUser?.role || '';
  const userId = storedUser?.id || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSender, setFilterSender] = useState('all');
  const [filterValidation, setFilterValidation] = useState('all');

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        setReports(response.data);
      } catch {
        setError('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSender =
      filterSender === 'all' || report.user.role.toLowerCase() === filterSender;
    const matchesValidation =
      filterValidation === 'all' ||
      report.validationStatus.toLowerCase() === filterValidation;
    return matchesSearch && matchesSender && matchesValidation;
  });

  const displayedReports = filteredReports.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const pageCount = Math.ceil(filteredReports.length / itemsPerPage);

  const getReportTimestamp = (report) =>
    report.updatedAt && report.updatedAt !== report.createdAt
      ? report.updatedAt
      : report.createdAt;

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
        status: 'selesai',
      });
      setReports((prev) => prev.filter((r) => r.id !== selectedReport.id));
      closeStatusDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
      closeStatusDialog();
    }
  };

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
        setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
        setSnackbarMessage('Laporan berhasil dihapus!');
        setSnackbarOpen(true);
        closeDeleteDialog();
      } catch {
        setSnackbarMessage('Gagal menghapus laporan!');
        setSnackbarOpen(true);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };
  const handleFilterSenderChange = (e) => {
    setFilterSender(e.target.value);
    setCurrentPage(0);
  };
  const handleFilterValidationChange = (e) => {
    setFilterValidation(e.target.value);
    setCurrentPage(0);
  };
  const handleSnackbarClose = () => setSnackbarOpen(false);

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
      <Box className={styles.header}>
        <Typography variant="h4">Reports</Typography>
        <Button variant="contained" component={RouterLink} to="/create-report">
          Create Report
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search by Title"
        value={searchQuery}
        onChange={handleSearch}
        margin="normal"
      />

      <Box className={styles.filterContainer}>
        <FormControl
          variant="outlined"
          size="small"
          className={styles.filterControl}
        >
          <InputLabel id="filter-sender-label">Pengirim</InputLabel>
          <Select
            labelId="filter-sender-label"
            value={filterSender}
            onChange={handleFilterSenderChange}
            label="Pengirim"
          >
            <MenuItem value="all">Semua</MenuItem>
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          size="small"
          className={styles.filterControl}
        >
          <InputLabel id="filter-validation-label">Validasi</InputLabel>
          <Select
            labelId="filter-validation-label"
            value={filterValidation}
            onChange={handleFilterValidationChange}
            label="Validasi"
          >
            <MenuItem value="all">Semua</MenuItem>
            <MenuItem value="valid">Valid</MenuItem>
            <MenuItem value="hoax">Hoax</MenuItem>
            <MenuItem value="diragukan">Diragukan</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
          userRole={userRole}
          userId={userId}
          openStatusDialog={openStatusDialog}
          openDeleteDialog={openDeleteDialog}
        />
      )}

      <Box
        className={styles.paginationContainer}
        display="flex"
        justifyContent="center"
        mt={3}
      >
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />

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
    </Box>
  );
};

export default Reports;
