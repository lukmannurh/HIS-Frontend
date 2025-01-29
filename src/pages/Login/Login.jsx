import React, { useState, useContext } from 'react';

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import ikon mata
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk visibilitas password
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted'); // Logging untuk debugging
    setError('');
    setLoading(true);
    try {
      await login(form); // Pass the form object
      console.log('Login successful'); // Logging jika berhasil
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err); // Logging error
      // Periksa apakah error memiliki respon dari backend
      const message =
        err.response?.data?.message || 'Invalid username or password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}
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
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'} // Ubah tipe input berdasarkan state
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}{' '}
                    {/* Tampilkan ikon sesuai state */}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box mt={2} position="relative">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Login
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
