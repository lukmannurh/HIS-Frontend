import React, { useEffect, useState } from 'react';

import 'chart.js/auto';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { Bar, Pie, Line } from 'react-chartjs-2';

import styles from './OwnerDashboard.module.css';
import api from '../../../services/api';

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
        console.error('Error fetching owner dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  // 1) Distribusi Laporan per Bulan (Bar)
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

  // 2) Status Validasi (Pie)
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
        backgroundColor: ['#66bb6a', '#ffa726', '#ef5350', '#9e9e9e'],
      },
    ],
  };

  // (contoh opsi) Agar Pie dan Bar sama-sama mengisi kontainer:
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // nonaktifkan aspect ratio
    plugins: {
      legend: {
        position: 'bottom', // bisa 'top'|'bottom'|'left'|'right'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  // 3) Tren Laporan Harian (Line)
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

  // 4) Distribusi Pengguna (Bar) – berdasarkan role
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
        backgroundColor: ['#8e24aa', '#3949ab', '#d81b60', '#ffa726'],
      },
    ],
  };

  // 5) Arsip Laporan per Bulan (Bar)
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

  // 6) Laporan oleh Admin
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

  // 7) Top 5 Pelapor
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

  // 8) Trend Validasi Harian (Stacked Bar)
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
      {
        label: 'Unknown',
        data: trendDates.map(
          (date) =>
            sortedReports.filter(
              (r) =>
                new Date(r.createdAt).toLocaleDateString('id-ID') === date &&
                (r.validationStatus === 'unknown' ||
                  r.validationStatus === undefined)
            ).length
        ),
        backgroundColor: '#9e9e9e',
      },
    ],
  };

  // -- Summary Cards --
  const totalReports = reports.length;
  const totalArchives = archives.length;
  const totalUsers = users.length;
  const totalHoax = statusCounts['hoax'] || 0;

  return (
    <Box className={styles.dashboardContainer}>
      <Typography variant="h4" className={styles.dashboardTitle}>
        Owner Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} className={styles.summaryRow}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.summaryCard}>
            <CardContent>
              <Typography variant="subtitle2" className={styles.cardSubtitle}>
                Total Laporan
              </Typography>
              <Typography variant="h5" className={styles.cardValue}>
                {totalReports}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.summaryCard}>
            <CardContent>
              <Typography variant="subtitle2" className={styles.cardSubtitle}>
                Arsip Laporan
              </Typography>
              <Typography variant="h5" className={styles.cardValue}>
                {totalArchives}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.summaryCard}>
            <CardContent>
              <Typography variant="subtitle2" className={styles.cardSubtitle}>
                Total Pengguna
              </Typography>
              <Typography variant="h5" className={styles.cardValue}>
                {totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.summaryCard}>
            <CardContent>
              <Typography variant="subtitle2" className={styles.cardSubtitle}>
                Laporan Hoax
              </Typography>
              <Typography variant="h5" className={styles.cardValue}>
                {totalHoax}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} alignItems="stretch">
        {/* Bar vs Pie (distribusi vs status) */}
        <Grid item xs={12} md={6}>
          <Paper className={`${styles.chartPaper} ${styles.equalBox}`}>
            <Typography variant="h6" className={styles.chartTitle}>
              Distribusi Laporan per Bulan
            </Typography>
            <div className={styles.chartWrapper}>
              <Bar data={distributionData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={`${styles.chartPaper} ${styles.equalBox}`}>
            <Typography variant="h6" className={styles.chartTitle}>
              Status Validasi Laporan
            </Typography>
            <div className={styles.chartWrapper}>
              <Pie data={statusData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>

        {/* daily line vs user role bar */}
        <Grid item xs={12} md={6}>
          <Paper className={`${styles.chartPaper} ${styles.equalBox}`}>
            <Typography variant="h6" className={styles.chartTitle}>
              Tren Laporan Harian
            </Typography>
            <div className={styles.chartWrapper}>
              <Line data={dailyData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={`${styles.chartPaper} ${styles.equalBox}`}>
            <Typography variant="h6" className={styles.chartTitle}>
              Distribusi Pengguna (Role)
            </Typography>
            <div className={styles.chartWrapper}>
              <Bar data={userRoleData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>

        {/* archive vs adminReports */}
        <Grid item xs={12} md={6}>
          <Paper className={`${styles.chartPaper} ${styles.equalBox}`}>
            <Typography variant="h6" className={styles.chartTitle}>
              Arsip Laporan per Bulan
            </Typography>
            <div className={styles.chartWrapper}>
              <Bar data={archiveData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={`${styles.chartPaper} ${styles.equalBox}`}>
            <Typography variant="h6" className={styles.chartTitle}>
              Laporan oleh Admin
            </Typography>
            <div className={styles.chartWrapper}>
              <Bar data={adminReportData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>

        {/* topUser vs trendValidasi */}
        <Grid item xs={12} md={6}>
          <Paper className={`${styles.chartPaper} ${styles.equalBox}`}>
            <Typography variant="h6" className={styles.chartTitle}>
              Top 5 Pelapor
            </Typography>
            <div className={styles.chartWrapper}>
              <Bar data={topUserData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={`${styles.chartPaper} ${styles.equalBox}`}>
            <Typography variant="h6" className={styles.chartTitle}>
              Trend Validasi Harian (Stacked)
            </Typography>
            <div className={styles.chartWrapper}>
              <Bar
                data={trendData}
                options={{
                  ...chartOptions,
                  scales: { x: { stacked: true }, y: { stacked: true } },
                }}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnerDashboard;
