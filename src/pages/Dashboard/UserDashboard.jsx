import React, { useEffect, useState } from 'react';

import 'chart.js/auto';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';

import styles from './UserDashboard.module.css';
import api from '../../services/api';

const UserDashboard = () => {
  const [userReports, setUserReports] = useState([]);
  const [archives, setArchives] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const reportsResponse = await api.get('/reports');
        const filtered = reportsResponse.data.filter(
          (r) => r.user.id === currentUser.id
        );
        setUserReports(filtered);

        const archivesResponse = await api.get('/archives');
        const userArchives = archivesResponse.data.filter(
          (a) => a.user.id === currentUser.id
        );
        setArchives(userArchives);
      } catch (error) {
        console.error('Error fetching user dashboard data:', error);
      }
    };

    fetchUserData();
  }, [currentUser.id]);

  // Hitung status laporan berdasarkan validasi
  const statusCounts = userReports.reduce((acc, r) => {
    acc[r.validationStatus] = (acc[r.validationStatus] || 0) + 1;
    return acc;
  }, {});

  const dashboardData = {
    labels: ['Total Laporan', 'Valid', 'Hoax', 'Diragukan', 'Diarsip'],
    datasets: [
      {
        label: 'Ringkasan Laporan Saya',
        data: [
          userReports.length,
          statusCounts['valid'] || 0,
          statusCounts['hoax'] || 0,
          statusCounts['diragukan'] || 0,
          archives.length,
        ],
        backgroundColor: [
          '#2196F3',
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
      <Typography variant="h3" className={styles.dashboardTitle}>
        User Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={styles.chartPaper}>
            <Typography variant="h6" className={styles.chartTitle}>
              Ringkasan Laporan Saya
            </Typography>
            <Bar data={dashboardData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
