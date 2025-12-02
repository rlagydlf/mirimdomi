import React, { useState } from 'react';
import './css/community.css';

// 로컬 이미지 경로
const eyeIcon = "/img/eye-icon.svg";
const commentIcon = "/img/comment-icon.svg";
const arrowRightIcon = "/img/arrow-right-community.svg";
const sendIcon = "/img/send-icon.svg";

// 댓글 전송 아이콘 SVG 컴포넌트
const CommentSendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 16.6667V3.33337M10 3.33337L15 8.33337M10 3.33337L5 8.33337" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function Community() {
  const [selectedTab, setSelectedTab] = useState('게시판');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [selectedBoard, setSelectedBoard] = useState(null); // 선택된 게시판 (null이면 메인 화면)
  const [writeTitle, setWriteTitle] = useState('');
  const [writeContent, setWriteContent] = useState('');

  // 현재 날짜 포맷팅
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 게시판 목록 데이터
  const boardLists = {
    '분실물 게시판': [
      { id: 1, title: '시험기간인데 휴게실 조용히 좀 써주세요.', time: '03:14' },
      { id: 2, title: '시험기간인데 휴게실 조용히 좀 써주세요.', time: '03:14' },
      { id: 3, title: '시험기간인데 휴게실 조용히 좀 써주세요.', time: '03:14' },
      { id: 4, title: '시험기간인데 휴게실 조용히 좀 써주세요.', time: '03:14' },
      { id: 5, title: '시험기간인데 휴게실 조용히 좀 써주세요.', time: '03:14' },
    ],
    '자유 게시판': [
      { id: 6, title: '시험기간인데 휴게실 조용히 좀 써주세요.', time: '03:14' },
      { id: 7, title: '시험기간인데 휴게실 조용히 좀 써주세요.', time: '03:14' },
      { id: 8, title: '시험기간인데 휴게실 조용히 좀 써주세요.', time: '03:14' },
      { id: 9, title: '시험기간인데 휴게실 조용히 좀 써주세요.', time: '03:14' },
      { id: 10, title: '시험기간인데 휴게실 조용히 좀 써주세요.', time: '03:14' },
    ]
  };

  // 게시글 상세 데이터 (기본 표시용)
  const defaultPostDetail = {
    id: 1,
    category: '[자유]',
    title: '시험기간인데 휴게실 조용히 좀 써주세요.',
    date: '2025.11.09',
    views: 23,
    comments: 2,
    content: '나는 아무 걱정도 없이 가을 속의 별들을 다 헬 듯합니다. 별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와 별 하나에 어머니, 어머니, 어머님, 나는 별 하나에 아름다운 말 한 마디씩 불러 봅니다. 딴은 밤을 세워 우는 벌레는 부끄러운 이름을 슬퍼하는 까닭입니다.',
    commentsList: [
      { id: 1, content: '그거 제거인 거 같아요. 어디로 가지러 가면 될까요?', time: '11/14 03:14' },
      { 
        id: 2, 
        content: '그거 제거인 거 같아요. 어디로 가지러 가면 될까요?', 
        time: '11/14 03:14'
      }
    ]
  };

  // 표시할 게시글 (선택된 게시글이 있을 때만 표시)
  const displayPost = selectedPost;

  const handlePostClick = (post) => {
    // 클릭한 게시글을 선택 (나중에 API에서 상세 정보 가져오기)
    setSelectedPost({
      ...defaultPostDetail,
      id: post.id,
      title: post.title
    });
  };

  const handleBoardArrowClick = (boardName, e) => {
    // 이벤트 전파 방지
    e.stopPropagation();
    // 전체 게시판 목록 보기 모드로 전환
    setSelectedBoard(boardName);
  };

  const handleBoardClick = (boardName) => {
    // 게시판 제목 클릭 시 전체 게시판 목록 보기 모드로 전환
    setSelectedBoard(boardName);
  };

  const handleBackToMain = () => {
    // 메인 화면으로 돌아가기
    setSelectedBoard(null);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      // 댓글 추가 로직 (나중에 API 연동)
      console.log('댓글:', comment);
      setComment('');
    }
  };

  return (
    <div className="community">
      <div className="community-header">
        <h1 className="community-title">커뮤니티</h1>
        <p className="community-date">{getCurrentDate()}</p>
      </div>

      {/* 상단 탭 */}
      <div className="community-tabs">
        <button
          className={`community-tab ${selectedTab === '게시판' ? 'active' : ''}`}
          onClick={() => setSelectedTab('게시판')}
        >
          게시판
        </button>
        <button
          className={`community-tab ${selectedTab === '글쓰기' ? 'active' : ''}`}
          onClick={() => setSelectedTab('글쓰기')}
        >
          글쓰기
        </button>
      </div>

      {selectedTab === '게시판' ? (
        <>
          {selectedBoard ? (
            /* 선택된 게시판만 보기 */
            <>
              <div className="board-full-list-container">
                <div className="board-full-list-header">
                  <button className="back-button" onClick={handleBackToMain}>
                    <img src={arrowRightIcon} alt="뒤로가기" className="back-icon" />
                  </button>
                  <h2 className="board-full-list-title">{selectedBoard}</h2>
                </div>
                <div className="board-full-list">
                  {boardLists[selectedBoard].map((post) => (
                    <div 
                      key={post.id} 
                      className="board-item"
                      onClick={() => handlePostClick(post)}
                    >
                      <p className="board-item-title">{post.title}</p>
                      <p className="board-item-time">{post.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 오른쪽: 게시글 상세 (게시글 선택 시에만 표시) */}
              {displayPost && (
                <div className="post-detail-container">
                  <div className="post-header">
                    <div className="post-title-section">
                      <div className="post-title-row">
                        <h2 className="post-title">{displayPost.category} {displayPost.title}</h2>
                        <p className="post-date">{displayPost.date}</p>
                      </div>
                      <div className="post-stats">
                        <div className="post-stat-item">
                          <img src={eyeIcon} alt="조회" className="stat-icon" />
                          <span className="stat-value">{displayPost.views}</span>
                        </div>
                        <div className="post-stat-item">
                          <img src={commentIcon} alt="댓글" className="stat-icon" />
                          <span className="stat-value">{displayPost.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="post-content">
                    <p>{displayPost.content}</p>
                  </div>

                  {/* 댓글 섹션 */}
                  <div className="comments-section">
                    <div className="comments-header">
                      <h3 className="comments-title">댓글 {displayPost.comments}</h3>
                      <div className="comments-list">
                        {displayPost.commentsList.map((comment, index) => (
                          <div key={comment.id} className="comment-item">
                            <p className="comment-content">{comment.content}</p>
                            <div className="comment-meta">
                              <p className="comment-time">{comment.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 댓글 입력 */}
                    <div className="comment-input-container">
                      <input
                        type="text"
                        className="comment-input"
                        placeholder="댓글을 입력하세요"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                      />
                      <button 
                        className={`comment-send-btn ${comment ? 'active' : ''}`} 
                        onClick={handleCommentSubmit}
                      >
                        <CommentSendIcon />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* 왼쪽: 게시판 목록 */}
              <div className="board-list-container">
                {/* 분실물 게시판 */}
                <div className="board-section">
                  <div 
                    className="board-section-header"
                    onClick={() => handleBoardClick('분실물 게시판')}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3 className="board-section-title">분실물 게시판</h3>
                    <button 
                      className="board-arrow-btn"
                      onClick={(e) => handleBoardArrowClick('분실물 게시판', e)}
                    >
                      <img src={arrowRightIcon} alt="더보기" className="arrow-icon" />
                    </button>
                  </div>
                  <div className="board-items">
                    {boardLists['분실물 게시판'].slice(0, 5).map((post) => (
                      <div 
                        key={post.id} 
                        className="board-item"
                        onClick={() => handlePostClick(post)}
                      >
                        <p className="board-item-title">{post.title}</p>
                        <p className="board-item-time">{post.time}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 자유 게시판 */}
                <div className="board-section">
                  <div 
                    className="board-section-header"
                    onClick={() => handleBoardClick('자유 게시판')}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3 className="board-section-title">자유 게시판</h3>
                    <button 
                      className="board-arrow-btn"
                      onClick={(e) => handleBoardArrowClick('자유 게시판', e)}
                    >
                      <img src={arrowRightIcon} alt="더보기" className="arrow-icon" />
                    </button>
                  </div>
                  <div className="board-items">
                    {boardLists['자유 게시판'].slice(0, 5).map((post) => (
                      <div 
                        key={post.id} 
                        className="board-item"
                        onClick={() => handlePostClick(post)}
                      >
                        <p className="board-item-title">{post.title}</p>
                        <p className="board-item-time">{post.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 오른쪽: 게시글 상세 (게시글 선택 시에만 표시) */}
              {displayPost && (
              <div className="post-detail-container">
            <div className="post-header">
              <div className="post-title-section">
                <div className="post-title-row">
                  <h2 className="post-title">{displayPost.category} {displayPost.title}</h2>
                  <p className="post-date">{displayPost.date}</p>
                </div>
                <div className="post-stats">
                  <div className="post-stat-item">
                    <img src={eyeIcon} alt="조회" className="stat-icon" />
                    <span className="stat-value">{displayPost.views}</span>
                  </div>
                  <div className="post-stat-item">
                    <img src={commentIcon} alt="댓글" className="stat-icon" />
                    <span className="stat-value">{displayPost.comments}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="post-content">
              <p>{displayPost.content}</p>
            </div>

            {/* 댓글 섹션 */}
            <div className="comments-section">
              <div className="comments-header">
                <h3 className="comments-title">댓글 {displayPost.comments}</h3>
                <div className="comments-list">
                  {displayPost.commentsList.map((comment, index) => (
                    <div key={comment.id} className="comment-item">
                      <p className="comment-content">{comment.content}</p>
                      <div className="comment-meta">
                        <p className="comment-time">{comment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 댓글 입력 */}
              <div className="comment-input-container">
                <input
                  type="text"
                  className="comment-input"
                  placeholder="댓글을 입력하세요"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                />
                <button 
                  className={`comment-send-btn ${comment ? 'active' : ''}`} 
                  onClick={handleCommentSubmit}
                >
                  <CommentSendIcon />
                </button>
              </div>
            </div>
          </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="write-section">
          <div className="write-header">
            <div className="write-title-row">
              <h2 className="write-title">글쓰기</h2>
              <p className="write-date">{getCurrentDate()}</p>
            </div>
          </div>
          
          <div className="write-form">
            <div className="write-input-wrapper">
              <div className="write-input-container">
                <input
                  type="text"
                  className="write-input write-title-input"
                  placeholder="제목 (1~45자)"
                  value={writeTitle}
                  onChange={(e) => setWriteTitle(e.target.value)}
                  maxLength={45}
                />
                {writeTitle && (
                  <button 
                    className="write-clear-btn"
                    onClick={() => setWriteTitle('')}
                  >
                    <img src="/img/delete-icon.svg" alt="지우기" />
                  </button>
                )}
              </div>
              
              <div className="write-input-container write-content-container">
                <textarea
                  className="write-input write-content-input"
                  placeholder="내용 (1~500자)"
                  value={writeContent}
                  onChange={(e) => setWriteContent(e.target.value)}
                  maxLength={500}
                />
                {writeContent && (
                  <button 
                    className="write-clear-btn"
                    onClick={() => setWriteContent('')}
                  >
                    <img src="/img/delete-icon.svg" alt="지우기" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="write-buttons">
              <button className="write-cancel-btn" onClick={() => setSelectedTab('게시판')}>
                취소
              </button>
              <button className="write-submit-btn">
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Community;
