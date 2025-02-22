import React, { useEffect, useState } from 'react';

import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

const Archives = () => {
  const navigate = useNavigate();
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await api.get('/archives');
        setArchives(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal mengambil arsip');
      } finally {
        setLoading(false);
      }
    };
    fetchArchives();
  }, []);

  if (loading) {
    return (
      <Box mt={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Container>
        <Box mt={5}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }
  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Archived Reports
        </Typography>
        {archives.length === 0 ? (
          <Typography variant="body1">No archived reports found.</Typography>
        ) : (
          <List>
            {archives.map((archive) => (
              <ListItem
                key={archive.id}
                button
                onClick={() => navigate(`/archives/${archive.id}`)}
              >
                <ListItemText
                  primary={archive.title}
                  secondary={`Archived at: ${new Date(archive.archivedAt).toLocaleString('id-ID')} WIB`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default Archives;
