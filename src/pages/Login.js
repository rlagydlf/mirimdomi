import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './css/Login.css';
import { supabase } from '../supabaseClient'; // Supabase 클라이언트 가져오기

const imgDeviconGoogle = "/img/google-icon.svg";

function Login({ onLoginSuccess }) {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Google 사용자 정보 가져오기
        const userInfoResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = {
          id: userInfoResponse.data.sub,
          email: userInfoResponse.data.email,
          name: userInfoResponse.data.name,
          picture: userInfoResponse.data.picture,
        };

        console.log('로그인 성공:', userInfo);

        // Google 사용자 ID를 localStorage에 저장
        localStorage.setItem('googleUserId', userInfo.id);
        localStorage.setItem('googleAccessToken', tokenResponse.access_token); // App.js에서 필요

        // 부모 컴포넌트에 로그인 성공 알림 (App.js의 handleLoginSuccess가 fetchUserProfile을 호출할 것임)
        if (onLoginSuccess) {
          onLoginSuccess({
            id: userInfo.id,
            accessToken: tokenResponse.access_token,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
          });
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        alert('사용자 정보를 가져오는 중 오류가 발생했습니다.');
      }
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    },
  });

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

