import React, { useEffect, useState } from 'react';

import 'chart.js/auto';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';

import styles from './UserDashboard.module.css';
import api from '../../../services/api';

const UserDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/reports')
      .then((res) => setReports(res.data))
      .catch(() => setError('Gagal memuat data dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box
        className={styles.dashboardContainer}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box className={styles.dashboardContainer}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Hitung status laporan
  const statusCounts = reports.reduce((acc, r) => {
    acc[r.validationStatus] = (acc[r.validationStatus] || 0) + 1;
    return acc;
  }, {});

  const total = reports.length;
  const valid = statusCounts.valid || 0;
  const hoax = statusCounts.hoax || 0;
  const diragukan = statusCounts.diragukan || 0;

  const chartData = {
    labels: ['Total', 'Valid', 'Hoax', 'Diragukan'],
    datasets: [
      {
        label: 'Jumlah Laporan',
        data: [total, valid, hoax, diragukan],
        backgroundColor: ['#42a5f5', '#66bb6a', '#ef5350', '#ffa726'],
      },
    ],
  };

  return (
    <Box className={styles.dashboardContainer}>
      <Typography variant="h4" className={styles.dashboardTitle}>
        User Dashboard
      </Typography>

      <Grid container spacing={2} className={styles.cardsGrid}>
        {[
          { label: 'Total Laporan', value: total, color: '#42a5f5' },
          { label: 'Valid', value: valid, color: '#66bb6a' },
          { label: 'Hoax', value: hoax, color: '#ef5350' },
          { label: 'Diragukan', value: diragukan, color: '#ffa726' },
        ].map((card) => (
          <Grid item xs={6} sm={3} key={card.label}>
            <Paper
              className={styles.statCard}
              style={{ borderTopColor: card.color }}
            >
              <Typography className={styles.statLabel}>{card.label}</Typography>
              <Typography className={styles.statValue}>{card.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper className={styles.chartPaper}>
        <Typography variant="h6" className={styles.chartTitle}>
          Ringkasan Status Laporan
        </Typography>
        <Bar data={chartData} />
      </Paper>
    </Box>
  );
};

export default UserDashboard;
