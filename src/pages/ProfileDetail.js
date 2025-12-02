
import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient'; // Supabase 클라이언트 임포트

import './css/profiledetail.css';

function ProfileDetail({ userInfo }) { // onUserInfoUpdate prop 제거
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}.${month}.${day}`;

  const [profileImage, setProfileImage] = useState(userInfo?.profile_image || process.env.PUBLIC_URL + '/img/default-profile.png');
  const fileInputRef = useRef(null);

  const editIconPath = process.env.PUBLIC_URL + '/img/edit.svg';
  const plusIconPath = process.env.PUBLIC_URL + '/img/plus.svg';
  const minusIconPath = process.env.PUBLIC_URL + '/img/minus.svg';

  const [points, setPoints] = useState({
    merits: userInfo?.merits || 0,
    demerits: userInfo?.demerits || 0,
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !userInfo?.id) {
      alert("파일을 선택하거나 사용자 ID를 찾을 수 없습니다.");
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userInfo.id}.${fileExt}`; // 사용자 ID를 파일명으로
    const filePath = `profile_images/${fileName}`; // 저장될 Storage 경로

    try {
      // 1. Supabase Storage에 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from('avatars') // 'avatars' 버킷 (또는 원하는 버킷명) 사용
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // 이미 파일이 있으면 덮어쓰기
        });

      if (uploadError) throw uploadError;

      // 2. 업로드된 파일의 공개 URL 가져오기
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // 3. users 테이블의 profile_image 컬럼 업데이트
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image: publicUrl })
        .eq('id', userInfo.id);

      if (updateError) throw updateError;

      setProfileImage(publicUrl); // 로컬 상태 업데이트
      alert("프로필 이미지가 성공적으로 업데이트되었습니다.");

    } catch (error) {
      console.error('프로필 이미지 업데이트 실패:', error);
      alert('프로필 이미지 업데이트 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleEditIconClick = () => {
    fileInputRef.current.click();
  };

  const handlePointChange = async (field, amount) => {
    if (!userInfo?.id) {
      alert("사용자 ID를 찾을 수 없어 포인트를 업데이트할 수 없습니다.");
      return;
    }

    const newAmount = Math.max(0, points[field] + amount); // 0 미만으로 내려가지 않도록
    const updatedPoints = {
      ...points,
      [field]: newAmount
    };

    setPoints(updatedPoints); // 로컬 상태 먼저 업데이트 (낙관적 업데이트)

    try {
      const { error } = await supabase
        .from('users')
        .update({ [field]: newAmount })
        .eq('id', userInfo.id);

      if (error) throw error;
      console.log(`${field}가 성공적으로 업데이트되었습니다.`);
    } catch (error) {
      console.error(`포인트 업데이트 실패 (${field}):`, error);
      alert(`포인트 업데이트 중 오류가 발생했습니다: ${error.message}`);
      setPoints(prev => ({ // 오류 발생 시 로컬 상태 롤백
        ...prev,
        [field]: prev[field] - amount
      }));
    }
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
              <img src={minusIconPath} alt="minusImage" className="minusImage" onClick={() => handlePointChange('merits', -0.5)} />
              <div className='bonusPoints'>{points.merits}</div>
              <img src={plusIconPath} alt="plusImage" className="plusImage" onClick={() => handlePointChange('merits', 0.5)} />
            </div>
          </div>
          <div className='penalty'>
            <div className='pointText'>벌점</div>
            <div className='penaltyPlMa'>
              <img src={minusIconPath} alt="minusImage" className="minusImage" onClick={() => handlePointChange('demerits', -0.5)} />
              <div className='penaltyPoints'>{points.demerits}</div>
              <img src={plusIconPath} alt="plusImage" className="plusImage" onClick={() => handlePointChange('demerits', 0.5)} />
            </div>
          </div>
          <div className='total'>
            <div className='pointText'>총합</div>
            <div className='totalPoints'>{points.merits - points.demerits}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetail;