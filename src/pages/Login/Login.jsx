import React, { useState, useContext } from 'react';

import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Avatar,
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

  // Handle perubahan input
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit form login
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
      <Card className={styles.loginCard}>
        <Grid container className={styles.gridContainer}>
          {/* Bagian kiri: form login */}
          <Grid item xs={12} md={6} className={styles.leftSide}>
            <CardContent className={styles.cardContent}>
              <Avatar className={styles.avatarIcon}>
                <PersonOutlineIcon fontSize="large" />
              </Avatar>

              <Typography
                variant="h5"
                className={styles.loginTitle}
                gutterBottom
              >
                LOGIN
              </Typography>

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

                <div className={styles.formButtonContainer}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    className={styles.loginButton}
                  >
                    <LoginIcon className={styles.loginButtonIcon} />
                    <span className={styles.loginButtonText}>Login</span>
                  </Button>

                  {loading && (
                    <CircularProgress
                      className={styles.loadingIndicator}
                      size={24}
                    />
                  )}
                </div>
              </form>
            </CardContent>
          </Grid>

          {/* Bagian kanan: gambar ilustrasi */}
          <Grid item xs={12} md={6} className={styles.rightSide}>
            <img
              src={require('../../assets/images/loginPage.gif')}
              alt="Login Illustration"
              className={styles.loginImage}
            />
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default Login;
