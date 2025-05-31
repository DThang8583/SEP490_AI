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
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Grid
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
  const [roleIdFilter, setRoleIdFilter] = useState('');
  const [schoolIdFilter, setSchoolIdFilter] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState(true);
  const [roles, setRoles] = useState([]);
  const [grades, setGrades] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [filterError, setFilterError] = useState(null);
  const [selectedGradeNumber, setSelectedGradeNumber] = useState(null);
  const [gradeNumberToIdMap, setGradeNumberToIdMap] = useState({});
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
          RoleId: roleIdFilter || undefined,
          GradeId: selectedGradeNumber !== null ? gradeNumberToIdMap[selectedGradeNumber] : undefined,
          SchoolId: schoolIdFilter || undefined,
          IsActive: isActiveFilter === true ? true : (isActiveFilter === false ? false : undefined),
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
    const fetchFilterData = async () => {
      try {
        setLoadingFilters(true);
        setFilterError(null);
        const token = localStorage.getItem('accessToken');
        const headers = { Authorization: `Bearer ${token}` };

        const [rolesResponse, gradesResponse] = await Promise.all([
          axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/roles', { headers }),
          axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades', { headers }),
        ]);

        if (rolesResponse.data?.code === 0) setRoles(rolesResponse.data.data);
        
        if (gradesResponse.data?.code === 0) {
            const gradeMap = {};
            gradesResponse.data.data.forEach(grade => {
                gradeMap[grade.gradeNumber] = grade.gradeId;
            });
            setGradeNumberToIdMap(gradeMap);
            setGrades(gradesResponse.data.data);
        }

      } catch (err) {
        console.error('Error fetching filter data:', err);
        setFilterError('Không thể tải dữ liệu bộ lọc.');
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterData();
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [page, itemsPerPage, searchTerm, sortColumn, sortOrder, roleIdFilter, selectedGradeNumber, schoolIdFilter, isActiveFilter, gradeNumberToIdMap]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleRoleFilterChange = (event) => {
    setRoleIdFilter(event.target.value);
    setPage(1);
  };

  const handleGradeButtonClick = (gradeNumber) => {
      if (selectedGradeNumber === gradeNumber) {
          setSelectedGradeNumber(null);
      } else {
          setSelectedGradeNumber(gradeNumber);
      }
      setPage(1);
  };

  const handleSchoolFilterChange = (event) => {
    setSchoolIdFilter(event.target.value);
    setPage(1);
  };

  const handleIsActiveFilterChange = (event) => {
    setIsActiveFilter(event.target.checked ? true : false);
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
      'Địa chỉ',
      'Trạng thái hoạt động'
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
        row.address || '',
        row.isActive ? 'Hoạt động' : 'Không hoạt động'
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
    let color = "default";
    let icon = <PersonIcon />;
    let label = role;

    switch (role.toLowerCase()) {
      case 'administrator':
        color = "error";
        icon = <AdminIcon />;
        break;
      case 'subject specialist manager':
      case 'tổ trưởng chuyên môn':
        color = "primary";
        icon = <TeacherIcon />;
        break;
      case 'teacher':
      case 'giáo viên':
        color = "warning";
        icon = <TeacherIcon />;
        break;
      default:
        // default color and icon are already set
        break;
    }

    return (
      <Chip
        icon={icon}
        label={label}
        color={color}
        size="small"
      />
    );
  };

  const handleEdit = (userId) => {
    navigate(`/admin/edit-account/${userId}`);
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.code === 0 || response.data.code === 23) {
        setAccounts(prevAccounts => 
          prevAccounts.map(account => 
            account.userId === userId 
              ? { ...account, isActive: !account.isActive }
              : account
          )
        );
      } else {
        setError(`Không thể cập nhật trạng thái: ${response.data.message || 'Vui lòng thử lại sau.'}`);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError(`Không thể cập nhật trạng thái: ${err.response?.data?.message || 'Vui lòng thử lại sau.'}`);
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
        mb: 3 
      }}>
        <Typography variant="h4" component="h1">Danh sách tài khoản</Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<DownloadIcon />} 
            onClick={exportToCSV} 
            sx={{ mr: 1 }}
          >
            Xuất CSV
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => navigate('/admin/create-account')}
          >
            Tạo Tài Khoản
          </Button>
        </Box>
      </Box>

      {filterError && <Alert severity="error" sx={{ mb: 2 }}>{filterError}</Alert>}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Tìm kiếm theo tên, email, trường..."
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
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth disabled={loadingFilters}>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={roleIdFilter}
                label="Vai trò"
                onChange={handleRoleFilterChange}
              >
                <MenuItem value=""><em>Tất cả</em></MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.roleId} value={role.roleId}>{role.roleName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" gutterBottom>Lọc theo Khối:</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[1, 2, 3, 4].map(gradeNumber => (
                <Button
                  key={gradeNumber}
                  variant={selectedGradeNumber === gradeNumber ? 'contained' : 'outlined'}
                  onClick={() => handleGradeButtonClick(gradeNumber)}
                >
                  Khối {gradeNumber}
                </Button>
              ))}
              {selectedGradeNumber !== null && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleGradeButtonClick(null)}
                >
                  Xóa lọc Khối
                </Button>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={isActiveFilter}
                  onChange={handleIsActiveFilterChange}
                  name="isActiveFilter"
                  color="primary"
                />
              }
              label="Chỉ tài khoản hoạt động"
            />
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      ) : ( accounts.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="account table">
            <TableHead>
              <TableRow>
                <TableCell>Ảnh</TableCell>
                <TableCell onClick={() => handleSort('fullname')}>Họ tên</TableCell>
                <TableCell onClick={() => handleSort('email')}>Email</TableCell>
                <TableCell onClick={() => handleSort('role')}>Vai trò</TableCell>
                <TableCell onClick={() => handleSort('school')}>Trường</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow
                  key={account.userId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Avatar>{account.fullname ? account.fullname.charAt(0) : account.username.charAt(0)}</Avatar>
                  </TableCell>
                  <TableCell>{account.fullname || account.username}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{getRoleChip(account.role)}</TableCell>
                  <TableCell>{account.school || 'N/A'}</TableCell>
                  <TableCell>{account.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>{account.address || 'N/A'}</TableCell>
                  <TableCell>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton onClick={() => handleEdit(account.userId)} size="small">
                        {/* Edit icon */}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={account.isActive ? "Vô hiệu hóa" : "Kích hoạt"}>
                       <Switch
                          checked={account.isActive}
                          onChange={() => handleDelete(account.userId)}
                          color={account.isActive ? "success" : "error"}
                          inputProps={{ 'aria-label': 'controlled switch' }}
                        />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
           <Typography>Không có tài khoản nào được tìm thấy.</Typography>
         </Box>
      ))}

      {totalCount > 0 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
           {/* Assuming Paging component handles its own state and logic for pagination */}
          <TablePagination
            component="div"
            count={totalCount}
            page={page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={itemsPerPage}
            onRowsPerPageChange={handleItemsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Số mục mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => 
              `Đang hiển thị ${from}-${to} trên tổng số ${count}`
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default TotalAccounts; 