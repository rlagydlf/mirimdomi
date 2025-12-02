import React, { useState, useRef, useEffect } from 'react';
import './css/profiledetail.css';

function ProfileDetail({ userInfo, onUserInfoUpdate }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}.${month}.${day}`;

  const [profileImage, setProfileImage] = useState(userInfo?.profileImage || process.env.PUBLIC_URL + '/img/default-profile.png');
  const fileInputRef = useRef(null);

  const editIconPath = process.env.PUBLIC_URL + '/img/edit.svg';
  const plusIconPath = process.env.PUBLIC_URL + '/img/plus.svg';
  const minusIconPath = process.env.PUBLIC_URL + '/img/minus.svg';

  const [points, setPoints] = useState({
    bonusPoints: userInfo?.bonusPoints || 0,
    penaltyPoints: userInfo?.penaltyPoints || 0,
  });

  // userInfo가 변경되면 points 업데이트
  useEffect(() => {
    setPoints({
      bonusPoints: userInfo?.bonusPoints || 0,
      penaltyPoints: userInfo?.penaltyPoints || 0,
    });
    setProfileImage(userInfo?.profileImage || process.env.PUBLIC_URL + '/img/default-profile.png');
  }, [userInfo]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        // localStorage에 저장
        const updatedUserInfo = {
          ...userInfo,
          profileImage: imageData
        };
        localStorage.setItem('user', JSON.stringify(updatedUserInfo));
        if (onUserInfoUpdate) {
          onUserInfoUpdate(updatedUserInfo);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditIconClick = () => {
    fileInputRef.current.click();
  };

  const handlePointChange = (field, amount) => {
    setPoints(prev => {
      const newPoints = {
        ...prev,
        [field]: Math.max(0, prev[field] + amount)
      };
      // localStorage에 저장
      const updatedUserInfo = {
        ...userInfo,
        bonusPoints: newPoints.bonusPoints,
        penaltyPoints: newPoints.penaltyPoints
      };
      localStorage.setItem('user', JSON.stringify(updatedUserInfo));
      if (onUserInfoUpdate) {
        onUserInfoUpdate(updatedUserInfo);
      }
      return newPoints;
    });
  };

  return (
    <div className="container">
      <div className="profile-header">
        <h1 className="profile-title">마이페이지</h1>
        <p className="profile-date">{formattedDate}</p>
      </div>

      <div className='whiteBox'>
        <div className='profileBox'>
          <img src={profileImage} alt="" className="profileImage" />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
        <div className="editIconContainer" onClick={handleEditIconClick}>
          <img src={editIconPath} alt="Edit" className="editIcon" />
        </div>
        <div className='nameBox'>
          <div className='nameText'>이름</div>
          <div className='name'>{userInfo?.name || '사용자'}</div>
        </div>
        <div className='studentInfoBox'>
          <div className='numberBox'>
            <div className='numberText'>학번</div>
            <div className='number'>{userInfo?.studentId || '학번 없음'}</div>
          </div>
          <div className='roomBox'>
            <div className='roomText'>호실</div>
            <div className='roomNum'>{userInfo?.roomNumber || '호실 없음'}</div>
          </div>
        </div>
        <div className='pointBox'>
          <div className='bonus'>
            <div className='pointText'>상점</div>
            <div className='bonusPlMa'>
              <img src={minusIconPath} alt="minusImage" className="minusImage" onClick={() => handlePointChange('bonusPoints', -0.5)} />
              <div className='bonusPoints'>{points.bonusPoints}</div>
              <img src={plusIconPath} alt="plusImage" className="plusImage" onClick={() => handlePointChange('bonusPoints', 0.5)} />
            </div>
          </div>
          <div className='penalty'>
            <div className='pointText'>벌점</div>
            <div className='penaltyPlMa'>
              <img src={minusIconPath} alt="minusImage" className="minusImage" onClick={() => handlePointChange('penaltyPoints', -0.5)} />
              <div className='penaltyPoints'>{points.penaltyPoints}</div>
              <img src={plusIconPath} alt="plusImage" className="plusImage" onClick={() => handlePointChange('penaltyPoints', 0.5)} />
            </div>
          </div>
          <div className='total'>
            <div className='pointText'>총합</div>
            <div className='totalPoints'>{points.bonusPoints - points.penaltyPoints}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetail;