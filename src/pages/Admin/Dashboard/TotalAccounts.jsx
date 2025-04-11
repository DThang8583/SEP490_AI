import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as TeacherIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Paging from '../../../Components/Common/Paging';
import { useNavigate } from 'react-router-dom';

const TotalAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          SearchTerm: searchTerm,
          SortColumn: sortColumn,
          SortOrder: sortOrder,
          Page: page,
          PageSize: itemsPerPage,
        },
      });

      if (response.data?.code === 0 && response.data?.data?.items) {
        setAccounts(response.data.data.items);
        setTotalCount(response.data.data.totalRecords);
        setPage(response.data.data.currentPage);
      } else {
        setAccounts([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('Không thể tải danh sách tài khoản. Vui lòng thử lại sau.');
      setAccounts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [page, itemsPerPage, searchTerm, sortColumn, sortOrder]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Tên đăng nhập',
      'Họ tên',
      'Email',
      'Vai trò',
      'Trường',
      'Số điện thoại',
      'Ngày sinh',
      'Giới tính',
      'Địa chỉ'
    ];

    const processRow = (row) => {
      const values = [
        row.userId,
        row.username,
        row.fullname,
        row.email,
        row.role,
        row.school || '',
        row.phoneNumber || '',
        row.dateOfBirth || '',
        row.gender === 'Male' ? 'Nam' : row.gender === 'Female' ? 'Nữ' : '',
        row.address || ''
      ];

      return values.map(value => {
        if (value === null || value === undefined) return '';
        value = value.toString();
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          value = value.replace(/"/g, '""');
          return `"${value}"`;
        }
        return value;
      }).join(',');
    };

    const BOM = '\uFEFF';
    const csvContent = BOM + [
      headers.join(','),
      ...accounts.map(row => processRow(row))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `danh_sach_tai_khoan_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getRoleChip = (role) => {
    switch (role.toLowerCase()) {
      case 'administrator':
        return (
          <Chip
            icon={<AdminIcon />}
            label="Admin"
            color="error"
            size="small"
          />
        );
      case 'subject specialist manager':
        return (
          <Chip
            icon={<TeacherIcon />}
            label="Quản lý"
            color="primary"
            size="small"
          />
        );
      case 'teacher':
        return (
          <Chip
            icon={<TeacherIcon />}
            label="Giáo viên"
            color="success"
            size="small"
          />
        );
      default:
        return (
          <Chip
            icon={<PersonIcon />}
            label="Người dùng"
            color="default"
            size="small"
          />
        );
    }
  };

  return (
    <Box sx={{ 
      p: 3,
      pb: 8,
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        gap: 2,
        flexWrap: 'wrap'
      }}>
        <Typography variant="h4" component="h1">
          Danh sách tài khoản
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/admin/create-account')}>
            Tạo Tài Khoản
          </Button>
          <Tooltip title="Xuất CSV">
            <IconButton onClick={exportToCSV} color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Làm mới">
            <IconButton onClick={fetchAccounts} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo tên, email, trường học..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          p: 3,
          flex: 1
        }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <Paper sx={{ 
          width: '100%', 
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <TableContainer sx={{ flex: 1 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Ảnh</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell 
                    onClick={() => handleSort('fullname')}
                    sx={{ cursor: 'pointer' }}
                  >
                    Họ tên
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('email')}
                    sx={{ cursor: 'pointer' }}
                  >
                    Email
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('role')}
                    sx={{ cursor: 'pointer' }}
                  >
                    Vai trò
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('school')}
                    sx={{ cursor: 'pointer' }}
                  >
                    Trường
                  </TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow hover key={account.userId}>
                    <TableCell>
                      <Avatar 
                        src={account.imgURL} 
                        alt={account.fullname}
                        sx={{ width: 40, height: 40 }}
                      >
                        {account.fullname?.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>{account.userId}</TableCell>
                    <TableCell>{account.fullname}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{getRoleChip(account.role)}</TableCell>
                    <TableCell>
                      {account.school ? (
                        <Chip
                          icon={<SchoolIcon />}
                          label={account.school}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{account.phoneNumber}</TableCell>
                    <TableCell>{account.address}</TableCell>
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

export default TotalAccounts; 