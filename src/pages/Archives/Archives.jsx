import React, { useEffect, useState, useContext } from 'react';

import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import {
  Container,
  Paper,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import ArchiveDetailModal from './ArchiveDetailModal';
import styles from './Archives.module.css';
import DeleteArchiveDialog from './DeleteArchiveDialog';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const Archives = () => {
  const { auth } = useContext(AuthContext);
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    fetchArchives();
    // eslint-disable-next-line
  }, []);

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const res = await api.get('/archives');
      setArchives(res.data);
    } catch {
      setError('Gagal mengambil data arsip.');
    } finally {
      setLoading(false);
    }
  };

  const ArchivesHeader = () => (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#e8f5e9',
        p: 2,
        borderRadius: 2,
        mb: 4,
      }}
    >
      <DescriptionIcon sx={{ color: '#2e7d32', fontSize: 32 }} />
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
          Archives
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Telusuri, lihat detail, unduh, atau hapus arsip dengan mudah.
        </Typography>
      </Box>
    </Paper>
  );

  // Hanya Owner/Admin
  if (auth.user && !['owner', 'admin'].includes(auth.user.role)) {
    return (
      <Container maxWidth="lg" className={styles.archivesContainer}>
        <Typography variant="h6" color="error" align="center">
          Akses ditolak: hanya Owner/Admin yang dapat melihat arsip.
        </Typography>
      </Container>
    );
  }

  // Group by "Mon YYYY"
  const grouped = archives.reduce((acc, arc) => {
    const key = new Date(arc.archivedAt).toLocaleString('id-ID', {
      month: 'long',
      year: 'numeric',
    });
    acc[key] = acc[key] || [];
    acc[key].push(arc);
    return acc;
  }, {});
  const months = Object.keys(grouped).sort((a, b) => {
    const da = new Date(a),
      db = new Date(b);
    return db - da;
  });

  return (
    <Container maxWidth="lg" className={styles.archivesContainer}>
      <ArchivesHeader />

      {loading ? (
        <Box className={styles.loader}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : archives.length === 0 ? (
        <Typography align="center">Belum ada arsip.</Typography>
      ) : (
        months.map((month) => (
          <Box key={month} className={styles.groupContainer}>
            <Typography variant="h6" className={styles.groupHeader}>
              {month}
            </Typography>
            <Box className={styles.cardsGrid}>
              {grouped[month].map((arc) => (
                <Paper
                  key={arc.id}
                  elevation={2}
                  className={styles.archiveCard}
                >
                  <Box className={styles.cardContent}>
                    <DescriptionIcon
                      className={styles.archiveIcon}
                      fontSize="large"
                    />
                    <Typography className={styles.archiveTitle}>
                      {arc.title}
                    </Typography>
                    <Typography className={styles.archiveDate}>
                      {new Date(arc.archivedAt).toLocaleDateString('id-ID')}
                    </Typography>
                  </Box>
                  <Box className={styles.cardActions}>
                    <IconButton
                      onClick={() => setSelected(arc)}
                      className={styles.viewBtn}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setToDelete(arc)}
                      className={styles.deleteBtn}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        ))
      )}

      {/* Modals */}
      {selected && (
        <ArchiveDetailModal
          open
          archive={selected}
          onClose={() => setSelected(null)}
        />
      )}
      {toDelete && (
        <DeleteArchiveDialog
          open
          archive={toDelete}
          onClose={() => setToDelete(null)}
          onConfirm={async () => {
            await api.delete(`/archives/${toDelete.id}`);
            setToDelete(null);
            fetchArchives();
          }}
        />
      )}
    </Container>
  );
};

export default Archives;
