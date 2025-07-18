import React from 'react';

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
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import styles from './ReportsTableUser.module.css';

const ReportsTableUser = ({
  reports,
  currentPage,
  itemsPerPage,
  getReportTimestamp,
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
          const status = report.reportStatus || 'diproses';

          return (
            <TableRow key={report.id}>
              <TableCell className={`${styles.cell} ${styles.centerText}`}>
                {currentPage * itemsPerPage + idx + 1}
              </TableCell>
              <TableCell className={styles.cell}>{report.user.rt}</TableCell>
              <TableCell className={styles.cell}>{report.user.rw}</TableCell>
              <TableCell className={styles.cell}>{sender}</TableCell>
              <TableCell className={styles.cell}>{dateOnly}</TableCell>
              <TableCell className={styles.cell}>{status}</TableCell>
              <TableCell className={`${styles.cell} ${styles.actionsCell}`}>
                <IconButton
                  component={RouterLink}
                  to={`/reports/${report.id}`}
                  size="small"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
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

export default ReportsTableUser;
