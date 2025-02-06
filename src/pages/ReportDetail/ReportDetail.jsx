import React, { useEffect, useState } from 'react';

import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import useAxios from '../../services/api';

const ReportDetail = () => {
  // Ambil parameter dengan nama reportId (sesuai dengan route di App.jsx)
  const { reportId } = useParams();
  console.log('ReportDetail - reportId:', reportId); // Debug: pastikan nilainya tidak undefined
  const axios = useAxios();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!reportId) {
      setError('ID laporan tidak ditemukan.');
      setLoading(false);
      return;
    }
    const fetchReport = async () => {
      try {
        // Base URL sudah diatur di api.js; URL akhir: http://localhost:3000/api/reports/123
        const response = await axios.get(`/reports/${reportId}`);
        setReport(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch report details'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId, axios]);

  const handleBack = () => {
    navigate('/reports');
  };

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
          <Box mt={2}>
            <Button variant="contained" onClick={handleBack}>
              Back to Reports
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4">{report.title}</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Status: {report.validationStatus}
        </Typography>
        <Box mt={2}>
          <Typography variant="body1">{report.content}</Typography>
        </Box>
        <Box mt={2}>
          <Button variant="contained" onClick={handleBack}>
            Back to Reports
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ReportDetail;
