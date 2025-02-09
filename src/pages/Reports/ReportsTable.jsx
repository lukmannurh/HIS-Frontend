import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import styles from './Reports.module.css';

const ReportsTable = ({
  reports,
  currentPage,
  itemsPerPage,
  formatDateWIB,
  getReportTimestamp,
  userRole,
  userId,
  handleOpenDeleteDialog,
}) => {
  return (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell style={{ textAlign: 'center' }}>No</TableCell>
            <TableCell className={styles.titleCell}>Title</TableCell>
            <TableCell className={styles.justifyText}>Pengirim</TableCell>
            <TableCell className={styles.justifyText}>Waktu (WIB)</TableCell>
            <TableCell style={{ textAlign: 'center' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report, index) => {
            const timestamp = getReportTimestamp(report);
            return (
              <TableRow key={report.id}>
                <TableCell style={{ textAlign: 'center' }}>
                  {currentPage * itemsPerPage + index + 1}
                </TableCell>
                <TableCell className={styles.justifyText}>
                  {report.title}
                </TableCell>
                <TableCell className={styles.justifyText}>
                  {report.user.username}
                </TableCell>
                <TableCell className={styles.justifyText}>
                  {formatDateWIB(timestamp)}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Tooltip title="View" arrow>
                    <IconButton
                      component={RouterLink}
                      to={`/reports/${report.id}`}
                      size="small"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {(userRole === 'owner' ||
                    userRole === 'admin' ||
                    report.userId === userId) && (
                    <>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          component={RouterLink}
                          to={`/reports/edit/${report.id}`}
                          size="small"
                          className={styles.actionButton}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleOpenDeleteDialog(report.id)}
                          className={styles.actionButton}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {reports.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No reports found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportsTable;
