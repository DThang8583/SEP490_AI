import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, Button, Grid, Fade, IconButton, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowBack, Fullscreen, FullscreenExit, Download } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDSf6v2-ynUdw6IS7Ac_2cSOJN7-g12c7k";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SlidePreview = () => {
  const deckRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { lessonData } = location.state || {};
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const slideRef = useRef();
  const [images, setImages] = useState({
    introduction: null,
    warmup: null,
    practice: null,
    application: null,
    game: null,
    closing: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [slideContent, setSlideContent] = useState({
    introduction: '',
    warmup: '',
    practice: '',
    application: '',
    game: '',
    closing: ''
  });

  useEffect(() => {
    const onFullScreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, []);

  // Function to generate images using Gemini API
  const generateImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
Tạo MỘT ảnh minh họa hoặc hình nền ĐỘC LẬP cho mỗi mục trong danh sách được đánh số dưới đây. Các ảnh nên có phong cách hoạt hình giáo dục, tươi sáng, hấp dẫn và thân thiện, tương tự như ảnh ví dụ được cung cấp. Sử dụng phong cách minh họa nhất quán xuyên suốt.

**QUAN TRỌNG: KHÔNG ĐƯỢC ĐƯA BẤT KỲ VĂN BẢN, SỐ, KÝ HIỆU HOẶC CHỮ CÁI NÀO VÀO TRONG ẢNH ĐƯỢC TẠO RA. Ảnh CHỈ chứa các yếu tố hình ảnh minh họa.**

--- BẮT ĐẦU DANH SÁCH CÁC ẢNH CẦN TẠO ---

1. Ảnh minh họa/hình nền giới thiệu cho bài học có tiêu đề '${lessonData.lesson}'.

2. Ảnh minh họa/hình nền cho Hoạt động Khởi động dựa trên nội dung: "${lessonData.startUp}".

3. Ảnh minh họa/hình nền cho Hoạt động Luyện tập Thực hành dựa trên nội dung: "${lessonData.practice}".

4. Ảnh minh họa/hình nền cho Hoạt động Vận dụng dựa trên nội dung: "${lessonData.apply}".

5. Ảnh minh họa/hình nền cho một trò chơi giáo dục ngẫu nhiên, vui nhộn và thân thiện với học sinh tiểu học, lấy cảm hứng từ chủ đề bài học "${lessonData.lesson}" và phong cách hoạt hình của ảnh ví dụ đồng hồ (chỉ bối cảnh game, không có bất kỳ chữ/số nào).

6. Ảnh minh họa/hình nền cho thông điệp kết thúc 'Chúc các em học tốt!'.

--- KẾT THÚC DANH SÁT CÁC ẢNH CẦN TẠO ---

Quan trọng: Đảm bảo các ảnh có chung một phong cách hoạt hình giáo dục, thân thiện, nhất quán với màu sắc tươi sáng, tương tự như phong cách của ảnh ví dụ được cung cấp.`
            }]
          }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        })
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0].content.parts) {
        const images = data.candidates[0].content.parts
          .filter(part => part.inlineData && part.inlineData.mimeType.startsWith('image/'))
          .map(part => `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);

        // Assign images to the correct state properties based on their order in the prompt
        // The order should correspond to the numbered list in the prompt
        setImages({
          introduction: images[0] || null, 
          warmup: images[1] || null,       
          practice: images[2] || null,     
          application: images[3] || null,  
          game: images[4] || null,         
          closing: images[5] || null       
        });
      } else {
        // If no images are generated but the call was successful, it might be an issue with the prompt or model capabilities
        setError('API call successful, but no images were generated. The prompt might be too complex or specific or there was an internal API issue.');
        console.warn('API response did not contain images:', data);
      }
    } catch (error) {
      console.error('Error generating images:', error);
      setError(`Failed to generate images: ${error.message}. Please check the API key and try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate text content using Gemini API
  const generateTextContent = async () => {
    setLoading(true);
    try {
      const prompt = `
Bạn là một giáo viên đang chuẩn bị nội dung cho các slide trình bày Giáo án Toán cho học sinh tiểu học.
Nội dung Giáo án được cung cấp dưới đây. Hãy chuyển đổi nội dung này thành các điểm trình bày trên slide, tập trung vào:
- Các câu hỏi hoặc nhiệm vụ trực tiếp gửi đến học sinh.
- Các bài tập hoặc hoạt động mà học sinh sẽ thực hiện.
- Những kiến thức/kết quả chính cần ghi nhớ sau mỗi hoạt động (nếu có).

Loại bỏ hoàn toàn các hướng dẫn dành cho giáo viên (ví dụ: "Giáo viên đặt câu hỏi", "Học sinh trả lời", "Giáo viên khái quát lại") và các mục tiêu hay cách tiến hành chi tiết của giáo án.
Chỉ giữ lại nội dung cốt lõi mà học sinh sẽ thấy và tương tác trên slide.
Đảm bảo ngôn ngữ đơn giản, trực tiếp, phù hợp với học sinh tiểu học.

Bài học: "${lessonData.lesson}"

Nội dung chi tiết các hoạt động:

1. Hoạt động Khởi động:
${lessonData.startUp}

2. Hoạt động Luyện tập:
${lessonData.practice}

3. Hoạt động Vận dụng:
${lessonData.apply}

Định dạng đầu ra:
Bắt đầu nội dung cho mỗi hoạt động bằng một thẻ đánh dấu duy nhất:
[[WARMUP]] cho Hoạt động Khởi động
[[PRACTICE]] cho Hoạt động Luyện tập
[[APPLICATION]] cho Hoạt động Vận dụng
Sử dụng gạch đầu dòng (-) cho các điểm hoặc nhiệm vụ riêng biệt trong mỗi phần.

Ví dụ chuyển đổi (dựa trên ví dụ bạn đã cung cấp):
Từ giáo án: "Hoạt động Khởi động\n• Giáo viên đặt câu hỏi: "Số 85 000 đọc như thế nào? Em hãy cho ví dụ về một số lượng có thể biểu diễn bằng số 85 000 trong thực tế (ví dụ: số tiền, số lượng học sinh của một trường học lớn…)"\n• Học sinh trả lời câu hỏi, thảo luận và đưa ra ví dụ\n• Giáo viên khái quát lại kiến thức về cách đọc, viết số có năm chữ số"\nThành nội dung slide:\n"- Số 85 000 đọc là gì?\n- Hãy lấy ví dụ về số lượng khoảng 85 000 trong thực tế\n- Cách đọc, viết số có năm chữ số"\nÁp dụng cách chuyển đổi này cho nội dung bài học được cung cấp.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Split the generated content into sections using markers
      const warmupMatch = text.indexOf('[[WARMUP]]');
      const practiceMatch = text.indexOf('[[PRACTICE]]');
      const applicationMatch = text.indexOf('[[APPLICATION]]');

      let warmupContent = '';
      let practiceContent = '';
      let applicationContent = '';

      // Extract content based on markers
      if (warmupMatch !== -1) {
        const end = practiceMatch !== -1 ? practiceMatch : applicationMatch !== -1 ? applicationMatch : text.length;
        warmupContent = text.substring(warmupMatch + '[[WARMUP]]'.length, end).trim();
      }

      if (practiceMatch !== -1) {
        const end = applicationMatch !== -1 ? applicationMatch : text.length;
        practiceContent = text.substring(practiceMatch + '[[PRACTICE]]'.length, end).trim();
      }

      if (applicationMatch !== -1) {
        applicationContent = text.substring(applicationMatch + '[[APPLICATION]]'.length).trim();
      }

      setSlideContent({
        introduction: `Tiêu đề: ${lessonData.lesson}\nChủ đề: ${lessonData.module}`,
        warmup: warmupContent,
        practice: practiceContent,
        application: applicationContent,
        game: 'Trò chơi giáo dục',
        closing: 'Chúc các em học tốt!'
      });
    } catch (error) {
      console.error('Error generating text content:', error);
      setError(`Failed to generate text content: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lessonData) {
      generateImages();
      generateTextContent();
    }
  }, [lessonData]);

  if (!lessonData) return null;

  const formatSlideContent = (content) => {
    if (!content) return '';

    // Split content into lines and process each line
    const lines = content.split('\n').map(line => line.trim()).filter(Boolean);

    // Format lines with bullet points or paragraphs, removing instructional slide markers
    return lines
      .filter(line => !line.startsWith('**Slide') && !line.startsWith('*Slide')) // Remove lines starting with **Slide or *Slide
      .map(line => {
      if (line.startsWith('-')) {
        return `<p class="slide-point">• ${line.substring(1).trim()}</p>`;
      }
      // Add basic paragraph formatting for other lines
      return `<p class="slide-content">${line}</p>`;
    }).join('');
  };

  // Helper function to split goal and quality
  const splitGoalAndQuality = (goalText) => {
    if (!goalText) return { mainGoal: '', quality: '' };
    const qualityHeader = "c) Phẩm chất:";
    const index = goalText.toLowerCase().indexOf(qualityHeader.toLowerCase());
    if (index !== -1) {
      return {
        mainGoal: goalText.substring(0, index).trim(),
        quality: goalText.substring(index + qualityHeader.length).trim()
      };
    }
    return { mainGoal: goalText, quality: '' };
  };

  const { mainGoal, quality } = splitGoalAndQuality(lessonData.goal);

  const slides = [
    {
      title: 'Tiêu đề',
      content: (
        <Box sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          p: 2
        }}>
          {/* Background Image */}
          {loading ? (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : images.introduction && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${images.introduction})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '12px',
                zIndex: 0,
              }}
            />
          )}
          {/* Content Overlay */}
          <Box sx={{
            position: 'relative',
            zIndex: 1,
            color: images.introduction ? '#000' : 'inherit',
            textShadow: images.introduction ? '1px 1px 3px rgba(255,255,255,0.8)' : 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            p: 3,
            maxWidth: '80%',
          }}>
            <Typography variant="h2" color="primary" fontWeight={700} gutterBottom>
              {lessonData.lesson}
            </Typography>
            <Typography variant="h5" color="info.main" gutterBottom>
              Chủ đề: {lessonData.module}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Ngày tạo: {new Date(lessonData.createdAt).toLocaleDateString('vi-VN')}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      title: 'Hoạt động Khởi động',
      content: (
        <Box sx={{
          position: 'relative', // Ensure positioning context for absolute children
          width: '100%', 
          height: '100%', 
          p: 2
        }}>
          {/* Background Image */}
          {loading ? (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : images.warmup && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%', 
                height: '100%', 
                backgroundImage: `url(${images.warmup})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '12px',
                zIndex: 0,
              }}
            />
          )}
          {/* Content Overlay */}
          <Box sx={{ 
            position: 'relative', // Ensure content is above image
            zIndex: 1, 
            color: images.warmup ? '#000' : 'inherit',
            textShadow: images.warmup ? '1px 1px 3px rgba(255,255,255,0.8)' : 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            p: 3,
            width: '100%', // Take full width of parent (minus padding)
            height: '100%', // Take full height of parent (minus padding)
            display: 'flex', // Use flexbox for content arrangement
            flexDirection: 'column',
            // maxHeight: '80vh', // Remove maxHeight to allow scaling
            overflowY: 'auto', // Keep overflowY for potential long content
            maxWidth: '90%', // Limit maximum width
            margin: 'auto', // Center horizontally
          }}>
            <Typography variant="h4" color="primary" fontWeight={600} gutterBottom>
              Hoạt động Khởi động
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}> {/* Allow content area to grow and be scrollable */}
              <div dangerouslySetInnerHTML={{ __html: formatSlideContent(slideContent.warmup) }} />
            </Box>
          </Box>
        </Box>
      )
    },
    {
      title: 'Hoạt động Luyện tập',
      content: (
        <Box sx={{
          position: 'relative', // Ensure positioning context for absolute children
          width: '100%', 
          height: '100%', 
          p: 2
        }}>
          {/* Background Image */}
          {loading ? (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : images.practice && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${images.practice})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '12px',
                zIndex: 0,
              }}
            />
          )}
          {/* Content Overlay */}
          <Box sx={{ 
            position: 'relative', // Ensure content is above image
            zIndex: 1, 
            color: images.practice ? '#000' : 'inherit',
            textShadow: images.practice ? '1px 1px 3px rgba(255,255,255,0.8)' : 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            p: 3,
            width: '100%', // Take full width of parent (minus padding)
            height: '100%', // Take full height of parent (minus padding)
            display: 'flex', // Use flexbox for content arrangement
            flexDirection: 'column',
            // maxHeight: '80vh', // Remove maxHeight to allow scaling
            overflowY: 'auto', // Keep overflowY for potential long content
            maxWidth: '90%', // Limit maximum width
            margin: 'auto', // Center horizontally
          }}>
            <Typography variant="h4" color="primary" fontWeight={600} gutterBottom>
              Hoạt động Luyện tập
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}> {/* Allow content area to grow and be scrollable */}
              <div dangerouslySetInnerHTML={{ __html: formatSlideContent(slideContent.practice) }} />
            </Box>
          </Box>
        </Box>
      )
    },
    {
      title: 'Hoạt động Vận dụng',
      content: (
        <Box sx={{
          position: 'relative', // Ensure positioning context for absolute children
          width: '100%', 
          height: '100%', 
          p: 2
        }}>
          {/* Background Image */}
          {loading ? (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : images.application && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${images.application})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '12px',
                zIndex: 0,
              }}
            />
          )}
          {/* Content Overlay */}
          <Box sx={{ 
            position: 'relative', // Ensure content is above image
            zIndex: 1, 
            color: images.application ? '#000' : 'inherit',
            textShadow: images.application ? '1px 1px 3px rgba(255,255,255,0.8)' : 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            p: 3,
            width: '100%', // Take full width of parent (minus padding)
            height: '100%', // Take full height of parent (minus padding)
            display: 'flex', // Use flexbox for content arrangement
            flexDirection: 'column',
            // maxHeight: '80vh', // Remove maxHeight to allow scaling
            overflowY: 'auto', // Keep overflowY for potential long content
            maxWidth: '90%', // Limit maximum width
            margin: 'auto', // Center horizontally
          }}>
            <Typography variant="h4" color="primary" fontWeight={600} gutterBottom>
              Hoạt động Vận dụng
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}> {/* Allow content area to grow and be scrollable */}
              <div dangerouslySetInnerHTML={{ __html: formatSlideContent(slideContent.application) }} />
            </Box>
          </Box>
        </Box>
      )
    },
    {
      title: 'Trò chơi',
      content: (
        <Box sx={{
          position: 'relative',
          width: '100%', 
          height: '100%', 
          p: 2
        }}>
          {/* Background Image */}
          {loading ? (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : images.game && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${images.game})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '12px',
                zIndex: 0,
              }}
            />
          )}
          {/* Content Overlay */}
          <Box sx={{ 
            position: 'relative', // Ensure content is above image
            zIndex: 1, 
            color: images.game ? '#000' : 'inherit',
            textShadow: images.game ? '1px 1px 3px rgba(255,255,255,0.8)' : 'none',
            // Add flex properties to center content
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%', // Take full width
            height: '100%', // Take full height
            p: 3, // Add some padding inside the content box
            backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent background
            borderRadius: '8px',
          }}>
             <Typography variant="h4" color="primary" fontWeight={600} gutterBottom>
              Trò chơi
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      title: 'Kết thúc',
      content: (
         <Box sx={{
          position: 'relative',
          width: '100%', 
          height: '100%', 
          p: 2
        }}>
          {/* Background Image */}
          {loading ? (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : images.closing && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${images.closing})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '12px',
                zIndex: 0,
              }}
            />
          )}
          {/* Content Overlay */}
          <Box sx={{ 
            position: 'relative', // Ensure content is above image
            zIndex: 1, 
            color: images.closing ? '#000' : 'inherit',
            textShadow: images.closing ? '1px 1px 3px rgba(255,255,255,0.8)' : 'none',
            // Add flex properties to center content
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%', // Take full width
            height: '100%', // Take full height
            p: 3, // Add some padding inside the content box
            backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent background
            borderRadius: '8px',
          }}>
            <Typography variant="h4" color="primary" fontWeight={600} gutterBottom>
              Chúc các em học tốt!
            </Typography>
          </Box>
        </Box>
      )
    }
  ];

  // Slide transition effect
  const SlideContent = ({ children }) => (
    <Fade in timeout={400} key={current}>
      <div>{children}</div>
    </Fade>
  );

  // Export current slide to PDF
  const handleExportPDF = async () => {
    if (!slideRef.current) return;
    const canvas = await html2canvas(slideRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${slides[current].title}.pdf`);
  };

  // Fullscreen presentation
  const handleFullscreen = () => {
    if (!slideRef.current) return;
    if (!fullscreen) {
      if (slideRef.current.requestFullscreen) slideRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // Update styles for better content formatting
  const slideStyles = `
    .slide-section {
      margin: 16px 0;
    }
    .slide-heading {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1976d2;
      margin-bottom: 16px;
    }
    .slide-subheading {
      font-size: 1.2rem;
      font-weight: 500;
      color: #1976d2;
      margin: 12px 0 8px 0;
    }
    .slide-point {
      margin: 8px 0;
      padding-left: 20px;
      position: relative;
      line-height: 1.5;
    }
    .slide-point:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #1976d2;
    }
    .slide-content {
      margin: 8px 0;
      line-height: 1.5;
    }
  `;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <style>{slideStyles}</style>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4 }}
      >
        Quay lại
      </Button>
      <Grid container spacing={2}>
        {/* Slide list on the left */}
        <Grid item xs={2}>
          <Box>
            {slides.map((slide, idx) => (
              <Box
                key={idx}
                sx={{
                  border: idx === current ? '2px solid #1976d2' : '1px solid #ccc',
                  borderRadius: 2,
                  mb: 2,
                  p: 1,
                  cursor: 'pointer',
                  background: idx === current ? '#e3f2fd' : '#fff',
                  transition: 'all 0.2s'
                }}
                onClick={() => setCurrent(idx)}
              >
                <Typography variant="subtitle2" fontWeight={idx === current ? 700 : 400}>
                  {slide.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Main slide on the right */}
        <Grid item xs={10}>
          <Box
            ref={slideRef}
            sx={{
              minHeight: 400,
              border: '2px solid #1976d2',
              borderRadius: 3,
              p: 4,
              background: '#fff',
              boxShadow: '0 4px 16px rgba(25, 118, 210, 0.08)',
              position: 'relative',
            }}
          >
            <SlideContent>{slides[current].content}</SlideContent>
            {/* Presentation and download buttons */}
            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
              <IconButton onClick={handleFullscreen} title="Trình chiếu">
                {fullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
              <IconButton onClick={handleExportPDF} title="Tải xuống PDF">
                <Download />
              </IconButton>
            </Box>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
              variant="outlined"
            >
              Trước
            </Button>
            <Button
              disabled={current === slides.length - 1}
              onClick={() => setCurrent(current + 1)}
              variant="contained"
            >
              Tiếp
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SlidePreview;
