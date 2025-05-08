import api from '../../../services/api';

// Fungsi untuk menghapus laporan
export const handleDeleteReport = async (report, setReports, setError) => {
  if (!window.confirm(`Yakin ingin menghapus laporan ${report.title}?`)) return;

  try {
    await api.delete(`/reports/${report.id}`);
    setReports((prevReports) => prevReports.filter((r) => r.id !== report.id));
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to delete report');
  }
};
