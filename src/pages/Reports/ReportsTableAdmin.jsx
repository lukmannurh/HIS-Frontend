import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Tooltip,
  IconButton,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import styles from './ReportsTableAdmin.module.css';

const ReportsTableAdmin = ({
  reports,
  currentPage,
  itemsPerPage,
  formatDateWIB,
  getReportTimestamp,
  // eslint-disable-next-line no-unused-vars
  userRole,
  // eslint-disable-next-line no-unused-vars
  userId,
  openStatusDialog,
  openDeleteDialog,
}) => (
  <TableContainer component={Paper} className={styles.tableContainer}>
    <Table className={styles.table}>
      <TableHead className={styles.tableHeader}>
        <TableRow>
          <TableCell className={`${styles.cell} ${styles.centerText}`}>
            No
          </TableCell>
          <TableCell className={styles.cell}>Title</TableCell>
          <TableCell className={styles.cell}>Pengirim</TableCell>
          <TableCell className={styles.cell}>Waktu (WIB)</TableCell>
          <TableCell className={styles.cell}>Validasi</TableCell>
          <TableCell className={styles.cell}>Status Laporan</TableCell>
          <TableCell className={`${styles.cell} ${styles.centerText}`}>
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {reports.map((report, idx) => {
          const ts = getReportTimestamp(report);
          return (
            <TableRow key={report.id}>
              <TableCell className={`${styles.cell} ${styles.centerText}`}>
                {currentPage * itemsPerPage + idx + 1}
              </TableCell>
              <TableCell className={styles.cell}>
                <RouterLink
                  to={`/reports/${report.id}`}
                  className={styles.link}
                >
                  {report.title}
                </RouterLink>
              </TableCell>
              <TableCell className={styles.cell}>
                {report.user.username}
              </TableCell>
              <TableCell className={styles.cell}>{formatDateWIB(ts)}</TableCell>
              <TableCell className={styles.cell}>
                <span
                  className={
                    report.validationStatus === 'hoax'
                      ? styles.hoaxStatus
                      : report.validationStatus === 'valid'
                        ? styles.validStatus
                        : styles.durigStatus
                  }
                >
                  {report.validationStatus.charAt(0).toUpperCase() +
                    report.validationStatus.slice(1)}
                </span>
              </TableCell>
              <TableCell className={styles.cell}>
                {report.status || 'diproses'}
              </TableCell>
              <TableCell className={`${styles.cell} ${styles.centerText}`}>
                <Tooltip title="View" arrow>
                  <IconButton
                    component={RouterLink}
                    to={`/reports/${report.id}`}
                    size="small"
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
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
                    size="small"
                    onClick={() => openDeleteDialog(report)}
                    className={styles.actionButton}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Mark as Selesai" arrow>
                  <Button
                    size="small"
                    variant="outlined"
                    className={styles.statusButton}
                    onClick={() => openStatusDialog(report)}
                  >
                    Selesai
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          );
        })}
        {reports.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={7}
              className={`${styles.cell} ${styles.centerText}`}
            >
              No reports found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ReportsTableAdmin;
