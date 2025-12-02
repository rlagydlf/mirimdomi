import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/main.css';

// 로컬 이미지 경로
const arrowRightIcon = "/img/arrow-right.svg";

function Main({ userInfo }) {
  const navigate = useNavigate();
  const [mealTab, setMealTab] = useState('조식');
  const [currentDay, setCurrentDay] = useState('화요일');

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
    { id: 1, title: '금주 금요일 위생검사 안내', date: '2025.03.21' },
    { id: 2, title: '금주 금요일 위생검사 안내', date: '2025.03.21' },
    { id: 3, title: '금주 금요일 위생검사 안내', date: '2025.03.21' },
    { id: 4, title: '금주 금요일 위생검사 안내', date: '2025.03.21' },
  ];

  // 알람 데이터
  const alarms = [
    { id: 1, type: '세탁', message: '오늘 9:20 세탁 예약이 있어요!', time: '방금' },
    { id: 2, type: '세탁', message: '오늘 9:20 세탁 예약이 있어요!', time: '방금' },
    { id: 3, type: '세탁', message: '오늘 9:20 세탁 예약이 있어요!', time: '방금' },
    { id: 4, type: '세탁', message: '오늘 9:20 세탁 예약이 있어요!', time: '방금' },
  ];

  // 커뮤니티 데이터
  const communityPosts = [
    { id: 1, category: '분실', title: '노란색 충전기 잃어버리신 분', time: '03:14' },
    { id: 2, category: '분실', title: '노란색 충전기 잃어버리신 분', time: '03:14' },
    { id: 3, category: '분실', title: '노란색 충전기 잃어버리신 분', time: '03:14' },
    { id: 4, category: '분실', title: '노란색 충전기 잃어버리신 분', time: '03:14' },
  ];

  // 시간표 데이터
  const timetable = [
    { period: '1교시', subject: '수학' },
    { period: '2교시', subject: '영어' },
    { period: '3교시', subject: '통합과학' },
    { period: '4교시', subject: '국어' },
    { period: '5교시', subject: '디지털디자인' },
    { period: '6교시', subject: 'UIUX엔지니어링' },
    { period: '7교시', subject: '시각디자인' },
  ];

  // 급식 메뉴 데이터
  const mealMenus = {
    조식: ['쌀밥', '시금치두부무침', '계란말이', '된장찌개', '춘천닭갈비'],
    중식: ['메뉴1', '메뉴2', '메뉴3'],
    석식: ['메뉴1', '메뉴2', '메뉴3'],
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1 className="home-title">홈</h1>
        <p className="home-date">{getCurrentDate()}</p>
      </div>

      <div className="home-grid">
        {/* 나에 대한 요약 */}
        <div className="home-card user-summary-card" style={{ position: 'absolute' }}>
          <div className="user-summary-content">
            <div className="user-avatar"></div>
            <div className="user-info">
              <p className="user-room">406호</p>
              <p className="user-name">2608 송지아</p>
            </div>
            <div className="user-scores">
              <div className="score-item">
                <p className="score-label">상점</p>
                <p className="score-value positive">4</p>
              </div>
              <div className="score-item">
                <p className="score-label">벌점</p>
                <p className="score-value negative">-11</p>
              </div>
              <div className="score-item">
                <p className="score-label">총합</p>
                <p className="score-value">-7</p>
              </div>
            </div>
          </div>
          <div className="more-link" onClick={() => navigate('/profile')}>
            <span>수정</span>
            <img src={arrowRightIcon} alt="수정" className="arrow-icon" />
          </div>
        </div>

        {/* 공지사항 */}
        <div className="home-card notice-card">
          <div className="card-header" style={{ cursor: 'pointer' }} onClick={() => navigate('/notice')}>
            <h3 className="card-title">공지사항</h3>
            <img src={arrowRightIcon} alt="더보기" className="arrow-icon" />
          </div>
          <div className="notice-list">
            {notices.map((notice) => (
              <div key={notice.id} className="notice-item">
                <div className="notice-content">
                  <div className="notice-dot"></div>
                  <p className="notice-title">{notice.title}</p>
                </div>
                <p className="notice-date">{notice.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 알람 */}
        <div className="home-card alarm-card">
          <div className="card-header" style={{ cursor: 'pointer' }} onClick={() => navigate('/alarm')}>
            <h3 className="card-title">알람</h3>
            <img src={arrowRightIcon} alt="더보기" className="arrow-icon" />
          </div>
          <div className="alarm-list">
            {alarms.map((alarm) => (
              <div key={alarm.id} className="alarm-item">
                <div className="alarm-content">
                  <span className="alarm-type">{alarm.type}</span>
                  <p className="alarm-message">{alarm.message}</p>
                </div>
                <p className="alarm-time">{alarm.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 시간표 */}
        <div className="home-card timetable-card">
          <div className="card-header">
            <h3 className="card-title">시간표</h3>
            <div className="day-navigation">
              <img src={arrowRightIcon} alt="이전" className="arrow-icon timetable-arrow-left" />
              <span className="current-day">{currentDay}</span>
              <img src={arrowRightIcon} alt="다음" className="arrow-icon timetable-arrow-right" />
            </div>
          </div>
          <div className="timetable-list">
            {timetable.map((item, index) => (
              <div key={index} className="timetable-item">
                <p className="timetable-period">{item.period}</p>
                <p className="timetable-subject">{item.subject}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 커뮤니티 */}
        <div className="home-card community-card">
          <div className="card-header" style={{ cursor: 'pointer' }} onClick={() => navigate('/community')}>
            <h3 className="card-title">커뮤니티</h3>
            <img src={arrowRightIcon} alt="더보기" className="arrow-icon" />
          </div>
          <div className="community-list">
            {communityPosts.map((post) => (
              <div key={post.id} className="community-item">
                <div className="community-content">
                  <span className="community-category">{post.category}</span>
                  <p className="community-title">{post.title}</p>
                </div>
                <p className="community-time">{post.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 급식 */}
        <div className="home-card meal-card">
          <div className="card-header">
            <h3 className="card-title">급식</h3>
            <p className="meal-date">{getCurrentDate()}</p>
          </div>
          <div className="meal-tabs">
            <button
              className={`meal-tab ${mealTab === '조식' ? 'active' : ''}`}
              onClick={() => setMealTab('조식')}
            >
              조식
            </button>
            <button
              className={`meal-tab ${mealTab === '중식' ? 'active' : ''}`}
              onClick={() => setMealTab('중식')}
            >
              중식
            </button>
            <button
              className={`meal-tab ${mealTab === '석식' ? 'active' : ''}`}
              onClick={() => setMealTab('석식')}
            >
              석식
            </button>
          </div>
          <div className="meal-menu">
            {mealMenus[mealTab]?.map((menu, index) => (
              <p key={index} className="meal-item">{menu}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;