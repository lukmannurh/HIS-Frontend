import React, { useEffect, useState, useContext, useMemo } from 'react';

import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import ReactPaginate from 'react-paginate';

import CreateUser from './CreateUser';
import DeleteUserDialog from './DeleteUserDialog';
import EditUserRole from './EditUserRole';
import styles from './UserManagement.module.css';
import UsersTable from './UsersTable';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const SORT_FIELDS = {
  USERNAME: 'username',
  CREATED_AT: 'createdAt',
};

const UserManagement = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // search/filter/sort/pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortField, setSortField] = useState(SORT_FIELDS.USERNAME);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        // exclude current admin
        setUsers(res.data.filter((u) => u.id !== auth.user.id));
      } catch {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [auth.user.id]);

  // Filter
  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const matchesSearch = u.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        return matchesSearch && matchesRole;
      }),
    [users, searchQuery, filterRole]
  );

  // Sort
  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const aVal = a[sortField],
          bVal = b[sortField];
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }),
    [filtered, sortField, sortDirection]
  );

  // Paginate
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
        mt={3}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box className={styles.container} m={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowCreate(true)}
        className={styles.createButton}
      >
        Create New User
      </Button>

      <Box className={styles.filterContainer}>
        <TextField
          label="Search Username"
          size="small"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(0);
          }}
          className={styles.control}
        />
        <FormControl size="small" className={styles.control}>
          <InputLabel>Role</InputLabel>
          <Select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(0);
            }}
            label="Role"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" className={styles.control}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            label="Sort By"
          >
            <MenuItem value={SORT_FIELDS.USERNAME}>Username</MenuItem>
            <MenuItem value={SORT_FIELDS.CREATED_AT}>Created At</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" className={styles.control}>
          <InputLabel>Direction</InputLabel>
          <Select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            label="Direction"
          >
            <MenuItem value="asc">Asc</MenuItem>
            <MenuItem value="desc">Desc</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <UsersTable
        users={displayedUsers}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onEditRole={setEditingUser}
        onDelete={setDeletingUser}
      />

      <Box
        className={styles.paginationContainer}
        display="flex"
        justifyContent="center"
        mt={3}
      >
        <ReactPaginate
          previousLabel="Prev"
          nextLabel="Next"
          pageCount={pageCount}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          pageClassName={styles.pageItem}
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
            setDeletingUser(null);
            setUsers(users.filter((u) => u.id !== deletingUser.id));
          }}
        />
      )}
    </Box>
  );
};

export default UserManagement;
