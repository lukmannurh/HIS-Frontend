/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';

import 'chart.js/auto';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Bar, Line, Pie, Doughnut, Scatter } from 'react-chartjs-2';

import styles from './AdminDashboard.module.css';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../services/api';

export default function AdminDashboard() {
  const { auth } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeChart, setActiveChart] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [rRes, uRes, aRes] = await Promise.all([
        api.get('/reports'),
        api.get('/users'),
        api.get('/archives'),
      ]);
      setReports(
        rRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
      setUsers(uRes.data);
      setArchives(aRes.data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
      setError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // summary metrics
  const totalReports = reports.length;
  const totalArchives = archives.length;
  const totalUsers = users.filter((u) => u.role === 'user').length;
  const totalHoax = reports.filter((r) => r.validationStatus === 'hoax').length;
  const totalValid = reports.filter(
    (r) => r.validationStatus === 'valid'
  ).length;
  const totalDoubtful = reports.filter(
    (r) => r.validationStatus === 'diragukan'
  ).length;

  // helper for unique months
  const getMonths = (items, key) => [
    ...new Set(
      items.map((i) =>
        new Date(i[key]).toLocaleString('id-ID', {
          month: 'short',
          year: 'numeric',
        })
      )
    ),
  ];

  // chart datasets
  const monthsReports = getMonths(reports, 'createdAt');
  const barReports = {
    labels: monthsReports,
    datasets: [
      {
        label: 'Jumlah Laporan',
        data: monthsReports.map(
          (m) =>
            reports.filter(
              (r) =>
                new Date(r.createdAt).toLocaleString('id-ID', {
                  month: 'short',
                  year: 'numeric',
                }) === m
            ).length
        ),
        backgroundColor: '#42a5f5',
      },
    ],
  };
  const lineReports = {
    labels: monthsReports,
    datasets: [
      {
        label: 'Tren Laporan',
        data: monthsReports.map(
          (m) =>
            reports.filter(
              (r) =>
                new Date(r.createdAt).toLocaleString('id-ID', {
                  month: 'short',
                  year: 'numeric',
                }) === m
            ).length
        ),
        fill: false,
        tension: 0.3,
      },
    ],
  };
  const pieValidation = {
    labels: ['Valid', 'Diragukan', 'Hoax', 'Unknown'],
    datasets: [
      {
        data: [
          totalValid,
          totalDoubtful,
          totalHoax,
          totalReports - (totalValid + totalDoubtful + totalHoax),
        ],
        backgroundColor: ['#66bb6a', '#ffa726', '#ef5350', '#9e9e9e'],
      },
    ],
  };
  const doughnutArchives = {
    labels: getMonths(archives, 'archivedAt'),
    datasets: [
      {
        label: 'Arsip/Bulan',
        data: getMonths(archives, 'archivedAt').map(
          (m) =>
            archives.filter(
              (a) =>
                new Date(a.archivedAt).toLocaleString('id-ID', {
                  month: 'short',
                  year: 'numeric',
                }) === m
            ).length
        ),
        backgroundColor: [
          '#42a5f5',
          '#7e57c2',
          '#26a69a',
          '#ffa726',
          '#ef5350',
        ],
      },
    ],
  };
  const barUsers = {
    labels: ['User'],
    datasets: [
      {
        label: 'Jumlah Pengguna',
        data: [totalUsers],
        backgroundColor: ['#42a5f5'],
      },
    ],
  };
  const scatterUsers = {
    datasets: [
      {
        label: 'Sebaran Pengguna (RT vs RW)',
        data: users
          .filter((u) => u.role === 'user' && !isNaN(u.rt) && !isNaN(u.rw))
          .map((u) => ({ x: Number(u.rt), y: Number(u.rw) })),
        backgroundColor: '#ef5350',
      },
    ],
  };

  // common chart options
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: '' },
    },
    scales: {
      x: { title: { display: true, text: 'RT' }, ticks: { precision: 0 } },
      y: { title: { display: true, text: 'RW' }, ticks: { precision: 0 } },
    },
  };

  if (loading)
    return (
      <Box className={styles.loading}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box className={styles.container}>
      <Box className={styles.topBar}>
        <Typography variant="h4" className={styles.title}>
          Admin Dashboard
        </Typography>
        <Button startIcon={<RefreshIcon />} onClick={fetchData}>
          Refresh
        </Button>
      </Box>
      {lastUpdated && (
        <Typography variant="caption" className={styles.lastUpdated}>
          Terakhir diperbarui:{' '}
          {new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'short',
            timeStyle: 'medium',
          }).format(lastUpdated)}
        </Typography>
      )}

      <Grid container spacing={2} className={styles.summary}>
        {[
          { key: 'bar', label: 'Laporan/Bulan', value: totalReports },
          { key: 'line', label: 'Tren Laporan', value: totalReports },
          { key: 'pie', label: 'Validasi', value: totalReports },
          { key: 'doughnut', label: 'Arsip Laporan', value: totalArchives },
          { key: 'users', label: 'Pengguna', value: totalUsers },
          { key: 'scatter', label: 'Sebaran Pengguna', value: totalUsers },
        ].map((card) => (
          <Grid item xs={6} md={4} lg={2} key={card.key}>
            <Card
              className={`${styles.card} ${activeChart === card.key ? styles.cardActive : ''}`}
              onClick={() =>
                setActiveChart(activeChart === card.key ? '' : card.key)
              }
            >
              <CardContent>
                <Typography variant="subtitle2">{card.label}</Typography>
                <Typography variant="h5">{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box className={styles.detailBox}>
        {activeChart === 'bar' && (
          <Bar
            data={barReports}
            options={{
              ...baseOptions,
              plugins: {
                ...baseOptions.plugins,
                title: { display: true, text: 'Distribusi Laporan per Bulan' },
              },
            }}
          />
        )}
        {activeChart === 'line' && (
          <Line
            data={lineReports}
            options={{
              ...baseOptions,
              plugins: {
                ...baseOptions.plugins,
                title: { display: true, text: 'Tren Laporan' },
              },
            }}
          />
        )}
        {activeChart === 'pie' && (
          <Pie
            data={pieValidation}
            options={{
              ...baseOptions,
              plugins: {
                ...baseOptions.plugins,
                title: { display: true, text: 'Status Validasi Laporan' },
              },
            }}
          />
        )}
        {activeChart === 'doughnut' && (
          <Doughnut
            data={doughnutArchives}
            options={{
              ...baseOptions,
              plugins: {
                ...baseOptions.plugins,
                title: { display: true, text: 'Arsip Laporan per Bulan' },
              },
            }}
          />
        )}
        {activeChart === 'users' && (
          <Bar
            data={barUsers}
            options={{
              ...baseOptions,
              plugins: {
                ...baseOptions.plugins,
                title: { display: true, text: 'Jumlah Pengguna (Role: User)' },
              },
            }}
          />
        )}
        {activeChart === 'scatter' && (
          <Scatter
            data={scatterUsers}
            options={{
              ...baseOptions,
              plugins: {
                ...baseOptions.plugins,
                title: {
                  display: true,
                  text: 'Sebaran Pengguna berdasarkan RT dan RW',
                },
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}
