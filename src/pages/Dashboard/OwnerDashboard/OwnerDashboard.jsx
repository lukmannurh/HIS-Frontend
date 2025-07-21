/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

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

import styles from './OwnerDashboard.module.css';
import api from '../../../services/api';

export default function OwnerDashboard() {
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

    // Fetch reports with error handling
    try {
      const rRes = await api.get('/reports');
      setReports(rRes.data);
    } catch (err) {
      setError(
        err.response?.status === 403
          ? 'Anda tidak memiliki akses untuk melihat data laporan.'
          : err.response?.data?.message || 'Gagal memuat laporan.'
      );
      setLoading(false);
      return;
    }

    // Fetch users
    try {
      const uRes = await api.get('/users');
      setUsers(uRes.data);
    } catch (err) {
      setError(
        err.response?.status === 403
          ? 'Anda tidak memiliki akses untuk melihat data pengguna.'
          : err.response?.data?.message || 'Gagal memuat pengguna.'
      );
      setLoading(false);
      return;
    }

    // Fetch archives
    try {
      const aRes = await api.get('/archives');
      setArchives(aRes.data);
    } catch (err) {
      setError(
        err.response?.status === 403
          ? 'Anda tidak memiliki akses untuk melihat data arsip.'
          : err.response?.data?.message || 'Gagal memuat arsip.'
      );
      setLoading(false);
      return;
    }

    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Summary metrics for Admin role only
  const totalReports = reports.length;
  const totalArchives = archives.length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalHoax = reports.filter((r) => r.validationStatus === 'hoax').length;
  const totalValid = reports.filter(
    (r) => r.validationStatus === 'valid'
  ).length;
  const totalDoubtful = reports.filter(
    (r) => r.validationStatus === 'diragukan'
  ).length;

  // Helper: unique months
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

  // Chart datasets
  const months = getMonths(reports, 'createdAt');

  const barReports = {
    labels: months,
    datasets: [
      {
        label: 'Jumlah Laporan',
        data: months.map(
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
    labels: months,
    datasets: [
      {
        label: 'Tren Laporan',
        data: months.map(
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
        borderColor: '#1976d2',
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
        label: 'Arsip per Bulan',
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

  const barAdmins = {
    labels: ['Admin'],
    datasets: [
      {
        label: 'Jumlah Admin',
        data: [totalAdmins],
        backgroundColor: '#1976d2',
      },
    ],
  };

  const scatterAdmins = {
    datasets: [
      {
        label: 'Sebaran Admin (RT vs RW)',
        data: users
          .filter((u) => u.role === 'admin' && !isNaN(u.rt) && !isNaN(u.rw))
          .map((u) => ({ x: Number(u.rt), y: Number(u.rw) })),
        backgroundColor: '#ef5350',
      },
    ],
  };

  // Common chart options
  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: '' },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: activeChart === 'scatter' ? 'RT' : 'Bulan',
        },
        ticks: { precision: 0 },
      },
      y: {
        title: {
          display: true,
          text: activeChart === 'scatter' ? 'RW' : 'Jumlah',
        },
        ticks: { precision: 0 },
      },
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
          Owner Dashboard
        </Typography>
        <Button
          className={styles.refreshButton}
          startIcon={<RefreshIcon />}
          onClick={fetchData}
        >
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
          { key: 'admins', label: 'Admin', value: totalAdmins },
          { key: 'scatter', label: 'Sebaran Admin', value: totalAdmins },
        ].map((card) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={card.key}>
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
              ...baseOpts,
              plugins: {
                ...baseOpts.plugins,
                title: { display: true, text: 'Distribusi Laporan per Bulan' },
              },
            }}
          />
        )}
        {activeChart === 'line' && (
          <Line
            data={lineReports}
            options={{
              ...baseOpts,
              plugins: {
                ...baseOpts.plugins,
                title: { display: true, text: 'Tren Laporan' },
              },
            }}
          />
        )}
        {activeChart === 'pie' && (
          <Pie
            data={pieValidation}
            options={{
              ...baseOpts,
              plugins: {
                ...baseOpts.plugins,
                title: { display: true, text: 'Status Validasi Laporan' },
              },
            }}
          />
        )}
        {activeChart === 'doughnut' && (
          <Doughnut
            data={doughnutArchives}
            options={{
              ...baseOpts,
              plugins: {
                ...baseOpts.plugins,
                title: { display: true, text: 'Arsip Laporan per Bulan' },
              },
            }}
          />
        )}
        {activeChart === 'admins' && (
          <Bar
            data={barAdmins}
            options={{
              ...baseOpts,
              plugins: {
                ...baseOpts.plugins,
                title: { display: true, text: 'Jumlah Admin' },
              },
            }}
          />
        )}
        {activeChart === 'scatter' && (
          <Scatter
            data={scatterAdmins}
            options={{
              ...baseOpts,
              plugins: {
                ...baseOpts.plugins,
                title: {
                  display: true,
                  text: 'Sebaran Admin berdasarkan RT dan RW',
                },
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}
