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
  const { id } = useParams();
  const axios = useAxios();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/reports/${id}`);
      setReport(response.data);
    } catch (err) {
      setError('Failed to fetch report details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line
  }, [id]);

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
          Status: {report.status}
        </Typography>
        <Box mt={2}>
          <Typography variant="body1">{report.description}</Typography>
        </Box>
        {/* Tambahkan detail lainnya sesuai kebutuhan */}
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
