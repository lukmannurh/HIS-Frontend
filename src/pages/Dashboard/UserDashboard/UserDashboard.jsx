import React, { useEffect, useState } from 'react';

import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './UserDashboard.module.css';
import api from '../../../services/api';

export default function UserDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/reports') // backend hanya mengembalikan laporan milik user
      .then((res) => setReports(res.data))
      .catch(() => setError('Gagal memuat laporan Anda'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Container maxWidth="md" className={styles.container}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <Container maxWidth="md" className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Laporan Saya
      </Typography>

      {reports.length === 0 ? (
        <Typography variant="body1">
          Anda belum membuat laporan apa pun.
        </Typography>
      ) : (
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Judul</TableCell>
                <TableCell>Tanggal Dibuat</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Validasi</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{formatDate(r.createdAt)}</TableCell>
                  <TableCell className={styles.statusCell}>
                    {r.reportStatus === 'selesai' ? (
                      <Box className={styles.badgeDone}>Selesai</Box>
                    ) : (
                      <Box className={styles.badgeProcess}>Diproses</Box>
                    )}
                  </TableCell>
                  <TableCell className={styles.validationCell}>
                    {r.validationStatus === 'valid' ? (
                      <Box className={styles.badgeValid}>Valid</Box>
                    ) : r.validationStatus === 'hoax' ? (
                      <Box className={styles.badgeHoax}>Hoax</Box>
                    ) : (
                      <Box className={styles.badgeDoubtful}>Diragukan</Box>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/reports/${r.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
