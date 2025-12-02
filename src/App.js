import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserInfoForm from './pages/UserInfoForm';
import Layout from './components/Layout/Layout';
import Main from './pages/main';
import Application from './pages/application';
import Community from './pages/community';
import Laundry from './pages/laundryResv';
import Profile from './pages/ProfileDetail';
import Notice from './pages/notice';
import Alarm from './pages/alarm';
import { supabase } from './supabaseClient'; // Supabase 클라이언트 임포트

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Supabase에서 사용자 프로필 정보 가져오기
  const fetchUserProfile = async (googleUserId) => {
    if (!googleUserId) {
      setUserInfo(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', googleUserId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116은 row not found, 새 사용자일 수 있음
        throw error;
      }

      if (data) {
        setUserInfo(data);
        setIsNewUser(!data.infoComplete); // 'infoComplete' 컬럼으로 새 사용자인지 판단
      } else {
        // Supabase에 정보가 없으면 새로운 사용자
        setUserInfo(prev => ({ ...prev, id: googleUserId })); // Google ID만 임시로 설정
        setIsNewUser(true);
      }
    } catch (error)
 {
      console.error('사용자 프로필 불러오기 실패:', error);
      // 에러 발생 시 로그인 상태를 유지하면서 사용자 정보 로드 실패 처리
    }
  };

  // 페이지 로드 시 로그인 상태 확인 및 사용자 정보 로드
  useEffect(() => {
    const googleAccessToken = localStorage.getItem('googleAccessToken');
    const googleUserId = localStorage.getItem('googleUserId'); // 로그인 시 저장했다고 가정

    if (googleAccessToken && googleUserId) {
      setIsLoggedIn(true);
      fetchUserProfile(googleUserId); // Supabase에서 최신 정보 가져오기
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  }, []);

  const handleLoginSuccess = async (googleUserInfo) => {
    // Google 사용자 정보 저장 (id와 access token)
    localStorage.setItem('googleAccessToken', googleUserInfo.accessToken);
    localStorage.setItem('googleUserId', googleUserInfo.id); // Google User ID 저장

    setIsLoggedIn(true);
    await fetchUserProfile(googleUserInfo.id); // 로그인 성공 후 Supabase에서 프로필 가져오기
  };

  const handleUserInfoSubmit = async (formData) => {
    if (!userInfo?.id) {
      alert("사용자 정보를 저장할 ID를 찾을 수 없습니다.");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          student_id: formData.studentId,
          room_number: formData.roomNumber,
          address: formData.address,
          infoComplete: true // 사용자 정보 입력 완료
        })
        .eq('id', userInfo.id);

      if (error) throw error;

      await fetchUserProfile(userInfo.id); // 업데이트 후 최신 정보 다시 가져오기
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      alert('사용자 정보 업데이트 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('googleAccessToken');
    localStorage.removeItem('googleUserId');
    // Supabase 세션도 초기화해야 한다면 여기에 추가
    // supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsNewUser(false);
    setUserInfo(null);
  };

  const handleUserProfileUpdate = async () => {
    // ProfileDetail 또는 UserInfoForm에서 업데이트가 완료되면 호출되어 최신 정보를 가져옴
    if (userInfo?.id) {
      await fetchUserProfile(userInfo.id);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : isNewUser ? (
            <>
              <Route path="/user-info" element={<UserInfoForm userInfo={userInfo} onSubmit={handleUserInfoSubmit} onCancel={() => handleLogout()} />} />
              <Route path="*" element={<Navigate to="/user-info" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Layout userInfo={userInfo} onLogout={handleLogout} />}>
                <Route index element={<Main userInfo={userInfo} />} />
                <Route path="application" element={<Application />} />
                <Route path="community" element={<Community />} />
                <Route path="laundry" element={<Laundry userInfo={userInfo} />} />
                <Route path="profile" element={<Profile userInfo={userInfo} onUserProfileUpdate={handleUserProfileUpdate} />} />
                <Route path="notice" element={<Notice />} />
                <Route path="alarm" element={<Alarm />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;