import React from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Tooltip,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import styles from './ReportsTableUser.module.css';

const ReportsTableUser = ({
  reports,
  currentPage,
  itemsPerPage,
  formatDateWIB,
  getReportTimestamp,
}) => (
  <TableContainer component={Paper} className={styles.tableContainer}>
    <Table className={styles.table}>
      <TableHead className={styles.tableHeader}>
        <TableRow>
          <TableCell className={`${styles.cell} ${styles.centerText}`}>
            No
          </TableCell>
          <TableCell className={styles.cell}>Title</TableCell>
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
              </TableCell>
            </TableRow>
          );
        })}
        {reports.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={6}
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

export default ReportsTableUser;
