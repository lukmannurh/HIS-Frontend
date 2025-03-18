import React, { useEffect, useState, useContext } from 'react';

import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Box,
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
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [deleteArchive, setDeleteArchive] = useState(null);

  useEffect(() => {
    fetchArchives();
    // eslint-disable-next-line
  }, []);

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const res = await api.get('/archives');
      setArchives(res.data);
    } catch (err) {
      setError('Gagal mengambil data archives');
    } finally {
      setLoading(false);
    }
  };

  // Pastikan hook sudah dipanggil, baru cek role
  if (auth.user && auth.user.role !== 'owner' && auth.user.role !== 'admin') {
    return (
      <Container className={styles.archivesContainer}>
        <Typography variant="h6" color="error" align="center">
          Akses ditolak: Fitur archives hanya tersedia untuk Owner dan Admin.
        </Typography>
      </Container>
    );
  }

  // Kelompokkan archives berdasarkan bulan dan tahun (contoh: "Des 2023")
  const groupedArchives = archives.reduce((groups, archive) => {
    const date = new Date(archive.archivedAt);
    const groupKey = date.toLocaleString('id-ID', {
      month: 'short',
      year: 'numeric',
    });
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(archive);
    return groups;
  }, {});

  const groupKeys = Object.keys(groupedArchives).sort((a, b) => {
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    const dateA = new Date(
      yearA,
      new Date(Date.parse(`${monthA} 1, ${yearA}`)).getMonth()
    );
    const dateB = new Date(
      yearB,
      new Date(Date.parse(`${monthB} 1, ${yearB}`)).getMonth()
    );
    return dateB - dateA;
  });

  const handleView = (archive) => {
    setSelectedArchive(archive);
  };

  const handleDelete = (archive) => {
    setDeleteArchive(archive);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/archives/${deleteArchive.id}`);
      setDeleteArchive(null);
      fetchArchives();
    } catch (err) {
      alert('Gagal menghapus archive');
    }
  };

  return (
    <Container className={styles.archivesContainer}>
      <Typography
        variant="h4"
        className={styles.pageTitle}
        align="center"
        gutterBottom
      >
        Archives
      </Typography>
      {loading ? (
        <Box className={styles.loader}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : archives.length === 0 ? (
        <Typography align="center">Tidak ada archive</Typography>
      ) : (
        groupKeys.map((group) => (
          <Box key={group} className={styles.groupContainer}>
            <Typography variant="h6" className={styles.groupHeader}>
              {group}
            </Typography>
            <Grid container spacing={2}>
              {groupedArchives[group].map((archive) => (
                <Grid item xs={12} sm={6} md={4} key={archive.id}>
                  <Card className={styles.archiveCard}>
                    <CardContent className={styles.archiveCardContent}>
                      <Box className={styles.fileIcon}>
                        <DescriptionIcon fontSize="large" />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        className={styles.archiveTitle}
                      >
                        {archive.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={styles.archiveDate}
                      >
                        {new Date(archive.archivedAt).toLocaleDateString(
                          'id-ID'
                        )}
                      </Typography>
                    </CardContent>
                    <CardActions className={styles.cardActions}>
                      <Button
                        size="small"
                        onClick={() => handleView(archive)}
                        className={styles.actionButton}
                        startIcon={<VisibilityIcon />}
                      >
                        Lihat
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(archive)}
                        className={styles.actionButton}
                        startIcon={<DeleteIcon />}
                      >
                        Hapus
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}

      {selectedArchive && (
        <ArchiveDetailModal
          open={Boolean(selectedArchive)}
          archive={selectedArchive}
          onClose={() => setSelectedArchive(null)}
        />
      )}

      {deleteArchive && (
        <DeleteArchiveDialog
          open={Boolean(deleteArchive)}
          archive={deleteArchive}
          onClose={() => setDeleteArchive(null)}
          onConfirm={confirmDelete}
        />
      )}
    </Container>
  );
};

export default Archives;
