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
import { useTheme } from '@mui/material/styles';
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
  const theme = useTheme();

  return (
    <TableContainer
      component={Paper}
      className={styles.tableContainer}
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#88c273' : '#ffffff',
      }}
    >
      <Table
        className={styles.table}
        sx={{
          '& .MuiTableCell-root': {
            color: theme.palette.mode === 'dark' ? '#000000' : '#000000',
          },
        }}
      >
        <TableHead className={styles.tableHeader}>
          <TableRow>
            <TableCell className={`${styles.cell} ${styles.centerText}`}>
              No
            </TableCell>
            <TableCell className={styles.cell}>Title</TableCell>
            <TableCell className={styles.cell}>Pengirim</TableCell>
            <TableCell className={styles.cell}>Waktu (WIB)</TableCell>
            <TableCell className={styles.cell}>Status</TableCell>
            <TableCell className={`${styles.cell} ${styles.centerText}`}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report, index) => {
            const timestamp = getReportTimestamp(report);
            return (
              <TableRow key={report.id} className={styles.tableRow}>
                <TableCell className={`${styles.cell} ${styles.centerText}`}>
                  {currentPage * itemsPerPage + index + 1}
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
                <TableCell className={styles.cell}>
                  {formatDateWIB(timestamp)}
                </TableCell>
                <TableCell className={styles.cell}>
                  <span
                    className={
                      report.validationStatus === 'hoax'
                        ? styles.hoaxStatus
                        : styles.validStatus
                    }
                  >
                    {report.validationStatus === 'hoax' ? 'Hoax' : 'Valid'}
                  </span>
                </TableCell>
                <TableCell className={`${styles.cell} ${styles.centerText}`}>
                  <Tooltip title="View" arrow>
                    <IconButton
                      component={RouterLink}
                      to={`/reports/${report.id}`}
                      size="small"
                      sx={{ color: '#000000' }}
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
                          sx={{ color: '#000000' }}
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
              <TableCell
                className={`${styles.cell} ${styles.centerText}`}
                colSpan={6}
              >
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
