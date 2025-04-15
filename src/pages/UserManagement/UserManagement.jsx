import React, { useEffect, useState, useContext } from 'react';

import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Container,
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Box,
} from '@mui/material';

import CreateUser from './CreateUser';
import DeleteUserDialog from './DeleteUserDialog';
import EditUserRole from './EditUserRole';
import styles from './UserManagement.module.css';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const UserManagement = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      // Filter agar akun yang sedang login tidak muncul di tabel
      const filteredUsers = response.data.filter(
        (user) => user.id !== auth.user.id
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleCreateNew = () => {
    setShowCreate(true);
  };

  const handleCloseCreate = () => {
    setShowCreate(false);
    fetchUsers();
  };

  const handleEditRole = (user) => {
    setEditingUser(user);
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
    fetchUsers();
  };

  const handleDeleteUser = (user) => {
    setDeletingUser(user);
  };

  const handleCloseDelete = () => {
    setDeletingUser(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/users/${deletingUser.id}`);
      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <Container className={styles.container}>
      {/* Page Header */}
      <Box className={styles.pageHeader}>
        <Typography variant="h3" className={styles.pageTitle}>
          User Management
        </Typography>
        <Typography variant="subtitle1" className={styles.pageSubtitle}>
          Kelola akun pengguna pada sistem. Buat, edit, dan hapus user sesuai
          kebutuhan.
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateNew}
        className={styles.createButton}
      >
        Create New User
      </Button>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow className={styles.tableHeaderRow}>
              <TableCell className={styles.tableHeader}>Username</TableCell>
              <TableCell className={styles.tableHeader}>Full Name</TableCell>
              <TableCell className={styles.tableHeader}>Email</TableCell>
              <TableCell className={styles.tableHeader}>Role</TableCell>
              <TableCell className={styles.tableHeader} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className={styles.tableBodyRow}>
                <TableCell className={styles.tableCell}>
                  {user.username}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  {user.fullName || '-'}
                </TableCell>
                <TableCell className={styles.tableCell}>{user.email}</TableCell>
                <TableCell className={styles.tableCell}>{user.role}</TableCell>
                <TableCell align="center" className={styles.tableCell}>
                  <IconButton
                    onClick={() => handleEditRole(user)}
                    color="primary"
                    size="small"
                    className={styles.iconButton}
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteUser(user)}
                    color="error"
                    size="small"
                    className={styles.iconButton}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showCreate && (
        <CreateUser open={showCreate} onClose={handleCloseCreate} />
      )}
      {editingUser && (
        <EditUserRole
          open={Boolean(editingUser)}
          user={editingUser}
          onClose={handleCloseEdit}
        />
      )}
      {deletingUser && (
        <DeleteUserDialog
          open={Boolean(deletingUser)}
          user={deletingUser}
          onClose={handleCloseDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </Container>
  );
};

export default UserManagement;
