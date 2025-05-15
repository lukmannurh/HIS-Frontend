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
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [rRes, aRes] = await Promise.all([
          api.get('/reports'),
          api.get('/archives'),
        ]);
        setReports(rRes.data);
        setArchives(aRes.data);
      } catch (err) {
        setError('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
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
      <Box className={styles.dashboardContainer} m={3}>
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
  const diarsip = archives.length;

  const chartData = {
    labels: ['Total', 'Valid', 'Hoax', 'Diragukan', 'Arsip'],
    datasets: [
      {
        label: 'Jumlah Laporan',
        data: [total, valid, hoax, diragukan, diarsip],
        backgroundColor: [
          '#42a5f5',
          '#66bb6a',
          '#ef5350',
          '#ffa726',
          '#9e9e9e',
        ],
      },
    ],
  };

  return (
    <Box className={styles.dashboardContainer}>
      <Typography variant="h4" className={styles.dashboardTitle}>
        Dashboard Laporan
      </Typography>

      <Grid container spacing={3} className={styles.cardsGrid}>
        {[
          { label: 'Total Laporan', value: total, color: '#42a5f5' },
          { label: 'Valid', value: valid, color: '#66bb6a' },
          { label: 'Hoax', value: hoax, color: '#ef5350' },
          { label: 'Diragukan', value: diragukan, color: '#ffa726' },
          { label: 'Diarsip', value: diarsip, color: '#9e9e9e' },
        ].map((card) => (
          <Grid item xs={12} sm={6} md={2.4} key={card.label}>
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
