import React, { useEffect, useState } from 'react';

import SortIcon from '@mui/icons-material/Sort';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactPaginate from 'react-paginate';
import { Link as RouterLink } from 'react-router-dom';

import styles from './Reports.module.css';
import ReportsTable from './ReportsTable';
import api from '../../services/api';

const Reports = () => {
  const theme = useTheme();

  // Data state
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // User data
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');

  // Pencarian & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSender, setFilterSender] = useState('all'); // all, owner, admin, user
  const [filterStatus, setFilterStatus] = useState('all'); // all, hoax, valid

  // Sorting state
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState('title-asc');
  const sortOptions = [
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'time-new', label: 'Waktu (Terbaru)' },
    { value: 'time-old', label: 'Waktu (Terlama)' },
  ];

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          setUserRole(userData.role);
          setUserId(userData.id);
        }
        const response = await api.get('/reports');
        setReports(response.data);
      } catch (err) {
        setError('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Helper: gunakan updatedAt jika ada dan berbeda; jika tidak, gunakan createdAt.
  const getReportTimestamp = (report) => {
    return report.updatedAt && report.updatedAt !== report.createdAt
      ? report.updatedAt
      : report.createdAt;
  };

  // Format tanggal ke locale 'id-ID' dan tambahkan "WIB"
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

  // Sorting: fungsi untuk mengurutkan laporan berdasarkan opsi yang dipilih dari dialog
  const handleSortOption = (option) => {
    let newSortColumn, newSortOrder;
    if (option === 'title-asc') {
      newSortColumn = 'title';
      newSortOrder = 'asc';
    } else if (option === 'title-desc') {
      newSortColumn = 'title';
      newSortOrder = 'desc';
    } else if (option === 'time-new') {
      newSortColumn = 'timestamp';
      newSortOrder = 'desc';
    } else if (option === 'time-old') {
      newSortColumn = 'timestamp';
      newSortOrder = 'asc';
    }
    const sortedReports = [...reports].sort((a, b) => {
      if (newSortColumn === 'title') {
        return newSortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (newSortColumn === 'timestamp') {
        const timeA = new Date(getReportTimestamp(a));
        const timeB = new Date(getReportTimestamp(b));
        return newSortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }
      return 0;
    });
    setReports(sortedReports);
    setSortDialogOpen(false);
  };

  // Filter handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const handleFilterSenderChange = (e) => {
    setFilterSender(e.target.value);
    setCurrentPage(0);
  };

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(0);
  };

  // Filter data: berdasarkan pencarian, filter pengirim, dan filter status
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSender =
      filterSender === 'all' || report.user.role.toLowerCase() === filterSender;
    const matchesStatus =
      filterStatus === 'all' ||
      report.validationStatus.toLowerCase() === filterStatus;
    return matchesSearch && matchesSender && matchesStatus;
  });

  const displayedReports = filteredReports.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const pageCount = Math.ceil(filteredReports.length / itemsPerPage);

  const handleOpenDeleteDialog = (reportId) => {
    setSelectedReportId(reportId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedReportId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/reports/${selectedReportId}`);
      setReports((prev) => prev.filter((r) => r.id !== selectedReportId));
      handleCloseDeleteDialog();
    } catch (err) {
      setError('Failed to delete report');
      handleCloseDeleteDialog();
    }
  };

  if (loading) {
    return (
      <Box
        className={styles.container}
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
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
      <Box
        className={styles.container}
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
        m={3}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      className={styles.container}
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
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
        className="mb-3"
      />

      {/* Filter Controls */}
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
          <InputLabel id="filter-status-label">Status</InputLabel>
          <Select
            labelId="filter-status-label"
            value={filterStatus}
            onChange={handleFilterStatusChange}
            label="Status"
          >
            <MenuItem value="all">Semua</MenuItem>
            <MenuItem value="hoax">Hoax</MenuItem>
            <MenuItem value="valid">Valid</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Sorting Control */}
      <Box className={styles.sortContainer}>
        <Button
          variant="outlined"
          onClick={() => setSortDialogOpen(true)}
          className={styles.sortButton}
        >
          <SortIcon fontSize="small" style={{ marginRight: '0.3rem' }} />
          Sort By:{' '}
          {sortOptions.find((opt) => opt.value === selectedSortOption)?.label}
        </Button>
      </Box>

      {/* Sorting Dialog */}
      <Dialog open={sortDialogOpen} onClose={() => setSortDialogOpen(false)}>
        <DialogTitle>Sort By</DialogTitle>
        <DialogContent>
          <List>
            {sortOptions.map((option) => (
              <ListItem key={option.value} disablePadding>
                <ListItemButton
                  selected={selectedSortOption === option.value}
                  onClick={() => setSelectedSortOption(option.value)}
                  className={styles.sortListItemButton}
                >
                  {selectedSortOption === option.value && (
                    <span className={styles.bullet}>•</span>
                  )}
                  <ListItemText primary={option.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSortDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleSortOption(selectedSortOption)}
            variant="contained"
            className={styles.applyButton}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tabel Reports (komponen terpisah) */}
      <ReportsTable
        reports={displayedReports}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        formatDateWIB={formatDateWIB}
        getReportTimestamp={getReportTimestamp}
        userRole={userRole}
        userId={userId}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
      />

      {/* Pagination */}
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

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this report?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>No</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;
