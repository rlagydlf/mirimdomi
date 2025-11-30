import './css/ProfileDetail.css';
import FloatingBar from './components/FloatingBar';
import { Link } from 'react-router-dom';
import React, { useState, useRef } from 'react'; // useState와 useRef import

function ProfileDetail() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = today.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}.${month}.${day}`;

    const [profileImage, setProfileImage] = useState(process.env.PUBLIC_URL + '/img/default-profile.png'); // 기본 프로필 이미지
    const fileInputRef = useRef(null); // 파일 input에 대한 참조

    const [userInfo, setUserInfo] = useState({
        name: '송지아',
        studentId: '2608',
        roomNumber: '406호',
        bonusPoints: 4,
        penaltyPoints: 4,
    });

    const editIconPath = process.env.PUBLIC_URL + '/img/edit.svg';
    const plusIconPath = process.env.PUBLIC_URL + '/img/plus.svg';
    const minusIconPath = process.env.PUBLIC_URL + '/img/minus.svg';

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditIconClick = () => {
        fileInputRef.current.click(); // 숨겨진 파일 input 클릭 트리거
    };

    const handlePointChange = (field, amount) => {
        setUserInfo(prev => ({
            ...prev,
            [field]: Math.max(0, prev[field] + amount)
        }));
    };

    return (
        <div className="container">
            <FloatingBar />
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
                    <div className='name'>{userInfo.name}</div>
                </div>
                <div className='studentInfoBox'>
                    <div className='numberBox'>
                        <div className='numberText'>학번</div>
                        <div className='number'>{userInfo.studentId}</div>
                    </div>
                    <div className='roomBox'>
                        <div className='roomText'>호실</div>
                        <div className='roomNum'>{userInfo.roomNumber}</div>
                    </div>
                </div>
                <div className='pointBox'>
                    <div className='bonus'>
                        <div className='pointText'>상점</div>
                        <div className='bonusPlMa'>
                            <img src={minusIconPath} alt="minusImage" className="minusImage" onClick={() => handlePointChange('bonusPoints', -0.5)} />
                            <div className='bonusPoints'>{userInfo.bonusPoints}</div>
                            <img src={plusIconPath} alt="plusImage" className="plusImage" onClick={() => handlePointChange('bonusPoints', 0.5)} />

                        </div>
                    </div>
                    <div className='penalty'>
                        <div className='pointText'>벌점</div>
                        <div className='penaltyPlMa'>
                            <img src={minusIconPath} alt="minusImage" className="minusImage" onClick={() => handlePointChange('penaltyPoints', -0.5)} />
                            <div className='penaltyPoints'>{userInfo.penaltyPoints}</div>
                            <img src={plusIconPath} alt="plusImage" className="plusImage" onClick={() => handlePointChange('penaltyPoints', 0.5)} />

                        </div>
                    </div>
                    <div className='total'>
                        <div className='pointText'>총합</div>
                        <div className='totalPoints'>{userInfo.bonusPoints - userInfo.penaltyPoints}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileDetail;
