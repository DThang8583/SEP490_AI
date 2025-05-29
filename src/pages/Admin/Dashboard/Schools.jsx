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
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  useTheme
} from '@mui/material/styles';
import {
  School as SchoolIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Schools = () => {
  const theme = useTheme();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteSchool = async (schoolId) => {
    try {
      setLoading(true); // Or a specific loading state for deletion
      const token = localStorage.getItem('accessToken');
      
      const url = `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/schools/${schoolId}`;
      
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Delete API Response:', response.data);
      
      if (response.data.code === 0) {
        // Refresh the school list after successful deletion
        fetchSchools();
        setError(''); // Clear any previous errors
      } else {
        setError(response.data.message || 'Failed to delete school');
      }
    } catch (error) {
      console.error('Error deleting school:', error);
      setError('Không thể xóa trường');
    } finally {
      // setLoading(false); // Loading will be set to false by fetchSchools
    }
  };

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const url = `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/schools?Page=${currentPage}&PageSize=${pageSize}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('API Response:', response.data);
      
      if (response.data.code === 0) {
        setSchools(response.data.data.items);
        setTotalRecords(response.data.data.totalRecords);
        setError('');
      } else {
        setError('Failed to fetch schools data');
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      setError('Không thể tải danh sách trường');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [currentPage, pageSize]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
    }}>
      {/* Header Section */}
      <Box sx={{ 
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        py: 3,
        px: 4,
        mb: 4
      }}>
        <Box sx={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SchoolIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Quản lý trường học
              </Typography>
              <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                Hệ thống quản lý thông tin trường học
              </Typography>
            </Box>
          </Box>
          {totalRecords === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                px: 3,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Thêm trường mới
            </Button>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        px: 4,
      }}>
        {/* error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) */}

        {/* Search and Stats Section */}
        <Box sx={{ mb: 4 }}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            backgroundColor: theme.palette.background.paper,
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 3
              }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Chip
                    icon={<SchoolIcon />}
                    label={`Tổng số: ${totalRecords} trường`}
                    color="primary"
                    variant="outlined"
                  />
                  <IconButton 
                    onClick={fetchSchools}
                    sx={{ 
                      backgroundColor: theme.palette.action.hover,
                      '&:hover': { backgroundColor: theme.palette.action.selected }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Table Section */}
        <Paper sx={{ 
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Tên trường</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Mô tả</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Địa chỉ</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Phường/Xã</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Quận/Huyện</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Thành phố</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : schools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <SchoolIcon sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
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
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: theme.palette.action.hover,
                          transition: 'background-color 0.2s'
                        }
                      }}
                    >
                      <TableCell>
                        <Chip 
                          label={school.schoolId}
                          size="small"
                          sx={{ 
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.primary.dark,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                          {school.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {school.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                          <Typography variant="body2" color="text.primary">{school.address}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>{school.ward}</TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>{school.district}</TableCell>
                      <TableCell>
                        <Chip 
                          label={school.city}
                          size="small"
                          sx={{ 
                            backgroundColor: theme.palette.success.light,
                            color: theme.palette.success.dark
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton 
                            size="small"
                            sx={{ 
                              color: theme.palette.primary.main,
                              '&:hover': { backgroundColor: theme.palette.action.hover }
                            }}
                          >
                          </IconButton>
                          <IconButton 
                            size="small"
                            sx={{
                              color: theme.palette.error.main,
                              '&:hover': { backgroundColor: theme.palette.action.hover }
                            }}
                            onClick={() => handleDeleteSchool(school.schoolId)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pagination Info */}
        <Box sx={{ 
          mt: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
        </Box>
      </Box>
    </Box>
  );
};

export default Schools; 