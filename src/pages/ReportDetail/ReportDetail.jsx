import React, { useEffect, useState } from 'react';

import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Paper,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import api from '../../services/api';

const ReportDetail = () => {
  const { reportId } = useParams(); // Ambil reportId dari URL
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEdited, setIsEdited] = useState(false); // Untuk mengetahui apakah laporan diedit

  useEffect(() => {
    if (!reportId) {
      setError('ID laporan tidak ditemukan.');
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        const response = await api.get(`/reports/${reportId}`);
        setReport(response.data);

        // Jika laporan memiliki updatedAt, berarti sudah diedit
        if (response.data.updatedAt) {
          setIsEdited(true);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch report details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

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
        {/* Menampilkan Created At dan Updated At di atas content */}
        <Typography variant="body2" color="textSecondary">
          Created At: {new Date(report.createdAt).toLocaleString()}
        </Typography>
        {isEdited && (
          <Typography variant="body2" color="textSecondary">
            Last Updated: {new Date(report.updatedAt).toLocaleString()}
          </Typography>
        )}

        <Typography variant="h4" mt={2}>
          {report.title}
        </Typography>

        {/* Menampilkan Content */}

        <Box mt={2}>
          <Typography variant="h6">Isi Laporan:</Typography>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="body1">{report.content}</Typography>
          </Paper>
        </Box>

        {/* Menampilkan Validation Status di bawah Content */}
        <Box mt={2}>
          <Typography
            variant="h6"
            color={report.validationStatus === 'hoax' ? 'error' : 'primary'}
          >
            Status: {report.validationStatus === 'hoax' ? 'Hoax' : 'Valid'}
          </Typography>
        </Box>

        {/* Menampilkan Validation Details sebagai Hasil Laporan */}
        <Box mt={2}>
          <Typography variant="h6">Hasil Laporan:</Typography>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="body1">
              {JSON.parse(report.validationDetails)?.gemini?.output}
            </Typography>
          </Paper>
        </Box>

        {/* User Information dalam satu kalimat */}
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Laporan ini dibuat oleh {report.user.username}.
          </Typography>
        </Box>

        {/* Menampilkan Related News */}
        <Box mt={2}>
          <Typography variant="h6">Berita Terkait:</Typography>
          {report.relatedNews.length > 0 ? (
            report.relatedNews.map((news, index) => (
              <Box key={index} mb={2}>
                <Typography variant="body2" color="primary">
                  <a href={news.url} target="_blank" rel="noopener noreferrer">
                    {news.title}
                  </a>
                </Typography>
                <Typography variant="body2">{news.description}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Source: {news.source} - Published: {news.publishedAt}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No related news available.</Typography>
          )}
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
