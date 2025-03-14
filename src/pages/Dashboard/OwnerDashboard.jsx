import React, { useEffect, useState } from 'react';

import 'chart.js/auto';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { Bar, Pie, Line } from 'react-chartjs-2';

import styles from './OwnerDashboard.module.css';
import api from '../../services/api';

const OwnerDashboard = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [archives, setArchives] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsResponse = await api.get('/reports');
        setReports(reportsResponse.data);

        const usersResponse = await api.get('/users');
        setUsers(usersResponse.data);

        const archivesResponse = await api.get('/archives');
        setArchives(archivesResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  // Chart 1: Distribusi Laporan per Bulan
  const distributionLabels = [
    ...new Set(
      reports.map((r) =>
        new Date(r.createdAt).toLocaleString('id-ID', {
          month: 'short',
          year: 'numeric',
        })
      )
    ),
  ];
  const distributionData = {
    labels: distributionLabels,
    datasets: [
      {
        label: 'Laporan per Bulan',
        data: distributionLabels.map(
          (label) =>
            reports.filter(
              (r) =>
                new Date(r.createdAt).toLocaleString('id-ID', {
                  month: 'short',
                  year: 'numeric',
                }) === label
            ).length
        ),
        backgroundColor: '#42a5f5',
      },
    ],
  };

  // Chart 2: Status Validasi (Pie Chart)
  const statusCounts = reports.reduce((acc, r) => {
    acc[r.validationStatus] = (acc[r.validationStatus] || 0) + 1;
    return acc;
  }, {});
  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Status Validasi',
        data: Object.values(statusCounts),
        backgroundColor: ['#66bb6a', '#ffa726', '#ef5350', '#42a5f5'],
      },
    ],
  };

  // Chart 3: Tren Laporan Harian (Line Chart)
  const sortedReports = [...reports].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  const dailyLabels = sortedReports.map((r) =>
    new Date(r.createdAt).toLocaleDateString('id-ID')
  );
  const dailyData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Laporan Harian',
        data: dailyLabels.map(
          (label) =>
            sortedReports.filter(
              (r) => new Date(r.createdAt).toLocaleDateString('id-ID') === label
            ).length
        ),
        fill: false,
        borderColor: '#42a5f5',
      },
    ],
  };

  // Chart 4: Manajemen Pengguna (Bar Chart) – distribusi berdasarkan role
  const userRoleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});
  const userRoleData = {
    labels: Object.keys(userRoleCounts),
    datasets: [
      {
        label: 'Jumlah Pengguna',
        data: Object.values(userRoleCounts),
        backgroundColor: ['#8e24aa', '#3949ab', '#d81b60'],
      },
    ],
  };

  // Chart 5: Arsip Laporan per Bulan (Bar Chart)
  const archiveLabels = [
    ...new Set(
      archives.map((a) =>
        new Date(a.archivedAt).toLocaleString('id-ID', {
          month: 'short',
          year: 'numeric',
        })
      )
    ),
  ];
  const archiveData = {
    labels: archiveLabels,
    datasets: [
      {
        label: 'Arsip per Bulan',
        data: archiveLabels.map(
          (label) =>
            archives.filter(
              (a) =>
                new Date(a.archivedAt).toLocaleString('id-ID', {
                  month: 'short',
                  year: 'numeric',
                }) === label
            ).length
        ),
        backgroundColor: '#ff7043',
      },
    ],
  };

  // Chart 6: Laporan oleh Admin (Bar Chart)
  const adminReports = reports.filter((r) => r.user.role === 'admin');
  const adminReportData = {
    labels: ['Laporan oleh Admin'],
    datasets: [
      {
        label: 'Jumlah Laporan',
        data: [adminReports.length],
        backgroundColor: '#ab47bc',
      },
    ],
  };

  // Chart 7: Top 5 Pelapor (Bar Chart)
  const userReportCounts = users
    .map((user) => ({
      username: user.username,
      count: reports.filter((r) => r.user.id === user.id).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topUserData = {
    labels: userReportCounts.map((u) => u.username),
    datasets: [
      {
        label: 'Top 5 Pelapor',
        data: userReportCounts.map((u) => u.count),
        backgroundColor: '#26a69a',
      },
    ],
  };

  // Chart 8: Trend Validasi Harian (Stacked Bar Chart)
  const trendDates = [
    ...new Set(
      sortedReports.map((r) =>
        new Date(r.createdAt).toLocaleDateString('id-ID')
      )
    ),
  ];
  const trendData = {
    labels: trendDates,
    datasets: [
      {
        label: 'Valid',
        data: trendDates.map(
          (date) =>
            sortedReports.filter(
              (r) =>
                new Date(r.createdAt).toLocaleDateString('id-ID') === date &&
                r.validationStatus === 'valid'
            ).length
        ),
        backgroundColor: '#66bb6a',
      },
      {
        label: 'Hoax',
        data: trendDates.map(
          (date) =>
            sortedReports.filter(
              (r) =>
                new Date(r.createdAt).toLocaleDateString('id-ID') === date &&
                r.validationStatus === 'hoax'
            ).length
        ),
        backgroundColor: '#ef5350',
      },
      {
        label: 'Diragukan',
        data: trendDates.map(
          (date) =>
            sortedReports.filter(
              (r) =>
                new Date(r.createdAt).toLocaleDateString('id-ID') === date &&
                r.validationStatus === 'diragukan'
            ).length
        ),
        backgroundColor: '#ffa726',
      },
    ],
  };

  return (
    <Box className={styles.dashboardContainer}>
      <Typography variant="h3" className={styles.dashboardTitle}>
        Owner Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className={styles.chartPaper}>
            <Typography variant="h6" className={styles.chartTitle}>
              Distribusi Laporan per Bulan
            </Typography>
            <Bar data={distributionData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.chartPaper}>
            <Typography variant="h6" className={styles.chartTitle}>
              Status Validasi Laporan
            </Typography>
            <Pie data={statusData} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={styles.chartPaper}>
            <Typography variant="h6" className={styles.chartTitle}>
              Tren Laporan Harian
            </Typography>
            <Line data={dailyData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.chartPaper}>
            <Typography variant="h6" className={styles.chartTitle}>
              Distribusi Pengguna
            </Typography>
            <Bar data={userRoleData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.chartPaper}>
            <Typography variant="h6" className={styles.chartTitle}>
              Arsip Laporan per Bulan
            </Typography>
            <Bar data={archiveData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.chartPaper}>
            <Typography variant="h6" className={styles.chartTitle}>
              Laporan oleh Admin
            </Typography>
            <Bar data={adminReportData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.chartPaper}>
            <Typography variant="h6" className={styles.chartTitle}>
              Top 5 Pelapor
            </Typography>
            <Bar data={topUserData} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={styles.chartPaper}>
            <Typography variant="h6" className={styles.chartTitle}>
              Trend Validasi Harian (Stacked)
            </Typography>
            <Bar
              data={trendData}
              options={{
                plugins: { tooltip: { mode: 'index', intersect: false } },
                responsive: true,
                scales: { x: { stacked: true }, y: { stacked: true } },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnerDashboard;
