// src/pages/Admin/CreateAccount.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
} from '@mui/material';
import axios from 'axios';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    roleId: '',
    schoolId: '',
    gradeId: '',
  });

  const [schools, setSchools] = useState([]);
  const [grades, setGrades] = useState([]);
  const [roles, setRoles] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch schools
        const schoolsResponse = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/schools?Page=1&PageSize=10'
        );
        if (schoolsResponse.data?.code === 0) {
          setSchools(schoolsResponse.data.data.items);
        }

        // Fetch grades
        const gradesResponse = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades'
        );
        if (gradesResponse.data?.code === 0) {
          setGrades(gradesResponse.data.data);
        }

        // Fetch roles
        const rolesResponse = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/roles'
        );
        if (rolesResponse.data?.code === 0) {
          setRoles(rolesResponse.data.data);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert string IDs to numbers
      const submitData = {
        ...formData,
        roleId: parseInt(formData.roleId),
        schoolId: parseInt(formData.schoolId),
        gradeId: parseInt(formData.gradeId),
      };

      const response = await axios.post(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users',
        submitData
      );
      if (response.data.code === 0) {
        setSuccess('Tài khoản đã được tạo thành công!');
        setFormData({
          username: '',
          password: '',
          email: '',
          roleId: '',
          schoolId: '',
          gradeId: '',
        });
      } else {
        setError('Có lỗi xảy ra khi tạo tài khoản.');
      }
    } catch (err) {
      setError('Không thể tạo tài khoản. Vui lòng thử lại sau.');
      console.error('Error creating account:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Tạo Tài Khoản Mới
      </Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  label="Vai trò"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Trường học</InputLabel>
                <Select
                  name="schoolId"
                  value={formData.schoolId}
                  onChange={handleChange}
                  label="Trường học"
                >
                  {schools.map((school) => (
                    <MenuItem key={school.schoolId} value={school.schoolId}>
                      {school.name} - {school.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Khối</InputLabel>
                <Select
                  name="gradeId"
                  value={formData.gradeId}
                  onChange={handleChange}
                  label="Khối"
                >
                  {grades.map((grade) => (
                    <MenuItem key={grade.gradeId} value={grade.gradeId}>
                      Khối {grade.gradeNumber}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large">
                Tạo Tài Khoản
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateAccount;