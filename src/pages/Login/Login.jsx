import React, { useState, useContext } from 'react';

import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import styles from './Login.module.css';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Username atau password salah';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.loginPage}>
      <Box className={styles.formContainer}>
        <Typography variant="h4" className={styles.formTitle}>
          Login
        </Typography>
        {/* Bisa tambahkan sub-teks ringkas
        <Typography variant="body1" className={styles.formSubtitle}>
          Silakan masukkan username dan password Anda 
        </Typography> */}

        {error && (
          <Alert
            severity="error"
            onClose={() => setError('')}
            className={styles.errorAlert}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            required
            className={styles.inputField}
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            className={styles.inputField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ position: 'relative', marginTop: '1.5rem' }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              className={styles.loginButton}
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
                  mt: '-12px',
                  ml: '-12px',
                }}
              />
            )}
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
