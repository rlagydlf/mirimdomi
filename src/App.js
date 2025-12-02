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
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태 추가

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
        setIsNewUser(!data.infocomplete); // 'infocomplete' 컬럼으로 새 사용자인지 판단
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
    // OAuth 콜백 처리 (URL에 code나 hash가 있는 경우)
    const handleAuthCallback = async () => {
      console.log('OAuth 콜백 처리 시작...');
      console.log('현재 URL:', window.location.href);
      console.log('Hash:', window.location.hash);
      
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');
      
      if (error) {
        console.error('OAuth 에러:', error);
        console.error('에러 설명:', errorDescription);
        alert('로그인 중 오류가 발생했습니다: ' + (errorDescription || error));
        window.history.replaceState({}, document.title, '/login');
        setIsLoading(false);
        return;
      }

      if (accessToken || window.location.hash.includes('access_token') || window.location.hash.includes('code=')) {
        // OAuth 콜백이 있는 경우, 세션이 설정될 때까지 대기
        console.log('OAuth 콜백 감지, 세션 확인 중...');
        console.log('Access token 존재:', !!accessToken);
        
        // Supabase가 자동으로 세션을 처리하도록 함
        // URL에서 인증 정보는 유지 (Supabase가 처리함)
        
        // 세션이 설정될 때까지 최대 10초 대기
        let attempts = 0;
        const maxAttempts = 100; // 10초 (100ms * 100)
        
        const checkSession = async () => {
          try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
              console.error('세션 확인 오류:', sessionError);
              return false;
            }
            if (session) {
              console.log('OAuth 콜백 후 세션 확인됨:', session);
              console.log('사용자 정보:', session.user);
              // URL 정리
              window.history.replaceState({}, document.title, '/main');
              return true;
            }
            return false;
          } catch (err) {
            console.error('세션 확인 중 예외:', err);
            return false;
          }
        };

        while (attempts < maxAttempts) {
          if (await checkSession()) {
            console.log('세션 확인 완료');
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (attempts >= maxAttempts) {
          console.warn('세션 확인 시간 초과');
          // 마지막으로 한 번 더 확인
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            console.error('세션을 확인할 수 없습니다.');
            alert('로그인 세션을 확인할 수 없습니다. 다시 시도해주세요.');
            window.history.replaceState({}, document.title, '/login');
          }
        }
      } else {
        console.log('OAuth 콜백이 아닙니다. 일반 페이지 로드입니다.');
      }
    };

    handleAuthCallback();

    // Supabase 인증 상태 변경 리스너 추가
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Supabase Auth State Change Event:', event);
        console.log('Supabase Auth State Change Session:', session);

        if (session && session.user) {
          setIsLoggedIn(true);
          setIsLoading(false);
          
          // Supabase OAuth를 통해 로그인한 경우, Google 사용자 정보는 user metadata에 있음
          const googleUserId = session.user.user_metadata?.sub || 
                              session.user.user_metadata?.google_id || 
                              session.user.id;
          
          // Google 사용자 정보를 localStorage에 저장
          if (googleUserId && googleUserId !== session.user.id) {
            localStorage.setItem('googleUserId', googleUserId);
          } else if (!localStorage.getItem('googleUserId')) {
            // Supabase user ID를 사용 (users 테이블의 id가 Supabase UUID를 사용하는 경우)
            localStorage.setItem('googleUserId', session.user.id);
          }

          const googleUserIdFromStorage = localStorage.getItem('googleUserId');
          if (googleUserIdFromStorage) {
            await fetchUserProfile(googleUserIdFromStorage);
          } else {
            console.warn("Google User ID를 찾을 수 없습니다.");
            await fetchUserProfile(session.user.id);
          }
        } else {
          // 세션이 없으면 로그아웃 상태로 설정
          setIsLoggedIn(false);
          setUserInfo(null);
          setIsLoading(false);
          localStorage.removeItem('googleAccessToken');
          localStorage.removeItem('googleUserId');
        }
      }
    );

    // Initial check on mount
    const initialCheck = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('세션 확인 오류:', error);
          setIsLoading(false);
          return;
        }

        if (session && session.user) {
          setIsLoggedIn(true);
          
          // Google 사용자 ID 추출
          const googleUserId = session.user.user_metadata?.sub || 
                              session.user.user_metadata?.google_id || 
                              session.user.id;
          
          if (googleUserId && googleUserId !== session.user.id) {
            localStorage.setItem('googleUserId', googleUserId);
          } else if (!localStorage.getItem('googleUserId')) {
            localStorage.setItem('googleUserId', session.user.id);
          }

          const googleUserIdFromStorage = localStorage.getItem('googleUserId');
          if (googleUserIdFromStorage) {
            await fetchUserProfile(googleUserIdFromStorage);
          } else {
            await fetchUserProfile(session.user.id);
          }
        } else {
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } catch (error) {
        console.error('초기 세션 확인 중 오류:', error);
        setIsLoggedIn(false);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    // OAuth 콜백 처리가 완료된 후 초기 체크 실행
    setTimeout(() => {
      initialCheck();
    }, 500);


    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = async (googleUserInfo) => {
    // Google 사용자 정보 저장 (id와 access token)
    localStorage.setItem('googleAccessToken', googleUserInfo.accessToken);
    localStorage.setItem('googleUserId', googleUserInfo.id); // Google User ID 저장

    // Supabase에 Google OAuth로 로그인 시도
    const { data, error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        accessToken: googleUserInfo.accessToken, // access_token 사용
      },
    });

    if (signInError) {
      console.error('Supabase OAuth 로그인 실패:', signInError);
      alert('Supabase OAuth 로그인 중 오류가 발생했습니다: ' + signInError.message);
      return;
    }

    console.log('Supabase session after OAuth login:', await supabase.auth.getSession()); // Verify session after login

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
          infocomplete: true // 사용자 정보 입력 완료
        })
        .eq('id', userInfo.id);

      if (error) throw error;

      await fetchUserProfile(userInfo.id); // 업데이트 후 최신 정보 다시 가져오기
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      alert('사용자 정보 업데이트 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleLogout = async () => {
    // Supabase 세션 초기화
    await supabase.auth.signOut();
    localStorage.removeItem('googleAccessToken');
    localStorage.removeItem('googleUserId');
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

  // 로딩 중일 때는 아무것도 렌더링하지 않음
  if (isLoading) {
    return (
      <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path="/login" element={<Login />} />
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
                <Route index element={<Navigate to="/main" replace />} />
                <Route path="main" element={<Main userInfo={userInfo} />} />
                <Route path="application" element={<Application />} />
                <Route path="community" element={<Community userInfo={userInfo} />} />
                <Route path="laundry" element={<Laundry userInfo={userInfo} />} />
                <Route path="profile" element={<Profile userInfo={userInfo} onUserProfileUpdate={handleUserProfileUpdate} />} />
                <Route path="notice" element={<Notice />} />
                <Route path="alarm" element={<Alarm />} />
              </Route>
              <Route path="*" element={<Navigate to="/main" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;