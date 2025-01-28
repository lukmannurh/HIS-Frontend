import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import api from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Gagal mengambil data pengguna.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await api.delete(`/users/${userId}`);
        setSuccess('Pengguna berhasil dihapus.');
        fetchUsers();
      } catch (err) {
        setError('Gagal menghapus pengguna.');
      }
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setNewUser({
      username: '',
      email: '',
      password: '',
      role: 'user',
    });
    setOpenDialog(false);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    const { username, email, password, role } = newUser;
    if (!username || !email || !password || !role) {
      setError('Semua field wajib diisi.');
      return;
    }
    try {
      await api.post('/auth/register', { username, email, password, role });
      setSuccess('Pengguna baru berhasil didaftarkan.');
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mendaftarkan pengguna.');
    }
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Manajemen Pengguna
        </Typography>
        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}
        <Box mb={2}>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Tambah Pengguna
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="user table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Nama Lengkap</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.fullName || '-'}</TableCell>
                  <TableCell>
                    {/* Tambahkan aksi lain seperti edit jika diperlukan */}
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(user.id)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Tidak ada pengguna ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Dialog untuk Menambah Pengguna */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Tambah Pengguna Baru</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            name="username"
            type="text"
            fullWidth
            variant="standard"
            value={newUser.username}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            fullWidth
            variant="standard"
            value={newUser.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            fullWidth
            variant="standard"
            value={newUser.password}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense" variant="standard">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={newUser.role}
              onChange={handleChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="owner">Owner</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleRegister} variant="contained" color="primary">Daftar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
