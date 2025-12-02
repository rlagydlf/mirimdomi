import React from 'react';
// import { useGoogleLogin } from '@react-oauth/google'; // 제거
// import axios from 'axios'; // 제거
import './css/Login.css';
import { supabase } from '../supabaseClient'; // Supabase 클라이언트 가져오기

const imgDeviconGoogle = "/img/google-icon.svg";

// function Login({ onLoginSuccess }) { // onLoginSuccess 제거
function Login() { // 수정
  // const handleGoogleLogin = useGoogleLogin({ ... }); // 제거
  const handleGoogleLogin = async () => { // Supabase OAuth 로그인 시작 함수로 변경
    try {
      console.log('구글 로그인 시작...');
      console.log('현재 origin:', window.location.origin);
      console.log('리다이렉트 URL:', `${window.location.origin}/main`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/main`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Supabase Google OAuth 로그인 시작 실패:', error);
        console.error('에러 상세:', JSON.stringify(error, null, 2));
        alert('로그인 시작 중 오류가 발생했습니다: ' + error.message);
        return;
      }

      console.log('OAuth 리다이렉트 데이터:', data);
      
      // data.url이 있으면 리다이렉트가 시작됨
      if (data?.url) {
        console.log('Google OAuth 페이지로 리다이렉트합니다:', data.url);
        // Supabase가 자동으로 리다이렉트하지만, 명시적으로 처리할 수도 있음
      } else {
        console.warn('OAuth URL이 반환되지 않았습니다. Supabase 설정을 확인하세요.');
        alert('로그인 페이지로 이동할 수 없습니다. Supabase 설정을 확인해주세요.');
      }
    } catch (err) {
      console.error('handleGoogleLogin 함수 실행 중 예외 발생:', err);
      console.error('예외 상세:', JSON.stringify(err, null, 2));
      alert('로그인 시작 중 예상치 못한 오류가 발생했습니다: ' + (err.message || err.toString()));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-inner">
          <p className="login-title">미림도미</p>
          <button className="google-login-button" onClick={handleGoogleLogin}>
            <div className="google-icon">
              <img alt="Google" src={imgDeviconGoogle} />
            </div>
            <p className="google-login-text">구글 계정으로 로그인</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;