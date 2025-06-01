// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import axios from "axios";
// import { TextareaAutosize } from "@mui/material";

// const EditLessonPage = () => {
//   const [lessons, setLessons] = useState([]);
//   const [selectedLesson, setSelectedLesson] = useState(null);
//   const [editingSection, setEditingSection] = useState(null);
//   const [editedContent, setEditedContent] = useState({
//     goal: "",
//     teacherActivities: "",
//     studentActivities: "",
//   });

//   useEffect(() => {
//     const fetchLessons = async () => {
//       try {
//         const response = await axios.get(
//           "https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons"
//         );
//         if (response.data && response.data.code === 0) {
//           setLessons(response.data.data);
//         } else {
//           throw new Error(response.data.message || "Lỗi khi tải danh sách bài học");
//         }
//       } catch (error) {
//         console.error("Error fetching lessons:", error);
//         alert(`Lỗi khi tải danh sách bài học: ${error.message}`);
//       }
//     };
//     fetchLessons();
//   }, []);

//   const handleLessonChange = async (event) => {
//     const lessonId = event.target.value;
//     try {
//       const response = await axios.get(
//         `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}`
//       );
//       console.log("Selected Lesson API Response:", response.data);
//       if (response.data && response.data.code === 0) {
//         setSelectedLesson(response.data.data);
//       } else {
//         throw new Error(response.data.message || "Không thể lấy thông tin bài học");
//       }
//     } catch (error) {
//       console.error("Error fetching lesson details:", error);
//       alert(`Lỗi khi lấy thông tin bài học: ${error.message}`);
//     }
//     setEditingSection(null);
//   };

//   const handleEditClick = (section) => {
//     setEditingSection(section);
//     setEditedContent({
//       goal: selectedLesson?.[section]?.goal || "",
//       teacherActivities: selectedLesson?.[section]?.teacherActivities || "",
//       studentActivities: selectedLesson?.[section]?.studentActivities || "",
//     });
//   };

//   const handleSaveClick = async () => {
//     try {
//       const updatedLesson = {
//         ...selectedLesson,
//         [editingSection]: {
//           ...editedContent,
//         },
//       };
//       await axios.put(
//         `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${selectedLesson.id}`,
//         updatedLesson
//       );
//       setSelectedLesson(updatedLesson);
//       setEditingSection(null);
//     } catch (error) {
//       console.error("Error updating lesson:", error);
//       alert(`Lỗi khi cập nhật bài học: ${error.message}`);
//     }
//   };

//   const handleCancelClick = () => {
//     setEditingSection(null);
//   };

//   const renderEditableSection = (sectionTitle, sectionKey) => {
//     if (!selectedLesson?.[sectionKey]) return null;

//     const isEditing = editingSection === sectionKey;

//     return (
//       <Card className="mb-4" key={sectionKey}>
//         <CardHeader>
//           <CardTitle>{sectionTitle}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isEditing ? (
//             <>
//               <div className="mb-2">
//                 <label className="block mb-1">Mục tiêu</label>
//                 <TextareaAutosize
//                   value={editedContent.goal}
//                   onChange={(e) =>
//                     setEditedContent((prev) => ({
//                       ...prev,
//                       goal: e.target.value,
//                     }))
//                   }
//                 />
//               </div>
//               <div className="mb-2">
//                 <label className="block mb-1">Hoạt động của giáo viên</label>
//                 <Textarea
//                   value={editedContent.teacherActivities}
//                   onChange={(e) =>
//                     setEditedContent((prev) => ({
//                       ...prev,
//                       teacherActivities: e.target.value,
//                     }))
//                   }
//                 />
//               </div>
//               <div className="mb-2">
//                 <label className="block mb-1">Hoạt động của học sinh</label>
//                 <Textarea
//                   value={editedContent.studentActivities}
//                   onChange={(e) =>
//                     setEditedContent((prev) => ({
//                       ...prev,
//                       studentActivities: e.target.value,
//                     }))
//                   }
//                 />
//               </div>
//               <div className="flex gap-2">
//                 <Button onClick={handleSaveClick}>Lưu</Button>
//                 <Button variant="outline" onClick={handleCancelClick}>
//                   Hủy
//                 </Button>
//               </div>
//             </>
//           ) : (
//             <>
//               <p className="mb-2">
//                 <strong>Mục tiêu:</strong>{" "}
//                 {selectedLesson[sectionKey].goal || "Không có"}
//               </p>
//               <p className="mb-2">
//                 <strong>GV:</strong>{" "}
//                 {selectedLesson[sectionKey].teacherActivities || "Không có"}
//               </p>
//               <p className="mb-2">
//                 <strong>HS:</strong>{" "}
//                 {selectedLesson[sectionKey].studentActivities || "Không có"}
//               </p>
//               <Button onClick={() => handleEditClick(sectionKey)}>Chỉnh sửa</Button>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-xl font-bold mb-4">Chỉnh sửa bài giảng</h1>
//       <div className="mb-4">
//         <label className="block mb-1">Chọn bài giảng</label>
//         <select
//           className="w-full border rounded p-2"
//           onChange={handleLessonChange}
//           defaultValue=""
//         >
//           <option value="" disabled>
//             -- Chọn bài giảng --
//           </option>
//           {lessons.map((lesson) => (
//             <option key={lesson.id} value={lesson.id}>
//               {lesson.title}
//             </option>
//           ))}
//         </select>
//       </div>

//       {selectedLesson && (
//         <div>
//           <Card className="mb-4">
//             <CardHeader>
//               <CardTitle>Mô tả</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>{selectedLesson.description || "Không có mô tả"}</p>
//             </CardContent>
//           </Card>

//           {renderEditableSection("Khởi động", "warmUp")}
//           {renderEditableSection("Hình thành kiến thức", "formingKnowledge")}
//           {renderEditableSection("Luyện tập", "practice")}
//           {renderEditableSection("Vận dụng", "application")}
//           {renderEditableSection("Trò chơi", "game")}
//           {renderEditableSection("Kết thúc", "conclusion")}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditLessonPage;
