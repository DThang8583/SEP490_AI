import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, Button, Grid, Fade, IconButton, CircularProgress, Backdrop } from '@mui/material';
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
  const [analyzedContents, setAnalyzedContents] = useState({
    introduction: '',
    warmup: '',
    practice: '',
    application: '',
    game: '',
    closing: ''
  });
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const onFullScreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, []);

  // Add new function to analyze content
  const analyzeContent = async (content) => {
    try {
      // First analysis to understand the content
      const initialPrompt = `Phân tích nội dung sau và xác định loại nội dung chính. Trả về một trong các loại sau:
1. SO_SANH - nếu là bài toán so sánh số
2. PHEP_TINH - nếu là bài toán cộng/trừ/nhân/chia
3. PHAN_SO - nếu là bài toán phân số
4. HINH_HOC - nếu là bài toán hình học
5. DAI_LUONG - nếu là bài toán đại lượng
6. THAO_LUAN - nếu có hoạt động nhóm
7. VI_DU - nếu có ví dụ thực tế
8. TRO_CHOI - nếu có trò chơi
9. THI_NGHIEM - nếu có thí nghiệm
10. BIEU_DO - nếu có biểu đồ/bảng
11. DOC_SO - nếu là câu hỏi về cách đọc/viết số
12. NHIEU_BAI - nếu có nhiều bài tập khác nhau
13. TRO_CHOI_TINH - nếu là trò chơi tính toán

Nội dung cần phân tích:
${content}`;

      const initialResult = await model.generateContent(initialPrompt);
      const contentType = initialResult.response.text().trim();

      // Second analysis based on content type
      let finalPrompt = '';
      switch(contentType) {
        case 'NHIEU_BAI':
          finalPrompt = `Từ nội dung sau, xác định các loại bài tập chính và trả về dạng "[loại bài 1] - [loại bài 2]". Ví dụ: "so sánh số - phép tính". Nội dung:
${content}`;
          break;
        case 'TRO_CHOI_TINH':
          finalPrompt = `Từ nội dung sau, mô tả ngắn gọn trò chơi tính toán, trả về dạng "[tên trò chơi] - [loại phép tính]". Ví dụ: "Thi tính nhanh - phép cộng trừ". Nội dung:
${content}`;
          break;
        case 'DOC_SO':
          finalPrompt = `Từ nội dung sau, trích xuất số và một ví dụ thực tế, trả về dạng "[số] - [ví dụ thực tế]". Ví dụ: "85000 - số học sinh trường lớn". Nội dung:
${content}`;
          break;
        case 'SO_SANH':
          finalPrompt = `Từ nội dung sau, trích xuất hai số cần so sánh, trả về dạng "số1 >< số2". Nội dung:
${content}`;
          break;
        case 'PHEP_TINH':
          finalPrompt = `Từ nội dung sau, trích xuất phép tính, trả về dạng "số1 + số2" hoặc "số1 - số2" hoặc "số1 × số2" hoặc "số1 ÷ số2". Nội dung:
${content}`;
          break;
        case 'PHAN_SO':
          finalPrompt = `Từ nội dung sau, trích xuất phân số, trả về dạng "tử/mẫu". Nội dung:
${content}`;
          break;
        case 'HINH_HOC':
          finalPrompt = `Từ nội dung sau, trích xuất tên hình học, trả về dạng "[tên hình]". Nội dung:
${content}`;
          break;
        case 'DAI_LUONG':
          finalPrompt = `Từ nội dung sau, trích xuất đại lượng, trả về dạng "[tên đại lượng]". Nội dung:
${content}`;
          break;
        case 'THAO_LUAN':
          finalPrompt = `Trả về "học sinh thảo luận nhóm" dựa trên nội dung sau. Nội dung:
${content}`;
          break;
        case 'VI_DU':
          finalPrompt = `Từ nội dung sau, trích xuất ví dụ thực tế, trả về dạng "[tên ví dụ]". Nội dung:
${content}`;
          break;
        case 'TRO_CHOI':
          finalPrompt = `Từ nội dung sau, trích xuất tên trò chơi, trả về dạng "[tên trò chơi]". Nội dung:
${content}`;
          break;
        case 'THI_NGHIEM':
          finalPrompt = `Từ nội dung sau, trích xuất tên thí nghiệm, trả về dạng "[tên thí nghiệm]". Nội dung:
${content}`;
          break;
        case 'BIEU_DO':
          finalPrompt = `Từ nội dung sau, trích xuất loại biểu đồ, trả về dạng "[loại biểu đồ]". Nội dung:
${content}`;
          break;
        default:
          finalPrompt = `Tóm tắt nội dung sau thành một cụm từ ngắn gọn nhất có thể. Nội dung:
${content}`;
      }

      const finalResult = await model.generateContent(finalPrompt);
      let analyzedText = finalResult.response.text();
      
      // Clean up the response
      analyzedText = analyzedText
        .replace(/["']/g, '') // Remove quotes
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();

      // Additional simplification based on format, if needed
      if (contentType === 'PHEP_TINH' && analyzedText.includes('phép tính')) {
        analyzedText = analyzedText.replace('phép tính', '').trim();
      }
      if (contentType === 'HINH_HOC' && analyzedText.includes('hình học:')) {
         analyzedText = analyzedText.replace('hình học:', '').trim();
      }
       if (contentType === 'DAI_LUONG' && analyzedText.includes('đại lượng:')) {
         analyzedText = analyzedText.replace('đại lượng:', '').trim();
      }
      if (contentType === 'VI_DU' && analyzedText.includes('ví dụ thực tế:')) {
         analyzedText = analyzedText.replace('ví dụ thực tế:', '').trim();
      }
       if (contentType === 'TRO_CHOI' && analyzedText.includes('trò chơi:')) {
         analyzedText = analyzedText.replace('trò chơi:', '').trim();
      }
       if (contentType === 'THI_NGHIEM' && analyzedText.includes('thí nghiệm:')) {
         analyzedText = analyzedText.replace('thí nghiệm:', '').trim();
      }
       if (contentType === 'BIEU_DO' && analyzedText.includes('biểu đồ:')) {
         analyzedText = analyzedText.replace('biểu đồ:', '').trim();
      }

      return analyzedText;
    } catch (error) {
      console.error('Error analyzing content:', error);
      return content; // Return original content if analysis fails
    }
  };

  // Add new function to format analyzed content
  const formatAnalyzedContent = (content) => {
    if (!content) return '';
    return content.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      // Handle number comparison
      if (trimmedLine.includes('><')) {
        const [num1, num2] = trimmedLine.split('><').map(n => n.trim());
        return `<p class="bullet-point">Số ${num1} lớn hơn hay nhỏ hơn ${num2}? Vì sao?</p>`;
      }
      
      // Handle arithmetic operations
      if (trimmedLine.includes('phép tính')) {
        const operation = trimmedLine.replace('phép tính', '').trim();
        return `<p class="bullet-point">• Thực hiện phép tính: ${operation}</p>`;
      }
      
      // Handle fractions
      if (trimmedLine.includes('phân số')) {
        const fraction = trimmedLine.replace('phân số', '').trim();
        return `<p class="bullet-point">• Làm việc với phân số: ${fraction}</p>`;
      }
      
      // Handle geometry
      if (trimmedLine.includes('hình học:')) {
        const shape = trimmedLine.replace('hình học:', '').trim();
        return `<p class="bullet-point">• Học về hình: ${shape}</p>`;
      }
      
      // Handle measurements
      if (trimmedLine.includes('đại lượng:')) {
        const measurement = trimmedLine.replace('đại lượng:', '').trim();
        return `<p class="bullet-point">• Tìm hiểu về đại lượng: ${measurement}</p>`;
      }
      
      // Handle group discussion
      if (trimmedLine.includes('thảo luận nhóm')) {
        return `<p class="bullet-point">• Giáo viên cho học sinh thảo luận nhóm đôi, sau đó gọi một vài học sinh trình bày ý kiến.</p>`;
      }
      
      // Handle real-world examples
      if (trimmedLine.includes('ví dụ thực tế:')) {
        const example = trimmedLine.replace('ví dụ thực tế:', '').trim();
        return `<p class="bullet-point">• Giáo viên đưa ra ví dụ thực tế: ${example}</p>`;
      }
      
      // Handle games
      if (trimmedLine.includes('trò chơi:')) {
        const game = trimmedLine.replace('trò chơi:', '').trim();
        return `<p class="bullet-point">• Chơi trò chơi: ${game}</p>`;
      }
      
      // Handle experiments
      if (trimmedLine.includes('thí nghiệm:')) {
        const experiment = trimmedLine.replace('thí nghiệm:', '').trim();
        return `<p class="bullet-point">• Thực hiện thí nghiệm: ${experiment}</p>`;
      }
      
      // Handle charts/tables
      if (trimmedLine.includes('biểu đồ:')) {
        const chart = trimmedLine.replace('biểu đồ:', '').trim();
        return `<p class="bullet-point">• Làm việc với biểu đồ: ${chart}</p>`;
      }
      
      return `<p>${trimmedLine}</p>`;
    }).join('');
  };

  // Update generateImages function
  const generateImages = async () => {
    setLoading(true);
    setLoadingProgress(0); // Reset progress at start
    setError(null); // Clear previous errors

    try {
      // Analyze each section's content
      const analyzedContent = {
        introduction: await analyzeContent(lessonData.lesson),
        warmup: await analyzeContent(lessonData.startUp),
        practice: await analyzeContent(lessonData.practice),
        application: await analyzeContent(lessonData.apply),
        // Analyze content specifically for a game related to the lesson theme
        game: await analyzeContent(`Tạo ý tưởng một trò chơi giáo dục đơn giản dựa trên chủ đề: ${lessonData.module || lessonData.lesson}. Chỉ mô tả ngắn gọn ý tưởng trò chơi.`),
        closing: "Chúc các em học tốt!"
      };

      // Store analyzed content
      setAnalyzedContents(analyzedContent);
      setLoadingProgress(20); // Indicate analysis is done

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
Tuyệt đối KHÔNG ĐƯỢC ĐƯA BẤT KỲ VĂN BẢN, SỐ, KÝ HIỆU HOẶC CHỮ CÁI NÀO VÀO TRONG ẢNH ĐƯỢC TẠO RA. Ảnh CHỈ chứa các yếu tố hình ảnh minh họa.

Tạo MỘT ảnh minh họa hoặc hình nền ĐỘC LẬP với phong cách hoạt hình giáo dục, tươi sáng, hấp dẫn và thân thiện cho mỗi mô tả dưới đây. Sử dụng phong cách minh họa nhất quán xuyên suốt.

---
${analyzedContent.introduction}
---
${analyzedContent.warmup}
---
${analyzedContent.practice}
---
${analyzedContent.application}
---
${analyzedContent.game}
---
${analyzedContent.closing}
---

Tuyệt đối KHÔNG ĐƯỢC ĐƯA BẤT KỲ VĂN BẢN, SỐ, KÝ HIỆU HOẶC CHỮ CÁI NÀO VÀO TRONG ẢNH ĐƯỢC TẠO RA. Ảnh CHỈ chứa các yếu tố hình ảnh minh họa.

Quan trọng: Đảm bảo các ảnh có chung một phong cách hoạt hình giáo dục, thân thiện, nhất quán với màu sắc tươi sáng.`
            }]
          }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        })
      });

      const data = await response.json();
      setLoadingProgress(50); // Indicate image generation API call is done

      if (data.candidates && data.candidates[0].content.parts) {
        const imageParts = data.candidates[0].content.parts.filter(part => part.inlineData && part.inlineData.mimeType.startsWith('image/'));
        const totalImages = imageParts.length;
        let loadedImagesCount = 0;

        const newImages = {};

        // Process and set images one by one to show progress
        const imageKeys = ['introduction', 'warmup', 'practice', 'application', 'game', 'closing']; // Define order

        for(let i = 0; i < imageParts.length; i++) {
          const part = imageParts[i];
          const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          
          // Assign to the correct key based on assumed order in prompt (0=intro, 1=warmup, etc.)
          // This assumes the API returns images in the same order as requested in the prompt.
          if (imageKeys[i]) {
             newImages[imageKeys[i]] = imageUrl;
          }

          loadedImagesCount++;
          const progress = 50 + (loadedImagesCount / totalImages) * 50; // 50% for generation, 50% for loading
          setLoadingProgress(Math.min(progress, 100)); // Ensure progress doesn't exceed 100
        }
        
        setImages(newImages); // Set all images state once processing is done

      } else {
        setError('API call successful, but no images were generated. The prompt might be too complex or specific or there was an internal API issue.');
        console.warn('API response did not contain images:', data);
      }
    } catch (error) {
      console.error('Error generating images:', error);
      setError(`Có lỗi xảy ra khi tạo hình ảnh: ${error.message}. Vui lòng thử lại.`);
      setLoadingProgress(0); // Reset progress on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lessonData) {
      generateImages();
    }
  }, [lessonData]);

  if (!lessonData) return null;

  // Helper function to format content
  const formatContent = (content) => {
    if (!content) return '';
    return content.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        return `<p class="bullet-point">• ${trimmedLine.substring(1).trim()}</p>`;
      }
      return `<p>${trimmedLine}</p>`;
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
        <Box>
          <Typography variant="h2" color="primary" fontWeight={700} gutterBottom>
            {lessonData.lesson}
          </Typography>
          <Typography variant="h5" color="info.main" gutterBottom>
            Chủ đề: {lessonData.module}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Ngày tạo: {new Date(lessonData.createdAt).toLocaleDateString('vi-VN')}
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : images.introduction && (
            <Box mt={4} display="flex" justifyContent="center">
              <img 
                src={images.introduction} 
                alt="Introduction" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} 
              />
            </Box>
          )}
        </Box>
      )
    },
    {
      title: 'Hoạt động Khởi động',
      content: (
        <Box>
          <Typography variant="h4" color="primary" fontWeight={600} gutterBottom>
            Hoạt động Khởi động
          </Typography>
          <Box sx={{ pl: 2, maxWidth: '90%', margin: 'auto' }}>
            <div dangerouslySetInnerHTML={{ __html: formatAnalyzedContent(analyzedContents.warmup) }} />
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : images.warmup && (
            <Box mt={4} display="flex" justifyContent="center">
              <img 
                src={images.warmup} 
                alt="Warm-up Activity" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} 
              />
            </Box>
          )}
        </Box>
      )
    },
    {
      title: 'Hoạt động Luyện tập',
      content: (
        <Box>
          <Typography variant="h4" color="primary" fontWeight={600} gutterBottom>
            Hoạt động Luyện tập
          </Typography>
          <Box sx={{ pl: 2, maxWidth: '90%', margin: 'auto' }}>
            <div dangerouslySetInnerHTML={{ __html: formatAnalyzedContent(analyzedContents.practice) }} />
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : images.practice && (
            <Box mt={4} display="flex" justifyContent="center">
              <img 
                src={images.practice} 
                alt="Practice Activity" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} 
              />
            </Box>
          )}
        </Box>
      )
    },
    {
      title: 'Hoạt động Vận dụng',
      content: (
        <Box>
          <Typography variant="h4" color="primary" fontWeight={600} gutterBottom>
            Hoạt động Vận dụng
          </Typography>
          <Box sx={{ pl: 2, maxWidth: '90%', margin: 'auto' }}>
            <div dangerouslySetInnerHTML={{ __html: formatAnalyzedContent(analyzedContents.application) }} />
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : images.application && (
            <Box mt={4} display="flex" justifyContent="center">
              <img 
                src={images.application} 
                alt="Application Activity" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} 
              />
            </Box>
          )}
        </Box>
      )
    },
    {
      title: 'Trò chơi',
      content: (
        <Box>
          <Typography variant="h4" color="primary" fontWeight={600} gutterBottom>
            Trò chơi
          </Typography>
          <Box sx={{ pl: 2, maxWidth: '90%', margin: 'auto' }}>
            <div dangerouslySetInnerHTML={{ __html: formatAnalyzedContent(analyzedContents.game) }} />
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : images.game && (
            <Box mt={4} display="flex" justifyContent="center">
              <img 
                src={images.game} 
                alt="Educational Game" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} 
              />
            </Box>
          )}
        </Box>
      )
    },
    {
      title: 'Kết thúc',
      content: (
        <Box>
          <Typography variant="h4" color="primary" fontWeight={600} gutterBottom>
            Chúc các em học tốt!
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : images.closing && (
            <Box mt={4} display="flex" justifyContent="center">
              <img 
                src={images.closing} 
                alt="Closing Message" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} 
              />
            </Box>
          )}
        </Box>
      )
    }
  ];

  // Fullscreen presentation
  const handleFullscreen = () => {
    const element = slideRef.current;
    if (!element) {
      console.warn("Slide element not found for fullscreen.");
      return; // Prevent errors if the element is not available
    }

    if (!fullscreen) {
      // Attempt to request fullscreen
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
          console.error("Error requesting fullscreen:", err);
        });
      } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen().catch(err => {
          console.error("Error requesting fullscreen (Firefox):", err);
        });
      } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        element.webkitRequestFullscreen().catch(err => {
          console.error("Error requesting fullscreen (Webkit):", err);
        });
      } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen().catch(err => {
          console.error("Error requesting fullscreen (MS):", err);
        });
      }
    } else {
      // Attempt to exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error("Error exiting fullscreen:", err);
        });
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen().catch(err => {
          console.error("Error exiting fullscreen (Firefox):", err);
        });
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen().catch(err => {
          console.error("Error exiting fullscreen (Webkit):", err);
        });
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen().catch(err => {
          console.error("Error exiting fullscreen (MS):", err);
        });
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="inherit" />
          <Typography variant="h6" component="div" sx={{ mt: 2 }}>
            Đang tạo bài giảng: {Math.round(loadingProgress)}%
          </Typography>
        </Box>
      </Backdrop>
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
              position: 'relative'
            }}
          >
            <Fade in timeout={400} key={current}>
              <div>{slides[current].content}</div>
            </Fade>
            {/* Presentation and download buttons */}
            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
              <IconButton onClick={handleFullscreen} title="Trình chiếu">
                {fullscreen ? <FullscreenExit /> : <Fullscreen />}
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
      <style>{`
        .bullet-point {
          padding-left: 1.5em;
          position: relative;
        }
        .bullet-point:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #1976d2;
        }
      `}</style>
    </Container>
  );
};

export default SlidePreview;
