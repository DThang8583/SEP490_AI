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
  Grid,
  Card,
  CardContent,
  CardActions,
  Fade,
  Container,
  Badge,
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as TeacherIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Class as ClassIcon,
  AccountCircle as AccountIcon,
  FilterList as FilterIcon,
  People as PeopleIcon,
  Add as AddIcon,
  ClearAll as ClearIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import Paging from '../../../Components/Common/Paging';
import { useNavigate } from 'react-router-dom';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(8),
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
  animation: `${fadeIn} 0.6s ease-out`,
}));

const FilterCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  background: '#ffffff',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  animation: `${fadeIn} 0.8s ease-out`,
}));

const AccountCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
    borderColor: '#667eea',
  },
  animation: `${fadeIn} 1s ease-out`,
}));

const GradeButton = styled(Button)(({ theme, selected }) => ({
  borderRadius: '25px',
  padding: '8px 20px',
  margin: '4px',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  ...(selected ? {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    transform: 'scale(1.05)',
  } : {
    background: '#ffffff',
    color: '#667eea',
    border: '2px solid #667eea',
    '&:hover': {
      background: '#667eea',
      color: '#ffffff',
      transform: 'scale(1.02)',
    },
  }),
}));

const StyledChip = styled(Chip)(({ chiptype }) => {
  const colors = {
    administrator: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: '#ffffff',
    },
    manager: {
      background: 'linear-gradient(135deg, #4834d4 0%, #686de0 100%)',
      color: '#ffffff',
    },
    teacher: {
      background: 'linear-gradient(135deg, #00d2d3 0%, #54a0ff 100%)',
      color: '#ffffff',
    },
    default: {
      background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
      color: '#5b21b6',
    },
  };

  return {
    ...colors[chiptype] || colors.default,
    fontWeight: 600,
    padding: '4px 8px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };
});

const ActionButton = styled(IconButton)(({ theme }) => ({
  margin: '0 4px',
  padding: '8px',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&.edit': {
    background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    color: '#ffffff',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 4px 15px rgba(116, 185, 255, 0.4)',
    },
  },
  '&.download': {
    background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
    color: '#ffffff',
    '&:hover': {
      animation: `${pulse} 1s infinite`,
    },
  },
}));

const StatsCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  padding: theme.spacing(2),
  borderRadius: '16px',
  textAlign: 'center',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(2),
}));

const TotalAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]); // Store all accounts for client-side filtering
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
          Page: 1, // Always fetch from page 1 to get all data
          PageSize: 1000, // Get more data for client-side filtering
        },
      });

      if (response.data?.code === 0 && response.data?.data?.items) {
        setAllAccounts(response.data.data.items);
        // Apply client-side filtering
        applyClientSideFiltering(response.data.data.items);
      } else {
        setAllAccounts([]);
        setAccounts([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('Không thể tải danh sách tài khoản. Vui lòng thử lại sau.');
      setAllAccounts([]);
      setAccounts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering function
  const applyClientSideFiltering = (accountsData = allAccounts) => {
    let filteredAccounts = [...accountsData];

    // Filter by role
    if (roleIdFilter) {
      const selectedRole = roles.find(role => role.roleId.toString() === roleIdFilter.toString());
      if (selectedRole) {
        filteredAccounts = filteredAccounts.filter(account => 
          account.role?.toLowerCase() === selectedRole.roleName?.toLowerCase()
        );
      }
    }

    // Filter by grade
    if (selectedGradeNumber !== null) {
      filteredAccounts = filteredAccounts.filter(account => {
        // Check if account has grade information and matches selected grade
        return account.grade && account.grade.toString().includes(selectedGradeNumber.toString());
      });
    }

    // Filter by school (if school filter is implemented)
    if (schoolIdFilter) {
      filteredAccounts = filteredAccounts.filter(account => 
        account.schoolId?.toString() === schoolIdFilter.toString()
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

    setAccounts(paginatedAccounts);
    setTotalCount(filteredAccounts.length);
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
  }, [searchTerm, sortColumn, sortOrder, isActiveFilter]);

  // Separate useEffect for client-side filtering when filters change
  useEffect(() => {
    if (allAccounts.length > 0) {
      applyClientSideFiltering();
    }
  }, [page, itemsPerPage, roleIdFilter, selectedGradeNumber, schoolIdFilter, allAccounts, roles]);

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
    let chipType = "default";
    let icon = <PersonIcon sx={{ fontSize: '18px' }} />;
    let label = role;

    switch (role.toLowerCase()) {
      case 'administrator':
        chipType = "administrator";
        icon = <AdminIcon sx={{ fontSize: '18px' }} />;
        label = "Quản trị viên";
        break;
      case 'subject specialist manager':
      case 'tổ trưởng chuyên môn':
        chipType = "manager";
        icon = <TeacherIcon sx={{ fontSize: '18px' }} />;
        label = "Tổ trưởng";
        break;
      case 'teacher':
      case 'giáo viên':
        chipType = "teacher";
        icon = <SchoolIcon sx={{ fontSize: '18px' }} />;
        label = "Giáo viên";
        break;
      default:
        break;
    }

    return (
      <StyledChip
        chiptype={chipType}
        icon={icon}
        label={label}
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
    <StyledContainer maxWidth="xl">
      {/* Header Section */}
      <HeaderCard>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PeopleIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Quản lý tài khoản
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Danh sách tài khoản giáo viên và quản trị viên
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ActionButton 
                className="download"
                onClick={exportToCSV}
                size="large"
              >
                <DownloadIcon />
              </ActionButton>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/create-account')}
                sx={{
                  background: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)',
                  borderRadius: '25px',
                  padding: '12px 24px',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(255, 118, 117, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 118, 117, 0.4)',
                  }
                }}
              >
                Tạo tài khoản mới
              </Button>
            </Box>
          </Box>
        </CardContent>
      </HeaderCard>

      {/* Stats Section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {totalCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Tổng tài khoản
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#00d2d3' }}>
              {accounts.filter(acc => acc.role?.toLowerCase().includes('teacher')).length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Giáo viên
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#4834d4' }}>
              {accounts.filter(acc => acc.role?.toLowerCase().includes('manager')).length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Tổ trưởng
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#ff6b6b' }}>
              {accounts.filter(acc => acc.role?.toLowerCase().includes('administrator')).length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Quản trị viên
            </Typography>
          </StatsCard>
        </Grid>
      </Grid>

      {filterError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
          {filterError}
        </Alert>
      )}

      {/* Filter Section */}
      <FilterCard>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterIcon sx={{ mr: 1, color: '#667eea' }} />
            <Typography variant="h6" fontWeight="600" color="#667eea">
              Bộ lọc tìm kiếm
            </Typography>
          </Box>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="🔍 Tìm kiếm theo tên, email..."
                value={searchTerm}
                onChange={handleSearch}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth disabled={loadingFilters}>
                <InputLabel>👤 Vai trò</InputLabel>
                <Select
                  value={roleIdFilter}
                  label="👤 Vai trò"
                  onChange={handleRoleFilterChange}
                  sx={{
                    borderRadius: '16px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                  }}
                >
                  <MenuItem value=""><em>Tất cả vai trò</em></MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="600" color="#667eea">
                  🎓 Lọc theo khối lớp
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5].map(gradeNumber => (
                    <GradeButton
                      key={gradeNumber}
                      selected={selectedGradeNumber === gradeNumber}
                      onClick={() => handleGradeButtonClick(gradeNumber)}
                    >
                      Khối {gradeNumber}
                    </GradeButton>
                  ))}
                  {selectedGradeNumber !== null && (
                    <Button
                      variant="outlined"
                      startIcon={<ClearIcon />}
                      onClick={() => handleGradeButtonClick(null)}
                      sx={{
                        borderRadius: '25px',
                        color: '#ff6b6b',
                        borderColor: '#ff6b6b',
                        '&:hover': {
                          background: '#ff6b6b',
                          color: '#ffffff',
                        },
                      }}
                    >
                      Xóa lọc
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isActiveFilter}
                  onChange={handleIsActiveFilterChange}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#667eea',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#667eea',
                    },
                  }}
                />
              }
              label="✅ Chỉ hiển thị tài khoản đang hoạt động"
              sx={{ 
                fontWeight: 600,
                '& .MuiFormControlLabel-label': {
                  color: '#667eea',
                },
              }}
            />
          </Box>
        </CardContent>
      </FilterCard>

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '300px',
          flexDirection: 'column',
          gap: 2,
        }}>
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
          <Typography variant="h6" color="#667eea" fontWeight="600">
            Đang tải danh sách tài khoản...
          </Typography>
        </Box>
      ) : error ? (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 4, 
            borderRadius: '16px',
            fontSize: '16px',
            '& .MuiAlert-icon': {
              fontSize: '24px',
            },
          }}
        >
          {error}
        </Alert>
      ) : accounts.length > 0 ? (
        <Box>
          <Grid container spacing={2}>
            {accounts.map((account, index) => (
              <Grid item xs={12} sm={6} lg={4} key={account.userId}>
                <Fade in={true} timeout={500 + index * 100}>
                  <AccountCard>
                    <CardContent sx={{ pb: 1 }}>
                      {/* Header with Avatar and Role */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: account.isActive ? '#00d2d3' : '#ff6b6b',
                                border: '2px solid white',
                              }}
                            />
                          }
                        >
                          <Avatar
                            sx={{
                              width: 50,
                              height: 50,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontSize: '20px',
                              fontWeight: 'bold',
                            }}
                          >
                            {account.fullname ? account.fullname.charAt(0) : account.username.charAt(0)}
                          </Avatar>
                        </Badge>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                            {account.fullname || account.username}
                          </Typography>
                          {getRoleChip(account.role)}
                        </Box>
                      </Box>

                      {/* Contact Information */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, color: '#667eea' }} />
                          <Typography variant="body2" color="textSecondary">
                            {account.email}
                          </Typography>
                        </Box>
                        
                        {account.phoneNumber && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: '#667eea' }} />
                            <Typography variant="body2" color="textSecondary">
                              {account.phoneNumber}
                            </Typography>
                          </Box>
                        )}

                        {account.school && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <SchoolIcon sx={{ fontSize: 16, color: '#667eea' }} />
                            <Typography variant="body2" color="textSecondary">
                              {account.school}
                            </Typography>
                          </Box>
                        )}

                        {account.address && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <LocationIcon sx={{ fontSize: 16, color: '#667eea' }} />
                            <Typography 
                              variant="body2" 
                              color="textSecondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {account.address}
                            </Typography>
                          </Box>
                        )}

                        {account.grade && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ClassIcon sx={{ fontSize: 16, color: '#667eea' }} />
                            <Typography variant="body2" color="textSecondary">
                              {account.grade}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ pt: 0, pb: 2, px: 2, justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ActionButton 
                          className="edit"
                          onClick={() => handleEdit(account.userId)}
                          size="small"
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </ActionButton>
                        
                        <Switch
                          checked={account.isActive}
                          onChange={() => handleDelete(account.userId)}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#00d2d3',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#00d2d3',
                            },
                          }}
                        />
                      </Box>
                      
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: account.isActive ? '#00d2d3' : '#ff6b6b',
                          fontWeight: 600,
                        }}
                      >
                        {account.isActive ? '🟢 Hoạt động' : '🔴 Tạm dừng'}
                      </Typography>
                    </CardActions>
                  </AccountCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '300px',
          flexDirection: 'column',
          gap: 2,
        }}>
          <AccountIcon sx={{ fontSize: 80, color: '#667eea', opacity: 0.5 }} />
          <Typography variant="h5" color="#667eea" fontWeight="600">
            Không tìm thấy tài khoản nào
          </Typography>
          <Typography variant="body1" color="textSecondary" textAlign="center">
            Thử điều chỉnh bộ lọc hoặc tạo tài khoản mới
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {totalCount > 0 && (
        <Box sx={{ 
          mt: 4, 
          display: 'flex', 
          justifyContent: 'center',
          '& .MuiTablePagination-root': {
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: 'none',
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontWeight: 600,
            color: '#667eea',
          },
          '& .MuiTablePagination-select': {
            borderRadius: '8px',
          },
          '& .MuiIconButton-root': {
            color: '#667eea',
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
            },
          },
        }}>
          <TablePagination
            component="div"
            count={totalCount}
            page={page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={itemsPerPage}
            onRowsPerPageChange={handleItemsPerPageChange}
            rowsPerPageOptions={[6, 12, 24, 48]}
            labelRowsPerPage="Số tài khoản mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => 
              `Hiển thị ${from}-${to} trong tổng số ${count} tài khoản`
            }
          />
        </Box>
      )}
    </StyledContainer>
  );
};

export default TotalAccounts; 