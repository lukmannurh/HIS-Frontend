import React, { useState } from 'react';

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import useAxios from '../../services/api';

const CreateReport = () => {
  const axios = useAxios();
  const navigate = useNavigate();

  // Jika backend menggunakan field "title" dan "content", gunakan nama tersebut.
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/reports', form);
      setSuccess('Report created successfully!');
      navigate('/reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create report');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Create New Report
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Content"
            name="content"
            value={form.content}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Report
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CreateReport;
