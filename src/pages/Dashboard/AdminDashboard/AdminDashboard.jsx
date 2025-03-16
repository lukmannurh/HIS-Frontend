import React, { useEffect, useState } from 'react';

import 'chart.js/auto';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { Bar, Pie, Line } from 'react-chartjs-2';

import styles from './AdminDashboard.module.css';
import api from '../../../services/api';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [archives, setArchives] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil semua laporan
        const reportsResponse = await api.get('/reports');
        // Admin: filter laporan milik user role="user" + laporan milik admin sendiri
        const filteredReports = reportsResponse.data.filter(
          (r) => r.user.role === 'user' || r.user.id === currentUser.id
        );
        setReports(filteredReports);

        // Ambil semua user, tapi admin cuma mau lihat user role="user"
        const usersResponse = await api.get('/users');
        const filteredUsers = usersResponse.data.filter(
          (u) => u.role === 'user'
        );
        setUsers(filteredUsers);

        // Ambil arsip
        const archivesResponse = await api.get('/archives');
        // (opsional) filter archives jika ingin.
        // Di contoh ini, admin bisa melihat semua atau filter sesuai kebijakan:
        setArchives(archivesResponse.data);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      }
    };
    fetchData();
  }, [currentUser.id]);

  // --- Ringkasan data untuk summary cards ---
  const totalReports = reports.length;
  const totalArchives = archives.length;
  const totalUsers = users.length;

  // Contoh: hitung total hoax
  const statusCounts = reports.reduce((acc, r) => {
    acc[r.validationStatus] = (acc[r.validationStatus] || 0) + 1;
    return acc;
  }, {});
  const totalHoax = statusCounts['hoax'] || 0;

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

  // Opsi chart global (Pie & Bar) => agar aspect ratio off
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { mode: 'index', intersect: false },
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
        borderColor: '#42a5f5',
        fill: false,
      },
    ],
  };

  // 4) Manajemen Pengguna: jumlah laporan per user
  const userData = {
    labels: users.map((u) => u.username),
    datasets: [
      {
        label: 'Jumlah Laporan per User',
        data: users.map(
          (u) => reports.filter((r) => r.user.id === u.id).length
        ),
        backgroundColor: '#ab47bc',
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

  // 6) Laporan oleh Admin (khusus admin => filter)
  // Di admin code, kita punya laporan "milik admin" =>
  // (r.user.role === 'admin' => tapi di filterReports, admin pun mungkin jarang,
  //  opsional: jika mau menampilkan data)
  const adminOnlyReports = reports.filter((r) => r.user.role === 'admin');
  const adminReportData = {
    labels: ['Laporan oleh Admin (Self)'],
    datasets: [
      {
        label: 'Jumlah Laporan Admin',
        data: [adminOnlyReports.length],
        backgroundColor: '#5c6bc0',
      },
    ],
  };

  // 7) Top 5 Pelapor
  // Hanya user yang ditampilkan => so top 5 user by count
  const userReportCounts = users
    .map((u) => ({
      username: u.username,
      count: reports.filter((r) => r.user.id === u.id).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topUserData = {
    labels: userReportCounts.map((u) => u.username),
    datasets: [
      {
        label: 'Top 5 Pelapor (User)',
        data: userReportCounts.map((u) => u.count),
        backgroundColor: '#26a69a',
      },
    ],
  };

  // 8) Trend Validasi Harian (Stacked Bar)
  const dateSet = [
    ...new Set(
      sortedReports.map((r) =>
        new Date(r.createdAt).toLocaleDateString('id-ID')
      )
    ),
  ];
  const trendData = {
    labels: dateSet,
    datasets: [
      {
        label: 'Valid',
        data: dateSet.map(
          (d) =>
            sortedReports.filter(
              (r) =>
                new Date(r.createdAt).toLocaleDateString('id-ID') === d &&
                r.validationStatus === 'valid'
            ).length
        ),
        backgroundColor: '#66bb6a',
      },
      {
        label: 'Hoax',
        data: dateSet.map(
          (d) =>
            sortedReports.filter(
              (r) =>
                new Date(r.createdAt).toLocaleDateString('id-ID') === d &&
                r.validationStatus === 'hoax'
            ).length
        ),
        backgroundColor: '#ef5350',
      },
      {
        label: 'Diragukan',
        data: dateSet.map(
          (d) =>
            sortedReports.filter(
              (r) =>
                new Date(r.createdAt).toLocaleDateString('id-ID') === d &&
                r.validationStatus === 'diragukan'
            ).length
        ),
        backgroundColor: '#ffa726',
      },
      {
        label: 'Unknown',
        data: dateSet.map(
          (d) =>
            sortedReports.filter(
              (r) =>
                new Date(r.createdAt).toLocaleDateString('id-ID') === d &&
                (r.validationStatus === 'unknown' ||
                  r.validationStatus === undefined)
            ).length
        ),
        backgroundColor: '#9e9e9e',
      },
    ],
  };

  return (
    <Box className={styles.dashboardContainer}>
      <Typography variant="h4" className={styles.dashboardTitle}>
        Admin Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} className={styles.summaryRow}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.summaryCard}>
            <CardContent>
              <Typography variant="subtitle2" className={styles.cardSubtitle}>
                Total Laporan (Filtered)
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
                Pengguna (role=user)
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
        {/* 1 vs 2 */}
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

        {/* 3 vs 4 */}
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
              Laporan per Pengguna
            </Typography>
            <div className={styles.chartWrapper}>
              <Bar data={userData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>

        {/* 5 vs 6 */}
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
              Laporan oleh Admin (Self)
            </Typography>
            <div className={styles.chartWrapper}>
              <Bar data={adminReportData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>

        {/* 7 vs 8 */}
        <Grid item xs={12} md={6}>
          <Paper className={`${styles.chartPaper} ${styles.equalBox}`}>
            <Typography variant="h6" className={styles.chartTitle}>
              Top 5 Pelapor (User)
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

export default AdminDashboard;
