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
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  Button,
} from '@mui/material';
import {
  School as SchoolIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  LocationOn as LocationIcon,
  AccountBalance as SchoolBuildingIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Paging from '../../../Components/Common/Paging';

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      let url = `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/schools?Page=${currentPage}&PageSize=${pageSize}`;
      
      if (searchTerm) {
        url += `&SearchTerm=${encodeURIComponent(searchTerm)}`;
      }

      if (sortColumn) {
        url += `&SortColumn=${encodeURIComponent(sortColumn)}&SortOrder=${encodeURIComponent(sortOrder)}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSchools(response.data.data.items);
      setTotalRecords(response.data.data.totalRecords);
      setError('');
    } catch (error) {
      console.error('Error fetching schools:', error);
      setError('Không thể tải danh sách trường');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [currentPage, pageSize, searchTerm, sortColumn, sortOrder]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return sortOrder === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Action Button */}
      <Box 
        sx={{ 
          mb: 4, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SchoolIcon 
            sx={{ 
              fontSize: 40, 
              color: 'primary.main', 
              mr: 2,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
                '50%': {
                  transform: 'scale(1.1)',
                  opacity: 0.8,
                },
                '100%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
              },
            }} 
          />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
              Quản lý trường học
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Quản lý thông tin các trường trong hệ thống
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            py: 1,
            px: 3,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'translateY(-2px)',
              boxShadow: 4,
            },
            transition: 'all 0.2s',
          }}
        >
          Thêm trường mới
        </Button>
      </Box>

      {/* Total Schools Card */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #6B8DE6 0%, #5E76CC 100%)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        }}
      >
        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        />
        
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={4}
          alignItems="center"
          sx={{ 
            p: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SchoolBuildingIcon sx={{ fontSize: 48, color: '#fff' }} />
          </Box>
          
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500,
                mb: 1,
              }}
            >
              Tổng số trường trong hệ thống
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                color: '#fff',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {totalRecords}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Search and Filter */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 4,
          bgcolor: '#fff',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo tên trường..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                sx: {
                  borderRadius: 2.5,
                  bgcolor: 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                    transition: 'all 0.2s',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} container justifyContent="flex-end">
            <Tooltip title="Làm mới dữ liệu">
              <IconButton 
                onClick={() => fetchSchools()}
                sx={{
                  p: 2,
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    transform: 'rotate(180deg)',
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {error}
        </Alert>
      )}

      {/* Schools Table */}
      <Paper 
        elevation={0}
        sx={{ 
          width: '100%', 
          overflow: 'hidden',
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s',
          mb: 3,
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell 
                  onClick={() => handleSort('schoolId')}
                  sx={{ 
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      color: 'primary.main',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    ID
                    {getSortIcon('schoolId')}
                  </Box>
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('name')}
                  sx={{ 
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      color: 'primary.main',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Tên trường
                    {getSortIcon('name')}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Địa chỉ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phường/Xã</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Quận/Huyện</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Thành phố</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={40} thickness={4} />
                  </TableCell>
                </TableRow>
              ) : schools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <SchoolIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                        Không có dữ liệu
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Chưa có trường nào trong hệ thống
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                schools.map((school) => (
                  <TableRow 
                    key={school.schoolId}
                    hover
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'primary.lighter',
                        '& .MuiChip-root': {
                          transform: 'scale(1.05)',
                        },
                      }
                    }}
                  >
                    <TableCell>
                      <Chip 
                        label={school.schoolId}
                        size="small"
                        sx={{ 
                          bgcolor: 'primary.lighter',
                          color: 'primary.main',
                          fontWeight: 600,
                          transition: 'transform 0.2s',
                          minWidth: 60,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {school.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {school.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon 
                          sx={{ 
                            fontSize: 16, 
                            color: 'error.main',
                            animation: 'bounce 1s infinite',
                            '@keyframes bounce': {
                              '0%, 100%': {
                                transform: 'translateY(0)',
                              },
                              '50%': {
                                transform: 'translateY(-2px)',
                              },
                            },
                          }} 
                        />
                        <Typography variant="body2">{school.address}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{school.ward}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{school.district}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={school.city}
                        size="small"
                        sx={{ 
                          bgcolor: 'success.lighter',
                          color: 'success.dark',
                          fontWeight: 500,
                          transition: 'transform 0.2s',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination Section */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Tổng số:
          </Typography>
          <Chip
            label={`${totalRecords} trường`}
            size="small"
            sx={{
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              fontWeight: 600,
            }}
          />
        </Box>
        
        <Paging
          totalRecords={totalRecords}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </Paper>
    </Box>
  );
};

export default Schools; 