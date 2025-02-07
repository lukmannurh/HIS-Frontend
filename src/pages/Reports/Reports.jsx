import React, { useEffect, useState } from 'react';

import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import ReactPaginate from 'react-paginate';
import { Link as RouterLink } from 'react-router-dom';

import api from '../../services/api';

const Reports = () => {
  // (State dan useEffect tidak berubah)
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortColumn, setSortColumn] = useState('no');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

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

  const handleSort = (column) => {
    const newSortOrder =
      sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    const sortedReports = [...reports].sort((a, b) => {
      if (column === 'title') {
        return newSortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (column === 'no') {
        return newSortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      }
      return 0;
    });
    setReports(sortedReports);
    setSortOrder(newSortOrder);
    setSortColumn(column);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 5;
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
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box m={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <IconButton onClick={() => handleSort('no')}>
                  {sortColumn === 'no' && sortOrder === 'asc' ? (
                    <ArrowDownward />
                  ) : (
                    <ArrowUpward />
                  )}
                </IconButton>
                No
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleSort('title')}>
                  {sortColumn === 'title' && sortOrder === 'asc' ? (
                    <ArrowDownward />
                  ) : (
                    <ArrowUpward />
                  )}
                </IconButton>
                Title
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedReports.map((report, index) => (
              <TableRow key={report.id}>
                <TableCell>{currentPage * itemsPerPage + index + 1}</TableCell>
                <TableCell>{report.title}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to={`/reports/${report.id}`} // URL absolut menuju detail laporan
                    size="small"
                  >
                    View
                  </Button>
                  {(userRole === 'owner' ||
                    userRole === 'admin' ||
                    report.userId === userId) && (
                    <>
                      <Button
                        variant="outlined"
                        color="warning"
                        component={RouterLink}
                        to={`/reports/edit/${report.id}`}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleOpenDeleteDialog(report.id)}
                        sx={{ ml: 1 }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={3}>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageCount}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          containerClassName={'pagination'}
          activeClassName={'active'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
        />
      </Box>
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this report?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>No</Button>
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
