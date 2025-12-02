import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserInfoForm from './pages/UserInfoForm';
import Layout from './components/Layout/Layout';
import Main from './pages/main';
import Application from './pages/application';
import Community from './pages/community';
import Laundry from './pages/laundryResv';
import Profile from './pages/profiledetail';
import Notice from './pages/notice';
import Alarm from './pages/alarm';
import ProfileDetail from './pages/profiledetail';
import LaundryResv from './pages/laundryResv';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => { 
    const savedUser = localStorage.getItem('user');
    const userInfoComplete = localStorage.getItem('userInfoComplete');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserInfo(user);
      setIsLoggedIn(true);
      setIsNewUser(!userInfoComplete);
    }
  }, []);

  const handleLoginSuccess = (googleUserInfo) => {
    // Google 사용자 정보 저장
    localStorage.setItem('user', JSON.stringify(googleUserInfo));
    setUserInfo(googleUserInfo);
    setIsLoggedIn(true);
    
    // 사용자 정보가 이미 완료되었는지 확인
    const userInfoComplete = localStorage.getItem('userInfoComplete');
    setIsNewUser(!userInfoComplete);
  };

  const handleUserInfoSubmit = (formData) => {
    // 사용자 정보 저장
    const completeUserInfo = {
      ...userInfo,
      ...formData,
      infoComplete: true
    };
    
    localStorage.setItem('user', JSON.stringify(completeUserInfo));
    localStorage.setItem('userInfoComplete', 'true');
    setUserInfo(completeUserInfo);
    setIsNewUser(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userInfoComplete');
    localStorage.removeItem('googleAccessToken');
    setIsLoggedIn(false);
    setIsNewUser(false);
    setUserInfo(null);
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
                <Route path="laundry" element={<Laundry />} />
                <Route path="profile" element={<Profile userInfo={userInfo} />} />
                <Route path="notice" element={<Notice />} />
                <Route path="alarm" element={<Alarm />} />
              </Route>
              <Route path="/main" element={<Main />} />
              <Route path="/laundryResv" element={<LaundryResv />} />
              <Route path="/profiledetail" element={<ProfileDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
