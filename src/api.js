// src/api.js
export const api = {
    // Lesson Review APIs
    getLessons: () => Promise.resolve({
        data: [
            { id: 1, title: "Addition Basics", status: "approved", content: "Lesson content about addition..." },
            { id: 2, title: "Subtraction Intro", status: "pending", content: "Lesson content about subtraction..." },
        ]
    }),
    getComments: () => Promise.resolve({
        data: [
            { id: 1, lessonId: 1, text: "Good lesson but needs more examples", date: "2025-03-15" }
        ]
    }),
    postComment: (data) => Promise.resolve({ success: true, data: { id: Date.now(), ...data } }),
    updateComment: (id, data) => Promise.resolve({ success: true, data: { id, ...data } }),
    deleteComment: (id) => Promise.resolve({ success: true }),

    // Content Approval APIs
    approveLesson: (id) => Promise.resolve({ success: true }),
    rejectLesson: (id) => Promise.resolve({ success: true }),

    // Curriculum Analysis APIs
    getReports: () => Promise.resolve({
        data: { progress: 85, effectiveness: 90 }
    }),

    // Curriculum Framework APIs
    getCurriculum: () => Promise.resolve({
        data: {
            id: 1,
            title: "Primary Math Curriculum 2025",
            topics: [
                { id: 1, name: "Addition", description: "Basic addition for grade 1" },
                { id: 2, name: "Subtraction", description: "Basic subtraction for grade 1" },
                { id: 3, name: "Multiplication", description: "Intro to multiplication" }
            ]
        }
    }),
    updateCurriculum: (data) => Promise.resolve({ success: true, data }),

    // Profile APIs
    getProfile: () => Promise.resolve({
        data: { name: "John Doe", email: "john@example.com" }
    }),
    updateProfile: (data) => Promise.resolve({ success: true }),
    changePassword: (data) => Promise.resolve({ success: true }),

    // Notification APIs
    sendNotification: (data) => Promise.resolve({ success: true }),

    // Login API
    login: (email, password) => Promise.resolve({
        success: email === "john@example.com" && password === "password123",
        data: { name: "John Doe", email: "john@example.com" }
    })
};