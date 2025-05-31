const axios = require('axios');

async function fetchTotalLessons() {
    console.log('🚀 === BẮT ĐẦU GỌI API LESSONS ===');
    
    try {
        console.log('📡 URL:', 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons?Page=1&PageSize=999');
        console.log('⏰ Thời gian bắt đầu:', new Date().toISOString());
        
        const response = await axios.get(
            'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons?Page=1&PageSize=999',
            {
                timeout: 10000, // 10 giây timeout
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('✅ API call thành công!');
        console.log('📊 Response status:', response.status);
        console.log('📊 Response statusText:', response.statusText);
        console.log('📊 Response headers:', JSON.stringify(response.headers, null, 2));
        
        // Kiểm tra cấu trúc response
        console.log('🔍 Kiểm tra response.data:', typeof response.data);
        console.log('🔍 response.data keys:', Object.keys(response.data || {}));
        
        if (!response.data) {
            console.error('❌ Lỗi: response.data is null/undefined');
            return null;
        }
        
        console.log('📄 Response code:', response.data.code);
        console.log('📄 Response message:', response.data.message);
        
        if (response.data.code !== 0) {
            console.error('❌ Lỗi: API trả về code khác 0:', response.data.code);
            console.error('❌ Message:', response.data.message);
            return null;
        }
        
        // Kiểm tra data structure
        console.log('🔍 Kiểm tra response.data.data:', typeof response.data.data);
        if (response.data.data) {
            console.log('🔍 response.data.data keys:', Object.keys(response.data.data));
        }
        
        if (!response.data.data || !response.data.data.items) {
            console.error('❌ Lỗi: Không tìm thấy data.items');
            console.error('❌ response.data.data:', response.data.data);
            return null;
        }
        
        const lessons = response.data.data.items;
        console.log('📚 Kiểm tra lessons array:', Array.isArray(lessons));
        console.log('📚 Lessons length:', lessons.length);
        
        if (!Array.isArray(lessons)) {
            console.error('❌ Lỗi: lessons không phải là array');
            console.error('❌ lessons type:', typeof lessons);
            console.error('❌ lessons value:', lessons);
            return null;
        }
        
        const totalLessons = lessons.length;
        
        console.log('\n📊 === KẾT QUẢ THỐNG KÊ ===');
        console.log('🎯 Tổng số bài học:', totalLessons);
        
        // Hiển thị chi tiết một số bài học đầu
        console.log('\n📋 Chi tiết 5 bài học đầu tiên:');
        lessons.slice(0, 5).forEach((lesson, index) => {
            console.log(`${index + 1}. Lesson ID: ${lesson.lessonId} - "${lesson.name}" - Type: ${lesson.lessonType}`);
            console.log(`   Module: ${lesson.module}`);
            console.log(`   Periods: ${lesson.totalPeriods}`);
            console.log('   ---');
        });
        
        // Tóm tắt các lessonId
        const lessonIds = lessons.map(lesson => lesson.lessonId);
        console.log('\n🔢 Danh sách tất cả lesson IDs:');
        console.log('📝 First 10 IDs:', lessonIds.slice(0, 10));
        console.log('📝 Last 10 IDs:', lessonIds.slice(-10));
        console.log('🔢 Min lesson ID:', Math.min(...lessonIds));
        console.log('🔢 Max lesson ID:', Math.max(...lessonIds));
        
        return { totalLessons, lessons };
        
    } catch (error) {
        console.error('\n🚨 === LỖI KHI GỌI API ===');
        console.error('❌ Error type:', error.constructor.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        
        if (error.code) {
            console.error('❌ Error code:', error.code);
        }
        
        if (error.response) {
            console.error('📄 Response status:', error.response.status);
            console.error('📄 Response statusText:', error.response.statusText);
            console.error('📄 Response headers:', error.response.headers);
            console.error('📄 Response data:', error.response.data);
        } else if (error.request) {
            console.error('📡 Request was made but no response received');
            console.error('📡 Request:', error.request);
        }
        
        if (error.code === 'ENOTFOUND') {
            console.error('🌐 DNS resolution failed - Kiểm tra kết nối internet');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('🔒 Connection refused - Server có thể đang down');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('⏰ Request timeout - Server phản hồi quá chậm');
        }
        
        return null;
    } finally {
        console.log('⏰ Thời gian kết thúc:', new Date().toISOString());
        console.log('🏁 === KẾT THÚC API CALL ===\n');
    }
}

// Chạy function
fetchTotalLessons().then(result => {
    if (result) {
        console.log(`\n🎉 THÀNH CÔNG: Đã đếm được ${result.totalLessons} bài học!`);
    } else {
        console.log('\n💥 THẤT BẠI: Không thể lấy dữ liệu bài học!');
    }
}); 