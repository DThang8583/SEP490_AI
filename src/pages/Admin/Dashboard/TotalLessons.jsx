import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Paging from '../../../Components/Common/Paging';
import { useTheme } from '@mui/material/styles';

const TotalLessons = () => {
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();

  const fetchLessonPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');

      // Fetch all lesson plans to get the total count of non-drafts
      const totalCountResponse = await axios.get(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            Page: 1,
            PageSize: 999, // Fetch all to count non-drafts
            SearchTerm: searchTerm, // Apply search term to total count fetch as well
          },
        }
      );

      let nonDraftTotal = 0;
      let allItems = [];
      if (totalCountResponse.data?.code === 0 && totalCountResponse.data?.data?.items) {
        allItems = totalCountResponse.data.data.items;
        nonDraftTotal = allItems.filter(plan => plan.status !== 'Draft').length;
      }
      setTotalCount(nonDraftTotal);

      // Filter drafts from all items
      const nonDraftItems = allItems.filter(plan => plan.status !== 'Draft');

      // Calculate the number of pages based on non-draft items
      const calculatedTotalPages = Math.ceil(nonDraftTotal / itemsPerPage);
      setTotalPages(calculatedTotalPages);

      // Get the items for the current page
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedItems = nonDraftItems.slice(startIndex, endIndex);
      setLessonPlans(paginatedItems);

    } catch (err) {
      console.error('Error fetching lesson plans:', err);
      setError('Không thể tải danh sách giáo án. Vui lòng thử lại sau.');
      setLessonPlans([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonPlans();
  }, [page, itemsPerPage, searchTerm]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'Pending': { color: 'warning', label: 'Chờ duyệt' },
      'Approved': { color: 'success', label: 'Đã duyệt' },
      'Rejected': { color: 'error', label: 'Từ chối' },
      'Draft': { color: 'default', label: 'Bản nháp' },
    };

    const config = statusConfig[status] || { color: 'default', label: status };
    // Only return the chip if the status is not 'Draft'
    if (status === 'Draft') return null;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  return (
    <Box sx={{ 
      p: 3,
      pb: 8,
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Danh sách giáo án
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo tên giáo viên, tiết học, mô-đun..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: '500px' }}
        />
        <Paper 
          elevation={2}
          sx={{ 
            p: 2,
            minWidth: '200px',
            textAlign: 'center',
            backgroundColor: "#666600",
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2],
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: theme.shadows[4],
            }
          }}
        >
          <Typography variant="subtitle2" color="black" gutterBottom>
            Tổng số giáo án
          </Typography>
          <Typography variant="h4" color="black" sx={{ fontWeight: 'bold' }}>
            {totalCount} {/* This will now show the total non-draft count */}
          </Typography>
        </Paper>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden', flex: 1 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Giáo viên</TableCell>
                  <TableCell>Tiết học</TableCell>
                  <TableCell>Mô-đun</TableCell>
                  <TableCell>Khối</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Lý do từ chối</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Render only non-draft lesson plans from the paginated response */}
                {lessonPlans.map((plan) => (
                   <TableRow hover key={plan.lessonPlanId}>
                    <TableCell>{plan.lessonPlanId}</TableCell>
                    <TableCell>{plan.fullname}</TableCell>
                    <TableCell>{plan.lesson}</TableCell>
                    <TableCell>{plan.module}</TableCell>
                    <TableCell>{plan.grade}</TableCell>
                    <TableCell>{getStatusChip(plan.status)}</TableCell>
                    <TableCell>{plan.createdAt}</TableCell>
                    <TableCell>{plan.disapprovedReason || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Paging
            totalItems={totalCount} 
            itemsPerPage={itemsPerPage}
            currentPage={page}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      )}
    </Box>
  );
};

export default TotalLessons; 