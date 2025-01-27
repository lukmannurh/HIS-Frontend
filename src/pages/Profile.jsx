import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import useAxios from '../services/api';
import { Container, Typography, Box, TextField, Button, Alert, CircularProgress } from '@mui/material';

const Profile = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const axios = useAxios();
  const [form, setForm] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/users/profile');
      setForm({ username: response.data.username, email: response.data.email });
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.put('/users/profile', form);
      setSuccess('Profile updated successfully!');
      // Update auth context if needed
      setAuth({ ...auth, user: response.data.user });
      localStorage.setItem('auth', JSON.stringify({ ...auth, user: response.data.user }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Box mt={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          {/* Tambahkan field lain jika diperlukan */}
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update Profile
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Profile;
