import React, { useEffect, useState } from 'react';

import 'chart.js/auto';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { Bar, Pie, Line } from 'react-chartjs-2';

import styles from './AdminDashboard.module.css';
import api from '../../services/api';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [archives, setArchives] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsResponse = await api.get('/reports');
        // Admin dapat melihat laporan milik user (role "user") dan laporan milik dirinya sendiri
        const filteredReports = reportsResponse.data.filter(
          (r) => r.user.role === 'user' || r.user.id === currentUser.id
        );
        setReports(filteredReports);

        const usersResponse = await api.get('/users');
        // Untuk admin, hanya tampilkan user dengan role "user"
        const filteredUsers = usersResponse.data.filter(
          (u) => u.role === 'user'
        );
        setUsers(filteredUsers);

        const archivesResponse = await api.get('/archives');
        setArchives(archivesResponse.data);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      }
    };

    fetchData();
  }, [currentUser.id]);

  // Distribusi Laporan per Bulan
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

  // Status Validasi (Pie Chart)
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
        backgroundColor: ['#66bb6a', '#ffa726', '#ef5350'],
      },
    ],
  };

  // Tren Laporan Harian (Line Chart)
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

  // Manajemen Pengguna: jumlah laporan per pengguna (untuk role "user")
  const userData = {
    labels: users.map((u) => u.username),
    datasets: [
      {
        label: 'Jumlah Laporan',
        data: users.map(
          (u) => reports.filter((r) => r.user.id === u.id).length
        ),
        backgroundColor: '#ab47bc',
      },
    ],
  };

  // Arsip Laporan per Bulan
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

  return (
    <Box className={styles.dashboardContainer}>
      <Typography variant="h3" className={styles.dashboardTitle}>
        Admin Dashboard
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
        <Grid item xs={12}>
          <Paper className={styles.chartPaper}>
            <Typography variant="h6" className={styles.chartTitle}>
              Manajemen Pengguna (Laporan per Pengguna)
            </Typography>
            <Bar data={userData} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={styles.chartPaper}>
            <Typography variant="h6" className={styles.chartTitle}>
              Arsip Laporan per Bulan
            </Typography>
            <Bar data={archiveData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
