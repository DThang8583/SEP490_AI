import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid, CircularProgress, Backdrop, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use your actual API Key
const API_KEY = "AIzaSyDSf6v2-ynUdw6IS7Ac_2cSOJN7-g12c7k"; // Replace with your actual API Key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using the flash model for text analysis
const imageModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-preview-image-generation" }); // Using the image model for image generation

const SlidePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lessonData } = location.state || {};

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyzedContents, setAnalyzedContents] = useState({
    lesson: '',
    startUp: '',
    practice: '',
    application: '',
    gameIdea: '',
    closing: "Chúc các em học tốt!"
  });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState({});

  // Function to analyze content in bulk with retry logic
  const analyzeLessonContent = async (lessonData) => {
    if (!lessonData) return;

    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds base delay for bulk request

    const combinedContent = `Phân tích các phần nội dung sau và **TRÍCH XUẤT CHÍNH XÁC CHỈ NỘI DUNG CỐT LÕI (vấn đề, câu hỏi, ví dụ, quy tắc chính)**. **LOẠI BỎ HOÀN TOÀN** các câu hoặc cụm từ mang tính hướng dẫn sư phạm (Giáo viên làm gì, Học sinh làm gì), mô tả hành động, hoặc bất kỳ chi tiết nào không phải là trọng tâm trực tiếp của hoạt động. Viết lại kết quả trích xuất dưới dạng súc tích, là một phần của Giáo án trực tiếp cho học sinh.
Sử dụng định dạng [Tên Phần]: [Chỉ nội dung cốt lõi đã trích xuất] cho mỗi phần.

Các loại nội dung chính (trả về MỘT loại) và hướng dẫn trích xuất CỐT LÕI:
SO_SANH - bài toán so sánh số/đại lượng (**CHỈ CÂU HỎI/VẤN ĐỀ so sánh**, dạng "đối tượng/số 1 >< đối tượng/số 2" hoặc câu hỏi)
PHEP_TINH - bài toán cộng/trừ/nhân/chia (**CHỈ PHÉP TÍNH hoặc VẤN ĐỀ cần tính toán**)
PHAN_SO - bài toán phân số (**CHỈ PHÂN SỐ hoặc KHÁI NIỆM/VẤN ĐỀ về phân số**)
HINH_HOC - bài toán hình học (**CHỈ TÊN HÌNH hoặc VẤN ĐỀ/CÂU HỎI về hình học**)
DAI_LUONG - bài toán đại lượng (không so sánh) (**CHỈ TÊN đại lượng hoặc VẤN ĐỀ/CÂU HỎI**)
THAO_LUAN - hoạt động nhóm (**TRÌNH BÀY CHỈ NỘI DUNG/CÂU HỎI cần thảo luận**, không mô tả hoạt động nhóm)
VI_DU - ví dụ thực tế (**TRÌNH BÀY CHỈ VÍ DỤ cụ thể** hoặc yêu cầu nêu ví dụ, không mô tả việc giáo viên/học sinh đưa ra ví dụ)
TRO_CHOI - mô tả trò chơi (**MÔ TẢ CHỈ LUẬT CHƠI hoặc Ý TƯỞNG CHÍNH**, rất ngắn gọn, không mô tả cách triển khai chi tiết)
BIEU_DO - biểu đồ/bảng (**TRÍCH XUẤT CHỈ LOẠI biểu đồ/bảng hoặc THÔNG TIN CHÍNH được hiển thị**)
DOC_SO - cách đọc/viết số (**TRÍCH XUẤT CHỈ SỐ hoặc QUY TẮC CÁCH ĐỌC/VIẾT số đó**)
NHIEU_BAI - nhiều bài tập khác nhau (**TÓM TẮT CHỈ CÁC LOẠI bài tập hoặc TRÌNH BÀY RẤT NGẮN GỌN các bài tập đó**)
TRO_CHOI_TINH - trò chơi tính toán (**MÔ TẢ CHỈ LUẬT CHƠI HOẶC VẤN ĐỀ TÍNH TOÁN**, cực kỳ ngắn gọn)

// Added instruction for visual/positional descriptions within KHAC or similar content
KHAC - khác (Nếu nội dung mô tả cảnh vật hoặc vị trí đồ vật, **HÃY TRÍCH XUẤT CHỈ CÁC CHI TIẾT MIÊU TẢ VỊ TRÍ CHÍNH**, ví dụ: "bảng đen ở trên cao, bàn giáo viên ở phía trước...")

**LƯU Ý QUAN TRỌNG:** Đối với các phần nội dung đã phân tích (ngoại trừ Tiêu đề bài học), khi trích xuất nội dung cốt lõi, KHÔNG bao gồm nhãn loại nội dung (ví dụ: SO_SANH:, PHEP_TINH:, DAI_LUONG:, TRO_CHOI:, v.v.) ở đầu nội dung trích xuất. Chỉ trả về nội dung cốt lõi đã được làm sạch.

Nội dung các phần:

LessonTitle: ${lessonData.lesson || ''}
StartUp: ${lessonData.startUp || ''}
Practice: ${lessonData.practice || ''}
Application: ${lessonData.apply || ''}
`; // Game idea will be a separate, simpler prompt


    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt + 1} to analyze lesson content...`);
        const result = await model.generateContent(combinedContent);
        const responseText = result.response.text();
        console.log("Raw analysis response:", responseText);

        // Parse the combined response
        const parsedResults = {};
        const sections = ['LessonTitle', 'StartUp', 'Practice', 'Application'];
        
        // Improved regex to find all sections and their content
        // It looks for [SECTION_NAME]: followed by any content until the next [SECTION_NAME]: or end of string
        const sectionRegex = /\[([A-Za-z]+)\]:\s*([\s\S]*?)(?=\[[A-Za-z]+\]:|$)/g;
        let match;

        while ((match = sectionRegex.exec(responseText)) !== null) {
            const sectionName = match[1];
            const content = match[2].trim();
            
            // Find the matching section from our defined sections array (case-insensitive check)
            const section = sections.find(s => s.toLowerCase() === sectionName.toLowerCase());
            
            if (section) {
                // Clean up the content from AI wrappers and normalize newlines
                let cleanedContent = content
                    .replace(/^["'`*\- ]+|["'`*\- ]+$/g, '') // Remove wrappers
                    .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
                    .trim();
                
                parsedResults[section] = cleanedContent;
            } else {
                console.warn(`Found unexpected section in AI response: ${sectionName}`);
            }
        }

        // Handle any defined sections that weren't found in the AI response
        sections.forEach(section => {
            if (!parsedResults[section]) {
                if (section === 'LessonTitle' && lessonData.lesson) {
                    // Keep fallback for LessonTitle as it's the title
                    parsedResults[section] = lessonData.lesson;
                } else {
                    // For activity sections, fallback to empty string if AI didn't provide content
                    console.warn(`Could not parse ${section} from response or AI provided no content.`);
                    parsedResults[section] = ''; // Changed fallback to empty string
                }
            }
        });

        // Handle the game idea separately as a simpler prompt
        console.log("Analyzing game idea...");
         const gameIdeaPrompt = `Gợi ý một ý tưởng trò chơi giáo dục dựa trên chủ đề: ${lessonData.module || lessonData.lesson}. Mô tả cụ thể hơn về cách chơi hoặc ý tưởng chính của trò chơi (khoảng 20-40 từ).`;
        const gameIdeaResult = await model.generateContent(gameIdeaPrompt);
        let gameIdeaText = gameIdeaResult.response.text().trim();
         gameIdeaText = gameIdeaText.replace(/^["'`*\- ]+|["'`*\- ]+$/g, '').trim(); // Clean up


        setAnalyzedContents({
          lesson: parsedResults.LessonTitle || lessonData.lesson,
          startUp: parsedResults.StartUp,
          practice: parsedResults.Practice,
          application: parsedResults.Application,
          gameIdea: gameIdeaText || "Ý tưởng trò chơi đang cập nhật...",
          closing: "Chúc các em học tốt!"
        });

        // Trigger image generation after setting analyzed content
        triggerImageGeneration({
          lesson: parsedResults.LessonTitle || lessonData.lesson,
          startUp: parsedResults.StartUp,
          practice: parsedResults.Practice,
          application: parsedResults.Application,
          gameIdea: gameIdeaText || "Ý tưởng trò chơi đang cập nhật...",
          closing: "Chúc các em học tốt!"
        });

        return; // Success, exit function
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);

        if (error.message && error.message.includes('429')) {
          if (attempt < maxRetries - 1) {
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`Đã vượt quá giới hạn yêu cầu. Đợi ${delay/1000} giây trước khi thử lại...`);
            setLoadingProgress(0); // Reset progress during wait
            await new Promise(resolve => setTimeout(resolve, delay));
            // Optional: Update a small message indicating waiting
            // setError(`Đã vượt quá giới hạn yêu cầu. Đang đợi ${delay/1000} giây...`);
            continue; // Retry
          }
        }

        // If we've exhausted retries or it's not a rate limit error, throw
        if (attempt === maxRetries - 1) {
           const finalError = `Không thể phân tích nội dung Giáo án sau ${maxRetries} lần thử. Lỗi: ${error.message}`;
           console.error(finalError);
           setError(finalError);
            setAnalyzedContents({
               lesson: lessonData.lesson || '',
               startUp: '[Lỗi phân tích]',
               practice: '[Lỗi phân tích]',
               application: '[Lỗi phân tích]',
               gameIdea: '[Lỗi phân tích]',
               closing: "Chúc các em học tốt!"
            });
        }
      }
    }
     // Fallback if all retries fail
    if (!error) { // Only set if error wasn't set in the catch block
         setError("Đã xảy ra lỗi không xác định trong quá trình phân tích.");
          setAnalyzedContents({
               lesson: lessonData.lesson || '',
               startUp: '[Lỗi phân tích]',
               practice: '[Lỗi phân tích]',
               application: '[Lỗi phân tích]',
               gameIdea: '[Lỗi phân tích]',
               closing: "Chúc các em học tốt!"
            });
    }
  };

  // Refined function to format analyzed content for display
  const formatAnalyzedContent = (content) => {
    if (!content || content.includes('[Lỗi phân tích]')) {
        return `<p style="font-style: italic; color: grey;">${content || 'Nội dung đang cập nhật hoặc trống.'}</p>`;
    }

    // The content is expected to be the AI's analysis result (potentially already extracted)
    let contentToFormat = content.trim();

    // Define regex for category labels outside the map loop
    const categoryLabelRegex = /^[A-Za-z_]+:\s*/;

    // Remove leading AI category labels from the whole content first (fallback just in case)
    contentToFormat = contentToFormat.replace(categoryLabelRegex, '').trim();


    const lineBreakAfterColonRegex = /(^|\n)([A-Za-zÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ\s]+):\s*(.*)$/gm;
    contentToFormat = contentToFormat.replace(lineBreakAfterColonRegex, '$1$2:\n$3').trim();

    // Split content by newlines, and also consider comma-separated lists for bullet points
    // Fixed: Ensure regex literal is on a single line
    const segments = contentToFormat.split(/[\n,;]/).map(segment => segment.trim()).filter(segment => segment.length > 0);

    if (segments.length <= 1 && !contentToFormat.includes('\n')) {
         // If it's a single short segment with no newlines, treat as a paragraph
         return `<p>${contentToFormat}</p>`;
    }

    // Otherwise, format segments as bullet points or paragraphs
    return segments.map((segment, index) => {
        let trimmedSegment = segment.trim(); // Use let because we will modify it

        // Remove leading AI category labels from THIS segment (like SO_SANH:, PHEP_TINH:, etc.)
        trimmedSegment = trimmedSegment.replace(categoryLabelRegex, '').trim();

        // Handle specific patterns that should always be bullet points
         if (trimmedSegment.match(/^Số\s+.*\d.*\s+lớn hơn hay nhỏ hơn\s+.*\d.*\s*Vì sao\?$/) ||
             (trimmedSegment.includes('Thành phố Hồ Chí Minh') && trimmedSegment.includes('Hà Nội') && trimmedSegment.includes('đông dân hơn?')) ||
             trimmedSegment.includes('thảo luận nhóm đôi') ||
             trimmedSegment.match(/^\d+\.\s+/)) // Numbered list
         {
             return `<p class="bullet-point">• ${trimmedSegment.replace(/^[-•*+]\s*/, '').trim()}</p>`;
         }

         // If it looks like a list item already or is a significant segment, make it a bullet point
         if (trimmedSegment.startsWith('•') || trimmedSegment.length > 50 || segments.length > 2) {
              return `<p class="bullet-point">• ${trimmedSegment.replace(/^[-•*+]\s*/, '').trim()}</p>`;
         }

         // Default to paragraph for other segments
         if (trimmedSegment) {
            return `<p>${trimmedSegment}</p>`;
         }
        return null; // Skip empty segments
    }).filter(p => p !== null).join('');
  };

  // Function to perform the second analysis to extract visual elements
  const extractVisualPrompt = async (analyzedText) => {
    if (!analyzedText || analyzedText.includes('[Lỗi phân tích]')) return analyzedText; // Use analyzed text directly if no content or error

    const visualPromptInstruction = `Based on this educational content: "${analyzedText}", describe the key visual elements or simple scenes that could be illustrated for a child. Focus on concrete objects, characters, actions, or simple concepts. For example, if the content is about "2 apples + 3 apples", the visual prompt should be "2 apples and 3 apples". If it is about "comparing tall and short towers", the prompt should be "a tall tower and a short tower". If it is about a game, describe the main visual concept of the game. If it describes locations or objects in a scene, list them. Respond only with the description, no explanations or extra text. Keep it concise and focused on drawable things.`;

    try {
      console.log("Performing second analysis for visual prompt...");
      const result = await model.generateContent(visualPromptInstruction);
      const visualPromptText = result.response.text().trim();
      console.log("Extracted visual prompt:", visualPromptText);
      return visualPromptText || analyzedText; // Use analyzed text as fallback if second analysis yields nothing
    } catch (error) {
      console.error("Error during second analysis for visual prompt:", error);
      return analyzedText; // Return original analyzed text on error
    }
  };

  // Function to generate image from extracted visual prompt
  const generateImageFromContent = async (visualPromptText, slideKey) => {
    if (!visualPromptText || visualPromptText.includes('[Lỗi phân tích]')) {
       console.warn(`Skipping image generation for ${slideKey} due to no or error content.`);
       setGeneratedImages(prev => ({
           ...prev,
           [slideKey]: 'error' // Mark as error or skip
         }));
       return;
    }
    try {
      // Using the extracted visual prompt as the prompt for image generation
      console.log(`Sending image prompt for ${slideKey}: ${visualPromptText}`); // Log the prompt being sent

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: visualPromptText
                  }
                ]
              }
            ],
            generationConfig: {
              responseModalities: [
                "TEXT",
                "IMAGE"
              ]
            }
          })
        }
      );

      const data = await response.json();
      console.log(`Raw image generation response for ${slideKey}:`, data); // Log the raw response

      let imageData = null;
      let imageMimeType = null;

      // Check if candidates and content exist
      if (data && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
        // Loop through the parts to find one with inlineData (the image data)
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
            imageData = part.inlineData.data;
            imageMimeType = part.inlineData.mimeType;
            break; // Found the image part, no need to check further
          }
        }
      }

      if (imageData) {
        setGeneratedImages(prev => ({
          ...prev,
          [slideKey]: `data:${imageMimeType};base64,${imageData}` // Use the stored mimeType
        }));
      } else {
        console.warn(`Image generation failed or returned no valid image data part for ${slideKey}. Response:`, data);
         setGeneratedImages(prev => ({
           ...prev,
           [slideKey]: 'error' // Mark as error to show something different than loading
         }));
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setGeneratedImages(prev => ({
        ...prev,
        [slideKey]: 'error' // Mark as error on fetch/API error
      }));
    }
  };

  // Function to trigger image generation for all sections after analysis
  const triggerImageGeneration = async (contentData) => {
    const sectionsToGenerate = ['lesson', 'startUp', 'practice', 'application', 'gameIdea', 'closing']; // Include closing section
    console.log("Triggering image generation for sections:", sectionsToGenerate);
    for (const section of sectionsToGenerate) {
      console.log(`Checking section ${section} for image generation. Content:`, contentData[section]);
      if (contentData[section] && !contentData[section].includes('[Lỗi phân tích]')) {
        console.log(`Processing image for section: ${section}`);
        // Perform second analysis to get visual prompt
        const visualPrompt = await extractVisualPrompt(contentData[section]);
        // Generate image using the visual prompt
        await generateImageFromContent(visualPrompt, section);
      } else {
         console.log(`No valid content for section ${section}, skipping image generation or marking as error.`);
          setGeneratedImages(prev => ({
             ...prev,
             [section]: contentData[section] && contentData[section].includes('[Lỗi phân tích]') ? 'error' : undefined // Mark as error if analysis failed, keep undefined if just no content
           }));
      }
    }
  };

  useEffect(() => {
    const startAnalysis = async () => {
      if (!lessonData) return;

    setLoading(true);
      setError(null);
      setLoadingProgress(0); // Start progress from 0

      // Simple interval to show progress while waiting for analysis
      const interval = setInterval(() => {
          setLoadingProgress(prev => {
              if (prev < 95) return prev + 1; // Simulate progress
              return prev;
          });
      }, 300); // Update progress every 300ms

      try {
         await analyzeLessonContent(lessonData);
         setLoadingProgress(100); // Ensure it reaches 100% on success
    } finally {
        clearInterval(interval); // Stop simulating progress
      setLoading(false);
    }
  };

    startAnalysis();

     // Cleanup interval on component unmount
     return () => {
         // Ensure interval is cleared even if startAnalysis doesn't finish
         // (though with async await, this might be redundant depending on react lifecycle)
     };

  }, [lessonData]); // Re-run analysis if lessonData changes

  if (!lessonData) {
      return (
          <Container maxWidth="lg" sx={{ py: 6 }}>
               <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 4 }}
                >
                    Quay lại
                </Button>
              <Alert severity="warning">Không có dữ liệu Giáo án được truyền.</Alert>
          </Container>
      );
  }

  // Define the slides structure based on logical sections
  const slides = [
    { title: 'Tiêu đề', contentKey: 'lesson', imagePlaceholder: true },
    { title: 'Hoạt động Khởi động', contentKey: 'startUp', imagePlaceholder: true },
    { title: 'Hoạt động Luyện tập', contentKey: 'practice', imagePlaceholder: true },
    { title: 'Hoạt động Vận dụng', contentKey: 'application', imagePlaceholder: true },
    { title: 'Trò chơi', contentKey: 'gameIdea', imagePlaceholder: true },
    { title: 'Kết thúc', contentKey: 'closing', imagePlaceholder: true }
  ];

   // Get the current slide's data
  const currentSlideData = slides[currentSlide];
  const currentContent = analyzedContents[currentSlideData.contentKey];
  const currentTitle = currentSlideData.title === 'Tiêu đề' ? analyzedContents.lesson || lessonData.lesson : currentSlideData.title;

  console.log(`Rendering Slide: ${currentSlideData.title}, Content Key: ${currentSlideData.contentKey}`);
  console.log(`Analyzed Content for ${currentSlideData.contentKey}:`, currentContent);
  console.log(`Generated Image state for ${currentSlideData.contentKey}:`, generatedImages[currentSlideData.contentKey]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="inherit" />
          <Typography variant="h6" component="div" sx={{ mt: 2 }}>
            {error ? 'Có lỗi xảy ra' : `Đang xử lý nội dung: ${Math.round(loadingProgress)}%`} {/* Updated message */}
          </Typography>
           {error && <Typography variant="body2" component="div" sx={{ mt: 1, color: 'red', textAlign: 'center' }}>{error}</Typography>}
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
        {/* Slide list on the left (Sidebar) */}
        <Grid item xs={2}>
          <Box>
            {slides.map((slide, idx) => (
              <Box
                key={idx}
                sx={{
                  border: idx === currentSlide ? '2px solid #1976d2' : '1px solid #ccc',
                  borderRadius: 2,
                  mb: 2,
                  p: 1,
                  cursor: 'pointer',
                  background: idx === currentSlide ? '#e3f2fd' : '#fff',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
                onClick={() => setCurrentSlide(idx)}
              >
                 {/* Thumbnail Placeholder */}
                <Box sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#e0e0e0', // Gray placeholder color
                  borderRadius: 1,
                  flexShrink: 0
                }} />
                <Typography variant="subtitle2" fontWeight={idx === currentSlide ? 700 : 400} sx={{ flexGrow: 1 }}>
                  {slide.title === 'Tiêu đề' ? analyzedContents.lesson || 'Đang tải...' : slide.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Main slide on the right */}
        <Grid item xs={10}>
          <Box
            sx={{
              minHeight: 400,
              border: '2px solid #1976d2',
              borderRadius: 3,
              p: 4,
              background: '#fff',
              boxShadow: '0 4px 16px rgba(25, 118, 210, 0.08)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start', // Align items to the top
              gap: 3,
              overflowY: 'auto', // Add scroll if content overflows
              maxHeight: '70vh' // Limit height to fit viewport
            }}
          >
             <Typography variant="h4" color="primary" fontWeight={600} gutterBottom>
               {currentTitle || 'Đang tải...'}
            </Typography>

            {currentSlideData.imagePlaceholder && (
              <Box sx={{
                width: '80%',
                maxWidth: 600,
                height: 300,
                borderRadius: 2,
                mb: 2,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e0e0e0'
              }}>
                {generatedImages[currentSlideData.contentKey] === 'error' ? (
                  <Typography variant="body2" color="error">
                    Lỗi khi tải hình ảnh. Vui lòng thử lại sau.
                  </Typography>
                ) : generatedImages[currentSlideData.contentKey] ? (
                  <img
                    src={generatedImages[currentSlideData.contentKey]}
                    alt={`Generated illustration for ${currentSlideData.title}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <CircularProgress />
                )}
              </Box>
            )}

            {/* Display formatted analyzed content */}
             <Box sx={{ width: '100%', px: 2 }}>
                 <div dangerouslySetInnerHTML={{ __html: formatAnalyzedContent(currentContent) }} />
            </Box>

          </Box>

           {/* Navigation buttons */}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              disabled={currentSlide === 0 || loading}
              onClick={() => setCurrentSlide(currentSlide - 1)}
              variant="outlined"
            >
              Trước
            </Button>
            <Button
              disabled={currentSlide === slides.length - 1 || loading}
              onClick={() => setCurrentSlide(currentSlide + 1)}
              variant="contained"
            >
              Tiếp
            </Button>
          </Box>
        </Grid>
      </Grid>
       {/* Add basic styling for bullet points */}
      <style>{`
        .bullet-point {
          padding-left: 1.5em;
          position: relative;
          margin-bottom: 0.5em; /* Space between list items */
        }
        .bullet-point:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #1976d2; /* Use primary color or any color you like */
          font-weight: bold;
        }
        p {
            margin-bottom: 1em; /* Space between paragraphs */
             line-height: 1.6;
        }
        p:last-child {
            margin-bottom: 0;
        }
      `}</style>
    </Container>
  );
};

export default SlidePreview;
