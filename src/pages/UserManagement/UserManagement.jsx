import React, { useEffect, useState, useContext } from 'react';

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
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

// Inline header component with your new wording
const UserManagementHeader = () => (
  <Paper
    elevation={0}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      backgroundColor: '#e8f5e9',
      p: 2,
      borderRadius: 2,
      mb: 3,
    }}
  >
    <GroupIcon sx={{ color: '#88c273', fontSize: 32 }} />
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
        User Management
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Tambah pengguna baru, atur peran, atau hapus akun yang tidak aktif.
      </Typography>
    </Box>
  </Paper>
);

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
      const filtered = response.data.filter((u) => u.id !== auth.user.id);
      setUsers(filtered);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  // dialog handlers ...
  const handleCreateNew = () => setShowCreate(true);
  const handleCloseCreate = () => {
    setShowCreate(false);
    fetchUsers();
  };
  const handleEditRole = (user) => setEditingUser(user);
  const handleCloseEdit = () => {
    setEditingUser(null);
    fetchUsers();
  };
  const handleDeleteUser = (user) => setDeletingUser(user);
  const handleCloseDelete = () => setDeletingUser(null);
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/users/${deletingUser.id}`);
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <Container className={styles.container}>
      <UserManagementHeader />

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
            <TableRow>
              <TableCell className={`${styles.th} ${styles.colUsername}`}>
                Username
              </TableCell>
              <TableCell className={`${styles.th} ${styles.colFullName}`}>
                Full Name
              </TableCell>
              <TableCell className={`${styles.th} ${styles.colEmail}`}>
                Email
              </TableCell>
              <TableCell className={`${styles.th} ${styles.colRole}`}>
                Role
              </TableCell>
              <TableCell
                className={`${styles.th} ${styles.colActions}`}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user, idx) => (
              <TableRow
                key={user.id}
                className={idx % 2 === 0 ? styles.oddRow : ''}
              >
                <TableCell className={styles.td}>{user.username}</TableCell>
                <TableCell className={styles.td}>
                  {user.fullName || '-'}
                </TableCell>
                <TableCell className={styles.td}>{user.email}</TableCell>
                <TableCell className={styles.td}>{user.role}</TableCell>
                <TableCell
                  align="center"
                  className={`${styles.td} ${styles.actionsCell}`}
                >
                  <Box className={styles.actionsGroup}>
                    <IconButton
                      onClick={() => handleEditRole(user)}
                      size="small"
                      className={`${styles.iconButton} ${styles.edit}`}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteUser(user)}
                      size="small"
                      className={`${styles.iconButton} ${styles.delete}`}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showCreate && <CreateUser open onClose={handleCloseCreate} />}
      {editingUser && (
        <EditUserRole open user={editingUser} onClose={handleCloseEdit} />
      )}
      {deletingUser && (
        <DeleteUserDialog
          open
          user={deletingUser}
          onClose={handleCloseDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </Container>
  );
};

export default UserManagement;
