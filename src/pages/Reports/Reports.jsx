import React, { useEffect, useState } from 'react';

import { ArrowDownward, ArrowUpward } from '@mui/icons-material'; // Import sorting icons
import { IconButton } from '@mui/material'; // Import IconButton for icon clicks
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';

import api from '../../services/api'; // Pastikan API diimpor dengan benar
import './Reports.module.css'; // Import custom CSS untuk styling tambahan

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting order for title
  const [sortColumn, setSortColumn] = useState('no'); // Sorting column ('no' or 'title')

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Ambil data user dari localStorage
        const userData = JSON.parse(localStorage.getItem('user')); // Pastikan 'user' ada di localStorage
        if (userData) {
          setUserRole(userData.role);
          setUserId(userData.id);
        }

        const response = await api.get('/reports');
        setReports(response.data);
      } catch (err) {
        setError('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Handle sorting
  const handleSort = (column) => {
    const sortedReports = [...reports].sort((a, b) => {
      if (column === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (column === 'no') {
        return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      }
      return 0;
    });
    setReports(sortedReports);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setSortColumn(column);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered reports based on search query
  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const itemsPerPage = 5;
  const displayedReports = filteredReports.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const pageCount = Math.ceil(filteredReports.length / itemsPerPage);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="mt-5">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Main content area */}
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4 my-5">
            <h4>Reports</h4>
            <Link to="/create-report" className="btn btn-primary">
              Create Report
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Title or Status"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* Report Table */}
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>
                    <IconButton onClick={() => handleSort('no')}>
                      {sortColumn === 'no' && sortOrder === 'asc' ? (
                        <ArrowDownward />
                      ) : (
                        <ArrowUpward />
                      )}
                    </IconButton>
                    No
                  </th>
                  <th>
                    <IconButton onClick={() => handleSort('title')}>
                      {sortColumn === 'title' && sortOrder === 'asc' ? (
                        <ArrowDownward />
                      ) : (
                        <ArrowUpward />
                      )}
                    </IconButton>
                    Title
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedReports.map((report, index) => (
                  <tr key={report.id}>
                    <td>{currentPage * itemsPerPage + index + 1}</td>
                    <td>{report.title}</td>
                    <td>{report.status}</td>
                    <td>
                      <Link
                        to={`/reports/${report.id}`}
                        className="btn btn-outline-primary btn-sm mr-2"
                      >
                        View
                      </Link>
                      {(userRole === 'owner' ||
                        userRole === 'admin' ||
                        report.userId === userId) && (
                        <Link
                          to={`/reports/edit/${report.id}`}
                          className="btn btn-outline-warning btn-sm mr-2"
                        >
                          Edit
                        </Link>
                      )}
                      {(userRole === 'owner' ||
                        userRole === 'admin' ||
                        report.userId === userId) && (
                        <button
                          onClick={async () => {
                            try {
                              await api.delete(`/reports/${report.id}`);
                              // After delete, remove report from state
                              setReports(
                                reports.filter((r) => r.id !== report.id)
                              );
                            } catch (err) {
                              setError('Failed to delete report');
                            }
                          }}
                          className="btn btn-outline-danger btn-sm"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              pageCount={pageCount}
              onPageChange={({ selected }) => setCurrentPage(selected)}
              containerClassName={'pagination'}
              activeClassName={'active'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
