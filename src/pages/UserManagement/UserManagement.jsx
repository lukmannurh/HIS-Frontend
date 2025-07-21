import React, { useEffect, useState, useContext, useMemo } from 'react';

import { ArrowDropDown } from '@mui/icons-material';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Pagination,
  Typography,
} from '@mui/material';

import CreateUser from './CreateUser';
import DeleteUserDialog from './DeleteUserDialog';
import styles from './UserManagement.module.css';
import UsersTable from './UsersTable';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const UserManagement = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  // Search & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' = A–Z, 'desc' = Z–A

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Sort menu anchor
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleSortClick = (e) => setAnchorEl(e.currentTarget);
  const handleSortClose = () => setAnchorEl(null);
  const handleSortSelect = (dir) => {
    setSortDirection(dir);
    handleSortClose();
  };

  // Fetch users (exclude current user)
  const fetchUsers = () => {
    setLoading(true);
    api
      .get('/users')
      .then((res) => {
        setUsers(res.data.filter((u) => u.id !== auth.user.id));
        setError('');
      })
      .catch(() => setError('Gagal memuat data pengguna'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchUsers, [auth.user.id]);

  // Filter by search
  const filtered = useMemo(
    () =>
      users.filter((u) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [users, searchQuery]
  );

  // Sort by username
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.username < b.username) return sortDirection === 'asc' ? -1 : 1;
      if (a.username > b.username) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortDirection]);

  const pageCount = Math.ceil(sorted.length / itemsPerPage);
  const displayedUsers = sorted.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (loading) {
    return (
      <Box
        className={styles.container}
        display="flex"
        justifyContent="center"
        mt={4}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box className={styles.container} mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.topBar}>
        <Typography variant="h5" className={styles.title}>
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowCreate(true)}
          className={styles.createButton}
        >
          Create New User
        </Button>
      </Box>

      <Box className={styles.controls}>
        <TextField
          placeholder="Search by username…"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(0);
          }}
          size="small"
          className={styles.searchField}
        />

        <Button
          variant="outlined"
          endIcon={<ArrowDropDown />}
          onClick={handleSortClick}
          className={styles.sortButton}
        >
          Sort: {sortDirection === 'asc' ? 'A–Z' : 'Z–A'}
        </Button>
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleSortClose}>
          <MenuItem onClick={() => handleSortSelect('asc')}>A–Z</MenuItem>
          <MenuItem onClick={() => handleSortSelect('desc')}>Z–A</MenuItem>
        </Menu>
      </Box>

      <UsersTable
        users={displayedUsers}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onDelete={setDeletingUser}
      />

      <Box className={styles.pagination}>
        <Pagination
          count={pageCount}
          page={currentPage + 1}
          onChange={(_, page) => setCurrentPage(page - 1)}
          color="primary"
        />
      </Box>

      {showCreate && (
        <CreateUser
          open
          onClose={() => {
            setShowCreate(false);
            fetchUsers();
          }}
        />
      )}
      {deletingUser && (
        <DeleteUserDialog
          open
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={async () => {
            await api.delete(`/users/${deletingUser.id}`);
            setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
            setDeletingUser(null);
          }}
        />
      )}
    </Box>
  );
};

export default UserManagement;
