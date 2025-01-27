import React, { useEffect, useState } from 'react';
import useAxios from '../services/api';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';

const Reports = () => {
  const axios = useAxios();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/reports');
        setReports(response.data);
      } catch (err) {
        setError('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [axios]); // Tambahkan 'axios' sebagai dependency

  if (loading) {
    return (
      <Box mt={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box mt={5}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={5} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Reports</Typography>
        <Button variant="contained" color="primary" component={Link} to="/create-report">
          Create Report
        </Button>
      </Box>
      <Box mt={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.status}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/reports/${report.id}`} variant="outlined" size="small">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default Reports;
