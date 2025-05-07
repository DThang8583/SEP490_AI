import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CurriculumDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Dữ liệu mẫu cứng
    const curriculum = {
        curriculumId: parseInt(id || "10"),
        name: "Chương trình Toán lớp 5",
        description: "Chương trình đào tạo môn Toán dành cho học sinh lớp 5 năm học 2023-2024",
        year: "2023-2024",
        totalPeriods: 105,
        curriculumDetails: [
            {
                curriculumDetailId: 1,
                curriculumTopic: "Số học",
                curriculumSection: "Số tự nhiên và phép tính",
                curriculumSubSection: "Phép cộng, trừ, nhân, chia",
                curriculumContent: "Ôn tập và củng cố các phép tính với số tự nhiên",
                curriculumGoal: "Thực hiện thành thạo bốn phép tính với số tự nhiên"
            },
            {
                curriculumDetailId: 2,
                curriculumTopic: "Số học",
                curriculumSection: "Phân số",
                curriculumSubSection: "Phép cộng, trừ phân số",
                curriculumContent: "Cộng, trừ phân số có mẫu số khác nhau",
                curriculumGoal: "Biết cách quy đồng mẫu số và thực hiện phép cộng, trừ phân số"
            }
        ],
        curriculumActivities: [
            {
                curriculumActivityId: 1,
                curriculumAcitityDescription: "Hoạt động thực hành đo diện tích sân trường"
            }
        ]
    };

    const handleBackClick = () => {
        navigate('/manager/curriculum-framework');
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
            <h1>Chi tiết nội dung cần đạt (ID: {id})</h1>
            <button
                onClick={handleBackClick}
                style={{
                    padding: '8px 16px',
                    marginBottom: '20px',
                    backgroundColor: '#06A9AE',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Quay lại
            </button>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h2>Thông tin chung</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', width: '200px' }}>ID</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{curriculum.curriculumId}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Tên chương trình</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{curriculum.name}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Mô tả</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{curriculum.description}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Năm học</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{curriculum.year}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Tổng số tiết</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{curriculum.totalPeriods}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h2>Nội dung cần đạt</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Chủ đề</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Mạch nội dung</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nội dung</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Yêu cầu cần đạt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {curriculum.curriculumDetails.map((detail) => (
                            <tr key={detail.curriculumDetailId}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{detail.curriculumTopic}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{detail.curriculumSection}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{detail.curriculumContent}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{detail.curriculumGoal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                <h2>Hoạt động giáo dục</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px', width: '50px' }}>STT</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Mô tả hoạt động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {curriculum.curriculumActivities.map((activity, index) => (
                            <tr key={activity.curriculumActivityId}>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{activity.curriculumAcitityDescription}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    onClick={handleBackClick}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#06A9AE',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Quay lại trang chương trình
                </button>
            </div>
        </div>
    );
};

export default CurriculumDetail;
