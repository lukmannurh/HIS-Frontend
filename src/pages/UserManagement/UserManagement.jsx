import React, { useEffect, useState, useContext, useMemo } from 'react';

import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import ReactPaginate from 'react-paginate';

import CreateUser from './CreateUser';
import DeleteUserDialog from './DeleteUserDialog';
import EditUserRole from './EditUserRole';
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
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // hanya search & sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // asc = A–Z, desc = Z–A

  // pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    api
      .get('/users')
      .then((res) => {
        setUsers(res.data.filter((u) => u.id !== auth.user.id));
      })
      .catch(() => setError('Failed to fetch users'))
      .finally(() => setLoading(false));
  }, [auth.user.id]);

  // filter by search
  const filtered = useMemo(() => {
    return users.filter((u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // sort by username only
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

        <ToggleButtonGroup
          value={sortDirection}
          exclusive
          onChange={(_, dir) => dir && setSortDirection(dir)}
          size="small"
          className={styles.toggleGroup}
        >
          <ToggleButton value="asc">A–Z</ToggleButton>
          <ToggleButton value="desc">Z–A</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <UsersTable
        users={displayedUsers}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onEditRole={setEditingUser}
        onDelete={setDeletingUser}
      />

      <Box className={styles.pagination} mt={2}>
        <ReactPaginate
          pageCount={pageCount}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          previousLabel="Prev"
          nextLabel="Next"
          containerClassName={styles.paginateContainer}
          activeClassName={styles.active}
          pageLinkClassName={styles.pageLink}
        />
      </Box>

      {showCreate && (
        <CreateUser
          open
          onClose={() => {
            setShowCreate(false);
            // refetch
            api
              .get('/users')
              .then((res) =>
                setUsers(res.data.filter((u) => u.id !== auth.user.id))
              );
          }}
        />
      )}
      {editingUser && (
        <EditUserRole
          open
          user={editingUser}
          onClose={() => {
            setEditingUser(null);
            api
              .get('/users')
              .then((res) =>
                setUsers(res.data.filter((u) => u.id !== auth.user.id))
              );
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
