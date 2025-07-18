import React from 'react';

import ArchiveIcon from '@mui/icons-material/Archive';
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
  Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import styles from './ReportsTableAdmin.module.css';

const ReportsTableAdmin = ({
  reports,
  currentPage,
  itemsPerPage,
  getReportTimestamp,
  openDeleteDialog,
  openArchiveDialog,
}) => (
  <TableContainer component={Paper} className={styles.tableContainer}>
    <Table className={styles.table}>
      <TableHead className={styles.tableHeader}>
        <TableRow>
          <TableCell className={`${styles.cell} ${styles.centerText}`}>
            No
          </TableCell>
          <TableCell className={styles.cell}>RT</TableCell>
          <TableCell className={styles.cell}>RW</TableCell>
          <TableCell className={styles.cell}>Pengirim</TableCell>
          <TableCell className={styles.cell}>Validasi</TableCell>
          <TableCell className={styles.cell}>Tanggal</TableCell>
          <TableCell className={`${styles.cell} ${styles.centerText}`}>
            Status Laporan
          </TableCell>
          <TableCell className={`${styles.cell} ${styles.centerText}`}>
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {reports.map((report, idx) => {
          const dateOnly = new Date(
            getReportTimestamp(report)
          ).toLocaleDateString('id-ID');
          const sender =
            report.user.fullName?.trim() !== ''
              ? report.user.fullName
              : report.user.username;
          const validation = report.validationStatus;
          const status = report.reportStatus || 'diproses';

          return (
            <TableRow key={report.id}>
              <TableCell className={`${styles.cell} ${styles.centerText}`}>
                {currentPage * itemsPerPage + idx + 1}
              </TableCell>
              <TableCell className={styles.cell}>{report.user.rt}</TableCell>
              <TableCell className={styles.cell}>{report.user.rw}</TableCell>
              <TableCell className={styles.cell}>{sender}</TableCell>
              <TableCell className={styles.cell}>
                <span
                  className={
                    validation === 'hoax'
                      ? styles.hoaxStatus
                      : validation === 'valid'
                        ? styles.validStatus
                        : styles.durigStatus
                  }
                >
                  {validation.charAt(0).toUpperCase() + validation.slice(1)}
                </span>
              </TableCell>
              <TableCell className={styles.cell}>{dateOnly}</TableCell>
              <TableCell className={styles.cell}>{status}</TableCell>
              <TableCell className={`${styles.cell} ${styles.actionsCell}`}>
                <Box display="flex" justifyContent="center" gap={1}>
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
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => openDeleteDialog(report)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Archive" arrow>
                    <IconButton
                      size="small"
                      onClick={() => openArchiveDialog(report)}
                    >
                      <ArchiveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          );
        })}
        {reports.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={8}
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
