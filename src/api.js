import axios from 'axios';

// Tạo instance của axios với cấu hình cơ bản
const apiInstance = axios.create({
    baseURL: 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1', // URL thực tế với /api/v1
    headers: {
        'Content-Type': 'application/json',
        // Nếu cần token, uncomment và điều chỉnh:
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    timeout: 10000, // Thời gian chờ tối đa (10 giây)
});

// Xử lý lỗi toàn cục
apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        return Promise.reject(error);
    }
);

export const api = {
    // Phương thức GET cho API thực tế
    get: (url, params = {}) => apiInstance.get(url, { params }).then((res) => res.data),

    // Phương thức PUT cho API thực tế
    put: (url, data) => apiInstance.put(url, data).then((res) => res.data),

    // Phương thức POST (nếu cần sau này)
    post: (url, data) => apiInstance.post(url, data).then((res) => res.data),

    // Phương thức DELETE (nếu cần sau này)
    delete: (url) => apiInstance.delete(url).then((res) => res.data),

    // Lesson Review APIs (sửa thành gọi API thực tế)
    getLessons: (params = {}) => apiInstance.get('/lessons', { params }).then((res) => res.data),

    getComments: () =>
        Promise.resolve({
            data: [{ id: 1, lessonId: 1, text: "Good lesson but needs more examples", date: "2025-03-15" }],
        }),

    postComment: (data) =>
        apiInstance.post('/lessons/comments', data).then((res) => res.data), // Giả định endpoint

    updateComment: (id, data) => Promise.resolve({ success: true, data: { id, ...data } }),

    deleteComment: (id) => Promise.resolve({ success: true }),

    // Content Approval APIs (sửa thành gọi API thực tế)
    approveLesson: (id) =>
        apiInstance.put(`/lessons/${id}`, { isApproved: true }).then((res) => res.data),

    rejectLesson: (id, reason = '') =>
        apiInstance.put(`/lessons/${id}`, { isApproved: false, disapprovedReason: reason }).then((res) => res.data),

    // Notification APIs (sửa thành gọi API thực tế)
    sendNotification: (data) => apiInstance.post('/notifications', data).then((res) => res.data), // Giả định endpoint

    // Các phần khác giữ nguyên mock data
    getReports: () =>
        Promise.resolve({
            data: { progress: 85, effectiveness: 90 },
        }),

    getProfile: () =>
        Promise.resolve({
            data: {
                userId: 1,
                name: "John Doe",
                email: "john@example.com",
                phone: "123456789",
                dateOfBirth: "1990-01-01",
                gender: "Male",
                address: "123 Main St, City, Country",
                role: "Subject Specialist Manager",
                school: "ABC Primary School",
                ward: "District 1",
                isActive: true,
                createdBy: "Admin",
                createdAt: "2025-01-01T10:00:00Z",
                updatedBy: "John Doe",
                updatedAt: "2025-03-15T14:30:00Z",
            },
        }),

    updateProfile: (data) => Promise.resolve({ success: true }),

    changePassword: (data) => Promise.resolve({ success: true }),

    login: (email, password) =>
        Promise.resolve({
            success: email === "john@example.com" && password === "password123",
            data: { name: "John Doe", email: "john@example.com" },
        }),

    logout: () =>
        Promise.resolve({
            success: true,
            message: "Logged out successfully",
        }),

    getNotifications: () =>
        Promise.resolve({
            data: [
                {
                    id: 1,
                    message: "New lesson 'Multiplication Basics' submitted by Teacher A for review.",
                    createdAt: "2025-03-20T10:00:00Z",
                    isRead: false,
                    type: "lesson_submission",
                    lessonId: 3,
                },
                {
                    id: 2,
                    message: "System update: New feature added.",
                    createdAt: "2025-03-19T15:30:00Z",
                    isRead: true,
                    type: "system",
                },
            ],
        }),

    markNotificationAsRead: (notificationId) =>
        Promise.resolve({
            success: true,
            message: `Notification ${notificationId} marked as read.`,
        }),
};