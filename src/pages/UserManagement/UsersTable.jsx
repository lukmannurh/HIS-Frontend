import React from 'react';

import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Box,
} from '@mui/material';

import styles from './UsersTable.module.css';

const UsersTable = ({
  users,
  currentPage,
  itemsPerPage,
  onEditRole,
  onDelete,
}) => (
  <TableContainer component={Paper} className={styles.tableContainer}>
    <Table>
      <TableHead className={styles.tableHeader}>
        <TableRow>
          <TableCell className={styles.centerText}>No</TableCell>
          <TableCell className={styles.cell}>Username</TableCell>
          <TableCell className={styles.cell}>Full Name</TableCell>
          <TableCell className={styles.cell}>Email</TableCell>
          <TableCell className={styles.cell}>Role</TableCell>
          <TableCell className={`${styles.cell} ${styles.centerText}`}>
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
            <TableCell className={styles.centerText}>
              {currentPage * itemsPerPage + idx + 1}
            </TableCell>
            <TableCell className={styles.cell}>{user.username}</TableCell>
            <TableCell className={styles.cell}>
              {user.fullName || '-'}
            </TableCell>
            <TableCell className={styles.cell}>{user.email}</TableCell>
            <TableCell className={styles.cell}>{user.role}</TableCell>
            <TableCell className={`${styles.cell} ${styles.actionsCell}`}>
              <Box className={styles.actionsGroup}>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => onEditRole(user)}
                  className={styles.editButton}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => onDelete(user)}
                  className={styles.deleteButton}
                >
                  Delete
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        ))}
        {users.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={6}
              className={`${styles.cell} ${styles.centerText}`}
            >
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default UsersTable;
