// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//     Box,
//     Typography,
//     Paper,
//     Container,
//     CircularProgress,
//     Alert,
//     Divider,
//     Chip,
//     IconButton,
//     Card,
//     CardContent,
//     Grid,
//     Accordion,
//     AccordionSummary,
//     AccordionDetails,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Button,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import {
//     ImportContacts as ImportContactsIcon,
//     ExpandMore as ExpandMoreIcon,
//     MenuBook as MenuBookIcon,
//     Assignment as AssignmentIcon,
//     ArrowBack as ArrowBackIcon,
//     School as SchoolIcon,
// } from '@mui/icons-material';

// // Color palette for consistency
// const COLORS = {
//     primary: '#06A9AE',
//     secondary: '#1976d2',
//     success: '#00AB55',
//     error: '#FF4842',
//     warning: '#FFAB00',
//     background: {
//         default: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
//         paper: '#FFFFFF',
//         secondary: 'rgba(6, 169, 174, 0.02)',
//     },
//     text: {
//         primary: '#212B36',
//         secondary: '#637381',
//     },
//     hover: {
//         primary: 'rgba(6, 169, 174, 0.08)',
//         secondary: 'rgba(25, 118, 210, 0.08)',
//     }
// };

// // Styled components
// const DashboardCard = styled(Card)({
//     borderRadius: 12,
//     boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
//     transition: 'all 0.3s ease',
//     height: '100%',
//     background: COLORS.background.paper,
// });

// const CardHeader = styled(Box)(({ bgcolor }) => ({
//     padding: '16px',
//     background: bgcolor || COLORS.primary,
//     color: '#fff',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
// }));

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     fontWeight: 'bold',
//     backgroundColor: COLORS.background.secondary,
//     border: `1px solid ${theme.palette.grey[300]}`,
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     '&:hover': {
//         backgroundColor: theme.palette.action.hover,
//     },
//     border: `1px solid ${theme.palette.grey[300]}`,
// }));

// const InfoChip = styled(Chip)({
//     margin: '4px 4px 4px 0',
//     borderRadius: 12,
//     backgroundColor: 'rgba(6, 169, 174, 0.08)',
//     color: COLORS.primary,
//     '.MuiChip-icon': {
//         color: COLORS.primary,
//     }
// });

// // Styled Button component
// const StyledButton = styled(Button)({
//     borderRadius: 8,
//     padding: '8px 16px',
//     fontWeight: 600,
//     textTransform: 'none',
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
//     transition: 'all 0.2s ease',
//     '&:hover': {
//         transform: 'translateY(-2px)',
//         boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
//     },
//     '&.MuiButton-contained': {
//         backgroundColor: COLORS.primary,
//         color: '#fff',
//         '&:hover': {
//             backgroundColor: COLORS.primary,
//         }
//     },
//     '&.MuiButton-outlined': {
//         borderColor: COLORS.primary,
//         color: COLORS.primary,
//         '&:hover': {
//             backgroundColor: 'rgba(6, 169, 174, 0.08)',
//             borderColor: COLORS.primary
//         }
//     }
// });

// const FilterButton = styled(Button)(({ active, isReject }) => {
//     // Convert isReject to a string or use the boolean value in JavaScript context only
//     const isRejectStr = String(isReject); // Convert to string
//     return {
//         borderRadius: 16,
//         padding: '12px 24px',
//         textTransform: 'none',
//         backgroundColor: active ? (isReject ? COLORS.error : COLORS.primary) : 'rgba(255, 255, 255, 0.8)',
//         color: active ? '#fff' : isReject ? COLORS.error : COLORS.text.primary,
//         fontWeight: 600,
//         fontSize: '1.1rem',
//         boxShadow: active ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
//         '&:hover': {
//             backgroundColor: active ? (isReject ? COLORS.error : COLORS.primary) : (isReject ? 'rgba(255, 72, 66, 0.1)' : 'rgba(255, 255, 255, 0.9)'),
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//         },
//     };
// });

// const CurriculumDetail = ({ sidebarOpen }) => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [curriculum, setCurriculum] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const sidebarWidth = sidebarOpen ? 240 : 60;

//     useEffect(() => {
//         const fetchCurriculumDetail = async () => {
//             try {
//                 setLoading(true);
//                 const accessToken = localStorage.getItem('accessToken');

//                 if (!accessToken) {
//                     throw new Error('Vui lòng đăng nhập để xem nội dung cần đạt.');
//                 }

//                 const response = await axios.get(
//                     `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/${id}`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${accessToken}`
//                         }
//                     }
//                 );

//                 if (response.data.code === 0) {
//                     setCurriculum(response.data.data);
//                 } else {
//                     throw new Error(response.data.message || 'Không thể tải dữ liệu.');
//                 }
//             } catch (err) {
//                 console.error('Error fetching curriculum detail:', err);
//                 setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchCurriculumDetail();
//         }
//     }, [id]);

//     const handleBackClick = () => {
//         navigate('/manager/curriculum-framework');
//     };

//     // Group curriculum details by topic
//     const groupedByTopic = curriculum?.curriculumDetails?.reduce((acc, detail) => {
//         if (!acc[detail.curriculumTopic]) {
//             acc[detail.curriculumTopic] = [];
//         }
//         acc[detail.curriculumTopic].push(detail);
//         return acc;
//     }, {}) || {};

//     if (loading) {
//         return (
//             <Box
//                 sx={{
//                     width: '100%',
//                     height: '100vh',
//                     background: COLORS.background.default,
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     position: 'fixed',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     zIndex: 1100
//                 }}
//             >
//                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//                     <CircularProgress size={50} sx={{ color: COLORS.primary }} />
//                     <Typography variant="body1" sx={{ color: COLORS.text.secondary }}>
//                         Đang tải dữ liệu nội dung cần đạt...
//                     </Typography>
//                 </Box>
//             </Box>
//         );
//     }

//     return (
//         <Box
//             sx={{
//                 width: '100%',
//                 height: '100vh',
//                 background: COLORS.background.default,
//                 position: 'fixed',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 overflow: 'auto',
//                 zIndex: 1100,
//                 paddingTop: 0,
//             }}
//         >
//             <Box sx={{ py: 6, px: { xs: 3, md: 5 } }}>
//                 <Container maxWidth="lg">
//                     <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                             <IconButton
//                                 onClick={handleBackClick}
//                                 sx={{
//                                     mr: 2,
//                                     bgcolor: 'rgba(6, 169, 174, 0.08)',
//                                     '&:hover': { bgcolor: 'rgba(6, 169, 174, 0.15)' },
//                                 }}
//                             >
//                                 <ArrowBackIcon sx={{ color: COLORS.primary }} />
//                             </IconButton>
//                             <ImportContactsIcon sx={{ fontSize: 36, color: COLORS.primary, mr: 2 }} />
//                             <Box>
//                                 <Typography variant="h4" sx={{
//                                     fontWeight: 700,
//                                     color: COLORS.text.primary,
//                                     lineHeight: 1.2,
//                                 }}>
//                                     Nội dung cần đạt
//                                 </Typography>
//                                 <Typography variant="subtitle1" sx={{
//                                     color: COLORS.text.secondary,
//                                     mt: 0.5,
//                                 }}>
//                                     {curriculum?.name}
//                                 </Typography>
//                             </Box>
//                         </Box>
//                         <StyledButton
//                             variant="outlined"
//                             color="primary"
//                             onClick={handleBackClick}
//                             startIcon={<ArrowBackIcon />}
//                         >
//                             Quay lại
//                         </StyledButton>
//                     </Box>

//                     {error && (
//                         <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
//                     )}

//                     {!error && curriculum && (
//                         <>
//                             <DashboardCard sx={{ mb: 4 }}>
//                                 <CardHeader>
//                                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                         <MenuBookIcon sx={{ mr: 1 }} />
//                                         <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                                             Thông tin chung
//                                         </Typography>
//                                     </Box>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <Grid container spacing={3}>
//                                         <Grid item xs={12} md={6}>
//                                             <Typography variant="subtitle1" sx={{ color: COLORS.text.secondary, mb: 1 }}>
//                                                 Tên chương trình:
//                                             </Typography>
//                                             <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
//                                                 {curriculum.name}
//                                             </Typography>

//                                             <Typography variant="subtitle1" sx={{ color: COLORS.text.secondary, mb: 1 }}>
//                                                 Mô tả:
//                                             </Typography>
//                                             <Typography variant="body1" sx={{ mb: 2 }}>
//                                                 {curriculum.description}
//                                             </Typography>
//                                         </Grid>
//                                         <Grid item xs={12} md={6}>
//                                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
//                                                 <InfoChip
//                                                     icon={<SchoolIcon />}
//                                                     label={`Năm học: ${curriculum.year}`}
//                                                 />
//                                                 <InfoChip
//                                                     icon={<AssignmentIcon />}
//                                                     label={`Tổng số tiết: ${curriculum.totalPeriods}`}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                     </Grid>
//                                 </CardContent>
//                             </DashboardCard>

//                             <DashboardCard sx={{ mb: 4 }}>
//                                 <CardHeader>
//                                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                         <AssignmentIcon sx={{ mr: 1 }} />
//                                         <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                                             Nội dung cần đạt
//                                         </Typography>
//                                     </Box>
//                                 </CardHeader>
//                                 <CardContent>
//                                     {Object.keys(groupedByTopic).length > 0 ? (
//                                         Object.entries(groupedByTopic).map(([topic, details], topicIndex) => (
//                                             <Accordion
//                                                 key={topicIndex}
//                                                 defaultExpanded={topicIndex === 0}
//                                                 sx={{
//                                                     mb: 2,
//                                                     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
//                                                     '&:before': { display: 'none' },
//                                                     borderRadius: '12px',
//                                                     overflow: 'hidden',
//                                                 }}
//                                             >
//                                                 <AccordionSummary
//                                                     expandIcon={<ExpandMoreIcon />}
//                                                     sx={{
//                                                         backgroundColor: 'rgba(6, 169, 174, 0.08)',
//                                                         '&.Mui-expanded': {
//                                                             minHeight: '48px',
//                                                         }
//                                                     }}
//                                                 >
//                                                     <Typography sx={{ fontWeight: 600, color: COLORS.primary }}>
//                                                         {topic}
//                                                     </Typography>
//                                                 </AccordionSummary>
//                                                 <AccordionDetails sx={{ p: 0 }}>
//                                                     <TableContainer component={Paper} elevation={0}>
//                                                         <Table sx={{ minWidth: 650 }}>
//                                                             <TableHead>
//                                                                 <TableRow>
//                                                                     <StyledTableCell>Chủ đề</StyledTableCell>
//                                                                     <StyledTableCell>Mạch nội dung</StyledTableCell>
//                                                                     <StyledTableCell>Nội dung</StyledTableCell>
//                                                                     <StyledTableCell>Yêu cầu cần đạt</StyledTableCell>
//                                                                 </TableRow>
//                                                             </TableHead>
//                                                             <TableBody>
//                                                                 {details.map((detail) => (
//                                                                     <StyledTableRow key={detail.curriculumDetailId}>
//                                                                         <TableCell>{detail.curriculumSection}</TableCell>
//                                                                         <TableCell>{detail.curriculumSubSection}</TableCell>
//                                                                         <TableCell sx={{ whiteSpace: 'pre-line' }}>{detail.curriculumContent}</TableCell>
//                                                                         <TableCell sx={{ whiteSpace: 'pre-line' }}>{detail.curriculumGoal}</TableCell>
//                                                                     </StyledTableRow>
//                                                                 ))}
//                                                             </TableBody>
//                                                         </Table>
//                                                     </TableContainer>
//                                                 </AccordionDetails>
//                                             </Accordion>
//                                         ))
//                                     ) : (
//                                         <Typography sx={{ textAlign: 'center', color: COLORS.text.secondary, py: 4 }}>
//                                             Không có dữ liệu nội dung cần đạt.
//                                         </Typography>
//                                     )}
//                                 </CardContent>
//                             </DashboardCard>

//                             {curriculum.curriculumActivities && curriculum.curriculumActivities.length > 0 && (
//                                 <DashboardCard>
//                                     <CardHeader>
//                                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                             <SchoolIcon sx={{ mr: 1 }} />
//                                             <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                                                 Hoạt động giáo dục
//                                             </Typography>
//                                         </Box>
//                                     </CardHeader>
//                                     <CardContent>
//                                         {curriculum.curriculumActivities.map((activity, index) => (
//                                             <Box key={activity.curriculumActivityId} sx={{ mb: 2 }}>
//                                                 <Typography
//                                                     variant="subtitle1"
//                                                     sx={{
//                                                         fontWeight: 600,
//                                                         mb: 1,
//                                                         display: 'flex',
//                                                         alignItems: 'center'
//                                                     }}
//                                                 >
//                                                     <Box
//                                                         component="span"
//                                                         sx={{
//                                                             bgcolor: COLORS.primary,
//                                                             color: 'white',
//                                                             display: 'inline-flex',
//                                                             alignItems: 'center',
//                                                             justifyContent: 'center',
//                                                             width: 24,
//                                                             height: 24,
//                                                             borderRadius: '50%',
//                                                             mr: 1,
//                                                             fontSize: 14
//                                                         }}
//                                                     >
//                                                         {index + 1}
//                                                     </Box>
//                                                     Hoạt động {index + 1}
//                                                 </Typography>
//                                                 <Typography variant="body1" sx={{ pl: 4, whiteSpace: 'pre-line' }}>
//                                                     {activity.curriculumAcitityDescription}
//                                                 </Typography>
//                                                 {index < curriculum.curriculumActivities.length - 1 && (
//                                                     <Divider sx={{ my: 2 }} />
//                                                 )}
//                                             </Box>
//                                         ))}
//                                     </CardContent>
//                                 </DashboardCard>
//                             )}

//                             <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
//                                 <StyledButton
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={handleBackClick}
//                                     startIcon={<ArrowBackIcon />}
//                                     sx={{ minWidth: 200 }}
//                                 >
//                                     Quay lại trang chương trình
//                                 </StyledButton>
//                             </Box>
//                         </>
//                     )}
//                 </Container>
//             </Box>
//         </Box>
//     );
// };

// export default CurriculumDetail;
