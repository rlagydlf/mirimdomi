import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/notice.css';

// 로컬 이미지 경로
const arrowRightIcon = "/img/arrow-right.svg";

function Notice() {
  const navigate = useNavigate();
  const [selectedNotice, setSelectedNotice] = useState(null);

  // 현재 날짜 포맷팅
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 공지사항 데이터 (나중에 API에서 가져올 예정)
  const notices = [
    { 
      id: 1, 
      title: '금주 금요일 위생검사 안내', 
      date: '2025.03.21',
      content: '안녕하세요. 기숙사 사감실입니다.\n\n금주 금요일(3월 24일) 오후 2시부터 기숙사 전체 위생검사가 실시됩니다.\n\n모든 학생들은 다음 사항을 준수해 주시기 바랍니다:\n\n1. 개인 소지품 정리\n2. 침대 및 책상 정리\n3. 화장실 청소\n4. 쓰레기 분리수거\n\n검사 시간에는 기숙사에 대기해 주시기 바랍니다.\n\n감사합니다.'
    },
    { 
      id: 2, 
      title: '금주 금요일 위생검사 안내', 
      date: '2025.03.21',
      content: '안녕하세요. 기숙사 사감실입니다.\n\n금주 금요일(3월 24일) 오후 2시부터 기숙사 전체 위생검사가 실시됩니다.\n\n모든 학생들은 다음 사항을 준수해 주시기 바랍니다:\n\n1. 개인 소지품 정리\n2. 침대 및 책상 정리\n3. 화장실 청소\n4. 쓰레기 분리수거\n\n검사 시간에는 기숙사에 대기해 주시기 바랍니다.\n\n감사합니다.'
    },
    { 
      id: 3, 
      title: '금주 금요일 위생검사 안내', 
      date: '2025.03.21',
      content: '안녕하세요. 기숙사 사감실입니다.\n\n금주 금요일(3월 24일) 오후 2시부터 기숙사 전체 위생검사가 실시됩니다.\n\n모든 학생들은 다음 사항을 준수해 주시기 바랍니다:\n\n1. 개인 소지품 정리\n2. 침대 및 책상 정리\n3. 화장실 청소\n4. 쓰레기 분리수거\n\n검사 시간에는 기숙사에 대기해 주시기 바랍니다.\n\n감사합니다.'
    },
    { 
      id: 4, 
      title: '금주 금요일 위생검사 안내', 
      date: '2025.03.21',
      content: '안녕하세요. 기숙사 사감실입니다.\n\n금주 금요일(3월 24일) 오후 2시부터 기숙사 전체 위생검사가 실시됩니다.\n\n모든 학생들은 다음 사항을 준수해 주시기 바랍니다:\n\n1. 개인 소지품 정리\n2. 침대 및 책상 정리\n3. 화장실 청소\n4. 쓰레기 분리수거\n\n검사 시간에는 기숙사에 대기해 주시기 바랍니다.\n\n감사합니다.'
    },
    { 
      id: 5, 
      title: '금주 금요일 위생검사 안내', 
      date: '2025.03.20',
      content: '안녕하세요. 기숙사 사감실입니다.\n\n금주 금요일(3월 24일) 오후 2시부터 기숙사 전체 위생검사가 실시됩니다.\n\n모든 학생들은 다음 사항을 준수해 주시기 바랍니다:\n\n1. 개인 소지품 정리\n2. 침대 및 책상 정리\n3. 화장실 청소\n4. 쓰레기 분리수거\n\n검사 시간에는 기숙사에 대기해 주시기 바랍니다.\n\n감사합니다.'
    },
    { 
      id: 6, 
      title: '금주 금요일 위생검사 안내', 
      date: '2025.03.20',
      content: '안녕하세요. 기숙사 사감실입니다.\n\n금주 금요일(3월 24일) 오후 2시부터 기숙사 전체 위생검사가 실시됩니다.\n\n모든 학생들은 다음 사항을 준수해 주시기 바랍니다:\n\n1. 개인 소지품 정리\n2. 침대 및 책상 정리\n3. 화장실 청소\n4. 쓰레기 분리수거\n\n검사 시간에는 기숙사에 대기해 주시기 바랍니다.\n\n감사합니다.'
    },
    { 
      id: 7, 
      title: '금주 금요일 위생검사 안내', 
      date: '2025.03.19',
      content: '안녕하세요. 기숙사 사감실입니다.\n\n금주 금요일(3월 24일) 오후 2시부터 기숙사 전체 위생검사가 실시됩니다.\n\n모든 학생들은 다음 사항을 준수해 주시기 바랍니다:\n\n1. 개인 소지품 정리\n2. 침대 및 책상 정리\n3. 화장실 청소\n4. 쓰레기 분리수거\n\n검사 시간에는 기숙사에 대기해 주시기 바랍니다.\n\n감사합니다.'
    },
    { 
      id: 8, 
      title: '금주 금요일 위생검사 안내', 
      date: '2025.03.19',
      content: '안녕하세요. 기숙사 사감실입니다.\n\n금주 금요일(3월 24일) 오후 2시부터 기숙사 전체 위생검사가 실시됩니다.\n\n모든 학생들은 다음 사항을 준수해 주시기 바랍니다:\n\n1. 개인 소지품 정리\n2. 침대 및 책상 정리\n3. 화장실 청소\n4. 쓰레기 분리수거\n\n검사 시간에는 기숙사에 대기해 주시기 바랍니다.\n\n감사합니다.'
    },
  ];

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
  };

  return (
    <div className="notice">
      <div className="notice-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <img src={arrowRightIcon} alt="뒤로가기" className="back-icon" />
        </button>
        <div className="notice-header-content">
          <h1 className="notice-title">공지사항</h1>
          <p className="notice-date">{getCurrentDate()}</p>
        </div>
      </div>

      <div className="notice-list-container">
        <div className="notice-list">
          {notices.map((notice) => (
            <div 
              key={notice.id} 
              className="notice-item"
              onClick={() => handleNoticeClick(notice)}
            >
              <div className="notice-content">
                <div className="notice-dot"></div>
                <p className="notice-title-text">{notice.title}</p>
              </div>
              <p className="notice-date-text">{notice.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 공지사항 상세 */}
      {selectedNotice && (
        <div className="notice-detail-container">
          <div className="notice-detail-header">
            <div className="notice-detail-title-section">
              <div className="notice-detail-title-row">
                <h2 className="notice-detail-title">{selectedNotice.title}</h2>
                <p className="notice-detail-date">{selectedNotice.date}</p>
              </div>
            </div>
          </div>
          <div className="notice-detail-content">
            <p>{selectedNotice.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notice;
